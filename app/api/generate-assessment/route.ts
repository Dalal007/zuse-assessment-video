import { NextResponse } from "next/server";
import { getLlm } from "@/lib/langchain";
import { ROLEFIT_SYSTEM_PROMPT } from "@/lib/prompt";
import { AssessmentSchema } from "@/lib/schema";
import { RoleInput } from "@/types/assessment";

export async function POST(req: Request) {
  try {
    const input: RoleInput = await req.json();

    // Validate required fields
    if (!input.roleTitle || !input.seniority || !input.yearsExperience) {
      return NextResponse.json(
        { error: "Missing required fields: roleTitle, seniority, yearsExperience" },
        { status: 400 }
      );
    }

    // Build user prompt with role details
    const userPrompt = buildUserPrompt(input);

    const llm = getLlm();

    // Invoke LLM with structured prompt
    const response = await llm.invoke([
      { role: "system", content: ROLEFIT_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate a complete RoleFit Screening Assessment based on the following role details:\n\n${userPrompt}\n\nReturn valid JSON only.`,
      },
    ]);

    // Parse response
    let parsed;
    try {
      const content = response.content as string;
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1] || content);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Response content:", response.content);
      throw new Error("Failed to parse LLM response as JSON");
    }

    // Fix missing competencies - ensure all questions have at least one competency
    if (parsed.sections && Array.isArray(parsed.sections)) {
      parsed.sections = parsed.sections.map((section: any) => {
        if (section.questions && Array.isArray(section.questions)) {
          section.questions = section.questions.map((question: any) => {
            // Ensure secondTierCompetencies exists and has at least one item
            if (!question.secondTierCompetencies || !Array.isArray(question.secondTierCompetencies) || question.secondTierCompetencies.length === 0) {
              // Assign a default competency based on the section title
              const defaultCompetencies: Record<string, string[]> = {
                "Background and Experience": ["Problem solving and decision making"],
                "Technical or Role-Specific Skills": ["Quality, process and attention to detail"],
                "Soft Skills and Ways of Working": ["Collaboration in cross-functional squads"],
                "Culture and Values Alignment": ["Ownership and accountability"],
                "Motivation and Career Goals": ["Initiative and proactiveness"],
                "Practical Details and Deal Breakers": ["Remote or distributed work readiness"],
              };
              question.secondTierCompetencies = defaultCompetencies[section.title] || ["General competency"];
            }
            // Ensure competencies array has max 3 items
            if (question.secondTierCompetencies.length > 3) {
              question.secondTierCompetencies = question.secondTierCompetencies.slice(0, 3);
            }
            return question;
          });
        }
        return section;
      });
    }

    // Validate against schema
    const validated = AssessmentSchema.parse(parsed);

    return NextResponse.json(validated, { status: 200 });
  } catch (error: any) {
    console.error("Error generating assessment:", error);

    // If it's a validation error, return it with 400 status
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Invalid assessment structure",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // For other errors, return 500 with error message
    return NextResponse.json(
      {
        error: "Failed to generate assessment",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

function buildUserPrompt(input: RoleInput): string {
  const parts: string[] = [];

  parts.push(`Role Title: ${input.roleTitle}`);
  parts.push(`Seniority Level: ${input.seniority}`);
  parts.push(`Years of Experience Required: ${input.yearsExperience}`);

  if (input.team) parts.push(`Team: ${input.team}`);
  if (input.techStack && input.techStack.length > 0) {
    parts.push(`Tech Stack: ${input.techStack.join(", ")}`);
  }
  if (input.domainExpertise && input.domainExpertise.length > 0) {
    parts.push(`Domain Expertise: ${input.domainExpertise.join(", ")}`);
  }
  if (input.mustHaveSkills && input.mustHaveSkills.length > 0) {
    parts.push(`Must-Have Skills: ${input.mustHaveSkills.join(", ")}`);
  }
  if (input.niceToHaveSkills && input.niceToHaveSkills.length > 0) {
    parts.push(`Nice-to-Have Skills: ${input.niceToHaveSkills.join(", ")}`);
  }
  if (input.employmentType) parts.push(`Employment Type: ${input.employmentType}`);
  if (input.location) parts.push(`Location: ${input.location}`);
  if (input.workPattern) parts.push(`Work Pattern: ${input.workPattern}`);
  if (input.dealBreakers && input.dealBreakers.length > 0) {
    parts.push(`Deal Breakers: ${input.dealBreakers.join(", ")}`);
  }
  if (input.companyValues && input.companyValues.length > 0) {
    parts.push(`Company Values: ${input.companyValues.join(", ")}`);
  }
  if (input.cultureNotes) {
    parts.push(`Culture Notes: ${input.cultureNotes}`);
  }

  // Add instruction for leadership roles
  if (["Lead", "Manager", "Head"].includes(input.seniority)) {
    parts.push(
      "\nIMPORTANT: This is a leadership role. Include leadership, coaching, and ownership questions in the appropriate sections."
    );
  }

  return parts.join("\n");
}

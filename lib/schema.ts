import { z } from "zod";

export const QuestionSchema = z.object({
  questionText: z.string(),
  primaryCategory: z.string(),
  secondTierCompetencies: z.array(z.string()).min(1).max(3),
  signal: z.string(),
  maxAnswerTime: z.number(),
  scoringGuide: z.object({
    1: z.string(),
    2: z.string(),
    3: z.string(),
    4: z.string(),
    5: z.string(),
  }),
});

export const SectionSchema = z.object({
  title: z.string(),
  questions: z.array(QuestionSchema).min(2).max(5),
});

export const AssessmentSchema = z.object({
  sections: z.array(SectionSchema).length(6),
});

export interface ScoringGuide {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

export interface Question {
  questionText: string;
  primaryCategory: string;
  secondTierCompetencies: string[];
  signal: string;
  maxAnswerTime: number;
  scoringGuide: ScoringGuide;
}

export interface Section {
  title: string;
  questions: Question[];
}

export interface Assessment {
  sections: Section[];
}

export interface RoleInput {
  roleTitle: string;
  team?: string;
  seniority: "Junior" | "Mid" | "Senior" | "Lead" | "Manager" | "Head";
  yearsExperience: number;
  techStack?: string[];
  domainExpertise?: string[];
  mustHaveSkills?: string[];
  niceToHaveSkills?: string[];
  employmentType?: string;
  location?: string;
  workPattern?: string;
  dealBreakers?: string[];
  companyValues?: string[];
  cultureNotes?: string;
}

export interface QuestionResponse {
  questionId: string;
  videoUrl?: string;
  answerText?: string;
  score?: number;
  notes?: string;
}

export interface AssessmentSession {
  assessmentId: string;
  roleInput: RoleInput;
  assessment: Assessment;
  responses: QuestionResponse[];
  createdAt: Date;
  completedAt?: Date;
}


export interface PlanningProfile {
  name: string;
  college: string;
  interests: string;
}
export type PlanningStage = 'Researching' | 'Shortlisted' | 'Preparing' | 'Applied Elsewhere';
export interface SavedProgram {
  degree: string;
  notes: string;
  stage: PlanningStage;
  deadline: string;
  tasks: Record<string, boolean>;
}
export interface StudentPlan {
  schemaVersion: 2;
  profile: PlanningProfile;
  saved: Record<string, SavedProgram>;
}
export interface StoredPlan {
  plan: StudentPlan;
  revision: number;
}

export interface PlanningProfile {
  name: string;
  college: string;
  interests: string;
}
export type PlanningStage = 'Researching' | 'Shortlisted' | 'Preparing' | 'Applied Elsewhere';
export interface SavedProgram {
  notes: string;
  stage: PlanningStage;
  deadline: string;
  tasks: Record<string, boolean>;
}
export interface StudentPlan {
  profile: PlanningProfile;
  saved: Record<string, SavedProgram>;
}
export interface StoredPlan {
  plan: StudentPlan;
  revision: number;
}

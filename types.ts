
export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  date: string;
  duration?: string;
  link?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'assessment' | 'skill' | 'project' | 'course' | 'level' | 'badge';
  title: string;
  description: string;
  timestamp: number;
}

export interface UserAssessment {
  fullName: string;
  email: string;
  summary: string;
  education: string;
  skills: string[];
  interests: string[];
  experienceLevel: 'junior' | 'mid' | 'senior';
  currentRole?: string;
  projects: Project[];
  courses: Course[];
}

export interface CareerRecommendation {
  title: string;
  description: string;
  requiredSkills: string[];
  marketDemand: number; // 0-100
  avgSalaryRange: string;
  growthPotential: string;
}

export interface MarketData {
  sector: string;
  growth: number;
  openings: number;
  year: number;
}

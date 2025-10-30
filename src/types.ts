export interface menuItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}


export interface JobProps {
  id: string,              // Unique identifier (UUID or auto-increment)
  title: string,           // Job title (required)
  slug: string,            // URL-friendly unique identifier (required, unique)
  status: string,          // "active" | "archived"
  tags: Array<string>,     // Array of tag strings (e.g., ["Frontend", "Remote", "Senior"])
  order: number,           // For drag-and-drop ordering (lower = higher in list)
  description: string,     // Job description (optional, good to have)
  department: string,      // Department (optional, e.g., "Engineering", "Marketing")
  location: string,        // Location (optional, e.g., "Remote", "New York")
  createdAt: Date,         // Timestamp when job was created
  updatedAt: Date
  isArchived: boolean
}

export interface JobsResponse {
  jobs: JobProps[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobSelect: (jobId: string) => void;
  isDark: boolean;
}

export interface JobFilters {
  search?: string;
  status?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: string;

}

export interface CreateJobData {
  title: string;
  slug: string;
  status: string;
  tags: string[];
  order: number;
  description: string;
  department: string;
  location: string;
}

export interface UpdateJobData {
  title?: string;
  slug?: string;
  status?: string;
  tags?: string[];
  order?: number;
  description?: string;
  department?: string;
  location?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobSelect: (jobId: string) => void;
  isDark: boolean;
}

// types/index.ts
export interface JobFilters {
  search?: string;
  status?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: string;
  isArchived?: boolean;
  [key: string]: any;
}

export interface SortableJobCardProps {
  job: JobProps;
  isDark: boolean;
  gradientText: string;
  handleEditJob: (job: JobProps) => void;
  handleArchive: (id: string) => void;
}

export interface CandidateProps {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  stage: 'applied' | 'screening' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected'
  jobId: string
  appliedDate: string
  rating?: number
  tags: string[]
  resumeUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CandidatesResponse {
  candidates: CandidateProps[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface CandidateFilters {
  search?: string
  stage?: string
  jobId?: string
  tags?: string[]
  sort?: string
}

export interface CandidateStats {
  total: number
  byStage: {
    applied: number
    screening: number
    interview: number
    technical: number
    offer: number
    hired: number
    rejected: number
  }
  averageRating: number
}


// types/assessment.ts
export type QuestionType =
  | 'single-choice'
  | 'multi-choice'
  | 'short-text'
  | 'long-text'
  | 'numeric-range'
  | 'file-upload'

export interface Question {
  id: string
  type: QuestionType
  question: string
  description?: string
  required: boolean
  options?: string[] // For single/multi choice
  min?: number // For numeric range
  max?: number // For numeric range
  maxLength?: number // For text fields
  conditional?: {
    dependsOn: string // Question ID
    condition: string // Value that triggers this question
  }
}

export interface AssessmentSection {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export interface Assessment {
  id: string
  jobId: string
  title: string
  description: string
  sections: AssessmentSection[]
  createdAt: string
  updatedAt: string
}

export interface CandidateResponse {
  assessmentId: string
  candidateId: string
  responses: {
    [questionId: string]: string | string[] | number | File
  }
  submittedAt?: string
}
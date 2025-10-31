export interface menuItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}


export interface JobProps {
  id: string,             
  title: string,           
  slug: string,           
  status: string,         
  tags: Array<string>,     
  order: number,           
  description: string,     
  department: string,     
  location: string,       
  createdAt: Date,        
  updatedAt: Date
  isArchived?: boolean
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
  options?: string[]
  min?: number 
  max?: number 
  maxLength?: number 
  conditional?: {
    dependsOn: string 
    condition: string 
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


export interface AnimationProps {
  text: string;
  color: string;
  highlightWord?: string;
  highlightClass?: string;
}

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: JobFilters;
  onFiltersChange: (filters: Partial<JobFilters>) => void;
  onClearFilters: () => void;
  isDark: boolean;
  filterOptions: {
    statuses: string[];
    tags: string[];
  };
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface AssessmentBuilderProps {
  jobId: string
}

export interface JobsGridProps {
    jobs: JobProps[]
    isDark: boolean
    gradientText: string
    handleEditJob: (job: JobProps) => void
    handleArchive: (id: string) => void
    selectedJob: JobProps | null
    onReorder: (activeId: string, oldIndex: number, newIndex: number) => Promise<void>
    isLoading?: boolean
}
 
export interface SortableJobCardProps {
    job: JobProps
    isDark: boolean
    gradientText: string
    handleEditJob: (job: JobProps) => void
    handleArchive: (id: string) => void
    selectedJob: JobProps | null
}

export interface JobFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (jobData: CreateJobData | UpdateJobData) => Promise<void>
  isDark: boolean
  job?: JobProps | null
  mode: 'create' | 'edit'
}
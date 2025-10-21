// 人员基本接口
export interface Person {
  id: number;
  name: string;
  email?: string;
  roles?: string[]; // ['student', 'employee', 'mentor']
  gender?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  emergency_contact?: EmergencyContact;
  is_active: boolean;
  created_at: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// 学生档案接口
export interface StudentProfile {
  id: number;
  person_id: number;
  student_number?: string;
  education_level?: string;
  school?: string;
  major?: string;
  graduation_year?: number;
  language_proficiency?: LanguageProficiency;
  target_countries?: string[];
  target_schools?: TargetSchool[];
  academic_records?: AcademicRecord;
  study_preferences?: StudyPreference;
  notes?: string;
  created_at: string;
  updated_at: string;
  // 关联人员信息
  person?: Person;
}

export interface LanguageProficiency {
  english?: {
    test: 'IELTS' | 'TOEFL' | 'DUOLINGO' | 'OTHER';
    score: number;
    test_date?: string;
  };
  other?: {
    language: string;
    level: string;
    certification?: string;
  }[];
}

export interface TargetSchool {
  name: string;
  country: string;
  program: string;
  chances?: 'high' | 'medium' | 'low';
}

export interface AcademicRecord {
  gpa?: number;
  scale?: number;
  transcripts?: string[];
  certificates?: string[];
}

export interface StudyPreference {
  learning_style?: string[];
  ideal_class_size?: string;
  preferred_teaching_method?: string[];
}

// 员工档案接口
export interface EmployeeProfile {
  id: number;
  person_id: number;
  employee_id?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  salary_info?: SalaryInfo;
  reporting_to?: number;
  created_at: string;
  updated_at: string;
  // 关联信息
  person?: Person;
  manager?: EmployeeProfile;
}

export interface SalaryInfo {
  base_salary: number;
  bonus_structure?: string;
  last_review_date?: string;
}


// 导师档案接口
export interface MentorProfile {
  id: number;
  person_id: number;
  specializations?: string[];
  qualification?: string;
  expertise_level?: string;
  availability?: Availability;
  hourly_rate?: number;
  bio?: string;
  created_at: string;
  updated_at: string;
  // 关联信息
  person?: Person;
}

export interface Availability {
  weekdays?: WeekdayAvailability[];
  weekends?: boolean;
  note?: string;
}

export interface WeekdayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  start_time: string;
  end_time: string;
}

// 学生服务接口
export interface StudentService {
  id: number;
  student_id?: number; // 兼容旧版
  student_ref_id: number; // 新版引用字段
  service_type_id: number;
  mentor_id?: number; // 兼容旧版
  mentor_ref_id?: number; // 新版引用字段
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  enrollment_date: string;
  end_date?: string;
  progress?: number;
  payment_status?: string;
  detail_data?: ServiceDetail;
  created_at: string;
  updated_at: string;
  // 关联信息
  student?: any; // 使用any兼容新旧结构
  service_type?: any; // 使用finance模块中的ServiceType
  mentor?: any; // 使用any兼容新旧结构
}

export interface ServiceDetail {
  target_schools?: string[];
  application_deadline?: string;
  materials_status?: { [key: string]: boolean };
  special_requirements?: string;
}

// 服务进度接口
export interface ServiceProgress {
  id: number;
  student_service_id: number;
  recorded_by?: number;
  progress_date: string;
  milestone?: string;
  description?: string;
  completed_items?: { [key: string]: boolean };
  next_steps?: NextStep[];
  notes?: string;
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
  // 关联信息
  service?: StudentService;
  recorder?: EmployeeProfile;
}

export interface NextStep {
  action: string;
  due_date?: string;
  assigned_to?: number;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size?: number;
} 
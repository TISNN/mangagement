/**
 * 申请进度管理 - TypeScript类型定义
 * 对应Supabase数据库表结构
 */

// ==================== 学生申请档案 ====================
export interface StudentProfile {
  id: number;
  student_id: number;
  
  // 基本信息
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  phone_number?: string;
  application_email?: string;
  passport_number?: string;
  current_address?: string;
  
  // 本科教育背景
  undergraduate_degree?: string;
  undergraduate_school?: string;
  undergraduate_major?: string;
  undergraduate_gpa?: number;
  undergraduate_score?: number;
  undergraduate_start_date?: string;
  undergraduate_end_date?: string;
  undergraduate_core_courses?: string[];
  undergraduate_scholarships?: string[];
  
  // 硕士教育背景
  graduate_degree?: string;
  graduate_school?: string;
  graduate_major?: string;
  graduate_gpa?: number;
  graduate_score?: number;
  graduate_start_date?: string;
  graduate_end_date?: string;
  graduate_core_courses?: string[];
  graduate_scholarships?: string[];
  
  // 标化成绩
  standardized_tests?: StandardizedTest[];
  
  // 文书材料
  document_files?: DocumentFile[];
  
  // 实习/工作经历
  work_experiences?: WorkExperience[];
  
  created_at?: string;
  updated_at?: string;
}

export interface DocumentFile {
  name: string;
  url: string;
  type: string;
  upload_date: string;
  size?: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  description?: string;
  achievements?: string[];
  is_current?: boolean;
}

// 标化考试类型
export type TestType = 
  | 'IELTS'
  | 'TOEFL'
  | 'GRE'
  | 'GMAT'
  | 'CET4'
  | 'CET6'
  | 'OTHER';

export interface StandardizedTest {
  test_type: TestType;
  test_date?: string;
  
  // 总分
  total_score?: number;
  
  // IELTS/TOEFL 小分
  listening_score?: number;
  reading_score?: number;
  writing_score?: number;
  speaking_score?: number;
  
  // GRE 分数
  verbal_score?: number;
  quantitative_score?: number;
  analytical_writing_score?: number;
  
  // 账号密码 (可选)
  has_account?: boolean;
  account?: string;
  password?: string;
  
  // 其他类型的考试名称
  other_test_name?: string;
}

// ==================== 学生会议 ====================
export interface StudentMeeting {
  id: number;
  student_id: number;
  title: string;
  summary?: string;
  start_time: string;
  end_time?: string;
  participants?: string[];
  meeting_documents?: MeetingDocument[];
  meeting_notes?: string;
  meeting_type?: string; // 初次咨询、选校讨论、文书指导、日常进度沟通等
  status?: string; // 已安排、进行中、已完成、已取消
  meeting_link?: string; // 会议链接
  created_at?: string;
  updated_at?: string;
}

export interface MeetingDocument {
  name: string;
  url: string;
  upload_date: string;
}

// ==================== 最终选校列表 ====================
export interface FinalUniversityChoice {
  id: number;
  student_id: number;
  school_name: string;
  program_name: string;
  program_level?: string; // 本科、硕士、博士
  application_deadline?: string;
  application_round?: string; // ED、EA、RD、Rolling
  
  // 申请账号
  application_account?: string;
  application_password?: string;
  
  // 投递状态
  submission_status?: string; // 未投递、已投递、审核中、已录取、已拒绝、Waitlist
  submission_date?: string;
  decision_date?: string;
  decision_result?: string;
  
  // 额外信息
  application_type?: string; // 冲刺院校、目标院校、保底院校
  priority_rank?: number;
  notes?: string;
  
  created_at?: string;
  updated_at?: string;
}

// ==================== 申请材料清单 ====================
export interface ApplicationDocument {
  id: number;
  student_id: number;
  university_choice_id?: number;
  document_name: string;
  document_type?: string; // 成绩单、推荐信、个人陈述、简历
  is_required?: boolean;
  status?: string; // 未完成、进行中、已完成、已提交
  progress?: number; // 0-100
  due_date?: string;
  completed_date?: string;
  file_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ==================== 申请进度概览 ====================
export interface ApplicationOverview {
  student_id: number;
  student_name: string;
  student_avatar?: string;
  total_applications: number;
  submitted_applications: number;
  accepted_applications: number;
  pending_applications: number;
  overall_progress: number;
  next_deadline?: string;
  mentor_name?: string;
  mentor_id?: number;
  latest_meeting?: StudentMeeting;
  urgent_tasks?: ApplicationDocument[];
}

// ==================== 申请阶段 ====================
export type ApplicationStage = 
  | 'evaluation'      // 背景评估
  | 'schoolSelection' // 选校规划
  | 'preparation'     // 材料准备
  | 'submission'      // 提交申请
  | 'interview'       // 面试阶段
  | 'decision'        // 录取决定
  | 'visa';           // 签证办理

export interface StageInfo {
  id: ApplicationStage;
  name: string;
  icon: string;
  description?: string;
}

// ==================== 筛选和排序 ====================
export interface ApplicationFilters {
  searchQuery?: string;
  status?: string;
  programLevel?: string; // 本科、硕士、博士
  region?: string;
  urgent?: boolean;
  mentor?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface ApplicationSortConfig {
  field: 'deadline' | 'progress' | 'student_name' | 'created_at';
  direction: 'asc' | 'desc';
}

// ==================== 统计数据 ====================
export interface ApplicationStats {
  total: number;
  urgent: number;
  completed: number;
  pending: number;
  accepted: number;
  completion_rate: number;
}

// ==================== 表单数据类型 ====================
export interface StudentProfileForm extends Omit<StudentProfile, 'id' | 'created_at' | 'updated_at'> {}
export interface StudentMeetingForm extends Omit<StudentMeeting, 'id' | 'created_at' | 'updated_at'> {}
export interface UniversityChoiceForm extends Omit<FinalUniversityChoice, 'id' | 'created_at' | 'updated_at'> {}
export interface ApplicationDocumentForm extends Omit<ApplicationDocument, 'id' | 'created_at' | 'updated_at'> {}


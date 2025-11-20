/**
 * 学校库类型定义
 */

// 数据库学校接口
export interface DatabaseSchool {
  id: string;
  cn_name: string;
  en_name?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  ranking?: number;
  description?: string;
  qs_rank_2025?: number;
  qs_rank_2024?: number;
  region?: string;
  is_verified?: boolean;
  tags?: string[] | string | Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// 课程信息接口
export interface CourseInfo {
  name: string;
  name_cn?: string;
  credits?: number;
  description?: string;
  learning_outcomes?: string[];
}

// 体验式学习信息接口
export interface ExperientialLearningInfo {
  type: 'capstone' | 'internship' | 'research' | 'other';
  name: string;
  credits?: number;
  description?: string;
}

// 申请时间线事件接口
export interface ApplicationTimelineEvent {
  event_name: string;
  event_date: string; // ISO date string
  description?: string;
  is_scholarship_deadline?: boolean;
}

// 申请材料接口
export interface ApplicationMaterial {
  name: string;
  name_en?: string;
  is_required: boolean;
  description?: string;
  format_requirements?: string;
}

// 专业接口
export interface Program {
  id: string;
  school_id: string;
  cn_name?: string;
  en_name: string;
  name?: string;
  degree: string;
  duration: string;
  tuition_fee: string;
  faculty: string;
  category: string;
  subCategory: string;
  tags?: string[];
  apply_requirements: string;
  language_requirements: string;
  curriculum: string;
  analysis: string;
  url: string;
  interview: string;
  objectives: string;
  rawData?: Record<string, unknown>;
  
  // 新增字段 - 基础信息扩展
  credit_requirements?: string; // 学分要求
  teaching_mode?: string; // 授课方式
  study_mode?: string; // 学习模式（全日制/兼职）
  program_positioning?: string; // 项目定位
  
  // JSONB结构化字段
  course_structure?: {
    preparatory_courses?: CourseInfo[]; // 入学前预备课
    core_courses?: CourseInfo[]; // 核心课程
    elective_courses?: CourseInfo[]; // 选修课程
    experiential_learning?: ExperientialLearningInfo[]; // 体验式学习
  };
  
  application_timeline?: ApplicationTimelineEvent[]; // 申请时间线
  application_materials?: ApplicationMaterial[]; // 申请材料清单
  career_info?: {
    industries?: string[]; // 就业行业
    job_titles?: string[]; // 典型岗位
    employment_rate?: number; // 就业率
    avg_salary?: string; // 平均薪资
  };
  program_features?: string[]; // 项目特色
  interview_guide?: {
    common_questions?: string[]; // 常见问题
    preparation_tips?: string; // 准备建议
  };
  application_guide?: {
    resume_tips?: string; // 简历要点
    ps_tips?: string; // PS写作要点
  };
}

// 前端使用的学校接口
export interface School {
  id: string;
  name: string;
  location: string;
  country?: string;
  region?: string;
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
  logoUrl?: string;
  tags?: string[];
  rawData?: DatabaseSchool;
}

// 学校筛选条件
export interface SchoolFilters {
  region: string;
  country: string;
  rankingRange: [number, number];
  searchQuery: string;
}

// 学校排序配置
export interface SchoolSortConfig {
  field: 'ranking' | 'acceptance' | 'tuition';
  direction: 'asc' | 'desc';
}


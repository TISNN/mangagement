/**
 * 案例相关类型定义
 */

// 匹配数据库的success_cases表结构
export interface CaseStudy {
  id: string; // uuid in database
  student_name: string;
  school?: string; // 学校名称
  applied_program?: string; // 申请专业
  program_id?: string; // 关联到programs表的uuid
  admission_year?: number; // 录取年份
  // 本科背景
  bachelor_university?: string; // 本科院校
  bachelor_major?: string; // 本科专业
  // 硕士背景（可选）
  master_school?: string;
  master_major?: string;
  master_gpa?: string;
  // 成绩
  gpa?: string; // GPA成绩
  language_scores?: string; // 语言成绩
  experiecnce?: string; // 经历（注意：数据库中拼写错误）
  // 其他信息
  region?: string; // 地区（前端添加的辅助字段）
  admission_result?: 'accepted' | 'rejected' | 'waiting' | 'withdrawn'; // 录取结果（前端添加）
  offer_type?: string; // 录取类型（前端添加）
  scholarship?: string; // 奖学金（前端添加）
  notes?: string; // 备注（前端添加）
  created_at?: string;
  updated_at?: string;
}

export interface CaseStudyFilters {
  search: string;
  region: string;
  school: string;
  major_type: string;
  admission_result: string;
}

export type ViewMode = 'grid' | 'list' | 'table';


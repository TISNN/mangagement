/**
 * 会议管理相关类型定义
 */

// ==================== 会议类型 ====================

export interface Meeting {
  id: number;
  title: string;
  meeting_type: MeetingType;
  status: MeetingStatus;
  start_time: string;
  end_time?: string;
  location?: string;
  meeting_link?: string;
  
  // 参会人
  participants: Participant[];
  
  // 会议内容
  agenda?: string; // 会议议程
  minutes?: string; // 会议纪要 (使用 Tiptap HTML)
  summary?: string; // 会议总结
  
  // 关联文档
  attachments?: MeetingAttachment[];
  
  // 元数据
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export type MeetingType = 
  | '初次咨询'
  | '选校讨论'
  | '文书指导'
  | '面试辅导'
  | '签证指导'
  | '行前准备'
  | '日常进度沟通'
  | '团队例会'
  | '客户沟通'
  | '项目评审'
  | '培训会议'
  | '其他';

export type MeetingStatus = 
  | '待举行'
  | '进行中'
  | '已完成'
  | '已取消'
  | '延期';

export interface Participant {
  id: string;
  name: string;
  type: 'mentor' | 'student' | 'employee' | 'other';
  avatar?: string;
  email?: string;
  role?: string; // 在会议中的角色: 主持人、记录员、参与者等
  mentor_id?: number; // 如果是导师
  student_id?: number; // 如果是学生
  employee_id?: number; // 如果是员工
}

export interface MeetingAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

// ==================== 表单类型 ====================

export interface MeetingFormData {
  title: string;
  meeting_type: MeetingType;
  status: MeetingStatus;
  start_time: string;
  end_time?: string;
  location?: string;
  meeting_link?: string;
  participants: Participant[];
  agenda?: string;
  minutes?: string;
  summary?: string;
  attachments?: MeetingAttachment[];
}

export interface MeetingFilter {
  search: string;
  meeting_type: MeetingType | 'all';
  status: MeetingStatus | 'all';
  date_range: {
    start?: string;
    end?: string;
  };
  participant_id?: number;
}

export interface MeetingSortConfig {
  field: 'start_time' | 'created_at' | 'title';
  direction: 'asc' | 'desc';
}

// ==================== 统计类型 ====================

export interface MeetingStats {
  total: number;
  upcoming: number; // 待举行
  ongoing: number; // 进行中
  completed: number; // 已完成
  cancelled: number; // 已取消
  this_week: number; // 本周会议数
  this_month: number; // 本月会议数
}

// ==================== 数据库类型 ====================

export interface MeetingDB {
  id: number;
  title: string;
  meeting_type: string;
  status: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  meeting_link: string | null;
  participants: any; // JSONB
  agenda: string | null;
  minutes: string | null;
  summary: string | null;
  attachments: any | null; // JSONB
  created_by: number;
  created_at: string;
  updated_at: string;
}

// ==================== 导出类型 ====================

export interface MeetingListItem {
  id: number;
  title: string;
  meeting_type: MeetingType;
  status: MeetingStatus;
  start_time: string;
  end_time?: string;
  participants: Participant[];
  created_by_name?: string;
}





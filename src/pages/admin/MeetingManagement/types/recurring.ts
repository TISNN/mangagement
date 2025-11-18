/**
 * 定期会议相关类型定义
 */

// ==================== 重复频率类型 ====================

export type RecurringFrequency = 
  | 'daily'      // 每天
  | 'weekly'     // 每周
  | 'biweekly'   // 每两周
  | 'monthly';   // 每月

// ==================== 结束条件类型 ====================

export type RecurringEndType = 
  | 'never'              // 永不结束
  | 'after_occurrences'  // 结束于N次后
  | 'on_date';           // 结束于指定日期

// ==================== 定期会议模板 ====================

export interface RecurringMeetingTemplate {
  id: number;
  title: string;
  meeting_type: string;
  
  // 重复规则
  frequency: RecurringFrequency;
  interval_value: number;        // 间隔值（如每2周、每3个月）
  day_of_week: number[];         // 星期几 [0=周日, 1=周一, ..., 6=周六]
  day_of_month?: number;         // 每月第几天（1-31）
  week_of_month?: number;        // 每月第几周（1-4, -1=最后一周）
  
  // 时间设置
  start_time: string;            // 会议开始时间（HH:mm:ss格式）
  duration_minutes: number;      // 会议时长（分钟）
  
  // 结束条件
  end_type: RecurringEndType;
  end_after_occurrences?: number; // 结束于N次后
  end_on_date?: string;          // 结束于指定日期（YYYY-MM-DD）
  
  // 会议基本信息
  location?: string;
  meeting_link?: string;
  agenda?: string;
  participants: any[];            // JSONB数组
  
  // 关联
  student_id?: number;           // 关联学生（可选）
  created_by: number;
  
  // 元数据
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== 定期会议模板表单数据 ====================

export interface RecurringMeetingTemplateFormData {
  title: string;
  meeting_type: string;
  
  // 重复规则
  frequency: RecurringFrequency;
  interval_value: number;
  day_of_week: number[];
  day_of_month?: number;
  week_of_month?: number;
  
  // 时间设置
  start_time: string;            // 格式: HH:mm
  duration_minutes: number;
  
  // 结束条件
  end_type: RecurringEndType;
  end_after_occurrences?: number;
  end_on_date?: string;
  
  // 会议基本信息
  location?: string;
  meeting_link?: string;
  agenda?: string;
  participants: any[];
  
  // 关联
  student_id?: number | null;
}

// ==================== 定期会议实例 ====================

export interface RecurringMeetingInstance {
  id: number;
  template_id: number;
  meeting_id: number;
  instance_date: string;         // 该实例的日期（YYYY-MM-DD）
  is_cancelled: boolean;
  created_at: string;
}

// ==================== 辅助类型 ====================

export interface RecurringMeetingTemplateWithInstances extends RecurringMeetingTemplate {
  instances?: RecurringMeetingInstance[];
  generated_count?: number;      // 已生成的实例数量
  upcoming_count?: number;        // 即将到来的实例数量
}


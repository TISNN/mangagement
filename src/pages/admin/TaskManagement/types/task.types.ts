/**
 * 任务管理相关类型定义
 */

// UI任务类型 (用于前端展示)
export interface UITask {
  id: string;
  title: string;
  description: string;
  assignees: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
  startDate: string; // 开始日期 (从start_date字段映射)
  dueDate: string;   // 截止日期
  priority: '低' | '中' | '高';
  status: '待处理' | '进行中' | '已完成' | '已取消';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // 关联学生
  relatedStudent?: {
    id: string;
    name: string;
    avatar: string | null;
    status?: string;
    is_active?: boolean;
  } | null;
  // 为了向后兼容，保留单个assignee属性，指向第一个负责人
  assignee?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  } | null;
}

// 任务表单数据类型
export interface TaskFormData {
  title: string;
  description: string;
  assignee_id: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string;
}

// 任务筛选条件类型
export interface TaskFilters {
  search: string;
  status: string | null;
  priority: string | null;
  assignee: string | null;
  student: string | null; // 新增：学生筛选
  tag: string | null;
  timeView: 'all' | 'today' | 'tomorrow' | 'week' | 'expired';
}

// 视图模式类型
export type ViewMode = 'list' | 'day' | 'week' | 'month';

// 员工类型
export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department?: string;
}

// 学生类型
export interface Student {
  id: number;
  name: string;
  avatar_url?: string;
  email?: string;
}


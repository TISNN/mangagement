// Dashboard 数据类型定义

/**
 * 统计数据类型
 */
export interface DashboardStats {
  activeStudents: number;
  activeStudentsChange: string;
  monthlyLeads: number;
  monthlyLeadsChange: string;
  monthlySignups: number;
  monthlySignupsChange: string;
  monthlyRevenue: number;
  monthlyRevenueChange: string;
}

/**
 * 任务类型
 */
export interface DashboardTask {
  id: number;
  title: string;
  deadline?: string;
  type: 'urgent' | 'normal' | 'message';
  icon: string;
  completed: boolean;
  count?: number;
  taskId?: number; // 关联到tasks表的ID
}

/**
 * 动态活动类型
 */
export interface DashboardActivity {
  id: number;
  user: string;
  action: string;
  content: string;
  time: string;
  avatar: string | null;
  type: 'student' | 'employee' | 'system';
}

/**
 * 日程事件类型
 */
export interface DashboardEvent {
  id: number;
  date: string;
  time: string;
  title: string;
  type: 'meeting' | 'deadline' | 'event';
  color: 'blue' | 'red' | 'green' | 'purple' | 'orange';
  description?: string;
  link?: string;
}

/**
 * 快捷操作类型
 */
export interface QuickAction {
  title: string;
  icon: any;
  color: 'blue' | 'purple' | 'orange' | 'green';
  onClick: () => void;
  description?: string;
}

/**
 * 用户信息类型
 */
export interface CurrentUser {
  id: number;
  name: string;
  position?: string;
  email?: string;
  avatar_url?: string;
  department?: string;
}


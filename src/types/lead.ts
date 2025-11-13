// 线索状态类型
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';

// 线索优先级类型
export type LeadPriority = 'high' | 'medium' | 'low';

// 线索来源类型
export type LeadSource = '官网表单' | '社交媒体' | '转介绍' | '合作方' | '电话咨询' | '其他';

// 线索数据库接口（与数据库字段完全匹配）
export interface LeadDB {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource | string;
  status: LeadStatus;
  date: string; // 接入日期
  avatar_url: string;
  last_contact: string;
  interest: number | null;
  assigned_to: number | null;
  notes: string;
  priority: LeadPriority;
  campaign?: string | null;
  next_action?: string | null;
  tags?: string[] | null;
  risk_level?: string | null;
  created_at?: string;
  updated_at?: string;
  gender?: string; // 性别
}

// 线索前端接口（用于展示）
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource | string;
  status: LeadStatus;
  date: string; // 接入日期
  avatar: string;
  lastContact: string;
  interest: string;
  assignedTo: string;
  notes: string;
  priority: LeadPriority;
  campaign?: string;
  nextAction?: string;
  tags?: string[];
  riskLevel?: string;
  createdAt?: string;
  updatedAt?: string;
  gender?: string; // 性别
}

// 创建线索的表单接口
export interface LeadForm {
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource | string;
  interest?: string;
  assignedTo?: string;
  notes?: string;
  priority: LeadPriority;
  campaign?: string;
  nextAction?: string;
  tags?: string[];
  riskLevel?: string;
  gender?: string; // 性别
  date?: string; // 接入日期
}

// 线索筛选条件接口
export interface LeadFilter {
  searchQuery?: string;
  source?: LeadSource | string;
  status?: LeadStatus;
  startDate?: string;
  endDate?: string;
  consultant?: string;
  interest?: string;
  priority?: LeadPriority | 'all';
  gender?: string; // 性别筛选
}

// 线索统计类型
export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  closed: number;
  highPriority: number;
} 
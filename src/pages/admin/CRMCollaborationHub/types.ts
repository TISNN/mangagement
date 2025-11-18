/**
 * 协同空间模块 - 类型定义
 */

export interface GoalMetric {
  id: string;
  label: string;
  target: string;
  progress: number;
  forecast: string;
  trend: string;
  trendType: 'up' | 'down' | 'stable';
}

export interface PersonalKPI {
  id: string;
  name: string;
  role: string;
  avatar: string;
  metrics: Array<{ label: string; value: string; target: string; trend: string }>;
  badge?: 'top' | 'rising';
}

export interface FeedItem {
  id: string;
  type: 'announcement' | 'system' | 'commentary';
  author: string;
  avatar: string;
  time: string;
  visibility: 'team' | 'org';
  tags: string[];
  title: string;
  content: string;
  attachments?: string[];
  comments?: number;
  likes?: number;
}

export interface CollaborationTask {
  id: string;
  title: string;
  department: string;
  requester: string;
  assignee: string;
  due: string;
  sla: string;
  status: '待处理' | '进行中' | '已完成';
  priority: '高' | '中' | '低';
  history: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  owner: string;
  version: string;
  usage: { views: number; rating: number; favorites: number };
  tags: string[];
}

export interface TrainingEvent {
  id: string;
  title: string;
  type: string;
  start: string;
  end: string;
  location: string;
  host: string;
  status: '报名中' | '已满' | '回放';
  focus: string;
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  content: string;
  icon: string;
}

export type TabKey = 'overview' | 'goals' | 'feed' | 'tasks' | 'knowledge' | 'training';


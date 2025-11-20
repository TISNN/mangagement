/**
 * 文书老师工作区 - 类型定义
 */

// 文档类型
export type DocumentType = 'PS' | 'Essay' | 'CV' | 'RL' | 'SOP' | 'Other';

// 文档状态
export type DocumentStatus = 'draft' | 'writing' | 'review' | 'revision' | 'finalized' | 'archived';

// 文档接口
export interface Document {
  id: number;
  student_id: number;
  project_id?: number;
  document_type: DocumentType;
  title: string;
  content: string;
  status: DocumentStatus;
  word_count: number;
  deadline?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string;
  is_favorite: boolean;
  unread_comments_count?: number;
}

// 文档版本接口
export interface DocumentVersion {
  id: number;
  document_id: number;
  version_number: number;
  content: string;
  word_count: number;
  change_summary?: string;
  created_by: number;
  created_by_name?: string;
  created_at: string;
}

// 文档评论接口
export interface DocumentComment {
  id: number;
  document_id: number;
  version_id?: number;
  parent_comment_id?: number;
  content: string;
  selected_text?: string;
  start_position?: number;
  end_position?: number;
  mentioned_user_ids?: number[];
  status: 'open' | 'resolved' | 'closed';
  created_by: number;
  created_by_name?: string;
  created_by_avatar?: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: number;
  replies?: DocumentComment[];
}

// 学生信息接口（简化版）
export interface StudentInfo {
  id: number;
  name: string;
  avatar?: string;
  service_type?: string;
  current_stage?: string;
  mentors?: string[];
  risk_alerts?: string[];
}

// 模板接口
export interface DocumentTemplate {
  id: number;
  name: string;
  document_type: DocumentType;
  category?: string;
  content: string;
  description?: string;
  tags?: string[];
  usage_count: number;
  is_public: boolean;
  created_by?: number;
  created_at: string;
}

// 会议记录接口（简化版）
export interface MeetingRecord {
  id: number;
  student_id: number;
  title: string;
  meeting_type: string;
  start_time: string;
  end_time?: string;
  participants?: string[];
  summary?: string;
  document_id?: number;
  created_at: string;
}

// 右侧面板标签页类型
export type RightPanelTab = 'student' | 'knowledge' | 'ai' | 'meetings' | 'documents';

// 工作区状态接口
export interface WorkspaceState {
  currentStudentId: number | null;
  currentDocumentId: number | null;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  rightPanelActiveTab: RightPanelTab;
  isSaving: boolean;
  lastSavedAt: Date | null;
}

// 创建文档参数
export interface CreateDocumentParams {
  student_id: number;
  project_id?: number;
  document_type: DocumentType;
  title: string;
  template_id?: number;
}

// 更新文档参数
export interface UpdateDocumentParams {
  title?: string;
  content?: string;
  status?: DocumentStatus;
}

// AI问答消息
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI润色结果
export interface AIPolishResult {
  polished_text: string;
  changes: Array<{
    type: 'grammar' | 'style' | 'vocabulary' | 'structure';
    original: string;
    suggested: string;
    reason: string;
  }>;
}

// AI内容建议
export interface AIContentSuggestion {
  content: string;
  reason: string;
  confidence: number;
}


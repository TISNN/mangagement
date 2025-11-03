/**
 * 知识库类型定义
 * 包含所有知识库相关的 TypeScript 类型和接口
 */

// 资源类型枚举
export type ResourceType = 'document' | 'video' | 'article' | 'template';

// 资源状态枚举
export type ResourceStatus = 'draft' | 'published' | 'archived';

// 知识库资源接口（数据库模型）
export interface KnowledgeResource {
  id: number;
  title: string;
  type: ResourceType;
  category: string;
  description: string;
  content?: string;
  file_url?: string;
  file_size?: string;
  thumbnail_url?: string;
  author_id?: number;
  author_name: string;
  tags: string[];
  is_featured: boolean;
  views: number;
  downloads: number;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

// UI 层的资源接口（前端使用）
export interface UIKnowledgeResource {
  id: number;
  title: string;
  type: ResourceType;
  category: string;
  description: string;
  content?: string;
  fileUrl?: string;
  fileSize?: string;
  thumbnailUrl?: string;
  authorId?: number;
  authorName: string;
  tags: string[];
  isFeatured: boolean;
  views: number;
  downloads: number;
  status: ResourceStatus;
  isBookmarked: boolean; // 当前用户是否收藏
  createdAt: string;
  updatedAt: string;
}

// 评论接口（数据库模型）
export interface KnowledgeComment {
  id: number;
  resource_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  content: string;
  likes: number;
  parent_comment_id?: number;
  created_at: string;
  updated_at: string;
}

// UI 层的评论接口
export interface UIKnowledgeComment {
  id: number;
  resourceId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  parentCommentId?: number;
  isLiked: boolean; // 当前用户是否点赞
  replies?: UIKnowledgeComment[]; // 子评论
  createdAt: string;
  updatedAt: string;
}

// 收藏记录接口
export interface KnowledgeBookmark {
  id: number;
  resource_id: number;
  user_id: number;
  created_at: string;
}

// 筛选条件接口
export interface KnowledgeFilters {
  search: string;
  category: string;
  type: ResourceType | 'all';
  author: string;
  tag: string;
  dateRange: 'all' | '7' | '30' | '90' | '180' | '365';
  sortBy: 'date_desc' | 'date_asc' | 'views_desc' | 'downloads_desc' | 'name_asc' | 'name_desc';
}

// 创建/更新资源的表单数据
export interface KnowledgeResourceFormData {
  title: string;
  type: ResourceType;
  category: string;
  description: string;
  content?: string;
  file?: File;
  thumbnail?: File;
  tags: string[];
  isFeatured: boolean;
  status: ResourceStatus;
}

// 创建评论的表单数据
export interface CommentFormData {
  resourceId: number;
  content: string;
  parentCommentId?: number;
}

// 统计数据接口
export interface KnowledgeStats {
  totalResources: number;
  documentCount: number;
  videoCount: number;
  articleCount: number;
  templateCount: number;
  totalViews: number;
  totalDownloads: number;
  totalComments: number;
  featuredCount: number;
  byCategory: Record<string, number>;
  byType: Record<ResourceType, number>;
}


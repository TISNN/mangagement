/**
 * 知识库数据映射工具
 * 用于在数据库模型和 UI 模型之间转换数据
 */

import { 
  KnowledgeResource, 
  UIKnowledgeResource,
  KnowledgeComment,
  UIKnowledgeComment 
} from '../types/knowledge.types';

/**
 * 将数据库资源模型转换为 UI 资源模型
 */
export function convertDbResourceToUiResource(
  dbResource: KnowledgeResource,
  isBookmarked: boolean = false
): UIKnowledgeResource {
  return {
    id: dbResource.id,
    title: dbResource.title,
    type: dbResource.type,
    category: dbResource.category,
    description: dbResource.description,
    content: dbResource.content,
    fileUrl: dbResource.file_url,
    fileSize: dbResource.file_size,
    thumbnailUrl: dbResource.thumbnail_url,
    authorId: dbResource.author_id,
    authorName: dbResource.author_name,
    tags: dbResource.tags || [],
    isFeatured: dbResource.is_featured,
    views: dbResource.views,
    downloads: dbResource.downloads,
    status: dbResource.status,
    isBookmarked,
    createdAt: dbResource.created_at,
    updatedAt: dbResource.updated_at
  };
}

/**
 * 将 UI 资源模型转换为数据库资源模型
 */
export function convertUiResourceToDbResource(
  uiResource: Partial<UIKnowledgeResource>
): Partial<KnowledgeResource> {
  return {
    title: uiResource.title,
    type: uiResource.type,
    category: uiResource.category,
    description: uiResource.description,
    content: uiResource.content,
    file_url: uiResource.fileUrl,
    file_size: uiResource.fileSize,
    thumbnail_url: uiResource.thumbnailUrl,
    author_id: uiResource.authorId,
    author_name: uiResource.authorName || '',
    tags: uiResource.tags || [],
    is_featured: uiResource.isFeatured || false,
    views: uiResource.views || 0,
    downloads: uiResource.downloads || 0,
    status: uiResource.status || 'draft'
  };
}

/**
 * 将数据库评论模型转换为 UI 评论模型
 */
export function convertDbCommentToUiComment(
  dbComment: KnowledgeComment,
  isLiked: boolean = false
): UIKnowledgeComment {
  return {
    id: dbComment.id,
    resourceId: dbComment.resource_id,
    userId: dbComment.user_id,
    userName: dbComment.user_name,
    userAvatar: dbComment.user_avatar,
    content: dbComment.content,
    likes: dbComment.likes,
    parentCommentId: dbComment.parent_comment_id,
    isLiked,
    createdAt: dbComment.created_at,
    updatedAt: dbComment.updated_at
  };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes?: number | string): string {
  if (!bytes) return '';
  
  const numBytes = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  
  if (numBytes < 1024) return `${numBytes} B`;
  if (numBytes < 1024 * 1024) return `${(numBytes / 1024).toFixed(1)} KB`;
  if (numBytes < 1024 * 1024 * 1024) return `${(numBytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(numBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
  
  return date.toLocaleDateString('zh-CN');
}

/**
 * 格式化数字（浏览量、下载量等）
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 100000) return `${(num / 10000).toFixed(1)}万`;
  return `${Math.floor(num / 10000)}万`;
}

/**
 * 构建评论树结构（将扁平评论列表转换为树形结构）
 */
export function buildCommentTree(comments: UIKnowledgeComment[]): UIKnowledgeComment[] {
  const commentMap = new Map<number, UIKnowledgeComment>();
  const rootComments: UIKnowledgeComment[] = [];
  
  // 第一遍：建立映射
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });
  
  // 第二遍：构建树
  comments.forEach(comment => {
    const commentNode = commentMap.get(comment.id)!;
    
    if (comment.parentCommentId) {
      const parentComment = commentMap.get(comment.parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(commentNode);
      }
    } else {
      rootComments.push(commentNode);
    }
  });
  
  return rootComments;
}


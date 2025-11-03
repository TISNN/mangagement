/**
 * 知识库服务层
 * 负责所有与知识库相关的数据库操作
 */

import { supabase } from '../lib/supabase';
import { 
  KnowledgeResource, 
  KnowledgeComment, 
  KnowledgeBookmark,
  ResourceType,
  ResourceStatus
} from '../pages/admin/KnowledgeBase/types/knowledge.types';

// ============================================
// 资源相关操作
// ============================================

/**
 * 获取所有已发布的资源
 */
export async function getAllResources() {
  const { data, error } = await supabase
    .from('knowledge_resources')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as KnowledgeResource[];
}

/**
 * 根据筛选条件获取资源
 */
export async function getResourcesWithFilters(filters: {
  search?: string;
  category?: string;
  type?: ResourceType | 'all';
  status?: ResourceStatus;
  isFeatured?: boolean;
  dateRange?: number;
  sortBy?: string;
}) {
  let query = supabase
    .from('knowledge_resources')
    .select('*');

  // 应用筛选条件
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.category && filters.category !== '全部分类') {
    query = query.eq('category', filters.category);
  }

  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  if (filters.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured);
  }

  // 时间范围筛选
  if (filters.dateRange) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - filters.dateRange);
    query = query.gte('created_at', daysAgo.toISOString());
  }

  // 搜索（标题、描述、标签）
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // 排序
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'date_desc':
        query = query.order('created_at', { ascending: false });
        break;
      case 'date_asc':
        query = query.order('created_at', { ascending: true });
        break;
      case 'views_desc':
        query = query.order('views', { ascending: false });
        break;
      case 'downloads_desc':
        query = query.order('downloads', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('title', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('title', { ascending: false });
        break;
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as KnowledgeResource[];
}

/**
 * 根据ID获取单个资源
 */
export async function getResourceById(id: number) {
  const { data, error } = await supabase
    .from('knowledge_resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as KnowledgeResource;
}

/**
 * 创建新资源
 */
export async function createResource(resource: Partial<KnowledgeResource>) {
  const { data, error } = await supabase
    .from('knowledge_resources')
    .insert([resource])
    .select()
    .single();

  if (error) throw error;
  return data as KnowledgeResource;
}

/**
 * 更新资源
 */
export async function updateResource(id: number, updates: Partial<KnowledgeResource>) {
  const { data, error } = await supabase
    .from('knowledge_resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as KnowledgeResource;
}

/**
 * 删除资源
 */
export async function deleteResource(id: number) {
  const { error } = await supabase
    .from('knowledge_resources')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * 增加浏览次数
 */
export async function incrementViews(id: number) {
  const { error } = await supabase.rpc('increment_resource_views', { resource_id: id });
  
  // 如果 RPC 函数不存在，使用备用方案
  if (error) {
    const resource = await getResourceById(id);
    await updateResource(id, { views: resource.views + 1 });
  }
}

/**
 * 增加下载次数
 */
export async function incrementDownloads(id: number) {
  const { error } = await supabase.rpc('increment_resource_downloads', { resource_id: id });
  
  // 如果 RPC 函数不存在，使用备用方案
  if (error) {
    const resource = await getResourceById(id);
    await updateResource(id, { downloads: resource.downloads + 1 });
  }
}

// ============================================
// 评论相关操作
// ============================================

/**
 * 获取资源的所有评论
 */
export async function getCommentsByResourceId(resourceId: number) {
  const { data, error } = await supabase
    .from('knowledge_comments')
    .select('*')
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as KnowledgeComment[];
}

/**
 * 创建评论
 */
export async function createComment(comment: {
  resource_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  content: string;
  parent_comment_id?: number;
}) {
  const { data, error } = await supabase
    .from('knowledge_comments')
    .insert([comment])
    .select()
    .single();

  if (error) throw error;
  return data as KnowledgeComment;
}

/**
 * 更新评论
 */
export async function updateComment(id: number, content: string) {
  const { data, error } = await supabase
    .from('knowledge_comments')
    .update({ content })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as KnowledgeComment;
}

/**
 * 删除评论
 */
export async function deleteComment(id: number) {
  const { error } = await supabase
    .from('knowledge_comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * 点赞评论
 */
export async function likeComment(commentId: number, userId: number) {
  // 先检查是否已点赞
  const { data: existing } = await supabase
    .from('knowledge_comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // 已点赞，取消点赞
    await supabase
      .from('knowledge_comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    // 减少点赞数
    const { data: comment } = await supabase
      .from('knowledge_comments')
      .select('likes')
      .eq('id', commentId)
      .single();

    if (comment) {
      await supabase
        .from('knowledge_comments')
        .update({ likes: Math.max(0, comment.likes - 1) })
        .eq('id', commentId);
    }

    return false; // 已取消点赞
  } else {
    // 未点赞，添加点赞
    await supabase
      .from('knowledge_comment_likes')
      .insert([{ comment_id: commentId, user_id: userId }]);

    // 增加点赞数
    const { data: comment } = await supabase
      .from('knowledge_comments')
      .select('likes')
      .eq('id', commentId)
      .single();

    if (comment) {
      await supabase
        .from('knowledge_comments')
        .update({ likes: comment.likes + 1 })
        .eq('id', commentId);
    }

    return true; // 已点赞
  }
}

/**
 * 检查用户是否点赞了评论
 */
export async function isCommentLiked(commentId: number, userId: number): Promise<boolean> {
  const { data } = await supabase
    .from('knowledge_comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

// ============================================
// 收藏相关操作
// ============================================

/**
 * 收藏资源
 */
export async function bookmarkResource(resourceId: number, userId: number) {
  const { error } = await supabase
    .from('knowledge_bookmarks')
    .insert([{ resource_id: resourceId, user_id: userId }]);

  if (error) throw error;
}

/**
 * 取消收藏
 */
export async function unbookmarkResource(resourceId: number, userId: number) {
  const { error } = await supabase
    .from('knowledge_bookmarks')
    .delete()
    .eq('resource_id', resourceId)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * 检查资源是否被收藏
 */
export async function isResourceBookmarked(resourceId: number, userId: number): Promise<boolean> {
  const { data } = await supabase
    .from('knowledge_bookmarks')
    .select('id')
    .eq('resource_id', resourceId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

/**
 * 获取用户收藏的所有资源ID
 */
export async function getUserBookmarks(userId: number): Promise<number[]> {
  const { data, error } = await supabase
    .from('knowledge_bookmarks')
    .select('resource_id')
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map(b => b.resource_id) || [];
}

/**
 * 获取用户收藏的资源列表
 */
export async function getUserBookmarkedResources(userId: number) {
  const { data, error } = await supabase
    .from('knowledge_bookmarks')
    .select(`
      resource_id,
      knowledge_resources (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(item => item.knowledge_resources).filter(Boolean) as KnowledgeResource[];
}

// ============================================
// 统计相关操作
// ============================================

/**
 * 获取知识库统计数据
 */
export async function getKnowledgeStats() {
  const { data, error } = await supabase
    .from('knowledge_resources')
    .select('type, category, views, downloads, status, is_featured')
    .eq('status', 'published');

  if (error) throw error;

  const stats = {
    totalResources: data?.length || 0,
    documentCount: data?.filter(r => r.type === 'document').length || 0,
    videoCount: data?.filter(r => r.type === 'video').length || 0,
    articleCount: data?.filter(r => r.type === 'article').length || 0,
    templateCount: data?.filter(r => r.type === 'template').length || 0,
    totalViews: data?.reduce((sum, r) => sum + r.views, 0) || 0,
    totalDownloads: data?.reduce((sum, r) => sum + r.downloads, 0) || 0,
    featuredCount: data?.filter(r => r.is_featured).length || 0,
    byCategory: {} as Record<string, number>,
    byType: {
      document: 0,
      video: 0,
      article: 0,
      template: 0
    }
  };

  // 按分类统计
  data?.forEach(resource => {
    if (resource.category) {
      stats.byCategory[resource.category] = (stats.byCategory[resource.category] || 0) + 1;
    }
    if (resource.type) {
      stats.byType[resource.type as keyof typeof stats.byType]++;
    }
  });

  return stats;
}

/**
 * 获取热门标签
 */
export async function getPopularTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
  const { data, error } = await supabase
    .from('knowledge_resources')
    .select('tags')
    .eq('status', 'published');

  if (error) throw error;

  // 统计标签出现次数
  const tagCount: Record<string, number> = {};
  data?.forEach(resource => {
    resource.tags?.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  // 转换为数组并排序
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 获取相关资源推荐
 */
export async function getRelatedResources(resourceId: number, limit: number = 3) {
  // 先获取当前资源
  const currentResource = await getResourceById(resourceId);

  // 根据分类和标签推荐相关资源
  const { data, error } = await supabase
    .from('knowledge_resources')
    .select('*')
    .eq('status', 'published')
    .neq('id', resourceId)
    .or(`category.eq.${currentResource.category},tags.cs.{${currentResource.tags.join(',')}}`)
    .order('views', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as KnowledgeResource[];
}


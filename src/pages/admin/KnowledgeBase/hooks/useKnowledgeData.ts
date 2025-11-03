/**
 * 知识库数据管理 Hook
 * 负责加载和管理知识库资源数据
 */

import { useState, useEffect, useCallback } from 'react';
import { UIKnowledgeResource } from '../types/knowledge.types';
import { 
  getAllResources, 
  getResourcesWithFilters,
  getUserBookmarks,
  getKnowledgeStats 
} from '../../../../services/knowledgeService';
import { convertDbResourceToUiResource } from '../utils/knowledgeMappers';
export function useKnowledgeData(userId?: number) {
  const [resources, setResources] = useState<UIKnowledgeResource[]>([]);
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<number[]>([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    documentCount: 0,
    videoCount: 0,
    articleCount: 0,
    templateCount: 0,
    totalViews: 0,
    totalDownloads: 0,
    featuredCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载用户收藏
  const loadBookmarks = useCallback(async () => {
    if (!userId) return;
    
    try {
      const bookmarks = await getUserBookmarks(userId);
      setBookmarkedResourceIds(bookmarks);
    } catch (err) {
      console.error('加载收藏失败:', err);
    }
  }, [userId]);

  // 加载统计数据
  const loadStats = useCallback(async () => {
    try {
      const statsData = await getKnowledgeStats();
      setStats(statsData);
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  }, []);

  // 加载所有资源
  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dbResources = await getAllResources();
      const uiResources = dbResources.map(resource => 
        convertDbResourceToUiResource(
          resource, 
          bookmarkedResourceIds.includes(resource.id)
        )
      );
      setResources(uiResources);
    } catch (err) {
      const error = err as Error;
      console.error('加载资源失败:', err);
      
      // 检查是否是表不存在的错误
      if (error.message?.includes('table') || error.message?.includes('relation')) {
        setError('数据库表未创建。请在 Supabase Dashboard 的 SQL Editor 中执行 database_migrations/004_create_knowledge_base_tables.sql');
      } else {
        setError(error.message || '加载资源失败');
      }
      
      // 设置空数组，避免页面崩溃
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [bookmarkedResourceIds]);

  // 根据筛选条件加载资源
  const loadResourcesWithFilters = useCallback(async (filters: Record<string, unknown>) => {
    setLoading(true);
    setError(null);

    try {
      const dbResources = await getResourcesWithFilters(filters);
      const uiResources = dbResources.map(resource => 
        convertDbResourceToUiResource(
          resource, 
          bookmarkedResourceIds.includes(resource.id)
        )
      );
      setResources(uiResources);
    } catch (err) {
      const error = err as Error;
      setError(error.message || '加载资源失败');
      console.error('加载资源失败:', err);
    } finally {
      setLoading(false);
    }
  }, [bookmarkedResourceIds]);

  // 刷新数据
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadBookmarks(),
      loadStats(),
      loadResources()
    ]);
  }, [loadBookmarks, loadStats, loadResources]);

  // 初始加载
  useEffect(() => {
    refreshData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当收藏变化时重新加载资源
  useEffect(() => {
    if (bookmarkedResourceIds.length >= 0) {
      loadResources();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkedResourceIds]);

  return {
    resources,
    bookmarkedResourceIds,
    stats,
    loading,
    error,
    refreshData,
    loadResources,
    loadResourcesWithFilters,
    loadBookmarks
  };
}


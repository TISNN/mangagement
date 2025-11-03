/**
 * 知识库操作 Hook
 * 处理资源的增删改查、收藏、下载等操作
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createResource,
  updateResource,
  deleteResource,
  bookmarkResource,
  unbookmarkResource,
  incrementViews,
  incrementDownloads
} from '../../../../services/knowledgeService';
import { KnowledgeResourceFormData } from '../types/knowledge.types';
import { convertUiResourceToDbResource } from '../utils/knowledgeMappers';
export function useKnowledgeOperations(userId?: number, userName?: string) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 创建资源
  const handleCreateResource = useCallback(async (formData: KnowledgeResourceFormData) => {
    if (!userId) {
      setError('请先登录');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const dbResource = {
        ...convertUiResourceToDbResource({
          title: formData.title,
          type: formData.type,
          category: formData.category,
          description: formData.description,
          content: formData.content,
          tags: formData.tags,
          isFeatured: formData.isFeatured,
          status: formData.status
        }),
        author_id: userId,
        author_name: userName || 'Unknown',
        created_by: userId
      };

      // TODO: 处理文件上传（file 和 thumbnail）
      // 这里需要集成文件上传服务（如 Supabase Storage）

      const newResource = await createResource(dbResource);
      return newResource;
    } catch (err: any) {
      setError(err.message || '创建资源失败');
      console.error('创建资源失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, userName]);

  // 更新资源
  const handleUpdateResource = useCallback(async (
    id: number, 
    formData: Partial<KnowledgeResourceFormData>
  ) => {
    if (!userId) {
      setError('请先登录');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updates = {
        ...convertUiResourceToDbResource(formData as any),
        updated_by: userId
      };

      const updatedResource = await updateResource(id, updates);
      return updatedResource;
    } catch (err: any) {
      setError(err.message || '更新资源失败');
      console.error('更新资源失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, userName]);

  // 删除资源
  const handleDeleteResource = useCallback(async (id: number) => {
    if (!userId) {
      setError('请先登录');
      return false;
    }

    if (!confirm('确定要删除这个资源吗？此操作无法撤销。')) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteResource(id);
      return true;
    } catch (err: any) {
      setError(err.message || '删除资源失败');
      console.error('删除资源失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, userName]);

  // 收藏/取消收藏资源
  const handleToggleBookmark = useCallback(async (resourceId: number, isBookmarked: boolean) => {
    if (!userId) {
      setError('请先登录');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      if (isBookmarked) {
        await unbookmarkResource(resourceId, userId);
      } else {
        await bookmarkResource(resourceId, userId);
      }
      return true;
    } catch (err: any) {
      setError(err.message || '收藏操作失败');
      console.error('收藏操作失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 查看资源（增加浏览次数）
  const handleViewResource = useCallback(async (resourceId: number) => {
    try {
      await incrementViews(resourceId);
      navigate(`/admin/knowledge/detail/${resourceId}`);
    } catch (err) {
      console.error('更新浏览次数失败:', err);
      // 即使失败也继续导航
      navigate(`/admin/knowledge/detail/${resourceId}`);
    }
  }, [navigate]);

  // 下载资源（增加下载次数）
  const handleDownloadResource = useCallback(async (resourceId: number, fileUrl?: string) => {
    if (!fileUrl) {
      setError('该资源没有可下载的文件');
      return;
    }

    try {
      await incrementDownloads(resourceId);
      // 打开下载链接
      window.open(fileUrl, '_blank');
    } catch (err: any) {
      setError(err.message || '下载失败');
      console.error('下载失败:', err);
    }
  }, []);

  return {
    loading,
    error,
    handleCreateResource,
    handleUpdateResource,
    handleDeleteResource,
    handleToggleBookmark,
    handleViewResource,
    handleDownloadResource
  };
}


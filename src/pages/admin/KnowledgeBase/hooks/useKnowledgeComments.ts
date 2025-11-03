/**
 * 知识库评论 Hook
 * 管理资源评论的加载和操作
 */

import { useState, useEffect, useCallback } from 'react';
import { UIKnowledgeComment } from '../types/knowledge.types';
import { 
  getCommentsByResourceId,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  isCommentLiked
} from '../../../../services/knowledgeService';
import { convertDbCommentToUiComment, buildCommentTree } from '../utils/knowledgeMappers';
export function useKnowledgeComments(resourceId: number, userId?: number, userName?: string, userAvatar?: string) {
  const [comments, setComments] = useState<UIKnowledgeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载评论
  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dbComments = await getCommentsByResourceId(resourceId);
      
      // 检查用户是否点赞了这些评论
      const uiComments = await Promise.all(
        dbComments.map(async (comment) => {
          const liked = userId 
            ? await isCommentLiked(comment.id, userId) 
            : false;
          return convertDbCommentToUiComment(comment, liked);
        })
      );

      // 构建评论树
      const commentTree = buildCommentTree(uiComments);
      setComments(commentTree);
    } catch (err: any) {
      setError(err.message || '加载评论失败');
      console.error('加载评论失败:', err);
    } finally {
      setLoading(false);
    }
  }, [resourceId, userId]);

  // 添加评论
  const handleAddComment = useCallback(async (content: string, parentCommentId?: number) => {
    if (!userId) {
      setError('请先登录');
      return false;
    }

    if (!content.trim()) {
      setError('评论内容不能为空');
      return false;
    }

    setError(null);

    try {
      await createComment({
        resource_id: resourceId,
        user_id: userId,
        user_name: userName || 'Unknown',
        user_avatar: userAvatar,
        content,
        parent_comment_id: parentCommentId
      });

      // 重新加载评论
      await loadComments();
      return true;
    } catch (err: any) {
      setError(err.message || '发表评论失败');
      console.error('发表评论失败:', err);
      return false;
    }
  }, [userId, userName, userAvatar, resourceId, loadComments]);

  // 编辑评论
  const handleUpdateComment = useCallback(async (commentId: number, content: string) => {
    if (!userId) {
      setError('请先登录');
      return false;
    }

    if (!content.trim()) {
      setError('评论内容不能为空');
      return false;
    }

    setError(null);

    try {
      await updateComment(commentId, content);
      await loadComments();
      return true;
    } catch (err: any) {
      setError(err.message || '更新评论失败');
      console.error('更新评论失败:', err);
      return false;
    }
  }, [userId, loadComments]);

  // 删除评论
  const handleDeleteComment = useCallback(async (commentId: number) => {
    if (!userId) {
      setError('请先登录');
      return false;
    }

    if (!confirm('确定要删除这条评论吗？')) {
      return false;
    }

    setError(null);

    try {
      await deleteComment(commentId);
      await loadComments();
      return true;
    } catch (err: any) {
      setError(err.message || '删除评论失败');
      console.error('删除评论失败:', err);
      return false;
    }
  }, [userId, loadComments]);

  // 点赞/取消点赞评论
  const handleToggleLike = useCallback(async (commentId: number) => {
    if (!userId) {
      setError('请先登录');
      return false;
    }

    setError(null);

    try {
      const isLiked = await likeComment(commentId, userId);
      
      // 乐观更新 UI
      setComments(prevComments => {
        const updateCommentLikes = (comments: UIKnowledgeComment[]): UIKnowledgeComment[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked,
                likes: isLiked ? comment.likes + 1 : comment.likes - 1
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentLikes(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateCommentLikes(prevComments);
      });

      return true;
    } catch (err: any) {
      setError(err.message || '点赞操作失败');
      console.error('点赞操作失败:', err);
      // 如果失败，重新加载评论
      await loadComments();
      return false;
    }
  }, [userId, loadComments]);

  // 初始加载
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    loadComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleToggleLike
  };
}


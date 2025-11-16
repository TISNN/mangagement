/**
 * 知识库资源详情页面
 * 显示资源详细信息、评论和相关资源
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  ArrowLeft, 
  Eye, 
  Download, 
  Tag, 
  ThumbsUp, 
  MessageSquare,
  Clock,
  Edit,
  X,
  Save
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { UIKnowledgeResource, UIKnowledgeComment } from '../../types/knowledge.types';
import { convertDbResourceToUiResource, formatDate, formatNumber } from '../../utils/knowledgeMappers';
import { RESOURCE_TYPE_CONFIG } from '../../utils/knowledgeConstants';
import SimpleEditorWrapper from '../../../../../components/SimpleEditorWrapper';
import mammoth from 'mammoth';

const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; avatar_url?: string } | null>(null);
  const [resource, setResource] = useState<UIKnowledgeResource | null>(null);
  const [relatedResources, setRelatedResources] = useState<UIKnowledgeResource[]>([]);
  const [comments, setComments] = useState<UIKnowledgeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  
  // 编辑相关状态
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  const resourceId = parseInt(id || '0');

  // 从 localStorage 获取当前用户信息
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      const employeeData = localStorage.getItem('currentEmployee');
      if (employeeData) {
        setCurrentUser(JSON.parse(employeeData));
      }
    } else if (userType === 'student') {
      const studentData = localStorage.getItem('currentStudent');
      if (studentData) {
        setCurrentUser(JSON.parse(studentData));
      }
    }
  }, []);

  // 加载资源详情
  useEffect(() => {
    const loadResource = async () => {
      if (!resourceId) {
        setError('无效的资源ID');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('正在加载资源ID:', resourceId);
        
        // 加载资源（不要先更新浏览次数，避免影响查询）
        const { data: resourceData, error: resourceError } = await supabase
          .from('knowledge_resources')
          .select('*')
          .eq('id', resourceId)
          .single();

        console.log('资源数据:', resourceData);
        console.log('查询错误:', resourceError);

        if (resourceError) {
          console.error('查询资源失败:', resourceError);
          setError(`加载失败: ${resourceError.message}`);
          setLoading(false);
          return;
        }

        if (!resourceData) {
          setError('资源不存在');
          setLoading(false);
          return;
        }

        // 增加浏览次数（异步，不等待结果）
        (async () => {
          try {
            await supabase.rpc('increment_resource_views', { resource_id: resourceId });
            console.log('浏览次数已更新');
          } catch {
            // 如果 RPC 不存在，使用备用方案
            console.warn('RPC不存在，使用备用方案');
            const currentViews = resourceData.views || 0;
            await supabase
              .from('knowledge_resources')
              .update({ views: currentViews + 1 })
              .eq('id', resourceId);
          }
        })();

        // 检查是否收藏
        let isBookmarked = false;
        if (currentUser?.id) {
          const { data: bookmark } = await supabase
            .from('knowledge_bookmarks')
            .select('id')
            .eq('resource_id', resourceId)
            .eq('user_id', currentUser.id)
            .single();
          isBookmarked = !!bookmark;
        }

        const uiResource = convertDbResourceToUiResource(resourceData, isBookmarked);
        setResource(uiResource);

        // 加载相关资源（同分类）
        const { data: relatedData } = await supabase
          .from('knowledge_resources')
          .select('*')
          .eq('category', resourceData.category)
          .eq('status', 'published')
          .neq('id', resourceId)
          .limit(3);

        if (relatedData) {
          setRelatedResources(relatedData.map(r => convertDbResourceToUiResource(r, false)));
        }

        // 加载评论
        const { data: commentsData } = await supabase
          .from('knowledge_comments')
          .select('*')
          .eq('resource_id', resourceId)
          .is('parent_comment_id', null)
          .order('created_at', { ascending: true });

        if (commentsData) {
          setComments(commentsData.map(c => ({
            id: c.id,
            resourceId: c.resource_id,
            userId: c.user_id,
            userName: c.user_name,
            userAvatar: c.user_avatar,
            content: c.content,
            likes: c.likes,
            parentCommentId: c.parent_comment_id,
            isLiked: false,
            createdAt: c.created_at,
            updatedAt: c.updated_at
          })));
        }
      } catch (err) {
        const error = err as Error;
        console.error('加载资源失败:', err);
        setError(error.message || '加载资源时发生未知错误');
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [resourceId, currentUser]);

  // 处理收藏
  const handleBookmark = async () => {
    if (!resource || !currentUser) {
      alert('请先登录');
      return;
    }
    
    try {
      if (resource.isBookmarked) {
        await supabase
          .from('knowledge_bookmarks')
          .delete()
          .eq('resource_id', resource.id)
          .eq('user_id', currentUser.id);
      } else {
        await supabase
          .from('knowledge_bookmarks')
          .insert([{ resource_id: resource.id, user_id: currentUser.id }]);
      }

      setResource(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    } catch (err) {
      console.error('收藏失败:', err);
    }
  };

  // 处理评论提交
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) {
      alert('请先登录');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('knowledge_comments')
        .insert([{
          resource_id: resourceId,
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar_url,
          content: newComment
        }])
        .select()
        .single();

      if (error) throw error;

      // 添加到评论列表
      setComments(prev => [...prev, {
        id: data.id,
        resourceId: data.resource_id,
        userId: data.user_id,
        userName: data.user_name,
        userAvatar: data.user_avatar,
        content: data.content,
        likes: 0,
        isLiked: false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }]);

      setNewComment('');
    } catch (err) {
      console.error('发表评论失败:', err);
      alert('发表评论失败');
    }
  };

  // 处理点赞
  const handleLike = async (commentId: number) => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    try {
      // 检查是否已点赞
      const { data: existing } = await supabase
        .from('knowledge_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', currentUser.id)
        .single();

      if (existing) {
        // 取消点赞
        await supabase
          .from('knowledge_comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', currentUser.id);

        // 乐观更新 UI
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1), isLiked: false } : c
        ));

        // 更新数据库（获取当前值再减1）
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          await supabase
            .from('knowledge_comments')
            .update({ likes: Math.max(0, comment.likes - 1) })
            .eq('id', commentId);
        }
      } else {
        // 添加点赞
        await supabase
          .from('knowledge_comment_likes')
          .insert([{ comment_id: commentId, user_id: currentUser.id }]);

        // 乐观更新 UI
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, likes: c.likes + 1, isLiked: true } : c
        ));

        // 更新数据库（获取当前值再加1）
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          await supabase
            .from('knowledge_comments')
            .update({ likes: comment.likes + 1 })
            .eq('id', commentId);
        }
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  // 处理下载
  const handleDownload = async () => {
    if (resource?.fileUrl) {
      window.open(resource.fileUrl, '_blank');
      
      // 增加下载次数
      const currentDownloads = resource.downloads || 0;
      await supabase
        .from('knowledge_resources')
        .update({ downloads: currentDownloads + 1 })
        .eq('id', resourceId);
      
      // 更新本地状态
      setResource(prev => prev ? { ...prev, downloads: currentDownloads + 1 } : null);
    }
  };

  // 处理编辑保存
  const handleSaveEdit = async () => {
    if (!resource || !currentUser) {
      alert('请先登录');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('knowledge_resources')
        .update({
          content: editContent,
          updated_by: currentUser.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', resourceId);

      if (error) throw error;

      // 更新本地状态
      setResource(prev => prev ? { ...prev, content: editContent } : null);
      setShowEditModal(false);
      alert('保存成功！');
    } catch (err: any) {
      console.error('保存失败:', err);
      alert('保存失败: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 检查文档是否可编辑
  const isEditable = () => {
    if (!resource) return false;
    
    // 文章类型且有内容
    if (resource.type === 'article' && resource.content) {
      return true;
    }
    
    // 文档类型且是 Word 或文本文件
    if (resource.type === 'document' && resource.fileUrl) {
      const fileUrl = resource.fileUrl.toLowerCase();
      return fileUrl.endsWith('.doc') || 
             fileUrl.endsWith('.docx') || 
             fileUrl.endsWith('.txt');
    }
    
    return false;
  };

  // 从文件 URL 提取内容
  const extractContentFromFile = async (fileUrl: string): Promise<string> => {
    try {
      setLoadingContent(true);
      
      // 获取文件扩展名
      const fileExtension = fileUrl.toLowerCase().split('.').pop() || '';
      
      // 对于文本文件，直接获取文本内容
      if (fileExtension === 'txt') {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('无法获取文件内容');
        const text = await response.text();
        // 将纯文本转换为 HTML
        return text.split('\n').map(line => `<p>${line || '<br/>'}</p>`).join('');
      }
      
      // 对于 Word 文档，使用 mammoth.js 提取内容
      if (fileExtension === 'doc' || fileExtension === 'docx') {
        // 如果数据库中有 content 字段，优先使用
        if (resource?.content) {
          return resource.content;
        }
        
        try {
          // 从 URL 获取文件
          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error('无法获取 Word 文档文件');
          
          // 将响应转换为 ArrayBuffer
          const arrayBuffer = await response.arrayBuffer();
          
          // 使用 mammoth 将 Word 文档转换为 HTML
          const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
          
          // 返回转换后的 HTML 内容
          if (result.value) {
            return result.value;
          } else {
            throw new Error('Word 文档转换失败：未获取到内容');
          }
        } catch (wordError: any) {
          console.error('Word 文档转换失败:', wordError);
          // 如果转换失败，返回错误提示
          return `<p>无法从 Word 文档提取内容: ${wordError.message}</p><p>提示：您可以手动输入内容，或者确保文件 URL 可以正常访问。</p>`;
        }
      }
      
      return '';
    } catch (error: any) {
      console.error('提取文件内容失败:', error);
      return `<p>无法加载文件内容: ${error.message}</p>`;
    } finally {
      setLoadingContent(false);
    }
  };

  // 打开编辑模态框
  const handleOpenEdit = async () => {
    if (!resource) return;
    
    // 如果已经有 content，直接使用
    if (resource.content) {
      setEditContent(resource.content);
      setShowEditModal(true);
      return;
    }
    
    // 如果是文档类型且有文件 URL，尝试从文件提取内容
    if (resource.type === 'document' && resource.fileUrl) {
      const content = await extractContentFromFile(resource.fileUrl);
      setEditContent(content);
      setShowEditModal(true);
    } else {
      // 其他情况，使用空内容
      setEditContent('');
      setShowEditModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            {error ? '加载失败' : '资源未找到'}
          </h2>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium mb-2">错误详情：</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2">资源ID: {resourceId}</p>
            </div>
          )}
          <button
            onClick={() => navigate('/admin/cloud-docs/knowledge')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            返回知识库
          </button>
        </div>
      </div>
    );
  }

  const typeConfig = RESOURCE_TYPE_CONFIG[resource.type];
  const ResourceTypeIcon = typeConfig.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 返回按钮和标题 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin/knowledge')}
          className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          返回知识库
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmark}
            className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Bookmark className={`h-5 w-5 mr-1 ${resource.isBookmarked ? 'fill-current' : ''}`} />
            {resource.isBookmarked ? '已收藏' : '收藏'}
          </button>
        </div>
      </div>

      {/* 资源详情 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
        {/* 封面图 - 顶部全宽显示 */}
        <div className="w-full bg-black flex items-center justify-center">
          <img
            className="w-full h-64 md:h-80 object-contain"
            src={resource.thumbnailUrl}
            alt={resource.title}
          />
        </div>
        
        {/* 资源信息 */}
        <div className="p-6 md:p-8">
          {/* 类型和分类 */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${typeConfig.bgColor}`}>
              <ResourceTypeIcon className={`h-4 w-4 ${typeConfig.textColor}`} />
              <span className={`text-sm font-semibold ${typeConfig.textColor}`}>
                {typeConfig.label}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{resource.category}</span>
          </div>

          {/* 标题 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{resource.title}</h1>
          
          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>作者: {resource.authorName}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>更新于 {formatDate(resource.updatedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{formatNumber(resource.views)} 次浏览</span>
            </div>
            {resource.downloads > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{formatNumber(resource.downloads)} 次下载</span>
                </div>
              </>
            )}
          </div>
          
          {/* 描述 */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{resource.description}</p>
          
          {/* 标签 */}
          {resource.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* 下载按钮 */}
          {resource.fileUrl && (
            <div>
              <button
                onClick={handleDownload}
                className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                下载资源 {resource.fileSize && `(${resource.fileSize})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 文档内容显示区域 */}
      {(resource.content || resource.fileUrl) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">内容预览</h2>
              {/* 编辑按钮 - 仅对可编辑的文档显示 */}
              {isEditable() && (
                <button
                  onClick={handleOpenEdit}
                  disabled={loadingContent}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingContent ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      加载中...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑内容
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* 文章类型：显示 HTML 内容 */}
            {resource.type === 'article' && resource.content && (
              <div 
                className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                dangerouslySetInnerHTML={{ __html: resource.content }}
              />
            )}
            
            {/* 文档类型：显示文档预览 */}
            {resource.type === 'document' && resource.fileUrl && (
              <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                {resource.fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={resource.fileUrl}
                    className="w-full h-[800px] border-0"
                    title="PDF 预览"
                  />
                ) : (
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.fileUrl)}`}
                    className="w-full h-[800px] border-0"
                    title="文档预览"
                  />
                )}
              </div>
            )}
            
            {/* 视频类型：显示视频播放器 */}
            {resource.type === 'video' && resource.fileUrl && (
              <div className="w-full">
                <video
                  src={resource.fileUrl}
                  controls
                  className="w-full max-h-[600px] rounded-lg"
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
            )}
            
            {/* 模板类型：显示文档预览 */}
            {resource.type === 'template' && resource.fileUrl && (
              <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                {resource.fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={resource.fileUrl}
                    className="w-full h-[800px] border-0"
                    title="PDF 预览"
                  />
                ) : (
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.fileUrl)}`}
                    className="w-full h-[800px] border-0"
                    title="模板预览"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 评论区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">讨论区 ({comments.length})</h2>
        
        {/* 评论列表 */}
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <img
                className="h-10 w-10 rounded-full flex-shrink-0"
                src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userName}`}
                alt={comment.userName}
              />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="font-bold text-gray-800 dark:text-white">{comment.userName}</h4>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center mr-4 ${comment.isLiked ? 'text-blue-500' : 'hover:text-blue-500'}`}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 发表评论 */}
        <form onSubmit={handleSubmitComment} className="mt-6">
          <div className="mb-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="分享你的想法..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              disabled={!newComment.trim()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              发表评论
            </button>
          </div>
        </form>
      </div>

      {/* 相关资源 */}
      {relatedResources.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">相关资源推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedResources.map((relatedResource) => {
              const relatedTypeConfig = RESOURCE_TYPE_CONFIG[relatedResource.type];
              const RelatedIcon = relatedTypeConfig.icon;
              
              return (
                <div
                  key={relatedResource.id}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/admin/knowledge/detail/${relatedResource.id}`)}
                >
                  <img
                    className="w-full h-40 object-cover"
                    src={relatedResource.thumbnailUrl}
                    alt={relatedResource.title}
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${relatedTypeConfig.bgColor}`}>
                        <RelatedIcon className={`h-3 w-3 ${relatedTypeConfig.textColor}`} />
                      </div>
                      <span className={`text-xs font-semibold ${relatedTypeConfig.textColor}`}>
                        {relatedTypeConfig.label}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                      {relatedResource.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
                      {relatedResource.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{relatedResource.authorName}</span>
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(relatedResource.views)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 编辑模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">编辑文档内容</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 编辑器区域 */}
            <div className="flex-1 overflow-hidden">
              <SimpleEditorWrapper
                content={editContent}
                onChange={setEditContent}
                placeholder="开始编辑文档内容..."
              />
            </div>

            {/* 底部操作栏 */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailPage;

/**
 * 知识库主页面
 * 整合所有知识库功能
 */

import React, { useState, useEffect } from 'react';
import { Plus, FileUp, BookOpen } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ResourceFormModal } from './components/ResourceFormModal';
import { ResourceCard } from './components/ResourceCard/index'; // 强制刷新导入
import { ResourceFilters } from './components/ResourceFilters';
import { StatsCards } from './components/StatsCards';
import { UIKnowledgeResource } from './types/knowledge.types';
import { convertDbResourceToUiResource } from './utils/knowledgeMappers';
import { TAB_OPTIONS, DEFAULT_FILTERS } from './utils/knowledgeConstants';

function KnowledgeBase() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState<UIKnowledgeResource | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resources, setResources] = useState<UIKnowledgeResource[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'bookmarked' | 'recent'>('all');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [stats, setStats] = useState({
    totalResources: 0,
    documentCount: 0,
    videoCount: 0,
    totalDownloads: 0
  });

  // 从 localStorage 获取当前用户信息
  useEffect(() => {
    try {
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
    } catch (err) {
      console.error('加载用户信息失败:', err);
    }
  }, []);

  // 加载用户收藏
  const loadBookmarks = async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data } = await supabase
        .from('knowledge_bookmarks')
        .select('resource_id')
        .eq('user_id', currentUser.id);
      
      if (data) {
        setBookmarkedIds(data.map(b => b.resource_id));
      }
    } catch (err) {
      console.error('加载收藏失败:', err);
    }
  };

  // 加载资源数据
  const loadResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('knowledge_resources')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const uiResources = (data || []).map(resource => 
        convertDbResourceToUiResource(resource, bookmarkedIds.includes(resource.id))
      );
      
      setResources(uiResources);
      
      // 更新统计数据
      setStats({
        totalResources: uiResources.length,
        documentCount: uiResources.filter(r => r.type === 'document').length,
        videoCount: uiResources.filter(r => r.type === 'video').length,
        totalDownloads: uiResources.reduce((sum, r) => sum + r.downloads, 0)
      });
      
    } catch (err: any) {
      console.error('加载资源失败:', err);
      
      if (err.message?.includes('relation') || err.message?.includes('table')) {
        setError('数据库表未创建。请在 Supabase Dashboard 执行: database_migrations/004_create_knowledge_base_tables.sql');
      } else {
        setError(err.message || '加载资源失败');
      }
      
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadBookmarks();
  }, [currentUser]);

  useEffect(() => {
    loadResources();
  }, [bookmarkedIds]);

  // 处理创建资源
  const handleCreateSubmit = async (formData: any) => {
    if (!currentUser) {
      alert('请先登录');
      return false;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('knowledge_resources')
        .insert([{
          title: formData.title,
          type: formData.type,
          category: formData.category,
          description: formData.description,
          content: formData.type === 'article' ? formData.content : null,
          file_url: formData.fileUrl || null,
          file_size: formData.fileSize || null,
          thumbnail_url: formData.thumbnailUrl || null,
          tags: formData.tags,
          is_featured: formData.isFeatured,
          status: formData.status,
          author_id: currentUser.id,
          author_name: currentUser.name
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('✅ 资源创建成功:', data);

      // 刷新列表
      await loadResources();
      return true;
    } catch (err: any) {
      console.error('创建资源失败:', err);
      alert('创建失败: ' + err.message);
      return false;
    }
  };

  // 处理收藏
  const handleBookmark = async (resourceId: number, isBookmarked: boolean) => {
    if (!currentUser?.id) {
      alert('请先登录');
      return;
    }

    try {
      if (isBookmarked) {
        await supabase
          .from('knowledge_bookmarks')
          .delete()
          .eq('resource_id', resourceId)
          .eq('user_id', currentUser.id);
      } else {
        await supabase
          .from('knowledge_bookmarks')
          .insert([{ resource_id: resourceId, user_id: currentUser.id }]);
      }

      await loadBookmarks();
    } catch (err: any) {
      console.error('收藏操作失败:', err);
      alert('收藏失败: ' + err.message);
    }
  };

  // 处理查看
  const handleView = (id: number) => {
    window.location.href = `/admin/knowledge/detail/${id}`;
  };

  // 处理下载
  const handleDownload = async (id: number, fileUrl?: string) => {
    if (!fileUrl) {
      alert('该资源没有可下载的文件');
      return;
    }

    try {
      // 打开下载链接
      window.open(fileUrl, '_blank');
      
      // 增加下载次数（先查询当前值）
      const resource = resources.find(r => r.id === id);
      if (resource) {
        await supabase
          .from('knowledge_resources')
          .update({ downloads: resource.downloads + 1 })
          .eq('id', id);
        
        // 更新本地状态
        setResources(prev => prev.map(r => 
          r.id === id ? { ...r, downloads: r.downloads + 1 } : r
        ));
      }
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      setEditingResource(resource);
      setShowEditModal(true);
    }
  };

  // 处理编辑提交
  const handleEditSubmit = async (formData: any) => {
    if (!currentUser || !editingResource) {
      alert('请先登录');
      return false;
    }

    try {
      const updateData: any = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        tags: formData.tags,
        is_featured: formData.isFeatured,
        status: formData.status,
        updated_by: currentUser.id
      };

      // 如果是文章类型，更新 content
      if (formData.type === 'article') {
        updateData.content = formData.content;
      }

      // 如果有新的文件URL，更新
      if (formData.fileUrl) {
        updateData.file_url = formData.fileUrl;
        updateData.file_size = formData.fileSize;
      }

      // 如果有新的缩略图URL，更新
      if (formData.thumbnailUrl) {
        updateData.thumbnail_url = formData.thumbnailUrl;
      }

      const { data, error: updateError } = await supabase
        .from('knowledge_resources')
        .update(updateData)
        .eq('id', editingResource.id)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('✅ 资源更新成功:', data);

      // 刷新列表
      await loadResources();
      
      // 关闭编辑模态框
      setShowEditModal(false);
      setEditingResource(null);
      
      return true;
    } catch (err: any) {
      console.error('更新资源失败:', err);
      alert('更新失败: ' + err.message);
      return false;
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('knowledge_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 从列表中移除
      setResources(prev => prev.filter(r => r.id !== id));
      alert('删除成功！');
    } catch (err: any) {
      console.error('删除失败:', err);
      alert('删除失败: ' + err.message);
    }
  };

  // 处理切换精选状态
  const handleToggleFeatured = async (id: number, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('knowledge_resources')
        .update({ is_featured: !isFeatured })
        .eq('id', id);

      if (error) throw error;

      // 更新本地状态
      setResources(prev => prev.map(r => 
        r.id === id ? { ...r, isFeatured: !isFeatured } : r
      ));

      alert(isFeatured ? '已取消精选' : '已设为精选');
    } catch (err: any) {
      console.error('更新失败:', err);
      alert('操作失败: ' + err.message);
    }
  };

  // 筛选资源
  const filteredResources = resources.filter(resource => {
    // Tab 筛选
    if (activeTab === 'featured' && !resource.isFeatured) return false;
    if (activeTab === 'bookmarked' && !resource.isBookmarked) return false;
    if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(resource.updatedAt) < thirtyDaysAgo) return false;
    }

    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // 分类筛选
    if (filters.category && filters.category !== '全部分类') {
      if (resource.category !== filters.category) return false;
    }

    // 类型筛选
    if (filters.type && filters.type !== 'all') {
      if (resource.type !== filters.type) return false;
    }

    return true;
  });

  // 获取分类列表
  const categories = ['全部分类', ...new Set(resources.map(r => r.category))];
  const authors = ['全部作者', ...new Set(resources.map(r => r.authorName))];
  const tags = Array.from(new Set(resources.flatMap(r => r.tags)));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">知识库</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            上传资源
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                  知识库初始化失败
                </h3>
                <p className="text-red-700 dark:text-red-400 mb-4">
                  {error}
                </p>
                <button 
                  onClick={loadResources}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  重新加载
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 筛选器 */}
      <ResourceFilters
        filters={filters}
        categories={categories}
        authors={authors}
        tags={tags}
        showAdvancedFilters={showAdvancedFilters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* 统计卡片 */}
      <StatsCards stats={stats} />

      {/* 资源列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* 选项卡 */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 flex-wrap">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              共 {filteredResources.length} 个资源
            </div>
          </div>
        </div>

        {/* 资源网格 */}
        <div className="p-6">
          {filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {resources.length === 0 ? '还没有资源' : '没有符合条件的资源'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {resources.length === 0 
                      ? '点击"上传资源"按钮创建第一个知识库资源'
                      : '尝试调整筛选条件或搜索关键词'
                    }
                  </p>
                  {resources.length === 0 && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      创建第一个资源
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onView={handleView}
                  onBookmark={handleBookmark}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          )}
        </div>

        {/* 分页信息 */}
        {filteredResources.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                显示 {filteredResources.length} 个资源
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 上传资源入口 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 flex items-center justify-between">
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">贡献你的知识资源</h3>
          <p className="text-blue-100 max-w-2xl">上传资料、文档或视频分享给其他用户，帮助更多学生获取留学相关的知识和指导。</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <FileUp className="h-4 w-4" />
          上传新资源
        </button>
      </div>

      {/* 创建资源模态框 */}
      <ResourceFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />

      {/* 编辑资源模态框 */}
      {editingResource && (
        <ResourceFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingResource(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={{
            title: editingResource.title,
            type: editingResource.type,
            category: editingResource.category,
            description: editingResource.description,
            content: editingResource.content,
            tags: editingResource.tags,
            isFeatured: editingResource.isFeatured,
            status: editingResource.status,
            fileUrl: editingResource.fileUrl,
            fileSize: editingResource.fileSize,
            thumbnailUrl: editingResource.thumbnailUrl
          }}
          mode="edit"
        />
      )}
    </div>
  );
}

export default KnowledgeBase;

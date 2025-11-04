/**
 * 资源创建/编辑表单模态框
 * 用于创建和编辑知识库资源
 */

import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Tag as TagIcon, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { KnowledgeResourceFormData, ResourceType, ResourceStatus } from '../../types/knowledge.types';
import { RESOURCE_TYPE_CONFIG, RESOURCE_CATEGORIES, DEFAULT_THUMBNAILS } from '../../utils/knowledgeConstants';
import { uploadFile, uploadThumbnail, formatFileSize, validateFileSize } from '../../../../../services/storageService';
import SimpleEditorWrapper from '../../../../../components/SimpleEditorWrapper';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KnowledgeResourceFormData) => Promise<boolean>;
  initialData?: Partial<KnowledgeResourceFormData>;
  mode: 'create' | 'edit';
}

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<KnowledgeResourceFormData>({
    title: '',
    type: 'document',
    category: '申请指南',
    description: '',
    content: '',
    tags: [],
    isFeatured: false,
    status: 'published'
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  // 文件相关状态
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('请输入资源标题');
      return;
    }

    // 验证文件上传（非文章类型需要文件或链接）
    if (formData.type !== 'article' && !selectedFile && !formData.content) {
      if (!confirm('没有上传文件，是否继续？资源将没有可下载的内容。')) {
        return;
      }
    }

    setSubmitting(true);
    
    try {
      // 1. 上传文件
      let fileUrl = formData.content || '';
      let fileSize = '';
      
      if (selectedFile) {
        setUploadProgress('正在上传文件...');
        const uploadedUrl = await uploadFile(selectedFile, `${formData.type}/`);
        
        if (!uploadedUrl) {
          alert('文件上传失败，请重试');
          setSubmitting(false);
          setUploadProgress('');
          return;
        }
        
        fileUrl = uploadedUrl;
        fileSize = formatFileSize(selectedFile.size);
      }

      // 2. 上传缩略图
      let thumbnailUrl = '';
      
      if (selectedThumbnail) {
        setUploadProgress('正在上传封面图...');
        const uploadedThumbnail = await uploadThumbnail(selectedThumbnail);
        
        if (uploadedThumbnail) {
          thumbnailUrl = uploadedThumbnail;
        }
      }
      
      // 如果没有上传缩略图，使用默认图
      if (!thumbnailUrl) {
        thumbnailUrl = DEFAULT_THUMBNAILS[formData.type];
      }

      setUploadProgress('正在保存资源...');

      // 3. 提交表单数据
      const dataToSubmit = {
        ...formData,
        content: formData.type === 'article' ? formData.content : fileUrl,
        file: selectedFile,
        thumbnail: selectedThumbnail,
        fileUrl,
        fileSize,
        thumbnailUrl
      };

      const success = await onSubmit(dataToSubmit);
      
      if (success) {
        onClose();
        // 重置表单
        setFormData({
          title: '',
          type: 'document',
          category: '申请指南',
          description: '',
          content: '',
          tags: [],
          isFeatured: false,
          status: 'published'
        });
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setThumbnailPreview('');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件大小（最大100MB）
      if (!validateFileSize(file, 100)) {
        alert('文件大小不能超过 100MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // 处理缩略图选择
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件大小（最大5MB）
      if (!validateFileSize(file, 5)) {
        alert('封面图大小不能超过 5MB');
        return;
      }
      
      setSelectedThumbnail(file);
      
      // 生成预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">
            {mode === 'create' ? '上传新资源' : '编辑资源'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                资源标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：美国大学申请流程指南"
                required
              />
            </div>

            {/* 类型和分类 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ResourceType }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.entries(RESOURCE_TYPE_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源分类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {RESOURCE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                简短描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="简要描述这个资源的内容和用途..."
                required
              />
            </div>

            {/* 详细内容（文章类型） */}
            {formData.type === 'article' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章内容
                </label>
                <SimpleEditorWrapper
                  content={formData.content || ''}
                  onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                  placeholder="开始编写文章内容..."
                  minHeight="400px"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 专业的编辑器：支持标题、列表、对齐、高亮、链接、图片等
                </p>
              </div>
            )}

            {/* 文件上传（非文章类型） */}
            {formData.type !== 'article' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  上传文件 {RESOURCE_TYPE_CONFIG[formData.type].acceptFiles && `(支持格式: ${RESOURCE_TYPE_CONFIG[formData.type].acceptFiles})`}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept={RESOURCE_TYPE_CONFIG[formData.type].acceptFiles}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      {selectedFile ? (
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                          <p className="text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 dark:text-gray-300">点击选择文件上传</p>
                          <p className="text-gray-500 dark:text-gray-400">最大 100MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  文件将安全上传到 Supabase Storage
                </p>
              </div>
            )}

            {/* 封面图上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                上传封面图（可选）
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* 上传区域 */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    id="thumbnail-upload"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                        <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      {selectedThumbnail ? (
                        <div className="text-xs">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{selectedThumbnail.name}</p>
                          <p className="text-gray-500 dark:text-gray-400">{formatFileSize(selectedThumbnail.size)}</p>
                        </div>
                      ) : (
                        <div className="text-xs">
                          <p className="font-medium text-gray-700 dark:text-gray-300">点击上传</p>
                          <p className="text-gray-500 dark:text-gray-400">最大 5MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* 预览区域 */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-2 flex items-center justify-center bg-gray-50 dark:bg-gray-700 min-h-[120px]">
                  {(thumbnailPreview || DEFAULT_THUMBNAILS[formData.type]) ? (
                    <img
                      src={thumbnailPreview || DEFAULT_THUMBNAILS[formData.type]}
                      alt="预览"
                      className="w-full h-full object-cover rounded-lg max-h-[110px]"
                    />
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">封面预览</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                💡 如果不上传，将使用{RESOURCE_TYPE_CONFIG[formData.type].label}类型的默认封面图
              </p>
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入标签后按回车添加"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {/* 已添加的标签 */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-sm"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 其他选项 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">设为精选资源</span>
              </label>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">状态：</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ResourceStatus }))}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {/* 上传进度提示 */}
          {uploadProgress && (
            <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              <span>{uploadProgress}</span>
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
              disabled={submitting}
            >
              取消
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  处理中...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {mode === 'create' ? '创建资源' : '保存修改'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


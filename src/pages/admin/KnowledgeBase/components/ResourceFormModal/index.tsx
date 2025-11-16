/**
 * 资源创建/编辑表单模态框
 * 用于创建和编辑知识库资源
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Plus, Tag as TagIcon, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { KnowledgeResourceFormData, ResourceType, ResourceStatus } from '../../types/knowledge.types';
import { RESOURCE_TYPE_CONFIG, RESOURCE_CATEGORIES } from '../../utils/knowledgeConstants';
import { uploadFile, uploadThumbnail, formatFileSize, validateFileSize } from '../../../../../services/storageService';
import SimpleEditorWrapper from '../../../../../components/SimpleEditorWrapper';
import { getDefaultThumbnail } from '../../utils/generateThumbnail';

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
  
  // 编辑模式下保留原有的文件URL和封面图URL
  const [originalFileUrl, setOriginalFileUrl] = useState<string>('');
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string>('');
  const [originalTitle, setOriginalTitle] = useState<string>(''); // 保存原始标题，用于判断标题是否变化
  
  // 从URL中提取文件名
  const extractFileName = (url: string): string => {
    if (!url) return '';
    try {
      // 尝试从URL中提取文件名
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // 获取路径的最后一部分作为文件名
      const fileName = pathname.split('/').pop() || '';
      // 如果文件名包含查询参数，去掉
      return fileName.split('?')[0] || '文件';
    } catch {
      // 如果不是有效的URL，尝试直接提取文件名
      const parts = url.split('/');
      const fileName = parts[parts.length - 1] || '文件';
      return fileName.split('?')[0] || '文件';
    }
  };
  
  // 拖拽状态
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

  // 重置表单函数
  const resetForm = useCallback(() => {
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
    setTagInput('');
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setThumbnailPreview('');
    setIsDraggingFile(false);
    setIsDraggingThumbnail(false);
    setUploadProgress('');
    setOriginalFileUrl('');
    setOriginalThumbnailUrl('');
    setOriginalTitle('');
  }, []);

  // 初始化表单数据
  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        // 编辑模式：使用传入的初始数据
        setFormData(prev => ({ ...prev, ...initialData }));
        // 保存原有的文件URL和封面图URL
        setOriginalFileUrl((initialData as any).fileUrl || '');
        setOriginalThumbnailUrl((initialData as any).thumbnailUrl || '');
        // 保存原始标题，用于判断标题是否变化
        setOriginalTitle(initialData.title || '');
        // 编辑模式下不设置 thumbnailPreview，让系统根据标题生成默认封面图
        // 如果用户想保留原有封面图，可以重新上传
        setThumbnailPreview('');
      } else if (mode === 'create') {
        // 创建模式：重置表单
        resetForm();
        setOriginalFileUrl('');
        setOriginalThumbnailUrl('');
      }
    }
  }, [isOpen, initialData, mode, resetForm]);

  // 当模态框关闭时重置拖拽状态和表单（仅创建模式）
  useEffect(() => {
    if (!isOpen && mode === 'create') {
      // 创建模式下，关闭窗口时重置表单
      resetForm();
    } else if (!isOpen) {
      // 其他情况下只重置拖拽状态
      setIsDraggingFile(false);
      setIsDraggingThumbnail(false);
    }
  }, [isOpen, mode, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('请输入资源标题');
      return;
    }

    // 验证文件上传（非文章类型需要文件或链接）
    // 在编辑模式下，如果没有重新上传文件，检查是否有原有文件URL
    const hasFile = selectedFile || formData.content || (mode === 'edit' && originalFileUrl);
    if (formData.type !== 'article' && !hasFile) {
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
        // 用户重新上传了文件
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
      } else if (mode === 'edit' && originalFileUrl) {
        // 编辑模式：如果没有重新上传文件，保留原有文件URL
        fileUrl = originalFileUrl;
        fileSize = (formData as any).fileSize || '';
      }

      // 2. 上传缩略图
      let thumbnailUrl = '';
      
      if (selectedThumbnail) {
        // 用户重新上传了封面图
        setUploadProgress('正在上传封面图...');
        const uploadedThumbnail = await uploadThumbnail(selectedThumbnail);
        
        if (uploadedThumbnail) {
          thumbnailUrl = uploadedThumbnail;
        }
      } else if (mode === 'edit') {
        // 编辑模式：检查标题是否变化
        const titleChanged = formData.title.trim() !== originalTitle.trim();
        
        if (titleChanged) {
          // 标题变化了，生成基于新标题的默认封面图
          thumbnailUrl = getDefaultThumbnail(formData.title);
        } else if (originalThumbnailUrl) {
          // 标题没变化，保留原有封面图URL
          thumbnailUrl = originalThumbnailUrl;
        }
        // 如果标题没变化且没有原有封面图，thumbnailUrl 保持为空，显示时会自动生成
      }
      
      // 如果没有上传缩略图且不是编辑模式，不设置 thumbnailUrl（留空）
      // 在显示时会自动生成黑色背景+白色标题文字的默认封面图

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
        // 创建模式下，提交成功后重置表单
        if (mode === 'create') {
          resetForm();
        }
        onClose();
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
      processFile(file);
    }
  };

  // 处理文件（统一处理逻辑）
  const processFile = (file: File) => {
    // 验证文件大小（最大100MB）
    if (!validateFileSize(file, 100)) {
      alert('文件大小不能超过 100MB');
      return;
    }
    setSelectedFile(file);
    
    // 如果标题为空，自动使用文件名（去掉扩展名）作为标题
    const shouldUpdateTitle = !formData.title.trim();
    if (shouldUpdateTitle) {
      const fileName = file.name;
      // 去掉文件扩展名
      const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({
        ...prev,
        title: nameWithoutExtension
      }));
    }
    
    // 创建模式下，每次文件上传或重新上传时，清除封面图，让系统重新生成默认封面图
    // 编辑模式下，保留原有的封面图，除非用户主动重新上传
    if (mode === 'create') {
      setSelectedThumbnail(null);
      setThumbnailPreview('');
    }
  };

  // 处理缩略图选择
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processThumbnail(file);
    }
  };

  // 处理封面图（统一处理逻辑）
  const processThumbnail = (file: File) => {
    // 验证文件大小（最大5MB）
    if (!validateFileSize(file, 5)) {
      alert('封面图大小不能超过 5MB');
      return;
    }
    
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('封面图格式不支持，请上传 JPEG、PNG、GIF 或 WebP 格式的图片');
      return;
    }
    
    setSelectedThumbnail(file);
    
    // 生成预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 文件拖拽处理
  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  // 封面图拖拽处理
  const handleThumbnailDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingThumbnail(true);
  };

  const handleThumbnailDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingThumbnail(false);
  };

  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingThumbnail(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processThumbnail(file);
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
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDraggingFile 
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                  }`}
                  onDragOver={handleFileDragOver}
                  onDragLeave={handleFileDragLeave}
                  onDrop={handleFileDrop}
                >
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
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">新上传的文件</p>
                        </div>
                      ) : originalFileUrl && mode === 'edit' ? (
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={extractFileName(originalFileUrl)}>
                            {extractFileName(originalFileUrl)}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">{(formData as any).fileSize || '文件已上传'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">重新上传将替换现有文件</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {isDraggingFile ? '松开鼠标以上传文件' : '点击选择或拖拽文件到此处上传'}
                          </p>
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
                <div 
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                    isDraggingThumbnail 
                      ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
                  }`}
                  onDragOver={handleThumbnailDragOver}
                  onDragLeave={handleThumbnailDragLeave}
                  onDrop={handleThumbnailDrop}
                >
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
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">新上传的封面图</p>
                        </div>
                      ) : originalThumbnailUrl && mode === 'edit' ? (
                        <div className="text-xs">
                          <p className="font-medium text-gray-900 dark:text-white">已存在封面图</p>
                          <p className="text-gray-500 dark:text-gray-400">重新上传将替换</p>
                        </div>
                      ) : (
                        <div className="text-xs">
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {isDraggingThumbnail ? '松开鼠标以上传' : '点击或拖拽上传'}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">最大 5MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* 预览区域 */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-2 flex items-center justify-center bg-gray-50 dark:bg-gray-700 min-h-[120px]">
                  {thumbnailPreview ? (
                    // 用户新上传的封面图预览
                    <img
                      src={thumbnailPreview}
                      alt="预览"
                      className="w-full h-full object-cover rounded-lg max-h-[110px]"
                    />
                  ) : selectedThumbnail ? (
                    // 用户选择了新封面图但预览还未生成（不应该出现，但作为备用）
                    <p className="text-xs text-gray-500 dark:text-gray-400">正在生成预览...</p>
                  ) : formData.title ? (
                    // 根据当前标题生成默认封面图（标题变化时会自动更新）
                    <img
                      key={formData.title} // 使用标题作为 key，标题变化时会自动重新渲染
                      src={getDefaultThumbnail(formData.title)}
                      alt="默认封面预览"
                      className="w-full h-full object-cover rounded-lg max-h-[110px]"
                    />
                  ) : originalThumbnailUrl && mode === 'edit' ? (
                    // 编辑模式下，如果没有标题且没有上传封面图，显示原有封面图
                    <img
                      src={originalThumbnailUrl}
                      alt="原有封面图"
                      className="w-full h-full object-cover rounded-lg max-h-[110px]"
                    />
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">请输入标题以预览默认封面图</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                💡 如果不上传，将自动生成黑色背景+白色标题文字的默认封面图
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


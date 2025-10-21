/**
 * 附件查看器组件
 * 支持在线查看和批注功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Download, MessageSquare, Save, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { TaskAttachment } from '../../services/taskAttachmentService';

interface AttachmentViewerProps {
  attachment: TaskAttachment;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (attachmentId: number) => void;
  currentUserId?: number;
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  createdAt: string;
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  attachment,
  isOpen,
  onClose,
  onDelete,
  currentUserId,
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 检查文件类型是否支持查看
  const isViewable = () => {
    const viewableTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/csv',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    return viewableTypes.includes(attachment.mime_type);
  };

  // 获取文件预览URL
  const getPreviewUrl = () => {
    if (attachment.mime_type.startsWith('image/')) {
      return attachment.file_url;
    }
    if (attachment.mime_type === 'application/pdf') {
      return attachment.file_url;
    }
    // 对于Office文档，使用Google Docs Viewer
    if (attachment.mime_type.includes('msword') || 
        attachment.mime_type.includes('spreadsheet') || 
        attachment.mime_type.includes('presentation')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(attachment.file_url)}&embedded=true`;
    }
    return null;
  };

  // 处理缩放
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // 处理拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === imageRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理批注
  const handleAddAnnotation = () => {
    if (newAnnotation.trim()) {
      const annotation: Annotation = {
        id: Date.now().toString(),
        x: 50, // 默认位置
        y: 50,
        text: newAnnotation.trim(),
        author: '当前用户', // 这里应该从用户信息获取
        createdAt: new Date().toISOString()
      };
      setAnnotations(prev => [...prev, annotation]);
      setNewAnnotation('');
      setIsAddingAnnotation(false);
    }
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  // 处理下载
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.file_url;
    link.download = attachment.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理删除
  const handleDelete = () => {
    if (onDelete && confirm('确定要删除这个附件吗？')) {
      onDelete(attachment.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  const previewUrl = getPreviewUrl();
  const canView = isViewable() && previewUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {attachment.file_name}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {attachment.file_size ? `${(attachment.file_size / 1024 / 1024).toFixed(1)}MB` : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 批注切换 */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`p-2 rounded-lg transition-colors ${
                showAnnotations 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title="切换批注显示"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            
            {/* 缩放控制 */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="重置"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            
            {/* 操作按钮 */}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="下载文件"
            >
              <Download className="w-4 h-4" />
            </button>
            
            {onDelete && currentUserId === attachment.uploaded_by && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="删除附件"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* 主内容区域 */}
          <div className="flex-1 relative overflow-hidden">
            {canView ? (
              <div 
                ref={containerRef}
                className="w-full h-full overflow-auto bg-gray-100 dark:bg-gray-900"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {attachment.mime_type.startsWith('image/') ? (
                  <img
                    ref={imageRef}
                    src={attachment.file_url}
                    alt={attachment.file_name}
                    className="max-w-none transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    draggable={false}
                  />
                ) : attachment.mime_type === 'application/pdf' ? (
                  <iframe
                    src={attachment.file_url}
                    className="w-full h-full border-0"
                    title={attachment.file_name}
                  />
                ) : (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title={attachment.file_name}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl text-gray-400 dark:text-gray-600 mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    不支持在线预览
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    此文件类型暂不支持在线查看
                  </p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    下载文件
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 批注面板 */}
          {showAnnotations && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">批注</h4>
                
                {/* 添加批注 */}
                {isAddingAnnotation ? (
                  <div className="space-y-2">
                    <textarea
                      value={newAnnotation}
                      onChange={(e) => setNewAnnotation(e.target.value)}
                      placeholder="输入批注内容..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddAnnotation}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingAnnotation(false);
                          setNewAnnotation('');
                        }}
                        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingAnnotation(true)}
                    className="w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                  >
                    + 添加批注
                  </button>
                )}
              </div>

              {/* 批注列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {annotations.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                    暂无批注
                  </div>
                ) : (
                  annotations.map((annotation) => (
                    <div key={annotation.id} className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {annotation.author}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnotation(annotation.id)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {annotation.text}
                      </p>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {new Date(annotation.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentViewer;

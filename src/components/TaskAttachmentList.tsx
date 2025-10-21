/**
 * 任务附件列表组件
 */

import React, { useState } from 'react';
import { Download, Trash2, User, Clock, Eye } from 'lucide-react';
import { TaskAttachment, formatFileSize, getFileIcon } from '../services/taskAttachmentService';
import AttachmentViewer from './AttachmentViewer';

interface TaskAttachmentListProps {
  attachments: TaskAttachment[];
  onDeleteAttachment?: (attachmentId: number) => void;
  currentUserId?: number; // 当前用户ID，用于判断删除权限
}

const TaskAttachmentList: React.FC<TaskAttachmentListProps> = ({
  attachments,
  onDeleteAttachment,
  currentUserId,
}) => {
  const [viewingAttachment, setViewingAttachment] = useState<TaskAttachment | null>(null);
  
  const handleDownload = (attachment: TaskAttachment) => {
    // 创建一个临时的a标签来触发下载
    const link = document.createElement('a');
    link.href = attachment.file_url;
    link.download = attachment.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (attachmentId: number) => {
    if (onDeleteAttachment && confirm('确定要删除这个附件吗？')) {
      onDeleteAttachment(attachmentId);
    }
  };

  const handleView = (attachment: TaskAttachment) => {
    setViewingAttachment(attachment);
  };

  const handleCloseViewer = () => {
    setViewingAttachment(null);
  };

  const handleDeleteFromViewer = (attachmentId: number) => {
    if (onDeleteAttachment) {
      onDeleteAttachment(attachmentId);
    }
    setViewingAttachment(null);
  };

  const formatUploadTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}天前`;
      } else {
        return date.toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        <p className="text-sm">暂无附件</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {attachments.map((attachment) => {
          const canDelete = currentUserId === attachment.uploaded_by;
          
          return (
            <div 
              key={attachment.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              {/* 文件图标 */}
              <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {getFileIcon(attachment.mime_type, attachment.file_name)}
              </div>
              
              {/* 文件信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {attachment.file_name}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(attachment.file_size)}</span>
                  
                  {/* 上传者信息 */}
                  {attachment.uploader && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{attachment.uploader.name}</span>
                    </div>
                  )}
                  
                  {/* 上传时间 */}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatUploadTime(attachment.uploaded_at)}</span>
                  </div>
                </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex items-center gap-1">
              {/* 在线查看按钮 */}
              <button
                onClick={() => handleView(attachment)}
                className="opacity-0 group-hover:opacity-100 p-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-opacity"
                title="在线查看"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              {/* 下载按钮 */}
              <button
                onClick={() => handleDownload(attachment)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
                title="下载文件"
              >
                <Download className="w-4 h-4" />
              </button>
              
              {/* 删除按钮 */}
              {canDelete && onDeleteAttachment && (
                <button
                  onClick={() => handleDelete(attachment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                  title="删除附件"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            </div>
          );
        })}
      </div>

      {/* 附件查看器 */}
      {viewingAttachment && (
        <AttachmentViewer
          attachment={viewingAttachment}
          isOpen={!!viewingAttachment}
          onClose={handleCloseViewer}
          onDelete={onDeleteAttachment ? handleDeleteFromViewer : undefined}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default TaskAttachmentList;

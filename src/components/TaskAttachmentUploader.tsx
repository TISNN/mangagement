/**
 * 任务附件上传组件
 */

import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { addTaskAttachment, formatFileSize, getFileIcon } from '../services/taskAttachmentService';

interface TaskAttachmentUploaderProps {
  taskId: number;
  onUploadSuccess: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const TaskAttachmentUploader: React.FC<TaskAttachmentUploaderProps> = ({
  taskId,
  onUploadSuccess,
  onError,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件大小 (50MB 限制)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      onError?.('文件大小不能超过 50MB');
      return;
    }

    await uploadFile(file);
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await addTaskAttachment({
        taskId,
        file,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadSuccess();
      }, 500);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : '上传失败，请重试';
      onError?.(errorMessage);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await uploadFile(file);
    }
  };

  if (isUploading) {
    return (
      <div className={`w-full p-3 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              正在上传...
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer flex items-center justify-center gap-2 ${className}`}
      onClick={handleFileSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-4 h-4" />
      <span className="text-sm">添加附件</span>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="*/*"
      />
    </div>
  );
};

export default TaskAttachmentUploader;

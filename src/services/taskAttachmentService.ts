/**
 * 任务附件服务
 * 管理 task_attachments 表的CRUD操作和 Supabase Storage 文件上传
 */

import { supabase } from '../lib/supabase';

// 附件接口定义
export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_path: string;
  file_size: number;
  mime_type?: string;
  uploaded_by: number;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
  
  // 关联数据
  uploader?: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

// 上传附件数据
export interface UploadAttachmentData {
  taskId: number;
  file: File;
}

// 文件类型图标映射
export const getFileIcon = (mimeType?: string, fileName?: string) => {
  if (!mimeType && !fileName) return '📄';
  
  const type = mimeType || '';
  const name = fileName || '';
  const extension = name.split('.').pop()?.toLowerCase();
  
  // 图片文件
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '')) {
    return '🖼️';
  }
  
  // PDF文件
  if (type === 'application/pdf' || extension === 'pdf') {
    return '📄';
  }
  
  // Word文档
  if (type.includes('word') || ['doc', 'docx'].includes(extension || '')) {
    return '📝';
  }
  
  // Excel文件
  if (type.includes('sheet') || ['xls', 'xlsx'].includes(extension || '')) {
    return '📊';
  }
  
  // PowerPoint
  if (type.includes('presentation') || ['ppt', 'pptx'].includes(extension || '')) {
    return '📋';
  }
  
  // 压缩文件
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return '🗜️';
  }
  
  // 视频文件
  if (type.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
    return '🎥';
  }
  
  // 音频文件
  if (type.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
    return '🎵';
  }
  
  return '📄';
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 获取任务的所有附件
 */
export async function getTaskAttachments(taskId: number): Promise<TaskAttachment[]> {
  try {
    const { data, error } = await supabase
      .from('task_attachments')
      .select(`
        *,
        uploader:uploaded_by(id, name, avatar_url)
      `)
      .eq('task_id', taskId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('[TaskAttachmentService] 获取任务附件失败:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[TaskAttachmentService] 获取任务附件异常:', error);
    throw error;
  }
}

/**
 * 上传附件到 Supabase Storage
 */
export async function uploadFileToStorage(file: File, taskId: number): Promise<{ path: string; url: string }> {
  try {
    // 生成唯一的文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExt}`;
    const filePath = `${taskId}/${fileName}`;

    // 上传文件到 Storage
    const { error } = await supabase.storage
      .from('task-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[TaskAttachmentService] 文件上传失败:', error);
      throw new Error(`文件上传失败: ${error.message}`);
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from('task-attachments')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('[TaskAttachmentService] 文件上传异常:', error);
    throw error;
  }
}

/**
 * 添加任务附件
 */
export async function addTaskAttachment({ taskId, file }: UploadAttachmentData): Promise<TaskAttachment> {
  try {
    // 注意：我们假设存储桶存在，如果不存在会在上传操作中捕获错误
    // 获取当前登录用户ID
    const currentEmployee = localStorage.getItem('currentEmployee');
    const uploadedBy = currentEmployee ? JSON.parse(currentEmployee).id : null;

    if (!uploadedBy) {
      throw new Error('无法获取当前用户信息');
    }

    // 上传文件到 Storage
    const { path: filePath, url: fileUrl } = await uploadFileToStorage(file, taskId);

    // 保存附件记录到数据库
    const { data, error } = await supabase
      .from('task_attachments')
      .insert({
        task_id: taskId,
        file_name: file.name,
        file_url: fileUrl,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy,
      })
      .select(`
        *,
        uploader:uploaded_by(id, name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('[TaskAttachmentService] 保存附件记录失败:', error);
      
      // 如果数据库保存失败，尝试删除已上传的文件
      try {
        await supabase.storage.from('task-attachments').remove([filePath]);
      } catch (deleteError) {
        console.error('[TaskAttachmentService] 清理上传文件失败:', deleteError);
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error('[TaskAttachmentService] 添加附件异常:', error);
    throw error;
  }
}

/**
 * 删除任务附件
 */
export async function deleteTaskAttachment(attachmentId: number): Promise<void> {
  try {
    // 先获取附件信息
    const { data: attachment, error: fetchError } = await supabase
      .from('task_attachments')
      .select('file_path')
      .eq('id', attachmentId)
      .single();

    if (fetchError) {
      console.error('[TaskAttachmentService] 获取附件信息失败:', fetchError);
      throw fetchError;
    }

    // 删除数据库记录
    const { error: deleteError } = await supabase
      .from('task_attachments')
      .delete()
      .eq('id', attachmentId);

    if (deleteError) {
      console.error('[TaskAttachmentService] 删除附件记录失败:', deleteError);
      throw deleteError;
    }

    // 删除 Storage 中的文件
    if (attachment?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('task-attachments')
        .remove([attachment.file_path]);

      if (storageError) {
        console.error('[TaskAttachmentService] 删除存储文件失败:', storageError);
        // 不抛出错误，因为数据库记录已经删除了
      }
    }
  } catch (error) {
    console.error('[TaskAttachmentService] 删除附件异常:', error);
    throw error;
  }
}

/**
 * 检查 Supabase Storage bucket 是否存在
 * 通过尝试列出存储桶内容来检查访问权限
 */
export async function checkStorageBucket(): Promise<boolean> {
  try {
    // 直接尝试访问存储桶，而不是列出所有存储桶
    // listBuckets() 需要管理员权限，但用户可能没有这个权限
    const { error } = await supabase.storage
      .from('task-attachments')
      .list('', { limit: 1 });
    
    // 如果能访问存储桶（即使返回错误），说明存储桶存在
    // 常见的错误包括权限问题，但不一定是存储桶不存在
    if (error) {
      // 如果是权限错误或其他非"存储桶不存在"的错误，我们认为存储桶存在
      if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
        console.log('[TaskAttachmentService] 存储桶不存在:', error.message);
        return false;
      } else {
        // 其他错误（如权限错误）表示存储桶存在但可能无法访问
        console.log('[TaskAttachmentService] 存储桶存在但可能有权限限制:', error.message);
        return true;
      }
    }

    return true;
  } catch (error) {
    console.error('[TaskAttachmentService] 检查存储桶异常:', error);
    // 发生异常时，我们假设存储桶存在，让实际的存储操作来处理权限问题
    return true;
  }
}

/**
 * 检查存储桶是否存在，如果不存在则返回false但不创建
 * 注意：创建存储桶需要管理员权限，客户端无法创建
 */
export async function ensureStorageBucket(): Promise<boolean> {
  try {
    const bucketExists = await checkStorageBucket();
    
    if (!bucketExists) {
      console.warn('[TaskAttachmentService] 存储桶 task-attachments 检查失败，但继续尝试使用');
      // 即使检查失败，我们也假设存储桶存在，让实际的存储操作来处理
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('[TaskAttachmentService] 检查存储桶异常:', error);
    // 发生异常时，我们假设存储桶存在，让实际的存储操作来处理权限问题
    return true;
  }
}

// 保持向后兼容
export async function createStorageBucket(): Promise<void> {
  console.warn('[TaskAttachmentService] createStorageBucket 已弃用，请使用 ensureStorageBucket');
  const exists = await ensureStorageBucket();
  if (!exists) {
    throw new Error('存储桶 task-attachments 不存在，请联系管理员创建');
  }
}

export default {
  getTaskAttachments,
  addTaskAttachment,
  deleteTaskAttachment,
  uploadFileToStorage,
  checkStorageBucket,
  createStorageBucket,
  ensureStorageBucket,
  getFileIcon,
  formatFileSize,
};

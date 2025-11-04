/**
 * Supabase Storage 服务
 * 处理文件上传和管理
 */

import { supabase } from '../lib/supabase';

// Storage bucket 名称
const KNOWLEDGE_FILES_BUCKET = 'knowledge-files';
const KNOWLEDGE_THUMBNAILS_BUCKET = 'knowledge-thumbnails';

/**
 * 初始化 Storage buckets（仅需执行一次）
 */
export async function initializeStorageBuckets() {
  try {
    // 创建文件 bucket
    const { error: filesError } = await supabase.storage.createBucket(KNOWLEDGE_FILES_BUCKET, {
      public: true,
      fileSizeLimit: 104857600, // 100MB
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo'
      ]
    });

    if (filesError && !filesError.message.includes('already exists')) {
      console.error('创建文件bucket失败:', filesError);
    }

    // 创建缩略图 bucket
    const { error: thumbnailsError } = await supabase.storage.createBucket(KNOWLEDGE_THUMBNAILS_BUCKET, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });

    if (thumbnailsError && !thumbnailsError.message.includes('already exists')) {
      console.error('创建缩略图bucket失败:', thumbnailsError);
    }

    console.log('✅ Storage buckets 初始化完成');
  } catch (error) {
    console.error('初始化Storage失败:', error);
  }
}

/**
 * 上传文件到 Storage
 */
export async function uploadFile(file: File, folder: string = ''): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(KNOWLEDGE_FILES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('上传文件失败:', error);
      return null;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(KNOWLEDGE_FILES_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('上传文件异常:', error);
    return null;
  }
}

/**
 * 上传缩略图
 */
export async function uploadThumbnail(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(KNOWLEDGE_THUMBNAILS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('上传缩略图失败:', error);
      return null;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(KNOWLEDGE_THUMBNAILS_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('上传缩略图异常:', error);
    return null;
  }
}

/**
 * 删除文件
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // 从URL提取文件路径
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    const { error } = await supabase.storage
      .from(KNOWLEDGE_FILES_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error('删除文件失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除文件异常:', error);
    return false;
  }
}

/**
 * 删除缩略图
 */
export async function deleteThumbnail(thumbnailUrl: string): Promise<boolean> {
  try {
    const url = new URL(thumbnailUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    const { error } = await supabase.storage
      .from(KNOWLEDGE_THUMBNAILS_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error('删除缩略图失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除缩略图异常:', error);
    return false;
  }
}

/**
 * 获取文件大小（格式化）
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(baseType);
    }
    return file.type === type;
  });
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}


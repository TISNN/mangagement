/**
 * 云文档服务层
 * 负责所有与云文档相关的数据库操作
 */

import { supabase } from '../lib/supabase';
import { formatDateTime } from '../utils/dateUtils';

export interface CloudDocument {
  id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  title: string;
  content: string | null;
  status: 'draft' | 'published' | 'archived';
  category: string | null;
  tags: string[] | null;
  location: string | null;
  is_favorite: boolean;
  views: number;
  last_accessed_at: string | null;
  // 关联的员工信息
  creator?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CloudDocumentStats {
  activeDocuments: number; // 活跃协作文档（published 状态）
  draftDocuments: number; // 草稿文档
  archivedDocuments: number; // 已归档文档
  favoriteDocuments: number; // 收藏文档
}

/**
 * 获取最近打开的文档（按更新时间排序）
 */
export async function getRecentDocuments(limit: number = 10): Promise<CloudDocument[]> {
  try {
    // 先获取文档列表
    const { data: documents, error: docsError } = await supabase
      .from('cloud_documents')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (docsError) throw docsError;

    if (!documents || documents.length === 0) {
      return [];
    }

    // 获取所有创建人ID
    const creatorIds = [...new Set(documents.map(doc => doc.created_by))];
    
    // 批量获取员工信息
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, email')
      .in('id', creatorIds);

    if (empError) {
      console.warn('获取员工信息失败，继续返回文档数据:', empError);
    }

    // 创建员工映射
    const employeeMap = new Map(
      (employees || []).map(emp => [emp.id, emp])
    );

    // 合并数据
    return documents.map((doc: any) => ({
      ...doc,
      creator: employeeMap.get(doc.created_by) ? {
        id: employeeMap.get(doc.created_by)!.id,
        name: employeeMap.get(doc.created_by)!.name || '未知用户',
        email: employeeMap.get(doc.created_by)!.email || '',
      } : undefined,
    }));
  } catch (error) {
    console.error('获取最近文档失败:', error);
    throw error;
  }
}

/**
 * 获取收藏的文档（置顶空间）
 */
export async function getFavoriteDocuments(limit: number = 10): Promise<CloudDocument[]> {
  try {
    // 先获取收藏文档列表
    const { data: documents, error: docsError } = await supabase
      .from('cloud_documents')
      .select('*')
      .eq('is_favorite', true)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (docsError) throw docsError;

    if (!documents || documents.length === 0) {
      return [];
    }

    // 获取所有创建人ID
    const creatorIds = [...new Set(documents.map(doc => doc.created_by))];
    
    // 批量获取员工信息
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, email')
      .in('id', creatorIds);

    if (empError) {
      console.warn('获取员工信息失败，继续返回文档数据:', empError);
    }

    // 创建员工映射
    const employeeMap = new Map(
      (employees || []).map(emp => [emp.id, emp])
    );

    // 合并数据
    return documents.map((doc: any) => ({
      ...doc,
      creator: employeeMap.get(doc.created_by) ? {
        id: employeeMap.get(doc.created_by)!.id,
        name: employeeMap.get(doc.created_by)!.name || '未知用户',
        email: employeeMap.get(doc.created_by)!.email || '',
      } : undefined,
    }));
  } catch (error) {
    console.error('获取收藏文档失败:', error);
    throw error;
  }
}

/**
 * 获取云文档统计数据
 */
export async function getCloudDocumentStats(): Promise<CloudDocumentStats> {
  try {
    // 获取所有文档
    const { data, error } = await supabase
      .from('cloud_documents')
      .select('status, is_favorite');

    if (error) throw error;

    const documents = data || [];
    
    return {
      activeDocuments: documents.filter(doc => doc.status === 'published').length,
      draftDocuments: documents.filter(doc => doc.status === 'draft').length,
      archivedDocuments: documents.filter(doc => doc.status === 'archived').length,
      favoriteDocuments: documents.filter(doc => doc.is_favorite === true).length,
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    throw error;
  }
}

/**
 * 获取所有文档（支持筛选）
 */
export async function getAllDocuments(filters?: {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  search?: string;
  limit?: number;
}): Promise<CloudDocument[]> {
  try {
    let query = supabase
      .from('cloud_documents')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    query = query.order('updated_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data: documents, error } = await query;

    if (error) throw error;

    if (!documents || documents.length === 0) {
      return [];
    }

    // 获取所有创建人ID
    const creatorIds = [...new Set(documents.map(doc => doc.created_by))];
    
    // 批量获取员工信息
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, email')
      .in('id', creatorIds);

    if (empError) {
      console.warn('获取员工信息失败，继续返回文档数据:', empError);
    }

    // 创建员工映射
    const employeeMap = new Map(
      (employees || []).map(emp => [emp.id, emp])
    );

    // 合并数据
    return documents.map((doc: any) => ({
      ...doc,
      creator: employeeMap.get(doc.created_by) ? {
        id: employeeMap.get(doc.created_by)!.id,
        name: employeeMap.get(doc.created_by)!.name || '未知用户',
        email: employeeMap.get(doc.created_by)!.email || '',
      } : undefined,
    }));
  } catch (error) {
    console.error('获取文档列表失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取单个文档
 */
export async function getDocumentById(id: number): Promise<CloudDocument | null> {
  try {
    const { data: doc, error } = await supabase
      .from('cloud_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!doc) return null;

    // 获取创建人信息
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, name, email')
      .eq('id', doc.created_by)
      .single();

    if (empError) {
      console.warn('获取员工信息失败:', empError);
    }

    return {
      ...doc,
      creator: employee ? {
        id: employee.id,
        name: employee.name || '未知用户',
        email: employee.email || '',
      } : undefined,
    };
  } catch (error) {
    console.error('获取文档失败:', error);
    throw error;
  }
}

/**
 * 更新文档的最后访问时间
 */
export async function updateLastAccessedAt(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('cloud_documents')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('更新访问时间失败:', error);
    // 不抛出错误，因为这不是关键操作
  }
}

/**
 * 删除文档
 */
export async function deleteDocument(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('cloud_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('删除文档失败:', error);
    throw error;
  }
}

/**
 * 格式化文档状态为中文
 */
export function formatDocumentStatus(status: string): '草稿' | '进行中' | '已归档' {
  switch (status) {
    case 'draft':
      return '草稿';
    case 'published':
      return '进行中';
    case 'archived':
      return '已归档';
    default:
      return '草稿';
  }
}

/**
 * 格式化更新时间（相对时间）
 */
export function formatDocumentUpdatedAt(updatedAt: string): string {
  try {
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return '刚刚';
    } else if (diffMins < 60) {
      return `${diffMins} 分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours} 小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      return formatDateTime(date);
    }
  } catch {
    return '未知时间';
  }
}


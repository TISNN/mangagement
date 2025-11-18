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
  student_id?: number | null; // 关联的学生ID
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

export interface CloudDocumentCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: number;
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
  categoryId?: number; // 按分类ID筛选
  location?: string;
  search?: string;
  studentId?: number; // 按学生ID筛选
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

    if (filters?.location) {
      query = query.eq('location', filters.location);
    }

    if (filters?.studentId) {
      query = query.eq('student_id', filters.studentId);
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

    // 如果按分类ID筛选，需要过滤文档
    let filteredDocuments = documents;
    if (filters?.categoryId) {
      // 获取该分类下的所有文档ID
      const { data: relations, error: relError } = await supabase
        .from('cloud_document_category_relations')
        .select('document_id')
        .eq('category_id', filters.categoryId);

      if (relError) {
        console.warn('获取分类关联失败:', relError);
      } else {
        const documentIds = new Set((relations || []).map(r => r.document_id));
        filteredDocuments = documents.filter((doc: any) => documentIds.has(doc.id));
      }
    }

    // 获取所有创建人ID
    const creatorIds = [...new Set(filteredDocuments.map((doc: any) => doc.created_by))];
    
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
    return filteredDocuments.map((doc: any) => ({
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
 * 获取指定学生的所有文档
 */
export async function getDocumentsByStudentId(studentId: number): Promise<CloudDocument[]> {
  try {
    return await getAllDocuments({ studentId });
  } catch (error) {
    console.error('获取学生文档失败:', error);
    throw error;
  }
}

/**
 * 获取所有文档分类（从新表获取）
 */
export async function getAllDocumentCategories(): Promise<CloudDocumentCategory[]> {
  try {
    const { data, error } = await supabase
      .from('cloud_document_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []) as CloudDocumentCategory[];
  } catch (error) {
    console.error('获取文档分类失败:', error);
    throw error;
  }
}

/**
 * 获取所有文档分类（location）- 兼容旧接口
 * @deprecated 使用 getAllDocumentCategories 替代
 */
export async function getAllDocumentLocations(): Promise<string[]> {
  try {
    // 优先从新表获取
    const categories = await getAllDocumentCategories();
    if (categories.length > 0) {
      return categories.map(cat => cat.name);
    }

    // 如果没有新表数据，从旧字段获取（向后兼容）
    const { data, error } = await supabase
      .from('cloud_documents')
      .select('location');

    if (error) throw error;

    // 提取所有非空的 location，去重并排序
    const locations = [...new Set((data || [])
      .map(doc => doc.location)
      .filter((loc): loc is string => loc !== null && loc !== ''))];

    return locations.sort();
  } catch (error) {
    console.error('获取文档分类失败:', error);
    throw error;
  }
}

/**
 * 获取或创建分类（如果不存在则创建）
 */
export async function getOrCreateCategory(name: string, description?: string): Promise<CloudDocumentCategory> {
  try {
    // 先查找是否已存在
    const { data: existing } = await supabase
      .from('cloud_document_categories')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (existing) {
      return existing as CloudDocumentCategory;
    }

    // 不存在则创建
    return await createCategory(name, description);
  } catch (error) {
    // 如果查询失败（可能是真的不存在），尝试创建
    if ((error as any).code === 'PGRST116') {
      return await createCategory(name, description);
    }
    throw error;
  }
}

/**
 * 创建分类
 */
export async function createCategory(name: string, description?: string): Promise<CloudDocumentCategory> {
  try {
    // 从 localStorage 获取当前用户信息
    const employeeData = localStorage.getItem('currentEmployee');
    if (!employeeData) {
      throw new Error('用户信息获取失败');
    }

    const employee = JSON.parse(employeeData);

    const { data, error } = await supabase
      .from('cloud_document_categories')
      .insert({
        name: name.trim(),
        description: description || null,
        created_by: employee.id,
      })
      .select()
      .single();

    if (error) throw error;

    return data as CloudDocumentCategory;
  } catch (error) {
    console.error('创建分类失败:', error);
    throw error;
  }
}

/**
 * 删除分类
 */
export async function deleteCategory(categoryId: number): Promise<void> {
  try {
    // 删除分类会自动删除关联关系（外键级联删除）
    const { error } = await supabase
      .from('cloud_document_categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
  } catch (error) {
    console.error('删除分类失败:', error);
    throw error;
  }
}

/**
 * 将文档添加到分类
 */
export async function addDocumentToCategory(documentId: number, categoryId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('cloud_document_category_relations')
      .insert({
        document_id: documentId,
        category_id: categoryId,
      });

    if (error) {
      // 如果是唯一约束错误，说明已经存在，忽略
      if (error.code !== '23505') {
        throw error;
      }
    }
  } catch (error) {
    console.error('添加文档到分类失败:', error);
    throw error;
  }
}

/**
 * 从分类移除文档
 */
export async function removeDocumentFromCategory(documentId: number, categoryId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('cloud_document_category_relations')
      .delete()
      .eq('document_id', documentId)
      .eq('category_id', categoryId);

    if (error) throw error;
  } catch (error) {
    console.error('从分类移除文档失败:', error);
    throw error;
  }
}

/**
 * 获取文档的所有分类
 */
export async function getDocumentCategories(documentId: number): Promise<CloudDocumentCategory[]> {
  try {
    const { data, error } = await supabase
      .from('cloud_document_category_relations')
      .select(`
        category_id,
        cloud_document_categories (*)
      `)
      .eq('document_id', documentId);

    if (error) throw error;

    return (data || [])
      .map((item: any) => item.cloud_document_categories)
      .filter(Boolean) as CloudDocumentCategory[];
  } catch (error) {
    console.error('获取文档分类失败:', error);
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
 * 更新文档状态
 */
export async function updateDocumentStatus(
  id: number,
  status: 'draft' | 'published' | 'archived'
): Promise<void> {
  try {
    const { error } = await supabase
      .from('cloud_documents')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('更新文档状态失败:', error);
    throw error;
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


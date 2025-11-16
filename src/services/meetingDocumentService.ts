/**
 * 会议文档服务层
 * 负责所有与会议文档相关的数据库操作
 */

import { supabase } from '../lib/supabase';

export interface MeetingDocument {
  id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  title: string;
  content: string | null;
  // 关联的员工信息
  creator?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * 获取所有会议文档（支持筛选）
 */
export async function getAllMeetingDocuments(filters?: {
  search?: string;
  limit?: number;
}): Promise<MeetingDocument[]> {
  try {
    let query = supabase
      .from('meeting_documents')
      .select('*');

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
    console.error('获取会议文档列表失败:', error);
    throw error;
  }
}


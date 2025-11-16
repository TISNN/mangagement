/**
 * 文档批注服务层
 * 负责所有与文档批注相关的数据库操作
 */

import { supabase } from '../lib/supabase';
import { formatDateTime } from '../utils/dateUtils';

export interface DocumentAnnotation {
  id: number;
  created_at: string;
  updated_at: string;
  document_id: number;
  created_by: number;
  content: string;
  selected_text: string | null;
  start_pos: number | null;
  end_pos: number | null;
  parent_id: number | null;
  is_resolved: boolean;
  // 关联的员工信息
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  // 子批注（回复）
  replies?: DocumentAnnotation[];
}

/**
 * 获取文档的所有批注
 */
export async function getDocumentAnnotations(documentId: number): Promise<DocumentAnnotation[]> {
  try {
    const { data: annotations, error } = await supabase
      .from('document_annotations')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!annotations || annotations.length === 0) {
      return [];
    }

    // 获取所有创建人ID
    const creatorIds = [...new Set(annotations.map(ann => ann.created_by))];

    // 批量获取员工信息
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, email')
      .in('id', creatorIds);

    if (empError) {
      console.warn('获取员工信息失败，继续返回批注数据:', empError);
    }

    // 创建员工映射
    const employeeMap = new Map(
      (employees || []).map(emp => [emp.id, emp])
    );

    // 合并数据并构建树形结构
    const annotationsWithCreator = annotations.map((ann: any) => ({
      ...ann,
      creator: employeeMap.get(ann.created_by) ? {
        id: employeeMap.get(ann.created_by)!.id,
        name: employeeMap.get(ann.created_by)!.name || '未知用户',
        email: employeeMap.get(ann.created_by)!.email || '',
      } : undefined,
    }));

    // 构建树形结构（主批注和回复）
    const mainAnnotations = annotationsWithCreator.filter(ann => !ann.parent_id);
    const replies = annotationsWithCreator.filter(ann => ann.parent_id);

    const annotationMap = new Map(mainAnnotations.map(ann => [ann.id, { ...ann, replies: [] }]));

    replies.forEach(reply => {
      const parent = annotationMap.get(reply.parent_id!);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(reply);
      }
    });

    return Array.from(annotationMap.values());
  } catch (error) {
    console.error('获取文档批注失败:', error);
    throw error;
  }
}

/**
 * 创建批注
 */
export async function createAnnotation(data: {
  document_id: number;
  created_by: number;
  content: string;
  selected_text?: string;
  start_pos?: number;
  end_pos?: number;
  parent_id?: number;
}): Promise<DocumentAnnotation> {
  try {
    const { data: annotation, error } = await supabase
      .from('document_annotations')
      .insert({
        document_id: data.document_id,
        created_by: data.created_by,
        content: data.content,
        selected_text: data.selected_text || null,
        start_pos: data.start_pos || null,
        end_pos: data.end_pos || null,
        parent_id: data.parent_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    // 获取创建人信息
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, name, email')
      .eq('id', data.created_by)
      .single();

    if (empError) {
      console.warn('获取员工信息失败:', empError);
    }

    return {
      ...annotation,
      creator: employee ? {
        id: employee.id,
        name: employee.name || '未知用户',
        email: employee.email || '',
      } : undefined,
      replies: [],
    };
  } catch (error) {
    console.error('创建批注失败:', error);
    throw error;
  }
}

/**
 * 更新批注
 */
export async function updateAnnotation(
  annotationId: number,
  content: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_annotations')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', annotationId);

    if (error) throw error;
  } catch (error) {
    console.error('更新批注失败:', error);
    throw error;
  }
}

/**
 * 删除批注
 */
export async function deleteAnnotation(annotationId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_annotations')
      .delete()
      .eq('id', annotationId);

    if (error) throw error;
  } catch (error) {
    console.error('删除批注失败:', error);
    throw error;
  }
}

/**
 * 标记批注为已解决/未解决
 */
export async function toggleAnnotationResolved(
  annotationId: number,
  isResolved: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_annotations')
      .update({
        is_resolved: isResolved,
        updated_at: new Date().toISOString(),
      })
      .eq('id', annotationId);

    if (error) throw error;
  } catch (error) {
    console.error('更新批注状态失败:', error);
    throw error;
  }
}

/**
 * 格式化批注时间（相对时间）
 */
export function formatAnnotationTime(time: string): string {
  try {
    const date = new Date(time);
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


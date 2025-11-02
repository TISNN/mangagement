/**
 * 会议管理服务层
 * 处理所有与会议相关的数据库操作
 */

import { supabase } from '../../../../lib/supabase';
import { Meeting, MeetingDB, MeetingFormData, MeetingFilter, MeetingStats } from '../types';

// ==================== 会议列表 ====================

/**
 * 获取会议列表
 */
export async function getMeetings(filter?: MeetingFilter): Promise<Meeting[]> {
  try {
    let query = supabase
      .from('meetings')
      .select(`
        *,
        employees:created_by(name)
      `)
      .order('start_time', { ascending: false });

    // 搜索过滤
    if (filter?.search) {
      query = query.or(`title.ilike.%${filter.search}%,summary.ilike.%${filter.search}%`);
    }

    // 类型过滤
    if (filter?.meeting_type && filter.meeting_type !== 'all') {
      query = query.eq('meeting_type', filter.meeting_type);
    }

    // 状态过滤
    if (filter?.status && filter.status !== 'all') {
      query = query.eq('status', filter.status);
    }

    // 日期范围过滤
    if (filter?.date_range?.start) {
      query = query.gte('start_time', filter.date_range.start);
    }
    if (filter?.date_range?.end) {
      query = query.lte('start_time', filter.date_range.end);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(transformDbToFrontend);
  } catch (error) {
    console.error('获取会议列表失败:', error);
    return [];
  }
}

/**
 * 获取单个会议详情
 */
export async function getMeetingById(id: number): Promise<Meeting | null> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        employees:created_by(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformDbToFrontend(data);
  } catch (error) {
    console.error('获取会议详情失败:', error);
    return null;
  }
}

/**
 * 创建会议
 */
export async function createMeeting(formData: MeetingFormData, userId: number): Promise<Meeting | null> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        title: formData.title,
        meeting_type: formData.meeting_type,
        status: formData.status,
        start_time: formData.start_time,
        end_time: formData.end_time || null,
        location: formData.location || null,
        meeting_link: formData.meeting_link || null,
        participants: formData.participants,
        agenda: formData.agenda || null,
        minutes: formData.minutes || null,
        summary: formData.summary || null,
        attachments: formData.attachments || null,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        employees:created_by(name)
      `)
      .single();

    if (error) throw error;
    return transformDbToFrontend(data);
  } catch (error) {
    console.error('创建会议失败:', error);
    throw error;
  }
}

/**
 * 更新会议
 */
export async function updateMeeting(id: number, formData: Partial<MeetingFormData>): Promise<Meeting | null> {
  try {
    const updateData: any = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        employees:created_by(name)
      `)
      .single();

    if (error) throw error;
    return transformDbToFrontend(data);
  } catch (error) {
    console.error('更新会议失败:', error);
    throw error;
  }
}

/**
 * 删除会议
 */
export async function deleteMeeting(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('删除会议失败:', error);
    return false;
  }
}

/**
 * 更新会议纪要
 */
export async function updateMeetingMinutes(id: number, minutes: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({
        minutes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('更新会议纪要失败:', error);
    return false;
  }
}

/**
 * 更新会议状态
 */
export async function updateMeetingStatus(id: number, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('更新会议状态失败:', error);
    return false;
  }
}

// ==================== 统计 ====================

/**
 * 获取会议统计
 */
export async function getMeetingStats(): Promise<MeetingStats> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('status, start_time');

    if (error) throw error;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: MeetingStats = {
      total: data?.length || 0,
      upcoming: data?.filter(m => m.status === '待举行').length || 0,
      ongoing: data?.filter(m => m.status === '进行中').length || 0,
      completed: data?.filter(m => m.status === '已完成').length || 0,
      cancelled: data?.filter(m => m.status === '已取消').length || 0,
      this_week: data?.filter(m => new Date(m.start_time) >= weekStart).length || 0,
      this_month: data?.filter(m => new Date(m.start_time) >= monthStart).length || 0,
    };

    return stats;
  } catch (error) {
    console.error('获取会议统计失败:', error);
    return {
      total: 0,
      upcoming: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0,
      this_week: 0,
      this_month: 0,
    };
  }
}

// ==================== 辅助函数 ====================

/**
 * 转换数据库格式到前端格式
 */
function transformDbToFrontend(dbData: any): Meeting {
  return {
    id: dbData.id,
    title: dbData.title,
    meeting_type: dbData.meeting_type,
    status: dbData.status,
    start_time: dbData.start_time,
    end_time: dbData.end_time,
    location: dbData.location,
    meeting_link: dbData.meeting_link,
    participants: dbData.participants || [],
    agenda: dbData.agenda,
    minutes: dbData.minutes,
    summary: dbData.summary,
    attachments: dbData.attachments || [],
    created_by: dbData.created_by,
    created_by_name: dbData.employees?.name,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at
  };
}

/**
 * 获取导师列表(用于选择参会人)
 */
export async function getMentors(): Promise<Array<{ id: number; name: string; avatar_url?: string }>> {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('id, name, avatar_url')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取导师列表失败:', error);
    return [];
  }
}

/**
 * 获取学生列表(用于选择参会人)
 */
export async function getStudents(): Promise<Array<{ id: number; name: string }>> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, full_name')
      .order('full_name');

    if (error) throw error;
    return (data || []).map(s => ({ id: s.id, name: s.full_name }));
  } catch (error) {
    console.error('获取学生列表失败:', error);
    return [];
  }
}

/**
 * 获取员工列表(用于选择参会人)
 */
export async function getEmployees(): Promise<Array<{ id: number; name: string; avatar?: string }>> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, avatar')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取员工列表失败:', error);
    return [];
  }
}




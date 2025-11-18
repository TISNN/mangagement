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

    const meeting = transformDbToFrontend(data);
    
    // 尝试查找关联的学生会议记录，获取student_id
    if (data.title && data.start_time) {
      try {
        const { data: studentMeeting } = await supabase
          .from('student_meetings')
          .select('student_id')
          .eq('title', data.title)
          .eq('start_time', data.start_time)
          .limit(1)
          .maybeSingle();
        
        if (studentMeeting?.student_id) {
          // 将student_id添加到Meeting对象中（通过扩展类型）
          (meeting as any).student_id = studentMeeting.student_id;
        }
      } catch (err) {
        // 忽略查找错误
        console.debug('查找关联学生失败:', err);
      }
    }

    return meeting;
  } catch (error) {
    console.error('获取会议详情失败:', error);
    return null;
  }
}

/**
 * 创建会议
 */
export async function createMeeting(formData: MeetingFormData, userId: number, leadId?: string): Promise<Meeting | null> {
  try {
    const payload = serializeMeetingPayload(formData, true);

    if (!payload.start_time) {
      throw new Error('会议开始时间不能为空');
    }

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        ...payload,
        attachments: formData.attachments || null,
        lead_id: leadId || null,
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
    
    // 如果指定了关联学生（且不为null），同时创建student_meetings记录
    if (formData.student_id && formData.student_id !== null && data) {
      try {
        await createStudentMeeting(data.id, formData.student_id, formData);
      } catch (studentMeetingError) {
        console.error('创建学生会议记录失败:', studentMeetingError);
        // 不抛出错误，因为主会议已经创建成功
      }
    }
    
    return transformDbToFrontend(data);
  } catch (error) {
    console.error('创建会议失败:', error);
    throw error;
  }
}

/**
 * 创建学生会议记录
 */
async function createStudentMeeting(meetingId: number, studentId: number, formData: MeetingFormData): Promise<void> {
  try {
    // 将participants数组转换为字符串数组
    const participantsArray = formData.participants?.map(p => p.name) || [];
    
    const studentMeetingData = {
      student_id: studentId,
      title: formData.title,
      summary: formData.summary || null,
      start_time: formData.start_time ? new Date(formData.start_time).toISOString() : new Date().toISOString(),
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
      participants: participantsArray.length > 0 ? participantsArray : null,
      meeting_documents: null,
      meeting_notes: formData.minutes || formData.agenda || null,
      meeting_type: formData.meeting_type || null,
      status: formData.status === '待举行' ? '已安排' : 
              formData.status === '进行中' ? '进行中' :
              formData.status === '已完成' ? '已完成' :
              formData.status === '已取消' ? '已取消' : '已安排',
      meeting_link: formData.meeting_link || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('student_meetings')
      .insert(studentMeetingData);

    if (error) throw error;
  } catch (error) {
    console.error('创建学生会议记录失败:', error);
    throw error;
  }
}

/**
 * 更新会议
 */
export async function updateMeeting(id: number, formData: Partial<MeetingFormData>, leadId?: string): Promise<Meeting | null> {
  try {
    const payload = serializeMeetingPayload(formData, false);
    const updateData: any = {
      ...payload,
      updated_at: new Date().toISOString()
    };
    
    // 如果提供了 leadId，更新关联
    if (leadId !== undefined) {
      updateData.lead_id = leadId || null;
    }

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
    
    // 处理学生关联
    if (formData.student_id !== undefined && data) {
      if (formData.student_id === null) {
        // 如果student_id明确设置为null，表示取消关联，删除对应的student_meetings记录
        try {
          await deleteStudentMeetingsByMeetingInfo(data.title, data.start_time);
        } catch (deleteError) {
          console.error('删除学生会议记录失败:', deleteError);
          // 不抛出错误，因为主会议已经更新成功
        }
      } else if (formData.student_id) {
        // 如果指定了关联学生，更新或创建student_meetings记录
        try {
          await updateOrCreateStudentMeeting(id, formData.student_id, formData);
        } catch (studentMeetingError) {
          console.error('更新学生会议记录失败:', studentMeetingError);
          // 不抛出错误，因为主会议已经更新成功
        }
      }
    }
    
    return transformDbToFrontend(data);
  } catch (error) {
    console.error('更新会议失败:', error);
    throw error;
  }
}

/**
 * 删除与会议匹配的学生会议记录
 */
async function deleteStudentMeetingsByMeetingInfo(title: string, startTime: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('student_meetings')
      .delete()
      .eq('title', title)
      .eq('start_time', startTime);

    if (error) throw error;
  } catch (error) {
    console.error('删除学生会议记录失败:', error);
    throw error;
  }
}

/**
 * 更新或创建学生会议记录
 */
async function updateOrCreateStudentMeeting(meetingId: number, studentId: number, formData: Partial<MeetingFormData>): Promise<void> {
  try {
    // 先查找是否已存在该学生和会议标题的学生会议记录
    const { data: existing, error: findError } = await supabase
      .from('student_meetings')
      .select('id')
      .eq('student_id', studentId)
      .eq('title', formData.title || '')
      .limit(1)
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    // 将participants数组转换为字符串数组
    const participantsArray = formData.participants?.map(p => p.name) || [];
    
    const studentMeetingData: any = {
      student_id: studentId,
      updated_at: new Date().toISOString()
    };

    if (formData.title !== undefined) studentMeetingData.title = formData.title;
    if (formData.summary !== undefined) studentMeetingData.summary = formData.summary || null;
    if (formData.start_time) studentMeetingData.start_time = new Date(formData.start_time).toISOString();
    if (formData.end_time !== undefined) studentMeetingData.end_time = formData.end_time ? new Date(formData.end_time).toISOString() : null;
    if (formData.participants !== undefined) studentMeetingData.participants = participantsArray.length > 0 ? participantsArray : null;
    if (formData.minutes !== undefined || formData.agenda !== undefined) {
      studentMeetingData.meeting_notes = formData.minutes || formData.agenda || null;
    }
    if (formData.meeting_type !== undefined) studentMeetingData.meeting_type = formData.meeting_type || null;
    if (formData.status !== undefined) {
      studentMeetingData.status = formData.status === '待举行' ? '已安排' : 
                                  formData.status === '进行中' ? '进行中' :
                                  formData.status === '已完成' ? '已完成' :
                                  formData.status === '已取消' ? '已取消' : '已安排';
    }
    if (formData.meeting_link !== undefined) studentMeetingData.meeting_link = formData.meeting_link || null;

    if (existing) {
      // 更新现有记录
      const { error: updateError } = await supabase
        .from('student_meetings')
        .update(studentMeetingData)
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      // 创建新记录
      studentMeetingData.created_at = new Date().toISOString();
      const { error: insertError } = await supabase
        .from('student_meetings')
        .insert(studentMeetingData);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('更新或创建学生会议记录失败:', error);
    throw error;
  }
}

/**
 * 获取关联到指定线索的所有会议
 */
export async function getMeetingsByLeadId(leadId: string): Promise<Meeting[]> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        employees:created_by(name)
      `)
      .eq('lead_id', leadId)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformDbToFrontend);
  } catch (error) {
    console.error('获取线索关联会议失败:', error);
    return [];
  }
}

/**
 * 关联会议到线索
 */
export async function associateMeetingToLead(meetingId: number, leadId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({
        lead_id: leadId,
        updated_at: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('关联会议到线索失败:', error);
    return false;
  }
}

/**
 * 取消会议与线索的关联
 */
export async function disassociateMeetingFromLead(meetingId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({
        lead_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('取消会议关联失败:', error);
    return false;
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
    lead_id: dbData.lead_id,
    created_by: dbData.created_by,
    created_by_name: dbData.employees?.name,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at
  };
}

function toISOStringOrNull(value?: string): string | null | undefined {
  if (value === undefined) return undefined;
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    console.warn('Invalid date value,忽略:', value);
    return null;
  }
  return date.toISOString();
}

function nullableString(value?: string): string | null | undefined {
  if (value === undefined) return undefined;
  return value?.trim() ? value : null;
}

function serializeMeetingPayload(formData: Partial<MeetingFormData>, includeDefaults: boolean) {
  const payload: any = {};

  if (formData.title !== undefined) payload.title = formData.title;
  if (formData.meeting_type !== undefined) payload.meeting_type = formData.meeting_type;
  if (formData.status !== undefined) payload.status = formData.status;

  const startTime = toISOStringOrNull(formData.start_time);
  if (startTime !== undefined) payload.start_time = startTime;
  const endTime = toISOStringOrNull(formData.end_time);
  if (endTime !== undefined) payload.end_time = endTime;

  const location = nullableString(formData.location);
  if (location !== undefined) payload.location = location;
  const meetingLink = nullableString(formData.meeting_link);
  if (meetingLink !== undefined) payload.meeting_link = meetingLink;
  const agenda = nullableString(formData.agenda);
  if (agenda !== undefined) payload.agenda = agenda;
  const summary = nullableString(formData.summary);
  if (summary !== undefined) payload.summary = summary;
  const minutes = nullableString(formData.minutes);
  if (minutes !== undefined) payload.minutes = minutes;

  if (formData.participants !== undefined) {
    payload.participants = formData.participants;
  } else if (includeDefaults) {
    payload.participants = [];
  }

  if (includeDefaults) {
    if (payload.location === undefined) payload.location = null;
    if (payload.meeting_link === undefined) payload.meeting_link = null;
    if (payload.agenda === undefined) payload.agenda = null;
    if (payload.summary === undefined) payload.summary = null;
    if (payload.minutes === undefined) payload.minutes = null;
  }

  return payload;
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
      .select('id, name')
      .order('name');

    if (error) throw error;
    return (data || []).map(s => ({ id: s.id, name: s.name || `学生${s.id}` }));
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









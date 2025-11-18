/**
 * 定期会议服务层
 * 处理定期会议模板的创建、更新、删除和实例生成
 */

import { supabase } from '../../../../lib/supabase';
import { 
  RecurringMeetingTemplate, 
  RecurringMeetingTemplateFormData,
  RecurringMeetingInstance,
  RecurringFrequency,
  RecurringEndType
} from '../types/recurring';
import { createMeeting, MeetingFormData } from './meetingService';

// ==================== 创建定期会议模板 ====================

/**
 * 创建定期会议模板
 */
export async function createRecurringMeetingTemplate(
  formData: RecurringMeetingTemplateFormData,
  userId: number
): Promise<RecurringMeetingTemplate> {
  try {
    // 准备插入数据
    const templateData: any = {
      title: formData.title,
      meeting_type: formData.meeting_type,
      frequency: formData.frequency,
      interval_value: formData.interval_value || 1,
      day_of_week: formData.day_of_week || [],
      start_time: formData.start_time,
      duration_minutes: formData.duration_minutes || 60,
      end_type: formData.end_type,
      location: formData.location || null,
      meeting_link: formData.meeting_link || null,
      agenda: formData.agenda || null,
      participants: formData.participants || [],
      student_id: formData.student_id || null,
      created_by: userId,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 根据频率设置不同的字段
    if (formData.frequency === 'monthly') {
      if (formData.day_of_month !== undefined) {
        templateData.day_of_month = formData.day_of_month;
      }
      if (formData.week_of_month !== undefined) {
        templateData.week_of_month = formData.week_of_month;
      }
    }

    // 设置结束条件
    if (formData.end_type === 'after_occurrences' && formData.end_after_occurrences) {
      templateData.end_after_occurrences = formData.end_after_occurrences;
    }
    if (formData.end_type === 'on_date' && formData.end_on_date) {
      templateData.end_on_date = formData.end_on_date;
    }

    const { data, error } = await supabase
      .from('recurring_meeting_templates')
      .insert(templateData)
      .select()
      .single();

    if (error) throw error;

    // 创建模板后，立即生成未来1个月的实例
    await generateMeetingInstances(data.id);

    return data;
  } catch (error) {
    console.error('创建定期会议模板失败:', error);
    throw error;
  }
}

// ==================== 获取定期会议模板 ====================

/**
 * 获取所有定期会议模板
 */
export async function getRecurringMeetingTemplates(
  studentId?: number
): Promise<RecurringMeetingTemplate[]> {
  try {
    let query = supabase
      .from('recurring_meeting_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取定期会议模板失败:', error);
    return [];
  }
}

/**
 * 根据ID获取定期会议模板
 */
export async function getRecurringMeetingTemplateById(
  id: number
): Promise<RecurringMeetingTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('recurring_meeting_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取定期会议模板失败:', error);
    return null;
  }
}

// ==================== 更新定期会议模板 ====================

/**
 * 更新定期会议模板
 */
export async function updateRecurringMeetingTemplate(
  id: number,
  formData: Partial<RecurringMeetingTemplateFormData>
): Promise<RecurringMeetingTemplate> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (formData.title !== undefined) updateData.title = formData.title;
    if (formData.meeting_type !== undefined) updateData.meeting_type = formData.meeting_type;
    if (formData.frequency !== undefined) updateData.frequency = formData.frequency;
    if (formData.interval_value !== undefined) updateData.interval_value = formData.interval_value;
    if (formData.day_of_week !== undefined) updateData.day_of_week = formData.day_of_week;
    if (formData.start_time !== undefined) updateData.start_time = formData.start_time;
    if (formData.duration_minutes !== undefined) updateData.duration_minutes = formData.duration_minutes;
    if (formData.end_type !== undefined) updateData.end_type = formData.end_type;
    if (formData.location !== undefined) updateData.location = formData.location || null;
    if (formData.meeting_link !== undefined) updateData.meeting_link = formData.meeting_link || null;
    if (formData.agenda !== undefined) updateData.agenda = formData.agenda || null;
    if (formData.participants !== undefined) updateData.participants = formData.participants;
    if (formData.student_id !== undefined) updateData.student_id = formData.student_id || null;

    if (formData.frequency === 'monthly') {
      if (formData.day_of_month !== undefined) updateData.day_of_month = formData.day_of_month;
      if (formData.week_of_month !== undefined) updateData.week_of_month = formData.week_of_month;
    }

    if (formData.end_type === 'after_occurrences' && formData.end_after_occurrences !== undefined) {
      updateData.end_after_occurrences = formData.end_after_occurrences;
    }
    if (formData.end_type === 'on_date' && formData.end_on_date !== undefined) {
      updateData.end_on_date = formData.end_on_date;
    }

    const { data, error } = await supabase
      .from('recurring_meeting_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('更新定期会议模板失败:', error);
    throw error;
  }
}

// ==================== 删除定期会议模板 ====================

/**
 * 删除定期会议模板（软删除，设置为非激活）
 */
export async function deleteRecurringMeetingTemplate(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recurring_meeting_templates')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('删除定期会议模板失败:', error);
    return false;
  }
}

// ==================== 生成会议实例 ====================

/**
 * 为定期会议模板生成会议实例
 * @param templateId 模板ID
 * @param monthsAhead 生成未来几个月的实例（默认1个月）
 */
export async function generateMeetingInstances(
  templateId: number,
  monthsAhead: number = 1
): Promise<number> {
  try {
    // 获取模板信息
    const template = await getRecurringMeetingTemplateById(templateId);
    if (!template || !template.is_active) {
      console.warn('模板不存在或已停用:', templateId);
      return 0;
    }

    // 计算生成日期范围
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + monthsAhead);

    // 获取已生成的实例日期
    const { data: existingInstances } = await supabase
      .from('recurring_meeting_instances')
      .select('instance_date')
      .eq('template_id', templateId)
      .eq('is_cancelled', false);

    const existingDates = new Set(
      (existingInstances || []).map(inst => inst.instance_date)
    );

    // 生成日期列表
    const datesToGenerate = calculateRecurringDates(template, now, endDate, existingDates);

    if (datesToGenerate.length === 0) {
      return 0;
    }

    // 为每个日期创建会议实例
    let createdCount = 0;
    for (const dateStr of datesToGenerate) {
      try {
        const meetingDate = new Date(dateStr);
        const startDateTime = new Date(meetingDate);
        const [hours, minutes] = template.start_time.split(':').map(Number);
        startDateTime.setHours(hours, minutes, 0, 0);

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + template.duration_minutes);

        // 创建会议
        const meetingFormData: MeetingFormData = {
          title: template.title,
          meeting_type: template.meeting_type as any,
          status: '待举行',
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          location: template.location || undefined,
          meeting_link: template.meeting_link || undefined,
          agenda: template.agenda || undefined,
          participants: template.participants || [],
          student_id: template.student_id || undefined
        };

        const meeting = await createMeeting(meetingFormData, template.created_by);

        if (meeting) {
          // 创建实例关联记录
          const { error: instanceError } = await supabase
            .from('recurring_meeting_instances')
            .insert({
              template_id: templateId,
              meeting_id: meeting.id,
              instance_date: dateStr,
              is_cancelled: false,
              created_at: new Date().toISOString()
            });

          if (!instanceError) {
            createdCount++;
          } else {
            console.error('创建实例关联失败:', instanceError);
          }
        }
      } catch (error) {
        console.error(`生成实例失败 (${dateStr}):`, error);
      }
    }

    return createdCount;
  } catch (error) {
    console.error('生成会议实例失败:', error);
    throw error;
  }
}

/**
 * 计算定期会议的日期列表
 */
function calculateRecurringDates(
  template: RecurringMeetingTemplate,
  startDate: Date,
  endDate: Date,
  existingDates: Set<string>
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    let shouldInclude = false;

    switch (template.frequency) {
      case 'daily':
        shouldInclude = true;
        break;

      case 'weekly':
        if (template.day_of_week.includes(current.getDay())) {
          // 检查间隔
          const weeksSinceStart = Math.floor(
            (current.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
          if (weeksSinceStart % template.interval_value === 0) {
            shouldInclude = true;
          }
        }
        break;

      case 'biweekly':
        if (template.day_of_week.includes(current.getDay())) {
          const weeksSinceStart = Math.floor(
            (current.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
          if (weeksSinceStart % 2 === 0) {
            shouldInclude = true;
          }
        }
        break;

      case 'monthly':
        if (template.day_of_month !== undefined) {
          // 每月第N天
          if (current.getDate() === template.day_of_month) {
            shouldInclude = true;
          }
        } else if (template.week_of_month !== undefined && template.day_of_week.length > 0) {
          // 每月第N周的星期X
          const firstDayOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
          const firstTargetDay = new Date(firstDayOfMonth);
          const targetDayOfWeek = template.day_of_week[0];
          const dayOffset = (targetDayOfWeek - firstDayOfMonth.getDay() + 7) % 7;
          firstTargetDay.setDate(1 + dayOffset);

          if (template.week_of_month === -1) {
            // 最后一周
            const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);
            const lastTargetDay = new Date(lastDayOfMonth);
            const lastDayOffset = (targetDayOfWeek - lastDayOfMonth.getDay() + 7) % 7;
            lastTargetDay.setDate(lastDayOfMonth.getDate() - lastDayOffset);

            if (current.toDateString() === lastTargetDay.toDateString()) {
              shouldInclude = true;
            }
          } else {
            // 第N周
            firstTargetDay.setDate(firstTargetDay.getDate() + (template.week_of_month - 1) * 7);
            if (current.toDateString() === firstTargetDay.toDateString()) {
              shouldInclude = true;
            }
          }
        }
        break;
    }

    // 检查结束条件
    if (shouldInclude) {
      const dateStr = current.toISOString().split('T')[0];

      // 检查是否已存在
      if (!existingDates.has(dateStr)) {
        // 检查结束条件
        let shouldAdd = true;

        if (template.end_type === 'on_date' && template.end_on_date) {
          if (dateStr > template.end_on_date) {
            shouldAdd = false;
          }
        }

        if (shouldAdd) {
          dates.push(dateStr);
        }
      }
    }

    // 移动到下一天
    current.setDate(current.getDate() + 1);
  }

  // 如果设置了"结束于N次后"，只保留前N个
  if (template.end_type === 'after_occurrences' && template.end_after_occurrences) {
    return dates.slice(0, template.end_after_occurrences);
  }

  return dates;
}

// ==================== 获取实例 ====================

/**
 * 获取定期会议模板的实例列表
 */
export async function getRecurringMeetingInstances(
  templateId: number
): Promise<RecurringMeetingInstance[]> {
  try {
    const { data, error } = await supabase
      .from('recurring_meeting_instances')
      .select('*')
      .eq('template_id', templateId)
      .order('instance_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取定期会议实例失败:', error);
    return [];
  }
}

/**
 * 取消定期会议实例
 */
export async function cancelRecurringMeetingInstance(instanceId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recurring_meeting_instances')
      .update({ is_cancelled: true })
      .eq('id', instanceId);

    if (error) throw error;

    // 同时取消对应的会议
    const { data: instance } = await supabase
      .from('recurring_meeting_instances')
      .select('meeting_id')
      .eq('id', instanceId)
      .single();

    if (instance?.meeting_id) {
      await supabase
        .from('meetings')
        .update({ status: '已取消', updated_at: new Date().toISOString() })
        .eq('id', instance.meeting_id);
    }

    return true;
  } catch (error) {
    console.error('取消定期会议实例失败:', error);
    return false;
  }
}


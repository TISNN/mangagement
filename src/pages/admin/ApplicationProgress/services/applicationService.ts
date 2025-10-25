/**
 * 申请进度管理 - Supabase服务层
 * 处理所有与申请进度相关的数据库操作
 */

import { supabase } from '../../../../lib/supabase';
import {
  StudentProfile,
  StudentMeeting,
  FinalUniversityChoice,
  ApplicationDocument,
  ApplicationOverview,
  ApplicationStats,
  StudentProfileForm,
  StudentMeetingForm,
  UniversityChoiceForm,
  ApplicationDocumentForm
} from '../types';

// ==================== 学生申请档案 ====================

export const studentProfileService = {
  /**
   * 获取学生申请档案
   */
  async getProfileByStudentId(studentId: number): Promise<StudentProfile | null> {
    try {
      const { data, error } = await supabase
        .from('student_profile')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取学生档案失败:', error);
      return null;
    }
  },

  /**
   * 创建或更新学生档案
   */
  async upsertProfile(profile: StudentProfileForm): Promise<StudentProfile | null> {
    try {
      const { data, error } = await supabase
        .from('student_profile')
        .upsert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('保存学生档案失败:', error);
      throw error;
    }
  },

  /**
   * 更新学生档案 (部分字段)
   */
  async updateProfile(studentId: number, updates: Partial<StudentProfile>): Promise<StudentProfile | null> {
    try {
      // 先检查档案是否存在
      const existing = await this.getProfileByStudentId(studentId);
      
      if (existing) {
        // 存在则更新
        const { data, error } = await supabase
          .from('student_profile')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 不存在则创建
        const { data, error } = await supabase
          .from('student_profile')
          .insert({
            student_id: studentId,
            full_name: '',
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('更新学生档案失败:', error);
      throw error;
    }
  },

  /**
   * 更新文书材料列表
   */
  async updateDocuments(studentId: number, documents: any[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_profile')
        .update({ document_files: documents })
        .eq('student_id', studentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('更新文书材料失败:', error);
      return false;
    }
  }
};

// ==================== 学生会议 ====================

export const studentMeetingService = {
  /**
   * 获取学生的所有会议
   */
  async getMeetingsByStudentId(studentId: number): Promise<StudentMeeting[]> {
    try {
      const { data, error } = await supabase
        .from('student_meetings')
        .select('*')
        .eq('student_id', studentId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取会议列表失败:', error);
      return [];
    }
  },

  /**
   * 创建会议
   */
  async createMeeting(meeting: StudentMeetingForm): Promise<StudentMeeting | null> {
    try {
      const { data, error } = await supabase
        .from('student_meetings')
        .insert(meeting)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建会议失败:', error);
      throw error;
    }
  },

  /**
   * 更新会议
   */
  async updateMeeting(id: number, updates: Partial<StudentMeeting>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_meetings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('更新会议失败:', error);
      return false;
    }
  },

  /**
   * 删除会议
   */
  async deleteMeeting(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除会议失败:', error);
      return false;
    }
  }
};

// ==================== 最终选校列表 ====================

export const universityChoiceService = {
  /**
   * 获取学生的选校列表
   */
  async getChoicesByStudentId(studentId: number): Promise<FinalUniversityChoice[]> {
    try {
      const { data, error } = await supabase
        .from('final_university_choices')
        .select('*')
        .eq('student_id', studentId)
        .order('priority_rank', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取选校列表失败:', error);
      return [];
    }
  },

  /**
   * 创建选校记录
   */
  async createChoice(choice: UniversityChoiceForm): Promise<FinalUniversityChoice | null> {
    try {
      const { data, error } = await supabase
        .from('final_university_choices')
        .insert(choice)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建选校记录失败:', error);
      throw error;
    }
  },

  /**
   * 更新选校记录
   */
  async updateChoice(id: number, updates: Partial<FinalUniversityChoice>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('final_university_choices')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('更新选校记录失败:', error);
      return false;
    }
  },

  /**
   * 删除选校记录
   */
  async deleteChoice(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('final_university_choices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除选校记录失败:', error);
      return false;
    }
  }
};

// ==================== 申请材料清单 ====================

export const applicationDocumentService = {
  /**
   * 获取学生的所有材料清单
   */
  async getDocumentsByStudentId(studentId: number): Promise<ApplicationDocument[]> {
    try {
      const { data, error } = await supabase
        .from('application_documents_checklist')
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取材料清单失败:', error);
      return [];
    }
  },

  /**
   * 按选校记录获取材料清单
   */
  async getDocumentsByChoiceId(choiceId: number): Promise<ApplicationDocument[]> {
    try {
      const { data, error } = await supabase
        .from('application_documents_checklist')
        .select('*')
        .eq('university_choice_id', choiceId)
        .order('is_required', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取材料清单失败:', error);
      return [];
    }
  },

  /**
   * 创建材料清单项
   */
  async createDocument(document: ApplicationDocumentForm): Promise<ApplicationDocument | null> {
    try {
      const { data, error } = await supabase
        .from('application_documents_checklist')
        .insert(document)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建材料清单项失败:', error);
      throw error;
    }
  },

  /**
   * 更新材料状态
   */
  async updateDocument(id: number, updates: Partial<ApplicationDocument>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('application_documents_checklist')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('更新材料状态失败:', error);
      return false;
    }
  },

  /**
   * 删除材料清单项
   */
  async deleteDocument(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('application_documents_checklist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除材料清单项失败:', error);
      return false;
    }
  }
};

// ==================== 综合查询服务 ====================

export const applicationOverviewService = {
  /**
   * 获取所有学生的申请概览
   */
  async getAllApplications(): Promise<ApplicationOverview[]> {
    try {
      // 获取所有学生
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, name, avatar_url')
        .eq('is_active', true);

      if (studentsError) throw studentsError;
      if (!students) return [];

      // 为每个学生获取申请数据
      const overviews = await Promise.all(
        students.map(async (student) => {
          // 获取选校列表
          const choices = await universityChoiceService.getChoicesByStudentId(student.id);
          
          // 计算统计数据
          const total = choices.length;
          const submitted = choices.filter(c => c.submission_status === '已投递' || c.submission_status === '审核中').length;
          const accepted = choices.filter(c => c.submission_status === '已录取').length;
          const pending = choices.filter(c => c.submission_status === '未投递').length;
          
          // 获取最近的会议
          const meetings = await studentMeetingService.getMeetingsByStudentId(student.id);
          const latestMeeting = meetings[0];
          
          // 获取紧急任务
          const documents = await applicationDocumentService.getDocumentsByStudentId(student.id);
          const urgentTasks = documents.filter(doc => {
            if (!doc.due_date || doc.status === '已完成') return false;
            const dueDate = new Date(doc.due_date);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntilDue <= 7 && daysUntilDue >= 0;
          });
          
          // 找到最近的截止日期
          const upcomingDeadlines = choices
            .filter(c => c.application_deadline && c.submission_status === '未投递')
            .sort((a, b) => new Date(a.application_deadline!).getTime() - new Date(b.application_deadline!).getTime());
          
          const nextDeadline = upcomingDeadlines[0]?.application_deadline;
          
          // 计算总体进度
          const overallProgress = total > 0 ? Math.round((submitted + accepted) / total * 100) : 0;
          
          return {
            student_id: student.id,
            student_name: student.name,
            student_avatar: student.avatar_url,
            total_applications: total,
            submitted_applications: submitted,
            accepted_applications: accepted,
            pending_applications: pending,
            overall_progress: overallProgress,
            next_deadline: nextDeadline,
            latest_meeting: latestMeeting,
            urgent_tasks: urgentTasks
          };
        })
      );

      return overviews;
    } catch (error) {
      console.error('获取申请概览失败:', error);
      return [];
    }
  },

  /**
   * 获取单个学生的申请概览
   */
  async getStudentApplication(studentId: number): Promise<ApplicationOverview | null> {
    try {
      // 获取学生信息
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, name, avatar_url')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;
      if (!student) return null;

      // 获取选校列表
      const choices = await universityChoiceService.getChoicesByStudentId(studentId);
      
      // 计算统计数据
      const total = choices.length;
      const submitted = choices.filter(c => c.submission_status === '已投递' || c.submission_status === '审核中').length;
      const accepted = choices.filter(c => c.submission_status === '已录取').length;
      const pending = choices.filter(c => c.submission_status === '未投递').length;
      
      // 获取最近的会议
      const meetings = await studentMeetingService.getMeetingsByStudentId(studentId);
      const latestMeeting = meetings[0];
      
      // 获取紧急任务
      const documents = await applicationDocumentService.getDocumentsByStudentId(studentId);
      const urgentTasks = documents.filter(doc => {
        if (!doc.due_date || doc.status === '已完成') return false;
        const dueDate = new Date(doc.due_date);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0;
      });
      
      // 找到最近的截止日期
      const upcomingDeadlines = choices
        .filter(c => c.application_deadline && c.submission_status === '未投递')
        .sort((a, b) => new Date(a.application_deadline!).getTime() - new Date(b.application_deadline!).getTime());
      
      const nextDeadline = upcomingDeadlines[0]?.application_deadline;
      
      // 计算总体进度
      const overallProgress = total > 0 ? Math.round((submitted + accepted) / total * 100) : 0;
      
      return {
        student_id: student.id,
        student_name: student.name,
        student_avatar: student.avatar_url,
        total_applications: total,
        submitted_applications: submitted,
        accepted_applications: accepted,
        pending_applications: pending,
        overall_progress: overallProgress,
        next_deadline: nextDeadline,
        latest_meeting: latestMeeting,
        urgent_tasks: urgentTasks
      };
    } catch (error) {
      console.error('获取学生申请概览失败:', error);
      return null;
    }
  },

  /**
   * 获取申请统计数据
   */
  async getApplicationStats(): Promise<ApplicationStats> {
    try {
      const overviews = await this.getAllApplications();
      
      const total = overviews.reduce((sum, o) => sum + o.total_applications, 0);
      const urgent = overviews.reduce((sum, o) => sum + (o.urgent_tasks?.length || 0), 0);
      const completed = overviews.reduce((sum, o) => sum + o.submitted_applications + o.accepted_applications, 0);
      const pending = overviews.reduce((sum, o) => sum + o.pending_applications, 0);
      const accepted = overviews.reduce((sum, o) => sum + o.accepted_applications, 0);
      
      const completion_rate = total > 0 ? Math.round(completed / total * 100) : 0;
      
      return {
        total,
        urgent,
        completed,
        pending,
        accepted,
        completion_rate
      };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return {
        total: 0,
        urgent: 0,
        completed: 0,
        pending: 0,
        accepted: 0,
        completion_rate: 0
      };
    }
  }
};

export default {
  studentProfile: studentProfileService,
  meeting: studentMeetingService,
  universityChoice: universityChoiceService,
  document: applicationDocumentService,
  overview: applicationOverviewService
};


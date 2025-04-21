import { supabase } from '../lib/supabase';

// 顾问数据接口
export interface Mentor {
  id: number;
  name: string;
  email: string;
  contact: string;
  gender: string;
  avatar_url: string;
  specializations: string;
  expertise_level: string;
  hourly_rate: number;
  bio: string;
  is_active: boolean;
  employee_id: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 顾问服务
 */
export const mentorService = {
  /**
   * 获取所有顾问
   */
  async getAllMentors(): Promise<Mentor[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('获取所有顾问失败', error);
      throw error;
    }
  },
  
  /**
   * 根据ID获取顾问
   */
  async getMentorById(id: number): Promise<Mentor> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`获取顾问失败，id=${id}`, error);
      throw error;
    }
  }
}; 
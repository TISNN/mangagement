import { supabase } from '../lib/supabase';

// 服务类型接口
export interface ServiceType {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  category: string;
  education_level?: string | null;
  parent_id?: number | null;
}

/**
 * 服务类型服务
 */
export const serviceTypeService = {
  /**
   * 获取所有服务类型
   */
  async getAllServiceTypes(): Promise<ServiceType[]> {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('获取所有服务类型失败', error);
      throw error;
    }
  },
  
  /**
   * 根据ID获取服务类型
   */
  async getServiceTypeById(id: number): Promise<ServiceType> {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`获取服务类型失败，id=${id}`, error);
      throw error;
    }
  }
}; 
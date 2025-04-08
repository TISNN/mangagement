import { supabase } from '../utils/supabaseClient';

// 学校类型定义
export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  country: string;
  city: string;
  ranking?: number;
  description: string;
  website_url?: string;
  en_name?: string;
  cn_name?: string;
  region?: string;
  tags?: string[] | string;
  is_verified?: boolean;
  qs_rank_2025?: number;
  qs_rank_2024?: number;
  created_at?: string;
  updated_at?: string;
}

// 专业类型定义
export interface Program {
  id: string;
  school_id: string;
  name: string;
  en_name?: string;
  cn_name?: string;
  degree: string;
  duration: string;
  tuitionFee?: number;
  application_deadline?: string;
  requirements?: string;
  introduction?: string;
  apply_requirements?: string;
  language_requirements?: string;
  curriculum?: string;
  success_cases?: string;
  tags?: string[] | string;
  objectives?: string;
  created_at?: string;
  updated_at?: string;
}

// 成功案例类型定义
export interface SuccessCase {
  id: string;
  program_id?: string;
  student_name: string;
  admission_year: number;
  background: string;
  gpa?: string;
  language_scores?: Record<string, number>;
  story: string;
  program?: {
    id: string;
    name: string;
  };
  created_at?: string;
}

// 学校服务对象
export const schoolService = {
  /**
   * 获取学校详情
   * @param schoolId 学校ID
   * @returns 学校详细信息
   */
  getSchoolById: async (schoolId: string): Promise<School | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', schoolId)
        .single();

      if (error) {
        console.error('获取学校信息失败', error);
        return null;
      }

      return data as School;
    } catch (error) {
      console.error('获取学校信息异常', error);
      return null;
    }
  },

  /**
   * 获取学校的专业列表
   * @param schoolId 学校ID
   * @returns 专业列表
   */
  getSchoolPrograms: async (schoolId: string): Promise<Program[]> => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('school_id', schoolId);

      if (error) {
        console.error('获取专业列表失败', error);
        return [];
      }

      return data as Program[];
    } catch (error) {
      console.error('获取专业列表异常', error);
      return [];
    }
  },

  /**
   * 获取学校的成功案例
   * @param schoolId 学校ID
   * @returns 成功案例列表
   */
  getSchoolSuccessCases: async (schoolId: string): Promise<SuccessCase[]> => {
    try {
      const { data, error } = await supabase
        .from('success_cases')
        .select(`
          *,
          program:program_id (
            id,
            name
          )
        `)
        .in('program_id', function(qb) {
          qb.select('id')
            .from('programs')
            .eq('school_id', schoolId);
        });

      if (error) {
        console.error('获取成功案例失败', error);
        return [];
      }

      return data as SuccessCase[];
    } catch (error) {
      console.error('获取成功案例异常', error);
      return [];
    }
  },

  /**
   * 获取所有学校列表
   * @returns 学校列表
   */
  getAllSchools: async (): Promise<School[]> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('ranking');

      if (error) {
        console.error('获取学校列表失败', error);
        return [];
      }

      return data as School[];
    } catch (error) {
      console.error('获取学校列表异常', error);
      return [];
    }
  },

  /**
   * 收藏/取消收藏学校
   * @param userId 用户ID
   * @param schoolId 学校ID
   * @param isFavorite 是否收藏
   * @returns 操作结果
   */
  toggleFavoriteSchool: async (
    userId: string,
    schoolId: string,
    isFavorite: boolean
  ): Promise<boolean> => {
    try {
      if (isFavorite) {
        // 添加收藏
        const { error } = await supabase
          .from('user_favorite_schools')
          .insert({ user_id: userId, school_id: schoolId });

        if (error) {
          console.error('收藏学校失败', error);
          return false;
        }
      } else {
        // 取消收藏
        const { error } = await supabase
          .from('user_favorite_schools')
          .delete()
          .match({ user_id: userId, school_id: schoolId });

        if (error) {
          console.error('取消收藏学校失败', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('收藏/取消收藏学校异常', error);
      return false;
    }
  },

  /**
   * 获取用户收藏的学校列表
   * @param userId 用户ID
   * @returns 收藏的学校列表
   */
  getFavoriteSchools: async (userId: string): Promise<School[]> => {
    try {
      const { data, error } = await supabase
        .from('user_favorite_schools')
        .select(`
          school:school_id (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('获取收藏学校失败', error);
        return [];
      }

      return data.map(item => item.school) as School[];
    } catch (error) {
      console.error('获取收藏学校异常', error);
      return [];
    }
  },

  /**
   * 检查用户是否已收藏学校
   * @param userId 用户ID
   * @param schoolId 学校ID
   * @returns 是否已收藏
   */
  isSchoolFavorited: async (userId: string, schoolId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_favorite_schools')
        .select('id')
        .match({ user_id: userId, school_id: schoolId })
        .single();

      if (error) {
        // 如果是因为没有找到记录而报错，则说明未收藏
        if (error.code === 'PGRST116') {
          return false;
        }
        console.error('检查学校收藏状态失败', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('检查学校收藏状态异常', error);
      return false;
    }
  }
};
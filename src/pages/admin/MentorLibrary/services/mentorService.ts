// 导师服务层 - 处理导师数据的获取和缓存

import { supabase } from '../../../../utils/supabaseClient';
import type { DatabaseMentor, Mentor, ServiceScope } from '../types/mentor.types';

/**
 * 验证服务范围是否有效
 */
const isValidServiceScope = (scope: string): scope is ServiceScope => {
  return ['留学申请', '课业辅导', '科研', '语言培训'].includes(scope);
};

/**
 * 从数据库获取所有导师数据
 */
export const fetchAllMentors = async (): Promise<Mentor[]> => {
  try {
    console.log('🔄 从数据库加载导师数据...');

    // 从数据库获取导师数据
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取导师数据失败:', error);
      if (error.message?.includes('Failed to fetch') || error.code === '') {
        throw new Error('网络连接失败,请检查您的网络连接后重试');
      }
      throw new Error(error.message || '获取导师数据失败');
    }

    if (!data || data.length === 0) {
      console.warn('未找到任何导师数据');
      return [];
    }

    // 处理数据转换
    const processedMentors = data
      .map((dbMentor: DatabaseMentor) => {
        // 处理specializations数组
        const specializations = Array.isArray(dbMentor.specializations) 
          ? dbMentor.specializations 
          : [];

        // 处理service_scope数组,过滤有效值
        const serviceScope = (Array.isArray(dbMentor.service_scope) 
          ? dbMentor.service_scope 
          : [])
          .filter((scope): scope is ServiceScope => 
            typeof scope === 'string' && isValidServiceScope(scope)
          );

        const mentor: Mentor = {
          id: dbMentor.id.toString(),
          employeeId: dbMentor.employee_id,
          name: dbMentor.name || '未知导师',
          email: dbMentor.email || undefined,
          contact: dbMentor.contact || undefined,
          gender: dbMentor.gender || undefined,
          avatarUrl: dbMentor.avatar_url || undefined,
          bio: dbMentor.bio || undefined,
          specializations: specializations,
          expertiseLevel: dbMentor.expertise_level as any, // 暂时用any,后续可以严格类型检查
          hourlyRate: dbMentor.hourly_rate || undefined,
          isActive: dbMentor.is_active ?? true,
          location: dbMentor.location || '未知地区',
          serviceScope: serviceScope,
          createdAt: dbMentor.created_at,
          updatedAt: dbMentor.updated_at,
          rawData: dbMentor, // 存储原始数据以备不时之需
        };
        
        return mentor;
      });

    console.log(`✅ 成功加载 ${processedMentors.length} 位导师数据`);
    return processedMentors;
  } catch (err) {
    console.error('获取导师数据出错:', err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('获取导师数据时发生未知错误');
  }
};

/**
 * 根据ID获取单个导师
 */
export const fetchMentorById = async (mentorId: string): Promise<Mentor | null> => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', parseInt(mentorId))
      .single();

    if (error) {
      console.error(`获取导师 ${mentorId} 失败:`, error);
      throw new Error(error.message || '获取导师详情失败');
    }

    if (!data) {
      return null;
    }

    // 转换数据
    const dbMentor = data as DatabaseMentor;
    const specializations = Array.isArray(dbMentor.specializations) 
      ? dbMentor.specializations 
      : [];
    const serviceScope = (Array.isArray(dbMentor.service_scope) 
      ? dbMentor.service_scope 
      : [])
      .filter((scope): scope is ServiceScope => 
        typeof scope === 'string' && isValidServiceScope(scope)
      );

    const mentor: Mentor = {
      id: dbMentor.id.toString(),
      employeeId: dbMentor.employee_id,
      name: dbMentor.name || '未知导师',
      email: dbMentor.email || undefined,
      contact: dbMentor.contact || undefined,
      gender: dbMentor.gender || undefined,
      avatarUrl: dbMentor.avatar_url || undefined,
      bio: dbMentor.bio || undefined,
      specializations: specializations,
      expertiseLevel: dbMentor.expertise_level as any,
      hourlyRate: dbMentor.hourly_rate || undefined,
      isActive: dbMentor.is_active ?? true,
      location: dbMentor.location || '未知地区',
      serviceScope: serviceScope,
      createdAt: dbMentor.created_at,
      updatedAt: dbMentor.updated_at,
      rawData: dbMentor,
    };

    return mentor;
  } catch (err) {
    console.error('获取导师详情出错:', err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('获取导师详情时发生未知错误');
  }
};

/**
 * 获取所有可用的服务范围选项
 */
export const getServiceScopeOptions = (): ServiceScope[] => {
  return ['留学申请', '课业辅导', '科研', '语言培训'];
};

/**
 * 获取所有可用的地理位置选项
 * (从导师数据中动态提取,或使用预定义列表)
 */
export const getLocationOptions = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('location')
      .not('location', 'is', null);

    if (error) {
      console.error('获取地理位置选项失败:', error);
      return [];
    }

    // 去重并排序
    const locations = Array.from(
      new Set(data.map(item => item.location).filter(Boolean))
    ).sort();

    return locations;
  } catch (err) {
    console.error('获取地理位置选项出错:', err);
    return [];
  }
};

/**
 * 获取所有可用的专业方向选项
 * (从导师数据中动态提取)
 */
export const getSpecializationOptions = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('specializations')
      .not('specializations', 'is', null);

    if (error) {
      console.error('获取专业方向选项失败:', error);
      return [];
    }

    // 合并所有specializations数组并去重
    const allSpecializations = new Set<string>();
    data.forEach(item => {
      if (Array.isArray(item.specializations)) {
        item.specializations.forEach(spec => {
          if (spec) allSpecializations.add(spec);
        });
      }
    });

    return Array.from(allSpecializations).sort();
  } catch (err) {
    console.error('获取专业方向选项出错:', err);
    return [];
  }
};


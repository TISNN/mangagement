/**
 * 案例库服务
 */
import { supabase } from '../lib/supabase';
import { CaseStudy } from '../types/case';

/**
 * 获取所有案例
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const { data, error } = await supabase
      .from('success_cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取案例列表失败:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('获取案例列表异常:', error);
    throw error;
  }
}

/**
 * 根据ID获取案例详情
 */
export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
  try {
    const { data, error } = await supabase
      .from('success_cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取案例详情失败:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('获取案例详情异常:', error);
    throw error;
  }
}

/**
 * 创建新案例
 */
export async function createCaseStudy(caseData: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>): Promise<CaseStudy> {
  try {
    const { data, error } = await supabase
      .from('success_cases')
      .insert([caseData])
      .select()
      .single();

    if (error) {
      console.error('创建案例失败:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('创建案例异常:', error);
    throw error;
  }
}

/**
 * 更新案例
 */
export async function updateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy> {
  try {
    const { data, error } = await supabase
      .from('success_cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新案例失败:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('更新案例异常:', error);
    throw error;
  }
}

/**
 * 删除案例
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('success_cases')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除案例失败:', error);
      throw error;
    }
  } catch (error) {
    console.error('删除案例异常:', error);
    throw error;
  }
}

/**
 * 搜索案例
 */
export async function searchCaseStudies(searchTerm: string): Promise<CaseStudy[]> {
  try {
    const { data, error } = await supabase
      .from('success_cases')
      .select('*')
      .or(`school.ilike.%${searchTerm}%,applied_program.ilike.%${searchTerm}%,bachelor_university.ilike.%${searchTerm}%,bachelor_major.ilike.%${searchTerm}%,student_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('搜索案例失败:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('搜索案例异常:', error);
    throw error;
  }
}

/**
 * 获取案例统计数据
 */
export async function getCaseStatistics() {
  try {
    // 获取总案例数
    const { count: totalCount, error: countError } = await supabase
      .from('success_cases')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 数据库中没有admission_result字段，所以所有案例默认都是成功案例
    const acceptedCount = totalCount;

    // 计算录取率（success_cases都是成功案例，所以默认100%）
    const acceptanceRate = totalCount && totalCount > 0 ? '100' : '0';

    return {
      totalCases: totalCount || 0,
      acceptedCases: acceptedCount || 0,
      acceptanceRate: `${acceptanceRate}%`,
    };
  } catch (error) {
    console.error('获取案例统计失败:', error);
    return {
      totalCases: 0,
      acceptedCases: 0,
      acceptanceRate: '0%',
    };
  }
}


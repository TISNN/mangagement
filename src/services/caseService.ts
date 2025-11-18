/**
 * 案例库服务
 */
import { supabase } from '../lib/supabase';
import { CaseStudy } from '../types/case';

/**
 * 加载案例的关联信息（导师和学生）
 */
async function loadCaseRelations(cases: CaseStudy[]): Promise<CaseStudy[]> {
  try {
    // 收集所有需要查询的ID
    const mentorIds = [...new Set(cases.filter(c => c.mentor_id).map(c => c.mentor_id!))];
    const studentIds = [...new Set(cases.filter(c => c.student_id).map(c => c.student_id!))];

    // 并行查询导师和学生信息
    const [mentorsResult, studentsResult] = await Promise.all([
      mentorIds.length > 0
        ? supabase
            .from('mentors')
            .select('id, name, avatar_url, specializations')
            .in('id', mentorIds)
        : { data: [], error: null },
      studentIds.length > 0
        ? supabase
            .from('students')
            .select('id, name, email, avatar_url, education_level')
            .in('id', studentIds)
        : { data: [], error: null },
    ]);

    // 构建ID到数据的映射
    const mentorMap = new Map(
      (mentorsResult.data || []).map(mentor => [mentor.id, mentor])
    );
    const studentMap = new Map(
      (studentsResult.data || []).map(student => [student.id, student])
    );

    // 为每个案例添加关联信息
    return cases.map(caseStudy => ({
      ...caseStudy,
      mentor: caseStudy.mentor_id ? mentorMap.get(caseStudy.mentor_id) : undefined,
      student: caseStudy.student_id ? studentMap.get(caseStudy.student_id) : undefined,
    }));
  } catch (error) {
    console.error('加载案例关联信息失败:', error);
    // 即使关联信息加载失败，也返回原始案例数据
    return cases;
  }
}

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

    const cases = data || [];
    // 加载关联的导师和学生信息
    return await loadCaseRelations(cases);
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

    if (!data) return null;

    // 加载关联的导师和学生信息
    const casesWithRelations = await loadCaseRelations([data]);
    return casesWithRelations[0] || null;
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

    if (!data) throw new Error('更新后的数据为空');

    // 加载关联的导师和学生信息
    const casesWithRelations = await loadCaseRelations([data]);
    return casesWithRelations[0] || data;
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

    const cases = data || [];
    // 加载关联的导师和学生信息
    return await loadCaseRelations(cases);
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


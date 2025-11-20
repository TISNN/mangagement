/**
 * 案例库服务
 */
import { supabase } from '../lib/supabase';
import { CaseStudy } from '../types/case';

/**
 * 加载案例的关联信息（导师、学生和创建者）
 */
async function loadCaseRelations(cases: CaseStudy[]): Promise<CaseStudy[]> {
  try {
    // 收集所有需要查询的ID
    const mentorIds = [...new Set(cases.filter(c => c.mentor_id).map(c => c.mentor_id!))];
    const studentIds = [...new Set(cases.filter(c => c.student_id).map(c => c.student_id!))];
    const creatorIds = [...new Set(cases.filter(c => c.created_by).map(c => c.created_by!))];

    // 并行查询导师、学生和创建者信息
    const [mentorsResult, studentsResult, creatorsResult] = await Promise.all([
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
      creatorIds.length > 0
        ? supabase
            .from('employees')
            .select('id, name, avatar_url')
            .in('id', creatorIds)
        : { data: [], error: null },
    ]);

    // 构建ID到数据的映射
    const mentorMap = new Map(
      (mentorsResult.data || []).map(mentor => [mentor.id, mentor])
    );
    const studentMap = new Map(
      (studentsResult.data || []).map(student => [student.id, student])
    );
    const creatorMap = new Map(
      (creatorsResult.data || []).map(creator => [creator.id, {
        id: creator.id,
        name: creator.name,
        avatar_url: creator.avatar_url,
      }])
    );

    // 为每个案例添加关联信息
    return cases.map(caseStudy => ({
      ...caseStudy,
      mentor: caseStudy.mentor_id ? mentorMap.get(caseStudy.mentor_id) : undefined,
      student: caseStudy.student_id ? studentMap.get(caseStudy.student_id) : undefined,
      creator: caseStudy.created_by ? creatorMap.get(caseStudy.created_by) : undefined,
    }));
  } catch (error) {
    console.error('加载案例关联信息失败:', error);
    // 即使关联信息加载失败，也返回原始案例数据
    return cases;
  }
}

/**
 * 去敏处理函数
 * 将学生姓名转换为：姓的首字母 + "同学"
 * 例如：张三 -> Z同学，李四 -> L同学
 */
export function anonymizeCase(caseStudy: CaseStudy): Partial<CaseStudy> {
  let anonymizedName = caseStudy.student_name || '';
  
  // 处理中文姓名：提取姓氏的首字母
  if (anonymizedName && anonymizedName.length > 0) {
    const firstChar = anonymizedName[0];
    // 如果是中文字符，获取拼音首字母（简化处理，实际可以使用拼音库）
    // 这里先简单处理：如果是常见姓氏，直接映射；否则使用姓氏本身
    const surnameMap: Record<string, string> = {
      '张': 'Z', '王': 'W', '李': 'L', '刘': 'L', '陈': 'C',
      '杨': 'Y', '黄': 'H', '赵': 'Z', '吴': 'W', '周': 'Z',
      '徐': 'X', '孙': 'S', '马': 'M', '朱': 'Z', '胡': 'H',
      '郭': 'G', '何': 'H', '高': 'G', '罗': 'L', '郑': 'Z',
      '梁': 'L', '谢': 'X', '宋': 'S', '唐': 'T', '许': 'X',
      '韩': 'H', '冯': 'F', '邓': 'D', '曹': 'C', '彭': 'P',
      '曾': 'Z', '肖': 'X', '田': 'T', '董': 'D', '袁': 'Y',
      '潘': 'P', '于': 'Y', '蒋': 'J', '蔡': 'C', '余': 'Y',
      '杜': 'D', '叶': 'Y', '程': 'C', '苏': 'S', '魏': 'W',
      '吕': 'L', '丁': 'D', '任': 'R', '沈': 'S', '姚': 'Y',
      '卢': 'L', '姜': 'J', '崔': 'C', '钟': 'Z', '谭': 'T',
      '陆': 'L', '汪': 'W', '范': 'F', '金': 'J', '石': 'S',
      '廖': 'L', '贾': 'J', '夏': 'X', '韦': 'W', '付': 'F',
      '方': 'F', '白': 'B', '邹': 'Z', '孟': 'M', '熊': 'X',
      '秦': 'Q', '邱': 'Q', '江': 'J', '尹': 'Y', '薛': 'X',
      '闫': 'Y', '段': 'D', '雷': 'L', '侯': 'H', '龙': 'L',
      '史': 'S', '陶': 'T', '黎': 'L', '贺': 'H', '顾': 'G',
      '毛': 'M', '郝': 'H', '龚': 'G', '邵': 'S', '万': 'W',
      '钱': 'Q', '严': 'Y', '覃': 'Q', '武': 'W', '戴': 'D',
      '莫': 'M', '孔': 'K', '向': 'X', '汤': 'T', '常': 'C',
    };
    
    // 如果是中文字符，尝试映射
    if (/[\u4e00-\u9fa5]/.test(firstChar)) {
      const initial = surnameMap[firstChar] || firstChar.toUpperCase();
      anonymizedName = `${initial}同学`;
    } else {
      // 如果是英文字符，直接使用首字母大写
      anonymizedName = `${firstChar.toUpperCase()}同学`;
    }
  }

  return {
    student_name: anonymizedName,
    student_id: null, // 取消学生关联
    is_anonymized: true,
    case_type: 'public',
    shared_to_public_at: new Date().toISOString(),
    anonymization_consent: true,
  };
}

/**
 * 获取所有案例（兼容旧接口，返回所有案例）
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
    // 加载关联的导师、学生和创建者信息
    return await loadCaseRelations(cases);
  } catch (error) {
    console.error('获取案例列表异常:', error);
    throw error;
  }
}

/**
 * 获取我的案例（当前用户创建的私有案例）
 * 包括 created_by 为 null 的历史案例（兼容处理）
 */
export async function getMyCases(userId: number): Promise<CaseStudy[]> {
  try {
    // 查询条件：created_by = userId 或者 created_by 为 null（历史数据）
    const { data, error } = await supabase
      .from('success_cases')
      .select('*')
      .or(`created_by.eq.${userId},created_by.is.null`)
      .eq('case_type', 'private')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取我的案例失败:', error);
      throw error;
    }

    const cases = data || [];
    return await loadCaseRelations(cases);
  } catch (error) {
    console.error('获取我的案例异常:', error);
    throw error;
  }
}

/**
 * 获取公共案例库（所有用户共享的案例）
 */
export async function getPublicCases(): Promise<CaseStudy[]> {
  try {
    const { data, error } = await supabase
      .from('success_cases')
      .select('*')
      .eq('case_type', 'public')
      .order('shared_to_public_at', { ascending: false });

    if (error) {
      console.error('获取公共案例失败:', error);
      throw error;
    }

    const cases = data || [];
    return await loadCaseRelations(cases);
  } catch (error) {
    console.error('获取公共案例异常:', error);
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
 * 创建新案例（默认创建为私有案例）
 */
export async function createCaseStudy(
  caseData: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>,
  createdBy?: number
): Promise<CaseStudy> {
  try {
    const insertData = {
      ...caseData,
      case_type: 'private' as const,
      created_by: createdBy,
      is_anonymized: false,
      anonymization_consent: false,
    };

    const { data, error } = await supabase
      .from('success_cases')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('创建案例失败:', error);
      throw error;
    }

    // 加载关联信息
    const casesWithRelations = await loadCaseRelations([data]);
    return casesWithRelations[0] || data;
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
 * 分享案例到公共库（带去敏处理）
 */
export async function shareCaseToPublic(caseId: string, userId: number): Promise<CaseStudy> {
  try {
    // 先获取案例详情
    const caseStudy = await getCaseStudyById(caseId);
    if (!caseStudy) {
      throw new Error('案例不存在');
    }

    // 验证权限：只有创建者可以分享
    if (caseStudy.created_by !== userId) {
      throw new Error('只有案例创建者可以分享到公共库');
    }

    // 如果已经是公共案例，直接返回
    if (caseStudy.case_type === 'public') {
      return caseStudy;
    }

    // 执行去敏处理
    const anonymizedData = anonymizeCase(caseStudy);

    // 更新案例
    const { data, error } = await supabase
      .from('success_cases')
      .update(anonymizedData)
      .eq('id', caseId)
      .select()
      .single();

    if (error) {
      console.error('分享案例到公共库失败:', error);
      throw error;
    }

    if (!data) throw new Error('更新后的数据为空');

    // 加载关联信息
    const casesWithRelations = await loadCaseRelations([data]);
    return casesWithRelations[0] || data;
  } catch (error) {
    console.error('分享案例到公共库异常:', error);
    throw error;
  }
}

/**
 * 撤回案例分享（从公共库撤回，恢复为私有）
 */
export async function unshareCaseFromPublic(caseId: string, userId: number): Promise<CaseStudy> {
  try {
    // 先获取案例详情
    const caseStudy = await getCaseStudyById(caseId);
    if (!caseStudy) {
      throw new Error('案例不存在');
    }

    // 验证权限：只有创建者可以撤回
    if (caseStudy.created_by !== userId) {
      throw new Error('只有案例创建者可以撤回分享');
    }

    // 如果已经是私有案例，直接返回
    if (caseStudy.case_type === 'private') {
      return caseStudy;
    }

    // 恢复为私有案例
    const { data, error } = await supabase
      .from('success_cases')
      .update({
        case_type: 'private',
        shared_to_public_at: null,
      })
      .eq('id', caseId)
      .select()
      .single();

    if (error) {
      console.error('撤回案例分享失败:', error);
      throw error;
    }

    if (!data) throw new Error('更新后的数据为空');

    // 加载关联信息
    const casesWithRelations = await loadCaseRelations([data]);
    return casesWithRelations[0] || data;
  } catch (error) {
    console.error('撤回案例分享异常:', error);
    throw error;
  }
}

/**
 * 获取案例统计数据
 */
export async function getCaseStatistics(userId?: number) {
  try {
    // 获取总案例数（所有案例）
    const { count: totalCount, error: countError } = await supabase
      .from('success_cases')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 获取公共案例数
    const { count: publicCount, error: publicError } = await supabase
      .from('success_cases')
      .select('*', { count: 'exact', head: true })
      .eq('case_type', 'public');

    if (publicError) throw publicError;

    // 获取我的案例数（如果提供了userId）
    // 包括 created_by 为 null 的历史案例（兼容处理）
    let myCasesCount = 0;
    if (userId) {
      const { count: myCount, error: myError } = await supabase
        .from('success_cases')
        .select('*', { count: 'exact', head: true })
        .or(`created_by.eq.${userId},created_by.is.null`)
        .eq('case_type', 'private');

      if (myError) throw myError;
      myCasesCount = myCount || 0;
    }

    // 数据库中没有admission_result字段，所以所有案例默认都是成功案例
    const acceptedCount = totalCount;

    // 计算录取率（success_cases都是成功案例，所以默认100%）
    const acceptanceRate = totalCount && totalCount > 0 ? '100' : '0';

    return {
      totalCases: totalCount || 0,
      acceptedCases: acceptedCount || 0,
      acceptanceRate: `${acceptanceRate}%`,
      publicCases: publicCount || 0,
      myCases: myCasesCount,
    };
  } catch (error) {
    console.error('获取案例统计失败:', error);
    return {
      totalCases: 0,
      acceptedCases: 0,
      acceptanceRate: '0%',
      publicCases: 0,
      myCases: 0,
    };
  }
}


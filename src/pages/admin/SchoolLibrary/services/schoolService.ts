/**
 * 学校库服务层
 */

import { supabase } from '../../../../utils/supabaseClient';
import { DatabaseSchool, School, Program } from '../types/school.types';

// UUID验证函数
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * 从缓存中读取学校数据
 */
const getCachedSchools = (): School[] | null => {
  try {
    const cached = localStorage.getItem('cachedSchools');
    const timestamp = localStorage.getItem('cachedSchoolsTimestamp');
    
    if (!cached || !timestamp) return null;
    
    // 检查缓存是否过期(24小时)
    const cacheTime = parseInt(timestamp);
    const now = new Date().getTime();
    const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      console.log('学校缓存已过期');
      clearSchoolsCache();
      return null;
    }
    
    const schools = JSON.parse(cached);
    console.log('从缓存加载学校数据:', schools.length);
    return schools;
  } catch (error) {
    console.error('读取学校缓存失败:', error);
    return null;
  }
};

/**
 * 缓存学校数据
 */
const cacheSchoolsData = (schools: School[]): void => {
  try {
    // 只缓存必要的字段,减少存储空间
    const simplifiedSchools = schools.map(s => ({
      id: s.id,
      name: s.name,
      location: s.location,
      country: s.country,
      region: s.region,
      acceptance: s.acceptance,
      tuition: s.tuition,
      ranking: s.ranking,
      description: s.description,
      logoUrl: s.logoUrl,
      tags: s.tags,
      programs: [], // 专业数据不缓存,由专业库管理
      // 保留rawData中的logo_url用于显示
      rawData: s.rawData ? {
        logo_url: s.rawData.logo_url,
        cn_name: s.rawData.cn_name,
        en_name: s.rawData.en_name
      } : undefined
    }));
    
    const dataStr = JSON.stringify(simplifiedSchools);
    
    // 检查数据大小,如果超过4MB就不缓存
    if (dataStr.length > 4 * 1024 * 1024) {
      console.warn('学校数据过大,跳过缓存');
      return;
    }
    
    localStorage.setItem('cachedSchools', dataStr);
    localStorage.setItem('cachedSchoolsTimestamp', new Date().getTime().toString());
    console.log('学校数据已缓存');
  } catch (error) {
    console.error('缓存学校数据失败:', error);
    // 如果失败,清除可能的部分写入
    try {
      localStorage.removeItem('cachedSchools');
      localStorage.removeItem('cachedSchoolsTimestamp');
    } catch (e) {
      // 忽略清除错误
    }
  }
};

/**
 * 清除学校数据缓存
 */
const clearSchoolsCache = (): void => {
  try {
    localStorage.removeItem('cachedSchools');
    localStorage.removeItem('cachedSchoolsTimestamp');
    console.log('学校数据缓存已清除');
  } catch (error) {
    console.error('清除学校缓存失败:', error);
  }
};

/**
 * 获取所有学校数据
 */
export const fetchAllSchools = async (): Promise<School[]> => {
  try {
    // 🚧 开发阶段: 完全禁用缓存,每次都从数据库加载最新数据
    // 先尝试从缓存读取
    // const cachedSchools = getCachedSchools();
    // if (cachedSchools && cachedSchools.length > 0) {
    //   return cachedSchools;
    // }

    // 从数据库获取最新数据
    console.log('🔄 从数据库加载学校数据(缓存已禁用)...');
    
    // 先获取总数
    const { count, error: countError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('获取学校总数失败:', countError);
      // 提供更友好的错误信息
      if (countError.message?.includes('Failed to fetch') || countError.code === '') {
        throw new Error('网络连接失败，请检查您的网络连接后重试');
      }
      throw new Error(countError.message || '获取学校总数失败');
    }

    const totalCount = count || 0;
    console.log(`总共有 ${totalCount} 所学校`);

    // 分页加载所有数据
    const limit = 1000;
    const totalPages = Math.ceil(totalCount / limit);
    let allSchools: DatabaseSchool[] = [];

    for (let page = 0; page < totalPages; page++) {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .range(page * limit, (page + 1) * limit - 1)
        .order('ranking', { ascending: true });

      if (error) {
        console.error(`获取第${page+1}页学校数据失败:`, error);
        // 提供更友好的错误信息
        if (error.message?.includes('Failed to fetch') || error.code === '') {
          throw new Error(`网络连接失败(第${page+1}页)，请检查您的网络连接后重试`);
        }
        throw new Error(error.message || `获取第${page+1}页学校数据失败`);
      }

      if (data) {
        allSchools = [...allSchools, ...data as DatabaseSchool[]];
        console.log(`已加载第${page+1}页学校数据: ${data.length}条`);
      }
    }

    if (allSchools.length === 0) {
      throw new Error('未找到任何学校数据');
    }

    // 处理数据转换
    const processedSchools = allSchools
      .map((dbSchool: DatabaseSchool) => {
        if (!dbSchool.id || typeof dbSchool.id !== 'string' || !isValidUUID(dbSchool.id)) {
          console.warn('警告: 发现无效的学校ID格式:', dbSchool.id);
          return null;
        }

        // 处理tags字段
        let tags: string[] = [];
        if (dbSchool.tags) {
          if (typeof dbSchool.tags === 'string') {
            try {
              const parsedTags = JSON.parse(dbSchool.tags);
              tags = Array.isArray(parsedTags) ? parsedTags : [dbSchool.tags];
            } catch {
              tags = dbSchool.tags.split('|');
            }
          } else if (Array.isArray(dbSchool.tags)) {
            tags = dbSchool.tags;
          } else {
            tags = [String(dbSchool.tags)];
          }
        }

        const school: School = {
          id: dbSchool.id,
          name: dbSchool.cn_name || dbSchool.en_name || '未知学校',
          location: `${dbSchool.country || ''} ${dbSchool.city || ''}`.trim() || '位置未知',
          country: dbSchool.country,
          region: dbSchool.region,
          programs: [],
          acceptance: '录取率未知',
          tuition: '学费未知',
          ranking: dbSchool.ranking ? `#${dbSchool.ranking}` : '未排名',
          description: dbSchool.description || '',
          logoUrl: dbSchool.logo_url,
          tags: tags,
          rawData: dbSchool,
        };
        return school;
      })
      .filter((school): school is School => school !== null);

    // 🚧 开发阶段: 禁用缓存
    // cacheSchoolsData(processedSchools);

    console.log(`✅ 成功加载 ${processedSchools.length} 所学校数据`);
    return processedSchools;
  } catch (err) {
    console.error('获取学校数据出错:', err);
    // 如果err已经是Error对象,直接抛出
    if (err instanceof Error) {
      throw err;
    }
    // 否则包装成Error对象
    throw new Error('获取学校数据时发生未知错误');
  }
};

/**
 * 为学校关联专业
 */
export const associateProgramsWithSchools = (
  schools: School[],
  programs: Program[]
): School[] => {
  const programsBySchool: Record<string, Program[]> = {};
  
  programs.forEach(program => {
    if (program.school_id) {
      if (!programsBySchool[program.school_id]) {
        programsBySchool[program.school_id] = [];
      }
      programsBySchool[program.school_id].push(program);
    }
  });

  return schools.map(school => ({
    ...school,
    programs: programsBySchool[school.id] || []
  }));
};

/**
 * 获取单个学校详情
 */
export const fetchSchoolById = async (schoolId: string): Promise<School | null> => {
  try {
    if (!isValidUUID(schoolId)) {
      console.error('无效的学校ID:', schoolId);
      return null;
    }

    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (error) {
      console.error('获取学校详情失败:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // 处理tags字段
    let tags: string[] = [];
    if (data.tags) {
      if (typeof data.tags === 'string') {
        try {
          const parsedTags = JSON.parse(data.tags);
          tags = Array.isArray(parsedTags) ? parsedTags : [data.tags];
        } catch {
          tags = data.tags.split('|');
        }
      } else if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else {
        tags = [String(data.tags)];
      }
    }

    const school: School = {
      id: data.id,
      name: data.cn_name || data.en_name || '未知学校',
      location: `${data.country || ''} ${data.city || ''}`.trim() || '位置未知',
      country: data.country,
      region: data.region,
      programs: [],
      acceptance: '录取率未知',
      tuition: '学费未知',
      ranking: data.ranking ? `#${data.ranking}` : '未排名',
      description: data.description || '',
      logoUrl: data.logo_url,
      tags: tags,
      rawData: data,
    };

    return school;
  } catch (err) {
    console.error('获取学校详情出错:', err);
    return null;
  }
};

/**
 * 获取学校的专业列表
 */
export const fetchSchoolPrograms = async (schoolId: string): Promise<Program[]> => {
  try {
    if (!isValidUUID(schoolId)) {
      console.error('无效的学校ID:', schoolId);
      return [];
    }

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('school_id', schoolId)
      .order('cn_name', { ascending: true });

    if (error) {
      console.error('获取学校专业列表失败:', error);
      return [];
    }

    return (data || []).map(program => ({
      id: program.id,
      school_id: program.school_id,
      cn_name: program.cn_name,
      en_name: program.en_name,
      degree: program.degree || '未知',
      duration: program.duration || '未知',
      tuition_fee: program.tuition_fee,
      category: program.category,
      faculty: program.faculty,
      url: program.url,
      rawData: program
    }));
  } catch (err) {
    console.error('获取学校专业列表出错:', err);
    return [];
  }
};

/**
 * 成功案例类型
 */
export interface SuccessCase {
  id: string;
  student_name: string;
  admission_year: number;
  program_id?: string;
  program_name?: string;
  background: string;
  story: string;
  gpa?: string;
  language_scores?: Record<string, number>;
}

/**
 * 获取学校的成功案例
 */
export const fetchSchoolSuccessCases = async (schoolId: string): Promise<SuccessCase[]> => {
  try {
    if (!isValidUUID(schoolId)) {
      console.error('无效的学校ID:', schoolId);
      return [];
    }

    // 从success_cases表中查询
    const { data, error } = await supabase
      .from('success_cases')
      .select('*')
      .eq('school_id', schoolId)
      .order('admission_year', { ascending: false })
      .limit(10);

    if (error) {
      console.error('获取成功案例失败:', error);
      return [];
    }

    return (data || []).map(caseItem => ({
      id: caseItem.id,
      student_name: caseItem.student_name || '匿名学生',
      admission_year: caseItem.admission_year || new Date().getFullYear(),
      program_id: caseItem.program_id,
      program_name: caseItem.program_name,
      background: caseItem.background || '',
      story: caseItem.story || '',
      gpa: caseItem.undergraduate_gpa || caseItem.master_gpa,
      language_scores: caseItem.language_scores
    }));
  } catch (err) {
    console.error('获取成功案例出错:', err);
    return [];
  }
};

/**
 * 导出缓存管理函数
 */
export { clearSchoolsCache };

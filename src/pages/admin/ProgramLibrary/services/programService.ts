/**
 * 专业库服务层
 */

import { supabase } from '../../../../utils/supabaseClient';
import { Program } from '../types/program.types';

/**
 * 获取所有专业数据
 */
export const fetchAllPrograms = async (): Promise<Program[]> => {
  try {
    // 先获取专业总数
    const { count, error: countError } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('获取专业总数失败:', countError);
      // 提供更友好的错误信息
      if (countError.message?.includes('Failed to fetch') || countError.code === '') {
        throw new Error('网络连接失败，请检查您的网络连接后重试');
      }
      throw new Error(countError.message || '获取专业总数失败');
    }

    const totalCount = count || 0;
    console.log(`专业数据总数: ${totalCount}条`);

    // 分页加载所有数据
    const limit = 1000;
    const totalPages = Math.ceil(totalCount / limit);
    let allProgramsData: Record<string, any>[] = [];

    for (let page = 0; page < totalPages; page++) {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .range(page * limit, (page + 1) * limit - 1);

      if (error) {
        console.error(`获取第${page+1}页专业数据失败:`, error);
        // 提供更友好的错误信息
        if (error.message?.includes('Failed to fetch') || error.code === '') {
          throw new Error(`网络连接失败(第${page+1}页)，请检查您的网络连接后重试`);
        }
        throw new Error(error.message || `获取第${page+1}页专业数据失败`);
      }

      if (data) {
        allProgramsData = [...allProgramsData, ...data];
        console.log(`已加载第${page+1}页专业数据: ${data.length}条，总计: ${allProgramsData.length}/${totalCount}条`);
      }
    }

    if (allProgramsData.length === 0) {
      throw new Error('未找到任何专业数据');
    }

    // 处理数据转换
    const processedPrograms: Program[] = allProgramsData.map((dbProgram) => ({
      id: dbProgram.id || '',
      school_id: dbProgram.school_id || '',
      name: dbProgram.cn_name || dbProgram.en_name || '',
      cn_name: dbProgram.cn_name || '',
      en_name: dbProgram.en_name || '',
      degree: dbProgram.degree || '',
      duration: dbProgram.duration || '',
      tuition_fee: dbProgram.tuition_fee || '',
      faculty: dbProgram.faculty || '',
      category: dbProgram.category || '',
      subCategory: dbProgram.subCategory || '',
      tags: Array.isArray(dbProgram.tags) ? dbProgram.tags :
            typeof dbProgram.tags === 'string' ? dbProgram.tags.split(',') : [],
      apply_requirements: dbProgram.apply_requirements || '',
      language_requirements: dbProgram.language_requirements || '',
      curriculum: dbProgram.curriculum || '',
      analysis: dbProgram.analysis || '',
      url: dbProgram.url || '',
      interview: dbProgram.interview || '',
      objectives: dbProgram.objectives || '',
    }));

    console.log(`✅ 成功加载 ${processedPrograms.length} 个专业数据`);
    return processedPrograms;
  } catch (err) {
    console.error('获取专业数据出错:', err);
    // 如果err已经是Error对象,直接抛出
    if (err instanceof Error) {
      throw err;
    }
    // 否则包装成Error对象
    throw new Error('获取专业数据时发生未知错误');
  }
};

/**
 * 从缓存加载专业数据
 */
export const loadProgramsFromCache = (): Program[] | null => {
  try {
    const cachedProgramsStr = localStorage.getItem('cachedPrograms');
    const cachedTimestamp = localStorage.getItem('cachedProgramsTimestamp');

    if (cachedProgramsStr && cachedTimestamp) {
      const now = new Date().getTime();
      const timestamp = parseInt(cachedTimestamp);
      const isExpired = now - timestamp > 24 * 60 * 60 * 1000;

      if (!isExpired) {
        const cachedPrograms = JSON.parse(cachedProgramsStr);
        console.log('从缓存加载专业数据:', cachedPrograms.length, '条');
        return cachedPrograms;
      } else {
        console.log('缓存已过期，重新加载专业数据');
      }
    }
  } catch (error) {
    console.error('读取缓存失败:', error);
  }
  return null;
};

/**
 * 缓存专业数据
 */
export const cacheProgramsData = (programs: Program[]): void => {
  try {
    // 只缓存必要的字段,减少存储空间
    const simplifiedPrograms = programs.map(p => ({
      id: p.id,
      cn_name: p.cn_name,
      en_name: p.en_name,
      school_id: p.school_id,
      category: p.category,
      degree: p.degree,
      duration: p.duration,
      tuition_fee: p.tuition_fee
    }));
    
    const dataStr = JSON.stringify(simplifiedPrograms);
    
    // 检查数据大小,如果超过4MB就不缓存
    if (dataStr.length > 4 * 1024 * 1024) {
      console.warn('专业数据过大,跳过缓存');
      return;
    }
    
    localStorage.setItem('cachedPrograms', dataStr);
    localStorage.setItem('cachedProgramsTimestamp', new Date().getTime().toString());
    console.log('专业数据已缓存');
  } catch (error) {
    console.error('缓存专业数据失败:', error);
    // 如果失败,清除可能的部分写入
    try {
      localStorage.removeItem('cachedPrograms');
      localStorage.removeItem('cachedProgramsTimestamp');
    } catch (e) {
      // 忽略清除错误
    }
  }
};

/**
 * 清除专业数据缓存
 */
export const clearProgramsCache = (): void => {
  localStorage.removeItem('cachedPrograms');
  localStorage.removeItem('cachedProgramsTimestamp');
  console.log('专业数据缓存已清除');
};

/**
 * 获取单个专业详情
 */
export const fetchProgramById = async (programId: string): Promise<Program | null> => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single();

    if (error) {
      console.error('获取专业详情失败:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const program: Program = {
      id: data.id || '',
      school_id: data.school_id || '',
      name: data.cn_name || data.en_name || '',
      cn_name: data.cn_name || '',
      en_name: data.en_name || '',
      degree: data.degree || '',
      duration: data.duration || '',
      tuition_fee: data.tuition_fee || '',
      faculty: data.faculty || '',
      category: data.category || '',
      subCategory: data.subCategory || '',
      tags: Array.isArray(data.tags) ? data.tags :
            typeof data.tags === 'string' ? data.tags.split(',') : [],
      apply_requirements: data.apply_requirements || '',
      language_requirements: data.language_requirements || '',
      curriculum: data.curriculum || '',
      analysis: data.analysis || '',
      url: data.url || '',
      interview: data.interview || '',
      objectives: data.objectives || '',
      rawData: data
    };

    return program;
  } catch (err) {
    console.error('获取专业详情出错:', err);
    return null;
  }
};


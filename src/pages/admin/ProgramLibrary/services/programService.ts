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
    let allProgramsData: Record<string, unknown>[] = [];

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
    const processedPrograms: Program[] = allProgramsData.map((dbProgram) => {
      const getString = (value: unknown): string => {
        return typeof value === 'string' ? value : '';
      };
      
      return {
        id: getString(dbProgram.id),
        school_id: getString(dbProgram.school_id),
        name: getString(dbProgram.cn_name) || getString(dbProgram.en_name),
        cn_name: getString(dbProgram.cn_name),
        en_name: getString(dbProgram.en_name),
        degree: getString(dbProgram.degree),
        duration: getString(dbProgram.duration),
        tuition_fee: getString(dbProgram.tuition_fee),
        faculty: getString(dbProgram.faculty),
        category: getString(dbProgram.category),
        subCategory: getString(dbProgram.subCategory),
        tags: Array.isArray(dbProgram.tags) ? dbProgram.tags as string[] :
              typeof dbProgram.tags === 'string' ? dbProgram.tags.split(',') : [],
        apply_requirements: getString(dbProgram.apply_requirements),
        language_requirements: getString(dbProgram.language_requirements),
        curriculum: getString(dbProgram.curriculum),
        analysis: getString(dbProgram.analysis),
        url: getString(dbProgram.url),
        interview: getString(dbProgram.interview),
        objectives: getString(dbProgram.objectives),
        // 新增字段
        credit_requirements: getString(dbProgram.credit_requirements),
        teaching_mode: getString(dbProgram.teaching_mode),
        study_mode: getString(dbProgram.study_mode),
        program_positioning: getString(dbProgram.program_positioning),
        course_structure: dbProgram.course_structure as Program['course_structure'] | undefined,
        application_timeline: dbProgram.application_timeline as Program['application_timeline'] | undefined,
        application_materials: dbProgram.application_materials as Program['application_materials'] | undefined,
        career_info: dbProgram.career_info as Program['career_info'] | undefined,
        program_features: Array.isArray(dbProgram.program_features) ? dbProgram.program_features as string[] : undefined,
        interview_guide: dbProgram.interview_guide as Program['interview_guide'] | undefined,
        application_guide: dbProgram.application_guide as Program['application_guide'] | undefined,
      };
    });

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
    } catch {
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
      rawData: data,
      // 新增字段
      credit_requirements: data.credit_requirements || undefined,
      teaching_mode: data.teaching_mode || undefined,
      study_mode: data.study_mode || undefined,
      program_positioning: data.program_positioning || undefined,
      course_structure: data.course_structure as Program['course_structure'] | undefined,
      application_timeline: data.application_timeline as Program['application_timeline'] | undefined,
      application_materials: data.application_materials as Program['application_materials'] | undefined,
      career_info: data.career_info as Program['career_info'] | undefined,
      program_features: Array.isArray(data.program_features) ? data.program_features : undefined,
      interview_guide: data.interview_guide as Program['interview_guide'] | undefined,
      application_guide: data.application_guide as Program['application_guide'] | undefined,
    };

    return program;
  } catch (err) {
    console.error('获取专业详情出错:', err);
    return null;
  }
};

/**
 * 更新专业信息
 */
export const updateProgram = async (programId: string, programData: Partial<Program>): Promise<Program | null> => {
  try {
    // 准备更新数据
    const updateData: Record<string, unknown> = {};

    if (programData.school_id !== undefined) updateData.school_id = programData.school_id;
    if (programData.en_name !== undefined) updateData.en_name = programData.en_name.trim() || null;
    if (programData.cn_name !== undefined) updateData.cn_name = programData.cn_name.trim() || null;
    if (programData.degree !== undefined) updateData.degree = programData.degree.trim() || null;
    if (programData.category !== undefined) updateData.category = programData.category.trim() || null;
    if (programData.subCategory !== undefined) updateData.subCategory = programData.subCategory.trim() || null;
    if (programData.faculty !== undefined) updateData.faculty = programData.faculty.trim() || null;
    if (programData.duration !== undefined) updateData.duration = programData.duration.trim() || null;
    if (programData.tuition_fee !== undefined) updateData.tuition_fee = programData.tuition_fee.trim() || null;
    if (programData.language_requirements !== undefined) updateData.language_requirements = programData.language_requirements.trim() || null;
    if (programData.apply_requirements !== undefined) updateData.apply_requirements = programData.apply_requirements.trim() || null;
    if (programData.curriculum !== undefined) updateData.curriculum = programData.curriculum.trim() || null;
    if (programData.objectives !== undefined) updateData.objectives = programData.objectives.trim() || null;
    if (programData.analysis !== undefined) updateData.analysis = programData.analysis.trim() || null;
    if (programData.url !== undefined) updateData.url = programData.url.trim() || null;
    if (programData.interview !== undefined) updateData.interview = programData.interview.trim() || null;
    if (programData.tags !== undefined) {
      updateData.tags = Array.isArray(programData.tags) && programData.tags.length > 0 
        ? programData.tags 
        : null;
    }
    
    // 新增字段 - 基础信息扩展
    if (programData.credit_requirements !== undefined) updateData.credit_requirements = programData.credit_requirements.trim() || null;
    if (programData.teaching_mode !== undefined) updateData.teaching_mode = programData.teaching_mode.trim() || null;
    if (programData.study_mode !== undefined) updateData.study_mode = programData.study_mode.trim() || null;
    if (programData.program_positioning !== undefined) updateData.program_positioning = programData.program_positioning.trim() || null;
    
    // JSONB结构化字段
    if (programData.course_structure !== undefined) updateData.course_structure = programData.course_structure || null;
    if (programData.application_timeline !== undefined) updateData.application_timeline = programData.application_timeline || null;
    if (programData.application_materials !== undefined) updateData.application_materials = programData.application_materials || null;
    if (programData.career_info !== undefined) updateData.career_info = programData.career_info || null;
    if (programData.program_features !== undefined) {
      updateData.program_features = Array.isArray(programData.program_features) && programData.program_features.length > 0
        ? programData.program_features
        : null;
    }
    if (programData.interview_guide !== undefined) updateData.interview_guide = programData.interview_guide || null;
    if (programData.application_guide !== undefined) updateData.application_guide = programData.application_guide || null;

    // 执行更新
    const { data, error } = await supabase
      .from('programs')
      .update(updateData)
      .eq('id', programId)
      .select()
      .single();

    if (error) {
      console.error('更新专业失败:', error);
      throw new Error(error.message || '更新专业失败');
    }

    if (!data) {
      return null;
    }

    // 转换返回数据
    const updatedProgram: Program = {
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
      rawData: data,
      // 新增字段
      credit_requirements: data.credit_requirements || undefined,
      teaching_mode: data.teaching_mode || undefined,
      study_mode: data.study_mode || undefined,
      program_positioning: data.program_positioning || undefined,
      course_structure: data.course_structure as Program['course_structure'] | undefined,
      application_timeline: data.application_timeline as Program['application_timeline'] | undefined,
      application_materials: data.application_materials as Program['application_materials'] | undefined,
      career_info: data.career_info as Program['career_info'] | undefined,
      program_features: Array.isArray(data.program_features) ? data.program_features : undefined,
      interview_guide: data.interview_guide as Program['interview_guide'] | undefined,
      application_guide: data.application_guide as Program['application_guide'] | undefined,
    };

    console.log('✅ 专业更新成功:', updatedProgram.id);
    return updatedProgram;
  } catch (err) {
    console.error('更新专业出错:', err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('更新专业时发生未知错误');
  }
};


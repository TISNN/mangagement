/**
 * 专业库自定义Hook
 */

import { useState, useEffect, useMemo } from 'react';
import { Program, ProgramFilters } from '../types/program.types';
import { 
  fetchAllPrograms, 
  loadProgramsFromCache, 
  cacheProgramsData,
  clearProgramsCache 
} from '../services/programService';
import { School } from '../../SchoolLibrary/types/school.types';

export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      // 🚧 开发阶段: 完全禁用缓存,每次都从数据库加载最新数据
      // const cachedPrograms = loadProgramsFromCache();
      // if (cachedPrograms) {
      //   setPrograms(cachedPrograms);
      //   return;
      // }

      // 从服务器加载
      try {
        setLoading(true);
        console.log('🔄 从数据库加载专业数据(缓存已禁用)...');
        const programsData = await fetchAllPrograms();
        setPrograms(programsData);
        // cacheProgramsData(programsData); // 禁用缓存写入
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (programs.length === 0) {
      loadPrograms();
    }
  }, []);

  const refreshPrograms = async () => {
    clearProgramsCache();
    setPrograms([]);
    setError(null);
    setLoading(true);
    
    try {
      const programsData = await fetchAllPrograms();
      setPrograms(programsData);
      cacheProgramsData(programsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { programs, loading, error, refreshPrograms };
};

export const useProgramFilters = (
  programs: Program[],
  filters: ProgramFilters,
  schools: School[]
) => {
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      // 专业名称搜索匹配
      const searchMatch = filters.searchQuery
        ? (program.name || program.cn_name || program.en_name || '').toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;

      // 分类匹配
      const categoryMatch = filters.category === '全部' ||
        (program.category && program.category.toString() === filters.category);

      // 子分类匹配
      const subCategoryMatch = filters.subCategory === '全部' ||
        (program.subCategory && program.subCategory === filters.subCategory);

      // 学位类型匹配
      const degreeMatch = filters.degree === '全部' ||
        (program.degree && program.degree === filters.degree);

      // 学制长度匹配
      const durationMatch = filters.duration === '全部' ||
        (program.duration && program.duration === filters.duration);

      // 获取专业所属学校
      const school = schools.find(s => s.id === program.school_id);

      // 地区匹配
      const regionMatch = !school ? true :
        filters.region === '全部' || school.region === filters.region;

      // 国家匹配
      const countryMatch = !school ? true :
        filters.country === '全部' || school.country === filters.country;

      return searchMatch && categoryMatch && subCategoryMatch && degreeMatch && durationMatch && regionMatch && countryMatch;
    });
  }, [programs, filters, schools]);

  return filteredPrograms;
};


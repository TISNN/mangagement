/**
 * 学校库自定义Hook
 */

import { useState, useEffect, useMemo } from 'react';
import { School, Program, SchoolFilters } from '../types/school.types';
import { fetchAllSchools, associateProgramsWithSchools } from '../services/schoolService';

export const useSchools = (programs: Program[] = []) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const schoolsData = await fetchAllSchools();
        setSchools(schoolsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  // 当专业数据加载完成后,关联到学校
  useEffect(() => {
    if (programs.length > 0 && schools.length > 0) {
      const schoolsWithPrograms = associateProgramsWithSchools(schools, programs);
      setSchools(schoolsWithPrograms);
    }
  }, [programs]);

  return { schools, setSchools, loading, error };
};

export const useSchoolFilters = (
  schools: School[],
  searchQuery: string,
  filters: SchoolFilters
) => {
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      if (!school) return false;

      // 搜索匹配
      const schoolName = (school.name || '').toLowerCase();
      const schoolCountry = (school.country || '').toLowerCase();
      const schoolLocation = (school.location || '').toLowerCase();
      const searchTerm = (searchQuery || '').toLowerCase();

      const searchMatch = !searchTerm ||
        schoolName.includes(searchTerm) ||
        schoolCountry.includes(searchTerm) ||
        schoolLocation.includes(searchTerm);

      // 地区匹配
      const regionMatch =
        filters.region === '全部' ||
        (school.region && school.region === filters.region);

      // 国家匹配
      const countryMatch =
        filters.country === '全部' ||
        (school.country && school.country === filters.country);

      // 排名匹配
      let rankingMatch = true;
      if (filters.rankingRange[0] === 1 && filters.rankingRange[1] >= 10000) {
        rankingMatch = true;
      } else {
        const rankingStr = school.ranking || '';
        const rankingNum = parseInt(rankingStr.replace(/\D/g, ''));

        if (!isNaN(rankingNum)) {
          rankingMatch = rankingNum >= filters.rankingRange[0] &&
                        rankingNum <= filters.rankingRange[1];
        } else {
          rankingMatch = filters.rankingRange[1] >= 300 ||
                        filters.rankingRange[1] >= 10000;
        }
      }

      return searchMatch && regionMatch && countryMatch && rankingMatch;
    });
  }, [schools, searchQuery, filters]);

  return filteredSchools;
};


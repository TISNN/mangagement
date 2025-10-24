/**
 * 学校详情页面Hook
 */

import { useState, useEffect } from 'react';
import { fetchSchoolById, fetchSchoolPrograms, fetchSchoolSuccessCases, SuccessCase } from '../services/schoolService';
import { School, Program } from '../types/school.types';

export const useSchoolDetail = (schoolId: string | undefined) => {
  const [school, setSchool] = useState<School | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [successCases, setSuccessCases] = useState<SuccessCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 并行获取所有数据
        const [schoolData, programsData, casesData] = await Promise.all([
          fetchSchoolById(schoolId),
          fetchSchoolPrograms(schoolId),
          fetchSchoolSuccessCases(schoolId)
        ]);

        if (!schoolData) {
          setError('未找到学校信息');
          return;
        }

        setSchool(schoolData);
        setPrograms(programsData);
        setSuccessCases(casesData);
      } catch (err) {
        console.error('获取学校详情失败:', err);
        setError('获取学校详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId]);

  return {
    school,
    programs,
    successCases,
    loading,
    error
  };
};


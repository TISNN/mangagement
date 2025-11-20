/**
 * 专业详情Hook
 */

import { useState, useEffect } from 'react';
import { fetchProgramById } from '../services/programService';
import { fetchSchoolById } from '../../SchoolLibrary/services/schoolService';
import { Program } from '../types/program.types';
import { School } from '../../SchoolLibrary/types/school.types';

export const useProgramDetail = (programId: string | undefined) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!programId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 获取专业详情
      const programData = await fetchProgramById(programId);

      if (!programData) {
        setError('未找到专业信息');
        return;
      }

      setProgram(programData);

      // 获取学校信息
      if (programData.school_id) {
        const schoolData = await fetchSchoolById(programData.school_id);
        setSchool(schoolData);
      }
    } catch (err) {
      console.error('获取专业详情失败:', err);
      setError('获取专业详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

  // 刷新数据
  const refresh = () => {
    fetchData();
  };

  return {
    program,
    school,
    loading,
    error,
    refresh
  };
};


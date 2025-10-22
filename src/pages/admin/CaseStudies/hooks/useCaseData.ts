import { useState, useEffect, useCallback } from 'react';
import { CaseStudy } from '../../../../types/case';
import * as caseService from '../../../../services/caseService';
import toast from 'react-hot-toast';

export const useCaseData = () => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalCases: 0,
    acceptedCases: 0,
    acceptanceRate: '0%',
  });

  // 加载案例列表
  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await caseService.getCaseStudies();
      setCases(data);
    } catch (error) {
      console.error('加载案例列表失败:', error);
      toast.error('加载案例列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载统计数据
  const loadStatistics = useCallback(async () => {
    try {
      const stats = await caseService.getCaseStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  }, []);

  // 创建案例
  const createCase = async (caseData: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await caseService.createCaseStudy(caseData);
      toast.success('案例创建成功');
      await loadCases();
      await loadStatistics();
    } catch (error) {
      console.error('创建案例失败:', error);
      toast.error('创建案例失败');
      throw error;
    }
  };

  // 删除案例
  const deleteCase = async (id: number) => {
    try {
      await caseService.deleteCaseStudy(id);
      toast.success('案例删除成功');
      await loadCases();
      await loadStatistics();
    } catch (error) {
      console.error('删除案例失败:', error);
      toast.error('删除案例失败');
      throw error;
    }
  };

  // 初始加载
  useEffect(() => {
    loadCases();
    loadStatistics();
  }, [loadCases, loadStatistics]);

  return {
    cases,
    loading,
    statistics,
    loadCases,
    createCase,
    deleteCase,
  };
};


import { useState, useEffect, useCallback } from 'react';
import { CaseStudy, CaseLibraryType } from '../../../../types/case';
import * as caseService from '../../../../services/caseService';
import toast from 'react-hot-toast';

// 获取当前用户ID
function getCurrentUserId(): number | null {
  try {
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      const employeeData = localStorage.getItem('currentEmployee');
      if (employeeData) {
        const employee = JSON.parse(employeeData);
        return employee.id || null;
      }
    }
  } catch (error) {
    console.error('获取当前用户ID失败:', error);
  }
  return null;
}

export const useCaseData = (libraryType: CaseLibraryType = 'my') => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalCases: 0,
    acceptedCases: 0,
    acceptanceRate: '0%',
    publicCases: 0,
    myCases: 0,
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 获取当前用户ID
  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  // 加载案例列表
  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      let data: CaseStudy[];
      const userId = getCurrentUserId();
      
      if (libraryType === 'my') {
        if (!userId) {
          toast.error('请先登录');
          setCases([]);
          return;
        }
        data = await caseService.getMyCases(userId);
      } else {
        data = await caseService.getPublicCases();
      }
      
      setCases(data);
    } catch (error) {
      console.error('加载案例列表失败:', error);
      toast.error('加载案例列表失败');
    } finally {
      setLoading(false);
    }
  }, [libraryType]);

  // 加载统计数据
  const loadStatistics = useCallback(async () => {
    try {
      const userId = getCurrentUserId();
      const stats = await caseService.getCaseStatistics(userId || undefined);
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  }, []);

  // 创建案例
  const createCase = async (caseData: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const userId = getCurrentUserId();
      await caseService.createCaseStudy(caseData, userId || undefined);
      toast.success('案例创建成功');
      await loadCases();
      await loadStatistics();
    } catch (error) {
      console.error('创建案例失败:', error);
      toast.error('创建案例失败');
      throw error;
    }
  };

  // 更新案例
  const updateCase = async (id: string, updates: Partial<CaseStudy>) => {
    try {
      await caseService.updateCaseStudy(id, updates);
      toast.success('案例更新成功');
      await loadCases();
      await loadStatistics();
    } catch (error) {
      console.error('更新案例失败:', error);
      toast.error('更新案例失败');
      throw error;
    }
  };

  // 删除案例
  const deleteCase = async (id: string) => {
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

  // 分享案例到公共库
  const shareCase = async (caseId: string) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error('请先登录');
        return;
      }
      await caseService.shareCaseToPublic(caseId, userId);
      toast.success('案例已分享到公共库');
      await loadCases();
      await loadStatistics();
    } catch (error: any) {
      console.error('分享案例失败:', error);
      toast.error(error.message || '分享案例失败');
      throw error;
    }
  };

  // 撤回案例分享
  const unshareCase = async (caseId: string) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error('请先登录');
        return;
      }
      await caseService.unshareCaseFromPublic(caseId, userId);
      toast.success('案例已撤回，恢复为私有');
      await loadCases();
      await loadStatistics();
    } catch (error: any) {
      console.error('撤回案例失败:', error);
      toast.error(error.message || '撤回案例失败');
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
    currentUserId,
    loadCases,
    createCase,
    updateCase,
    deleteCase,
    shareCase,
    unshareCase,
  };
};


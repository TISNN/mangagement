// 导师数据管理自定义Hook

import { useState, useEffect } from 'react';
import { fetchAllMentors } from '../services/mentorService';
import type { Mentor } from '../types/mentor.types';

/**
 * useMentors Hook - 管理导师数据的获取和状态
 * 
 * @returns {Object} 包含导师列表、加载状态、错误信息和刷新方法
 */
export const useMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始加载导师数据
  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 加载导师数据...');
        
        const mentorsData = await fetchAllMentors();
        setMentors(mentorsData);
        
        console.log(`✅ 成功加载 ${mentorsData.length} 位导师`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误';
        setError(errorMessage);
        console.error('❌ 加载导师数据失败:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // 只在mentors为空时加载
    if (mentors.length === 0) {
      loadMentors();
    }
  }, [mentors.length]);

  /**
   * 刷新导师数据
   */
  const refreshMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 刷新导师数据...');
      
      const mentorsData = await fetchAllMentors();
      setMentors(mentorsData);
      
      console.log(`✅ 刷新成功,共 ${mentorsData.length} 位导师`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      console.error('❌ 刷新导师数据失败:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    mentors,
    loading,
    error,
    refreshMentors,
  };
};


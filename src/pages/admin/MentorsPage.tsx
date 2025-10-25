// 导师库页面 - 重构版本,使用真实数据库数据

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RefreshCw } from 'lucide-react';
import { useMentors } from './MentorLibrary/hooks/useMentors';
import { MentorCard } from './MentorLibrary/components/MentorCard';
import { MentorFilters } from './MentorLibrary/components/MentorFilters';
import { getLocationOptions, getSpecializationOptions } from './MentorLibrary/services/mentorService';
import type { MentorFilters as MentorFiltersType, Mentor } from './MentorLibrary/types/mentor.types';

interface MentorsPageProps {
  setCurrentPage?: (page: string) => void;
}

function MentorsPage({ setCurrentPage }: MentorsPageProps) {
  const navigate = useNavigate();
  
  // 使用自定义hook获取导师数据
  const { mentors, loading, error, refreshMentors } = useMentors();

  // 筛选器状态
  const [mentorFilters, setMentorFilters] = useState<MentorFiltersType>({
    searchQuery: '',
    serviceScope: '全部',
    location: '全部',
    expertiseLevel: '全部',
    specialization: '全部',
    isActive: undefined,
  });

  // 地理位置和专业方向选项
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [specializationOptions, setSpecializationOptions] = useState<string[]>([]);

  // 加载筛选选项
  useEffect(() => {
    const loadFilterOptions = async () => {
      const [locations, specializations] = await Promise.all([
        getLocationOptions(),
        getSpecializationOptions()
      ]);
      setLocationOptions(locations);
      setSpecializationOptions(specializations);
    };
    loadFilterOptions();
  }, [mentors]);

  // 筛选导师
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor: Mentor) => {
      // 搜索关键词筛选
      if (mentorFilters.searchQuery) {
        const query = mentorFilters.searchQuery.toLowerCase();
        const matchesName = mentor.name.toLowerCase().includes(query);
        const matchesSpecializations = mentor.specializations.some(
          spec => spec.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSpecializations) {
          return false;
        }
      }

      // 服务范围筛选
      if (mentorFilters.serviceScope !== '全部') {
        if (!mentor.serviceScope.includes(mentorFilters.serviceScope as any)) {
          return false;
        }
      }

      // 地理位置筛选
      if (mentorFilters.location !== '全部') {
        if (mentor.location !== mentorFilters.location) {
          return false;
        }
      }

      // 专业级别筛选
      if (mentorFilters.expertiseLevel !== '全部') {
        if (mentor.expertiseLevel !== mentorFilters.expertiseLevel) {
          return false;
        }
      }

      // 专业方向筛选
      if (mentorFilters.specialization !== '全部') {
        if (!mentor.specializations.includes(mentorFilters.specialization)) {
          return false;
        }
      }

      // 活跃状态筛选
      if (mentorFilters.isActive !== undefined) {
        if (mentor.isActive !== mentorFilters.isActive) {
          return false;
        }
      }

    return true;
    });
  }, [mentors, mentorFilters]);

  // 按服务范围分组统计
  const serviceScopeStats = useMemo(() => {
    const stats: Record<string, number> = {
      '留学申请': 0,
      '课业辅导': 0,
      '科研': 0,
      '语言培训': 0,
    };

    mentors.forEach((mentor: Mentor) => {
      mentor.serviceScope.forEach(scope => {
        if (scope in stats) {
          stats[scope]++;
        }
      });
    });

    return stats;
  }, [mentors]);

  // 点击导师卡片
  const handleMentorClick = (mentor: Mentor) => {
    console.log('点击导师:', mentor);
    // 导航到导师详情页
    navigate(`/admin/mentors/${mentor.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">导师库</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                浏览和搜索专业导师信息
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共 {filteredMentors.length} 位导师
            </span>
            <button
              onClick={refreshMentors}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
      {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* 总导师数 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">总导师数</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mentors.length}</p>
      </div>

          {/* 各服务范围统计 */}
          {Object.entries(serviceScopeStats).map(([scope, count]) => (
            <div key={scope} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">{scope}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            </div>
          ))}
        </div>

        {/* 筛选器 */}
        <MentorFilters
          filters={mentorFilters}
          onFiltersChange={setMentorFilters}
          locationOptions={locationOptions}
          specializationOptions={specializationOptions}
        />

        {/* 导师列表 */}
        <div className="mt-6">
          {/* 加载状态 */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 dark:text-gray-400">正在加载导师数据...</p>
                      </div>
                    </div>
          )}

          {/* 错误状态 */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">加载失败</p>
                <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error}</p>
                <button
                  onClick={refreshMentors}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  重新加载
                </button>
              </div>
            </div>
          )}

          {/* 导师卡片网格 */}
          {!loading && !error && (
            <>
              {filteredMentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors.map((mentor: Mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      onClick={handleMentorClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">未找到符合条件的导师</p>
          </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorsPage; 

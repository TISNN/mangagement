/**
 * 院校库页面 - 独立页面
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { School as SchoolIcon, Plus } from 'lucide-react';

// 导入学校库模块
import { 
  useSchools, 
  SchoolCard, 
  SchoolFilters
} from './SchoolLibrary';

// 导入专业库模块 (需要专业数据来关联学校)
import { usePrograms } from './ProgramLibrary';

const SchoolLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);
  
  // 1. 使用专业库Hook获取专业数据
  const { programs, loading: programsLoading, error: programsError } = usePrograms();
  
  // 2. 使用学校库Hook,传入专业数据以关联
  const { schools, loading: schoolsLoading, error: schoolsError } = useSchools(programs);
  
  // 3. 学校筛选状态
  const [schoolFilters, setSchoolFilters] = useState({
    region: '全部',
    country: '全部',
    rankingRange: [1, 1000] as [number, number],
    searchQuery: ''
  });
  
  // 4. 收藏状态管理 (本地简化版)
  const [interestedSchools, setInterestedSchools] = useState<string[]>([]);
  const [interestedPrograms, setInterestedPrograms] = useState<string[]>([]);
  
  const addSchool = (school: { id: string }) => {
    if (!interestedSchools.includes(school.id)) {
      setInterestedSchools(prev => [...prev, school.id]);
    }
  };
  
  const removeSchool = (schoolId: string) => {
    setInterestedSchools(prev => prev.filter(id => id !== schoolId));
  };
  
  const isSchoolInterested = (schoolId: string): boolean => {
    return interestedSchools.includes(schoolId);
  };
  
  const toggleProgramInterest = (schoolId: string, programId: string) => {
    const key = `${schoolId}-${programId}`;
    setInterestedPrograms(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };
  
  const isProgramInterested = (schoolId: string, programId: string): boolean => {
    return interestedPrograms.includes(`${schoolId}-${programId}`);
  };

  // 筛选学校
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // 国家/地区筛选 (检查country字段)
      if (schoolFilters.country !== '全部' && school.country !== schoolFilters.country) {
        return false;
      }

      // 排名筛选
      if (schoolFilters.rankingRange) {
        const rankingStr = school.ranking || '';
        const ranking = parseInt(rankingStr.replace(/[^0-9]/g, ''));
        if (!isNaN(ranking)) {
          if (ranking < schoolFilters.rankingRange[0] || ranking > schoolFilters.rankingRange[1]) {
            return false;
          }
        }
      }

      // 搜索查询
      if (schoolFilters.searchQuery && schoolFilters.searchQuery.trim()) {
        const query = schoolFilters.searchQuery.toLowerCase().trim();
        const schoolName = (school.name || '').toLowerCase();
        const schoolLocation = (school.location || '').toLowerCase();
        const schoolCountry = (school.country || '').toLowerCase();
        const schoolRegion = (school.region || '').toLowerCase();
        
        const matchesSearch = 
          schoolName.includes(query) ||
          schoolLocation.includes(query) ||
          schoolCountry.includes(query) ||
          schoolRegion.includes(query) ||
          school.tags?.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }, [schools, schoolFilters]);

  // 切换专业展开状态
  const handleToggleExpand = (key: string) => {
    setExpandedPrograms(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // 处理学校收藏
  const handleToggleInterest = (school: { id: string }) => {
    if (isSchoolInterested(school.id)) {
      removeSchool(school.id);
    } else {
      addSchool(school);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <SchoolIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">院校库</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                浏览和搜索全球院校信息
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共 {filteredSchools.length} 所院校
            </span>
            <button
              onClick={() => navigate('/admin/school-library/add')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              添加学校
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 筛选器 */}
        <SchoolFilters
          filters={schoolFilters}
          onFiltersChange={setSchoolFilters}
        />

        {/* 学校列表 */}
        <div className="mt-6 grid grid-cols-1 gap-4">
          {/* 加载状态 */}
          {(schoolsLoading || programsLoading) && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  {schoolsLoading ? '正在加载院校数据...' : '正在加载专业数据...'}
                </p>
              </div>
            </div>
          )}

          {/* 错误状态 */}
          {(schoolsError || programsError) && !schoolsLoading && !programsLoading && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">加载失败</p>
                <p className="text-red-500 dark:text-red-300 text-sm mb-4">
                  {schoolsError || programsError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  重新加载
                </button>
              </div>
            </div>
          )}

          {/* 数据列表 */}
          {!schoolsLoading && !programsLoading && !schoolsError && !programsError && (
            <>
              {filteredSchools.map(school => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  isInterested={isSchoolInterested(school.id)}
                  expandedPrograms={expandedPrograms}
                  onToggleInterest={handleToggleInterest}
                  onToggleExpand={handleToggleExpand}
                  onToggleProgramInterest={toggleProgramInterest}
                  isProgramInterested={isProgramInterested}
                />
              ))}

              {filteredSchools.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">未找到符合条件的院校</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolLibraryPage;


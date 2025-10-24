/**
 * 专业库页面 - 独立页面
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// 导入专业库模块
import { 
  usePrograms, 
  ProgramFilters,
  ProgramCard
} from './ProgramLibrary';

// 导入学校库模块 (需要学校数据来关联专业)
import { useSchools } from './SchoolLibrary';

const ProgramLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. 使用专业库Hook
  const { programs, loading: programsLoading, error: programsError } = usePrograms();
  
  // 2. 使用学校库Hook
  const { schools, loading: schoolsLoading, error: schoolsError } = useSchools(programs);
  
  // 3. 专业筛选状态
  const [programFilters, setProgramFilters] = useState({
    category: '全部',
    subCategory: '全部',
    region: '全部',
    country: '全部',
    searchQuery: '',
    degree: '全部',
    duration: '全部'
  });
  
  // 4. 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // 5. 收藏状态管理 (本地简化版)
  const [interestedPrograms, setInterestedPrograms] = useState<string[]>([]);
  
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

  // 获取专业对应的学校
  const getProgramSchool = (schoolId: string) => {
    return schools.find(s => s.id === schoolId);
  };

  // 筛选专业
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      // 类别筛选
      if (programFilters.category !== '全部' && program.category !== programFilters.category) {
        return false;
      }

      // 学位筛选
      if (programFilters.degree !== '全部' && program.degree !== programFilters.degree) {
        return false;
      }

      // 学制筛选
      if (programFilters.duration !== '全部' && program.duration !== programFilters.duration) {
        return false;
      }

      // 地区筛选
      if (programFilters.region !== '全部') {
        const school = getProgramSchool(program.school_id);
        if (!school || school.region !== programFilters.region) {
          return false;
        }
      }

      // 国家筛选
      if (programFilters.country !== '全部') {
        const school = getProgramSchool(program.school_id);
        if (!school || school.country !== programFilters.country) {
          return false;
        }
      }

      // 搜索查询
      if (programFilters.searchQuery) {
        const query = programFilters.searchQuery.toLowerCase();
        return (
          program.cn_name?.toLowerCase().includes(query) ||
          program.en_name?.toLowerCase().includes(query) ||
          program.category?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [programs, programFilters, schools]);

  // 分页
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrograms = filteredPrograms.slice(startIndex, endIndex);

  // 页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">专业库</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                浏览和搜索全球专业项目
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共 {filteredPrograms.length} 个专业
            </span>
            <button
              onClick={() => navigate('/admin/program-library/add')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              添加专业
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 筛选器 */}
        <ProgramFilters
          filters={programFilters}
          onFiltersChange={setProgramFilters}
          onSearch={() => {}}
          onReset={() => setProgramFilters({
            category: '全部',
            subCategory: '全部',
            region: '全部',
            country: '全部',
            searchQuery: '',
            degree: '全部',
            duration: '全部'
          })}
        />

        {/* 专业列表 */}
        <div className="mt-6 space-y-3">
          {/* 加载状态 */}
          {(programsLoading || schoolsLoading) && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  {programsLoading ? '正在加载专业数据...' : '正在加载院校数据...'}
                </p>
              </div>
            </div>
          )}

          {/* 错误状态 */}
          {(programsError || schoolsError) && !programsLoading && !schoolsLoading && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">加载失败</p>
                <p className="text-red-500 dark:text-red-300 text-sm mb-4">
                  {programsError || schoolsError}
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
          {!programsLoading && !schoolsLoading && !programsError && !schoolsError && (
            <>
              {currentPrograms.map(program => {
                const school = getProgramSchool(program.school_id);
                return (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    school={school}
                    isProgramInterested={isProgramInterested}
                    onToggleProgramInterest={toggleProgramInterest}
                  />
                );
              })}

              {currentPrograms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">未找到符合条件的专业</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramLibraryPage;


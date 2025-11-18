import React, { useState, useMemo } from 'react';
import { Plus, FileCheck, TrendingUp, Award } from 'lucide-react';
import { CaseStudy, CaseStudyFilters, ViewMode } from '../../../types/case';
import { useCaseData } from './hooks/useCaseData';
import CaseFilters from './components/CaseFilters';
import ViewTabs from './components/ViewTabs';
import CaseGridView from './components/CaseGridView';
import CaseListView from './components/CaseListView';
import CaseTableView from './components/CaseTableView';
import CaseDetailPanel from './components/CaseDetailPanel';
import CreateCaseModal from './components/CreateCaseModal';
import EditCaseModal from './components/EditCaseModal';

const CaseStudiesPage: React.FC = () => {
  const { cases, loading, statistics, createCase, updateCase } = useCaseData();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<CaseStudyFilters>({
    search: '',
    region: '',
    school: '',
    major_type: '',
    admission_result: '',
  });
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 筛选逻辑
  const filteredCases = useMemo(() => {
    return cases.filter((caseStudy) => {
      // 搜索筛选
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          (caseStudy.school?.toLowerCase() || '').includes(searchLower) ||
          (caseStudy.applied_program?.toLowerCase() || '').includes(searchLower) ||
          (caseStudy.bachelor_university?.toLowerCase() || '').includes(searchLower) ||
          (caseStudy.bachelor_major?.toLowerCase() || '').includes(searchLower) ||
          (caseStudy.student_name?.toLowerCase() || '').includes(searchLower);
        if (!matchesSearch) return false;
      }

      // 地区筛选
      if (filters.region && caseStudy.region !== filters.region) {
        return false;
      }

      // 学校筛选
      if (filters.school && !(caseStudy.school || '').includes(filters.school)) {
        return false;
      }

      // 专业类型筛选（简单的包含匹配）
      if (filters.major_type && !(caseStudy.applied_program || '').includes(filters.major_type)) {
        return false;
      }

      // 录取结果筛选 - success_cases都是成功案例
      if (filters.admission_result && filters.admission_result !== 'accepted') {
        return false;
      }

      return true;
    });
  }, [cases, filters]);

  // 处理筛选变化
  const handleFilterChange = (key: keyof CaseStudyFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  // 清除筛选
  const handleClearFilters = () => {
    setFilters({
      search: '',
      region: '',
      school: '',
      major_type: '',
      admission_result: '',
    });
  };

  // 处理案例点击
  const handleCaseClick = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
  };

  // 处理创建案例
  const handleCreateCase = async (caseData: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>) => {
    await createCase(caseData);
    setIsCreateModalOpen(false);
  };

  // 处理编辑案例
  const handleEditCase = (caseStudy: CaseStudy) => {
    setEditingCase(caseStudy);
    setIsEditModalOpen(true);
  };

  // 处理更新案例
  const handleUpdateCase = async (id: string, updates: Partial<CaseStudy>) => {
    await updateCase(id, updates);
    setIsEditModalOpen(false);
    setEditingCase(null);
    // 如果正在查看的案例被编辑，更新选中状态
    if (selectedCase && selectedCase.id === id) {
      // 重新加载案例列表以获取最新数据
      // 这里可以优化为直接更新selectedCase，但为了确保数据同步，我们关闭面板
      setSelectedCase(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            案例库
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理和查看所有成功案例
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ViewTabs activeView={viewMode} onViewChange={setViewMode} />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            新建案例
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: '成功案例',
            value: statistics.totalCases.toString(),
            change: '+12.5%',
            icon: FileCheck,
            color: 'green'
          },
          {
            title: '已录取',
            value: statistics.acceptedCases.toString(),
            change: '+8.3%',
            icon: Award,
            color: 'blue'
          },
          {
            title: '录取率',
            value: statistics.acceptanceRate,
            change: '+5.2%',
            icon: TrendingUp,
            color: 'purple'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 筛选器 */}
      <CaseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* 案例显示区域 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">加载中...</span>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <CaseGridView cases={filteredCases} onCaseClick={handleCaseClick} />
          )}
          {viewMode === 'list' && (
            <CaseListView cases={filteredCases} onCaseClick={handleCaseClick} />
          )}
          {viewMode === 'table' && (
            <CaseTableView cases={filteredCases} onCaseClick={handleCaseClick} />
          )}
        </>
      )}

      {/* 案例详情面板 */}
      {selectedCase && (
        <CaseDetailPanel
          caseStudy={selectedCase}
          onClose={() => setSelectedCase(null)}
          onEdit={handleEditCase}
        />
      )}

      {/* 创建案例模态框 */}
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />

      {/* 编辑案例模态框 */}
      <EditCaseModal
        isOpen={isEditModalOpen}
        caseStudy={editingCase}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCase(null);
        }}
        onSubmit={handleUpdateCase}
      />
    </div>
  );
};

export default CaseStudiesPage;


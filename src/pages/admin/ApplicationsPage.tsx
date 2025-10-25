/**
 * 申请进度管理页面
 * 连接Supabase数据库,展示所有学生的申请进度
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  FileText, 
  Clock, 
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useApplicationOverviews, useApplicationStats } from './ApplicationProgress/hooks/useApplications';
import ApplicationCard from './ApplicationProgress/components/ApplicationCard';
import StatCard from './ApplicationProgress/components/StatCard';

function ApplicationsPage() {
  const navigate = useNavigate();
  const { overviews, loading, error, reload } = useApplicationOverviews();
  const { stats, loading: statsLoading } = useApplicationStats();

  // 筛选和搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<string | null>(null);
  const [selectedUrgent, setSelectedUrgent] = useState<boolean | null>(null);
  
  // 分页状态
  const [pageIndex, setPageIndex] = useState(1);
  const itemsPerPage = 5;

  // 筛选应用数据
  const filteredApplications = useMemo(() => {
    return overviews.filter(overview => {
      // 搜索匹配
      const matchesSearch = searchTerm === '' || 
        overview.student_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 进度筛选
      const matchesProgress = selectedProgress === null || 
        (selectedProgress === 'high' && overview.overall_progress >= 80) ||
        (selectedProgress === 'medium' && overview.overall_progress >= 50 && overview.overall_progress < 80) ||
        (selectedProgress === 'low' && overview.overall_progress < 50);
      
      // 紧急任务筛选
      const matchesUrgent = selectedUrgent === null || 
        (selectedUrgent && overview.urgent_tasks && overview.urgent_tasks.length > 0) ||
        (!selectedUrgent && (!overview.urgent_tasks || overview.urgent_tasks.length === 0));
      
      return matchesSearch && matchesProgress && matchesUrgent;
    });
  }, [overviews, searchTerm, selectedProgress, selectedUrgent]);

  // 计算分页数据
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const currentApplications = filteredApplications.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage
  );

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProgress(null);
    setSelectedUrgent(null);
    setPageIndex(1);
  };

  // 处理卡片点击
  const handleCardClick = (studentId: number) => {
    navigate(`/admin/applications/${studentId}`);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">加载申请数据中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">加载失败</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 顶部标题和搜索 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">申请进度</h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索学生..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            筛选
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button 
            onClick={() => navigate('/admin/applications/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            新建申请
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">申请进度</label>
              <select 
                value={selectedProgress || ''}
                onChange={(e) => setSelectedProgress(e.target.value || null)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="">全部进度</option>
                <option value="high">高进度 (≥80%)</option>
                <option value="medium">中等进度 (50-79%)</option>
                <option value="low">低进度 (&lt;50%)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">紧急状态</label>
              <select 
                value={selectedUrgent === null ? '' : selectedUrgent ? 'yes' : 'no'}
                onChange={(e) => setSelectedUrgent(e.target.value === '' ? null : e.target.value === 'yes')}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="">全部</option>
                <option value="yes">有紧急任务</option>
                <option value="no">无紧急任务</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              重置筛选条件
            </button>
          </div>
        </div>
      )}

      {/* 统计摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          label="申请总数"
          value={statsLoading ? '-' : stats.total}
        />
        
        <StatCard
          icon={Clock}
          iconColor="text-yellow-600 dark:text-yellow-400"
          iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
          label="紧急任务"
          value={statsLoading ? '-' : stats.urgent}
        />
        
        <StatCard
          icon={CheckCircle2}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          label="已录取"
          value={statsLoading ? '-' : stats.accepted}
        />
        
        <StatCard
          icon={BarChart3}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          label="完成率"
          value={statsLoading ? '-' : `${stats.completion_rate}%`}
          extra={!statsLoading && (
            <div className="w-24 h-2 bg-gray-100 rounded-full dark:bg-gray-700">
              <div 
                className="h-full bg-green-500 rounded-full dark:bg-green-400" 
                style={{ width: `${stats.completion_rate}%` }}
              ></div>
            </div>
          )}
        />
      </div>

      {/* 申请列表 */}
      {currentApplications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {overviews.length === 0 ? '暂无申请记录' : '没有找到匹配的申请'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            {overviews.length === 0 
              ? '还没有创建任何申请记录,点击"新建申请"开始' 
              : '尝试调整筛选条件或搜索词'
            }
          </p>
          {filteredApplications.length === 0 && overviews.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              清除筛选条件
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {currentApplications.map((overview) => (
            <ApplicationCard
              key={overview.student_id}
              overview={overview}
              onClick={() => handleCardClick(overview.student_id)}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))}
              disabled={pageIndex === 1}
              className={`p-2 rounded-lg ${
                pageIndex === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPageIndex(page)}
                className={`h-8 w-8 flex items-center justify-center rounded-lg ${
                  pageIndex === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setPageIndex(prev => Math.min(prev + 1, totalPages))}
              disabled={pageIndex === totalPages}
              className={`p-2 rounded-lg ${
                pageIndex === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationsPage;

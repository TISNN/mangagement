/**
 * 选校规划详情页
 * 显示学生的完整选校列表和规划信息
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  School,
  Calendar, 
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  TrendingUp,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { useStudentApplication } from './ApplicationProgress/hooks/useApplications';
import UniversityChoiceList from './ApplicationProgress/components/UniversityChoiceList';
import { formatDate } from '../../utils/dateUtils';
import { universityChoiceService } from './ApplicationProgress/services/applicationService';
import { FinalUniversityChoice, UniversityChoiceForm } from './ApplicationProgress/types';

function PlanningDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const {
    choices,
    overview,
    loading,
    error,
    reload
  } = useStudentApplication(studentId ? Number(studentId) : null);

  // 添加选校记录
  const handleAddChoice = async (choice: Partial<FinalUniversityChoice>) => {
    if (!studentId) return;
    try {
      await universityChoiceService.createChoice(choice as UniversityChoiceForm);
      await reload();
      alert('添加成功!');
    } catch (error) {
      console.error('添加选校失败:', error);
      throw error;
    }
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">加载选校规划中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="p-6">
        <Link 
          to="/admin/applications"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回申请列表
        </Link>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
      </div>
    );
  }

  // 无数据状态
  if (!overview) {
    return (
      <div className="p-6">
        <Link 
          to="/admin/applications"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回申请列表
        </Link>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到选校规划</h3>
            <p className="text-gray-500 dark:text-gray-400">无法找到该学生的选校信息</p>
          </div>
        </div>
      </div>
    );
  }

  // 统计分析
  const reachSchools = choices.filter(c => c.application_type === '冲刺院校');
  const targetSchools = choices.filter(c => c.application_type === '目标院校');
  const safetySchools = choices.filter(c => c.application_type === '保底院校');
  
  const submittedCount = choices.filter(c => 
    c.submission_status === '已投递' || c.submission_status === '审核中'
  ).length;
  
  const acceptedCount = choices.filter(c => c.submission_status === '已录取').length;
  
  const pendingCount = choices.filter(c => c.submission_status === '未投递').length;

  // 找到最近的截止日期
  const upcomingDeadlines = choices
    .filter(c => c.application_deadline && c.submission_status === '未投递')
    .sort((a, b) => new Date(a.application_deadline!).getTime() - new Date(b.application_deadline!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-10">
      {/* 返回按钮 */}
      <Link 
        to={`/admin/applications/${studentId}`}
        className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        返回申请详情
      </Link>

      {/* 头部信息卡片 */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <School className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">选校规划方案</h1>
              <p className="text-purple-100 text-sm">{overview.student_name} 的选校列表</p>
              {overview.mentor_name && (
                <p className="text-purple-100 text-sm mt-1">规划导师: {overview.mentor_name}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 统计摘要 */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{choices.length}</div>
            <div className="text-purple-100 text-xs">选校总数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{submittedCount}</div>
            <div className="text-purple-100 text-xs">已投递</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{acceptedCount}</div>
            <div className="text-purple-100 text-xs">已录取</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{pendingCount}</div>
            <div className="text-purple-100 text-xs">待投递</div>
          </div>
        </div>
      </div>

      {/* 选校策略分布 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 冲刺院校 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-red-200 dark:border-red-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">冲刺院校</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reach Schools</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            {reachSchools.length}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            挑战目标，冲击顶尖院校
          </p>
        </div>

        {/* 目标院校 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">目标院校</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Target Schools</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {targetSchools.length}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            匹配度高，录取概率适中
          </p>
        </div>

        {/* 保底院校 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-green-200 dark:border-green-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">保底院校</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Safety Schools</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {safetySchools.length}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            稳妥选择，确保录取
          </p>
        </div>
      </div>

      {/* 即将到期的截止日期 */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-900/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                即将到期的申请
              </h3>
              <div className="space-y-2">
                {upcomingDeadlines.map((choice) => (
                  <div key={choice.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{choice.school_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{choice.program_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                        {formatDate(choice.application_deadline!)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {choice.application_round || '常规轮次'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 选校进度统计 */}
      {choices.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            申请进度
          </h2>
          <div className="space-y-4">
            {/* 总体进度 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">总体完成度</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {choices.length > 0 ? Math.round((submittedCount + acceptedCount) / choices.length * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${choices.length > 0 ? Math.round((submittedCount + acceptedCount) / choices.length * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            {/* 各类型进度 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* 冲刺院校进度 */}
              {reachSchools.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">冲刺院校</span>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      {reachSchools.filter(s => s.submission_status !== '未投递').length}/{reachSchools.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ 
                        width: `${Math.round(reachSchools.filter(s => s.submission_status !== '未投递').length / reachSchools.length * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 目标院校进度 */}
              {targetSchools.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">目标院校</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {targetSchools.filter(s => s.submission_status !== '未投递').length}/{targetSchools.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${Math.round(targetSchools.filter(s => s.submission_status !== '未投递').length / targetSchools.length * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 保底院校进度 */}
              {safetySchools.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">保底院校</span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {safetySchools.filter(s => s.submission_status !== '未投递').length}/{safetySchools.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${Math.round(safetySchools.filter(s => s.submission_status !== '未投递').length / safetySchools.length * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 选校列表 */}
      {choices.length > 0 ? (
        <UniversityChoiceList 
          choices={choices} 
          studentId={Number(studentId)}
          onAddChoice={handleAddChoice}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <School className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无选校记录</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            还没有为该学生创建选校规划
          </p>
          <button
            onClick={() => navigate(`/admin/applications/${studentId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            去创建选校规划
          </button>
        </div>
      )}

      {/* 录取情况汇总 */}
      {acceptedCount > 0 && (
        <div className="bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-900/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                🎉 恭喜!已获得 {acceptedCount} 个录取通知
              </h3>
              <div className="space-y-2">
                {choices.filter(c => c.submission_status === '已录取').map(choice => (
                  <div key={choice.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white">{choice.school_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{choice.program_name}</p>
                    {choice.decision_date && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        录取日期: {formatDate(choice.decision_date)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanningDetailPage;

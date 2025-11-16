/**
 * 学生端仪表盘
 * 重新设计布局，整合待办列表、截止日期、活动时间线、最近文件、会议记录
 */

import React, { useEffect, useMemo, useState } from 'react';
import { 
  GraduationCap, 
  FileText, 
  ListTodo,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  Upload,
  Video,
  Download,
  ExternalLink,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDashboardRealtime } from '../../hooks/useDashboardRealtime';

// 申请阶段配置
const APPLICATION_STAGES = [
  { id: 'evaluation', name: '背景评估', color: 'gray' },
  { id: 'schoolSelection', name: '选校规划', color: 'blue' },
  { id: 'preparation', name: '材料准备', color: 'yellow' },
  { id: 'submission', name: '提交申请', color: 'indigo' },
  { id: 'interview', name: '面试阶段', color: 'purple' },
  { id: 'decision', name: '录取决定', color: 'green' },
  { id: 'visa', name: '签证办理', color: 'teal' },
];

// 格式化时间显示
function formatTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo} 分钟前`;
  if (minutesAgo < 24 * 60) return `${Math.floor(minutesAgo / 60)} 小时前`;
  return `${Math.floor(minutesAgo / (24 * 60))} 天前`;
}

// 格式化日期显示
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useDashboardRealtime();
  const [currentStudent, setCurrentStudent] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentStudent');
    if (stored) {
      try {
        setCurrentStudent(JSON.parse(stored));
      } catch (error) {
        console.error('[StudentDashboard] 解析 currentStudent 失败:', error);
      }
    }
  }, []);

  const studentName =
    (typeof currentStudent?.name === 'string' && currentStudent.name.trim().length
      ? (currentStudent.name as string).trim()
      : '同学');
  
  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date()),
    []
  );
  
  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }, []);
  
  const subtitleMap: Record<'morning' | 'afternoon' | 'evening', string> = {
    morning: 'Rise and rewrite the story, every sunrise belongs to you.',
    afternoon: 'Keep the pace, your momentum proves you never stop believing.',
    evening: 'Stars appear for those who keep going, you are one of them.',
  };
  
  const highlightProgram =
    (typeof currentStudent?.target_program === 'string' && currentStudent.target_program) ||
    (typeof currentStudent?.major === 'string' && currentStudent.major) ||
    '完善档案以获得个性化提醒';
  const serviceStatus =
    (typeof currentStudent?.status === 'string' && currentStudent.status) || '进行中';
  const nextAction =
    (typeof currentStudent?.next_action === 'string' && currentStudent?.next_action) ||
    '查看任务清单';

  const quickInfos = [
    { label: '目标项目', value: highlightProgram },
    { label: '服务状态', value: serviceStatus },
    { label: '下一步', value: nextAction },
  ];

  // 处理统计卡片点击
  const handleStatCardClick = (type: string, filter?: string) => {
    switch (type) {
      case 'tasks':
        navigate('/student/tasks', { state: { filter } });
        break;
      case 'materials':
        navigate('/student/materials', { state: { filter } });
        break;
      case 'documents':
        navigate('/student/documents', { state: { filter } });
        break;
      case 'schools':
        navigate('/student/school-selection');
        break;
    }
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            还没有申请进度，请联系顾问开始申请流程
          </p>
          <button
            onClick={() => navigate('/student/materials')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            联系顾问
          </button>
        </div>
      </div>
    );
  }

  const { 
    applicationProgress, 
    taskStats, 
    materialStats, 
    documentStats, 
    schoolSelectionStats,
    upcomingTasks,
    upcomingDeadlines,
    recentActivities,
    recentFiles,
    recentMeetings
  } = data;

  return (
    <div className="space-y-6 p-6">
      {/* 顶部欢迎语与快捷信息 */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800 text-white p-6 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm text-white/80">{formattedDate}</p>
            <h1 className="text-2xl font-semibold">欢迎回来，{studentName}</h1>
            <p className="text-sm text-white/80">{subtitleMap[timeOfDay]}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {quickInfos.map((item) => (
              <div
                key={item.label}
                className="min-w-[140px] rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-wide text-white/70">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 申请进度概览卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">申请进度</h2>
          <button
            onClick={() => navigate('/student/analytics')}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1"
          >
            查看详情
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* 进度条 */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                当前阶段：{APPLICATION_STAGES[applicationProgress.currentStageIndex]?.name || '未知'}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {applicationProgress.progressPercentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${applicationProgress.progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
            
            {/* 阶段节点 */}
            <div className="flex justify-between mt-4">
              {APPLICATION_STAGES.map((stage, index) => {
                const isCompleted = index <= applicationProgress.currentStageIndex;
                const isCurrent = index === applicationProgress.currentStageIndex;
                
                return (
                  <div
                    key={stage.id}
                    className="flex flex-col items-center flex-1"
                    onClick={() => navigate('/student/analytics')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}`}
                    >
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                    </div>
                    <span className="text-xs mt-2 text-center text-gray-600 dark:text-gray-400">
                      {stage.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 下一个截止日期 */}
          {applicationProgress.nextDeadline && (
            <div
              className={`p-4 rounded-xl ${
                applicationProgress.nextDeadline.isUrgent
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar
                  className={`h-5 w-5 ${
                    applicationProgress.nextDeadline.isUrgent
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                />
                <span className="font-semibold text-gray-900 dark:text-white">
                  下一个截止日期
                </span>
                {applicationProgress.nextDeadline.isUrgent && (
                  <span className="ml-auto px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                    紧急
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {applicationProgress.nextDeadline.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {applicationProgress.nextDeadline.daysRemaining > 0
                  ? `还剩 ${applicationProgress.nextDeadline.daysRemaining} 天`
                  : '今天截止'}
              </p>
            </div>
          )}

          {/* 阻塞原因 */}
          {applicationProgress.blockingReasons.length > 0 && (
            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span className="font-semibold text-gray-900 dark:text-white">需要注意</span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {applicationProgress.blockingReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* 统计卡片区域（4列网格布局） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 待办事项卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleStatCardClick('tasks')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            {taskStats.overdue.total > 0 && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                {taskStats.overdue.total} 逾期
              </span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">待办事项</p>
            <p className={`text-3xl font-bold ${
              taskStats.today.total > 5 ? 'text-red-600 dark:text-red-400' :
              taskStats.today.total > 2 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {taskStats.today.total}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>本周: {taskStats.thisWeek.total}</span>
              {taskStats.overdue.total > 0 && (
                <span className="text-red-500">逾期: {taskStats.overdue.total}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* 材料状态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleStatCardClick('materials')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            {materialStats.urgent.length > 0 && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                {materialStats.urgent.length} 紧急
              </span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">材料状态</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {materialStats.completed}
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                / {materialStats.total}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>待上传: {materialStats.pendingUpload}</span>
              <span>待审核: {materialStats.pendingReview}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${materialStats.completionRate}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* 文书状态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => handleStatCardClick('documents')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            {documentStats.pendingFeedback > 0 && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                {documentStats.pendingFeedback} 待反馈
              </span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">文书状态</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {documentStats.total}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>待反馈: {documentStats.pendingFeedback}</span>
              <span>已定稿: {documentStats.finalized}</span>
            </div>
            {documentStats.latestUpdate && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {documentStats.latestUpdate.minutesAgo < 60
                  ? `${documentStats.latestUpdate.minutesAgo} 分钟前更新`
                  : `${Math.floor(documentStats.latestUpdate.minutesAgo / 60)} 小时前更新`}
              </p>
            )}
          </div>
        </motion.div>

        {/* 选校列表卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => handleStatCardClick('schools')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">选校列表</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {schoolSelectionStats.confirmed}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>冲刺: {schoolSelectionStats.byType.reach}</span>
              <span>目标: {schoolSelectionStats.byType.target}</span>
              <span>保底: {schoolSelectionStats.byType.safety}</span>
            </div>
            {schoolSelectionStats.nearestDeadline && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                最近截止: {schoolSelectionStats.nearestDeadline.schoolName}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* 左右分栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：待办事项列表 + 即将到来的截止日期 */}
        <div className="space-y-6">
          {/* 待办事项列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-blue-500" />
                待办事项
              </h2>
              <button
                onClick={() => navigate('/student/tasks')}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                查看全部
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/student/tasks#${task.id}`)}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.daysRemaining === 0 ? '今天' :
                               task.daysRemaining === 1 ? '明天' :
                               task.daysRemaining < 0 ? `逾期 ${Math.abs(task.daysRemaining)} 天` :
                               `${task.daysRemaining} 天后`}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {task.status === 'completed' ? '已完成' :
                         task.status === 'in_progress' ? '进行中' : '待处理'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  暂无待办事项
                </p>
              )}
            </div>
          </motion.div>

          {/* 即将到来的截止日期 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                即将到来的截止日期
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">未来7天</span>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline) => (
                  <div
                    key={`${deadline.type}-${deadline.id}`}
                    className={`p-3 rounded-lg border ${
                      deadline.isUrgent
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                    } transition-all`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            deadline.type === 'task' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            deadline.type === 'material' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          }`}>
                            {deadline.type === 'task' ? '任务' :
                             deadline.type === 'material' ? '材料' : '选校'}
                          </span>
                          {deadline.isUrgent && (
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400 animate-pulse">
                              紧急
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(deadline.deadline)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          deadline.isUrgent ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {deadline.daysRemaining === 0 ? '今天' :
                           deadline.daysRemaining === 1 ? '明天' :
                           `${deadline.daysRemaining} 天`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  未来7天内暂无截止日期
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* 右侧：最近活动时间线 + 最近上传的文件 + 最近会议记录 */}
        <div className="space-y-6">
          {/* 最近活动时间线 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                最近活动
              </h2>
            </div>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => activity.link && navigate(activity.link)}
                    className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all ${
                      activity.link ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        activity.type === 'task' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        activity.type === 'material' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        activity.type === 'document' ? 'bg-green-100 dark:bg-green-900/30' :
                        activity.type === 'meeting' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-indigo-100 dark:bg-indigo-900/30'
                      }`}>
                        {activity.type === 'task' && <ListTodo className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                        {activity.type === 'material' && <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                        {activity.type === 'document' && <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />}
                        {activity.type === 'meeting' && <Video className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                        {activity.type === 'school' && <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-gray-500 dark:text-gray-400">：{activity.description}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTimeAgo(activity.minutesAgo)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  暂无最近活动
                </p>
              )}
            </div>
          </motion.div>

          {/* 最近上传的文件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-500" />
                最近上传的文件
              </h2>
              <button
                onClick={() => navigate('/student/materials')}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                查看全部
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentFiles.length > 0 ? (
                recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {file.type}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatTimeAgo(file.minutesAgo)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {file.fileUrl && (
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  暂无上传文件
                </p>
              )}
            </div>
          </motion.div>

          {/* 最近会议记录 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-orange-500" />
                最近会议记录
              </h2>
            </div>
            <div className="space-y-3">
              {recentMeetings.length > 0 ? (
                recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {meeting.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {meeting.meetingType && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {meeting.meetingType}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(meeting.startTime)}
                          </span>
                        </div>
                        {meeting.participants && meeting.participants.length > 0 && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            参会人：{meeting.participants.join('、')}
                          </p>
                        )}
                      </div>
                      {meeting.meetingLink && (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  暂无会议记录
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

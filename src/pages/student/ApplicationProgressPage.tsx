/**
 * 学生端申请进度中心页面
 * 显示申请阶段进度、申请档案、申请统计
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  BarChart3,
  PieChart,
  TrendingUp,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { getApplicationProgressData, ApplicationProgressData } from '../../services/studentApplicationProgressService';
import { ApplicationStage, StandardizedTest } from '../admin/ApplicationProgress/types';

// 申请阶段图标映射
const STAGE_ICONS: Record<ApplicationStage, React.ComponentType<{ className?: string }>> = {
  evaluation: User,
  schoolSelection: GraduationCap,
  preparation: FileText,
  submission: CheckCircle2,
  interview: Calendar,
  decision: Award,
  visa: CheckCircle2
};

const ApplicationProgressPage: React.FC = () => {
  const [data, setData] = useState<ApplicationProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getApplicationProgressData();
      if (result) {
        setData(result);
      } else {
        setError('获取申请进度数据失败');
      }
    } catch (err) {
      console.error('[ApplicationProgressPage] 加载数据失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error || '获取数据失败'}</p>
          <button
            onClick={loadData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const { stageProgress, profile, statistics, schoolChoices } = data;

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white">申请进度中心</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">查看您的申请进度、档案和统计信息</p>
      </div>

      {/* 阶段进度可视化 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">申请阶段进度</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            完成度: {stageProgress.progressPercentage}%
          </div>
        </div>

        {/* 进度条 */}
        <div className="relative mb-8">
          {/* 背景连接线 */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
          
          {/* 进度连接线 */}
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{
              width: `${(stageProgress.currentStageIndex + 1) / stageProgress.totalStages * 100}%`
            }}
          />

          {/* 阶段节点 */}
          <div className="relative flex justify-between">
            {stageProgress.stages.map((stage, index) => {
              const StageIcon = STAGE_ICONS[stage.id] || CheckCircle2;
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'in_progress';
              const isNotStarted = stage.status === 'not_started';

              return (
                <div key={stage.id} className="flex flex-col items-center flex-1">
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                          : isCurrent
                          ? 'bg-blue-100 dark:bg-blue-900 border-4 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      <StageIcon className="h-6 w-6" />
                    </div>
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p
                      className={`text-xs font-medium ${
                        isCompleted || isCurrent
                          ? 'text-gray-800 dark:text-gray-100'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {stage.name}
                    </p>
                    {isCurrent && stage.blockingReasons && stage.blockingReasons.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {stage.blockingReasons.map((reason, idx) => (
                          <p key={idx} className="text-xs text-red-500 dark:text-red-400">
                            {reason}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 当前阶段信息 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              当前阶段: {stageProgress.stages[stageProgress.currentStageIndex]?.name}
            </span>
          </div>
          {stageProgress.stages[stageProgress.currentStageIndex]?.blockingReasons &&
            stageProgress.stages[stageProgress.currentStageIndex]?.blockingReasons!.length > 0 && (
              <div className="mt-2 space-y-1">
                {stageProgress.stages[stageProgress.currentStageIndex]?.blockingReasons!.map((reason, idx) => (
                  <p key={idx} className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {reason}
                  </p>
                ))}
              </div>
            )}
        </div>
      </motion.div>

      {/* 申请档案和统计 - 左右分栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：申请档案 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold dark:text-white mb-6">申请档案</h2>

          {profile ? (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">基本信息</h3>
                <div className="space-y-2">
                  {profile.full_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">姓名:</span>
                      <span className="font-medium dark:text-white">{profile.full_name}</span>
                    </div>
                  )}
                  {profile.application_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">邮箱:</span>
                      <span className="font-medium dark:text-white">{profile.application_email}</span>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">电话:</span>
                      <span className="font-medium dark:text-white">{profile.phone_number}</span>
                    </div>
                  )}
                  {profile.current_address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">地址:</span>
                      <span className="font-medium dark:text-white">{profile.current_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 教育背景 */}
              {(profile.undergraduate_school || profile.graduate_school) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">教育背景</h3>
                  <div className="space-y-3">
                    {profile.undergraduate_school && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="font-medium dark:text-white">本科</span>
                        </div>
                        <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                          <p>{profile.undergraduate_school}</p>
                          {profile.undergraduate_major && <p>专业: {profile.undergraduate_major}</p>}
                          {profile.undergraduate_gpa && <p>GPA: {profile.undergraduate_gpa}</p>}
                        </div>
                      </div>
                    )}
                    {profile.graduate_school && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-purple-500" />
                          <span className="font-medium dark:text-white">硕士</span>
                        </div>
                        <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                          <p>{profile.graduate_school}</p>
                          {profile.graduate_major && <p>专业: {profile.graduate_major}</p>}
                          {profile.graduate_gpa && <p>GPA: {profile.graduate_gpa}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 标化成绩 */}
              {profile.standardized_tests && profile.standardized_tests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">标化成绩</h3>
                  <div className="space-y-3">
                    {profile.standardized_tests.map((test: StandardizedTest, index: number) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium dark:text-white">{test.test_type}</span>
                          {test.test_date && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(test.test_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                          {test.total_score && <p>总分: {test.total_score}</p>}
                          {test.listening_score && <p>听力: {test.listening_score}</p>}
                          {test.reading_score && <p>阅读: {test.reading_score}</p>}
                          {test.writing_score && <p>写作: {test.writing_score}</p>}
                          {test.speaking_score && <p>口语: {test.speaking_score}</p>}
                          {test.verbal_score && <p>Verbal: {test.verbal_score}</p>}
                          {test.quantitative_score && <p>Quantitative: {test.quantitative_score}</p>}
                          {test.analytical_writing_score && <p>Writing: {test.analytical_writing_score}</p>}
                          {test.has_account && test.account && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">考试账号</p>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">{test.account}</span>
                                {test.password && (
                                  <>
                                    <span className="text-gray-400">/</span>
                                    <span className="font-mono text-xs">
                                      {showPasswords[`test-${index}`] ? test.password : '••••••••'}
                                    </span>
                                    <button
                                      onClick={() => togglePasswordVisibility(`test-${index}`)}
                                      className="text-blue-500 hover:text-blue-600"
                                    >
                                      {showPasswords[`test-${index}`] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>暂无申请档案信息</p>
            </div>
          )}
        </motion.div>

        {/* 右侧：申请统计 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* 申请统计概览 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold dark:text-white mb-6">申请统计</h2>

            <div className="space-y-4">
              {/* 总申请数 */}
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">总申请数</span>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {statistics.totalApplications}
                </span>
              </div>

              {/* 录取率 */}
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">录取率</span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {statistics.acceptanceRate}%
                </span>
              </div>

              {/* 申请状态分布 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">申请状态</h3>
                <div className="space-y-2">
                  {[
                    { label: '未投递', value: statistics.byStatus.notSubmitted, color: 'gray' },
                    { label: '已投递', value: statistics.byStatus.submitted, color: 'blue' },
                    { label: '审核中', value: statistics.byStatus.underReview, color: 'yellow' },
                    { label: '已录取', value: statistics.byStatus.accepted, color: 'green' },
                    { label: '已拒绝', value: statistics.byStatus.rejected, color: 'red' },
                    { label: 'Waitlist', value: statistics.byStatus.waitlist, color: 'orange' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 申请类型分布 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">申请类型</h3>
                <div className="space-y-2">
                  {[
                    { label: '冲刺', value: statistics.byType.reach, color: 'red' },
                    { label: '目标', value: statistics.byType.target, color: 'blue' },
                    { label: '保底', value: statistics.byType.safety, color: 'green' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 选校列表预览 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white">选校列表</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                共 {schoolChoices.length} 所
              </span>
            </div>

            {schoolChoices.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schoolChoices.slice(0, 5).map((choice) => (
                  <div
                    key={choice.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white">{choice.school_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {choice.program_name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {choice.application_type && (
                            <span
                              className={`px-2 py-0.5 rounded ${
                                choice.application_type.includes('冲刺')
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  : choice.application_type.includes('目标')
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}
                            >
                              {choice.application_type}
                            </span>
                          )}
                          {choice.submission_status && (
                            <span>{choice.submission_status}</span>
                          )}
                        </div>
                      </div>
                      {choice.application_account && (
                        <div className="ml-4 text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">申请账号</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{choice.application_account}</span>
                            {choice.application_password && (
                              <>
                                <span className="text-gray-400">/</span>
                                <span className="font-mono text-xs">
                                  {showPasswords[`school-${choice.id}`]
                                    ? choice.application_password
                                    : '••••••••'}
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(`school-${choice.id}`)}
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  {showPasswords[`school-${choice.id}`] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {schoolChoices.length > 5 && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                    还有 {schoolChoices.length - 5} 所学校...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>暂无选校信息</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationProgressPage;


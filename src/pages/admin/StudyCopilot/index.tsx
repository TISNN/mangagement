import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  MessageSquare, 
  FileSearch, 
  GraduationCap, 
  Plane, 
  FileCheck,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 留学流程阶段
type StudyPhase = 'consultation' | 'planning' | 'application' | 'tracking' | 'visa' | 'departure';

const StudyCopilotPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<StudyPhase>('consultation');

  // 留学流程阶段定义
  const phases = [
    {
      id: 'consultation' as StudyPhase,
      name: '咨询评估',
      icon: MessageSquare,
      color: 'blue',
      description: '学生背景采集与初步评估',
      progress: 100,
    },
    {
      id: 'planning' as StudyPhase,
      name: '方案规划',
      icon: FileSearch,
      color: 'purple',
      description: '选校定位与申请策略',
      progress: 80,
    },
    {
      id: 'application' as StudyPhase,
      name: '申请递交',
      icon: GraduationCap,
      color: 'green',
      description: '文书准备与材料提交',
      progress: 45,
    },
    {
      id: 'tracking' as StudyPhase,
      name: '进度跟踪',
      icon: TrendingUp,
      color: 'orange',
      description: 'Offer追踪与结果管理',
      progress: 20,
    },
    {
      id: 'visa' as StudyPhase,
      name: '签证办理',
      icon: FileCheck,
      color: 'indigo',
      description: '签证申请与材料准备',
      progress: 0,
    },
    {
      id: 'departure' as StudyPhase,
      name: '行前准备',
      icon: Plane,
      color: 'pink',
      description: '行前指导与入学安排',
      progress: 0,
    },
  ];

  // 各阶段的统计数据
  const statistics = {
    consultation: { total: 128, inProgress: 45, completed: 83 },
    planning: { total: 83, inProgress: 32, completed: 51 },
    application: { total: 51, inProgress: 28, completed: 23 },
    tracking: { total: 23, inProgress: 15, completed: 8 },
    visa: { total: 8, inProgress: 5, completed: 3 },
    departure: { total: 3, inProgress: 2, completed: 1 },
  };

  const handlePhaseClick = (phaseId: StudyPhase) => {
    setCurrentPhase(phaseId);
    toast.success(`切换到${phases.find(p => p.id === phaseId)?.name}阶段`);
  };

  const handleNavigateToDetail = (phaseId: StudyPhase) => {
    // 导航到具体的流程页面
    navigate(`/admin/study-copilot/${phaseId}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero区域 - 渐变背景 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                留学Copilot
              </h1>
              <p className="text-lg text-white/90">
                AI驱动的全流程留学管理系统
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: '总学生数', value: '286', change: '+12.5%' },
              { label: '进行中', value: '127', change: '+8.3%' },
              { label: '本月转化', value: '42', change: '+25.0%' },
              { label: '成功率', value: '94.2%', change: '+5.2%' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <p className="text-sm text-white/80 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-300 mt-1">↗ {stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 流程时间线 - 横向展示 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            留学全流程管理
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            点击任意阶段进入详细管理
          </div>
        </div>
        
        {/* 时间线布局 */}
        <div className="relative">
          {/* 连接线 */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 via-orange-200 via-indigo-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:via-green-800 dark:via-orange-800 dark:via-indigo-800 dark:to-pink-800 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
          {phases.map((phase, index) => {
            const stats = statistics[phase.id];
            const Icon = phase.icon;
            const isActive = currentPhase === phase.id;
            
            return (
              <div
                key={phase.id}
                onClick={() => handleNavigateToDetail(phase.id)}
                className="relative group"
              >
                {/* 阶段卡片 */}
                <div
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                    isActive
                      ? `border-${phase.color}-400 dark:border-${phase.color}-600 shadow-xl scale-105`
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {/* 序号徽章 */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  {/* 图标区域 */}
                  <div className="flex flex-col items-center mb-4">
                    <div 
                      className={`relative p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                        phase.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                        phase.color === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                        phase.color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                        phase.color === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        phase.color === 'indigo' ? 'bg-gradient-to-br from-indigo-400 to-indigo-600' :
                        phase.color === 'pink' ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                        'bg-gradient-to-br from-gray-400 to-gray-600'
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                      
                      {/* 发光效果 */}
                      <div 
                        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity ${
                          phase.color === 'blue' ? 'bg-blue-400' :
                          phase.color === 'purple' ? 'bg-purple-400' :
                          phase.color === 'green' ? 'bg-green-400' :
                          phase.color === 'orange' ? 'bg-orange-400' :
                          phase.color === 'indigo' ? 'bg-indigo-400' :
                          phase.color === 'pink' ? 'bg-pink-400' :
                          'bg-gray-400'
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* 阶段名称 */}
                  <h3 className="text-center text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {phase.name}
                  </h3>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4 min-h-[2.5rem]">
                    {phase.description}
                  </p>

                  {/* 进度环形图 */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${phase.progress * 2.26} 226`}
                          className={`transition-all duration-1000 ${
                            phase.color === 'blue' ? 'text-blue-500' :
                            phase.color === 'purple' ? 'text-purple-500' :
                            phase.color === 'green' ? 'text-green-500' :
                            phase.color === 'orange' ? 'text-orange-500' :
                            phase.color === 'indigo' ? 'text-indigo-500' :
                            phase.color === 'pink' ? 'text-pink-500' :
                            'text-gray-500'
                          }`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-bold ${
                          phase.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          phase.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                          phase.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          phase.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                          phase.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                          phase.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {phase.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 统计数据 */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">总计</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">进行中</span>
                      <span className={`font-semibold ${
                        phase.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        phase.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        phase.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        phase.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                        phase.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                        phase.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {stats.inProgress}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">已完成</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{stats.completed}</span>
                    </div>
                  </div>

                  {/* Hover进入提示 */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`flex items-center justify-center gap-2 text-sm font-medium ${
                      phase.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      phase.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      phase.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      phase.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      phase.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                      phase.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      <span>进入管理</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* AI能力展示区 */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'AI智能匹配',
            icon: Target,
            color: 'purple',
            features: ['背景分析', '院校推荐', '成功率预测', '方案优化'],
            gradient: 'from-purple-500 to-blue-500'
          },
          {
            title: '自动化流程',
            icon: TrendingUp,
            color: 'blue',
            features: ['任务提醒', '进度追踪', 'DDL管理', '报告生成'],
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: '数据洞察',
            icon: FileCheck,
            color: 'green',
            features: ['录取分析', '趋势预测', '风险预警', '转化优化'],
            gradient: 'from-green-500 to-emerald-500'
          },
        ].map((capability, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
            <div className={`inline-flex p-3 bg-gradient-to-br ${capability.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
              <capability.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {capability.title}
            </h3>
            <ul className="space-y-2">
              {capability.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    capability.color === 'purple' ? 'bg-purple-500' :
                    capability.color === 'blue' ? 'bg-blue-500' :
                    capability.color === 'green' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 快速入口 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          快速入口
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '查看所有学生', action: () => navigate('/admin/students'), color: 'blue' },
            { label: '待跟进线索', action: () => navigate('/admin/leads'), color: 'purple' },
            { label: '即将DDL提醒', action: () => navigate('/admin/tasks'), color: 'orange' },
            { label: '本月数据报表', action: () => {}, color: 'green' },
          ].map((entry, idx) => (
            <button
              key={idx}
              onClick={entry.action}
              className={`p-4 rounded-xl transition-all font-medium text-sm ${
                entry.color === 'blue' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : entry.color === 'purple'
                  ? 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                  : entry.color === 'orange'
                  ? 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                  : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyCopilotPage;


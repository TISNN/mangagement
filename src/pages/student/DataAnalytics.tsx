import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Users,
  School,
  BookOpen,
  Brain,
  BarChart3,
  LineChart,
} from 'lucide-react';

const DataAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">数据分析中心</h1>
          <p className="text-gray-500 dark:text-gray-400">深度分析你的申请数据，助力精准决策</p>
        </div>
      </div>

      {/* 核心指标概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '申请完成度',
            value: '78%',
            change: '+12%',
            trend: 'up',
            icon: BarChart2,
            color: 'blue'
          },
          {
            title: '综合竞争力',
            value: '85',
            change: '+5',
            trend: 'up',
            icon: TrendingUp,
            color: 'green'
          },
          {
            title: '材料完整度',
            value: '92%',
            change: '+8%',
            trend: 'up',
            icon: PieChart,
            color: 'purple'
          },
          {
            title: '平均录取概率',
            value: '75%',
            change: '-3%',
            trend: 'down',
            icon: Target,
            color: 'orange'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className={`flex items-center ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 竞争力分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">竞争力分析</h2>
            <Award className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {[
              { name: '学术成绩', score: 88, avg: 85 },
              { name: '科研经历', score: 75, avg: 70 },
              { name: '实习经验', score: 82, avg: 75 },
              { name: '课外活动', score: 90, avg: 80 },
              { name: '语言成绩', score: 85, avg: 82 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                  <span className="font-medium dark:text-white">{item.score}分</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                  <div
                    className="absolute h-full w-0.5 bg-yellow-500"
                    style={{ left: `${item.avg}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  平均水平: {item.avg}分
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 录取概率预测 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">录取概率预测</h2>
            <Brain className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            {[
              { school: 'Stanford University', program: 'CS', probability: 65 },
              { school: 'UC Berkeley', program: 'CS', probability: 75 },
              { school: 'CMU', program: 'CS', probability: 85 },
              { school: 'Columbia University', program: 'CS', probability: 80 }
            ].map((school, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium dark:text-white">{school.school}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{school.program}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        school.probability >= 80 ? 'bg-green-500' :
                        school.probability >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${school.probability}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    {school.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 申请进度分析 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">申请材料完成度</h2>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {[
              { name: '个人陈述', progress: 90 },
              { name: '推荐信', progress: 66 },
              { name: '成绩单', progress: 100 },
              { name: '简历', progress: 85 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                  <span className="font-medium dark:text-white">{item.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.progress >= 80 ? 'bg-green-500' :
                      item.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">申请进度追踪</h2>
            <LineChart className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {[
              { phase: '选校', status: 'completed', date: '2023-12-01' },
              { phase: '材料准备', status: 'in-progress', date: '2024-01-15' },
              { phase: '文书修改', status: 'in-progress', date: '2024-02-01' },
              { phase: '提交申请', status: 'pending', date: '2024-03-01' }
            ].map((phase, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  phase.status === 'completed' ? 'bg-green-500' :
                  phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium dark:text-white">{phase.phase}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{phase.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">申请数据统计</h2>
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-6">
            {[
              { label: '申请院校数', value: '8所', icon: School },
              { label: '完成文书数', value: '12篇', icon: BookOpen },
              { label: '咨询次数', value: '15次', icon: Users },
              { label: 'AI修改次数', value: '45次', icon: Brain }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                </div>
                <span className="font-medium dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics; 
import React from 'react';
import { 
  Users, 
  FileCheck, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  ChevronRight,
  GraduationCap,
  School,
  Target,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 顶部欢迎语 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">早上好, Evan</h1>
        <p className="text-gray-500 dark:text-gray-400">欢迎回到工作台，祝您开启愉快的一天</p>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '活跃学生',
            value: '286',
            change: '+12.5%',
            icon: Users,
            color: 'blue'
          },
          {
            title: '申请进度',
            value: '92%',
            change: '+4.75%',
            icon: FileCheck,
            color: 'green'
          },
          {
            title: '咨询会话',
            value: '128',
            change: '+8.2%',
            icon: MessageSquare,
            color: 'purple'
          },
          {
            title: '成功率',
            value: '94.2%',
            change: '+5.25%',
            icon: TrendingUp,
            color: 'orange'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 
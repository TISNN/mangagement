import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck, 
  MessageSquare, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const DashboardPage: React.FC = () => {

  // 获取当前用户信息
  const [currentUser, setCurrentUser] = useState<{ name?: string; position?: string } | null>(null);
  
  // 获取时间问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 17) return '下午好';
    if (hour < 19) return '傍晚好';
    if (hour < 22) return '晚上好';
    return '夜深了';
  };

  // 获取时间段提示语
  const getTimeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '注意休息，保持健康';
    if (hour < 9) return '祝您开启愉快的一天';
    if (hour < 12) return '工作顺利，加油!';
    if (hour < 14) return '记得吃午饭哦';
    if (hour < 17) return '继续保持高效!';
    if (hour < 19) return '辛苦了一天';
    if (hour < 22) return '今天工作完成得如何?';
    return '早点休息，明天更美好';
  };

  useEffect(() => {
    // 从 localStorage 获取当前登录用户信息
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      const employeeData = localStorage.getItem('currentEmployee');
      if (employeeData) {
        setCurrentUser(JSON.parse(employeeData));
      }
    } else if (userType === 'student') {
      const studentData = localStorage.getItem('currentStudent');
      if (studentData) {
        setCurrentUser(JSON.parse(studentData));
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* 顶部欢迎语 */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold dark:text-white">
            {getGreeting()}, {currentUser?.name || '用户'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            欢迎回到工作台，{getTimeMessage()}
          </p>
        </div>
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
      
      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近任务列表 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold dark:text-white">最近任务</h2>
            <button className="text-sm text-blue-600 flex items-center dark:text-blue-400">
              查看全部 <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              {
                title: '完成留学申请材料审核',
                dueDate: '2025-04-10',
                status: '进行中',
                priority: '高',
                assignee: '李志强',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
              },
              {
                title: '组织英国大学申请讲座',
                dueDate: '2025-04-15',
                status: '待处理',
                priority: '中',
                assignee: '王文静',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
              },
              {
                title: '更新德国大学申请指南',
                dueDate: '2025-04-05',
                status: '已完成',
                priority: '中',
                assignee: '张德国',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
              },
              {
                title: '重庆地区市场拓展计划',
                dueDate: '2025-04-20',
                status: '审核中',
                priority: '高',
                assignee: '陈明月',
                avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
              }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="mr-3">
                    <img
                      src={task.avatar}
                      alt={task.assignee}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{task.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 dark:text-gray-400">
                      <span className="mr-2">截止日期: {task.dueDate}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === '进行中' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        task.status === '待处理' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        task.status === '已完成' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === '高' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                    task.priority === '中' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {task.priority}优先级
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 活动日历和通知 */}
        <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold dark:text-white">即将到来</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">4月, 2025</span>
          </div>
          
          <div className="space-y-4">
            {[
              {
                date: '04/08',
                title: '哈佛大学面试准备',
                time: '13:00 - 14:30',
                type: '会议'
              },
              {
                date: '04/10',
                title: '英国顶尖大学申请讲座',
                time: '18:30 - 20:00',
                type: '活动'
              },
              {
                date: '04/15',
                title: '德国大学申请截止日',
                time: '全天',
                type: '截止日期'
              },
              {
                date: '04/20',
                title: '重庆市场拓展会议',
                time: '10:00 - 11:30',
                type: '会议'
              }
            ].map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center justify-center mr-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-300">
                    {event.date}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{event.time}</p>
                  <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50">
            查看完整日历
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
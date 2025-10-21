import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck, 
  MessageSquare, 
  ChevronRight,
  Search,
  School,
  UserPlus,
  Bell,
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
  DollarSign,
  Target,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 获取当前用户信息
  const [currentUser, setCurrentUser] = useState<{ name?: string; position?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // 任务数据
  const tasks = [
    { id: 1, title: '跟进王同学的材料上传', deadline: '今日截止', type: 'urgent', icon: '📄', completed: false },
    { id: 2, title: '回访李同学的录取意向', type: 'normal', icon: '📞', completed: false },
    { id: 3, title: '回复学生留言', count: 3, type: 'message', icon: '💬', completed: false },
    { id: 4, title: '更新张同学的申请进度', deadline: '明天截止', type: 'normal', icon: '📋', completed: false },
  ];

  // 最新动态数据
  const activities = [
    { id: 1, user: '王同学', action: '上传了', content: '个人陈述.pdf', time: '5分钟前', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, user: '李顾问', action: '更新了', content: '英美本科项目报价', time: '20分钟前', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, user: '系统', action: '新增学校合作:', content: 'University of Glasgow', time: '1小时前', avatar: null },
    { id: 4, user: '张同学', action: '提交了', content: '推荐信请求', time: '2小时前', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 5, user: '陈顾问', action: '完成了', content: '面试辅导课程', time: '3小时前', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  ];

  // 快捷操作
  const quickActions = [
    { title: '添加新学生', icon: UserPlus, color: 'blue', onClick: () => navigate('/admin/students') },
    { title: '添加新院校', icon: School, color: 'green', onClick: () => navigate('/admin/school-assistant') },
    { title: '创建申请任务', icon: Briefcase, color: 'purple', onClick: () => navigate('/admin/tasks') },
    { title: '发起沟通记录', icon: MessageSquare, color: 'orange', onClick: () => navigate('/admin/leads') },
  ];

  // 处理任务完成
  const handleToggleTask = (taskId: number) => {
    // 这里可以添加实际的任务更新逻辑
    console.log('Toggle task:', taskId);
  };

  return (
    <div className="space-y-6">
      {/* 顶部欢迎语 + 全局搜索 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold dark:text-white">
            {getGreeting()}, {currentUser?.name || '用户'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            欢迎回到工作台，{getTimeMessage()}
          </p>
        </div>
        
        {/* 全局搜索框 */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索学生、任务、院校..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* 关键数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '活跃学生',
            value: '286',
            change: '+12.5%',
            icon: Users,
            color: 'blue',
            desc: '本月新增'
          },
          {
            title: '本月线索',
            value: '128',
            change: '+18.2%',
            icon: Target,
            color: 'green',
            desc: '潜在客户'
          },
          {
            title: '本月签约',
            value: '42',
            change: '+25.5%',
            icon: FileCheck,
            color: 'purple',
            desc: '新签合同'
          },
          {
            title: '本月收入',
            value: '¥428K',
            change: '+15.8%',
            icon: DollarSign,
            color: 'orange',
            desc: '营收统计'
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
              <p className="text-xs text-gray-400 dark:text-gray-500">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-${action.color}-100 dark:border-${action.color}-900/30 hover:border-${action.color}-300 dark:hover:border-${action.color}-700 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/10 transition-all group`}
            >
              <div className={`p-3 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-xl group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 任务与提醒 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 任务列表卡片 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">任务与提醒</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/tasks')}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
              >
                查看全部 <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group"
                >
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    <CheckCircle2 className={`w-5 h-5 ${
                      task.completed 
                        ? 'text-green-500 fill-green-500' 
                        : 'text-gray-300 dark:text-gray-600 group-hover:text-purple-400'
                    } transition-colors`} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.icon} {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {task.deadline && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.type === 'urgent' 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                            }`}>
                              {task.deadline}
                            </span>
                          )}
                          {task.count && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              {task.count}条未读
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最新动态 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">最新动态</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="flex-shrink-0">
                    {activity.avatar ? (
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-gray-500 dark:text-gray-400">{activity.action}</span>
                        {' '}
                        <span className="font-medium text-purple-600 dark:text-purple-400">{activity.content}</span>
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 消息通知中心 */}
        <div className="space-y-6">
          {/* 未读通知 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">消息中心</h2>
              </div>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                5条未读
              </span>
            </div>
            
            <div className="space-y-3">
              {[
                { type: 'email', title: '新邮件提醒', desc: '来自 admissions@harvard.edu', time: '10分钟前', unread: true },
                { type: 'wechat', title: '微信消息', desc: '王同学发来咨询', time: '1小时前', unread: true },
                { type: 'system', title: '系统通知', desc: '申请材料已审核通过', time: '2小时前', unread: false },
                { type: 'email', title: '院校反馈', desc: 'University of Cambridge', time: '今天', unread: true },
              ].map((notification, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    notification.unread 
                      ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10' 
                      : 'border-gray-100 dark:border-gray-700'
                  } hover:shadow-md transition-all cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'email' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      notification.type === 'wechat' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {notification.type === 'email' ? (
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : notification.type === 'wechat' ? (
                        <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {notification.desc}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 inline-block">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              查看全部消息
            </button>
          </div>

          {/* 即将到来的日程 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">即将到来</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { date: '今天', time: '14:00', title: '面试辅导', type: 'meeting', color: 'blue' },
                { date: '明天', time: '10:00', title: '申请截止提醒', type: 'deadline', color: 'red' },
                { date: '本周五', time: '15:30', title: '家长沟通会', type: 'meeting', color: 'green' },
                { date: '下周一', time: '全天', title: '大学开放日', type: 'event', color: 'purple' },
              ].map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-${event.color}-100 dark:bg-${event.color}-900/30 flex flex-col items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs text-${event.color}-600 dark:text-${event.color}-400 font-medium`}>
                      {event.date}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {event.time}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-${event.color}-100 dark:bg-${event.color}-900/30 text-${event.color}-600 dark:text-${event.color}-400`}>
                        {event.type === 'meeting' ? '会议' : event.type === 'deadline' ? '截止' : '活动'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium transition-colors">
              查看完整日历
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
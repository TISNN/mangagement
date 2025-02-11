import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, FileCheck, FolderKanban, 
  BarChart3, Settings, Bell, Search, 
  GraduationCap, Calendar, FileText,
  Sparkles, ChevronRight, ArrowUpRight,
  LayoutGrid, Sun, Moon, Briefcase,
  BookOpenCheck, UserSquare2, Library,
  ClipboardList, Wallet, MessagesSquare,
  UserPlus, ChevronLeft, Mail, Phone, MapPin,
  Filter, Plus, MoreVertical,
  Globe, Languages, TrendingUp, Building, Plane,
  Bot, Brain, LogOut, Share2
} from 'lucide-react';
import SettingsPage from './pages/SettingsPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import AIModelPage from './pages/AIModelPage';
import LoginPage from './pages/LoginPage';
import ContractsPage from './pages/ContractsPage';
import SocialMediaPage from './pages/SocialMediaPage'; // 导入社媒运营页面组件

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 默认显示登录页面
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const pages = {
    login: <LoginPage setCurrentPage={setCurrentPage} />,
    dashboard: <DashboardPage />,
    students: <StudentsPage />,
    projects: <ProjectsPage setCurrentPage={setCurrentPage} />,
    applications: <ApplicationsPage setCurrentPage={setCurrentPage} />,
    applicationDetail: <ApplicationDetailPage setCurrentPage={setCurrentPage} />,
    aiModel: <AIModelPage />,
    leads: <LeadsPage />,
    mentors: <MentorsPage />,
    mentorProfile: <MentorProfilePage />,
    knowledge: <KnowledgeBasePage />,
    cases: <CaseStudiesPage />,
    contracts: <ContractsPage />,
    social: <SocialMediaPage setCurrentPage={setCurrentPage} />, // 添加社媒运营页面
    finance: <FinancePage />,
    settings: <SettingsPage />,
  };

  // 如果是登录页面，直接返回登录组件
  if (currentPage === 'login') {
    return <LoginPage setCurrentPage={setCurrentPage} />;
  }

  // 其他页面显示完整布局
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
      {/* 左侧导航栏 */}
      <header className="fixed left-0 top-0 h-full w-56 bg-white/80 backdrop-blur-xl dark:bg-gray-800/50">
        {/* Logo */}
        <div className="h-16 px-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-blue-600 absolute" style={{ filter: 'blur(8px)' }} />
              <GraduationCap className="h-8 w-8 text-blue-600 relative" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Infinite.ai
            </span>
          </div>
        </div>

        {/* 导航菜单 */}
        <div className="py-6 px-4">
          <nav className="space-y-2">
            {[
              { icon: LayoutGrid, text: '控制台', id: 'dashboard' },
              { icon: Users, text: '学生', id: 'students' },
              { icon: Briefcase, text: '服务项目', id: 'projects' },
              { icon: FileCheck, text: '申请进度', id: 'applications' },
              { icon: MessagesSquare, text: '线索', id: 'leads' },
              { icon: UserSquare2, text: '导师库', id: 'mentors' },
              { icon: Library, text: '知识库', id: 'knowledge' },
              { icon: Bot, text: 'AI大模型', id: 'aiModel' },
              { icon: ClipboardList, text: '案例库', id: 'cases' },
              { icon: FileText, text: '合同', id: 'contracts' },
              { icon: Share2, text: '社媒运营', id: 'social' },
              { icon: Wallet, text: '财务', id: 'finance' },
              { icon: Settings, text: '系统', id: 'settings' },
            ].map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{item.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 顶部用户信息栏 */}
      <div className="fixed top-0 right-0 left-56 h-16 bg-white/80 backdrop-blur-xl dark:bg-gray-800/50 z-10">
        <div className="flex items-center justify-end h-full px-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
                className="h-8 w-8 rounded-xl object-cover"
              />
              <div>
                <div className="font-medium dark:text-white">张明</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">管理员</div>
              </div>
            </div>
            <button 
              onClick={() => setCurrentPage('login')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="pl-72 pt-24 pr-8 pb-8">
        {pages[currentPage]}
      </main>
    </div>
  );
}

// 修改 DashboardPage 组件
function DashboardPage() {
  // 获取当前时间来决定问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="space-y-6">
      {/* 欢迎语部分 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{getGreeting()}, Evan</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">欢迎回到工作台，祝您开启愉快的一天</p>
          </div>
  
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: '在读学生',
            value: '2,851',
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            bgColor: 'bg-[#EEF2FF]', // 浅蓝色背景
            iconBgColor: 'bg-[#E0E7FF]', // 稍深的蓝色图标背景
            iconColor: 'text-[#6366F1]', // 深蓝色图标
            darkBgColor: 'dark:bg-gray-800',
            darkIconColor: 'dark:text-gray-400'
          },
          {
            title: '活跃项目',
            value: '185',
            change: '+8.2%',
            trend: 'up',
            icon: FolderKanban,
            bgColor: 'bg-[#E3F1E6]', // 保持原有的浅绿色背景
            iconBgColor: 'bg-[#CCE6D3]', // 保持原有的绿色图标背景
            iconColor: 'text-[#5BA970]', // 保持原有的深绿色图标
            darkBgColor: 'dark:bg-gray-800',
            darkIconColor: 'dark:text-gray-400'
          },
          

          {
            title: '本月收入',
            value: '¥286,432',
            change: '+18.3%',
            trend: 'up',
            icon: BarChart3,
            bgColor: 'bg-[#F7F7F7]', // 浅灰色背景
            iconBgColor: 'bg-[#EFEFEF]', // 稍深的灰色图标背景
            iconColor: 'text-[#666666]', // 深灰色图标
            darkBgColor: 'dark:bg-gray-800',
            darkIconColor: 'dark:text-gray-400'
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bgColor} ${stat.darkBgColor} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.iconBgColor} rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor} ${stat.darkIconColor}`} />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧日程表 */}
        <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">日程安排</h2>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ArrowUpRight className="h-5 w-5" />
            </button>
          </div>

          {/* 日期选择器 */}
          <div className="flex items-center gap-4 mb-8">
            {[
              { en: 'Sun', zh: '周日' },
              { en: 'Mon', zh: '周一' },
              { en: 'Tue', zh: '周二' },
              { en: 'Wed', zh: '周三' },
              { en: 'Thu', zh: '周四' },
              { en: 'Fri', zh: '周五' },
              { en: 'Sat', zh: '周六' }
            ].map((day, index) => {
              const isToday = index === 3; // 假设周三是今天
              const date = 22 + index;
              return (
                <button
                  key={day.en}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
                    isToday 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <span className="text-xs">{day.zh}</span>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                    isToday 
                      ? 'bg-blue-600 text-white' 
                      : ''
                  }`}>{date}</span>
                </button>
              );
            })}
          </div>

          {/* 时间轴 */}
          <div className="relative pl-14">
            {/* 时间轴线 */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-700" />
            
            {/* 时间点和事件 */}
            {[
              { time: '09:00', events: [
                { title: '每日晨会', duration: '09:30-10:00', type: 'dark' }
              ]},
              { time: '10:00', events: [] },
              { time: '11:00', events: [
                { title: '团队任务评审', duration: '10:30-11:30', type: 'light' }
              ]},
              { time: '12:00', events: [
                { title: '日常工作会议', duration: '12:00-13:00', type: 'light' }
              ]},
              { time: '13:00', events: [] },
              { time: '14:00', events: [] },
              { time: '15:00', events: [] },
            ].map((timeSlot, index) => (
              <div key={index} className="relative flex gap-4 mb-8 last:mb-0">
                {/* 时间点 */}
                <div className={`absolute left-0 -translate-x-14 w-10 text-sm ${
                  timeSlot.time === '12:00' 
                    ? 'text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {timeSlot.time}
                </div>
                
                {/* 时间点标记 */}
                <div className={`absolute left-6 -translate-x-[0.9rem] w-7 h-7 rounded-full flex items-center justify-center ${
                  timeSlot.time === '12:00'
                    ? 'bg-blue-100 dark:bg-blue-900/20'
                    : timeSlot.events.length > 0
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    timeSlot.time === '12:00'
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : timeSlot.events.length > 0
                      ? 'bg-yellow-400 dark:bg-yellow-500'
                      : ''
                  }`} />
                </div>

                {/* 事件卡片 */}
                {timeSlot.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`ml-8 p-4 rounded-xl flex-1 ${
                      event.type === 'dark'
                        ? 'bg-gray-900 dark:bg-gray-700'
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <h3 className={event.type === 'dark' ? 'text-white' : 'dark:text-white'}>
                      {event.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      event.type === 'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {event.duration}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 保持现有的最近申请和待办事项卡片,但改为占用右侧两列 */}
        <div className="md:col-span-2 space-y-6">
          {/* 最近申请 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">最近申请</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                查看全部
              </button>
            </div>
            <div className="space-y-4">
              {[
                { student: '张明', school: '伦敦大学学院', major: '计算机科学', status: '待处理' },
                { student: '李华', school: '多伦多大学', major: '金融经济', status: '材料审核' },
                { student: '王芳', school: '墨尔本大学', major: '市场营销', status: '面试准备' },
                { student: '赵伟', school: '新加坡国立大学', major: '工商管理', status: '已录取' },
              ].map((application, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{application.student}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {application.school} · {application.major}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    application.status === '已录取'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 待办事项 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">待办事项</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                添加待办
              </button>
            </div>
            <div className="space-y-4">
              {[
                { title: '文书修改 - 张明', deadline: '今天 14:00', priority: '高' },
                { title: '面试辅导 - 李华', deadline: '今天 16:30', priority: '中' },
                { title: '选校咨询 - 王芳', deadline: '明天 10:00', priority: '中' },
                { title: '材料整理 - 赵伟', deadline: '明天 15:00', priority: '低' },
              ].map((todo, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      className="h-5 w-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{todo.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{todo.deadline}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    todo.priority === '高'
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : todo.priority === '中'
                      ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {todo.priority}优先级
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 修改 StudentsPage 组件
function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">学生管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索学生..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            筛选
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            添加学生
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '总学生数', value: '2,851', icon: Users, color: 'blue' },
          { title: '本月新增', value: '128', icon: UserPlus, color: 'green' },
          { title: '申请中', value: '386', icon: FileCheck, color: 'yellow' },
          { title: '成功录取', value: '1,204', icon: GraduationCap, color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 学生列表 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部学生', '申请中', '已录取', '已结业'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">学生信息</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">申请项目</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">申请学校</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">负责导师</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: '张明',
                email: 'zhang.ming@example.com',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '本科申请',
                school: '伦敦大学学院',
                status: '申请中',
                mentor: '刘老师'
              },
              {
                name: '李华',
                email: 'li.hua@example.com',
                avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '研究生申请',
                school: '多伦多大学',
                status: '已录取',
                mentor: '王老师'
              },
              {
                name: '王芳',
                email: 'wang.fang@example.com',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '本科申请',
                school: '墨尔本大学',
                status: '材料准备',
                mentor: '张老师'
              },
              {
                name: '赵伟',
                email: 'zhao.wei@example.com',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '研究生申请',
                school: '新加坡国立大学',
                status: '已录取',
                mentor: '李老师'
              },
            ].map((student, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 dark:text-gray-300">{student.project}</td>
                <td className="py-4 px-6 dark:text-gray-300">{student.school}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === '已录取'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : student.status === '申请中'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6 dark:text-gray-300">{student.mentor}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 10 条，共 156 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, 3, '...', 16].map((page, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-xl text-sm ${
                    page === 1
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 修改 ApplicationsPage 组件
function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">申请进度</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索申请..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            新建申请
          </button>
        </div>
      </div>

      {/* 进度统计 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { title: '全部申请', value: '386', icon: FileText, color: 'blue' },
          { title: '材料准备', value: '125', icon: FolderKanban, color: 'yellow' },
          { title: '申请中', value: '98', icon: FileCheck, color: 'purple' },
          { title: '面试阶段', value: '45', icon: Users, color: 'orange' },
          { title: '已录取', value: '118', icon: GraduationCap, color: 'green' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 申请列表 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部申请', '材料准备', '申请中', '面试阶段', '已录取'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 space-y-6">
          {[
            {
              student: '张明',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
              school: '伦敦大学学院',
              program: '计算机科学 本科',
              status: '材料准备',
              steps: ['个人信息', '学术背景', '语言成绩', '文书材料', '在线提交'],
              currentStep: 2,
              deadline: '2024-05-15',
              mentor: '刘老师'
            },
            {
              student: '李华',
              avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
              school: '多伦多大学',
              program: '金融经济 研究生',
              status: '面试阶段',
              steps: ['材料提交', '初审通过', '面试邀请', '面试完成', '录取结果'],
              currentStep: 3,
              deadline: '2024-04-20',
              mentor: '王老师'
            },
            {
              student: '王芳',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
              school: '墨尔本大学',
              program: '市场营销 本科',
              status: '申请中',
              steps: ['材料提交', '初审', '复审', '终审', '录取'],
              currentStep: 1,
              deadline: '2024-06-01',
              mentor: '张老师'
            }
          ].map((application, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 dark:bg-gray-700/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={application.avatar}
                    alt={application.student}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-medium dark:text-white">{application.student}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {application.school} · {application.program}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === '已录取'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : application.status === '面试阶段'
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                        : application.status === '申请中'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {application.status}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      截止日期: {application.deadline}
                    </p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {application.steps.map((step, stepIndex) => (
                  <React.Fragment key={stepIndex}>
                    <div className="flex-1">
                      <div className={`h-2 rounded-full ${
                        stepIndex < application.currentStep
                          ? 'bg-blue-600'
                          : stepIndex === application.currentStep
                          ? 'bg-blue-200 dark:bg-blue-900/50'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{step}</p>
                    </div>
                    {stepIndex < application.steps.length - 1 && (
                      <div className="w-8" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsPage({ setCurrentPage }) {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">服务项目</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          添加服务
        </button>
      </div>

      {/* 服务项目卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: '留学申请',
            description: '提供全程留学申请服务，包括院校选择、材料准备、文书指导等',
            icon: GraduationCap, // 毕业帽图标
            color: 'bg-blue-50 text-blue-600'
          },
          {
            title: '国际标化',
            description: '提供国际课程对接和学分转换服务，帮助学生顺利衔接国际教育',
            icon: Globe, // 地球图标
            color: 'bg-purple-50 text-purple-600'
          },
          {
            title: '语言培训',
            description: '专业的语言考试培训，包括IELTS、TOEFL、GRE、GMAT等',
            icon: Languages, // 语言图标
            color: 'bg-green-50 text-green-600'
          },
          {
            title: '课业辅导',
            description: '一对一课业辅导，帮助学生提高学习成绩和学术能力',
            icon: BookOpen, // 打开的书图标
            color: 'bg-yellow-50 text-yellow-600'
          },
          {
            title: '背景提升',
            description: '规划和提供实习、科研、竞赛等背景提升项目',
            icon: TrendingUp, // 上升趋势图标
            color: 'bg-red-50 text-red-600'
          },
          {
            title: '求职规划',
            description: '职业发展规划和求职指导，助力学生实现理想就业',
            icon: Briefcase, // 公文包图标
            color: 'bg-indigo-50 text-indigo-600'
          },
          {
            title: '签证住宿',
            description: '提供签证申请指导和海外住宿安排服务',
            icon: Building, // 建筑图标
            color: 'bg-pink-50 text-pink-600'
          },
          {
            title: '海外研学',
            description: '组织海外游学、夏令营等研学项目，拓展国际视野',
            icon: Plane, // 飞机图标
            color: 'bg-orange-50 text-orange-600'
          },
          {
            title: '学术申诉',
            description: '提供专业的学术申诉服务，保障学生的学术权益',
            icon: FileCheck, // 文件检查图标
            color: 'bg-teal-50 text-teal-600'
          }
        ].map((service, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${service.color} dark:bg-opacity-20`}>
                <service.icon className="w-6 h-6" />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{service.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setCurrentPage('applicationDetail')}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                查看详情 →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">线索管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索线索..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            添加线索
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '本月新增', value: '156', change: '+12.5%', icon: UserPlus, color: 'blue' },
          { title: '跟进中', value: '86', change: '+8.2%', icon: MessagesSquare, color: 'yellow' },
          { title: '已约访', value: '45', change: '+15.4%', icon: Calendar, color: 'purple' },
          { title: '已签约', value: '32', change: '+18.3%', icon: FileCheck, color: 'green' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.title}</h3>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 线索列表 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部线索', '未跟进', '跟进中', '已约访', '已签约'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">姓名</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">来源</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">意向项目</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">最近联系</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">负责人</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {[
              { 
                name: '张明',
                source: '官网咨询',
                project: '英国本科申请',
                status: '已约访',
                lastContact: '2024-03-15',
                owner: '王老师',
                phone: '138****8888',
                email: 'zhang.ming@example.com'
              },
              {
                name: '李华',
                source: '朋友推荐',
                project: '美国研究生申请',
                status: '已签约',
                lastContact: '2024-03-14',
                owner: '刘老师',
                phone: '139****9999',
                email: 'li.hua@example.com'
              },
              {
                name: '王芳',
                source: '线上广告',
                project: '加拿大本科申请',
                status: '跟进中',
                lastContact: '2024-03-13',
                owner: '张老师',
                phone: '137****7777',
                email: 'wang.fang@example.com'
              },
              {
                name: '赵伟',
                source: '教育展',
                project: '澳洲研究生申请',
                status: '未跟进',
                lastContact: '-',
                owner: '李老师',
                phone: '136****6666',
                email: 'zhao.wei@example.com'
              }
            ].map((lead, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-medium dark:text-white">{lead.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</span>
                  </div>
                </td>
                <td className="py-4 px-6 dark:text-gray-300">{lead.source}</td>
                <td className="py-4 px-6 dark:text-gray-300">{lead.project}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === '已签约'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : lead.status === '已约访'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : lead.status === '跟进中'
                      ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{lead.lastContact}</td>
                <td className="py-4 px-6 dark:text-gray-300">{lead.owner}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300">
                      查看详情
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 分页 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 10 条，共 156 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, 3, '...', 16].map((page, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-xl text-sm ${
                    page === 1
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 修改 MentorsPage 组件
function MentorsPage({ setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-white">导师库 (28)</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex">
            <button className={`px-6 py-2 text-sm font-medium rounded-l-xl bg-blue-600 text-white`}>
              列表
            </button>
            <button className={`px-6 py-2 text-sm font-medium rounded-r-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400`}>
              状态
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 rounded-xl dark:bg-gray-800">
            <Filter className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            添加成员
          </button>
        </div>
      </div>

      {/* 修改导师列表为网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: 'Emma',
            title: '硕士',
            location: '北京/英国',
            education: [
              { degree: '硕士', school: '英国里斯本高商', major: 'Accounting' },
              { degree: '本科', school: '北京科技大学', major: '战略与咨询' }
            ],
            skills: '法语B1/雅思8.0/GMAT750',
            expertise: '留学申请/课业辅导'
          },
          {
            name: '乔治',
            title: '硕士',
            location: '法国',
            education: [
              { degree: '硕士', school: 'Essec business school', major: 'Finance' },
              { degree: '本科', school: 'ESCP business school', major: 'Finance' }
            ],
            skills: '法语B1/雅思8.0/GMAT750',
            expertise: '金融经济、预测宏观、计量经济、公司金融、期货期权衍生品、量化金融等'
          },
          {
            name: '刘舒妍',
            title: '硕士',
            location: '澳门/英国',
            education: [
              { degree: '硕士', school: '英国伯明翰大学', major: 'international business' },
              { degree: '本科', school: '澳门科技大学', major: 'accounting' }
            ],
            skills: '法语B1/雅思8.0/GMAT750',
            expertise: '留学申请'
          },
          {
            name: '娟儿',
            title: '硕士',
            location: '法国',
            education: [
              { degree: '硕士', school: 'ESRA', major: '制片与发行' },
              { degree: '本科', school: 'CLCF', major: '剧导演' }
            ],
            skills: '法语B2+',
            expertise: '留学申请/语言培训/面试培训'
          },
          {
            name: '石原浩',
            title: '硕士',
            location: '北京',
            education: [
              { degree: '研二', school: '网安' },
              { degree: '研一', school: '密码学' }
            ],
            skills: '深度学习',
            expertise: '课业辅导/CODE'
          }
        ].map((mentor, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`}
                  alt={mentor.name}
                  className="h-12 w-12 rounded-xl bg-gray-100"
                />
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium dark:text-white">{mentor.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{mentor.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{mentor.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">院校</span>
                      {mentor.education.map((edu, eduIndex) => (
                        <div key={eduIndex} className="mt-1">
                          <p className="text-sm dark:text-gray-300">
                            {edu.degree} {edu.school} {edu.major}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">其他能力</span>
                      <p className="mt-1 text-sm dark:text-gray-300">{mentor.skills}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">辅导内容</span>
                      <p className="mt-1 text-sm dark:text-gray-300">{mentor.expertise}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 保持分页部分不变 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          1-8 of 28
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MentorProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentPage('mentors')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">导师详情</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          编辑资料
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-start gap-6">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="刘舒妍"
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 dark:text-white">刘舒妍</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  大家好，我是Lidia，我在武汉大学完成了经济学和数学的双学士学位。目前，我正在剑桥大学攻读经济学专业的研究生课程。
                </p>
                <div className="flex gap-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    申请导师
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    语言培训
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    文书指导
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 教育背景 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">教育背景</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div>
                  <h4 className="font-medium dark:text-white">英国伯明翰大学 · 国际商务</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">硕士 · 2022.10 - 至今</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
                <div>
                  <h4 className="font-medium dark:text-white">北京科技大学 · 会计与咨询</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">本科 · 2017.09 - 2021.06</p>
                </div>
              </div>
            </div>
          </div>

          {/* 工作经历 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">工作经历</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div>
                  <h4 className="font-medium dark:text-white">新航道教育 · 留学顾问</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2022.10 - 至今</p>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li>负责学生留学申请全程指导</li>
                    <li>提供专业的院校选择和申请策略建议</li>
                    <li>协助学生准备申请材料和文书写作</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 个人信息卡片 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">个人信息</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm dark:text-gray-300">lidia@example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-sm dark:text-gray-300">+86 138 **** 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm dark:text-gray-300">澳门/英国</span>
              </div>
            </div>
          </div>

          {/* 技能特长 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">技能特长</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">英语水平</span>
                  <span className="text-blue-600 dark:text-blue-400">雅思8.5</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700">
                  <div className="h-full w-[95%] bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">文书写作</span>
                  <span className="text-blue-600 dark:text-blue-400">专业级</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700">
                  <div className="h-full w-[90%] bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">留学规划</span>
                  <span className="text-blue-600 dark:text-blue-400">资深</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700">
                  <div className="h-full w-[85%] bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 相关文件 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">相关文件</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">个人简历.pdf</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">资质证书.pdf</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">知识库</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索文档..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            新建文档
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '文档总数', value: '256', icon: FileText, color: 'blue' },
          { title: '本月新增', value: '32', icon: Plus, color: 'green' },
          { title: '浏览次数', value: '1,286', icon: BookOpen, color: 'purple' },
          { title: '收藏数', value: '386', icon: Sparkles, color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左侧目录 */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">文档目录</h2>
            <nav className="space-y-2">
              {[
                { name: '申请指南', count: 45, icon: BookOpen },
                { name: '院校资料', count: 68, icon: GraduationCap },
                { name: '专业介绍', count: 52, icon: BookOpenCheck },
                { name: '考试备考', count: 34, icon: FileCheck },
                { name: '签证事务', count: 28, icon: FileText },
                { name: '生活指导', count: 29, icon: Library },
              ].map((category, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors ${
                    index === 0
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="h-5 w-5" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg dark:bg-gray-700">
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 右侧文档列表 */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">申请指南</h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
                <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <option>最近更新</option>
                  <option>最多浏览</option>
                  <option>最多收藏</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: '英国本科申请全攻略 2024版',
                  description: '最新英国大学申请流程、材料准备、时间规划等完整指南',
                  author: '王老师',
                  date: '2024-03-15',
                  views: 1280,
                  likes: 326
                },
                {
                  title: 'IELTS备考经验分享',
                  description: '雅思考试各个部分的备考技巧和经验总结',
                  author: '李老师',
                  date: '2024-03-14',
                  views: 960,
                  likes: 245
                },
                {
                  title: '美国研究生申请文书写作指南',
                  description: 'PS、SOP等文书的写作技巧和注意事项',
                  author: '张老师',
                  date: '2024-03-13',
                  views: 856,
                  likes: 198
                },
                {
                  title: '澳洲留学签证办理流程',
                  description: '最新澳洲学生签证申请流程和材料清单',
                  author: '刘老师',
                  date: '2024-03-12',
                  views: 645,
                  likes: 156
                },
              ].map((doc, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">{doc.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {doc.description}
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{doc.author}</span>
                      <span>{doc.date}</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {doc.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        {doc.likes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">财务管理</h1>
        <div className="flex gap-4">
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            导出报表
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            新增记录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: '本月收入',
            value: '¥286,432',
            change: '+18.3%',
            trend: 'up',
            icon: BarChart3,
            bgColor: 'bg-[#F0FDF4]', // 浅绿色背景
            iconBgColor: 'bg-[#DCFCE7]', // 稍深的绿色图标背景
            iconColor: 'text-[#22C55E]', // 深绿色图标
            darkBgColor: 'dark:bg-gray-800',
            darkIconColor: 'dark:text-green-500'
          },
          {
            title: '本月支出',
            value: '¥168,290',
            change: '+12.5%',
            trend: 'up',
            icon: BarChart3,
            bgColor: 'bg-[#FEF2F2]', // 浅红色背景
            iconBgColor: 'bg-[#FEE2E2]', // 稍深的红色图标背景
            iconColor: 'text-[#EF4444]', // 深红色图标
            darkBgColor: 'dark:bg-gray-800',
            darkIconColor: 'dark:text-red-500'
          },
          {
            title: '净利润',
            value: '¥118,142',
            change: '+15.8%',
            trend: 'up',
            icon: BarChart3,
            bgColor: 'bg-[#EEF2FF]', // 浅蓝色背景
            iconBgColor: 'bg-[#E0E7FF]', // 稍深的蓝色图标背景
            iconColor: 'text-[#6366F1]', // 深蓝色图标
            darkBgColor: 'dark:bg-gray-800',
            darkIconColor: 'dark:text-blue-500'
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bgColor} ${stat.darkBgColor} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.iconBgColor} rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor} ${stat.darkIconColor}`} />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">最近交易</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">交易编号</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">类型</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">项目</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">金额</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">日期</th>
            </tr>
          </thead>
          <tbody>
            {[
              { 
                id: 'TX-2024-001', 
                type: '收入', 
                project: '留学申请服务', 
                amount: 15800, 
                status: '已完成', 
                date: '2024-03-15',
                typeColor: 'text-green-600 dark:text-green-400',
                amountColor: 'text-green-600 dark:text-green-400'
              },
              { 
                id: 'TX-2024-002', 
                type: '支出', 
                project: '导师课酬', 
                amount: -5000, 
                status: '已完成', 
                date: '2024-03-14',
                typeColor: 'text-red-600 dark:text-red-400',
                amountColor: 'text-red-600 dark:text-red-400'
              },
              { id: 'TX-2024-003', type: '收入', project: '语言培训', amount: 12000, status: '处理中', date: '2024-03-13' },
              { id: 'TX-2024-004', type: '支出', project: '市场推广', amount: -3500, status: '已完成', date: '2024-03-12' },
            ].map((transaction, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{transaction.id}</td>
                <td className={`py-4 px-6 text-sm ${transaction.typeColor}`}>{transaction.type}</td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{transaction.project}</td>
                <td className={`py-4 px-6 text-sm font-medium ${transaction.amountColor}`}>
                  {transaction.amount > 0 ? `+¥${transaction.amount}` : `-¥${Math.abs(transaction.amount)}`}
                </td>
                <td className="py-4 px-6 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === '已完成' 
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
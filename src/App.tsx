import { useState, useRef, useEffect } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Users, FileCheck, 
  Settings, Bell, 
  FileText,
  LayoutGrid, Sun, Moon, Briefcase,
  UserSquare2, Library,
  ClipboardList, Wallet, MessagesSquare,
  ChevronLeft,
  LogOut, School,
  UserRound, 
  ListTodo,
  ChevronUp,
  ChevronDown,
  Bot,
  BookOpen,
  Brain,
  Calendar
} from 'lucide-react';
import { DataProvider } from './context/DataContext'; // 导入数据上下文提供者
import AIChatAssistant from './components/AIChatAssistant';
import ErrorBoundary from './components/ErrorBoundary';
import './utils/cacheManager'; // 引入缓存管理器,使window.clearAppCache()可用

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 默认显示控制台
  const [isDark, setIsDark] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false); // 添加导航栏折叠状态
  const [currentUser, setCurrentUser] = useState<{ name?: string; position?: string; status?: string; avatar_url?: string } | null>(null); // 当前登录用户
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate(); // 添加导航函数
  
  // 修改导航菜单项
  const navigationItems = [
    { icon: LayoutGrid, text: '控制台', id: 'dashboard', color: 'blue' },
    { icon: UserRound, text: '员工管理', id: 'employees', color: 'blue' },
    { icon: ListTodo, text: '任务管理', id: 'tasks', color: 'blue' },
    // { icon: MessageCircle, text: '团队聊天', id: 'team-chat', color: 'blue' },
    { icon: Users, text: '学生管理', id: 'students', color: 'blue' },
    { icon: Bot, text: '申请Copilot', id: 'study-copilot', color: 'purple' },
    { icon: School, text: '院校库', id: 'school-library', color: 'blue' },
    { icon: BookOpen, text: '专业库', id: 'program-library', color: 'green' },
    { icon: Brain, text: '智能选校', id: 'smart-selection', color: 'purple' },
    { icon: Briefcase, text: '服务项目', id: 'projects', color: 'blue' },
    { icon: FileCheck, text: '申请进度', id: 'applications', color: 'blue' },
    { icon: MessagesSquare, text: '客户线索', id: 'leads', color: 'blue' },
    { icon: UserSquare2, text: '导师库', id: 'mentors', color: 'blue' },
    { icon: Calendar, text: '会议管理', id: 'meetings', color: 'blue' },
    { icon: Library, text: '知识库', id: 'knowledge', color: 'blue' },
    // { icon: Bot, text: 'AI大模型', id: 'aiModel', color: 'blue' },
    // { icon: Video, text: '面试培训', id: 'interview', color: 'blue' },
    { icon: ClipboardList, text: '案例库', id: 'cases', color: 'blue' },
    { icon: FileText, text: '合同管理', id: 'contracts', color: 'blue' },
    // { icon: Share2, text: '社媒运营', id: 'social', color: 'blue' },
    { icon: Wallet, text: '财务管理', id: 'finance', color: 'blue' },
    { icon: Settings, text: '密码设置', id: 'settings', color: 'blue' },
  ];
  
  // 检查滚动状态
  const checkScrollPosition = () => {
    const nav = navRef.current;
    if (nav) {
      setShowScrollTop(nav.scrollTop > 20);
      setShowScrollBottom(nav.scrollTop < nav.scrollHeight - nav.clientHeight - 20);
    }
  };

  // 处理滚动
  const handleScrollUp = () => {
    const nav = navRef.current;
    if (nav) {
      nav.scrollTop -= 100;
      checkScrollPosition();
    }
  };

  const handleScrollDown = () => {
    const nav = navRef.current;
    if (nav) {
      nav.scrollTop += 100;
      checkScrollPosition();
    }
  };

  // 加载当前用户信息
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

  // 初始化检查滚动状态
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 添加滚动监听
    const nav = navRef.current;
    if (nav) {
      checkScrollPosition();
      nav.addEventListener('scroll', checkScrollPosition);
      return () => {
        nav.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [isDark]);

  // 从location.pathname中获取当前页面
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      setCurrentPage('dashboard');
    } else if (path.includes('employees')) {
      setCurrentPage('employees');
    } else if (path.includes('tasks')) {
      setCurrentPage('tasks');
    } else if (path.includes('team-chat')) {
      setCurrentPage('team-chat');
    } else if (path.includes('students')) {
      setCurrentPage('students');
    } else if (path.includes('study-copilot')) {
      setCurrentPage('study-copilot');
    } else if (path.includes('school-library')) {
      setCurrentPage('school-library');
    } else if (path.includes('program-library')) {
      setCurrentPage('program-library');
    } else if (path.includes('smart-selection')) {
      setCurrentPage('smart-selection');
    } else if (path.includes('projects')) {
      setCurrentPage('projects');
    } else if (path.includes('applications')) {
      setCurrentPage('applications');
    } else if (path.includes('leads')) {
      setCurrentPage('leads');
    } else if (path.includes('mentors')) {
      setCurrentPage('mentors');
    } else if (path.includes('knowledge')) {
      setCurrentPage('knowledge');
    } else if (path.includes('interview')) {
      setCurrentPage('interview');
    } else if (path.includes('cases')) {
      setCurrentPage('cases');
    } else if (path.includes('contracts')) {
      setCurrentPage('contracts');
    } else if (path.includes('social')) {
      setCurrentPage('social');
    } else if (path.includes('aiModel')) {
      setCurrentPage('aiModel');
    } else if (path.includes('finance')) {
      setCurrentPage('finance');
    } else if (path.includes('settings')) {
      setCurrentPage('settings');
    }
  }, [location]);

  // 如果路径是 /login，不显示管理界面
  if (location.pathname === '/login') {
    return null;
  }

  // 处理导航点击事件
  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    // 根据页面ID导航到相应的路由
    navigate(`/admin/${pageId}`);
  };

  // 处理登出
  const handleLogout = () => {
    // 清除所有登录信息
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('currentEmployee');
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('loginExpiry'); // 清除自动登录
    // 注意: 保留 rememberedEmail 和 rememberedRole,方便下次登录自动填充
    // 导航到登录页
    navigate('/login');
  };

  // 其他页面显示完整布局
  return (
    <ErrorBoundary>
      <DataProvider>
            <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
              {/* 左侧导航栏 */}
              <header className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isNavCollapsed ? 'w-20' : 'w-56'} transition-all duration-300 bg-white/80 backdrop-blur-xl dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 z-10`}>
                {/* 导航菜单 - 添加滚动容器 */}
                <div className="py-6 px-4 relative">
                  {/* 上滚动按钮 */}
                  {showScrollTop && (
                    <button 
                      onClick={handleScrollUp}
                      className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  
                  <nav 
                    ref={navRef} 
                    className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                  >
                      {navigationItems.map((item) => {
                      const isActive = currentPage === item.id;
                        const colorMap: Record<string, string> = {
                        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
                        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
                        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                        yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                        pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
                        cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
                        teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
                        lime: 'bg-lime-50 text-lime-600 dark:bg-lime-900/20 dark:text-lime-400',
                        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
                        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
                        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                        violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
                        fuchsia: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-400',
                        gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
                      };

                      return (
                        <button
                          key={item.id}
                            onClick={() => handleNavigation(item.id)}
                          className={`w-full flex items-center ${isNavCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-xl text-sm transition-all duration-200 ${
                            isActive 
                              ? colorMap[item.color]
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
                          }`}
                          title={isNavCollapsed ? item.text : ""}
                        >
                          {isActive && !isNavCollapsed && (
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-${item.color}-500 dark:bg-${item.color}-600`}></span>
                          )}
                          
                          <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? `text-${item.color}-600 dark:text-${item.color}-400` : ''}`} />
                          
                          {!isNavCollapsed && (
                            <>
                              <span>{item.text}</span>
                              {isActive && (
                                <span className={`ml-auto w-2 h-2 rounded-full bg-${item.color}-500 dark:bg-${item.color}-400`}></span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                  
                  {/* 下滚动按钮 */}
                  {showScrollBottom && (
                    <button 
                      onClick={handleScrollDown}
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>

                {/* 折叠按钮 */}
                <button 
                  onClick={() => setIsNavCollapsed(!isNavCollapsed)} 
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 z-20"
                  title={isNavCollapsed ? "展开导航栏" : "折叠导航栏"}
                >
                  <ChevronLeft className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isNavCollapsed ? 'rotate-180' : ''}`} />
                </button>
              </header>

              {/* 顶部用户信息栏 */}
              <div className={`fixed top-0 right-0 left-0 transition-all duration-300 h-16 bg-white/80 backdrop-blur-xl dark:bg-gray-800/50 z-20 border-b border-gray-200 dark:border-gray-700`}>
                <div className="flex items-center justify-between h-full px-6">
                  {/* 左侧：Logo 和系统名称 */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src="/logo.png?v=1" 
                        alt="StudyLandsEdu Workspace" 
                        className="h-8 w-auto object-contain"
                        onLoad={() => console.log('Logo loaded successfully')}
                        onError={(e) => console.error('Logo failed to load:', e)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        StudyLandsEdu
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Workspace
                      </span>
                    </div>
                  </div>

                  {/* 右侧：用户信息和操作按钮 */}
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
                        src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'user'}`}
                        alt="User"
                        className="h-8 w-8 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-medium dark:text-white">
                          {currentUser?.name || '加载中...'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {currentUser?.position || currentUser?.status || '用户'}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="退出登录"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 主内容区域 - 使用Outlet代替pages[currentPage] */}
              <main className={`${isNavCollapsed ? 'ml-20' : 'ml-56'} mt-16 transition-all duration-300 p-8`}>
                <Outlet />
              </main>

              {/* AI助手 */}
              <AIChatAssistant />
            </div>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;

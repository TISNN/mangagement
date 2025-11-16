import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  Briefcase,
  GraduationCap,
  Trophy,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  );
  const [currentStudent, setCurrentStudent] = useState<{ name?: string; avatar_url?: string } | null>(null);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/student',
      description: '查看学习进度和重要通知'
    },
    {
      title: '数据分析',
      icon: BarChart2,
      path: '/student/analytics',
      description: '深入分析学习数据'
    },
    {
      title: '材料管理',
      icon: FileText,
      path: '/student/materials',
      description: '管理申请相关材料'
    },
    {
      title: '实习库',
      icon: Briefcase,
      path: '/student/internships',
      description: '浏览实习和内推机会'
    },
    {
      title: '我的选校',
      icon: GraduationCap,
      path: '/student/school-selection',
      description: '管理和追踪选校记录'
    },
    {
      title: '竞赛库',
      icon: Trophy,
      path: '/student/competitions',
      description: '浏览适合参加的学术竞赛'
    },
    {
      title: '社区交流',
      icon: Users,
      path: '/student/community',
      description: '与其他学生交流经验'
    },
    {
      title: '学习资源',
      icon: BookOpen,
      path: '/student/resources',
      description: '浏览课程和学习资料'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/student') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const stored = localStorage.getItem('currentStudent');
    if (stored) {
      try {
        setCurrentStudent(JSON.parse(stored));
      } catch (error) {
        console.error('[StudentLayout] 解析 currentStudent 失败:', error);
      }
    }
  }, []);

  const studentName = currentStudent?.name || '学生用户';
  const avatarUrl =
    currentStudent?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentName)}`;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('currentStudent');
    navigate('/login');
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="h-16 bg-white/80 backdrop-blur-xl dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png?v=1"
              alt="StudyLandsEdu"
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">StudyLandsEdu</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={studentName}
                className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{studentName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">学生账号</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              退出
            </button>
          </div>
        </header>
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧导航栏 */}
        <motion.div 
          initial={false}
          animate={{ width: isCollapsed ? '70px' : '190px' }}
          className="relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          {/* 导航菜单 */}
          <nav className="space-y-1 px-2 pt-5 pb-24">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                onClick={() => navigate(item.path)}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 cursor-pointer rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                  <item.icon className="h-4 w-4" />
                  </div>
                  {!isCollapsed && (
                    <div>
                    <span className={`text-sm font-medium ${
                        isActive(item.path)
                        ? 'text-blue-600 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>
                {!isCollapsed && isActive(item.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                  className="w-1 h-8 bg-blue-500 rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </nav>

          {/* 底部按钮 */}
          <div className={`absolute bottom-0 w-full p-6 border-t border-gray-200 dark:border-gray-700 ${
            isCollapsed ? 'flex flex-col items-center' : ''
          }`}>
            <div className={`space-y-3 ${isCollapsed ? 'w-full' : ''}`}>
              <button
                onClick={() => navigate('/student/settings')}
                className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <Settings className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">设置</span>}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">退出登录</span>}
              </button>
            </div>
          </div>

          {/* 折叠按钮 */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-600 z-20"
            title={isCollapsed ? "展开导航栏" : "折叠导航栏"}
          >
            <ChevronLeft className={`h-4 w-4 text-gray-500 dark:text-gray-300 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </motion.div>

        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout; 
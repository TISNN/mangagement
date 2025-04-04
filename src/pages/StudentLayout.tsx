import React, { useState } from 'react';
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
  Search,
  Briefcase,
  GraduationCap,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    {
      title: '总览',
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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* 左侧导航栏 */}
      <motion.div 
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        className="relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
      >
        {/* 顶部Logo和折叠按钮 */}
        <div className="flex items-center justify-between p-6">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
            >
              Infinite.ai
            </motion.h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className={`h-5 w-5 text-gray-500 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 搜索框 */}
        {!isCollapsed && (
          <div className="px-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="快速导航..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300"
              />
            </div>
          </div>
        )}

        {/* 导航菜单 */}
        <nav className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              onClick={() => navigate(item.path)}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 cursor-pointer rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                  <div>
                    <span className={`font-medium ${
                      isActive(item.path)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {item.title}
                    </span>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
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
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg relative"
            >
              <Bell className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">通知</span>}
              <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => navigate('/student/settings')}
              className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">设置</span>}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">退出登录</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout; 
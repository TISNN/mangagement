import { useState, useRef, useEffect } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Users,
  Users2,
  FileCheck,
  Settings,
  Bell,
  FileText,
  LayoutGrid,
  LayoutDashboard,
  Sun,
  Moon,
  Briefcase,
  LogIn,
  UserSquare2,
  Library,
  ClipboardList,
  Wallet,
  MessagesSquare,
  ChevronLeft,
  History,
  LogOut,
  School,
  UserRound,
  ListTodo,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Brain,
  Calendar,
  CalendarClock,
  GraduationCap,
  Laptop,
  Compass,
  BarChart3,
  Headphones,
  Handshake,
  LayoutList,
  PieChart,
  MessageCircle,
  Layers,
  Globe2,
  Shield,
  ShieldCheck,
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
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    position?: string;
    status?: string;
    avatar_url?: string;
    avatarUrl?: string;
    avatar?: string;
  } | null>(null); // 当前登录用户
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'study-services': true,
    'internal-management': true,
  });
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate(); // 添加导航函数
  
  // 修改导航菜单项
  type NavigationItem = {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    id: string;
    color: string;
    children?: NavigationItem[];
    externalUrl?: string;
  };

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
  };

  const accentBarMap: Record<string, string> = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    purple: 'bg-purple-500 dark:bg-purple-600',
    green: 'bg-green-500 dark:bg-green-600',
    gray: 'bg-gray-400 dark:bg-gray-500',
    indigo: 'bg-indigo-500 dark:bg-indigo-600',
    orange: 'bg-orange-500 dark:bg-orange-600',
  };

  const iconColorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    gray: 'text-gray-500 dark:text-gray-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  const skyOfficeExternalUrl =
    typeof import.meta !== 'undefined' &&
    typeof import.meta.env !== 'undefined' &&
    import.meta.env.VITE_SKYOFFICE_URL
      ? import.meta.env.VITE_SKYOFFICE_URL
      : 'https://sky-office.co/';

  const resolveAvatarUrl = (user: typeof currentUser) => {
    const avatarCandidate =
      (typeof user?.avatar_url === 'string' && user.avatar_url.trim()) ||
      (typeof user?.avatarUrl === 'string' && user.avatarUrl.trim()) ||
      (typeof user?.avatar === 'string' && user.avatar.trim());

    if (avatarCandidate && avatarCandidate.length > 0) {
      return avatarCandidate;
    }

    const seed = user?.name || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const navigationItems: NavigationItem[] = [
    { icon: LayoutGrid, text: '控制台', id: 'dashboard', color: 'blue' },
    { icon: ListTodo, text: '任务管理', id: 'tasks', color: 'blue' },
    { icon: Users, text: '学生管理', id: 'students-legacy', color: 'blue' },
    {
      icon: Shield,
      text: '团队管理',
      id: 'internal-management',
      color: 'blue',
      children: [
        {
          icon: Users2,
          text: '团队成员',
          id: 'internal-management/employee-and-scheduling',
          color: 'blue',
        },
        {
          icon: LogIn,
          text: '入职与离职',
          id: 'internal-management/onboarding',
          color: 'blue',
        },
        {
          icon: Briefcase,
          text: '招聘中心',
          id: 'internal-management/recruitment',
          color: 'blue',
        },
        {
          icon: Settings,
          text: '系统设置',
          id: 'internal-management/system-settings',
          color: 'blue',
        },
      ],
    },
    {
      icon: LayoutDashboard,
      text: '留学服务',
      id: 'study-services',
      color: 'blue',
      children: [
        { icon: Users, text: '申请学生', id: 'students', color: 'blue' },
        { icon: History, text: '服务进度', id: 'service-chronology', color: 'blue' },
        { icon: Compass, text: '选校规划', id: 'school-selection-planner', color: 'blue' },
        { icon: BookOpen, text: '文书工作台', id: 'application-workbench', color: 'blue' },
        { icon: Globe2, text: '项目市场', id: 'project-marketplace', color: 'blue' },
        { icon: GraduationCap, text: '全球教授库', id: 'professor-directory', color: 'blue' },
        { icon: UserSquare2, text: '导师管理', id: 'mentors', color: 'blue' },
        { icon: UserSquare2, text: '导师（旧版）', id: 'mentors-legacy', color: 'blue' },
        { icon: ClipboardList, text: '留学案例库', id: 'cases', color: 'blue' },
      ],
    },
    {
      icon: GraduationCap,
      text: '教育培训',
      id: 'education-training',
      color: 'blue',
      children: [
        { icon: ClipboardList, text: '测评中心', id: 'education-training/placement-assessment', color: 'blue' },
        { icon: CalendarClock, text: '排课与教室', id: 'education-training/scheduling-classroom', color: 'blue' },
        { icon: Laptop, text: '学习中心', id: 'education-training/learner-portal', color: 'blue' },
        { icon: Users, text: '教师工作台', id: 'education-training/tutor-portal', color: 'blue' },
      ],
    },
    {
      icon: LayoutDashboard,
      text: 'CRM 中心',
      id: 'crm-center',
      color: 'blue',
      children: [
        { icon: BarChart3, text: '线索总览', id: 'crm-lead-overview', color: 'blue' },
        { icon: LayoutList, text: '线索列表', id: 'crm-lead-list', color: 'blue' },
        { icon: Headphones, text: '跟进记录', id: 'crm-engagement-desk', color: 'blue' },
        { icon: Handshake, text: '合同与签约', id: 'crm-contract-dock', color: 'blue' },
        { icon: PieChart, text: '客户分群', id: 'crm-client-insights', color: 'blue' },
        { icon: MessageCircle, text: '协同空间', id: 'crm-collaboration-hub', color: 'blue' },
      ],
    },
    {
      icon: Layers,
      text: '知识中心',
      id: 'knowledge-hub',
      color: 'blue',
      children: [
        { icon: LayoutDashboard, text: '知识概览', id: 'knowledge-hub/dashboard', color: 'blue' },
        { icon: UserRound, text: '个人空间', id: 'knowledge-hub/my-space', color: 'blue' },
        { icon: Users, text: '团队空间', id: 'knowledge-hub/team-space', color: 'blue' },
        { icon: LayoutGrid, text: '知识市场', id: 'knowledge-hub/market', color: 'blue' },
        { icon: Globe2, text: '知识花园运营', id: 'knowledge-hub/garden', color: 'blue' },
        { icon: ShieldCheck, text: '审核与风控', id: 'knowledge-hub/moderation', color: 'blue' },
        { icon: Settings, text: '知识设置', id: 'knowledge-hub/settings', color: 'blue' },
      ],
    },
    { icon: School, text: '院校库', id: 'school-library', color: 'blue' },
    { icon: BookOpen, text: '专业库', id: 'program-library', color: 'blue' },
    { icon: Brain, text: '智能选校', id: 'smart-selection', color: 'blue' },
    { icon: Briefcase, text: '服务项目', id: 'projects', color: 'blue' },
    { icon: FileCheck, text: '申请进度', id: 'applications', color: 'blue' },
    { icon: MessagesSquare, text: '客户线索', id: 'leads', color: 'blue' },
    { icon: Calendar, text: '会议管理', id: 'meetings', color: 'blue' },
    {
      icon: Globe2,
      text: 'SkyOffice',
      id: 'sky-office',
      color: 'blue',
      externalUrl: skyOfficeExternalUrl,
    },
    { icon: Library, text: '知识库', id: 'knowledge', color: 'blue' },
    { icon: FileText, text: '合同管理', id: 'contracts', color: 'blue' },
    { icon: PieChart, text: '财务中台', id: 'finance-suite', color: 'blue' },
    { icon: Wallet, text: '财务管理（旧版）', id: 'finance', color: 'gray' },
    { icon: Settings, text: '密码设置', id: 'settings', color: 'blue' },
    { icon: Globe2, text: '服务项目', id: 'services', color: 'blue' },
  ];

  const pinnedNavigationItems: NavigationItem[] = [
    { icon: Globe2, text: '服务中心', id: 'service-center', color: 'blue' },
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
    if (path.includes('study-services')) {
      setCurrentPage('study-services');
      setExpandedGroups((prev) => ({ ...prev, 'study-services': true }));
    } else if (path.includes('crm-lead-overview')) {
      setCurrentPage('crm-lead-overview');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('crm-lead-list')) {
      setCurrentPage('crm-lead-list');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('crm-engagement-desk')) {
      setCurrentPage('crm-engagement-desk');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('crm-contract-dock')) {
      setCurrentPage('crm-contract-dock');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('crm-client-insights')) {
      setCurrentPage('crm-client-insights');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('crm-collaboration-hub')) {
      setCurrentPage('crm-collaboration-hub');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('knowledge-hub/dashboard')) {
      setCurrentPage('knowledge-hub/dashboard');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('knowledge-hub/my-space')) {
      setCurrentPage('knowledge-hub/my-space');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('knowledge-hub/team-space')) {
      setCurrentPage('knowledge-hub/team-space');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('knowledge-hub/market')) {
      setCurrentPage('knowledge-hub/market');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('knowledge-hub/garden')) {
      setCurrentPage('knowledge-hub/garden');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('knowledge-hub/moderation')) {
      setCurrentPage('knowledge-hub/moderation');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('knowledge-hub/settings')) {
      setCurrentPage('knowledge-hub/settings');
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    } else if (path.includes('education-training/placement-assessment')) {
      setCurrentPage('education-training/placement-assessment');
      setExpandedGroups((prev) => ({ ...prev, 'education-training': true }));
    } else if (path.includes('education-training/scheduling-classroom')) {
      setCurrentPage('education-training/scheduling-classroom');
      setExpandedGroups((prev) => ({ ...prev, 'education-training': true }));
    } else if (path.includes('education-training/learner-portal')) {
      setCurrentPage('education-training/learner-portal');
      setExpandedGroups((prev) => ({ ...prev, 'education-training': true }));
    } else if (path.includes('education-training/tutor-portal')) {
      setCurrentPage('education-training/tutor-portal');
      setExpandedGroups((prev) => ({ ...prev, 'education-training': true }));
    } else if (path.includes('internal-management/employee-and-scheduling')) {
      setCurrentPage('internal-management/employee-and-scheduling');
      setExpandedGroups((prev) => ({ ...prev, 'internal-management': true }));
    } else if (path.includes('internal-management/onboarding')) {
      setCurrentPage('internal-management/onboarding');
      setExpandedGroups((prev) => ({ ...prev, 'internal-management': true }));
    } else if (path.includes('internal-management/system-settings')) {
      setCurrentPage('internal-management/system-settings');
      setExpandedGroups((prev) => ({ ...prev, 'internal-management': true }));
    } else if (path.includes('service-center')) {
      setCurrentPage('service-center');
    } else if (path.includes('dashboard')) {
      setCurrentPage('dashboard');
    } else if (path.includes('tasks')) {
      setCurrentPage('tasks');
    } else if (path.includes('team-chat')) {
      setCurrentPage('team-chat');
    } else if (path.includes('students-legacy')) {
      setCurrentPage('students-legacy');
    } else if (path.includes('students')) {
      setCurrentPage('students');
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
    } else if (path.includes('application-workbench')) {
      setCurrentPage('application-workbench');
    } else if (path.includes('project-mission-board')) {
      setCurrentPage('project-mission-board');
    } else if (path.includes('project-marketplace')) {
      setCurrentPage('project-marketplace');
    } else if (path.includes('professor-directory')) {
      setCurrentPage('professor-directory');
    } else if (path.includes('school-selection-planner')) {
      setCurrentPage('school-selection-planner');
    } else if (path.includes('service-chronology')) {
      setCurrentPage('service-chronology');
    } else if (path.includes('mentors-legacy')) {
      setCurrentPage('mentors-legacy');
    } else if (path.includes('leads')) {
      setCurrentPage('leads');
    } else if (path.includes('mentors')) {
      setCurrentPage('mentors');
    } else if (path.includes('sky-office')) {
      setCurrentPage('sky-office');
    } else if (path.includes('knowledge') && !path.includes('knowledge-hub')) {
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
    } else if (path.includes('finance-suite')) {
      setCurrentPage('finance-suite');
    } else if (path.includes('finance')) {
      setCurrentPage('finance');
    } else if (path.includes('services')) {
      setCurrentPage('services');
    } else if (path.includes('settings')) {
      setCurrentPage('settings');
    }

    if (
      [
        'students',
        'mentors',
        'school-selection-planner',
        'service-chronology',
        'application-workbench',
        'project-mission-board',
        'project-marketplace',
        'professor-directory',
        'mentors-legacy',
      ].some((segment) =>
        path.includes(segment)
      )
    ) {
      setExpandedGroups((prev) => ({ ...prev, 'study-services': true }));
    }

    if (['crm-lead-overview', 'crm-lead-list', 'crm-engagement-desk', 'crm-contract-dock', 'crm-client-insights', 'crm-collaboration-hub'].some((segment) => path.includes(segment))) {
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    }

    if (
      ['knowledge-hub/dashboard', 'knowledge-hub/my-space', 'knowledge-hub/team-space', 'knowledge-hub/market', 'knowledge-hub/garden', 'knowledge-hub/moderation', 'knowledge-hub/settings'].some((segment) =>
        path.includes(segment)
      )
    ) {
      setExpandedGroups((prev) => ({ ...prev, 'knowledge-hub': true }));
    }

    if (
      [
        'internal-management/employee-and-scheduling',
        'internal-management/system-settings',
      ].some((segment) => path.includes(segment))
    ) {
      setExpandedGroups((prev) => ({ ...prev, 'internal-management': true }));
    }

    if (
      ['education-training/placement-assessment', 'education-training/scheduling-classroom', 'education-training/learner-portal'].some((segment) =>
        path.includes(segment),
      )
    ) {
      setExpandedGroups((prev) => ({ ...prev, 'education-training': true }));
    }
  }, [location]);

  // 如果路径是 /login，不显示管理界面
  if (location.pathname === '/login') {
    return null;
  }

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? false),
    }));
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.externalUrl) {
      setCurrentPage(item.id);
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.children?.length && !isNavCollapsed) {
      setExpandedGroups((prev) => ({ ...prev, [item.id]: true }));
    }
    setCurrentPage(item.id);
    navigate(item.id === 'dashboard' ? '/admin/dashboard' : `/admin/${item.id}`);
  };

  const renderNavItems = (items: NavigationItem[], depth = 0) =>
    items.map((item) => {
      const isGroup = !!item.children?.length;
      const isExpanded = isGroup ? expandedGroups[item.id] ?? false : false;
      const isActive = currentPage === item.id;
      const isChildActive = isGroup && item.children!.some((child) => currentPage === child.id);
      const isTopLevel = depth === 0;
      const activeClass = (isActive || isChildActive)
        ? isTopLevel
          ? (colorMap[item.color] ?? colorMap.blue)
          : 'text-blue-600 dark:text-blue-300 font-medium'
        : isTopLevel
          ? 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
          : 'text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300';
      const accentClass = accentBarMap[item.color] ?? accentBarMap.blue;
      const iconClass = (isActive || isChildActive)
        ? isTopLevel
          ? (iconColorMap[item.color] ?? iconColorMap.blue)
          : 'text-blue-500 dark:text-blue-300'
        : 'text-gray-500 dark:text-gray-400';

      const baseClasses = ['relative', 'w-full', 'flex', 'items-center', 'py-2.5', 'rounded-xl', 'text-sm', 'transition-all', 'duration-200'];
      if (isNavCollapsed) {
        baseClasses.push('justify-center');
      } else {
        baseClasses.push('gap-3');
        baseClasses.push(depth > 0 ? 'pl-9 pr-4' : 'px-4');
      }

      return (
        <div key={item.id} className="w-full">
          <button
            onClick={() => handleNavigation(item)}
            className={`${baseClasses.join(' ')} ${activeClass}`}
            title={isNavCollapsed ? item.text : ''}
          >
            {isTopLevel && (isActive || isChildActive) && !isNavCollapsed && (
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full ${accentClass}`}></span>
            )}
            <item.icon className={`h-5 w-5 flex-shrink-0 ${iconClass}`} />
            {!isNavCollapsed && <span>{item.text}</span>}
            {isGroup && !isNavCollapsed && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(item.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleGroup(item.id);
                  }
                }}
                className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 cursor-pointer"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </span>
            )}
          </button>
          {isGroup && isExpanded && !isNavCollapsed && (
            <div className="mt-1 space-y-1">
              {renderNavItems(item.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });

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
              <header className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isNavCollapsed ? 'w-20' : 'w-50'} transition-all duration-300 bg-white/80 backdrop-blur-xl dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 z-10`}>
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
                    className="space-y-2 max-h-[calc(100vh-230px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                  >
                      {renderNavItems(navigationItems)}
                  </nav>

                  <div className={`mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700 ${isNavCollapsed ? 'px-1' : ''}`}>
                    {!isNavCollapsed && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        固定入口
                      </p>
                    )}
                    {renderNavItems(pinnedNavigationItems)}
                  </div>
                  
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
                        src={resolveAvatarUrl(currentUser)}
                        alt="User"
                        className="h-8 w-8 rounded-xl object-cover"
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).src = resolveAvatarUrl(null);
                        }}
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
              <main className={`${isNavCollapsed ? 'ml-20' : 'ml-48'} mt-16 transition-all duration-300 p-8`}>
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

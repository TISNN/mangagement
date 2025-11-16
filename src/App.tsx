import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { ComponentType } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Users,
  Users2,
  FileCheck,
  Settings,
  Bell,
  LayoutGrid,
  LayoutDashboard,
  Grid3x3,
  Sun,
  Moon,
  Briefcase,
  UserSquare2,
  // Library, // 已迁移到知识库中心，不再使用
  ClipboardList,
  ChevronLeft,
  History,
  LogOut,
  School,
  UserCog,
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
  Handshake,
  LayoutList,
  LayoutPanelLeft,
  PieChart,
  MessageCircle,
  Globe2,
  Home,
  HardDrive,
  BookMarked,
  Building2,
} from 'lucide-react';
import { DataProvider } from './context/DataContext'; // 导入数据上下文提供者
import AIChatAssistant from './components/AIChatAssistant';
import ErrorBoundary from './components/ErrorBoundary';
import './utils/cacheManager'; // 引入缓存管理器,使window.clearAppCache()可用
import { getDashboardActivities } from './pages/admin/Dashboard/services/dashboardService';
import type { DashboardActivity } from './pages/admin/Dashboard/types/dashboard.types';
import { getRouteFromNavId, isValidRoute } from './utils/routeValidator';

const APP_CENTER_STORAGE_KEY = 'appCenter.favoriteFeatureIds';

type NavigationItem = {
  icon: ComponentType<{ className?: string }>;
  text: string;
  id: string;
  color: string;
  children?: NavigationItem[];
  externalUrl?: string;
};

export type AppOutletContext = {
  favoriteFeatureIds: string[];
  setFavoriteFeatureIds: (ids: string[]) => void;
  maxFavorites: number;
  availableFeatures: AppFeature[];
  userRole: AppCenterUserRole;
};
import {
  APP_FEATURES,
  getDefaultFavorites,
  MAX_FAVORITES,
  type AppFeature,
  type AppCenterUserRole,
} from './data/appFeatures';
type NotificationItem = DashboardActivity & { read: boolean };

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [favoriteFeatureIds, setFavoriteFeatureIds] = useState<string[]>([]);
  const [hasInitializedFavorites, setHasInitializedFavorites] = useState(false);
  const [userRole, setUserRole] = useState<AppCenterUserRole>('admin');
  const [hasResolvedRole, setHasResolvedRole] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate(); // 添加导航函数
  
  // 已读通知的持久化存储键
  const READ_NOTIFICATIONS_KEY = 'readNotifications';
  
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
  const unreadNotificationCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );
  const hasUnreadNotifications = unreadNotificationCount > 0;

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

  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      { icon: LayoutGrid, text: '控制台', id: 'dashboard', color: 'blue' },
      { icon: ListTodo, text: '任务管理', id: 'tasks', color: 'blue' },
      { icon: Users, text: '学生管理', id: 'students-legacy', color: 'blue' },
      { icon: Calendar, text: '会议管理', id: 'meetings', color: 'blue' },
      { icon: Globe2, text: 'SkyOffice', id: 'sky-office', color: 'blue', externalUrl: skyOfficeExternalUrl },
      {
        icon: Globe2,
        text: '全球数据库',
        id: 'global-academic-resources',
        color: 'blue',
        children: [
          { icon: GraduationCap, text: '教授库', id: 'professor-directory', color: 'blue' },
          { icon: Globe2, text: '博士岗位库', id: 'phd-opportunities', color: 'blue' },
          { icon: School, text: '院校库', id: 'school-library', color: 'blue' },
          { icon: BookOpen, text: '专业库', id: 'program-library', color: 'blue' },
        ],
      },
      { icon: Handshake, text: '合作方管理', id: 'partner-management', color: 'blue' },
      {
        icon: UserCog,
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
            icon: Briefcase,
            text: '招聘中心',
            id: 'internal-management/recruitment',
            color: 'blue',
          },
          { icon: Briefcase, text: '服务项目', id: 'projects', color: 'blue' },
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
          { icon: Brain, text: '智能选校', id: 'smart-selection', color: 'blue' },
          { icon: BookOpen, text: '文书工作台', id: 'application-workbench', color: 'blue' },
          { icon: LayoutPanelLeft, text: '申请工作台', id: 'application-workstation', color: 'blue' },
          { icon: Globe2, text: '项目市场', id: 'project-marketplace', color: 'blue' },
          { icon: Building2, text: '机构介绍', id: 'institution-introduction', color: 'blue' },
          { icon: UserSquare2, text: '导师管理', id: 'mentors', color: 'blue' },
          { icon: UserSquare2, text: '导师（旧版）', id: 'mentors-legacy', color: 'blue' },
          { icon: ClipboardList, text: '留学案例库', id: 'cases', color: 'blue' },
          { icon: FileCheck, text: '申请进度', id: 'applications', color: 'blue' },

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
          { icon: LayoutList, text: '线索列表', id: 'crm-lead-list', color: 'blue' },
          { icon: Handshake, text: '合同与签约', id: 'crm-contract-dock', color: 'blue' },
          { icon: PieChart, text: '客户分群', id: 'crm-client-insights', color: 'blue' },
          { icon: MessageCircle, text: '协同空间', id: 'crm-collaboration-hub', color: 'blue' },
        ],
      },
      {
        icon: HardDrive,
        text: '云文档',
        id: 'cloud-docs',
        color: 'blue',
        children: [
          { icon: Home, text: '主页', id: 'cloud-docs/home', color: 'blue' },
          { icon: HardDrive, text: '云盘', id: 'cloud-docs/drive', color: 'blue' },
          { icon: BookMarked, text: '知识库', id: 'cloud-docs/knowledge', color: 'blue' },
        ],
      },
      { icon: LayoutGrid, text: '知识花园', id: 'knowledge-hub/market', color: 'blue' },
      // { icon: Library, text: '知识库', id: 'knowledge', color: 'blue' }, // 已迁移到知识库中心 (cloud-docs/knowledge)
      { icon: PieChart, text: '财务中台', id: 'finance-suite', color: 'blue' },
      { icon: Settings, text: '系统设置', id: 'settings', color: 'blue' },
    ],
    [skyOfficeExternalUrl],
  );

  const pinnedNavigationItems = useMemo<NavigationItem[]>(
    () => [
      // { icon: Globe2, text: '服务中心', id: 'service-center', color: 'blue' },
      { icon: Globe2, text: '服务项目', id: 'services', color: 'blue' },
      { icon: Grid3x3, text: '应用中心', id: 'app-center', color: 'purple' },
    ],
    [],
  );

  const allowedFeatures = useMemo(
    () =>
      APP_FEATURES.filter(
        (feature) => feature.rolesAllowed.includes(userRole) || feature.rolesAllowed.includes('guest'),
      ),
    [userRole],
  );

  const allowedFeatureIdSet = useMemo(() => new Set(allowedFeatures.map((feature) => feature.id)), [allowedFeatures]);

  const navigationLookup = useMemo(() => {
    const map = new Map<string, NavigationItem>();
    const traverse = (items: NavigationItem[]) => {
      items.forEach((item) => {
        map.set(item.id, item);
        if (item.children?.length) {
          traverse(item.children);
        }
      });
    };
    traverse(navigationItems);
    traverse(pinnedNavigationItems);
    return map;
  }, [navigationItems, pinnedNavigationItems]);

  const favoriteNavItems = useMemo(
    () =>
      favoriteFeatureIds
        .map((id) => navigationLookup.get(id))
        .filter((item): item is NavigationItem => Boolean(item))
        .map((item) => ({ ...item })),
    [favoriteFeatureIds, navigationLookup],
  );
  
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
      setUserRole('admin');
      const employeeData = localStorage.getItem('currentEmployee');
      if (employeeData) {
        setCurrentUser(JSON.parse(employeeData));
      }
    } else if (userType === 'student') {
      setUserRole('student');
      const studentData = localStorage.getItem('currentStudent');
      if (studentData) {
        setCurrentUser(JSON.parse(studentData));
      }
    } else {
      setUserRole('admin');
    }
    setHasResolvedRole(true);
  }, []);

  useEffect(() => {
    if (hasInitializedFavorites || !hasResolvedRole) {
      return;
    }
    try {
      const stored = localStorage.getItem(APP_CENTER_STORAGE_KEY);
      let initialIds: unknown = null;
      if (stored) {
        initialIds = JSON.parse(stored);
      }

      const candidateIds = Array.isArray(initialIds)
        ? (initialIds.filter((id): id is string => typeof id === 'string') as string[])
        : getDefaultFavorites(userRole);

      const sanitized = candidateIds.filter((id) => allowedFeatureIdSet.has(id)).slice(0, MAX_FAVORITES);
      setFavoriteFeatureIds(sanitized);
    } catch (error) {
      console.error('加载导航偏好失败，将使用默认配置', error);
      const fallback = getDefaultFavorites(userRole).filter((id) => allowedFeatureIdSet.has(id)).slice(0, MAX_FAVORITES);
      setFavoriteFeatureIds(fallback);
    } finally {
      setHasInitializedFavorites(true);
    }
  }, [allowedFeatureIdSet, hasInitializedFavorites, hasResolvedRole, userRole]);

  useEffect(() => {
    if (!hasInitializedFavorites) {
      return;
    }
    localStorage.setItem(APP_CENTER_STORAGE_KEY, JSON.stringify(favoriteFeatureIds));
  }, [favoriteFeatureIds, hasInitializedFavorites]);

  useEffect(() => {
    if (!hasInitializedFavorites || !hasResolvedRole) {
      return;
    }
    const filtered = favoriteFeatureIds.filter((id) => allowedFeatureIdSet.has(id));
    if (filtered.length !== favoriteFeatureIds.length) {
      setFavoriteFeatureIds(filtered);
    }
  }, [allowedFeatureIdSet, favoriteFeatureIds, hasInitializedFavorites, hasResolvedRole]);

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
    } else if (path.includes('crm-lead-list')) {
      setCurrentPage('crm-lead-list');
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    } else if (path.includes('crm-template-library')) {
      setCurrentPage('crm-template-library');
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
    } else if (path.includes('knowledge-hub/market')) {
      setCurrentPage('knowledge-hub/market');
    } else if (path.includes('cloud-docs/home')) {
      setCurrentPage('cloud-docs/home');
      setExpandedGroups((prev) => ({ ...prev, 'cloud-docs': true }));
    } else if (path.includes('cloud-docs/drive')) {
      setCurrentPage('cloud-docs/drive');
      setExpandedGroups((prev) => ({ ...prev, 'cloud-docs': true }));
    } else if (path.includes('cloud-docs/knowledge')) {
      setCurrentPage('cloud-docs/knowledge');
      setExpandedGroups((prev) => ({ ...prev, 'cloud-docs': true }));
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
    } else if (path.includes('internal-management/recruitment')) {
      setCurrentPage('internal-management/recruitment');
      setExpandedGroups((prev) => ({ ...prev, 'internal-management': true }));
    } else if (path.includes('app-center')) {
      setCurrentPage('app-center');
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
    } else if (path.includes('phd-opportunities')) {
      setCurrentPage('phd-opportunities');
    } else if (path.includes('partner-management')) {
      setCurrentPage('partner-management');
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
    } else if (path.includes('knowledge') && !path.includes('knowledge-hub') && !path.includes('cloud-docs')) {
      // 旧的知识库路径已重定向到 cloud-docs/knowledge
      setCurrentPage('cloud-docs/knowledge');
    } else if (path.includes('interview')) {
      setCurrentPage('interview');
    } else if (path.includes('cases')) {
      setCurrentPage('cases');
    } else if (path.includes('social')) {
      setCurrentPage('social');
    } else if (path.includes('aiModel')) {
      setCurrentPage('aiModel');
    } else if (path.includes('finance-suite')) {
      setCurrentPage('finance-suite');
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
        'phd-opportunities',
        'mentors-legacy',
      ].some((segment) =>
        path.includes(segment)
      )
    ) {
      setExpandedGroups((prev) => ({ ...prev, 'study-services': true }));
    }

    if (['crm-lead-list', 'crm-template-library', 'crm-contract-dock', 'crm-client-insights', 'crm-collaboration-hub'].some((segment) => path.includes(segment))) {
      setExpandedGroups((prev) => ({ ...prev, 'crm-center': true }));
    }

    // 知识花园作为独立主页面，不再需要展开组逻辑

    if (['cloud-docs/home', 'cloud-docs/drive', 'cloud-docs/knowledge'].some((segment) => path.includes(segment))) {
      setExpandedGroups((prev) => ({ ...prev, 'cloud-docs': true }));
    }

    if (
      ['internal-management/employee-and-scheduling', 'internal-management/recruitment'].some((segment) =>
        path.includes(segment)
      )
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

  // 从 localStorage 加载已读通知ID集合
  const getReadNotificationIds = useCallback((): Set<string> => {
    try {
      const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        return new Set(ids);
      }
    } catch (error) {
      console.error('读取已读通知状态失败:', error);
    }
    return new Set<string>();
  }, []);

  // 保存已读通知ID到 localStorage
  const saveReadNotificationIds = useCallback((readIds: Set<string>) => {
    try {
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(readIds)));
    } catch (error) {
      console.error('保存已读通知状态失败:', error);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setNotificationsLoading(true);
      const latestActivities = await getDashboardActivities(6);
      const readIds = getReadNotificationIds();
      setNotifications((prev) => {
        // 保留之前的已读状态，同时从 localStorage 恢复已读状态
        const readStateMap = prev.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.id] = item.read;
          return acc;
        }, {});
        return latestActivities.map((activity) => ({
          ...activity,
          // 优先使用 localStorage 中的已读状态，如果没有则使用之前的已读状态
          read: readIds.has(activity.id) || readStateMap[activity.id] || false,
        }));
      });
    } catch (error) {
      console.error('加载通知失败:', error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [getReadNotificationIds]);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      // 合并现有的已读通知ID和当前通知列表中的所有ID
      const readIds = getReadNotificationIds();
      prev.forEach((item) => readIds.add(item.id));
      saveReadNotificationIds(readIds);
      return updated;
    });
  }, [getReadNotificationIds, saveReadNotificationIds]);

  const toggleNotificationsPanel = () => {
    setShowNotificationsPanel((prev) => !prev);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === item.id ? { ...notification, read: true } : notification,
      );
      // 保存已读状态到 localStorage
      const readIds = getReadNotificationIds();
      readIds.add(item.id);
      saveReadNotificationIds(readIds);
      return updated;
    });
    setShowNotificationsPanel(false);
    if (item.detailPath) {
      navigate(item.detailPath);
    } else {
      navigate(`/admin/dashboard#activity-${item.id}`);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showNotificationsPanel) return;
      const target = event.target as Node;
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(target)
      ) {
        setShowNotificationsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotificationsPanel]);

  // 移除自动标记所有通知为已读的逻辑
  // 只有当用户点击"全部已读"按钮或点击单个通知时，才标记为已读
  // 这样用户可以真正查看通知内容后再决定是否标记为已读

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
    
    // 检查路由是否存在
    const targetRoute = getRouteFromNavId(item.id);
    if (!targetRoute || !isValidRoute(targetRoute)) {
      // 如果路由不存在，阻止跳转并显示提示
      console.warn(`路由不存在: ${item.id}，无法跳转`);
      // 可以选择显示一个提示消息，但不跳转
      return;
    }
    
    if (item.children?.length && !isNavCollapsed) {
      setExpandedGroups((prev) => ({ ...prev, [item.id]: true }));
    }
    setCurrentPage(item.id);
    navigate(targetRoute);
  };

  const renderNavItems = (items: NavigationItem[], depth = 0, keyPrefix = '') =>
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
        <div key={`${keyPrefix}${item.id}`} className="w-full">
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
              {renderNavItems(item.children!, depth + 1, `${keyPrefix}${item.id}-`)}
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
              <header className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isNavCollapsed ? 'w-20' : 'w-[232px]'} transition-all duration-300 bg-white/80 backdrop-blur-xl dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 z-10`}>
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
                    className="space-y-6 max-h-[calc(100vh-230px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                  >
                    <div className="space-y-2">
                      {!isNavCollapsed && (
                        <div className="flex items-center justify-between px-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            我的导航
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate('/admin/app-center')}
                            className="text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            管理
                          </button>
                        </div>
                      )}
                      {favoriteNavItems.length > 0 ? (
                        <div className="space-y-2">
                          {renderNavItems(favoriteNavItems, 0, 'favorite-')}
                        </div>
                      ) : (
                        !isNavCollapsed && (
                          <div className="rounded-xl border border-dashed border-gray-200 bg-white/40 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
                            暂未添加常用功能，点击“管理”挑选常用入口
                          </div>
                        )
                      )}
                    </div>

                    <div className="space-y-2">
                      {!isNavCollapsed && (
                        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          全部功能
                        </p>
                      )}
                      {renderNavItems(navigationItems, 0, 'all-')}
                    </div>
                  </nav>

                  <div className={`mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700 ${isNavCollapsed ? 'px-1' : ''}`}>
                    {renderNavItems(pinnedNavigationItems, 0, 'pinned-')}
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
                    <div className="relative">
                      <button
                        ref={notificationButtonRef}
                        onClick={toggleNotificationsPanel}
                        className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
                        aria-label="通知中心"
                      >
                        <Bell className="h-5 w-5" />
                        {hasUnreadNotifications && (
                          <span className="absolute top-0 right-0 inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                          </span>
                        )}
                      </button>

                      {showNotificationsPanel && (
                        <div
                          ref={notificationPanelRef}
                          className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">通知中心</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">最近 6 条提醒</p>
                            </div>
                            <button
                              onClick={markAllNotificationsAsRead}
                              className="text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                            >
                              全部已读
                            </button>
                          </div>
                          <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-2">
                            {notificationsLoading ? (
                              Array.from({ length: 3 }).map((_, idx) => (
                                <div key={`notification-skeleton-${idx}`} className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700/60 dark:bg-gray-700/40">
                                  <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-600"></div>
                                  <div className="mt-2 h-3 w-48 rounded bg-gray-200 dark:bg-gray-600"></div>
                                </div>
                              ))
                            ) : notifications.length === 0 ? (
                              <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                暂无新的提醒
                              </div>
                            ) : (
                              notifications.map((item) => {
                                const badgeConfig =
                                  item.type === 'employee'
                                    ? { label: '团队', className: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-200' }
                                    : item.type === 'system'
                                      ? { label: '系统', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300' }
                                      : { label: '学生', className: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-200' };

                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => handleNotificationClick(item)}
                                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                                      item.read
                                        ? 'border-gray-100 dark:border-gray-700'
                                        : 'border-indigo-100 bg-indigo-50/60 dark:border-indigo-500/40 dark:bg-indigo-500/10'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeConfig.className}`}>
                                            {badgeConfig.label}
                                          </span>
                                          <p className="text-gray-900 dark:text-white font-medium truncate">
                                            {item.user} {item.action}
                                          </p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.content}</p>
                                      </div>
                                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                        {item.time}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-right dark:border-gray-700 dark:bg-gray-900/40">
                            <button
                              onClick={() => {
                                setShowNotificationsPanel(false);
                                navigate('/admin/dashboard');
                              }}
                              className="text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                            >
                              查看最新动态
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
              <main className={`${isNavCollapsed ? 'ml-20' : 'ml-[232px]'} mt-16 transition-all duration-300 p-8`}>
                <Outlet
                  context={{
                    favoriteFeatureIds,
                    setFavoriteFeatureIds,
                    maxFavorites: MAX_FAVORITES,
                    availableFeatures: allowedFeatures,
                    userRole,
                  }}
                />
              </main>

              {/* AI助手 */}
              <AIChatAssistant />
            </div>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;

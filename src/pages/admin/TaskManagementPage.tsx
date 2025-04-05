import React, { useState } from 'react';
import { 
  Search, 
  Edit, 
  Plus, 
  CheckCircle2,
  Circle, 
  Clock, 
  Filter, 
  CalendarDays, 
  CalendarRange, 
  Calendar, 
  ArrowRight, 
  X, 
  FileText, 
  CheckSquare, 
  XSquare, 
  Activity, 
  AlertCircle, 
  ListFilter, 
  ChevronLeft,
  Trash2, 
  Square
} from 'lucide-react';

// 任务类型定义
interface Task {
  id: string;
  title: string;
  description: string;
  // 修改为多负责人结构
  assignees: {
    id: string;
    name: string;
    avatar: string;
    role: string; // 在任务中的角色/职责
  }[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'canceled';
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// 员工接口定义
interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
}

const TaskManagementPage: React.FC = () => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'day' | 'week' | 'month'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeView, setTimeView] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'expired'>('all');
  const [quickTask, setQuickTask] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 新增模态框状态
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // 添加负责人任务视图状态
  const [isAssigneeTasksOpen, setIsAssigneeTasksOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<{name: string, avatar: string, id?: string} | null>(null);
  
  // 新任务表单状态
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    assignees: {
      id: string;
      name: string;
      avatar: string;
      role: string; // 在任务中的角色/职责
    }[];
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags: string;
  }>({
    title: '',
    description: '',
    assignees: [],
    dueDate: new Date().toISOString().split('T')[0], // 这将自动使用当前日期
    priority: 'medium',
    tags: ''
  });

  // 模拟任务数据
  const tasks: Task[] = [
    {
      id: '1',
      title: '完成留学申请材料审核',
      description: '审核王同学的哈佛大学申请材料，确保所有文档齐全并符合要求',
      assignees: [
        {
          id: '1',
          name: '李志强',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          role: '总审核' 
        },
        {
          id: '2',
          name: '王文静',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          role: '文书审核'
        }
      ],
      dueDate: '2025-04-10',
      priority: 'high',
      status: 'in_progress',
      tags: ['申请材料', '文书', '审核'],
      progress: 60,
      createdAt: '2025-03-25',
      updatedAt: '2025-04-02'
    },
    {
      id: '2',
      title: '组织英国大学申请讲座',
      description: '准备并组织关于英国顶尖大学申请流程的线上讲座',
      assignees: [
        {
          id: '2',
          name: '王文静',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          role: '主讲' 
        }
      ],
      dueDate: '2025-04-15',
      priority: 'medium',
      status: 'pending',
      tags: ['讲座', '英国', '市场推广'],
      progress: 30,
      createdAt: '2025-03-28',
      updatedAt: '2025-04-01'
    },
    {
      id: '3',
      title: '更新德国大学申请指南',
      description: '更新公司的德国大学申请指南，包括最新的申请要求和截止日期',
      assignees: [
        {
          id: '3',
          name: '张德国',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          role: '内容编写'
        }
      ],
      dueDate: '2025-04-05',
      priority: 'medium',
      status: 'completed',
      tags: ['内容更新', '德国', '申请指南'],
      progress: 100,
      createdAt: '2025-03-20',
      updatedAt: '2025-04-03'
    },
    {
      id: '4',
      title: '重庆地区市场拓展计划',
      description: '制定重庆地区的市场拓展计划，包括目标学校和招生策略',
      assignees: [
        {
          id: '4',
          name: '陈明月',
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          role: '负责人'
        },
        {
          id: '5',
          name: '张三',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: '数据分析'
        }
      ],
      dueDate: '2025-04-20',
      priority: 'high',
      status: 'review',
      tags: ['市场拓展', '重庆', '战略'],
      progress: 85,
      createdAt: '2025-03-15',
      updatedAt: '2025-04-01'
    },
    {
      id: '5',
      title: '优化公司网站用户体验',
      description: '优化公司网站的用户体验，提高页面加载速度和响应性',
      assignees: [
        {
          id: '5',
          name: '张三',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: '前端开发'
        },
        {
          id: '7',
          name: '王五',
          avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
          role: '后端开发'
        },
        {
          id: '8',
          name: '赵六',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          role: 'UI设计'
        }
      ],
      dueDate: '2025-04-25',
      priority: 'low',
      status: 'in_progress',
      tags: ['网站', '技术', '用户体验'],
      progress: 40,
      createdAt: '2025-03-20',
      updatedAt: '2025-04-02'
    },
    {
      id: '6',
      title: '准备5月留学市场分析报告',
      description: '收集和分析5月份留学市场数据，准备市场分析报告',
      assignees: [
        {
          id: '6',
          name: '李四',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
          role: '数据分析'
        }
      ],
      dueDate: '2025-05-05',
      priority: 'medium',
      status: 'pending',
      tags: ['市场分析', '报告', '数据'],
      progress: 15,
      createdAt: '2025-04-01',
      updatedAt: '2025-04-02'
    },
    {
      id: '7',
      title: '开发学生跟踪系统',
      description: '开发新的学生申请跟踪系统，提高内部工作效率',
      assignees: [
        {
          id: '7',
          name: '王五',
          avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
          role: '开发负责人'
        },
        {
          id: '5',
          name: '张三',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: '前端支持'
        }
      ],
      dueDate: '2025-05-10',
      priority: 'urgent',
      status: 'in_progress',
      tags: ['系统开发', '技术', '内部工具'],
      progress: 55,
      createdAt: '2025-03-15',
      updatedAt: '2025-04-01'
    },
    {
      id: '8',
      title: '设计新的宣传材料',
      description: '为公司设计新的宣传册和海报，突出留学服务优势',
      assignees: [
        {
          id: '8',
          name: '赵六',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          role: '设计负责人'
        }
      ],
      dueDate: '2025-05-15',
      priority: 'low',
      status: 'canceled',
      tags: ['设计', '宣传', '市场推广'],
      progress: 0,
      createdAt: '2025-03-25',
      updatedAt: '2025-03-30'
    }
  ];

  // 模拟员工数据
  const employees: Employee[] = [
    { id: '1', name: '李志强', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', role: 'CEO', department: '管理层' },
    { id: '2', name: '王文静', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', role: 'COO', department: '管理层' },
    { id: '3', name: '张德国', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', role: '国际业务总监', department: '国际部' },
    { id: '4', name: '陈明月', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', role: '西南区域总监', department: '区域管理' },
    { id: '5', name: '张三', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: '前端开发工程师', department: '研发部' },
    { id: '6', name: '李四', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', role: '产品经理', department: '市场部' },
    { id: '7', name: '王五', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', role: '后端开发工程师', department: '研发部' },
    { id: '8', name: '赵六', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', role: 'UI设计师', department: '设计部' }
  ];

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesPriority = filterPriority ? task.priority === filterPriority : true;
    const matchesAssignee = filterAssignee ? task.assignees.some(assignee => assignee.id === filterAssignee) : true;
    const matchesTag = filterTag ? task.tags.includes(filterTag) : true;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesTag;
  });

  // 获取优先级标签样式
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'medium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // 获取优先级文字
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      case 'urgent':
        return '紧急';
      default:
        return '未设置';
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'review':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'canceled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'canceled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // 标签颜色映射
  const getTagStyle = (tag: string) => {
    const tagColorMap: Record<string, string> = {
      // 申请材料相关
      '申请材料': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      '材料': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      '推荐信': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      '成绩单': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      
      // 文书相关
      '文书': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'PS': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'SOP': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      '个人陈述': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      
      // 考试相关
      '考试': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'TOEFL': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'IELTS': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'GRE': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'GMAT': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      
      // 学校相关
      '学校': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      '选校': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      '大学': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      '申请': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      
      // 系统开发相关
      '系统开发': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      '技术': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      '内部工具': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      '网站': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      '用户体验': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      
      // 市场营销相关
      '市场分析': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
      '报告': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
      '数据': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
      '市场拓展': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
      '市场推广': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
      '宣传': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
      
      // 地区相关
      '重庆': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      '北京': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      '上海': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      '广州': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      '深圳': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      
      // 设计相关
      '设计': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
      'UI设计': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
      
      // 战略相关
      '战略': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
      '合作': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
      
      // 默认颜色
      '默认': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    
    return tagColorMap[tag] || tagColorMap['默认'];
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'in_progress':
        return '进行中';
      case 'review':
        return '审核中';
      case 'completed':
        return '已完成';
      case 'canceled':
        return '已取消';
      default:
        return '未知状态';
    }
  };

  // 计算截止日期倒计时
  const getDateInfo = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `逾期${Math.abs(diffDays)}天`, class: 'text-red-500' };
    } else if (diffDays === 0) {
      return { text: '今日截止', class: 'text-yellow-500' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays}天后截止`, class: 'text-yellow-500' };
    } else {
      return { text: `${diffDays}天后截止`, class: 'text-gray-500' };
    }
  };

  // 切换视图模式
  const handleViewChange = (mode: 'list' | 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  // 获取视图图标
  const getViewIcon = (mode: 'list' | 'day' | 'week' | 'month') => {
    switch (mode) {
      case 'day':
        return <CalendarDays className="h-4 w-4" />;
      case 'week':
        return <CalendarRange className="h-4 w-4" />;
      case 'month':
        return <Calendar className="h-4 w-4" />;
      case 'list':
      default:
        return <ListFilter className="h-4 w-4" />;
    }
  };

  // 处理日期导航
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'day') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    } else if (viewMode === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else if (viewMode === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    }
    
    setCurrentDate(newDate);
  };

  // 格式化日期
  const formatDate = (date: Date, format: 'short' | 'full' = 'full') => {
    if (format === 'short') {
      return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    }
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 获取当月天数数组（月视图用）
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // 获取当月1号是星期几
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // 创建一个包含当月所有天数的数组，前面填充0表示上个月的天数
    const daysArray: number[] = [];
    
    // 添加前导空白(0)
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(0);
    }
    
    // 添加当月天数
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    
    // 如果总数不是7的倍数，添加后续空白
    const remainingDays = (7 - (daysArray.length % 7)) % 7;
    for (let i = 0; i < remainingDays; i++) {
      daysArray.push(0);
    }
    
    return daysArray;
  };

  // 添加任务状态更新函数
  const handleToggleTaskStatus = (taskId: string) => {
    // 在实际应用中，这里应该调用API来更新任务状态
    // 这里我们只是更新本地状态用于演示
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
        const newProgress = newStatus === 'completed' ? 100 : task.progress;
        return { ...task, status: newStatus, progress: newProgress };
      }
      return task;
    });
    
    // 在实际应用中这里会调用setState来更新任务列表
    // 由于我们使用的是模拟数据，这里只是console.log一下结果
    console.log('任务状态已更新:', updatedTasks.find(t => t.id === taskId));
    alert(`任务 "${tasks.find(t => t.id === taskId)?.title}" 状态已切换`);
  };

  // 处理打开任务详情
  const handleOpenTaskDetail = (task: Task) => {
    setCurrentTask(task);
    setIsTaskDetailOpen(true);
  };

  // 处理打开编辑任务
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignees: task.assignees,
      dueDate: task.dueDate,
      priority: task.priority,
      tags: task.tags.join(', ')
    });
    setIsEditTaskModalOpen(true);
  };

  // 处理打开删除确认
  const handleDeleteTask = (task: Task) => {
    setCurrentTask(task);
    setIsDeleteConfirmOpen(true);
  };

  // 处理新建任务提交
  const handleSubmitNewTask = () => {
    // 这里应该调用API来创建新任务
    // 在真实应用中，这部分逻辑会与后端交互
    console.log('提交新任务:', newTask);
    alert('新任务创建功能尚未与后端集成，但表单数据已记录到控制台。');
    
    // 清空表单并关闭模态框
    setNewTask({
      title: '',
      description: '',
      assignees: [],
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      tags: ''
    });
    setIsNewTaskModalOpen(false);
  };

  // 处理编辑任务提交
  const handleSubmitEditTask = () => {
    if (!currentTask) return;
    
    // 这里应该调用API来更新任务
    console.log('更新任务:', currentTask.id, newTask);
    alert(`任务 "${currentTask.title}" 更新功能尚未与后端集成，但表单数据已记录到控制台。`);
    
    setIsEditTaskModalOpen(false);
  };
  
  // 处理确认删除任务
  const handleConfirmDelete = () => {
    if (!currentTask) return;
    
    // 这里应该调用API来删除任务
    console.log('删除任务:', currentTask.id);
    alert(`任务 "${currentTask.title}" 删除功能尚未与后端集成。`);
    
    setIsDeleteConfirmOpen(false);
  };

  // 处理点击负责人
  function handleAssigneeClick(name: string, avatar: string, id?: string) {
    setSelectedAssignee({
      id: id || name, // 如果没有提供id，使用name作为id
      name,
      avatar
    });
    setIsAssigneeTasksOpen(true);
  }

  // 获取指定负责人的任务
  const getAssigneeTasks = (name: string) => {
    return tasks.filter(task => task.assignees.some(assignee => assignee.name === name));
  };

  // 根据时间视图过滤任务
  const getTimeFilteredTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    switch (timeView) {
      case 'today':
        return filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      case 'tomorrow':
        return filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === tomorrow.getTime();
        });
      case 'week':
        return filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today && dueDate < nextWeek;
        });
      case 'expired':
        return filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today && task.status !== 'completed' && task.status !== 'canceled';
        });
      default:
        return filteredTasks;
    }
  };

  // 快速添加任务
  const handleQuickAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickTask.trim() !== '') {
      const newTaskObj = {
        id: `${tasks.length + 1}`,
        title: quickTask,
        description: '',
        assignees: [],
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        status: 'pending' as 'pending' | 'in_progress' | 'review' | 'completed' | 'canceled',
        tags: [],
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 在实际应用中，这里应该调用API保存任务
      console.log('添加新任务:', newTaskObj);
      alert(`快速添加任务: ${quickTask}`);
      setQuickTask('');
    }
  };

  // 顺延过期任务
  const handleDeferTask = (taskId: string, days: number = 1) => {
    // 在实际应用中，这里应该调用API更新任务
    console.log(`将任务 ${taskId} 顺延 ${days} 天`);
    alert(`任务已顺延 ${days} 天`);
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setFilterTag(tag);
    // 如果在侧边栏，自动将视图切换到列表视图以显示筛选结果
    if (viewMode !== 'list') {
      setViewMode('list');
    }
  };

  return (
    <div className="flex h-full">
      {/* 左侧导航 */}
      <div 
        className={`${isSidebarCollapsed ? 'w-18' : 'w-64'} transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col relative overflow-hidden`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-lg font-semibold text-gray-700 dark:text-gray-200 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-300`}>任务管理</h2>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isSidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"}
          >
            <ChevronLeft className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* 时间分类导航 */}
        <div className="px-4 py-2">
          <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isSidebarCollapsed ? 'opacity-0 h-0' : 'opacity-100'} transition-all duration-300`}>时间视图</h3>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setTimeView('all')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  timeView === 'all' 
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="所有任务"
              >
                <ListFilter className="h-4 w-4 min-w-[1rem]" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>所有</span>
                {!isSidebarCollapsed && (
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {filteredTasks.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTimeView('today')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  timeView === 'today' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="今天任务"
              >
                <ArrowRight className="h-4 w-4 min-w-[1rem]" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>今天</span>
                {!isSidebarCollapsed && (
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {filteredTasks.filter(task => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const dueDate = new Date(task.dueDate);
                      dueDate.setHours(0, 0, 0, 0);
                      return dueDate.getTime() === today.getTime();
                    }).length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTimeView('tomorrow')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  timeView === 'tomorrow' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="明天任务"
              >
                <ArrowRight className="h-4 w-4 min-w-[1rem]" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>明天</span>
                {!isSidebarCollapsed && (
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {filteredTasks.filter(task => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const dueDate = new Date(task.dueDate);
                      dueDate.setHours(0, 0, 0, 0);
                      return dueDate.getTime() === tomorrow.getTime();
                    }).length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTimeView('week')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  timeView === 'week' 
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="最近7天任务"
              >
                <CalendarDays className="h-4 w-4 min-w-[1rem]" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>最近7天</span>
                {!isSidebarCollapsed && (
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {filteredTasks.filter(task => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const nextWeek = new Date(today);
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      const dueDate = new Date(task.dueDate);
                      dueDate.setHours(0, 0, 0, 0);
                      return dueDate >= today && dueDate < nextWeek;
                    }).length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTimeView('expired')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  timeView === 'expired' 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="已过期任务"
              >
                <AlertCircle className="h-4 w-4 min-w-[1rem]" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>已过期</span>
                {!isSidebarCollapsed && (
                  <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {filteredTasks.filter(task => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const dueDate = new Date(task.dueDate);
                      dueDate.setHours(0, 0, 0, 0);
                      return dueDate < today && task.status !== 'completed' && task.status !== 'canceled';
                    }).length}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>

        {/* 状态过滤器 - 处理折叠状态 */}
        <div className="px-4 py-2 mt-4">
          <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isSidebarCollapsed ? 'opacity-0 h-0' : 'opacity-100'} transition-all duration-300`}>任务状态</h3>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setFilterStatus(null)}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  filterStatus === null 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="全部状态"
              >
                <ListFilter className="h-4 w-4 min-w-[1rem]" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>全部状态</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setFilterStatus('pending')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  filterStatus === 'pending' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="待处理"
              >
                <Clock className="h-4 w-4 min-w-[1rem] text-yellow-500" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>待处理</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setFilterStatus('in_progress')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  filterStatus === 'in_progress' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="进行中"
              >
                <Activity className="h-4 w-4 min-w-[1rem] text-blue-500" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>进行中</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setFilterStatus('completed')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  filterStatus === 'completed' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="已完成"
              >
                <CheckSquare className="h-4 w-4 min-w-[1rem] text-green-500" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>已完成</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setFilterStatus('canceled')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  filterStatus === 'canceled' 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="已放弃"
              >
                <XSquare className="h-4 w-4 min-w-[1rem] text-red-500" />
                <span className={`ml-2 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-all duration-300`}>已放弃</span>
              </button>
            </li>
          </ul>
        </div>

        {/* 标签系统 - 处理折叠状态 */}
        <div className={`px-4 py-2 mt-4 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">任务标签</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {Array.from(new Set(tasks.flatMap(task => task.tags))).map((tag, index) => (
              <button 
                key={index}
                onClick={() => handleTagClick(tag)}
                className={`px-2 py-1 rounded-full text-xs ${getTagStyle(tag)} ${
                  filterTag === tag ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-purple-400' : ''
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {filterTag && (
            <button 
              onClick={() => setFilterTag(null)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-1 flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              清除标签筛选
            </button>
          )}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部操作栏 */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {timeView === 'all' ? '所有任务' : 
               timeView === 'today' ? '今日任务' : 
               timeView === 'tomorrow' ? '明日任务' : 
               timeView === 'week' ? '最近7天任务' : '已过期任务'}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => handleViewChange('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <ListFilter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => handleViewChange('day')}
                  className={`p-1.5 rounded ${
                    viewMode === 'day'
                      ? 'bg-white dark:bg-gray-600 shadow'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <CalendarDays className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => handleViewChange('week')}
                  className={`p-1.5 rounded ${
                    viewMode === 'week'
                      ? 'bg-white dark:bg-gray-600 shadow'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <CalendarRange className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => handleViewChange('month')}
                  className={`p-1.5 rounded ${
                    viewMode === 'month'
                      ? 'bg-white dark:bg-gray-600 shadow'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="p-2 bg-purple-600 dark:bg-purple-700 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 快速添加任务输入框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="快速添加任务到收集箱..."
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              onKeyDown={handleQuickAddTask}
              className="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {quickTask && (
              <button 
                onClick={() => setQuickTask('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* 搜索和筛选 */}
          {isFilterOpen && (
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索任务..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterPriority || ''}
                  onChange={e => setFilterPriority(e.target.value || null)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">全部优先级</option>
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="urgent">紧急</option>
                </select>
                <select
                  value={filterAssignee || ''}
                  onChange={e => setFilterAssignee(e.target.value || null)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">全部负责人</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 主视图内容 */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
          {/* 标签筛选状态提示 */}
          {filterTag && (
            <div className="mb-4 flex items-center bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
              <div className="flex-1">
                <span className="font-medium text-purple-700 dark:text-purple-300">按标签筛选: </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getTagStyle(filterTag)}`}>
                  {filterTag}
                </span>
              </div>
              <button 
                onClick={() => setFilterTag(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* 已过期任务组 */}
          {timeView === 'expired' && getTimeFilteredTasks().length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium flex items-center text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 mr-2" />
                  已过期 ({getTimeFilteredTasks().length})
                </h3>
                <button 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    // 批量顺延所有过期任务
                    alert('所有过期任务已顺延1天');
                  }}
                >
                  顺延
                </button>
              </div>
              <ul>
                {getTimeFilteredTasks().map(task => (
                  <li 
                    key={task.id} 
                    className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="text-gray-900 dark:text-gray-100 font-medium truncate cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                          onClick={() => handleOpenTaskDetail(task)}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                          <span className="text-red-500 dark:text-red-400">
                            {getDateInfo(task.dueDate).text}
                          </span>
                          <div className="flex items-center ml-auto gap-1">
                            <button 
                              className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                              onClick={() => handleDeferTask(task.id, 1)}
                              title="顺延1天"
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1 text-gray-500 hover:text-purple-500 dark:hover:text-purple-400"
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                              onClick={() => handleDeleteTask(task)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 主任务列表显示 */}
          {viewMode === 'list' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {/* 以下是原有的列表视图代码，保持不变 */}
              {filteredTasks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">未找到任务</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    没有找到符合当前筛选条件的任务。尝试调整筛选条件或清除搜索关键词。
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus(null);
                      setFilterPriority(null);
                      setFilterAssignee(null);
                      setFilterTag(null);
                    }}
                    className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white"
                  >
                    清除筛选条件
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Square className="h-4 w-4" />
                              任务
                            </div>
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">负责人</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">优先级</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">截止日期</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">进度</th>
                          <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task) => {
                          const dateInfo = getDateInfo(task.dueDate);
                          return (
                            <tr 
                              key={task.id}
                              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-start gap-3">
                                  {/* 替换原来的静态图标为可点击的任务状态切换按钮 */}
                                  <button 
                                    onClick={() => handleToggleTaskStatus(task.id)}
                                    className="mt-0.5 focus:outline-none"
                                  >
                                    {task.status === 'completed' ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                                    )}
                                  </button>
                                  <div>
                                    <div 
                                      className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-500' : 'dark:text-white'} cursor-pointer hover:text-purple-600 dark:hover:text-purple-400`}
                                      onClick={() => handleOpenTaskDetail(task)}
                                    >
                                      {task.title}
                                    </div>
                                    <div className={`text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                      {task.description}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                      <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag, index) => (
                                          <span 
                                            key={index} 
                                            className={`px-2 py-1 rounded-full text-xs ${getTagStyle(tag)} cursor-pointer hover:opacity-80`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleTagClick(tag);
                                            }}
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col gap-1">
                                  {task.assignees.map((assignee, index) => (
                                    <div 
                                      key={index}
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors"
                                      onClick={() => handleAssigneeClick(assignee.name, assignee.avatar, assignee.id)}
                                    >
                                      <img 
                                        src={assignee.avatar} 
                                        alt={assignee.name} 
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                      <div className="flex flex-col">
                                        <span className="dark:text-gray-300 text-sm">{assignee.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{assignee.role}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityStyle(task.priority)}`}>
                                  {getPriorityText(task.priority)}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusStyle(task.status)}`}>
                                  {getStatusIcon(task.status)}
                                  <span>{getStatusText(task.status)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col">
                                  <span className="dark:text-gray-300">{task.dueDate}</span>
                                  <span className={dateInfo.class}>
                                    {dateInfo.text}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      task.status === 'completed' 
                                        ? 'bg-green-500' 
                                        : task.priority === 'urgent' 
                                          ? 'bg-red-500'
                                          : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${task.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.progress}%</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => handleEditTask(task)}
                                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteTask(task)}
                                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredTasks.length === 0 && (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      没有找到匹配的任务
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 日视图 */}
          {viewMode === 'day' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-medium">
                  {formatDate(currentDate, 'full')}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigateDate('prev')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button 
                    onClick={() => navigateDate('next')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.map(task => {
                  const dueDate = new Date(task.dueDate);
                  dueDate.setHours(0, 0, 0, 0);
                  const today = new Date(currentDate);
                  today.setHours(0, 0, 0, 0);
                  
                  // 只显示当天的任务
                  if (dueDate.getTime() !== today.getTime()) return null;
                  
                  return (
                    <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleTaskStatus(task.id)}
                          className="mt-1 flex-shrink-0"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div 
                            className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                            onClick={() => handleOpenTaskDetail(task)}
                          >
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {task.description}
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {task.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className={`px-2 py-1 rounded-full text-xs ${getTagStyle(tag)} cursor-pointer hover:opacity-80`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTagClick(tag);
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 周视图 */}
          {viewMode === 'week' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-medium">
                  {formatDate(new Date(currentDate.getTime() - (currentDate.getDay() * 24 * 60 * 60 * 1000)), 'short')} - 
                  {formatDate(new Date(currentDate.getTime() + ((6 - currentDate.getDay()) * 24 * 60 * 60 * 1000)), 'short')}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigateDate('prev')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button 
                    onClick={() => navigateDate('next')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
                {Array.from({length: 7}).map((_, dayIndex) => {
                  const day = new Date(currentDate.getTime());
                  day.setDate(day.getDate() - day.getDay() + dayIndex);
                  const isToday = new Date().toDateString() === day.toDateString();
                  const dayTasks = filteredTasks.filter(task => {
                    const taskDate = new Date(task.dueDate);
                    return taskDate.toDateString() === day.toDateString();
                  });
                  
                  return (
                    <div key={dayIndex} className={`min-h-[200px] ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className={`p-2 text-center ${isToday ? 'bg-blue-100 dark:bg-blue-900/30 font-medium' : 'bg-gray-50 dark:bg-gray-800'}`}>
                        {day.toLocaleDateString('zh-CN', {weekday: 'short', day: 'numeric'})}
                      </div>
                      <div className="p-2">
                        {dayTasks.map(task => (
                          <div 
                            key={task.id} 
                            className={`mb-2 p-2 rounded-lg text-sm cursor-pointer ${getStatusStyle(task.status)}`}
                            onClick={() => handleOpenTaskDetail(task)}
                          >
                            <div className="font-medium line-clamp-2">{task.title}</div>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <div className="flex items-center gap-1">
                                {task.assignees.length > 0 && (
                                  <img 
                                    src={task.assignees[0].avatar} 
                                    alt={task.assignees[0].name} 
                                    className="w-4 h-4 rounded-full" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssigneeClick(task.assignees[0].name, task.assignees[0].avatar, task.assignees[0].id);
                                    }}
                                  />
                                )}
                              </div>
                              <span className={`px-1.5 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                                {getPriorityText(task.priority)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex} 
                                  className={`px-2 py-0.5 rounded-full text-xs ${getTagStyle(tag)} cursor-pointer hover:opacity-80`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTagClick(tag);
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                              {task.tags.length > 3 && <span className="text-xs text-gray-500">+{task.tags.length - 3}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 月视图 */}
          {viewMode === 'month' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-medium">
                  {currentDate.toLocaleDateString('zh-CN', {year: 'numeric', month: 'long'})}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigateDate('prev')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button 
                    onClick={() => navigateDate('next')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-700">
                {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                  <div key={index} className="p-2 text-center bg-gray-50 dark:bg-gray-800">
                    {day}
                  </div>
                ))}
                
                {getDaysInMonth().map((day, index) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isToday = new Date().toDateString() === date.toDateString();
                  const dayTasks = filteredTasks.filter(task => {
                    const taskDate = new Date(task.dueDate);
                    return taskDate.toDateString() === date.toDateString();
                  });
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[100px] p-1 ${
                        isToday 
                          ? 'bg-blue-50 dark:bg-blue-900/10' 
                          : day === 0 
                            ? 'bg-gray-100/50 dark:bg-gray-800/50' 
                            : ''
                      }`}
                    >
                      {day !== 0 && (
                        <>
                          <div className={`text-xs p-1 ${isToday ? 'font-bold text-blue-600 dark:text-blue-400' : ''}`}>
                            {day}
                          </div>
                          <div className="mt-1">
                            {dayTasks.slice(0, 3).map(task => (
                              <div 
                                key={task.id}
                                className={`text-xs p-1 mb-1 rounded truncate cursor-pointer ${getStatusStyle(task.status)}`}
                                onClick={() => handleOpenTaskDetail(task)}
                              >
                                {task.title}
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {task.tags.slice(0, 2).map((tag, tagIndex) => (
                                    <span 
                                      key={tagIndex} 
                                      className={`px-1.5 py-0.5 rounded-full text-xs ${getTagStyle(tag)} cursor-pointer hover:opacity-80`} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTagClick(tag);
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {task.tags.length > 2 && <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>}
                                </div>
                              </div>
                            ))}
                            {dayTasks.length > 3 && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                +{dayTasks.length - 3} 更多...
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 以下是原有的模态框代码，保持不变 */}
      {/* 任务详情模态框 */}
      {isTaskDetailOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold dark:text-white">任务详情</h2>
              <button 
                onClick={() => setIsTaskDetailOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => handleToggleTaskStatus(currentTask.id)}
                  className="flex-shrink-0"
                >
                  {currentTask.status === 'completed' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500" />
                  )}
                </button>
                <h3 className={`text-2xl font-semibold dark:text-white ${
                  currentTask.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}>
                  {currentTask.title}
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">描述</h4>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {currentTask.description || '无描述'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">负责人</h4>
                  <div className="flex flex-col gap-2">
                    {currentTask.assignees.length > 0 ? (
                      currentTask.assignees.map((assignee, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          onClick={() => handleAssigneeClick(assignee.name, assignee.avatar, assignee.id)}
                        >
                          <img 
                            src={assignee.avatar} 
                            alt={assignee.name} 
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium dark:text-white">{assignee.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{assignee.role}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">未分配</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">状态</h4>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm w-fit ${getStatusStyle(currentTask.status)}`}>
                      {getStatusIcon(currentTask.status)}
                      <span>{getStatusText(currentTask.status)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">优先级</h4>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm w-fit ${getPriorityStyle(currentTask.priority)}`}>
                      <span>{getPriorityText(currentTask.priority)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">截止日期</h4>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="dark:text-white">{currentTask.dueDate}</span>
                      <span className={getDateInfo(currentTask.dueDate).class}>
                        ({getDateInfo(currentTask.dueDate).text})
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">进度</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 flex-1">
                        <div 
                          className={`h-2.5 rounded-full ${
                            currentTask.status === 'completed' 
                              ? 'bg-green-500' 
                              : currentTask.priority === 'urgent' 
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                          }`}
                          style={{ width: `${currentTask.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm dark:text-white">{currentTask.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTask.tags.length > 0 ? (
                      currentTask.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1.5 rounded-full text-sm ${getTagStyle(tag)} cursor-pointer hover:opacity-80`}
                          onClick={() => {
                            handleTagClick(tag);
                            setIsTaskDetailOpen(false);
                          }}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">无标签</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">创建时间</h4>
                    <div className="text-gray-800 dark:text-gray-200">
                      {new Date(currentTask.createdAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">最后更新</h4>
                    <div className="text-gray-800 dark:text-gray-200">
                      {new Date(currentTask.updatedAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleEditTask(currentTask);
                    setIsTaskDetailOpen(false);
                  }}
                  className="px-4 py-2 flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                  <span>编辑</span>
                </button>
                <button
                  onClick={() => {
                    handleDeleteTask(currentTask);
                    setIsTaskDetailOpen(false);
                  }}
                  className="px-4 py-2 flex items-center gap-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/30 text-red-700 dark:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>删除</span>
                </button>
              </div>
              <button
                onClick={() => setIsTaskDetailOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 任务编辑模态框 */}
      {isEditTaskModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold dark:text-white">编辑任务</h2>
              <button 
                onClick={() => setIsEditTaskModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              {/* 编辑表单内容 */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      任务标题
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      描述
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      rows={4}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      截止日期
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      优先级
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                      <option value="urgent">紧急</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    标签 (用逗号分隔)
                  </label>
                  <input
                    type="text"
                    value={newTask.tags}
                    onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="例如: 文书, 审核, 申请材料"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    负责人
                  </label>
                  <div className="flex flex-col gap-2">
                    {newTask.assignees.map((assignee, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={assignee.avatar} 
                            alt={assignee.name} 
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="dark:text-white">{assignee.name}</span>
                          <span className="text-sm text-gray-500">({assignee.role})</span>
                        </div>
                        <button
                          onClick={() => {
                            setNewTask({
                              ...newTask,
                              assignees: newTask.assignees.filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => {
                        // 这里应该打开一个选择员工的模态框
                        alert('这个功能将在完整版中实现');
                      }}
                      className="flex items-center justify-center p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-gray-500 dark:text-gray-400">添加负责人</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => setIsEditTaskModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleSubmitEditTask}
                className="px-4 py-2 rounded-lg bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800 text-white"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {isDeleteConfirmOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <Trash2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold dark:text-white">确认删除</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                您确定要删除任务"{currentTask.title}"吗？此操作不可撤销。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementPage; 
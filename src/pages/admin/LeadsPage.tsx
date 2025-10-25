import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Phone, Clock, ChevronLeft, ChevronRight, Users, CheckCircle2, AlertCircle, UserCheck, Trash2, Edit, X, UserPlus, CalendarClock, MessageSquare, Send, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadToStudentModal from '../../components/LeadToStudentModal';
import AddLeadModal from '../../components/AddLeadModal';
import { Lead, LeadStatus, LeadPriority } from '../../types/lead';
import { leadService, serviceTypeService, mentorService } from '../../services';
import { LeadLog } from '../../services/leadService';
import { ServiceType } from '../../services/serviceTypeService';
import { Mentor } from '../../services/mentorService';
import { simplifyDateFormat } from '../../utils/dateUtils';
import { toast } from 'react-hot-toast';

interface LeadsPageProps {
  setCurrentPage?: (page: string) => void;
}

function LeadsPage({ setCurrentPage: setAppCurrentPage }: LeadsPageProps) {
  const navigate = useNavigate();
  
  // 状态
  const [activeTab, setActiveTab] = useState('全部线索');
  const [selectedSource, setSelectedSource] = useState('全部来源');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<{start: string, end: string}>({start: '', end: ''});
  const [selectedConsultant, setSelectedConsultant] = useState('all');
  const [selectedInterest, setSelectedInterest] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [showLeadDetail, setShowLeadDetail] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  
  // 添加转换学生模态框状态
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // 添加新增线索模态框状态
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | undefined>(undefined);
  
  // 线索数据
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // 添加状态存储服务类型和顾问数据
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  
  // 添加日志相关状态
  const [leadLogs, setLeadLogs] = useState<LeadLog[]>([]);
  const [newLogContent, setNewLogContent] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [submittingLog, setSubmittingLog] = useState(false);
  const logContentRef = useRef<HTMLTextAreaElement>(null);
  
  // 添加跟进记录功能相关状态
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState<Lead | null>(null);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);
  
  // 初始加载数据
  useEffect(() => {
    fetchLeads();
    fetchServiceTypes();
    fetchMentors();
  }, []);
  
  // 获取线索数据
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error('获取线索数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取服务类型数据
  const fetchServiceTypes = async () => {
    try {
      const data = await serviceTypeService.getAllServiceTypes();
      setServiceTypes(data);
    } catch (error) {
      console.error('获取服务类型数据失败:', error);
    }
  };
  
  // 获取顾问数据
  const fetchMentors = async () => {
    try {
      const data = await mentorService.getAllMentors();
      setMentors(data);
    } catch (error) {
      console.error('获取顾问数据失败:', error);
    }
  };
  
  // 可选的线索来源
  const sources = ['全部来源', '官网表单', '社交媒体', '转介绍', '合作方', '电话咨询'];

  // 可选的顾问列表
  const consultants = ['李顾问', '王顾问', '张顾问', '刘顾问', '黄顾问', '周顾问', '未分配'];
  
  // 可选的意向项目
  const interests = ['美国本科申请', '英国本科申请', '美国硕士申请', '英国硕士申请', '澳大利亚硕士申请', '加拿大高中申请', '新加坡大学申请', '香港大学申请'];
  
  // 重置筛选条件
  const resetFilters = () => {
    setSelectedDate({start: '', end: ''});
    setSelectedConsultant('all');
    setSelectedInterest('all');
    setSelectedPriority('all');
    setSelectedStatus('all');
    setSelectedSource('全部来源');
    setSelectedGender('all');
    setSearchQuery('');
    
    // 重新加载所有线索
    fetchLeads();
  };
  
  // 应用筛选条件
  const applyFilters = async () => {
    try {
      setLoading(true);
      
      // 构建筛选条件
      const filter = {
        searchQuery: searchQuery,
        source: selectedSource !== '全部来源' ? selectedSource : undefined,
        status: (selectedStatus !== 'all' ? selectedStatus : undefined) as LeadStatus | undefined,
        startDate: selectedDate.start || undefined,
        endDate: selectedDate.end || undefined,
        consultant: selectedConsultant !== 'all' ? selectedConsultant : undefined,
        interest: selectedInterest !== 'all' ? selectedInterest : undefined,
        priority: (selectedPriority !== 'all' ? selectedPriority : undefined) as LeadPriority | undefined,
        gender: selectedGender !== 'all' ? selectedGender : undefined,
      };
      
      // 获取过滤后的线索
      const filteredLeads = await leadService.getFilteredLeads(filter);
      setLeads(filteredLeads);
      
      // 关闭筛选面板
      setShowFilters(false);
    } catch (error) {
      console.error('应用筛选条件失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 基于activeTab筛选线索
  const filteredLeads = leads.filter(lead => {
    // 基于activeTab筛选
    if (activeTab === '全部线索') {
      // No filter
    } else if (activeTab === '新线索' && lead.status !== 'new') {
      return false;
    } else if (activeTab === '已联系' && lead.status !== 'contacted') {
      return false;
    } else if (activeTab === '已签约' && lead.status !== 'converted') {
      return false;
    } else if (activeTab === '高优先级' && lead.priority !== 'high') {
      return false;
    }
    
    return true;
  });
  
  // 计算分页
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  
  // 更改页码
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // 生成分页数组
  const pageNumbers = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }
  
  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    qualified: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    converted: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
  };
  
  // 状态中文名称映射
  const statusNameMap: Record<string, string> = {
    new: '新线索',
    contacted: '已联系',
    qualified: '已确认',
    converted: '已签约',
    closed: '已关闭'
  };
  
  // 优先级标签颜色映射
  const priorityColorMap: Record<string, string> = {
    high: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    medium: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
  };
  
  // 优先级中文名称映射
  const priorityNameMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  };

  // 获取线索详情
  const getLeadDetail = (id: string) => {
    return leads.find(lead => lead.id === id) || null;
  };

  // 查看线索详情 - 修改为跳转到详情页
  const handleViewLead = (lead: Lead) => {
    console.log('正在跳转到线索详情页:', lead.id);
    // 使用window.location.href强制完整页面刷新而不是单页面路由跳转
    const currentPort = window.location.port;
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${currentPort}/admin/leads/${lead.id}`;
  };

  // 处理添加线索
  const handleAddLead = () => {
    setShowAddLeadModal(true);
  };

  // 处理转换为学生
  const handleConvertToStudent = (lead: Lead) => {
    setSelectedLead(lead);
    setShowConvertModal(true);
  };

  // 处理学生添加完成
  const handleStudentAdded = () => {
    // 刷新线索列表
    fetchLeads();
  };

  // 处理编辑线索
  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setShowAddLeadModal(true);
  };

  // 处理新增线索完成
  const handleLeadAdded = () => {
    // 重新获取线索数据
    fetchLeads();
    setShowAddLeadModal(false);
    setLeadToEdit(undefined); // 清空当前编辑的线索
  };

  // 获取意向项目显示名称
  const getInterestName = (interestId: string) => {
    if (!interestId) return '';
    const serviceType = serviceTypes.find(type => type.id === parseInt(interestId));
    return serviceType ? serviceType.name : `项目${interestId}`;
  };
  
  // 获取顾问信息（头像和名称）
  const getMentorInfo = (mentorId: string) => {
    if (!mentorId) return { name: '未分配', avatar: '/assets/default-avatar.svg' };
    const mentor = mentors.find(m => m.id === parseInt(mentorId));
    return mentor 
      ? { 
          name: mentor.name, 
          avatar: mentor.avatar_url || '/assets/default-avatar.svg' // 确保有默认头像
        } 
      : { name: `顾问${mentorId}`, avatar: '/assets/default-avatar.svg' };
  };

  // 计算本周需要跟进的线索数量
  const calculateWeeklyFollowUps = () => {
    // 获取本周的开始日期（周一）和结束日期（周日）
    const now = new Date();
    const currentDay = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    // 筛选本周需要跟进的线索
    // 条件可以是：1. 最后联系时间超过7天的活跃线索; 2. 状态为"已联系"但未转化的线索
    return leads.filter(lead => {
      // 排除已签约或已关闭的线索
      if (lead.status === 'converted' || lead.status === 'closed') {
        return false;
      }
      
      // 尝试解析lastContact日期
      try {
        const lastContactDate = new Date(lead.lastContact);
        
        // 如果最后联系时间在7天前，需要本周跟进
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return lastContactDate < sevenDaysAgo;
      } catch (error) {
        return false; // 日期解析错误，不计入跟进
      }
    }).length;
  };

  // 添加计算天数差的函数
  const getDaysSinceLastContact = (dateString: string): number => {
    if (!dateString) return 0;
    
    try {
      const lastContact = new Date(dateString);
      const today = new Date();
      
      // 重置时间部分，只比较日期
      lastContact.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(today.getTime() - lastContact.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('计算日期差异失败:', error);
      return 0;
    }
  };

  // 处理跟进记录
  const handleFollowUp = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发行点击事件
    setSelectedLeadForFollowUp(lead);
    setShowFollowUpModal(true);
  };

  // 提交跟进记录
  const submitFollowUp = async () => {
    if (!followUpContent.trim()) {
      toast.error('请输入跟进内容');
      return;
    }

    if (!selectedLeadForFollowUp) {
      toast.error('未选择线索');
      return;
    }

    setSubmittingFollowUp(true);
    try {
      await leadService.addLeadLog({
        lead_id: selectedLeadForFollowUp.id,
        content: followUpContent,
        date: new Date().toISOString(),
        next_follow_up: followUpDate || null,
        operator: '1' // 这里可以替换为当前登录用户的ID
      });

      // 重新获取线索列表，更新状态
      await fetchLeads();
      
      // 重置表单
      setFollowUpContent('');
      setFollowUpDate('');
      setShowFollowUpModal(false);
      setSelectedLeadForFollowUp(null);
      
      toast.success('添加跟进记录成功');
    } catch (error) {
      console.error('添加跟进记录失败:', error);
      toast.error('添加跟进记录失败');
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-full overflow-hidden">
      {/* 页面标题和搜索/添加按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">线索管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索线索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            筛选
          </button>
          <button 
            onClick={handleAddLead} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新增线索
          </button>
        </div>
      </div>

      {/* 筛选器面板 - 条件显示 */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium dark:text-white">筛选条件</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">线索来源</label>
              <select 
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">接入日期范围</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="date" 
                  value={selectedDate.start}
                  onChange={(e) => setSelectedDate({...selectedDate, start: e.target.value})}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                />
                <span className="text-gray-500 dark:text-gray-400">至</span>
                <input 
                  type="date" 
                  value={selectedDate.end}
                  onChange={(e) => setSelectedDate({...selectedDate, end: e.target.value})}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">负责人</label>
              <select 
                value={selectedConsultant}
                onChange={(e) => setSelectedConsultant(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">全部顾问</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">意向项目</label>
              <select 
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">全部项目</option>
                {serviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">优先级</label>
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">全部优先级</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">状态</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">全部状态</option>
                <option value="new">新线索</option>
                <option value="contacted">已联系</option>
                <option value="qualified">已确认</option>
                <option value="converted">已签约</option>
                <option value="closed">已关闭</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">性别</label>
              <select 
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">全部</option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              重置筛选
            </button>
            <button 
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              应用筛选
            </button>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { title: '总线索数', value: leads.length, icon: Users, color: 'blue' },
          { title: '新线索', value: leads.filter(lead => lead.status === 'new').length, icon: AlertCircle, color: 'yellow' },
          { title: '已签约', value: leads.filter(lead => lead.status === 'converted').length, icon: CheckCircle2, color: 'green' },
          { title: '本周跟进', value: calculateWeeklyFollowUps(), icon: Clock, color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800">
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

      {/* 线索表格 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 flex-wrap">
            {['全部线索', '新线索', '已联系', '已签约', '高优先级'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">来源:</span>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-500">加载中...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">线索信息</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">来源</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">性别</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">接入时间</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">意向项目</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">负责人</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">优先级</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => handleViewLead(lead)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={lead.avatar || '/assets/default-avatar.svg'}
                              alt={lead.name}
                              className="h-10 w-10 rounded-xl object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/default-avatar.svg';
                              }}
                            />
                            <div>
                              <h3 className="font-medium dark:text-white">{lead.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {lead.phone}
                                </span>
                                {lead.lastContact && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className={`text-xs ${
                                      lead.status === 'closed' || lead.status === 'converted' 
                                        ? 'text-gray-500' 
                                        : getDaysSinceLastContact(lead.lastContact) > 7
                                          ? 'text-red-600 font-medium'
                                          : 'text-blue-600'
                                    }`}>
                                      {lead.status === 'closed' || lead.status === 'converted' 
                                        ? '已结束' 
                                        : `${getDaysSinceLastContact(lead.lastContact)}天前`}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                          {lead.gender === 'male' ? '男' : 
                           lead.gender === 'female' ? '女' : 
                           lead.gender || '未设置'}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('zh-CN') : 
                           lead.date ? new Date(lead.date).toLocaleDateString('zh-CN') : 
                           '未设置'}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{getInterestName(lead.interest)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[lead.status]}`}>
                            {statusNameMap[lead.status]}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {lead.assignedTo ? (
                              <>
                                <div className="relative h-6 w-6 rounded-full mr-2 overflow-hidden bg-blue-100">
                                  <img 
                                    src={getMentorInfo(lead.assignedTo).avatar} 
                                    alt={getMentorInfo(lead.assignedTo).name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      // 图片加载失败时不显示任何内容,只保留背景色
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {getMentorInfo(lead.assignedTo).name}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">未分配</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColorMap[lead.priority]}`}>
                            {priorityNameMap[lead.priority]}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => handleFollowUp(e, lead)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md dark:text-blue-400 dark:hover:bg-blue-900/20"
                              title="添加跟进"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditLead(lead)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-gray-500 dark:text-gray-400">
                        没有找到符合条件的线索
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  显示 {indexOfFirstItem + 1} 至 {Math.min(indexOfLastItem, filteredLeads.length)} 条，共 {filteredLeads.length} 条
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {pageNumbers.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? paginate(page) : null}
                      className={`px-3 py-1 rounded-xl text-sm ${
                        page === currentPage
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : page === '...'
                          ? 'text-gray-500 dark:text-gray-400 cursor-default'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 线索转学生模态框 */}
      <LeadToStudentModal 
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onStudentAdded={handleStudentAdded}
        lead={selectedLead}
      />
      
      {/* 添加/编辑线索弹窗 */}
      {showAddLeadModal && (
        <AddLeadModal 
          isOpen={true}
          onClose={() => {
            setShowAddLeadModal(false);
            setLeadToEdit(undefined);
          }}
          onLeadAdded={handleLeadAdded}
          leadToEdit={leadToEdit}
          serviceTypes={serviceTypes}
          mentors={mentors}
        />
      )}
      
      {/* 添加快速跟进记录模态框 */}
      {showFollowUpModal && selectedLeadForFollowUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full dark:bg-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">添加跟进记录</h3>
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                正在为 <span className="font-semibold">{selectedLeadForFollowUp.name}</span> 添加跟进记录
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  跟进内容
                </label>
                <textarea
                  value={followUpContent}
                  onChange={(e) => setFollowUpContent(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="请输入跟进内容..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  下次跟进日期（可选）
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={submitFollowUp}
                disabled={submittingFollowUp || !followUpContent.trim()}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 ${
                  submittingFollowUp || !followUpContent.trim() 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-blue-700'
                }`}
              >
                {submittingFollowUp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    处理中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    提交跟进
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadsPage; 
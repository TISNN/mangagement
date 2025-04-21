import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone,
  Send,
  UserPlus,
  Edit,
  Trash2,
  Clock,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import supabase from '../../lib/supabase';
import { leadService, serviceTypeService, mentorService } from '../../services';
import { Lead } from '../../types/lead';
import { ServiceType } from '../../services/serviceTypeService';
import { Mentor } from '../../services/mentorService';
import { LeadLog } from '../../services/leadService';
import LeadToStudentModal from '../../components/LeadToStudentModal';
import { simplifyDateFormat } from '../../utils/dateUtils';

// 定义简单的Timeline组件
interface TimelineItemProps {
  children: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

const Timeline: React.FC<TimelineProps> & { Item: React.FC<TimelineItemProps> } = ({ children, className }) => (
  <div className={`flex flex-col space-y-4 ${className || ''}`}>
    {children}
  </div>
);

Timeline.Item = ({ children, color }) => (
  <div className="flex">
    <div className="mr-4">
      <div 
        className="h-4 w-4 rounded-full" 
        style={{ backgroundColor: color || '#1890ff' }}
      ></div>
      <div className="h-full w-px bg-gray-200 ml-[7px] -mt-1"></div>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  
  // 状态管理
  const [lead, setLead] = useState<Lead | null>(null);
  const [leadLogs, setLeadLogs] = useState<LeadLog[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [newLogContent, setNewLogContent] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  
  // 添加内联编辑相关状态
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Lead | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [leadSources, setLeadSources] = useState<string[]>([]);
  
  const logContentRef = useRef<HTMLTextAreaElement>(null);
  
  // 添加日志编辑和删除相关状态
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editLogContent, setEditLogContent] = useState('');
  const [editNextFollowUpDate, setEditNextFollowUpDate] = useState('');
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [showDeleteLogConfirm, setShowDeleteLogConfirm] = useState(false);
  const [processingLog, setProcessingLog] = useState(false);
  // 添加菜单状态变量
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // 添加当前用户状态
  const [currentUser, setCurrentUser] = useState<{id: string; name: string} | null>(null);
  
  // 添加时间线数据状态
  const [followUpDates, setFollowUpDates] = useState<Array<{type: string; date: string}>>([]);
  
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
  
  useEffect(() => {
    if (!leadId) {
      navigate('/admin/leads');
      return;
    }
    
    // 加载数据
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 并行获取数据
        const [leadData, serviceTypesData, mentorsData, sourcesData] = await Promise.all([
          leadService.getLeadById(leadId),
          serviceTypeService.getAllServiceTypes(),
          mentorService.getAllMentors(),
          leadService.getLeadSources()
        ]);
        
        setLead(leadData);
        setEditData(leadData); // 初始化编辑数据
        setServiceTypes(serviceTypesData);
        setMentors(mentorsData);
        setLeadSources(sourcesData);
        
        // 加载日志数据
        await fetchLeadLogs();
      } catch (error) {
        console.error('获取线索详情失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [leadId, navigate]);
  
  // 获取线索日志
  const fetchLeadLogs = async () => {
    if (!leadId) return;
    
    setLoadingLogs(true);
    
    try {
      const logs = await leadService.getLeadLogs(leadId);
      setLeadLogs(logs);
      
      // 确保每次加载日志后立即更新时间线数据
      updateTimelineData(logs);
      
    } catch (error) {
      console.error('获取线索日志失败:', error);
      toast.error('获取线索日志失败');
    } finally {
      setLoadingLogs(false);
    }
  };
  
  // 获取当前用户信息
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // 这里可以从supabase或其他存储中获取当前用户
        // 示例：从localStorage获取
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        } else {
          // 如果没有找到用户，设置一个默认值
          setCurrentUser({id: '1', name: '系统管理员'});
        }
      } catch (error) {
        console.error('获取当前用户失败', error);
        setCurrentUser({id: '1', name: '系统管理员'});
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // 提交新日志
  const submitNewLog = async () => {
    if (!newLogContent.trim()) {
      toast.error('请输入跟进内容');
      return;
    }
    
    if (!leadId) {
      toast.error('线索ID不存在');
      return;
    }

    setSubmittingLog(true);
    try {
      await leadService.addLeadLog({
        lead_id: leadId,
        type: 'FOLLOW_UP',
        content: newLogContent,
        date: new Date().toISOString(),
        operator: currentUser?.id || ''
      });

      setNewLogContent('');
      toast.success('添加跟进记录成功');
      
      // 重新加载日志和线索数据
      await fetchLeadLogs();
      const updatedLead = await leadService.getLeadById(leadId);
      setLead(updatedLead);
      
      // 显式调用更新时间线数据函数以确保UI更新
      if (leadLogs) {
        updateTimelineData(leadLogs);
      }
    } catch (error) {
      console.error('添加跟进记录失败:', error);
      toast.error('添加跟进记录失败');
    } finally {
      setSubmittingLog(false);
    }
  };
  
  // 获取意向项目显示名称
  const getInterestName = (interestId: string) => {
    if (!interestId) return '';
    const serviceType = serviceTypes.find(type => type.id === parseInt(interestId));
    return serviceType ? serviceType.name : `项目${interestId}`;
  };
  
  // 获取顾问显示名称
  const getMentorName = (mentorId: string) => {
    if (!mentorId) return '';
    const mentor = mentors.find(m => m.id === parseInt(mentorId));
    return mentor ? mentor.name : `顾问${mentorId}`;
  };
  
  // 处理转换为学生完成
  const handleStudentAdded = () => {
    setShowConvertModal(false);
    navigate('/admin/leads');
  };
  
  // 处理编辑
  const startEditing = () => {
    setIsEditing(true);
    if (lead) {
      // 确保深拷贝所有字段，特别处理日期格式
      const formattedDate = lead.date ? formatDateForInput(lead.date) : '';
      setEditData({
        ...lead,
        date: formattedDate
      });
      console.log('开始编辑数据:', {...lead, date: formattedDate}); // 添加日志调试
    }
  };
  
  // 处理编辑取消
  const cancelEditing = () => {
    setIsEditing(false);
    if (lead) {
      setEditData({...lead});
    }
  };
  
  // 处理编辑表单变更
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => prev ? ({...prev, [name]: value}) : null);
  };
  
  // 保存编辑的数据
  const saveEdit = async () => {
    if (!editData || !leadId) return;
    
    try {
      setSaveLoading(true);
      
      // 准备要更新的数据
      const updateData = {
        name: editData.name,
        phone: editData.phone,
        source: editData.source,
        gender: editData.gender,
        interest: editData.interest,
        assignedTo: editData.assignedTo,
        priority: editData.priority,
        status: editData.status, // 添加status字段
        notes: editData.notes,
        date: editData.date
      };
      
      console.log('更新数据:', updateData); // 添加日志调试
      
      // 更新数据库
      await leadService.updateLead(leadId, updateData);
      
      // 获取更新后的数据
      const updatedLead = await leadService.getLeadById(leadId);
      setLead(updatedLead);
      
      // 退出编辑模式
      setIsEditing(false);
      
    } catch (error) {
      console.error('更新线索失败:', error);
      alert('更新线索失败，请重试');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // 格式化日期为HTML日期输入控件需要的格式 (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('日期格式化失败:', error);
      return '';
    }
  };
  
  // 开始编辑日志
  const startEditLog = (log: LeadLog) => {
    setEditingLogId(log.id.toString());
    setEditLogContent(log.content);
    setEditNextFollowUpDate(log.next_follow_up || '');
  };
  
  // 取消编辑日志
  const cancelEditLog = () => {
    setEditingLogId(null);
    setEditLogContent('');
    setEditNextFollowUpDate('');
  };
  
  // 保存编辑的日志
  const saveEditLog = async () => {
    if (!editingLogId || !editLogContent.trim()) return;
    
    try {
      setProcessingLog(true);
      
      // 使用自定义方法更新日志
      await customUpdateLeadLog(editingLogId, {
        content: editLogContent.trim(),
        next_follow_up: editNextFollowUpDate || null
      });
      
      // 重新加载日志
      await fetchLeadLogs();
      
      // 重置编辑状态
      cancelEditLog();
    } catch (error) {
      console.error('更新日志失败:', error);
      alert('更新日志失败，请重试');
    } finally {
      setProcessingLog(false);
    }
  };
  
  // 确认删除日志
  const confirmDeleteLog = (logId: string) => {
    setDeletingLogId(logId);
    setShowDeleteLogConfirm(true);
  };
  
  // 执行删除日志
  const executeDeleteLog = async () => {
    if (!deletingLogId) return;
    
    try {
      setProcessingLog(true);
      
      // 使用自定义方法删除日志
      await customDeleteLeadLog(deletingLogId);
      
      // 重新加载日志
      await fetchLeadLogs();
      
      // 重置删除状态
      setDeletingLogId(null);
      setShowDeleteLogConfirm(false);
    } catch (error) {
      console.error('删除日志失败:', error);
      alert('删除日志失败，请重试');
    } finally {
      setProcessingLog(false);
    }
  };
  
  // 自定义删除日志方法
  const customDeleteLeadLog = async (logId: string) => {
    try {
      // 调用Supabase删除日志记录
      const { error } = await supabase
        .from('lead_logs')
        .delete()
        .eq('id', parseInt(logId));
        
      if (error) throw error;
      
      console.log(`成功删除日志: ${logId}`);
    } catch (error) {
      console.error(`删除日志失败: ${logId}`, error);
      throw error;
    }
  };
  
  // 自定义更新日志方法
  const customUpdateLeadLog = async (logId: string, data: { content: string, next_follow_up: string | null }) => {
    try {
      // 调用Supabase更新日志记录
      const { error } = await supabase
        .from('lead_logs')
        .update({
          content: data.content,
          next_follow_up: data.next_follow_up
        })
        .eq('id', parseInt(logId));
      
      if (error) throw error;
      
      console.log(`成功更新日志: ${logId}`, data);
    } catch (error) {
      console.error(`更新日志失败: ${logId}`, error);
      throw error;
    }
  };
  
  // 添加切换菜单的函数
  const toggleMenu = (logId: string) => {
    if (openMenuId === logId.toString()) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(logId.toString());
    }
  };
  
  // 关闭所有菜单
  const closeAllMenus = () => {
    setOpenMenuId(null);
  };
  
  // 点击文档其他区域时关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.log-menu-button') && !target.closest('.log-menu')) {
        closeAllMenus();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
  
  // 获取跟进状态
  const getFollowUpStatus = (lead: Lead | null) => {
    if (!lead || !lead.lastContact) return 'none';
    
    // 如果已关闭或签约，返回completed
    if (lead.status === 'closed' || lead.status === 'converted') {
      return 'completed';
    }
    
    const daysSince = getDaysSinceLastContact(lead.lastContact);
    
    if (daysSince <= 3) return 'recent'; // 最近3天内跟进
    if (daysSince <= 7) return 'normal'; // 7天内正常
    if (daysSince <= 14) return 'attention'; // 需要关注
    return 'overdue'; // 超期未跟进
  };
  
  // 获取状态对应的颜色和文字
  const getFollowUpStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-gray-100 dark:bg-gray-700', 
          text: '已结束',
          textColor: 'text-gray-700 dark:text-gray-300',
          icon: <CheckCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        };
      case 'recent':
        return { 
          color: 'bg-green-100 dark:bg-green-900/30', 
          text: '近期已跟进',
          textColor: 'text-green-700 dark:text-green-400',
          icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        };
      case 'normal':
        return { 
          color: 'bg-blue-100 dark:bg-blue-900/30', 
          text: '正常跟进中',
          textColor: 'text-blue-700 dark:text-blue-400',
          icon: <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        };
      case 'attention':
        return { 
          color: 'bg-yellow-100 dark:bg-yellow-900/30', 
          text: '需要跟进',
          textColor: 'text-yellow-700 dark:text-yellow-400',
          icon: <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        };
      case 'overdue':
        return { 
          color: 'bg-red-100 dark:bg-red-900/30', 
          text: '紧急跟进',
          textColor: 'text-red-700 dark:text-red-400',
          icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        };
      default:
        return { 
          color: 'bg-gray-100 dark:bg-gray-700', 
          text: '未跟进',
          textColor: 'text-gray-700 dark:text-gray-300',
          icon: <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        };
    }
  };
  
  // 获取首次跟进日期
  const getFirstFollowUpDate = (logs: LeadLog[]): string => {
    if (!logs || logs.length === 0) return '';
    
    // 按日期排序（最早的在前）
    const sortedLogs = [...logs].sort((a, b) => {
      return new Date(a.log_date).getTime() - new Date(b.log_date).getTime();
    });
    
    return sortedLogs[0].log_date;
  };
  
  // 格式化日期为年月日格式
  const formatYearMonthDay = (dateString: string | undefined): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.getFullYear() + '-' + 
             String(date.getMonth() + 1).padStart(2, '0') + '-' + 
             String(date.getDate()).padStart(2, '0');
    } catch {
      return '';
    }
  };
  
  // 修改getLatestFollowUpInfos函数，添加安全类型检查
  const getLatestFollowUpInfos = (logs: LeadLog[]) => {
    if (!logs || !Array.isArray(logs)) return [];
    
    // 筛选出跟进类型的记录，添加安全检查
    const followUps = logs.filter(log => {
      return log && (log.type === 'FOLLOW_UP' || !log.type);
    });
    
    // 按日期降序排序，使用日志日期
    return followUps.sort((a, b) => {
      const dateA = a.log_date ? new Date(a.log_date).getTime() : 0;
      const dateB = b.log_date ? new Date(b.log_date).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 5); // 返回最新的5条记录
  };
  
  // 修改updateTimelineData函数，解决类型问题
  const updateTimelineData = (logs: LeadLog[]) => {
    if (!logs || !lead) return;
    
    const newDates: Array<{type: string; date: string}> = [];
    
    // 创建时间
    const createDate = lead.date || '';
    if (createDate) {
      newDates.push({
        type: 'create',
        date: createDate
      });
    }
    
    // 首次跟进时间
    const firstFollowUp = getFirstFollowUpDate(logs);
    if (firstFollowUp) {
      newDates.push({
        type: 'first_follow',
        date: firstFollowUp
      });
    }
    
    // 最新跟进时间
    const latestFollowUps = getLatestFollowUpInfos(logs);
    if (latestFollowUps.length > 0) {
      // 确保log_date存在
      const latestDate = latestFollowUps[0]?.log_date || '';
      // 如果已有首次跟进且不是同一天，再添加最新跟进时间
      if (firstFollowUp && new Date(firstFollowUp).toDateString() !== new Date(latestDate).toDateString() && latestDate) {
        newDates.push({
          type: 'latest_follow',
          date: latestDate
        });
      }
    }
    
    // 已转化时间 - 修复状态判断
    if (lead.status === 'converted') { 
      const conversionDate = lead.lastContact || lead.date || '';
      if (conversionDate) {
        newDates.push({
          type: 'convert',
          date: conversionDate
        });
      }
    }
    
    // 已关闭时间 - 修复状态判断
    if (lead.status === 'closed') {
      const lostDate = lead.lastContact || lead.date || '';
      if (lostDate) {
        newDates.push({
          type: 'lost',
          date: lostDate
        });
      }
    }
    
    // 按时间排序，添加安全检查
    newDates.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
    
    // 设置状态
    setFollowUpDates(newDates);
  };
  
  // 修复getTimelineItemTitle函数，确保返回字符串
  const getTimelineItemTitle = (type: string): string => {
    switch (type) {
      case 'create':
        return '创建线索';
      case 'first_follow':
        return '首次跟进';
      case 'latest_follow':
        return '最新跟进';
      case 'convert':
        return '转化为学生';
      case 'lost':
        return '关闭线索';
      default:
        return '未知事件';
    }
  };
  
  // 修改getTimelineItemColor函数以支持最新跟进状态
  const getTimelineItemColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'blue';
      case 'first_follow':
        return 'green';
      case 'latest_follow':
        return 'purple';  // 为最新跟进添加不同颜色
      case 'convert':
        return 'green';
      case 'lost':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl font-medium mb-4">未找到线索信息</div>
        <button 
          onClick={() => navigate('/admin/leads')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回线索列表
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-full overflow-hidden">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/leads')}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">线索详情</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditing && lead?.status === 'converted' && (
            <button 
              onClick={() => setShowConvertModal(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              转换为学生
            </button>
          )}
          
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              编辑线索
            </button>
          ) : (
            <>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                取消
              </button>
              <button
                onClick={saveEdit}
                disabled={saveLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                {saveLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    保存修改
                  </>
                )}
              </button>
            </>
          )}
          
          {!isEditing && (
            <button 
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              删除
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：线索基本信息 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={lead?.avatar}
                alt={lead?.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData?.name || ''}
                    onChange={handleEditChange}
                    className="text-xl font-bold w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <h2 className="text-xl font-bold dark:text-white">{lead?.name}</h2>
                )}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData?.phone || ''}
                        onChange={handleEditChange}
                        className="w-full p-1 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      />
                    ) : (
                      lead?.phone
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">状态</h4>
                  {isEditing ? (
                    <select
                      name="status"
                      value={editData?.status || ''}
                      onChange={handleEditChange}
                      className="w-full p-1.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="new">新线索</option>
                      <option value="contacted">已联系</option>
                      <option value="qualified">已确认</option>
                      <option value="converted">已签约</option>
                      <option value="closed">已关闭</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColorMap[lead?.status || 'new']}`}>
                      {statusNameMap[lead?.status || 'new']}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">优先级</h4>
                  {isEditing ? (
                    <select
                      name="priority"
                      value={editData?.priority || ''}
                      onChange={handleEditChange}
                      className="w-full p-1.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${priorityColorMap[lead?.priority || 'medium']}`}>
                      {priorityNameMap[lead?.priority || 'medium']}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">线索来源</h4>
                {isEditing ? (
                  <select
                    name="source"
                    value={editData?.source || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {leadSources.length > 0 ? 
                      leadSources.map((source, index) => (
                        <option key={index} value={source}>{source}</option>
                      )) : 
                      [
                        '官网表单',
                        '社交媒体',
                        '转介绍',
                        '合作方',
                        '电话咨询',
                        '其他'
                      ].map((source, index) => (
                        <option key={index} value={source}>{source}</option>
                      ))
                    }
                  </select>
                ) : (
                  <p className="font-medium dark:text-white">{lead?.source}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">接入日期</h4>
                {isEditing ? (
                  <input
                    type="date"
                    name="date"
                    value={editData?.date || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-medium dark:text-white">{simplifyDateFormat(lead?.date || '')}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">最后联系</h4>
                <p className="font-medium dark:text-white">{simplifyDateFormat(lead?.lastContact || '')}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">负责人</h4>
                {isEditing ? (
                  <select
                    name="assignedTo"
                    value={editData?.assignedTo || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">未分配</option>
                    {mentors.map(mentor => (
                      <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium dark:text-white">{getMentorName(lead?.assignedTo || '')}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">性别</h4>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData?.gender || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">未设置</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="其他">其他</option>
                  </select>
                ) : (
                  <p className="font-medium dark:text-white">
                    {lead?.gender === 'male' ? '男' : 
                     lead?.gender === 'female' ? '女' : 
                     lead?.gender || '未设置'}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">创建于</h4>
                <p className="font-medium dark:text-white">
                  {simplifyDateFormat(lead?.createdAt || '') || simplifyDateFormat(lead?.date || '')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">意向项目</h4>
                {isEditing ? (
                  <select
                    name="interest"
                    value={editData?.interest || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">未设置</option>
                    {serviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium dark:text-white">{getInterestName(lead?.interest || '')}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">备注</h4>
                {isEditing ? (
                  <textarea
                    name="notes"
                    value={editData?.notes || ''}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-medium dark:text-white whitespace-pre-line">{lead?.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：时间线和跟进记录 */}
        <div className="md:col-span-2">
          {/* 时间线卡片 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold dark:text-white">跟进状态</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  最近更新: {simplifyDateFormat(lead?.lastContact || '暂无')}
                </span>
              </div>
            </div>
            
            {lead?.lastContact ? (
              <>
                {/* 跟进状态指标 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full ${getFollowUpStatusInfo(getFollowUpStatus(lead)).color} flex items-center justify-center`}>
                      {getFollowUpStatusInfo(getFollowUpStatus(lead)).icon}
                    </div>
                    <div>
                      <div className={`font-semibold ${getFollowUpStatusInfo(getFollowUpStatus(lead)).textColor}`}>
                        {getFollowUpStatusInfo(getFollowUpStatus(lead)).text}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {lead.status === 'closed' || lead.status === 'converted' 
                          ? '线索已转化或关闭' 
                          : `距离上次跟进已过 ${getDaysSinceLastContact(lead.lastContact)} 天`}
                      </div>
                    </div>
                  </div>
                  {!(lead.status === 'closed' || lead.status === 'converted') && (
                    <div className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                      getDaysSinceLastContact(lead.lastContact) > 14
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : getDaysSinceLastContact(lead.lastContact) > 7
                          ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {getDaysSinceLastContact(lead.lastContact)} 天
                    </div>
                  )}
                </div>
                
                {/* 时间线 */}
                <div className="mt-6">
                  <h3 className="font-medium mb-4 dark:text-white">线索历程</h3>
                  <Timeline className="pl-2">
                    {followUpDates.map((item, index) => (
                      <Timeline.Item key={index} color={getTimelineItemColor(item.type)}>
                        <div className="pb-4">
                          <div className="text-sm font-medium dark:text-white">{getTimelineItemTitle(item.type)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatYearMonthDay(item.date)}
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>尚未进行任何跟进</p>
                <p className="text-sm mt-1">添加第一条跟进记录，开始客户跟进流程</p>
              </div>
            )}
          </div>
          
          {/* 跟进记录区域 - 独立显示所有跟进记录 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="font-medium mb-4 dark:text-white">跟进记录历史</h3>
            
            {/* 添加跟进记录表单 */}
            <div className="mb-6 border-b border-gray-100 pb-6 dark:border-gray-700">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  添加新跟进记录
                </label>
                <textarea
                  ref={logContentRef}
                  value={newLogContent}
                  onChange={(e) => setNewLogContent(e.target.value)}
                  placeholder="输入跟进内容..."
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex flex-wrap gap-4 items-end justify-between">
                <div className="flex-grow max-w-xs">
                  <label className="block text-xs font-medium text-gray-500 mb-1 dark:text-gray-400">
                    下次跟进日期（可选）
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <button
                  onClick={submitNewLog}
                  disabled={submittingLog || !newLogContent.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    submittingLog || !newLogContent.trim() 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500 dark:bg-gray-700 dark:text-gray-400' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {submittingLog ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      添加跟进
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* 跟进记录列表 */}
            {loadingLogs ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
                <span className="ml-3 text-gray-500 dark:text-gray-400">加载跟进记录...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {leadLogs && leadLogs.length > 0 ? (
                  leadLogs.map(log => (
                    <div 
                      key={log.id} 
                      className="p-4 border border-gray-100 rounded-lg dark:border-gray-700"
                    >
                      {editingLogId === log.id.toString() ? (
                        <div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                              编辑跟进内容
                            </label>
                            <textarea
                              value={editLogContent}
                              onChange={(e) => setEditLogContent(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              rows={3}
                            ></textarea>
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                              下次跟进日期（可选）
                            </label>
                            <input
                              type="date"
                              value={editNextFollowUpDate}
                              onChange={(e) => setEditNextFollowUpDate(e.target.value)}
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={cancelEditLog}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                              取消
                            </button>
                            <button
                              onClick={saveEditLog}
                              disabled={processingLog || !editLogContent.trim()}
                              className={`px-3 py-1 text-white rounded-lg flex items-center gap-1 ${
                                processingLog || !editLogContent.trim() ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {processingLog ? '保存中...' : '保存'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-sm font-medium dark:text-white">
                                {log.employee_name || '系统'}
                              </span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatYearMonthDay(log.log_date)}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleMenu(log.id.toString())}
                              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            {openMenuId === log.id.toString() && (
                              <div className="bg-white shadow-lg rounded-lg p-2 absolute right-0 mt-8 z-10 log-menu dark:bg-gray-800">
                                <button
                                  onClick={() => startEditLog(log)}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => confirmDeleteLog(log.id.toString())}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  删除
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {log.content}
                          </div>
                          {log.next_follow_up && (
                            <div className="mt-2 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded dark:bg-blue-900/20 dark:text-blue-400">
                              下次跟进: {formatYearMonthDay(log.next_follow_up)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 dark:text-gray-400">
                    暂无跟进记录
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 线索转学生模态框 */}
      <LeadToStudentModal 
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onStudentAdded={handleStudentAdded}
        lead={lead}
      />
      
      {/* 删除日志确认对话框 */}
      {showDeleteLogConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full dark:bg-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold dark:text-white">确认删除</h3>
            </div>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              您确定要删除这条跟进记录吗？此操作无法撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteLogConfirm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={executeDeleteLog}
                disabled={processingLog}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 ${
                  processingLog ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {processingLog ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    删除中...
                  </>
                ) : (
                  "确认删除"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadDetailPage;
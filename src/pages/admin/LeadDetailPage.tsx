import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  CalendarClock, 
  MessageSquare, 
  Send,
  UserPlus,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '../../types/lead';
import { leadService, serviceTypeService, mentorService } from '../../services';
import { LeadLog } from '../../services/leadService';
import { ServiceType } from '../../services/serviceTypeService';
import { Mentor } from '../../services/mentorService';
import { simplifyDateFormat } from '../../utils/dateUtils';
import LeadToStudentModal from '../../components/LeadToStudentModal';

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
  
  const logContentRef = useRef<HTMLTextAreaElement>(null);
  
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
        const [leadData, serviceTypesData, mentorsData] = await Promise.all([
          leadService.getLeadById(leadId),
          serviceTypeService.getAllServiceTypes(),
          mentorService.getAllMentors()
        ]);
        
        setLead(leadData);
        setServiceTypes(serviceTypesData);
        setMentors(mentorsData);
        
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
    
    try {
      setLoadingLogs(true);
      const logs = await leadService.getLeadLogs(leadId);
      setLeadLogs(logs);
    } catch (error) {
      console.error('获取线索日志失败:', error);
    } finally {
      setLoadingLogs(false);
    }
  };
  
  // 提交新日志
  const submitNewLog = async () => {
    if (!lead || !newLogContent.trim() || !leadId) return;
    
    try {
      setSubmittingLog(true);
      
      // 创建新日志
      await leadService.createLeadLog({
        lead_id: leadId,
        content: newLogContent.trim(),
        next_follow_up: nextFollowUpDate || null
      });
      
      // 重新加载日志和线索数据
      await fetchLeadLogs();
      const updatedLead = await leadService.getLeadById(leadId);
      setLead(updatedLead);
      
      // 清空表单
      setNewLogContent('');
      setNextFollowUpDate('');
    } catch (error) {
      console.error('创建日志失败:', error);
      alert('记录跟进日志失败，请重试');
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
          {lead.status === 'converted' && (
            <button 
              onClick={() => setShowConvertModal(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              转换为学生
            </button>
          )}
          
          <button
            onClick={() => navigate(`/admin/leads/edit/${leadId}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            编辑线索
          </button>
          
          <button 
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            删除
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：线索基本信息 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={lead.avatar}
                alt={lead.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-xl font-bold dark:text-white">{lead.name}</h2>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">状态</h4>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColorMap[lead.status]}`}>
                    {statusNameMap[lead.status]}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">优先级</h4>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${priorityColorMap[lead.priority]}`}>
                    {priorityNameMap[lead.priority]}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">线索来源</h4>
                <p className="font-medium dark:text-white">{lead.source}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">接入日期</h4>
                <p className="font-medium dark:text-white">{simplifyDateFormat(lead.date)}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">最后联系</h4>
                <p className="font-medium dark:text-white">{simplifyDateFormat(lead.lastContact)}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">负责人</h4>
                <p className="font-medium dark:text-white">{getMentorName(lead.assignedTo)}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">性别</h4>
                <p className="font-medium dark:text-white">{lead.gender || '未设置'}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">创建于</h4>
                <p className="font-medium dark:text-white">{simplifyDateFormat(lead.createdAt) || simplifyDateFormat(lead.date)}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">意向项目</h4>
                <p className="font-medium dark:text-white">{getInterestName(lead.interest)}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1 dark:text-gray-400">备注</h4>
                <p className="font-medium dark:text-white whitespace-pre-line">{lead.notes}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：跟进记录 */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white">跟进记录</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>最近更新: {simplifyDateFormat(lead.lastContact)}</span>
              </div>
            </div>
            
            {/* 新增日志表单 */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 dark:bg-gray-700/50">
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="logContent" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    跟进内容
                  </label>
                  <textarea
                    id="logContent"
                    ref={logContentRef}
                    rows={4}
                    placeholder="记录跟进内容、沟通重点..."
                    value={newLogContent}
                    onChange={(e) => setNewLogContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nextFollowUp" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <CalendarClock className="h-4 w-4" />
                        下次跟进时间（可选）
                      </div>
                    </label>
                    <input
                      type="date"
                      id="nextFollowUp"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={submitNewLog}
                      disabled={!newLogContent.trim() || submittingLog}
                      className={`w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 ${
                        !newLogContent.trim() || submittingLog ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      {submittingLog ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          提交中...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          提交记录
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 历史日志列表 */}
            <div className="space-y-4">
              {loadingLogs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : leadLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>暂无跟进记录</p>
                  <p className="text-sm mt-1">添加第一条跟进记录，及时记录与客户的沟通情况</p>
                </div>
              ) : (
                leadLogs.map((log) => (
                  <div key={log.id} className="border border-gray-100 rounded-xl p-5 dark:border-gray-700">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{log.employee_name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{simplifyDateFormat(log.log_date)}</span>
                    </div>
                    <p className="text-gray-700 mb-4 dark:text-gray-300 whitespace-pre-line">{log.content}</p>
                    {log.next_follow_up && (
                      <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex dark:bg-blue-900/20">
                        <CalendarClock className="h-4 w-4" />
                        <span>下次跟进: {simplifyDateFormat(log.next_follow_up)}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
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
    </div>
  );
}

export default LeadDetailPage;
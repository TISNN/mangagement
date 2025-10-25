/**
 * 线索详情侧边面板组件
 * 参考任务详情面板设计,实现线索的查看和编辑功能
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, 
  Edit3, 
  Check, 
  XIcon,
  Calendar,
  Phone,
  Mail,
  User,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Tag,
  UserCheck,
  FileText,
  Plus,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '../../types/lead';
import { leadService, serviceTypeService, mentorService } from '../../services';
import { LeadLog } from '../../services/leadService';
import { ServiceType } from '../../services/serviceTypeService';
import { Mentor } from '../../services/mentorService';
import { simplifyDateFormat } from '../../utils/dateUtils';
import { toast } from 'react-hot-toast';

interface LeadDetailPanelProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
  serviceTypes?: ServiceType[];
  mentors?: Mentor[];
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  isOpen,
  lead,
  onClose,
  onUpdate,
  serviceTypes = [],
  mentors = []
}) => {
  // 编辑状态
  const [editingField, setEditingField] = useState<'name' | 'email' | 'phone' | 'gender' | 'source' | 'status' | 'priority' | 'assignedTo' | 'interest' | 'notes' | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 跟进记录状态
  const [logs, setLogs] = useState<LeadLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [newLogContent, setNewLogContent] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [submittingLog, setSubmittingLog] = useState(false);
  const [editingLog, setEditingLog] = useState<number | null>(null);
  const [editLogContent, setEditLogContent] = useState('');
  const [editLogNextFollowUp, setEditLogNextFollowUp] = useState('');
  
  const logTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 加载跟进记录
  const loadLogs = useCallback(async () => {
    if (!lead) return;
    
    setLoadingLogs(true);
    try {
      const data = await leadService.getLeadLogs(lead.id);
      setLogs(data);
    } catch (error) {
      console.error('加载跟进记录失败:', error);
      toast.error('加载跟进记录失败');
    } finally {
      setLoadingLogs(false);
    }
  }, [lead]);

  // 当线索改变时加载跟进记录
  useEffect(() => {
    if (isOpen && lead) {
      loadLogs();
    }
  }, [isOpen, lead, loadLogs]);

  // 开始编辑字段
  const startEdit = (field: typeof editingField, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // 保存编辑
  const saveEdit = async () => {
    if (!lead || !editingField) return;

    try {
      const updatedData: Partial<Lead> = {
        [editingField]: editValue
      };

      const updatedLead = await leadService.updateLead(lead.id, updatedData);
      onUpdate(updatedLead);
      toast.success('更新成功');
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('更新失败:', error);
      toast.error('更新失败');
    }
  };

  // 添加跟进记录
  const handleAddLog = async () => {
    if (!lead || !newLogContent.trim()) {
      toast.error('请填写跟进内容');
      return;
    }

    setSubmittingLog(true);
    try {
      await leadService.createLeadLog({
        lead_id: lead.id,
        content: newLogContent.trim(),
        next_follow_up: nextFollowUpDate || null
      });
      
      toast.success('添加跟进记录成功');
      setNewLogContent('');
      setNextFollowUpDate('');
      loadLogs();
    } catch (error) {
      console.error('添加跟进记录失败:', error);
      toast.error('添加跟进记录失败');
    } finally {
      setSubmittingLog(false);
    }
  };

  // 删除跟进记录
  const handleDeleteLog = async (logId: number) => {
    if (!confirm('确定要删除这条跟进记录吗?')) return;

    try {
      await leadService.deleteLeadLog(logId);
      toast.success('删除成功');
      loadLogs();
    } catch (error) {
      console.error('删除跟进记录失败:', error);
      toast.error('删除失败');
    }
  };

  // 开始编辑日志
  const startEditLog = (log: LeadLog) => {
    setEditingLog(log.id);
    setEditLogContent(log.content);
    setEditLogNextFollowUp(log.next_follow_up || '');
  };

  // 保存日志编辑
  const saveLogEdit = async () => {
    if (!editingLog || !editLogContent.trim()) {
      toast.error('请填写跟进内容');
      return;
    }

    try {
      await leadService.updateLeadLog(editingLog, {
        content: editLogContent.trim(),
        next_follow_up: editLogNextFollowUp || null
      });
      
      toast.success('更新成功');
      setEditingLog(null);
      setEditLogContent('');
      setEditLogNextFollowUp('');
      loadLogs();
    } catch (error) {
      console.error('更新跟进记录失败:', error);
      toast.error('更新失败');
    }
  };

  // 取消日志编辑
  const cancelLogEdit = () => {
    setEditingLog(null);
    setEditLogContent('');
    setEditLogNextFollowUp('');
  };

  // 获取服务类型名称
  const getServiceTypeName = (id: string | number) => {
    const type = serviceTypes.find(t => String(t.id) === String(id));
    return type?.name || '未指定';
  };

  // 获取导师名称
  const getMentorName = (id: string | number) => {
    const mentor = mentors.find(m => String(m.id) === String(id));
    return mentor?.name || '未分配';
  };

  // 状态标签样式
  const getStatusStyle = (status: LeadStatus) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      qualified: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      converted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return styles[status] || styles.new;
  };

  // 优先级标签样式
  const getPriorityStyle = (priority: LeadPriority) => {
    const styles = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return styles[priority] || styles.medium;
  };

  // 状态中文
  const getStatusText = (status: LeadStatus) => {
    const texts = {
      new: '新线索',
      contacted: '已联系',
      qualified: '已评估',
      converted: '已转化',
      closed: '已关闭'
    };
    return texts[status] || status;
  };

  // 优先级中文
  const getPriorityText = (priority: LeadPriority) => {
    const texts = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    };
    return texts[priority] || priority;
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* 侧边面板 */}
      <div className={`absolute right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 flex flex-col ${
        isFullscreen ? 'w-full' : 'w-full max-w-3xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">线索详情</h2>
              <p className="text-sm text-blue-100">查看和编辑线索信息</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isFullscreen ? '退出全屏' : '全屏'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`px-6 py-6 space-y-6 ${isFullscreen ? 'max-w-6xl mx-auto' : ''}`}>
            
            {/* 基本信息 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                基本信息
              </h3>

              {/* 姓名 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">姓名</label>
                  {editingField !== 'name' && (
                    <button
                      onClick={() => startEdit('name', lead.name)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'name' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white font-medium">{lead.name}</div>
                )}
              </div>

              {/* 性别 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">性别</label>
                  {editingField !== 'gender' && (
                    <button
                      onClick={() => startEdit('gender', lead.gender || '')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'gender' ? (
                  <div className="flex gap-2">
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">未指定</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white">{lead.gender || '未指定'}</div>
                )}
              </div>

              {/* 邮箱 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    邮箱
                  </label>
                  {editingField !== 'email' && (
                    <button
                      onClick={() => startEdit('email', lead.email || '')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'email' ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white">{lead.email || '未填写'}</div>
                )}
              </div>

              {/* 电话 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    电话
                  </label>
                  {editingField !== 'phone' && (
                    <button
                      onClick={() => startEdit('phone', lead.phone || '')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'phone' ? (
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white">{lead.phone || '未填写'}</div>
                )}
              </div>
            </div>

            {/* 线索信息 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                线索信息
              </h3>

              {/* 来源 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">来源</label>
                  {editingField !== 'source' && (
                    <button
                      onClick={() => startEdit('source', lead.source)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'source' ? (
                  <div className="flex gap-2">
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="官网表单">官网表单</option>
                      <option value="社交媒体">社交媒体</option>
                      <option value="转介绍">转介绍</option>
                      <option value="合作方">合作方</option>
                      <option value="电话咨询">电话咨询</option>
                      <option value="其他">其他</option>
                    </select>
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white">{lead.source}</div>
                )}
              </div>

              {/* 意向项目 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">意向项目</label>
                  {editingField !== 'interest' && (
                    <button
                      onClick={() => startEdit('interest', lead.interest || '')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'interest' ? (
                  <div className="flex gap-2">
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">未指定</option>
                      {serviceTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white">{getServiceTypeName(lead.interest)}</div>
                )}
              </div>

              {/* 负责顾问 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    负责顾问
                  </label>
                  {editingField !== 'assignedTo' && (
                    <button
                      onClick={() => startEdit('assignedTo', lead.assignedTo || '')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'assignedTo' ? (
                  <div className="flex gap-2">
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">未分配</option>
                      {mentors.map(mentor => (
                        <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                      ))}
                    </select>
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-white">{getMentorName(lead.assignedTo)}</div>
                )}
              </div>

              {/* 状态 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">状态</label>
                  {editingField !== 'status' && (
                    <button
                      onClick={() => startEdit('status', lead.status)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'status' ? (
                  <div className="flex gap-2">
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="new">新线索</option>
                      <option value="contacted">已联系</option>
                      <option value="qualified">已评估</option>
                      <option value="converted">已转化</option>
                      <option value="closed">已关闭</option>
                    </select>
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(lead.status)}`}>
                    {getStatusText(lead.status)}
                  </span>
                )}
              </div>

              {/* 优先级 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    优先级
                  </label>
                  {editingField !== 'priority' && (
                    <button
                      onClick={() => startEdit('priority', lead.priority)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'priority' ? (
                  <div className="flex gap-2">
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="high">高优先级</option>
                      <option value="medium">中优先级</option>
                      <option value="low">低优先级</option>
                    </select>
                    <button onClick={saveEdit} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityStyle(lead.priority)}`}>
                    {getPriorityText(lead.priority)}
                  </span>
                )}
              </div>

              {/* 接入日期 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  接入日期
                </label>
                <div className="text-gray-900 dark:text-white">{simplifyDateFormat(lead.date)}</div>
              </div>

              {/* 最后联系 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  最后联系
                </label>
                <div className="text-gray-900 dark:text-white">{simplifyDateFormat(lead.lastContact)}</div>
              </div>
            </div>

            {/* 备注 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  备注
                </h3>
                {editingField !== 'notes' && (
                  <button
                    onClick={() => startEdit('notes', lead.notes || '')}
                    className="text-blue-600 hover:text-blue-700 p-1"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editingField === 'notes' ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    placeholder="添加备注..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      保存
                    </button>
                    <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {lead.notes || '暂无备注'}
                </div>
              )}
            </div>

            {/* 跟进记录 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                跟进记录
              </h3>

              {/* 添加跟进记录 */}
              <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <textarea
                  ref={logTextareaRef}
                  value={newLogContent}
                  onChange={(e) => setNewLogContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="添加跟进记录..."
                />
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    placeholder="下次跟进日期"
                  />
                  <button
                    onClick={handleAddLog}
                    disabled={submittingLog || !newLogContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加记录
                  </button>
                </div>
              </div>

              {/* 跟进记录列表 */}
              <div className="space-y-3">
                {loadingLogs ? (
                  <div className="text-center py-8 text-gray-500">加载中...</div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">暂无跟进记录</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      {editingLog === log.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editLogContent}
                            onChange={(e) => setEditLogContent(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                          />
                          <input
                            type="date"
                            value={editLogNextFollowUp}
                            onChange={(e) => setEditLogNextFollowUp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                            placeholder="下次跟进日期"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveLogEdit}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelLogEdit}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{log.employee_name || '系统'}</span>
                              <span>•</span>
                              <Clock className="w-4 h-4" />
                              <span>{simplifyDateFormat(log.log_date)}</span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEditLog(log)}
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-900 dark:text-white whitespace-pre-wrap mb-2">
                            {log.content}
                          </p>
                          {log.next_follow_up && (
                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                              <Calendar className="w-4 h-4" />
                              <span>下次跟进: {simplifyDateFormat(log.next_follow_up)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPanel;


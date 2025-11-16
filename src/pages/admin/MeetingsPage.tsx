/**
 * 会议管理主页
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  List,
  LayoutGrid,
} from 'lucide-react';
import { getMeetings, getMeetingStats, createMeeting, updateMeeting, deleteMeeting, updateMeetingStatus } from './MeetingManagement/services/meetingService';
import { Meeting, MeetingStats, MeetingFilter, MeetingType, MeetingStatus, MeetingFormData } from './MeetingManagement/types';
import MeetingCard from './MeetingManagement/components/MeetingCard';
import MeetingStatsCard from './MeetingManagement/components/MeetingStatsCard';
import CreateMeetingModal from './MeetingManagement/components/CreateMeetingModal';

export default function MeetingsPage() {
  const navigate = useNavigate();
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<MeetingStats>({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    this_week: 0,
    this_month: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [filter, setFilter] = useState<MeetingFilter>({
    search: '',
    meeting_type: 'all',
    status: 'all',
    date_range: {}
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatDateTimeLocalValue = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const tzOffset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - tzOffset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const buildFormDataFromMeeting = (meeting: Meeting): MeetingFormData => ({
    title: meeting.title,
    meeting_type: meeting.meeting_type,
    status: meeting.status,
    start_time: formatDateTimeLocalValue(meeting.start_time),
    end_time: formatDateTimeLocalValue(meeting.end_time),
    location: meeting.location || '',
    meeting_link: meeting.meeting_link || '',
    participants: meeting.participants || [],
    agenda: meeting.agenda || '',
    summary: meeting.summary || '',
    minutes: meeting.minutes || '',
  });

const formatDateTimeForList = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('zh-CN', { hour12: false });
};

  // 加载数据
  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsData, statsData] = await Promise.all([
        getMeetings(filter),
        getMeetingStats()
      ]);
      setMeetings(meetingsData);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (data: MeetingFormData) => {
    try {
      // 从 localStorage 获取当前用户信息
      const employeeData = localStorage.getItem('currentEmployee');
      if (!employeeData) {
        alert('用户信息获取失败');
        return;
      }

      const employee = JSON.parse(employeeData);
      await createMeeting(data, employee.id);
      await loadData();
      alert('会议创建成功!');
    } catch (error) {
      console.error('创建会议失败:', error);
      throw error;
    }
  };

  const handleUpdateMeetingData = async (meetingId: number, data: MeetingFormData) => {
    try {
      await updateMeeting(meetingId, data);
      await loadData();
      alert('会议更新成功!');
    } catch (error) {
      console.error('更新会议失败:', error);
      throw error;
    }
  };

  const handleStartMeeting = (meeting: Meeting) => {
    if (meeting.meeting_link) {
      window.open(meeting.meeting_link, '_blank', 'noopener,noreferrer');
    } else {
      alert('该会议暂无线上链接，请在会议信息中补充会议链接后再尝试发起。');
    }
  };

  const handleDeleteMeeting = async (meeting: Meeting) => {
    const confirmed = window.confirm(`确定要删除会议「${meeting.title}」吗？删除后无法恢复。`);
    if (!confirmed) return;

    try {
      await deleteMeeting(meeting.id);
      await loadData();
      alert('会议已删除');
    } catch (error) {
      console.error('删除会议失败:', error);
      alert('删除会议失败，请稍后重试。');
    }
  };

  const handleCompleteMeeting = async (meeting: Meeting) => {
    // 将会议状态切换为已完成
    const confirmed = window.confirm(`确定要将会议「${meeting.title}」标记为已完成吗？`);
    if (!confirmed) return;

    try {
      await updateMeetingStatus(meeting.id, '已完成');
      await loadData();
    } catch (error) {
      console.error('更新会议状态失败:', error);
      alert('更新会议状态失败，请稍后重试。');
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingMeeting(null);
  };

  const openCreateModal = () => {
    setEditingMeeting(null);
    setModalMode('create');
  };

  const openEditModal = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setModalMode('edit');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">会议管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            管理和跟踪所有会议记录
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              卡片
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
              列表
            </button>
          </div>
          <button
            onClick={() => navigate('/admin/meeting-documents/new')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <FileText className="h-5 w-5" />
            创建会议文档
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            创建会议
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MeetingStatsCard
          title="总会议数"
          value={stats.total}
          icon={Calendar}
          color="blue"
        />
        <MeetingStatsCard
          title="待举行"
          value={stats.upcoming}
          icon={Clock}
          color="yellow"
        />
        <MeetingStatsCard
          title="已完成"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
        />
        <MeetingStatsCard
          title="本周会议"
          value={stats.this_week}
          icon={TrendingUp}
          color="purple"
          subtitle={`本月 ${stats.this_month} 个`}
        />
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="搜索会议标题或摘要..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 会议类型筛选 */}
          <select
            value={filter.meeting_type}
            onChange={(e) => setFilter({ ...filter, meeting_type: e.target.value as MeetingType | 'all' })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">所有类型</option>
            <option value="初次咨询">初次咨询</option>
            <option value="选校讨论">选校讨论</option>
            <option value="文书指导">文书指导</option>
            <option value="面试辅导">面试辅导</option>
            <option value="签证指导">签证指导</option>
            <option value="行前准备">行前准备</option>
            <option value="日常进度沟通">日常进度沟通</option>
            <option value="团队例会">团队例会</option>
            <option value="客户沟通">客户沟通</option>
            <option value="项目评审">项目评审</option>
            <option value="培训会议">培训会议</option>
            <option value="其他">其他</option>
          </select>

          {/* 状态筛选 */}
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value as MeetingStatus | 'all' })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">所有状态</option>
            <option value="待举行">待举行</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
            <option value="延期">延期</option>
          </select>
        </div>
      </div>

      {/* 会议列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">加载中...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无会议记录
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            创建第一个会议记录开始吧
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            创建会议
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onClick={() => navigate(`/admin/meetings/${meeting.id}`)}
              onEditDocument={(e) => {
                e.stopPropagation();
                navigate(`/admin/meetings/${meeting.id}?edit=true`);
              }}
              onEditMeeting={(e) => {
                e.stopPropagation();
                openEditModal(meeting);
              }}
              onStartMeeting={(e) => {
                e.stopPropagation();
                handleStartMeeting(meeting);
              }}
              onDeleteMeeting={(e) => {
                e.stopPropagation();
                handleDeleteMeeting(meeting);
              }}
              onCompleteMeeting={(e) => {
                e.stopPropagation();
                handleCompleteMeeting(meeting);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会议</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会议链接</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参会人</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <button
                        className="text-left hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => navigate(`/admin/meetings/${meeting.id}`)}
                      >
                        {meeting.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{meeting.meeting_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{meeting.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {formatDateTimeForList(meeting.start_time)}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
                      {meeting.meeting_link ? (
                        <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          查看链接
                        </a>
                      ) : (
                        <span className="text-gray-400">暂无</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {meeting.participants?.slice(0, 2).map((p) => p.name).join('、') || '—'}
                      {meeting.participants && meeting.participants.length > 2 && (
                        <span className="text-xs text-gray-400"> (+{meeting.participants.length - 2})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {meeting.status !== '已完成' && (
                          <button
                            onClick={() => handleCompleteMeeting(meeting)}
                            className="rounded-full border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            完成
                          </button>
                        )}
                        <button
                          onClick={() => handleStartMeeting(meeting)}
                          className="rounded-full border border-emerald-500 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                        >
                          开始
                        </button>
                        <button
                          onClick={() => openEditModal(meeting)}
                          className="rounded-full border border-indigo-500 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => navigate(`/admin/meetings/${meeting.id}?edit=true`)}
                          className="rounded-full border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20"
                        >
                          文档
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(meeting)}
                          className="rounded-full border border-red-500 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 创建/编辑会议模态框 */}
      {modalMode && (
        <CreateMeetingModal
          mode={modalMode}
          onClose={closeModal}
          onSave={
            modalMode === 'edit' && editingMeeting
              ? (data) => handleUpdateMeetingData(editingMeeting.id, data)
              : handleCreateMeeting
          }
          initialData={
            modalMode === 'edit' && editingMeeting
              ? buildFormDataFromMeeting(editingMeeting)
              : undefined
          }
        />
      )}
    </div>
  );
}


/**
 * 会议详情页面
 * 显示会议详细信息和会议纪要编辑
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Link as LinkIcon,
  Edit,
  Save,
  Loader2,
  Trash2,
  FileText
} from 'lucide-react';
import { getMeetingById, updateMeetingMinutes, updateMeetingStatus, deleteMeeting } from './MeetingManagement/services/meetingService';
import { Meeting } from './MeetingManagement/types';
import { formatDateTime } from '../../utils/dateUtils';
import RichTextEditor from '../../components/RichTextEditor';

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMinutes, setEditingMinutes] = useState(false);
  const [minutesContent, setMinutesContent] = useState('');

  useEffect(() => {
    if (id) {
      loadMeeting();
      // 检查是否有 edit 参数,如果有则自动进入编辑模式
      const shouldEdit = searchParams.get('edit') === 'true';
      if (shouldEdit) {
        setEditingMinutes(true);
      }
    }
  }, [id, searchParams]);

  const loadMeeting = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await getMeetingById(Number(id));
      if (data) {
        setMeeting(data);
        setMinutesContent(data.minutes || '');
      }
    } catch (error) {
      console.error('加载会议详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMinutes = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      await updateMeetingMinutes(Number(id), minutesContent);
      setEditingMinutes(false);
      await loadMeeting();
      alert('会议纪要保存成功!');
    } catch (error) {
      console.error('保存会议纪要失败:', error);
      alert('保存失败,请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!id) return;
    
    try {
      await updateMeetingStatus(Number(id), status);
      await loadMeeting();
      alert('状态更新成功!');
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新失败,请重试');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('确定要删除此会议吗?此操作不可撤销。')) return;
    
    try {
      await deleteMeeting(Number(id));
      alert('会议已删除');
      navigate('/admin/meetings');
    } catch (error) {
      console.error('删除会议失败:', error);
      alert('删除失败,请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">会议不存在</p>
          <button
            onClick={() => navigate('/admin/meetings')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/admin/meetings')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          返回列表
        </button>

        {/* 会议标题和操作 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {meeting.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {meeting.meeting_type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {meeting.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="删除会议"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 会议信息 */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <span className="font-medium mr-2">开始时间:</span>
              <span>{formatDateTime(meeting.start_time)}</span>
            </div>
            
            {meeting.end_time && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Clock className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium mr-2">结束时间:</span>
                <span>{formatDateTime(meeting.end_time)}</span>
              </div>
            )}

            {meeting.location && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium mr-2">地点:</span>
                <span>{meeting.location}</span>
              </div>
            )}

            {meeting.meeting_link && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <LinkIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium mr-2">会议链接:</span>
                <a
                  href={meeting.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {meeting.meeting_link}
                </a>
              </div>
            )}

            {/* 参会人 */}
            {meeting.participants && meeting.participants.length > 0 && (
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <Users className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                <div>
                  <span className="font-medium mr-2">参会人:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {meeting.participants.map((participant, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {participant.name}
                        {participant.role && (
                          <span className="ml-1 text-xs text-gray-500">({participant.role})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 会议议程 */}
          {meeting.agenda && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">会议议程</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{meeting.agenda}</p>
            </div>
          )}

          {/* 会议总结 */}
          {meeting.summary && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">会议总结</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{meeting.summary}</p>
            </div>
          )}
        </div>

        {/* 会议纪要 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              会议纪要
            </h2>
            {!editingMinutes ? (
              <button
                onClick={() => setEditingMinutes(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                编辑纪要
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingMinutes(false);
                    setMinutesContent(meeting.minutes || '');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveMinutes}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      保存
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {editingMinutes ? (
            <RichTextEditor
              content={minutesContent}
              onChange={setMinutesContent}
              placeholder="在此记录会议纪要..."
              minHeight="400px"
            />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {minutesContent ? (
                <div dangerouslySetInnerHTML={{ __html: minutesContent }} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                  暂无会议纪要,点击编辑按钮开始记录
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/**
 * 快速创建会议组件
 * 用于在任务创建/编辑时快速创建关联会议
 */

import React, { useState } from 'react';
import { Calendar, Clock, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QuickMeetingCreatorProps {
  taskTitle: string;
  onMeetingCreated: (meetingId: number) => void;
  onCancel: () => void;
}

const QuickMeetingCreator: React.FC<QuickMeetingCreatorProps> = ({
  taskTitle,
  onMeetingCreated,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: `${taskTitle} - 会议`,
    meeting_type: '日常进度沟通',
    start_time: '',
    end_time: '',
    location: '',
    meeting_link: '',
    agenda: '',
  });

  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!formData.title || !formData.start_time) {
      toast.error('请填写会议标题和开始时间');
      return;
    }

    setCreating(true);

    try {
      // 获取当前用户
      const currentEmployee = localStorage.getItem('currentEmployee');
      const createdBy = currentEmployee ? JSON.parse(currentEmployee).id : null;

      if (!createdBy) {
        toast.error('未找到当前用户信息');
        return;
      }

      // 调用会议服务创建会议
      const { createMeeting } = await import('../../../MeetingManagement/services/meetingService');
      
      const meetingData = {
        title: formData.title,
        meeting_type: formData.meeting_type as any,
        status: '待举行' as any,
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
        location: formData.location || undefined,
        meeting_link: formData.meeting_link || undefined,
        agenda: formData.agenda || undefined,
        participants: [],
      };

      const newMeeting = await createMeeting(meetingData, createdBy);

      if (newMeeting) {
        toast.success('会议创建成功！');
        onMeetingCreated(newMeeting.id);
      } else {
        toast.error('创建会议失败');
      }
    } catch (error) {
      console.error('创建会议失败:', error);
      toast.error(error instanceof Error ? error.message : '创建会议失败');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-300 dark:border-purple-600 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600" />
          快速创建会议
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* 会议标题 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            会议标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="输入会议标题"
          />
        </div>

        {/* 会议类型 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            会议类型
          </label>
          <select
            value={formData.meeting_type}
            onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
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
        </div>

        {/* 开始时间 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              开始时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* 结束时间 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              结束时间
            </label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* 地点/链接 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              会议地点
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="会议室或地址"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              会议链接
            </label>
            <input
              type="url"
              value={formData.meeting_link}
              onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Zoom/Teams链接"
            />
          </div>
        </div>

        {/* 会议议程 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            会议议程
          </label>
          <textarea
            value={formData.agenda}
            onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            placeholder="讨论内容、目标等..."
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCreate}
            disabled={creating || !formData.title || !formData.start_time}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {creating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                创建中...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                创建并关联
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={creating}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickMeetingCreator;


/**
 * 创建定期会议模态框
 */

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Repeat, Save } from 'lucide-react';
import { 
  RecurringMeetingTemplateFormData,
  RecurringFrequency,
  RecurringEndType,
  MeetingType
} from '../types/recurring';
import { MeetingType as StandardMeetingType } from '../types';

interface CreateRecurringMeetingModalProps {
  onClose: () => void;
  onSave: (data: RecurringMeetingTemplateFormData) => Promise<void>;
  initialStudentId?: number | null;
  initialData?: Partial<RecurringMeetingTemplateFormData>;
}

const WEEK_DAYS = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
];

export default function CreateRecurringMeetingModal({
  onClose,
  onSave,
  initialStudentId,
  initialData
}: CreateRecurringMeetingModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<RecurringMeetingTemplateFormData>({
    title: initialData?.title || '',
    meeting_type: initialData?.meeting_type || '日常进度沟通',
    frequency: initialData?.frequency || 'weekly',
    interval_value: initialData?.interval_value || 1,
    day_of_week: initialData?.day_of_week || [],
    start_time: initialData?.start_time || '14:00',
    duration_minutes: initialData?.duration_minutes || 60,
    end_type: initialData?.end_type || 'never',
    end_after_occurrences: initialData?.end_after_occurrences,
    end_on_date: initialData?.end_on_date,
    location: initialData?.location,
    meeting_link: initialData?.meeting_link,
    agenda: initialData?.agenda,
    participants: initialData?.participants || [],
    student_id: initialStudentId !== undefined ? initialStudentId : initialData?.student_id,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
    if (initialStudentId !== undefined) {
      setFormData(prev => ({ ...prev, student_id: initialStudentId }));
    }
  }, [initialData, initialStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('请输入会议标题');
      return;
    }

    if (!formData.start_time) {
      alert('请选择开始时间');
      return;
    }

    // 验证重复规则
    if (formData.frequency === 'weekly' && formData.day_of_week.length === 0) {
      alert('请至少选择一个星期');
      return;
    }

    if (formData.end_type === 'after_occurrences' && !formData.end_after_occurrences) {
      alert('请输入结束次数');
      return;
    }

    if (formData.end_type === 'on_date' && !formData.end_on_date) {
      alert('请选择结束日期');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = (frequency: RecurringFrequency) => {
    setFormData(prev => ({
      ...prev,
      frequency,
      // 重置相关字段
      day_of_week: frequency === 'weekly' || frequency === 'biweekly' ? prev.day_of_week : [],
      day_of_month: frequency === 'monthly' ? prev.day_of_month : undefined,
      week_of_month: frequency === 'monthly' ? prev.week_of_month : undefined,
    }));
  };

  const toggleDayOfWeek = (day: number) => {
    setFormData(prev => {
      const days = prev.day_of_week || [];
      if (days.includes(day)) {
        return { ...prev, day_of_week: days.filter(d => d !== day) };
      } else {
        return { ...prev, day_of_week: [...days, day] };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Repeat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">创建定期会议</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 会议标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              会议标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：每周进度会议"
              required
            />
          </div>

          {/* 会议类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              会议类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.meeting_type}
              onChange={(e) => setFormData(prev => ({ ...prev, meeting_type: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="日常进度沟通">日常进度沟通</option>
              <option value="选校讨论">选校讨论</option>
              <option value="文书指导">文书指导</option>
              <option value="面试辅导">面试辅导</option>
              <option value="签证指导">签证指导</option>
              <option value="行前准备">行前准备</option>
              <option value="团队例会">团队例会</option>
              <option value="客户沟通">客户沟通</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {/* 重复频率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              重复频率 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['weekly', 'biweekly', 'monthly'] as RecurringFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => handleFrequencyChange(freq)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.frequency === freq
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {freq === 'weekly' ? '每周' : freq === 'biweekly' ? '每两周' : '每月'}
                </button>
              ))}
            </div>
          </div>

          {/* 星期选择（周重复） */}
          {(formData.frequency === 'weekly' || formData.frequency === 'biweekly') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择星期 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDayOfWeek(day.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.day_of_week?.includes(day.value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 每月设置（月重复） */}
          {formData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                每月设置
              </label>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.day_of_month !== undefined}
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        day_of_month: 1,
                        week_of_month: undefined
                      }))}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">每月第几天</span>
                  </label>
                  {formData.day_of_month !== undefined && (
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.day_of_month || 1}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        day_of_month: parseInt(e.target.value) || 1
                      }))}
                      className="mt-2 w-32 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.week_of_month !== undefined}
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        week_of_month: 1,
                        day_of_month: undefined,
                        day_of_week: [1] // 默认周一
                      }))}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">每月第几周的星期几</span>
                  </label>
                  {formData.week_of_month !== undefined && (
                    <div className="mt-2 space-y-2">
                      <select
                        value={formData.week_of_month}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          week_of_month: parseInt(e.target.value)
                        }))}
                        className="w-32 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="1">第1周</option>
                        <option value="2">第2周</option>
                        <option value="3">第3周</option>
                        <option value="4">第4周</option>
                        <option value="-1">最后一周</option>
                      </select>
                      <select
                        value={formData.day_of_week?.[0] || 1}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          day_of_week: [parseInt(e.target.value)]
                        }))}
                        className="ml-2 w-32 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {WEEK_DAYS.map(day => (
                          <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 时间设置 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                开始时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会议时长（分钟）
              </label>
              <input
                type="number"
                min="15"
                max="480"
                step="15"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  duration_minutes: parseInt(e.target.value) || 60
                }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 结束条件 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              结束条件
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.end_type === 'never'}
                  onChange={() => setFormData(prev => ({ ...prev, end_type: 'never' }))}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">永不结束</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.end_type === 'after_occurrences'}
                  onChange={() => setFormData(prev => ({ ...prev, end_type: 'after_occurrences' }))}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">结束于</span>
                {formData.end_type === 'after_occurrences' && (
                  <input
                    type="number"
                    min="1"
                    value={formData.end_after_occurrences || 10}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      end_after_occurrences: parseInt(e.target.value) || 10
                    }))}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">次后</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.end_type === 'on_date'}
                  onChange={() => setFormData(prev => ({ ...prev, end_type: 'on_date' }))}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">结束于</span>
                {formData.end_type === 'on_date' && (
                  <input
                    type="date"
                    value={formData.end_on_date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_on_date: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                )}
              </label>
            </div>
          </div>

          {/* 地点和链接 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                地点
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="会议室或线上"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会议链接
              </label>
              <input
                type="url"
                value={formData.meeting_link || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* 议程 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              会议议程
            </label>
            <textarea
              value={formData.agenda || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="会议讨论内容..."
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  创建定期会议
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


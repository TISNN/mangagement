/**
 * 添加会议记录模态框
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, FileText, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { StudentMeeting } from '../types';
import { supabase } from '../../../../lib/supabase';

interface AddMeetingModalProps {
  studentId: number;
  onClose: () => void;
  onSave: (meeting: Partial<StudentMeeting>) => Promise<void>;
}

interface Mentor {
  id: number;
  name: string;
}

export default function AddMeetingModal({ studentId, onClose, onSave }: AddMeetingModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [formData, setFormData] = useState<Partial<StudentMeeting>>({
    student_id: studentId,
    title: '',
    summary: '',
    start_time: '',
    end_time: '',
    participants: [],
    meeting_type: '初次咨询',
    status: '已安排',
    meeting_notes: '',
    meeting_link: '',
    meeting_documents: []
  });

  const [participantInput, setParticipantInput] = useState('');
  const [showMentorSelect, setShowMentorSelect] = useState(false);

  // 加载导师列表
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setMentors(data || []);
      } catch (error) {
        console.error('加载导师列表失败:', error);
      } finally {
        setLoadingMentors(false);
      }
    };

    fetchMentors();
  }, []);

  // 会议类型选项
  const meetingTypes = [
    '初次咨询',
    '选校讨论',
    '文书指导',
    '面试辅导',
    '签证指导',
    '行前准备',
    '日常进度沟通',
    '其他'
  ];

  // 会议状态选项
  const meetingStatuses = [
    '已安排',
    '进行中',
    '已完成',
    '已取消'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formData.title || !formData.start_time) {
      alert('请填写会议标题和开始时间');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('保存会议记录失败:', error);
      alert('保存失败,请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof StudentMeeting, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 添加参会人
  const addParticipant = () => {
    if (participantInput.trim()) {
      updateField('participants', [...(formData.participants || []), participantInput.trim()]);
      setParticipantInput('');
    }
  };

  // 从导师列表选择参会人
  const addMentorAsParticipant = (mentorName: string) => {
    if (!formData.participants?.includes(mentorName)) {
      updateField('participants', [...(formData.participants || []), mentorName]);
    }
    setShowMentorSelect(false);
  };

  // 删除参会人
  const removeParticipant = (index: number) => {
    updateField('participants', formData.participants?.filter((_, i) => i !== index) || []);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">添加会议记录</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                基本信息
              </h3>

              {/* 会议标题 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  会议标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: 选校规划讨论会议"
                  required
                />
              </div>

              {/* 会议类型和状态 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    会议类型
                  </label>
                  <select
                    value={formData.meeting_type}
                    onChange={(e) => updateField('meeting_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {meetingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    会议状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {meetingStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 开始和结束时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    开始时间 <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => updateField('start_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    结束时间
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => updateField('end_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 会议概要 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  会议概要
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="简要描述本次会议的主要内容..."
                />
              </div>
            </div>

            {/* 参会人 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                参会人
              </h3>

              {/* 从导师库选择 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMentorSelect(!showMentorSelect)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left flex items-center justify-between"
                >
                  <span className="text-sm">从导师库选择</span>
                  <Users className="h-4 w-4" />
                </button>

                {showMentorSelect && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {loadingMentors ? (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                        加载中...
                      </div>
                    ) : mentors.length === 0 ? (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                        暂无导师
                      </div>
                    ) : (
                      <div className="py-1">
                        {mentors.map((mentor) => (
                          <button
                            key={mentor.id}
                            type="button"
                            onClick={() => addMentorAsParticipant(mentor.name)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {mentor.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 手动输入 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="或手动输入参会人姓名"
                />
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  添加
                </button>
              </div>

              {formData.participants && formData.participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      <span className="text-sm">{participant}</span>
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 会议链接 */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                <LinkIcon className="h-3 w-3 mr-1" />
                会议链接
              </label>
              <input
                type="url"
                value={formData.meeting_link}
                onChange={(e) => updateField('meeting_link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Zoom / Tencent Meeting / 飞书等会议链接"
              />
            </div>

            {/* 会议笔记 */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                会议笔记
              </label>
              <textarea
                value={formData.meeting_notes}
                onChange={(e) => updateField('meeting_notes', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="详细记录本次会议的讨论内容、决定事项、待办事项等..."
              />
            </div>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}


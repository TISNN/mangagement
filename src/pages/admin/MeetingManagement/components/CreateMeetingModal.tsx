/**
 * 创建/编辑会议模态框
 */

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Link as LinkIcon, Users, Plus, Loader2, Save, Wand2 } from 'lucide-react';
import { MeetingFormData, MeetingType, MeetingStatus, Participant } from '../types';
import { getMentors, getStudents, getEmployees } from '../services/meetingService';

interface CreateMeetingModalProps {
  onClose: () => void;
  onSave: (data: MeetingFormData) => Promise<void>;
  initialData?: Partial<MeetingFormData>;
  mode?: 'create' | 'edit';
}

const buildInitialFormData = (initialData?: Partial<MeetingFormData>): MeetingFormData => ({
  title: initialData?.title || '',
  meeting_type: initialData?.meeting_type || '日常进度沟通',
  status: initialData?.status || '待举行',
  start_time: initialData?.start_time || '',
  end_time: initialData?.end_time || '',
  location: initialData?.location || '',
  meeting_link: initialData?.meeting_link || '',
  participants: initialData?.participants || [],
  agenda: initialData?.agenda || '',
  summary: initialData?.summary || '',
  minutes: initialData?.minutes || '',
});

export default function CreateMeetingModal({ onClose, onSave, initialData, mode = 'create' }: CreateMeetingModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<MeetingFormData>(buildInitialFormData(initialData));
  const [parserInput, setParserInput] = useState('');
  const [showParser, setShowParser] = useState(false);

  useEffect(() => {
    setFormData(buildInitialFormData(initialData));
  }, [initialData]);

  // 参会人选择
  const [showParticipantSelect, setShowParticipantSelect] = useState(false);
  const [participantType, setParticipantType] = useState<'mentor' | 'student' | 'employee' | 'other'>('mentor');
  const [mentors, setMentors] = useState<Array<{ id: number; name: string; avatar_url?: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: number; name: string }>>([]);
  const [employees, setEmployees] = useState<Array<{ id: number; name: string; avatar?: string }>>([]);
  const [customParticipant, setCustomParticipant] = useState('');

  // 加载参会人列表
  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const [mentorData, studentData, employeeData] = await Promise.all([
        getMentors(),
        getStudents(),
        getEmployees()
      ]);
      setMentors(mentorData);
      setStudents(studentData);
      setEmployees(employeeData);
    } catch (error) {
      console.error('加载参会人列表失败:', error);
    }
  };

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

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('保存会议失败:', error);
      alert('保存失败,请重试');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof MeetingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 添加参会人
  const addParticipant = (participant: Participant) => {
    if (!formData.participants.find(p => p.id === participant.id)) {
      updateField('participants', [...formData.participants, participant]);
    }
  };

  // 添加自定义参会人
  const addCustomParticipant = () => {
    if (customParticipant.trim()) {
      const participant: Participant = {
        id: `custom-${Date.now()}`,
        name: customParticipant.trim(),
        type: 'other'
      };
      addParticipant(participant);
      setCustomParticipant('');
    }
  };

  // 移除参会人
  const removeParticipant = (id: string) => {
    updateField('participants', formData.participants.filter(p => p.id !== id));
  };

  const meetingTypes: MeetingType[] = [
    '初次咨询', '选校讨论', '文书指导', '面试辅导', '签证指导',
    '行前准备', '日常进度沟通', '团队例会', '客户沟通', '项目评审',
    '培训会议', '其他'
  ];

  const meetingStatuses: MeetingStatus[] = [
    '待举行', '进行中', '已完成', '已取消', '延期'
  ];

  const parseInvitation = (raw: string) => {
    const text = raw.trim();
    if (!text) return null;

    const titleMatch = text.match(/会议主题[：:]\s*(.+)/);
    const timeMatch = text.match(/会议时间[：:]\s*([0-9]{4}[\\/.-][0-9]{1,2}[\\/.-][0-9]{1,2})\s+([0-9]{1,2}:[0-9]{2})-([0-9]{1,2}:[0-9]{2})/);
    const tzMatch = text.match(/\(GMT([+|-]\d{2}):?(\d{2})?\)/);
    const linkMatch = text.match(/https?:\/\/\S+/);

    if (!timeMatch) return null;

    const [, datePart, startPart, endPart] = timeMatch;
    const normalizedDate = datePart.replace(/[.]/g, '/').replace(/-/g, '/');

    const toLocalValue = (time: string) => {
      const iso = new Date(`${normalizedDate} ${time}:00`);
      if (Number.isNaN(iso.getTime())) return '';
      const tzOffset = iso.getTimezoneOffset();
      const local = new Date(iso.getTime() - tzOffset * 60000);
      return local.toISOString().slice(0, 16);
    };

    return {
      title: titleMatch?.[1]?.trim(),
      start_time: toLocalValue(startPart),
      end_time: toLocalValue(endPart),
      meeting_link: linkMatch?.[0],
    };
  };

  const handleParse = () => {
    const parsed = parseInvitation(parserInput);
    if (!parsed) {
      alert('未能从文本中识别出有效的会议信息，请检查格式。');
      return;
    }
    if (parsed.title) updateField('title', parsed.title);
    if (parsed.start_time) updateField('start_time', parsed.start_time);
    if (parsed.end_time) updateField('end_time', parsed.end_time);
    if (parsed.meeting_link) updateField('meeting_link', parsed.meeting_link);
    setParserInput('');
    alert('已根据文本自动填充表单，请确认信息后保存。');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'edit' ? '编辑会议' : '创建会议'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">文本解析</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">粘贴会议邀请文本，自动提取标题/时间/链接。</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowParser(!showParser)}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {showParser ? '收起' : '展开'}
                </button>
              </div>
              {showParser && (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={parserInput}
                    onChange={(e) => setParserInput(e.target.value)}
                    rows={4}
                    placeholder="例如：\n会议主题：XXX\n会议时间：2025/11/16 17:00-18:00 (GMT+08:00)\nhttps://..."
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleParse}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <Wand2 className="h-4 w-4" />
                    一键填充
                  </button>
                </div>
              )}
            </div>

            {/* 会议标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会议标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="输入会议标题"
                required
              />
            </div>

            {/* 类型和状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  会议类型
                </label>
                <select
                  value={formData.meeting_type}
                  onChange={(e) => updateField('meeting_type', e.target.value as MeetingType)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {meetingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  会议状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value as MeetingStatus)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {meetingStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 时间 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  开始时间 *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => updateField('start_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  结束时间
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => updateField('end_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* 地点和链接 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  会议地点
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="会议室或地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <LinkIcon className="h-4 w-4 inline mr-1" />
                  会议链接
                </label>
                <input
                  type="url"
                  value={formData.meeting_link}
                  onChange={(e) => updateField('meeting_link', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Zoom/腾讯会议链接"
                />
              </div>
            </div>

            {/* 参会人 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                参会人
              </label>
              
              {/* 添加参会人按钮 */}
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setShowParticipantSelect(!showParticipantSelect)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  添加参会人
                </button>
              </div>

              {/* 参会人选择面板 */}
              {showParticipantSelect && (
                <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                  {/* 类型选择 */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setParticipantType('mentor')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        participantType === 'mentor'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      导师
                    </button>
                    <button
                      type="button"
                      onClick={() => setParticipantType('student')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        participantType === 'student'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      学生
                    </button>
                    <button
                      type="button"
                      onClick={() => setParticipantType('employee')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        participantType === 'employee'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      员工
                    </button>
                    <button
                      type="button"
                      onClick={() => setParticipantType('other')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        participantType === 'other'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      其他
                    </button>
                  </div>

                  {/* 列表 */}
                  <div className="max-h-48 overflow-y-auto">
                    {participantType === 'mentor' && mentors.map(mentor => (
                      <button
                        key={mentor.id}
                        type="button"
                        onClick={() => addParticipant({
                          id: `mentor-${mentor.id}`,
                          name: mentor.name,
                          type: 'mentor',
                          mentor_id: mentor.id,
                          avatar: mentor.avatar_url
                        })}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                      >
                        {mentor.name}
                      </button>
                    ))}
                    
                    {participantType === 'student' && students.map(student => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => addParticipant({
                          id: `student-${student.id}`,
                          name: student.name,
                          type: 'student',
                          student_id: student.id
                        })}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                      >
                        {student.name}
                      </button>
                    ))}
                    
                    {participantType === 'employee' && employees.map(employee => (
                      <button
                        key={employee.id}
                        type="button"
                        onClick={() => addParticipant({
                          id: `employee-${employee.id}`,
                          name: employee.name,
                          type: 'employee',
                          employee_id: employee.id,
                          avatar: employee.avatar
                        })}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                      >
                        {employee.name}
                      </button>
                    ))}
                    
                    {participantType === 'other' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customParticipant}
                          onChange={(e) => setCustomParticipant(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomParticipant())}
                          placeholder="输入姓名"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={addCustomParticipant}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          添加
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 已选参会人 */}
              {formData.participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full"
                    >
                      <span className="text-sm">{participant.name}</span>
                      <button
                        type="button"
                        onClick={() => removeParticipant(participant.id)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 会议议程 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会议议程
              </label>
              <textarea
                value={formData.agenda}
                onChange={(e) => updateField('agenda', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="会议议程内容..."
              />
            </div>

            {/* 会议总结 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会议总结
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="会议总结..."
              />
            </div>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : mode === 'edit' ? (
              <>
                <Save className="h-4 w-4" />
                保存修改
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                创建会议
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}









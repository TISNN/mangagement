// 导师详情页面

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  Languages,
  Mail,
  MapPin,
  MessageSquareQuote,
  Phone,
  Send,
  ClipboardCopy,
  Heart,
  Sparkles,
  Star,
  Target,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { MentorRecord } from './MentorManagement/types';
import {
  fetchMentorById,
  getMentorTasks,
  type MentorTask,
} from './MentorManagement/services/mentorManagementService';

const MentorDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 数据状态
  const [mentor, setMentor] = useState<MentorRecord | null>(null);
  const [relatedTasks, setRelatedTasks] = useState<MentorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI状态
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    type: '文书',
    deadline: '',
    priority: '高' as '高' | '中' | '低',
  });
  const [contactMessage, setContactMessage] = useState('您好，我想与您确认下一次辅导安排。');
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const noteTimeoutRef = useRef<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  // 加载导师数据
  useEffect(() => {
    if (!id) {
      setError('无效的导师ID');
      setLoading(false);
      return;
    }

    loadMentorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMentorData = async () => {
    try {
      setLoading(true);
      setError(null);

      const mentorData = await fetchMentorById(id!);
      
      if (!mentorData) {
        setError('未找到导师信息');
        setLoading(false);
        return;
      }

      setMentor(mentorData);

      // 获取导师任务（需要提取数字ID）
      const mentorId = typeof id === 'string' ? parseInt(id.replace('mentor-', '')) : parseInt(id || '');
      if (!isNaN(mentorId) && id) {
        // 如果导师关联了员工，可以通过员工ID查找任务
        const employeeId = (mentorData as MentorRecord & { employeeId?: number }).employeeId;
        const tasks = await getMentorTasks(mentorId, employeeId);
        setRelatedTasks(tasks);
      }
    } catch (err) {
      console.error('加载导师详情失败:', err);
      setError(err instanceof Error ? err.message : '加载失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mentor) return;
    setTaskForm({
      title: '',
      type: mentor.primaryRole,
      deadline: '',
      priority: '高',
    });
    setContactMessage(`您好 ${mentor.name} 老师，我想与您确认下一次辅导安排。`);
    setFavorite(false);
    setNote('');
    setNoteSaved(false);
    setCopiedField(null);
    setActionLog([]);
  }, [mentor]);

  useEffect(
    () => () => {
      if (noteTimeoutRef.current) {
        window.clearTimeout(noteTimeoutRef.current);
        noteTimeoutRef.current = null;
      }
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    },
    [],
  );

  const addActionLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setActionLog((prev) => [`${timestamp} · ${message}`, ...prev].slice(0, 6));
  };

  const handleFavoriteToggle = () => {
    setFavorite((prev) => {
      const next = !prev;
      addActionLog(next ? '已收藏导师到个人关注列表' : '已取消收藏');
      return next;
    });
  };

  const handleTaskFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addActionLog(`已为导师指派任务「${taskForm.title || '未命名任务'}」`);
    setAssignOpen(false);
    setTaskForm({
      title: '',
      type: mentor?.primaryRole ?? '文书',
      deadline: '',
      priority: '高',
    });
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addActionLog('已向导师发送联系意向');
    if (mentor) {
      setContactMessage(`您好 ${mentor.name} 老师，我想与您确认下一次辅导安排。`);
    }
    setContactOpen(false);
  };

  const handleCopy = async (value: string, field: 'email' | 'phone') => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      addActionLog(field === 'email' ? '已复制导师邮箱' : '已复制导师电话');
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedField(null);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error('复制失败', error);
    }
  };

  const handleSaveNote = () => {
    if (!note.trim()) return;
    setNoteSaved(true);
    addActionLog('已同步导师内部备忘');
    if (noteTimeoutRef.current) {
      window.clearTimeout(noteTimeoutRef.current);
    }
    noteTimeoutRef.current = window.setTimeout(() => {
      setNoteSaved(false);
      noteTimeoutRef.current = null;
    }, 2000);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">正在加载导师详情...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !mentor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <div className="max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {error || '未找到导师信息'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">请返回导师管理中心重新选择导师。</p>
            <button
              onClick={() => navigate('/admin/mentors')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
            <ArrowLeft className="h-4 w-4" /> 返回导师管理中心
            </button>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      label: '可用率',
      value: `${mentor.availabilityRate}%`,
      description: '近 4 周可预约时段占比',
      icon: <CalendarClock className="h-5 w-5 text-emerald-500" />,
    },
    {
      label: '利用率',
      value: `${mentor.utilizationRate}%`,
      description: '任务占用时间 / 可用时间',
      icon: <Clock className="h-5 w-5 text-amber-500" />,
    },
    {
      label: '满意度',
      value: mentor.satisfaction.toFixed(1),
      description: '学员反馈平均分',
      icon: <Star className="h-5 w-5 text-purple-500" />,
    },
    {
      label: '在辅学生',
      value: `${mentor.studentsCount}`,
      description: '当前在辅学员数量',
      icon: <Users className="h-5 w-5 text-blue-500" />,
    },
  ];

  const combinedMetrics = mentor.metrics ? [...mentor.metrics] : [];
  const canCopyPhone = mentor.phone !== '暂未共享';

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
            <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
          <ArrowLeft className="h-4 w-4" /> 返回上一页
            </button>
            
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 shadow-lg dark:border-indigo-900">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" aria-hidden />
          <div className="relative flex flex-col gap-8 p-8 text-white md:flex-row md:items-end md:justify-between md:p-12">
            <div className="flex items-start gap-6">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="h-32 w-32 rounded-2xl border-4 border-white/30 object-cover shadow-xl"
              />
              <div className="space-y-4">
                  <div>
                  <p className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-widest">
                    {mentor.primaryRole} · {mentor.secondaryRoles.join(' / ')}
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{mentor.name}</h1>
                  {mentor.headline && <p className="mt-2 text-sm text-white/80">{mentor.headline}</p>}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {mentor.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/15 px-3 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                    <Globe2 className="h-3.5 w-3.5" /> 时区 {mentor.timezone}
                  </span>
                  {mentor.languages.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                      <Languages className="h-3.5 w-3.5" /> 语言 {mentor.languages.join(' / ')}
                    </span>
                  )}
                  {mentor.pricePerHour && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                      <Sparkles className="h-3.5 w-3.5" /> 时薪 ¥{mentor.pricePerHour}/小时
                    </span>
                  )}
                  {mentor.experienceYears && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 经验 {mentor.experienceYears} 年
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={handleFavoriteToggle}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  favorite ? 'bg-rose-600 text-white shadow-md hover:bg-rose-500' : 'border border-white/40 text-white hover:bg-white/15'
                }`}
              >
                <Heart className="h-4 w-4" fill={favorite ? 'currentColor' : 'none'} />
                {favorite ? '已收藏导师' : '收藏导师'}
              </button>
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <Mail className="h-4 w-4" />
                联系导师
              </button>
              <button
                onClick={() => setAssignOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-indigo-50"
              >
                <Sparkles className="h-4 w-4" /> 指派新任务
              </button>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
                {metric.icon}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
            </div>
          ))}
        </section>

        {combinedMetrics.length > 0 && (
          <section className="mt-6 grid gap-4 md:grid-cols-3">
            {combinedMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/30">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-200">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="mt-2 text-xs text-indigo-500 dark:text-indigo-300/80">{metric.description}</p>
              </div>
            ))}
          </section>
        )}

        {actionLog.length > 0 && (
          <section className="mt-8 rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-sm dark:border-indigo-600/40 dark:bg-gray-900/40">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">最新互动记录</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-indigo-400 dark:text-indigo-300/70">近实时同步</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {actionLog.map((entry) => (
                <li key={entry} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-8">
            <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">联系与基础信息</h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{mentor.region}</span>
                </div>
                {mentor.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>{mentor.email}</span>
                  </div>
                )}
                {mentor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>{mentor.phone}</span>
              </div>
                )}
                <div className="flex items-center gap-3">
                  <Globe2 className="h-4 w-4 text-blue-500" />
                  <span>时区 {mentor.timezone}</span>
            </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>最近活跃：{mentor.lastActivity}</span>
                </div>
              </div>
              {mentor.tools && mentor.tools.length > 0 && (
                <div>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gray-400">常用工具</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {mentor.tools.map((tool) => (
                      <span key={tool} className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700/70 dark:text-gray-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {(mentor.serviceScope?.length || mentor.focusAreas?.length) && (
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">服务范围与擅长领域</h2>
                {mentor.serviceScope && mentor.serviceScope.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">服务范围</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                      {mentor.serviceScope.map((scope) => (
                        <span key={scope} className="rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {mentor.focusAreas && mentor.focusAreas.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">擅长领域</p>
                    <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {mentor.focusAreas.map((area) => (
                        <div key={area} className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-1 dark:bg-gray-700/40">
                          <Target className="h-3.5 w-3.5 text-blue-500" /> {area}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mentor.strengths && mentor.strengths.length > 0 && (
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">优势亮点</p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {mentor.strengths.map((strength) => (
                        <li key={strength} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">教育背景</h2>
              {mentor.education && mentor.education.length > 0 ? (
                <ul className="space-y-3">
                  {mentor.education.map((edu) => (
                    <li key={`${edu.school}-${edu.period}`} className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-700/40 dark:text-gray-200">
                      <p className="font-medium text-gray-900 dark:text-white">{edu.school}</p>
                      <p>{edu.degree}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{edu.period}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">暂未补充教育背景信息</p>
              )}
              </section>

            <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">内部备忘</h2>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="记录对接要点、风险提醒或下一步行动……"
                className="min-h-[140px] w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">仅内部团队可见</span>
                <div className="flex items-center gap-2">
                  {noteSaved && <span className="text-xs text-emerald-500 dark:text-emerald-300">已保存</span>}
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={!note.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white/80"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    保存备忘
                  </button>
                </div>
              </div>
            </section>

            {/* 可预约时段 - 暂时留空，后续可以从排班表获取 */}
            {mentor.availabilityNotes && mentor.availabilityNotes.length > 0 && (
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">可用性说明</h2>
                  <ul className="space-y-2 rounded-xl bg-indigo-50/70 p-4 text-xs text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">
                    {mentor.availabilityNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
              </section>
            )}
          </div>

          <div className="space-y-8">
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">导师简介</h2>
              {mentor.bio ? (
                <p className="leading-relaxed text-gray-700 dark:text-gray-200">{mentor.bio}</p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">暂未填写个人介绍</p>
              )}
              </section>

            {mentor.achievements && mentor.achievements.length > 0 && (
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-amber-500" /> 荣誉成果
                </h2>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {mentor.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-amber-400" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {mentor.projects && mentor.projects.length > 0 && (
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <FileText className="h-5 w-5 text-blue-500" /> 核心项目案例
                </h2>
                <div className="space-y-4">
                  {mentor.projects.map((project) => (
                    <div key={project.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{project.title}</p>
                        {project.year && <span className="text-xs text-gray-500 dark:text-gray-400">{project.year}</span>}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{project.result}</p>
                      <p className="mt-3 leading-relaxed">{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">当前任务</h2>
              {relatedTasks.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700/70">
                  <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-700/70">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-[0.2em] text-gray-400 dark:bg-gray-800/80 dark:text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">任务</th>
                        <th className="px-4 py-3 font-medium">学生</th>
                        <th className="px-4 py-3 font-medium">类型</th>
                        <th className="px-4 py-3 font-medium">截止</th>
                        <th className="px-4 py-3 font-medium">优先级</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700/70 dark:bg-gray-900/40">
                      {relatedTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{task.title}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{task.student || '-'}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{task.type || '-'}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                            {task.deadline ? new Date(task.deadline).toLocaleDateString('zh-CN') : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.priority === '高'
                                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                                  : task.priority === '中'
                                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/40">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">暂无任务</p>
                </div>
              )}
              </section>

            {mentor.testimonials && mentor.testimonials.length > 0 && (
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/70 dark:bg-gray-800">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <MessageSquareQuote className="h-5 w-5 text-emerald-500" /> 学员反馈
                </h2>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  {mentor.testimonials.map((testimonial) => (
                    <div key={testimonial.author} className="rounded-xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                      <p className="text-xs font-semibold uppercase tracking-wide">{testimonial.author}</p>
                      <p className="text-xs text-emerald-500 opacity-80">{testimonial.role}</p>
                      <p className="mt-3 leading-relaxed">“{testimonial.comment}”</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isAssignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>指派新任务</DialogTitle>
            <DialogDescription>为导师创建新的任务事项，提交后将同步至导师任务列表（示例交互）。</DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={handleAssignSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="task-title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  任务名称
                </label>
                <input
                  id="task-title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  placeholder="例如：PS 初稿访谈"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-600/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="task-type" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  任务类型
                </label>
                <select
                  id="task-type"
                  name="type"
                  value={taskForm.type}
                  onChange={handleTaskFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-600/20"
                >
                  <option value="文书">文书</option>
                  <option value="材料">材料</option>
                  <option value="质检">质检</option>
                  <option value="面试">面试</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="task-deadline" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  截止日期
                </label>
                <input
                  id="task-deadline"
                  name="deadline"
                  type="date"
                  value={taskForm.deadline}
                  onChange={handleTaskFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-600/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="task-priority" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  优先级
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleTaskFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-600/20"
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setAssignOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <Sparkles className="h-4 w-4" />
                确认指派
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isContactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>联系导师</DialogTitle>
            <DialogDescription>发送预设消息或复制联系信息，与导师快速对接。</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/60 dark:bg-gray-900/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span>{mentor.email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(mentor.email, 'email')}
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-indigo-500/50 dark:text-indigo-300 dark:hover:border-indigo-400"
              >
                <ClipboardCopy className="h-3.5 w-3.5" />
                {copiedField === 'email' ? '已复制' : '复制'}
              </button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <Phone className="h-4 w-4 text-indigo-500" />
                <span>{mentor.phone}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(mentor.phone, 'phone')}
                disabled={!canCopyPhone}
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 dark:border-indigo-500/50 dark:text-indigo-300 dark:hover:border-indigo-400 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
              >
                <ClipboardCopy className="h-3.5 w-3.5" />
                {copiedField === 'phone' ? '已复制' : canCopyPhone ? '复制' : '暂不可复制'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Globe2 className="h-3.5 w-3.5 text-indigo-500" />
              <span>所在时区：{mentor.timezone}</span>
            </div>
          </div>
          <form className="mt-4 space-y-4" onSubmit={handleContactSubmit}>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                发送给导师的消息
              </label>
              <textarea
                id="contact-message"
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-600/20"
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <Send className="h-4 w-4" />
                发送联系请求
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorDetailPage;


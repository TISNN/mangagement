import { Fragment, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  ClipboardList,
  Clock3,
  Edit3,
  MapPin,
  Mail,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ShiftConflict, StaffProfile } from '../types';
import { loadStaffProfileById, updateStaffProfile } from './data';

const getAvatarUrl = (baseUrl: string | undefined, name: string) => {
  if (baseUrl && baseUrl.trim().length > 0) {
    return baseUrl;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=eef2ff&radius=50`;
};

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70">
    <header className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-200">
        {icon}
      </span>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
    </header>
    <div className="text-sm leading-6 text-gray-600 dark:text-gray-300">{children}</div>
  </section>
);

interface EditFormState {
  role: string;
  team: string;
  email: string;
  location: string;
  timezone: string;
  bio: string;
  primaryFocus: string;
  skills: string;
  status: StaffProfile['status'];
}

export const StaffDetailPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [conflicts, setConflicts] = useState<ShiftConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!staffId) {
      setError('未提供成员 ID');
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { profile: nextProfile, conflicts: nextConflicts } = await loadStaffProfileById(staffId, {
          forceRefresh: true,
        });

        if (!mounted) return;

        setProfile(nextProfile);
        setConflicts(nextConflicts);
        setError(nextProfile ? null : '未找到该成员信息，可能已被删除或尚未同步。');
      } catch (err) {
        if (!mounted) return;
        console.error('[StaffDetailPage] 加载团队成员详情失败', err);
        setProfile(null);
        setConflicts([]);
        setError(err instanceof Error ? err.message : '加载团队成员详情失败，请稍后重试');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      mounted = false;
    };
  }, [staffId]);

  const formPreset = useMemo<EditFormState | null>(() => {
    if (!profile) return null;
    return {
      role: profile.role ?? '',
      team: profile.team ?? '',
      email: profile.email ?? '',
      location: profile.location ?? '',
      timezone: profile.timezone ?? '',
      bio: profile.bio ?? '',
      primaryFocus: profile.primaryFocus ?? '',
      skills: profile.skills.join(', '),
      status: profile.status,
    };
  }, [profile]);

  const openEditModal = () => {
    if (!formPreset) return;
    setEditForm(formPreset);
    setIsEditModalOpen(true);
  };

  const handleFormChange = (field: keyof EditFormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveProfile = async () => {
    if (!profile || !editForm || saving) return;
    const nextSkills = editForm.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    setSaving(true);
    try {
      await updateStaffProfile(profile.id, {
        role: editForm.role,
        team: editForm.team,
        email: editForm.email,
        location: editForm.location,
        bio: editForm.bio,
        status: editForm.status,
        skills: nextSkills,
      });

      const { profile: refreshedProfile, conflicts: refreshedConflicts } = await loadStaffProfileById(profile.id, {
        forceRefresh: true,
      });

      if (refreshedProfile) {
        setProfile(refreshedProfile);
        setConflicts(refreshedConflicts);
      } else {
        setProfile({
          ...profile,
          role: editForm.role,
          team: editForm.team,
          email: editForm.email,
          location: editForm.location,
          timezone: editForm.timezone,
          bio: editForm.bio,
          primaryFocus: editForm.primaryFocus,
          status: editForm.status,
          skills: nextSkills,
        });
      }

      toast.success('成员资料已更新');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('[StaffDetailPage] 更新成员资料失败', err);
      const message = err instanceof Error ? err.message : '保存失败，请稍后重试';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
          正在加载团队成员详情，请稍候…
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600 shadow-sm dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error ?? '未找到该成员信息，可能已被删除或尚未同步。'}
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate('/admin/internal-management/employee-and-scheduling')}>
              返回团队成员
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="space-y-6 p-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 p-6 shadow-inner dark:from-blue-950/80 dark:via-indigo-950/60 dark:to-blue-950/80">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/internal-management/employee-and-scheduling')}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800/60"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-white to-indigo-100 shadow-lg ring-4 ring-white dark:ring-gray-900">
              <img src={getAvatarUrl(profile.avatarUrl, profile.name)} alt={profile.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <h1 className="text-3xl font-semibold">{profile.name}</h1>
                {profile.status === '在岗' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <BadgeCheck className="h-3 w-3" />
                    在岗
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.role} · {profile.team}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-blue-500 dark:text-blue-200">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-white/10">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
                {profile.email ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-white/10">
                    <Mail className="h-3.5 w-3.5" />
                    {profile.email}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-white/10">
                  <Clock3 className="h-3.5 w-3.5" />
                  时区 {profile.timezone}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => console.info('[StaffDetailPage] 分配任务', { staffId })}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <ClipboardList className="h-4 w-4" />
            分配任务
          </Button>
          <Button
            variant="outline"
            onClick={openEditModal}
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
          >
            <Edit3 className="h-4 w-4" />
            编辑资料
          </Button>
          <Button
            variant="outline"
            onClick={() => console.info('[StaffDetailPage] 添加跟进提醒', { staffId })}
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
          >
            <Sparkles className="h-4 w-4" />
            添加提醒
          </Button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr,0.8fr]">
        <InfoCard title="个人介绍" icon={<Sparkles className="h-4 w-4" />}>
          {profile.bio ? <Fragment>{profile.bio}</Fragment> : <span className="text-sm text-gray-500 dark:text-gray-400">暂未填写个人介绍。</span>}
        </InfoCard>
        <InfoCard title="教育背景" icon={<Sparkles className="h-4 w-4" />}>
          {profile.education ? (
            <ul className="space-y-1 text-sm">
              <li className="font-medium text-gray-900 dark:text-gray-100">{profile.education.degree}</li>
              <li>{profile.education.school}</li>
              {profile.education.year ? (
                <li className="text-xs text-gray-500 dark:text-gray-400">毕业年份：{profile.education.year}</li>
              ) : null}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">暂未补充教育背景。</p>
          )}
        </InfoCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="关键技能" icon={<Users className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-2 text-xs">
            {profile.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </InfoCard>
        <InfoCard title="重点工作" icon={<ClipboardList className="h-4 w-4" />}>
          {profile.responsibilityHighlights.length > 0 ? (
            <ul className="space-y-3">
              {profile.responsibilityHighlights.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {item.type} · {item.title}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{item.dueAt ?? '时间待定'}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>状态：{item.status}</span>
                    <span
                      className={
                        item.importance === '高'
                          ? 'text-rose-500 dark:text-rose-300'
                          : item.importance === '低'
                            ? 'text-emerald-500 dark:text-emerald-300'
                            : 'text-amber-500 dark:text-amber-300'
                      }
                    >
                      优先级 {item.importance}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">暂无重点工作，请在任务中心补充职责分配。</p>
          )}
        </InfoCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <InfoCard title="风险提醒" icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}>
          {conflicts.length > 0 ? (
            <div className="space-y-2 text-sm">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-100"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{conflict.issue}</span>
                    <span>{conflict.detectedAt}</span>
                  </div>
                  <p className="mt-1 text-xs opacity-80">影响：{conflict.impact}</p>
                  <p className="mt-1 text-xs font-medium">建议：{conflict.suggestedAction}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              当前没有冲突记录。
            </div>
          )}
        </InfoCard>
      </div>

        <InfoCard title="当前工作量" icon={<Activity className="h-4 w-4" />}>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{profile.workload}%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">工作量指数</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800/60">
            <Target className="h-3.5 w-3.5 text-blue-500 dark:text-blue-300" />
            重点：{profile.primaryFocus || '待分配'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800/60">
            <ClipboardList className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
            活跃任务 {profile.activeTaskCount}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800/60">
            <Clock3 className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300" />
            即将会议 {profile.upcomingMeetingCount}
          </span>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          建议每周检查任务完成情况，关注高优先级事项，必要时协调团队支援。
        </p>
        </InfoCard>
      </div>

      {isEditModalOpen && editForm ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">编辑团队成员资料</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">同步更新职位、地区、技能、简介等信息。</p>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">职位</label>
              <input
                value={editForm.role}
                onChange={handleFormChange('role')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="如：高级顾问"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">所属团队</label>
              <input
                value={editForm.team}
                onChange={handleFormChange('team')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="如：北美规划组"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">邮箱</label>
              <input
                value={editForm.email}
                onChange={handleFormChange('email')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="示例：mentor@infinite.ai"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">状态</label>
              <select
                value={editForm.status}
                onChange={handleFormChange('status')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="在岗">在岗</option>
                <option value="请假">请假</option>
                <option value="培训">培训</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">地区 / 办公地点</label>
              <input
                value={editForm.location}
                onChange={handleFormChange('location')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="如：上海 · 陆家嘴"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">时区</label>
              <input
                value={editForm.timezone}
                onChange={handleFormChange('timezone')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="如：Asia/Shanghai (UTC+8)"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">关键技能（逗号分隔）</label>
              <input
                value={editForm.skills}
                onChange={handleFormChange('skills')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="选校规划, 材料校对, CRM 建档"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">重点工作方向</label>
              <input
                value={editForm.primaryFocus}
                onChange={handleFormChange('primaryFocus')}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="如：任务 · 加州系统选校方案复盘"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">个人介绍</label>
              <textarea
                value={editForm.bio}
                onChange={handleFormChange('bio')}
                rows={4}
                className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none ring-blue-100 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="补充导师擅长领域、沟通风格与服务经验..."
              />
            </div>
          </div>
            <footer className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={saving}>
                取消
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? '保存中…' : '保存修改'}
              </Button>
            </footer>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};


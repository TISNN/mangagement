import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SHIFT_CONFLICTS, STAFF_PROFILES } from './data';

const getAvatarUrl = (baseUrl: string | undefined, name: string) =>
  `${baseUrl ?? 'https://api.dicebear.com/6.x/big-smile/svg'}?seed=${encodeURIComponent(name)}&background=%23f4f6fb`;

export const StaffDetailPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const staff = useMemo(() => STAFF_PROFILES.find((item) => item.id === staffId), [staffId]);
  const conflicts = useMemo(() => SHIFT_CONFLICTS.filter((conflict) => conflict.staff === staff?.name), [staff?.name]);

  if (!staff) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          未找到该员工信息，可能已被删除或尚未同步。
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate('/admin/internal-management/employee-and-scheduling')}>
              返回员工与排班
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/internal-management/employee-and-scheduling')}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800/60"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 text-lg font-semibold text-blue-700 shadow-sm ring-2 ring-white dark:ring-gray-800">
              <img src={getAvatarUrl(staff.avatarUrl, staff.name)} alt={staff.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <h1 className="text-2xl font-semibold">{staff.name}</h1>
                {staff.status === '在岗' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <BadgeCheck className="h-3 w-3" />
                    在岗
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {staff.role} · {staff.team}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => console.info('[StaffDetailPage] 发起排班调整', { staffId })}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <CalendarDays className="h-4 w-4" />
            调整排班
          </Button>
          <Button
            variant="outline"
            onClick={() => console.info('[StaffDetailPage] 发起绩效反馈', { staffId })}
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
          >
            <Sparkles className="h-4 w-4" />
            绩效反馈
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold">关键技能</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {staff.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold">所在地区 & 时区</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{staff.location}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{staff.timezone}</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-semibold">当前负载</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{staff.workload}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">本周排班占比</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            根据排班和项目任务估算，建议保持在 80% 以下以留出专项内容复盘时间。
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Clock3 className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold">下一个班次</span>
          </div>
          {staff.availability.length > 0 ? (
            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {staff.availability[0].day} · {staff.availability[0].start} - {staff.availability[0].end}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3.5 w-3.5" />
                {staff.availability[0].location}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">暂未配置班次。</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold">班次安排</span>
          </div>
          <div className="space-y-2 text-sm">
            {staff.availability.map((slot, index) => (
              <div
                key={`${staff.id}-${slot.day}-${slot.start}`}
                className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    {slot.day} · {slot.start} - {slot.end}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {slot.location}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500"># 排班 {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-semibold">教育背景</span>
          </div>
          {staff.education ? (
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-gray-100">{staff.education.degree}</p>
              <p>{staff.education.school}</p>
              {staff.education.year ? <p className="text-xs text-gray-500 dark:text-gray-400">毕业年份：{staff.education.year}</p> : null}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">暂未补充教育背景。</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Clock3 className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold">排班冲突</span>
          </div>
          {conflicts.length > 0 ? (
            <div className="space-y-2 text-sm">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-100">
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
        </div>
      </div>
    </div>
  );
};


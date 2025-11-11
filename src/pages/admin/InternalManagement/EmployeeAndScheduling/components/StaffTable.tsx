import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { BadgeCheck, Filter, MoreHorizontal } from 'lucide-react';

import type { StaffProfile } from '../../types';

interface StaffTableProps {
  profiles: StaffProfile[];
}

const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');
const getAvatarUrl = (baseUrl: string | undefined, name: string) => {
  if (baseUrl && baseUrl.trim().length > 0) {
    return baseUrl;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=f1f5f9&radius=50`;
};

export const StaffTable: React.FC<StaffTableProps> = ({ profiles }) => {
  const navigate = useNavigate();

  const handleViewDetail = useCallback(
    (staffId: string) => {
      navigate(`/admin/internal-management/employee-and-scheduling/${staffId}`);
    },
    [navigate],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">团队成员列表</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">按姓名、团队与技能快速定位成员。</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[StaffTable] 打开筛选面板')}
          >
            <Filter className="h-3.5 w-3.5" />
            筛选
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 p-1.5 text-gray-500 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[StaffTable] 更多操作')}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/60">
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3">姓名</th>
              <th className="px-4 py-3">角色 / 团队</th>
              <th className="px-4 py-3">技能标签</th>
              <th className="px-4 py-3">工作时段</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {profiles.map((profile) => (
              <tr key={profile.id} className="text-gray-600 dark:text-gray-300">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 text-sm font-semibold text-blue-700 shadow-sm ring-2 ring-white dark:ring-gray-800">
                      <img
                        src={getAvatarUrl(profile.avatarUrl, profile.name)}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.name}</span>
                        {profile.status === '在岗' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                            <BadgeCheck className="h-3 w-3" />
                            在岗
                          </span>
                        ) : null}
                      </div>
                      {profile.email ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{profile.email}</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{profile.role}</p>
                  <p className="text-gray-500 dark:text-gray-400">{profile.team}</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map((skill) => (
                      <span
                        key={`${profile.id}-${skill}`}
                        className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col gap-1">
                    {profile.availability.slice(0, 2).map((slot) => (
                      <span key={`${profile.id}-${slot.day}-${slot.start}`}>
                        {slot.day} {slot.start}-{slot.end} · {slot.location}
                      </span>
                    ))}
                    {profile.availability.length > 2 ? (
                      <span className="text-[11px] text-blue-500 dark:text-blue-200">+{profile.availability.length - 2} 个时段</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                  <div>{profile.location}</div>
                  <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{profile.timezone}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                    onClick={() => handleViewDetail(profile.id)}
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


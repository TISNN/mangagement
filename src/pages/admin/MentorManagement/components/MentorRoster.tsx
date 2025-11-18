import { GraduationCap, Users } from 'lucide-react';

import type { MentorRecord } from '../types';

interface MentorRosterProps {
  mentors: MentorRecord[];
  selectedIds?: Set<string>;
  onToggleSelect?: (mentorId: string) => void;
  selectLabel?: string;
  hideSelectAction?: boolean;
  onViewDetail?: (mentorId: string) => void;
  className?: string;
}

export const MentorRoster = ({ mentors, selectedIds, onToggleSelect, selectLabel, className, hideSelectAction, onViewDetail }: MentorRosterProps) => {
  const baseClass = 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3';
  const containerClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <div className={containerClass}>
      {mentors.map((mentor) => {
        const isSelected = selectedIds?.has(mentor.id);
        return (
          <div
            key={mentor.id}
            onClick={() => onViewDetail?.(mentor.id)}
            className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700/60 dark:bg-gray-800 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="h-12 w-12 rounded-xl object-cover ring-4 ring-white dark:ring-gray-700"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{mentor.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    主职：{mentor.primaryRole} · 兼任：{mentor.secondaryRoles.join('、')}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  mentor.risk === '关注'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                }`}
              >
                {mentor.risk}
              </span>
            </div>

            {/* 教育背景 */}
            {mentor.education && mentor.education.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {mentor.education.slice(0, 2).map((edu, index) => (
                  <div key={index} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <GraduationCap className="h-3 w-3 mt-0.5 text-indigo-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{edu.school}</p>
                      <p className="text-gray-500 dark:text-gray-400 truncate">{edu.degree}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-blue-500" />
                在辅学生：{mentor.studentsCount ?? 0}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                满意度：{mentor.satisfaction}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                可用率：{mentor.availabilityRate}%
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                利用率：{mentor.utilizationRate}%
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {mentor.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700/70 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                语言：{mentor.languages.join('/')}
              </span>
            </div>

            {onToggleSelect && !hideSelectAction && (
              <div className="mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleSelect(mentor.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                    isSelected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectLabel ?? (isSelected ? '已加入我的导师' : '加入我的导师')}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

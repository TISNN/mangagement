import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, RefreshCw, Search, Star } from 'lucide-react';
import { IndicatorCardData, StudentOption } from '../types';
import { INDICATOR_TONE_CLASS } from '../constants';

const MAX_PINNED_STUDENTS = 6;

interface GlobalHeaderProps {
  students: StudentOption[];
  selectedStudentId: number | null;
  onSelectStudent: (studentId: number) => void;
  indicators: IndicatorCardData[];
  loading: boolean;
  onRefresh: () => void;
}

export const GlobalHeader = ({
  students,
  selectedStudentId,
  onSelectStudent,
  indicators,
  loading,
  onRefresh
}: GlobalHeaderProps) => {
  const [keyword, setKeyword] = useState('');
  const [isPickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isPickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPickerOpen]);

  const filteredStudents = useMemo(() => {
    if (!keyword.trim()) return students;
    return students.filter((student) => student.name.includes(keyword.trim()));
  }, [students, keyword]);

  const prioritizedStudents = useMemo(() => {
    const favorites = filteredStudents.filter((student) => student.favorite);
    const nonFavorites = filteredStudents.filter((student) => !student.favorite);
    return [...favorites, ...nonFavorites];
  }, [filteredStudents]);

  const pinnedStudents = prioritizedStudents.slice(0, MAX_PINNED_STUDENTS);
  const renderAvatar = (student: StudentOption) => {
    if (student.avatar) {
      return (
        <img
          src={student.avatar}
          alt={student.name}
          className="h-6 w-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
        />
      );
    }
    const initials = student.name.substring(0, 1).toUpperCase();
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-2 ring-white dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-900">
        {initials}
      </div>
    );
  };

  const remainingCount = Math.max(filteredStudents.length - pinnedStudents.length, 0);

  const renderStudentChip = (student: StudentOption) => {
    const isSelected = student.studentId === selectedStudentId;
    return (
      <button
        key={student.studentId}
        onClick={() => onSelectStudent(student.studentId)}
        className={`flex shrink-0 items-center gap-3 rounded-full border px-3 py-1.5 text-sm transition ${
          isSelected
            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400/80 dark:bg-blue-900/30 dark:text-blue-100'
            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400/60 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        {renderAvatar(student)}
        <div className="flex items-center gap-1">
          {student.favorite && <Star className="h-3.5 w-3.5 text-amber-400" />}
          <span className="whitespace-nowrap">{student.name}</span>
        </div>
        {student.urgentCount ? (
          <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs text-rose-600 dark:bg-rose-900/40 dark:text-rose-200">
            {student.urgentCount}
          </span>
        ) : null}
      </button>
    );
  };

  const handleSelectFromPanel = (studentId: number) => {
    onSelectStudent(studentId);
    setPickerOpen(false);
  };

  return (
    <div ref={containerRef} className="relative space-y-4">
      <div className="space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">选择学生</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索学生姓名 / 导师"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/60 px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          {pinnedStudents.length ? (
            <div className="flex flex-wrap gap-2">
              {pinnedStudents.map(renderStudentChip)}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">暂无学生</p>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>
              {pinnedStudents.length ? `已固定 ${pinnedStudents.length} 人` : '尚未固定学生'}
              {remainingCount > 0 ? ` · 另有 ${remainingCount} 人` : ''}
            </span>
            <button
              onClick={() => setPickerOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
            >
              全部学生 · {filteredStudents.length}
              <ChevronDown className={`h-4 w-4 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isPickerOpen && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-full max-w-xl rounded-2xl border border-slate-100 bg-white/95 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-200">学生列表 · {filteredStudents.length}</p>
              <button
                onClick={() => setPickerOpen(false)}
                className="text-xs text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                收起
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto px-2 py-2">
              {prioritizedStudents.length ? (
                prioritizedStudents.map((student) => {
                  const isSelected = student.studentId === selectedStudentId;
                  return (
                    <button
                      key={student.studentId}
                      onClick={() => handleSelectFromPanel(student.studentId)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-400/60 dark:bg-blue-900/20'
                          : 'border-transparent hover:border-blue-200 hover:bg-blue-50/60 dark:hover:border-blue-500/40 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-1 items-start gap-3">
                          {renderAvatar(student)}
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                              {student.favorite && <Star className="h-3.5 w-3.5 text-amber-400" />}
                              <span>{student.name}</span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {student.currentStage ?? '阶段未分配'} · {student.mentorName ?? '未分配导师'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-400 dark:text-slate-500">
                          {student.nextDeadline ? `截止 ${student.nextDeadline}` : '暂无截止'}
                        </div>
                      </div>
                      {student.urgentCount ? (
                        <p className="mt-2 inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-600 dark:bg-rose-900/30 dark:text-rose-200">
                          紧急任务 · {student.urgentCount}
                        </p>
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className="flex items-center justify-center py-10 text-sm text-slate-400 dark:text-slate-500">
                  未找到匹配的学生
                </div>
              )}
            </div>
          </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((indicator) => (
          <div key={indicator.id} className={`rounded-2xl border px-4 py-3 ${INDICATOR_TONE_CLASS[indicator.tone]}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {indicator.label}
            </p>
            <div className="mt-2 text-2xl font-semibold">{indicator.value}</div>
            {indicator.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{indicator.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 培训与活动组件
 * 展示培训日历、报名状态与回放资料
 */

import React, { useState } from 'react';
import { Calendar, CheckCircle2, PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { TrainingEvent } from '../types';
import { TRAINING_EVENTS } from '../constants';

interface TrainingEventsProps {
  onViewCalendar?: () => void;
  onRegister?: (eventId: string) => void;
  onViewMaterials?: (eventId: string) => void;
}

const TrainingEvents: React.FC<TrainingEventsProps> = ({ onViewCalendar, onRegister, onViewMaterials }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | TrainingEvent['status']>('all');

  const filteredEvents =
    statusFilter === 'all' ? TRAINING_EVENTS : TRAINING_EVENTS.filter((event) => event.status === statusFilter);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">培训与活动</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">培训日历、报名状态与回放资料集中展示，支持后续考核</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={onViewCalendar}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <Calendar className="h-3.5 w-3.5" /> 查看日历
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* 状态筛选 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(['all', '报名中', '已满', '回放'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'all' ? '全部' : status}
              </button>
            ))}
          </div>

          {/* 活动列表 */}
          <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {filteredEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/40">
                <p className="text-sm text-gray-500">暂无 {statusFilter === 'all' ? '' : statusFilter} 活动</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {event.type} · 主讲：{event.host}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        event.status === '报名中'
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : event.status === '已满'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-gray-500 dark:text-gray-400 md:grid-cols-2">
                    <div>
                      时间：{event.start} - {event.end}
                    </div>
                    <div>地点：{event.location}</div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{event.focus}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {event.status === '报名中' && (
                      <button
                        onClick={() => onRegister?.(event.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> 报名/签到
                      </button>
                    )}
                    {(event.status === '已满' || event.status === '回放') && (
                      <button
                        onClick={() => onViewMaterials?.(event.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-sky-200 hover:text-sky-600 dark:border-gray-600 dark:hover:border-sky-500 dark:hover:text-sky-300"
                      >
                        <PlayCircle className="h-3.5 w-3.5" /> 查看资料
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingEvents;


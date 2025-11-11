import { CalendarDays, Clock, Link2, MapPin } from 'lucide-react';

import type { InterviewScheduleItem } from '../data';

interface InterviewSchedulePanelProps {
  schedule: InterviewScheduleItem[];
}

export const InterviewSchedulePanel: React.FC<InterviewSchedulePanelProps> = ({ schedule }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">面试排期</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            自动同步面试官日历，确保在线/线下面试准备充分。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
          onClick={() => console.info('[InterviewSchedulePanel] 新建面试安排')}
        >
          创建面试
        </button>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {schedule.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                  {item.stage}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.candidate}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.position}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {item.scheduledAt} - {item.endAt} （{item.timezone}）
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  状态：{item.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="text-gray-500 dark:text-gray-300">面试官：</span>
                {item.interviewers.map((interviewer) => (
                  <span
                    key={`${item.id}-${interviewer}`}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {interviewer}
                  </span>
                ))}
              </div>

              {item.attachments && item.attachments.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 text-xs text-blue-600 dark:text-blue-200">
                  附件：
                  {item.attachments.map((attachment) => (
                    <button
                      key={`${item.id}-${attachment}`}
                      type="button"
                      className="underline-offset-2 hover:underline"
                      onClick={() => console.info('[InterviewSchedulePanel] 打开附件', { itemId: item.id, attachment })}
                    >
                      {attachment}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {item.meetingLink ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => window.open(item.meetingLink, '_blank')}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  进入会议
                </button>
              ) : null}
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[InterviewSchedulePanel] 调整面试时间', { itemId: item.id })}
              >
                调整排期
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[InterviewSchedulePanel] 同步面试官', { itemId: item.id })}
              >
                提醒面试官
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



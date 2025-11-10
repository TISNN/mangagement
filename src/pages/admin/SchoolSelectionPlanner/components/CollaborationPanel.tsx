import { CalendarDays, ClipboardCheck, Sparkles, Users } from 'lucide-react';

import type { MeetingPlan } from '../types';
import { ICON_COLOR_MAP, SectionHeader } from './shared';

interface CollaborationPanelProps {
  meetings: MeetingPlan[];
}

const MEETING_ACCENT_MAP: Record<MeetingPlan['type'], keyof typeof ICON_COLOR_MAP> = {
  学生会议: 'indigo',
  顾问会商: 'purple',
};

const MEETING_BUTTON_ACCENT_MAP: Record<MeetingPlan['type'], string> = {
  学生会议: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/40',
  顾问会商: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40',
};

export const CollaborationPanel = ({ meetings }: CollaborationPanelProps) => {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="协同会议与任务"
        description="支持与学生、顾问团队的实时会议协作，并同步行动项。"
        action={(
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Users className="h-3.5 w-3.5" />
            新建会议
          </button>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {meetings.map((meeting) => {
          const accent = MEETING_ACCENT_MAP[meeting.type];
          const iconColor = ICON_COLOR_MAP[accent];
          const buttonClass = MEETING_BUTTON_ACCENT_MAP[meeting.type];

          return (
            <div key={meeting.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <CalendarDays className={`h-4 w-4 ${iconColor}`} />
                  <span>{meeting.type}</span>
                </div>
                <button className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${buttonClass}`}>
                  生成议程
                  <Sparkles className={`h-3.5 w-3.5 ${iconColor}`} />
                </button>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Users className={`h-4 w-4 ${iconColor}`} /> 参与者：{meeting.attendees.join('、')}
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">议程</div>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    {meeting.agenda.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Sparkles className={`mt-0.5 h-3.5 w-3.5 ${iconColor}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">行动项</div>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    {meeting.actions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ClipboardCheck className={`mt-0.5 h-3.5 w-3.5 ${iconColor}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

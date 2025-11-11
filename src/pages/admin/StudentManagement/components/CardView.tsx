import React from 'react';
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star, Users } from 'lucide-react';
import { StudentRecord } from '../types';
import { STATUS_TAG_CLASS } from '../utils';

interface CardViewProps {
  students: StudentRecord[];
  onSelect: (student: StudentRecord) => void;
}

const CardView: React.FC<CardViewProps> = ({ students, onSelect }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
    {students.map((student) => (
      <div
        key={student.id}
        className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700/60 dark:bg-gray-800"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="h-12 w-12 rounded-xl object-cover ring-4 ring-white dark:ring-gray-700"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{student.school}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TAG_CLASS[student.status]}`}
          >
            {student.status}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          {student.location} · {student.channel}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {student.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700/70 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {student.services.slice(0, 2).map((service) => (
            <div
              key={service.id}
              className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-700/60 dark:text-gray-300"
            >
              <div className="flex items-center justify-between">
                <span>{service.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{service.status}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600/60">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${service.progress}%` }} />
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{service.progress}%</span>
              </div>
            </div>
          ))}
          {student.services.length > 2 && (
            <button className="text-xs text-blue-500 dark:text-blue-300">查看更多服务...</button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-purple-500" />
            顾问：{student.advisor}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            待办：{student.tasksPending}
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            风险：{student.risk}
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-purple-500" />
            满意度：{student.satisfaction}
          </div>
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={() => onSelect(student)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60"
          >
            进入详情
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default CardView;


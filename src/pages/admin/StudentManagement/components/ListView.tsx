import React from 'react';
import { ChevronRight } from 'lucide-react';
import { StudentRecord } from '../types';
import { RISK_TAG_CLASS, STATUS_TAG_CLASS } from '../utils';

interface ListViewProps {
  students: StudentRecord[];
  onSelect: (student: StudentRecord) => void;
}

const ListView: React.FC<ListViewProps> = ({ students, onSelect }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-700">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-6 py-3">学生</th>
            <th className="px-6 py-3">服务</th>
            <th className="px-6 py-3">顾问</th>
            <th className="px-6 py-3">阶段</th>
            <th className="px-6 py-3">风险</th>
            <th className="px-6 py-3">进度</th>
            <th className="px-6 py-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {students.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/20">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-10 w-10 rounded-xl object-cover ring-4 ring-white dark:ring-gray-700"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.school}
                      {student.major ? ` · ${student.major}` : ''}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_TAG_CLASS[student.status]}`}>
                        {student.status}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">更新时间 {student.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="space-y-1">
                  {student.services.map((service) => (
                    <div key={service.id} className="flex items-center gap-2">
                      <span>{service.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {service.status} · {service.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.advisor}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.stage}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${RISK_TAG_CLASS[student.risk]}`}>
                  {student.risk}风险
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${student.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{student.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onSelect(student)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60"
                >
                  查看详情
                  <ChevronRight className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ListView;


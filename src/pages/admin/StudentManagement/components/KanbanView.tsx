import React from 'react';
import { Users } from 'lucide-react';
import { KanbanColumn, StudentRecord } from '../types';
import SectionHeader from './SectionHeader';
import { RISK_TAG_CLASS } from '../utils';

interface KanbanViewProps {
  students: StudentRecord[];
  columns: KanbanColumn[];
}

const KanbanView: React.FC<KanbanViewProps> = ({ students, columns }) => (
  <div className="space-y-4">
    <SectionHeader
      title="服务阶段看板"
      description="按服务阶段维度查看学生进度，支持拖拽与优先级管理（待接入）。"
    />
    <div className="overflow-x-auto">
      <div className="grid min-w-[960px] grid-cols-5 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex h-full flex-col rounded-2xl border ${column.color} bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800/70`}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/60">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{column.title}</span>
              <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-100 px-2 text-xs text-gray-600 dark:bg-gray-700/70 dark:text-gray-300">
                {
                  students.filter((student) =>
                    student.services.some((service) => service.status === column.id),
                  ).length
                }
              </span>
            </div>
            <div className="space-y-3 p-3">
              {students
                .filter((student) => student.services.some((service) => service.status === column.id))
                .map((student) => (
                  <div
                    key={student.id}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.stage}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${RISK_TAG_CLASS[student.risk]}`}
                      >
                        风险 {student.risk}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      主服务：{student.services.find((service) => service.status === column.id)?.name}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{student.progress}%</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="h-3.5 w-3.5 text-purple-500" />
                      顾问：{student.advisor}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default KanbanView;


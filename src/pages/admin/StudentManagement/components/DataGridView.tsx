import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { StudentRecord } from '../types';
import SectionHeader from './SectionHeader';

interface DataGridViewProps {
  students: StudentRecord[];
  onExportExcel?: () => void;
}

const DataGridView: React.FC<DataGridViewProps> = ({ students, onExportExcel }) => (
  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
    <SectionHeader
      title="数据表格视图"
      description="支持自定义列、导出、批量操作，便于数据运营分析。"
      actions={
        <button
          onClick={onExportExcel}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          <FileSpreadsheet className="h-4 w-4" />
          导出 Excel
        </button>
      }
    />
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-700">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">姓名</th>
            <th className="px-4 py-3">学校 / 专业</th>
            <th className="px-4 py-3">状态</th>
            <th className="px-4 py-3">服务数量</th>
            <th className="px-4 py-3">主要顾问</th>
            <th className="px-4 py-3">风险等级</th>
            <th className="px-4 py-3">满意度</th>
            <th className="px-4 py-3">来源渠道</th>
            <th className="px-4 py-3">地区</th>
            <th className="px-4 py-3">更新时间</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {students.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/20">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{student.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {student.school}
                {student.major ? ` · ${student.major}` : ''}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.status}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.services.length}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.advisor}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.risk}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.satisfaction}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.channel}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.location}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataGridView;


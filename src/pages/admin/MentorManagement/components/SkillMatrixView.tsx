import { Filter, Sparkles } from 'lucide-react';

import { SKILL_MATRIX } from '../data';

export const SkillMatrixView = () => (
  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">能力矩阵</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">按服务类型与评分展示导师能力，支持 AI 推荐组合。</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
          <Filter className="h-4 w-4" />
          筛选
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
          <Sparkles className="h-4 w-4" />
          AI 推荐导师组合
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-700">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">导师</th>
            <th className="px-4 py-3">角色</th>
            <th className="px-4 py-3">经验（年）</th>
            <th className="px-4 py-3">能力评级</th>
            <th className="px-4 py-3">满意度</th>
            <th className="px-4 py-3">语言</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {SKILL_MATRIX.map((entry) => (
            <tr key={`${entry.mentor}-${entry.role}`} className="transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/20">
              <td className="px-4 py-3 text-gray-900 dark:text-white">{entry.mentor}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{entry.role}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{entry.experience}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{entry.rating}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{entry.satisfaction}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{entry.language}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

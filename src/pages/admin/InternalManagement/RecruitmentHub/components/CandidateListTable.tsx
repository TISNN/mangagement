import { useMemo } from 'react';

import { BadgeCheck, Mail, Phone, Tags } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { CandidateProfile } from '../data';

interface CandidateListTableProps {
  candidates: CandidateProfile[];
  onSelect: (candidateId: string) => void;
}

export const CandidateListTable: React.FC<CandidateListTableProps> = ({ candidates, onSelect }) => {
  const groupedCandidates = useMemo(() => {
    const groups: Record<string, CandidateProfile[]> = {};
    candidates.forEach((candidate) => {
      const key = candidate.position;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(candidate);
    });
    return groups;
  }, [candidates]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">候选人库</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            查看候选人档案与状态，支持多岗位复用、渠道追踪与资料下载。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Button
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[CandidateListTable] 新建候选人')}
          >
            新建候选人
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[CandidateListTable] 导入简历')}
          >
            导入简历
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Object.entries(groupedCandidates).map(([position, list]) => (
          <div key={position} className="space-y-3 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{position}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  当前候选人 {list.length} 人 · 最近更新时间 {list[0]?.updatedAt}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">候选人</th>
                    <th className="px-4 py-3 text-left font-medium">联系信息</th>
                    <th className="px-4 py-3 text-left font-medium">经历与技能</th>
                    <th className="px-4 py-3 text-left font-medium">状态</th>
                    <th className="px-4 py-3 text-left font-medium">负责人</th>
                    <th className="px-4 py-3 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {list.map((candidate) => (
                    <tr key={candidate.id} className="text-gray-600 dark:text-gray-300">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{candidate.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{candidate.source}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {candidate.email}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {candidate.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="space-y-1">
                          <p>{candidate.currentCompany ?? '暂无当前公司信息'}</p>
                          <div className="flex flex-wrap items-center gap-1 text-[11px]">
                            <Tags className="h-3 w-3" />
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <span
                                key={`${candidate.id}-${skill}`}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 3 ? <span>…</span> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="inline-flex items-center gap-2">
                            <span>{candidate.status}</span>
                            {candidate.score ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                                <BadgeCheck className="h-3 w-3" />
                                {candidate.score}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] text-gray-400">上次更新：{candidate.updatedAt}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{candidate.owner}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                            onClick={() => onSelect(candidate.id)}
                          >
                            查看档案
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                            onClick={() => console.info('[CandidateListTable] 安排面试', { candidateId: candidate.id })}
                          >
                            安排面试
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                            onClick={() => console.info('[CandidateListTable] 发送邮件', { candidateId: candidate.id })}
                          >
                            发送邮件
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



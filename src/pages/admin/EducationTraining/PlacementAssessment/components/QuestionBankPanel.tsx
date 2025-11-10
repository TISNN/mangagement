import { FolderKanban, GraduationCap, Layers, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { QuestionBankCategory, QuestionBankGap } from '../types';

interface Props {
  categories: QuestionBankCategory[];
  gaps: QuestionBankGap[];
}

export const QuestionBankPanel = ({ categories, gaps }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">题库与教研资产</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">覆盖率、难度分布与版本迭代一目了然，确保测评内容持续领先。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">题库总量 {categories.reduce((acc, cur) => acc + cur.itemCount, 0)}</Badge>
          <Badge className="rounded-full border border-purple-500/40 bg-purple-50/70 px-3 py-1 text-xs font-medium text-purple-600 dark:border-purple-500/30 dark:bg-purple-900/30 dark:text-purple-200">
            待补充 {gaps.length}
          </Badge>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="border-gray-200/80 bg-white shadow-sm transition hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:hover:border-purple-500/40">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{category.title}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-xs uppercase tracking-wide text-purple-600 dark:text-purple-300">
                    <Layers className="h-4 w-4" />
                    {category.itemCount} 道题目
                  </CardDescription>
                </div>
                <Badge className="rounded-full bg-gray-900/80 px-3 py-1 text-[11px] text-white dark:bg-gray-100 dark:text-gray-900">负责人 {category.owner}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Sparkles className="h-4 w-4" />
                覆盖度 {category.coverage}% · 更新 {category.lastUpdated}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500 dark:text-gray-400">
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-900/40">
                  <p className="font-medium text-gray-700 dark:text-gray-200">易</p>
                  <p className="mt-1 text-sm text-purple-600 dark:text-purple-300">{category.difficultySpread.easy}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-900/40">
                  <p className="font-medium text-gray-700 dark:text-gray-200">中</p>
                  <p className="mt-1 text-sm text-purple-600 dark:text-purple-300">{category.difficultySpread.medium}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-900/40">
                  <p className="font-medium text-gray-700 dark:text-gray-200">难</p>
                  <p className="mt-1 text-sm text-purple-600 dark:text-purple-300">{category.difficultySpread.hard}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-purple-600 dark:text-purple-300">
                {category.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-purple-50 px-2 py-0.5 dark:bg-purple-900/40">
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200/70 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">题库缺口与行动</CardTitle>
            <CardDescription>联动教研资源，确保关键题型与话题按时补齐。</CardDescription>
          </div>
          <Badge className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">高优先级 {gaps.filter((item) => item.impact === 'high').length}</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="py-2 pr-4">主题</th>
                <th className="py-2 pr-4">影响</th>
                <th className="py-2 pr-4">完成时限</th>
                <th className="py-2 pr-4">负责人</th>
                <th className="py-2">行动</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {gaps.map((gap) => (
                <tr key={gap.id} className="align-top text-sm text-gray-700 dark:text-gray-200">
                  <td className="py-3 pr-4">
                    <div className="flex items-start gap-2">
                      <FolderKanban className="mt-1 h-4 w-4 text-purple-500" />
                      <span>{gap.topic}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        gap.impact === 'high'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                          : gap.impact === 'medium'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {gap.impact === 'high' ? '高' : gap.impact === 'medium' ? '中' : '低'}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{gap.requiredBy}</td>
                  <td className="py-3 pr-4 text-xs">{gap.assignee}</td>
                  <td className="py-3 text-xs text-gray-600 dark:text-gray-300">{gap.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
};

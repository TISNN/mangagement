import React, { useMemo, useState } from 'react';
import { Award, Quote, Sparkles, Star, Users2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { CaseStudy, TeamMember, Testimonial } from '../types';

interface ProofModuleProps {
  cases: CaseStudy[];
  team: TeamMember[];
  testimonials: Testimonial[];
  onContactConsultant: () => void;
  focusedCaseId?: string | null;
  onClearFocusedCase?: () => void;
}

const CASE_TAG_COLORS: Record<string, string> = {
  工程: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200',
  背景提升: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-200',
  奖学金: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200',
  计算机: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200',
  实习项目: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-200',
  夏校: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200',
  跨专业: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200',
  传媒: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-200',
  作品集: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-200',
};

export const ProofModule: React.FC<ProofModuleProps> = ({
  cases,
  team,
  testimonials,
  onContactConsultant,
  focusedCaseId,
  onClearFocusedCase,
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const caseTags = useMemo(() => Array.from(new Set(cases.flatMap((item) => item.tags))), [cases]);

  React.useEffect(() => {
    if (!focusedCaseId) return;
    const caseToOpen = cases.find((item) => item.id === focusedCaseId);
    if (caseToOpen) {
      setSelectedCase(caseToOpen);
    }
    onClearFocusedCase?.();
  }, [focusedCaseId, cases, onClearFocusedCase]);

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">真实案例 · 看得见的成果</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">可预约线下案例说明会，查看完整文书与交付成果（已匿名处理）。</p>
          </div>
          <Button onClick={onContactConsultant} className="bg-blue-600 text-white hover:bg-blue-500">
            安排案例深度解析
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {caseTags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                CASE_TAG_COLORS[tag] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <div className="relative h-44 overflow-hidden">
                <img src={caseItem.coverImage} alt={caseItem.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 to-transparent p-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-wide text-white/70">{caseItem.timeline}</p>
                  <h3 className="mt-1 text-base font-semibold">{caseItem.title}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">学生画像</p>
                  <p>{caseItem.studentProfile}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">挑战与策略</p>
                  <p className="line-clamp-3">
                    {caseItem.challenge} · {caseItem.strategy[0]}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {caseItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        CASE_TAG_COLORS[tag] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                    <Award className="h-3.5 w-3.5" />
                    {caseItem.results.outcome}
                  </span>
                  {caseItem.results.scholarship && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200">
                      <Star className="h-3.5 w-3.5" />
                      奖学金 {caseItem.results.scholarship}
                    </span>
                  )}
                </div>

                <Button variant="outline" onClick={() => setSelectedCase(caseItem)}>
                  查看完整案例
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">核心团队 · 多角色协同</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              顾问、导师、交付与家长陪伴官构成 4 角色矩阵，保障交付质量与情绪支持。
            </p>
          </div>
          <Button variant="outline" className="rounded-full border-blue-200 text-sm text-blue-600 hover:border-blue-300 hover:text-blue-700 dark:border-blue-500/30 dark:text-blue-200">
            查看全部导师简历
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.id} className="relative overflow-hidden rounded-3xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-100 opacity-40 blur-2xl transition duration-500 group-hover:scale-110 dark:bg-blue-500/20" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-2xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.title}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2 text-[11px] text-blue-600 dark:text-blue-200">
                  {member.expertise.map((skill) => (
                    <li key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-500/10">
                      {skill}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400">{member.bio}</p>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                  <span>经验 {member.experienceYears} 年</span>
                  <span>成功案例 {member.successCases}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">学生与家长真实反馈</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">所有评价均来自服务完成后的匿名调查或公开感谢信。</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative flex h-full flex-col rounded-3xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <Quote className="absolute -top-4 right-4 h-12 w-12 text-blue-100 dark:text-blue-500/20" />
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.relation}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index + 1 <= Math.round(testimonial.rating) ? 'fill-amber-400 text-amber-400' : 'text-amber-200 dark:text-amber-500/20'}`} />
                  ))}
                </div>
                <p className="line-clamp-4 text-sm text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                <div className="rounded-2xl bg-blue-50 p-3 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                  {testimonial.highlight}
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <Button variant="ghost" size="sm" onClick={() => setSelectedTestimonial(testimonial)}>
                  查看完整评价
                </Button>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                  <Users2 className="h-3.5 w-3.5" />
                  已验证
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={Boolean(selectedCase)} onOpenChange={(open) => !open && setSelectedCase(null)}>
        {selectedCase && (
          <DialogContent className="max-w-4xl rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">{selectedCase.title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCase.timeline} · {selectedCase.studentProfile}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">学生挑战</h3>
                <p className="mt-2">{selectedCase.challenge}</p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">解决策略</h3>
                <ul className="mt-2 space-y-2">
                  {selectedCase.strategy.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">录取成果</p>
                  <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedCase.results.outcome}</p>
                  {selectedCase.results.scholarship && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">奖学金 {selectedCase.results.scholarship}</p>}
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Offer 列表：{selectedCase.results.offerList.join(' / ')}
                  </p>
                </Card>
                <Card className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">顾问点评</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{selectedCase.advisorComment}</p>
                </Card>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">交付材料</h3>
                <ul className="mt-2 flex flex-wrap gap-2 text-xs text-blue-600 dark:text-blue-200">
                  {selectedCase.assets.map((asset) => (
                    <li key={asset} className="rounded-full bg-blue-50 px-3 py-1 dark:bg-blue-500/10">
                      {asset}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-500" onClick={onContactConsultant}>
                预约顾问详解此案例
              </Button>
              <Button variant="outline" onClick={() => setSelectedCase(null)}>
                关闭
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={Boolean(selectedTestimonial)} onOpenChange={(open) => !open && setSelectedTestimonial(null)}>
        {selectedTestimonial && (
          <DialogContent className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTestimonial.author}</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">{selectedTestimonial.relation}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className={`h-4 w-4 ${index + 1 <= Math.round(selectedTestimonial.rating) ? 'fill-amber-400 text-amber-400' : 'text-amber-200 dark:text-amber-500/20'}`} />
                ))}
              </div>
              <p>{selectedTestimonial.content}</p>
              <div className="rounded-2xl bg-blue-50 p-3 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                {selectedTestimonial.highlight}
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedTestimonial(null)}>
              关闭
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};


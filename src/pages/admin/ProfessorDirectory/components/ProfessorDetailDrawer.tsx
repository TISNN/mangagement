import React from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Mail,
  MapPin,
  NotebookPen,
  Sparkles,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfessorProfile } from '../types';
import { getProfessorAvatar } from '../data';

interface ProfessorDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfessorProfile | null;
}

const formatFullDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const ProfessorDetailDrawer: React.FC<ProfessorDetailDrawerProps> = ({ open, onOpenChange, profile }) => {
  if (!profile) {
    return null;
  }

  const avatar = getProfessorAvatar(profile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-0 dark:border-gray-700/60 dark:bg-gray-900">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-600 via-indigo-600 to-indigo-800 px-6 pb-10 pt-8 text-white sm:px-10">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-semibold">{profile.name}</DialogTitle>
            <DialogDescription className="mt-2 max-w-3xl text-sm text-indigo-100">
              {profile.phdSupervisionStatus}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={avatar} alt={profile.name} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-indigo-400/40" />
              <div className="space-y-1 text-sm text-indigo-100">
                <p className="text-lg font-semibold text-white">{profile.university}</p>
                <p>{profile.college}</p>
                <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.country}
                  {profile.city ? ` · ${profile.city}` : ''}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-indigo-100">
              <p className="text-xs uppercase tracking-wide text-indigo-200">申请窗口</p>
              <p className="mt-1 flex items-center gap-2 text-white">
                <Calendar className="h-4 w-4" />
                {formatFullDate(profile.applicationWindow.start)} - {formatFullDate(profile.applicationWindow.end)}
              </p>
              <p className="mt-1 text-xs text-indigo-100/80">目标入学季：{profile.applicationWindow.intake}</p>
            </div>
          </div>

          <div className="absolute -left-10 -top-24 hidden h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl sm:block" />
          <div className="absolute -right-10 -bottom-24 hidden h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl sm:block" />
        </div>

        <div className="space-y-8 p-8">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  研究方向与项目
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.researchTags.map((tag) => (
                    <Badge key={tag} className="rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">当前重点项目</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {profile.signatureProjects.map((project) => (
                    <li key={project} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-500" />
                      <span>{project}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700/80">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <ClipboardList className="h-4 w-4 text-indigo-500" />
                  博士申请要求
                </h4>
                <dl className="mt-3 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">语言要求</dt>
                    <dd className="mt-1">{profile.phdRequirements.languageTests.join(' / ')}</dd>
                  </div>
                  {profile.phdRequirements.minimumGPA ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">GPA</dt>
                      <dd className="mt-1">{profile.phdRequirements.minimumGPA}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">推荐信数量</dt>
                    <dd className="mt-1">{profile.phdRequirements.recommendationLetters} 封</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">科研经验</dt>
                    <dd className="mt-1">{profile.phdRequirements.researchExperience}</dd>
                  </div>
                </dl>
                {profile.phdRequirements.additionalNotes ? (
                  <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/70 dark:text-gray-300">
                    {profile.phdRequirements.additionalNotes}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700/80">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <Award className="h-4 w-4 text-amber-500" />
                  资助与奖学金
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {profile.fundingOptions.map((option) => (
                    <li key={`${profile.id}-${option.type}`} className="flex items-start gap-2">
                      <Badge className="mt-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                        {option.type}
                      </Badge>
                      <span>{option.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700/80">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  代表论文
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {profile.publications.map((pub) => (
                    <li key={`${pub.title}-${pub.year}`}>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{pub.title}</p>
                      <p className="text-xs text-gray-400">{pub.year}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700/80">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">联系方式</h4>
                <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    {profile.contactEmail}
                  </p>
                  {profile.personalPage ? (
                    <a
                      href={profile.personalPage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      教授主页
                    </a>
                  ) : null}
                  <p className="flex items-center gap-2 text-xs text-gray-400">
                    <NotebookPen className="h-4 w-4" />
                    最后审核：{formatFullDate(profile.lastReviewedAt)}
                  </p>
                </div>
              </div>
            </aside>
          </section>

          <section className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700/80">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">博士生去向与顾问备注</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {profile.recentPlacements.map((placement) => (
                  <div key={`${placement.year}-${placement.destination}`} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/70">
                    <p className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      {placement.year} · {placement.destination}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {placement.student}
                      {placement.highlight ? ` · ${placement.highlight}` : ''}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-indigo-50/80 p-4 text-sm text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100">
                <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">顾问内部观察</p>
                <p className="mt-2 leading-relaxed">{profile.internalNotes}</p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-indigo-50/80 p-4 text-sm dark:bg-indigo-500/10">
            <div className="flex flex-wrap items-center gap-2 text-indigo-700 dark:text-indigo-200">
              <Sparkles className="h-4 w-4" />
              <span>
                提示：在申请工作台中，可以直接调用该教授资料，自动生成“教授沟通”任务，避免重复录入。
              </span>
            </div>
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-500"
              onClick={() => window.open(`mailto:${profile.contactEmail}`)}
            >
              发送联系邮件
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessorDetailDrawer;


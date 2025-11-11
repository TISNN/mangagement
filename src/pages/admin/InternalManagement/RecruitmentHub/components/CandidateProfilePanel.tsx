import { BadgeCheck, BookOpen, Download, Mail, NotebookPen, Phone, Tags, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { CandidateProfile } from '../data';

interface CandidateProfilePanelProps {
  candidate?: CandidateProfile | null;
  onClose: () => void;
}

export const CandidateProfilePanel: React.FC<CandidateProfilePanelProps> = ({ candidate, onClose }) => {
  if (!candidate) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{candidate.name}</h3>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
              {candidate.position}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {candidate.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            来源：{candidate.source} · 更新于 {candidate.updatedAt} · 跟进人 {candidate.owner}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              {candidate.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              {candidate.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <UserCircle className="h-3.5 w-3.5" />
              期望薪资 {candidate.expectedSalary}
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5" />
              从业 {candidate.experienceYears}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {candidate.resumeUrl ? (
            <Button
              variant="outline"
              className="inline-flex items-center gap-2 rounded-full border-gray-200 px-3 py-1 text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
              onClick={() => window.open(candidate.resumeUrl, '_blank')}
            >
              <Download className="h-3.5 w-3.5" />
              下载简历
            </Button>
          ) : null}
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-gray-200 px-3 py-1 text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[CandidateProfilePanel] 发起面试', { candidateId: candidate.id })}
          >
            发起面试
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-gray-200 px-3 py-1 text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[CandidateProfilePanel] 加入职位推荐池', { candidateId: candidate.id })}
          >
            推荐岗位
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-gray-200 px-3 py-1 text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={onClose}
          >
            关闭
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <BookOpen className="h-4 w-4 text-blue-500" />
            背景信息
          </h4>
          <dl className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div>
              <dt className="text-gray-400 dark:text-gray-500">现任公司 / 职位</dt>
              <dd>{candidate.currentCompany ?? '暂无'}</dd>
            </div>
            <div>
              <dt className="text-gray-400 dark:text-gray-500">最高学历</dt>
              <dd>{candidate.education ?? '未填写'}</dd>
            </div>
            <div>
              <dt className="text-gray-400 dark:text-gray-500">主要技能标签</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {candidate.skills.map((skill) => (
                  <span
                    key={`${candidate.id}-${skill}`}
                    className="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </dd>
            </div>
            {candidate.tags && candidate.tags.length > 0 ? (
              <div>
                <dt className="text-gray-400 dark:text-gray-500">候选人标签</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {candidate.tags.map((tag) => (
                    <span
                      key={`${candidate.id}-tag-${tag}`}
                      className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <NotebookPen className="h-4 w-4 text-emerald-500" />
            面试 & 沟通记录
          </h4>
          <div className="mt-3 space-y-3">
            {candidate.timeline.map((item) => (
              <div key={`${candidate.id}-${item.date}-${item.event}`} className="rounded-xl bg-white p-3 text-xs dark:bg-gray-900/70">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                  <span>{item.date}</span>
                  <span>{item.owner}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{item.event}</p>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <Tags className="h-4 w-4 text-amber-500" />
            附件与备注
          </h4>
          <div className="mt-3 space-y-3 text-xs text-gray-600 dark:text-gray-300">
            {candidate.attachments && candidate.attachments.length > 0 ? (
              <div className="space-y-2">
                {candidate.attachments.map((attachment) => (
                  <button
                    key={`${candidate.id}-${attachment.url}`}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/70 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    <span>{attachment.name}</span>
                    <Download className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-gray-300 px-3 py-4 text-center text-gray-400 dark:border-gray-700 dark:text-gray-500">
                暂无附件
              </p>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">备注</p>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{candidate.notes ?? '暂无备注'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};



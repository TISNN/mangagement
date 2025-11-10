import React from 'react';
import {
  AlertTriangle,
  BookPlus,
  Calendar,
  Clock,
  Copy,
  Edit3,
  FileText,
  Filter,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Tag,
  UploadCloud,
} from 'lucide-react';

interface MyMetric {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  trend: string;
}

interface DraftItem {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  words: number;
  status: '草稿' | '编辑中' | '待补充';
  auditTarget?: '团队' | '知识花园';
}

interface SubmissionItem {
  id: string;
  title: string;
  submittedAt: string;
  stage: '团队审核' | '花园审核' | '已发布';
  reviewer: string;
  note?: string;
}

const MY_METRICS: MyMetric[] = [
  { id: 'mm1', label: '累计发布', value: '148', subLabel: '团队 96 · 花园 52', trend: '+12 本月' },
  { id: 'mm2', label: '平均评分', value: '4.8', subLabel: '近 30 天 4.6', trend: '+0.3' },
  { id: 'mm3', label: '花园收益', value: '¥32,400', subLabel: '最近 6 个月', trend: '+18%' },
  { id: 'mm4', label: '待办 / 提交', value: '6 / 3', subLabel: '待补充 2 · 待审核 1', trend: '更新于 09:35' },
];

const DRAFTS: DraftItem[] = [
  { id: 'd1', title: '2025 英国商科项目选校清单（内部版）', category: '留学案例', updatedAt: '2025-11-08 08:50', words: 2860, status: '编辑中', auditTarget: '团队' },
  { id: 'd2', title: 'IELTS 写作常见问题 FAQ 2025', category: '语言培训', updatedAt: '2025-11-07 22:10', words: 1840, status: '草稿' },
  { id: 'd3', title: '高压家长沟通实战语料库（学生版）', category: '服务交付', updatedAt: '2025-11-07 18:05', words: 1560, status: '待补充', auditTarget: '知识花园' },
  { id: 'd4', title: '北美说明会双十一运营总结', category: '市场运营', updatedAt: '2025-11-06 23:40', words: 2120, status: '草稿' },
];

const SUBMISSIONS: SubmissionItem[] = [
  { id: 's1', title: 'B2B 产品培训：企业专属教程', submittedAt: '11-07 16:30', stage: '花园审核', reviewer: '知识营收组', note: '请补充授权条款附件' },
  { id: 's2', title: '签证材料清单 v2.1', submittedAt: '11-07 10:05', stage: '团队审核', reviewer: '服务质控' },
  { id: 's3', title: '学生申诉信模板合集（公开摘要）', submittedAt: '11-05 14:20', stage: '已发布', reviewer: '审核小组 B', note: '花园评分 4.9 / 15 份售出' },
];

const statusBadge: Record<DraftItem['status'], string> = {
  草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
  编辑中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  待补充: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const stageBadge: Record<SubmissionItem['stage'], string> = {
  团队审核: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  花园审核: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  已发布: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const KnowledgeHubMySpacePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">个人空间</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">My Space · 草稿、提交记录与贡献数据</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            管理所有个人知识资产，快速继续创作、查看审核进度，并同步花园收益与评分反馈。可随时一键共享到团队或知识花园。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <BookPlus className="h-4 w-4" />
            创建新文档
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            AI 辅助提纲
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MY_METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">{metric.subLabel}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" /> {metric.trend}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">草稿箱</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">继续创作或提交审核，支持批量操作与快速复制。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Filter className="h-3.5 w-3.5" /> 筛选
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
              <UploadCloud className="h-3.5 w-3.5" /> 批量提交
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {DRAFTS.map((draft) => (
            <div key={draft.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>{draft.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge[draft.status]}`}>{draft.status}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {draft.category}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 更新 {draft.updatedAt}</span>
                <span>{draft.words} 字</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                {draft.auditTarget && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <Layers className="h-3 w-3" /> 目标：{draft.auditTarget}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <Edit3 className="h-3.5 w-3.5" /> 继续编辑
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover;border-emerald-500 dark:hover:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" /> 提交审核
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-gray-300 hover:text-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-200">
                  <Copy className="h-3.5 w-3.5" /> 复制
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">提交流程</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">追踪团队和花园审核状态，及时响应反馈。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <ShieldCheck className="h-3.5 w-3.5" /> 审核历史
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {SUBMISSIONS.map((submission) => (
              <div key={submission.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{submission.title}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${stageBadge[submission.stage]}`}>{submission.stage}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> 提交 {submission.submittedAt}</span>
                  <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> 审核人：{submission.reviewer}</span>
                </div>
                {submission.note && (
                  <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-300">
                    <AlertTriangle className="mr-1 inline h-3 w-3" /> {submission.note}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover;border-indigo-500 dark:hover:text-indigo-300">
                    <MessageSquare className="h-3.5 w-3.5" /> 查看批注
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover;border-emerald-500 dark:hover:text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" /> 快速补充
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">快速操作</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">提升创作效率的常用工具。</p>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {[{
              title: '导入案例模板',
              description: '选择既有模板快速生成案例骨架，支持 AI 填充细节。',
              action: '打开模板库',
            },
            {
              title: '生成学生版本摘要',
              description: '基于内部内容自动生成对学生可见的精简版，确保敏感信息屏蔽。',
              action: '生成摘要',
            },
            {
              title: '同步知识花园收益',
              description: '查看本月收益与评分趋势，并获取优化建议。',
              action: '查看收益',
            },
            {
              title: '订阅审核提醒',
              description: '关注提交后 24 小时内审核进度，逾期自动提示。',
              action: '开启提醒',
            }].map((item) => (
              <div key={item.title} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                <div className="text-sm font-semibold">{item.title}</div>
                <p className="mt-1 text-xs leading-5 text-indigo-400 dark:text-indigo-300">{item.description}</p>
                <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-white/60 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-indigo-600 shadow-sm hover:bg-white dark:border-indigo-200/40 dark:bg-indigo-900/40 dark:text-indigo-200">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHubMySpacePage;

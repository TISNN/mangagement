import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Gavel,
  Inbox,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Tag,
  UploadCloud,
} from 'lucide-react';

interface ReviewQueueItem {
  id: string;
  title: string;
  submitter: string;
  submittedAt: string;
  stage: '团队审核' | '花园审核';
  risk: '低' | '中' | '高';
  audience: string[];
  note?: string;
}

interface EscalationItem {
  id: string;
  type: '版权' | '敏感信息' | '投诉';
  title: string;
  reporter: string;
  createdAt: string;
  status: '处理中' | '已解决' | '待分配';
  actionOwner: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  time: string;
  result: '通过' | '驳回' | '警告';
  detail: string;
}

const REVIEW_QUEUE: ReviewQueueItem[] = [
  {
    id: 'rq1',
    title: 'IELTS 写作提分攻略（完整版）',
    submitter: '语言培训教研组',
    submittedAt: '11-08 09:15',
    stage: '花园审核',
    risk: '中',
    audience: ['学生可见'],
    note: '需确认引用范文版权，附件已上传',
  },
  {
    id: 'rq2',
    title: '北美申请文书模板合集 v3.0',
    submitter: '北美顾问案例库',
    submittedAt: '11-08 08:20',
    stage: '团队审核',
    risk: '低',
    audience: ['顾问内部', '合作机构'],
  },
  {
    id: 'rq3',
    title: 'B2B 产品培训 Slides（企业版）',
    submitter: '合作支持团队',
    submittedAt: '11-07 22:05',
    stage: '花园审核',
    risk: '高',
    audience: ['合作机构'],
    note: '存在客户名单，需脱敏处理后再发布',
  },
];

const ESCALATIONS: EscalationItem[] = [
  { id: 'es1', type: '投诉', title: '课程《IELTS 口语冲刺营》学生反馈教材过期', reporter: '学生用户 201542', createdAt: '11-07 19:40', status: '处理中', actionOwner: '语言培训教研组' },
  { id: 'es2', type: '敏感信息', title: 'B2B 培训资料包含合作方合同细节', reporter: '审核机器人', createdAt: '11-07 18:05', status: '待分配', actionOwner: '待指派' },
  { id: 'es3', type: '版权', title: '申诉信模板引用外部案例未注明来源', reporter: '审核小组 B', createdAt: '11-06 20:12', status: '已解决', actionOwner: '法务审核完成' },
];

const AUDIT_LOGS: AuditLogItem[] = [
  { id: 'al1', action: '通过知识花园审核', actor: '运营审核员 · Zoe', time: '11-07 21:30', result: '通过', detail: '《北美申请案例拆解》已上线' },
  { id: 'al2', action: '驳回团队共享', actor: '服务质控', time: '11-07 19:05', result: '驳回', detail: '《签证风险处理》缺少最新政策说明' },
  { id: 'al3', action: '发出警告', actor: '法务', time: '11-07 18:20', result: '警告', detail: '《海外就业指南》引用未授权图像，要求 24h 内整改' },
  { id: 'al4', action: '恢复上架', actor: '知识营收组', time: '11-07 16:50', result: '通过', detail: '《IELTS 听力训练营》完成更新重新上架' },
];

const riskBadge: Record<ReviewQueueItem['risk'], string> = {
  低: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  中: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  高: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const statusBadge: Record<EscalationItem['status'], string> = {
  处理中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  已解决: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  待分配: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const resultBadge: Record<AuditLogItem['result'], string> = {
  通过: 'text-emerald-600 dark:text-emerald-300',
  驳回: 'text-rose-500 dark:text-rose-300',
  警告: 'text-amber-500 dark:text-amber-300',
};

const iconForEscalation = (type: EscalationItem['type']) => {
  switch (type) {
    case '敏感信息':
      return <ShieldAlert className="h-3.5 w-3.5" />;
    case '版权':
      return <Gavel className="h-3.5 w-3.5" />;
    case '投诉':
    default:
      return <AlertTriangle className="h-3.5 w-3.5" />;
  }
};

const KnowledgeModerationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">审核与风控中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Moderation · 审核队列、风险预警与操作日志</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            管控知识库与知识花园的审核流程，统一处理版权、敏感信息、用户投诉等事件，保障内容合规与口碑。支持自动检测、人工协作与处罚闭环。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Filter className="h-4 w-4" />
            审核配置
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            启动 AI 风控
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">待审核队列</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">按优先级展示当前待处理的团队与花园审核任务。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Clock className="h-3.5 w-3.5" /> SLA 排序
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
              <UploadCloud className="h-3.5 w-3.5" /> 批量通过
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          {REVIEW_QUEUE.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:border-indigo-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${riskBadge[item.risk]}`}>风险 {item.risk}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <ShieldCheck className="h-3 w-3" /> {item.stage}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Inbox className="h-3 w-3" /> 提交人：{item.submitter}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 提交 {item.submittedAt}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Tag className="h-3 w-3" /> 受众：{item.audience.join(' · ')}
                </span>
              </div>
              {item.note && (
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-300">
                  <AlertTriangle className="mr-1 inline h-3 w-3" /> {item.note}
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 通过
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:hover:border-rose-500 dark:hover:text-rose-300">
                  <ShieldX className="h-3.5 w-3.5" /> 驳回
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <MessageSquare className="h-3.5 w-3.5" /> 添加批注
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">升级 / 风险事件</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">处理版权、投诉、敏感信息等高优先级事件。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <RefreshCw className="h-3.5 w-3.5" /> 刷新
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {ESCALATIONS.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {iconForEscalation(issue.type)} {issue.type}
                    </span>
                    <span>{issue.title}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge[issue.status]}`}>{issue.status}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> 报告人：{issue.reporter}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {issue.createdAt}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> 处理人：{issue.actionOwner}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 标记完成
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    <Eye className="h-3.5 w-3.5" /> 查看文档
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">审核日志</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">记录所有审核动作，支持追溯与问责。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Download className="h-3.5 w-3.5" /> 导出
            </button>
          </div>
          <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300 leading-5">
            {AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{log.action}</div>
                  <span className={resultBadge[log.result]}>{log.result}</span>
                </div>
                <div className="mt-1 text-gray-400 dark:text-gray-500">
                  {log.actor} · {log.time}
                </div>
                <div className="mt-1 text-gray-600 dark:text-gray-300">{log.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeModerationPage;
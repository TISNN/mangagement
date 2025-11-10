import React from 'react';
import {
  CheckCircle2,
  Globe2,
  KeyRound,
  Layers,
  ListPlus,
  MapPinned,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UploadCloud,
  Users,
} from 'lucide-react';

interface TagGroup {
  id: string;
  name: string;
  description: string;
  tags: string[];
  owner: string;
  updatedAt: string;
}

interface AudiencePolicy {
  id: string;
  audience: string;
  description: string;
  defaultAccess: '允许' | '审核' | '禁止';
  notes?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  owner: string;
  status: '启用' | '停用';
}

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  status: '已连接' | '待配置';
  owner: string;
}

const TAG_GROUPS: TagGroup[] = [
  {
    id: 'tg1',
    name: '内容分类',
    description: '用于知识花园主分类，决定首页导航与推荐位。',
    tags: ['留学规划', '语言培训', '销售话术', '服务交付', 'B2B 培训'],
    owner: '知识运营',
    updatedAt: '2025-11-07 18:20',
  },
  {
    id: 'tg2',
    name: '内容形态',
    description: '区分长文、课程、模板、视频等，便于多端展示。',
    tags: ['长文', '模板包', '短视频', '课程包', '音频'],
    owner: '知识运营',
    updatedAt: '2025-11-06 21:35',
  },
  {
    id: 'tg3',
    name: '敏感级别',
    description: '控制内容脱敏与访问权限。',
    tags: ['公开', '学生可见', '顾问内部', '合作机构', '机密'],
    owner: '安全与合规',
    updatedAt: '2025-11-05 09:50',
  },
];

const AUDIENCE_POLICIES: AudiencePolicy[] = [
  { id: 'ap1', audience: '学生可见', description: '仅可访问标记为学生可见的内容，默认开放免费内容，付费需实名认证。', defaultAccess: '允许' },
  { id: 'ap2', audience: '顾问内部', description: '需员工身份校验；允许查看内部案例与 SOP，但禁止外部分享。', defaultAccess: '审核', notes: '敏感信息自动加水印' },
  { id: 'ap3', audience: '合作机构', description: '基于企业账号授权，支持批量导入。可访问 B 端培训与授权资料。', defaultAccess: '审核' },
  { id: 'ap4', audience: '公众访客', description: '仅能访问公开内容，禁止查看付费摘要与内部标签。', defaultAccess: '禁止' },
];

const AUTOMATION_RULES: AutomationRule[] = [
  { id: 'ar1', name: '敏感级别自动检测', trigger: '上传时包含敏感关键词', action: '自动转为内部审核并触发提醒', owner: '安全与合规', status: '启用' },
  { id: 'ar2', name: '学生专区推荐', trigger: '学生购买语言课程', action: '推荐相关模板 + 发送学员社群邀请', owner: '知识运营', status: '启用' },
  { id: 'ar3', name: '授权内容到期提醒', trigger: '距离授权结束 10 天', action: '发送续约邮件 + 创建任务', owner: 'B2B 合作', status: '启用' },
  { id: 'ar4', name: '评分过低预警', trigger: '内容评分连续三天低于 3.5', action: '通知内容负责人复审', owner: '质量保障', status: '停用' },
];

const INTEGRATIONS: IntegrationItem[] = [
  { id: 'ig1', name: '支付网关 · Stripe', description: '处理知识花园付费、订阅、退款。', status: '已连接', owner: '财务运营' },
  { id: 'ig2', name: 'CRM 触点同步', description: '将购买与学习行为同步至 CRM，驱动后续跟进。', status: '待配置', owner: '销售运营' },
  { id: 'ig3', name: '教育直播平台', description: '用于付费课程直播与回放，支持账号绑定。', status: '已连接', owner: '培训运营' },
  { id: 'ig4', name: '内容版权检测', description: '对接第三方版权库，自动比对文本与图片。', status: '待配置', owner: '法务合规' },
];

const statusBadge: Record<AutomationRule['status'], string> = {
  启用: 'text-emerald-600 dark:text-emerald-300',
  停用: 'text-gray-500 dark:text-gray-400',
};

const integrationBadge: Record<IntegrationItem['status'], string> = {
  已连接: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  待配置: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const KnowledgeSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">知识中心设置</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Knowledge Hub Settings · 标签、受众、自动化与集成管理</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            维护知识库生态的基础配置，包括分类标签、受众权限、自动化规则与外部集成接口，确保知识生产、共享、变现安全有序。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Settings className="h-4 w-4" />
            导出配置
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            保存修改
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">标签与分类</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">集中管理分类、形态、敏感级别等标签组。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <ListPlus className="h-3.5 w-3.5" /> 新增标签组
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-300">
              <Trash2 className="h-3.5 w-3.5" /> 清理无用标签
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TAG_GROUPS.map((group) => (
            <div key={group.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>{group.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                  <Layers className="h-3 w-3" /> {group.tags.length}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{group.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                {group.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>负责人：{group.owner}</span>
                <span>更新：{group.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">受众与权限策略</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">为学生、顾问、B 端等不同角色配置默认权限。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Users className="h-3.5 w-3.5" /> 管理角色
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {AUDIENCE_POLICIES.map((policy) => (
              <div key={policy.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Globe2 className="h-3 w-3" /> {policy.audience}
                    </span>
                    <span>{policy.description}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${policy.defaultAccess === '允许' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : policy.defaultAccess === '审核' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>{policy.defaultAccess}</span>
                </div>
                {policy.notes && <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">{policy.notes}</div>}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 保存
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    <KeyRound className="h-3.5 w-3.5" /> 配置白名单
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">自动化规则</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">触发条件与动作，助力高效风控与运营。</p>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {AUTOMATION_RULES.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{rule.name}</div>
                  <span className={rule.status === '启用' ? 'inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300' : 'inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400'}>
                    {rule.status === '启用' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />} {rule.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">触发：{rule.trigger}</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">动作：{rule.action}</div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">负责人：{rule.owner}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">外部集成</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">打通支付、CRM、直播、版权等第三方系统。</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <UploadCloud className="h-3.5 w-3.5" /> 新增集成
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {INTEGRATIONS.map((integration) => (
            <div key={integration.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>{integration.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${integrationBadge[integration.status]}`}>{integration.status}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{integration.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>负责人：{integration.owner}</span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5" /> 配置
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KnowledgeSettingsPage;
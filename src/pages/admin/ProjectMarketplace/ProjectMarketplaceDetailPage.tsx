import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PROJECT_MARKET_ITEMS } from './data';
import { ProjectItem } from './types';
import { cn } from '@/lib/utils';

const STAGE_BADGE = {
  本科: 'bg-blue-100 text-blue-600',
  硕士: 'bg-purple-100 text-purple-600',
  博士: 'bg-emerald-100 text-emerald-600',
  语言: 'bg-amber-100 text-amber-600',
  职业发展: 'bg-rose-100 text-rose-600',
} as const;

const formatCurrency = (value: number, currency: 'CNY' | 'USD' | 'EUR') => {
  try {
    const locale = currency === 'USD' ? 'en-US' : 'zh-CN';
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  } catch (error) {
    if (currency === 'USD') {
      return `$${Math.round(value).toLocaleString('en-US')}`;
    }
    return `¥${Math.round(value).toLocaleString('zh-CN')}`;
  }
};

const formatPriceRange = (project: ProjectItem) => {
  const { min, max, currency } = project.priceRange;
  if (min === max) {
    return formatCurrency(min, currency);
  }
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

const formatDuration = (weeks: number) => `${weeks} 周`;

const ProjectMarketplaceDetailPage: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const project = useMemo(() => PROJECT_MARKET_ITEMS.find((item) => item.id === projectId), [projectId]);

  if (!project) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-2xl font-semibold text-gray-800 dark:text-white">未找到对应的项目</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">请返回项目市场重新选择</p>
        <Button onClick={() => navigate('/admin/project-marketplace')} className="bg-indigo-600 text-white hover:bg-indigo-500">
          返回项目市场
        </Button>
      </div>
    );
  }

  const providerAvatar =
    project.providerAvatar ?? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60';

  const handleAddToShortlist = () => {
    setShowMessage(`${project.title} 已加入推荐清单，可在 CRM 中继续跟进。`);
    setTimeout(() => setShowMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white pb-16 text-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-6">
          <Link
            to="/admin/project-marketplace"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回项目市场
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>项目 ID：</span>
            <span>{project.id}</span>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="relative h-72 w-full md:h-80">
            <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <Badge className="bg-white/20 text-white backdrop-blur">{project.providerType}</Badge>
              <span className={cn('rounded-full px-3 py-1 text-[11px] font-semibold', STAGE_BADGE[project.stage] ?? 'bg-white/20 text-white')}>
                {project.stage}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                {Math.round(project.successRate * 100)}% 成功率
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold md:text-4xl">{project.title}</h1>
                <p className="text-sm text-white/80">{project.subtitle}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {project.country}
                    {project.city ? ` · ${project.city}` : ''}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-300" />
                    {project.rating.toFixed(1)} · {project.reviewCount} 条评价
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    预计 {formatDuration(project.durationWeeks)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 text-right text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <img src={providerAvatar} alt={project.providerName} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30" />
                  <div>
                    <p className="text-base font-semibold text-white">{project.providerName}</p>
                    <p>最新更新：{project.updatedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showMessage ? (
          <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 text-sm text-indigo-600 shadow-sm dark:border-indigo-600/40 dark:bg-indigo-500/10 dark:text-indigo-200">
            {showMessage}
          </div>
        ) : null}

        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {project.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleAddToShortlist} className="bg-indigo-600 text-white hover:bg-indigo-500">
              加入推荐清单
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              导出项目方案
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.7fr,1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">价格区间</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{formatPriceRange(project)}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">服务语言</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{project.languages.join(' / ')}</p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">支援方式：{project.supportChannels.join('、')}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">成功指标</p>
                <p className="mt-2 text-xl font-semibold text-emerald-500">{Math.round(project.successRate * 100)}%</p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{project.rating.toFixed(1)} 分 · {project.reviewCount} 条评价</p>
              </div>
            </div>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">项目亮点</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-300">
                {project.focusAreas.map((area) => (
                  <span key={area} className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
                    {area}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">服务节奏</h2>
              <div className="mt-4 space-y-3">
                {project.timeline.map((step) => (
                  <div key={step.label} className="rounded-2xl border border-dashed border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-300">{step.label}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">套餐对比</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">支持自定义组合报价</p>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {project.packages.map((pkg) => (
                  <div key={pkg.name} className="rounded-2xl border border-gray-200 p-5 shadow-sm dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{pkg.name}</p>
                      <p className="text-sm font-medium text-indigo-500 dark:text-indigo-300">
                        {formatCurrency(pkg.minPrice, pkg.currency)}
                        {pkg.maxPrice && pkg.maxPrice !== pkg.minPrice ? ` - ${formatCurrency(pkg.maxPrice, pkg.currency)}` : ''}
                      </p>
                    </div>
                    {pkg.durationWeeks ? <p className="text-xs text-gray-500 dark:text-gray-400">预计周期：{pkg.durationWeeks} 周</p> : null}
                    <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {pkg.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                    {pkg.seatLimit ? <p className="mt-3 text-xs text-amber-500">名额上限：{pkg.seatLimit} 个</p> : null}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">机构联系人</h3>
              <div className="mt-4 flex items-center gap-3">
                <img src={providerAvatar} alt={project.providerName} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.providerName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{project.country}{project.city ? ` · ${project.city}` : ''}</p>
                </div>
              </div>
              <Button className="mt-4 w-full bg-indigo-600 text-white hover:bg-indigo-500">发起联络</Button>
              <Button
                variant="outline"
                className="mt-2 w-full border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
              >
                分享项目
              </Button>
            </div>

            {project.insight ? (
              <div className="rounded-3xl border border-indigo-100 bg-indigo-50/80 p-5 text-sm text-indigo-600 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                <h4 className="mb-2 flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="h-4 w-4" />
                  实时洞察
                </h4>
                <p>{project.insight}</p>
              </div>
            ) : null}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">服务支援方式</h3>
              <ul className="mt-3 space-y-2">
                {project.supportChannels.map((channel) => (
                  <li key={channel} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 text-indigo-500 dark:text-indigo-300" />
                    <span>{channel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">下一步建议</h3>
              <ol className="mt-3 space-y-3 text-sm leading-6">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                    1
                  </span>
                  <span>确认学生预算、语言与时间要求后加入推荐清单。</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                    2
                  </span>
                  <span>选择合适套餐并与机构沟通名额、奖学金政策与签证节奏。</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                    3
                  </span>
                  <span>在 CRM 中创建任务，追踪面试、签约及落地安排。</span>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectMarketplaceDetailPage;


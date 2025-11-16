import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookmarkPlus,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Globe2,
  LayoutGrid,
  List,
  MapPin,
  Search,
  Share2,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PROJECT_MARKET_ITEMS, PROJECT_MARKETPLACE_FILTERS } from './data';
import { ProjectItem } from './types';

type ViewMode = 'grid' | 'list';
type SortMode = 'recommended' | 'rating' | 'price' | 'recent';

const PRICE_SLIDER_MIN = 40000;
const PRICE_SLIDER_MAX = 140000;
const MAX_COMPARE_ITEMS = 3;

interface ActionState {
  message: string;
  variant: 'default' | 'success' | 'destructive';
}

const SORT_MODE_LABELS: Record<SortMode, string> = {
  recommended: '推荐排序',
  rating: '评分最高',
  price: '价格从低到高',
  recent: '最近更新',
};

const VIEW_MODE_OPTIONS: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'grid', label: '卡片视图', icon: LayoutGrid },
  { id: 'list', label: '列表视图', icon: List },
];

const HERO_TABS = ['全球院校合作', '导师精品计划', 'Offer 转化旗舰', '实时数据洞察'];

const STAGE_BADGES: Record<string, string> = {
  本科: 'bg-blue-100 text-blue-600',
  硕士: 'bg-purple-100 text-purple-600',
  博士: 'bg-emerald-100 text-emerald-600',
  语言: 'bg-amber-100 text-amber-600',
  职业发展: 'bg-rose-100 text-rose-600',
};

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

const calcAveragePrice = (project: ProjectItem) => (project.priceRange.min + project.priceRange.max) / 2;

const formatDuration = (weeks: number) => `${weeks} 周`;

const ProjectCard: React.FC<{
  project: ProjectItem;
  viewMode: ViewMode;
  onViewDetail: (item: ProjectItem) => void;
  onToggleCompare: (id: string) => void;
  selectedForCompare: boolean;
  onAddToShortlist: (item: ProjectItem) => void;
}> = ({ project, viewMode, onViewDetail, onToggleCompare, selectedForCompare, onAddToShortlist }) => {
  const providerAvatar =
    project.providerAvatar ?? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60';
  const stageBadgeClass = STAGE_BADGES[project.stage] ?? 'bg-gray-100 text-gray-600';

  return (
    <div
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-900/60',
        viewMode === 'list' && 'md:flex-row',
      )}
    >
      <div
        className={cn(
          'relative h-48 overflow-hidden md:h-auto',
          viewMode === 'list' ? 'md:w-72' : 'md:h-48',
        )}
      >
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-900/10 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 text-xs font-medium text-white">
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${stageBadgeClass}`}>
            {project.stage}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {Math.round(project.successRate * 100)}% 成功率
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/90">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur">
            <Star className="h-3 w-3 text-amber-300" />
            {project.rating.toFixed(1)} · {project.reviewCount}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur">
            <Clock className="h-3 w-3" />
            {formatDuration(project.durationWeeks)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur">
            <MapPin className="h-3 w-3" />
            {project.country}
            {project.city ? ` · ${project.city}` : ''}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col justify-between p-6',
          viewMode === 'list' ? 'md:px-6 md:py-5' : '',
        )}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">{project.providerType}</Badge>
            <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-300">
              {project.category}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-white">
              {project.title}
              <ArrowUpRight className="h-4 w-4 text-indigo-400" />
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{project.subtitle}</p>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{project.highlight}</p>

          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/60">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatPriceRange(project)}</p>
              <p>价格区间</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/60">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.languages.join(' / ')}</p>
              <p>服务语言</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/60">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.startDates[0]}</p>
              <p>最近开营</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src={providerAvatar} alt={project.providerName} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{project.providerName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">最近更新：{project.updatedAt}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => onAddToShortlist(project)}>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              加入推荐清单
            </Button>
            <Button
              variant={selectedForCompare ? 'default' : 'outline'}
              className="flex-1 md:flex-none"
              onClick={() => onToggleCompare(project.id)}
            >
              对比
            </Button>
          </div>
          <Button onClick={() => onViewDetail(project)} className="w-full bg-indigo-600 text-white hover:bg-indigo-500 md:w-auto">
            查看项目详情
          </Button>
        </div>
      </div>
    </div>
  );
};

const CompareDrawer: React.FC<{
  projects: ProjectItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ projects, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl rounded-3xl border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">项目对比概览</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            从价格、周期、语言和成功率维度快速比较不同项目，帮助你为学生挑选最佳方案。
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="w-48 border-b border-gray-200 pb-3 dark:border-gray-700">项目</th>
                <th className="border-b border-gray-200 pb-3 dark:border-gray-700">价格区间</th>
                <th className="border-b border-gray-200 pb-3 dark:border-gray-700">周期</th>
                <th className="border-b border-gray-200 pb-3 dark:border-gray-700">语言</th>
                <th className="border-b border-gray-200 pb-3 dark:border-gray-700">成功率</th>
                <th className="border-b border-gray-200 pb-3 dark:border-gray-700">亮点标签</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="align-top text-gray-600 dark:text-gray-300">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{project.title}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.providerName}</p>
                  </td>
                  <td className="py-4 pr-4">{formatPriceRange(project)}</td>
                  <td className="py-4 pr-4">{formatDuration(project.durationWeeks)}</td>
                  <td className="py-4 pr-4">{project.languages.join(' / ')}</td>
                  <td className="py-4 pr-4">{Math.round(project.successRate * 100)}%</td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjectMarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [budgetCap, setBudgetCap] = useState<number>(PRICE_SLIDER_MAX);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [actionState, setActionState] = useState<ActionState | null>(null);

  useEffect(() => {
    if (!actionState) return;
    const timer = setTimeout(() => setActionState(null), 3200);
    return () => clearTimeout(timer);
  }, [actionState]);

  const derivedFilters = useMemo(() => {
    const countries = Array.from(new Set([...PROJECT_MARKETPLACE_FILTERS.countries, ...PROJECT_MARKET_ITEMS.map((item) => item.country)])).sort();
    const stages = Array.from(new Set([...PROJECT_MARKETPLACE_FILTERS.stages, ...PROJECT_MARKET_ITEMS.map((item) => item.stage)])).sort();
    const languages = Array.from(new Set([...PROJECT_MARKETPLACE_FILTERS.languages, ...PROJECT_MARKET_ITEMS.flatMap((item) => item.languages)])).sort();
    const tags = Array.from(new Set([...PROJECT_MARKETPLACE_FILTERS.tags, ...PROJECT_MARKET_ITEMS.flatMap((item) => item.tags)])).sort();
    return { countries, stages, languages, tags };
  }, []);

  const featuredProjects = useMemo(() => PROJECT_MARKET_ITEMS.filter((item) => item.featured), []);
  const heroCover = featuredProjects[0]?.coverImage;

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedCountries.length > 0 ||
    selectedStages.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedTags.length > 0 ||
    budgetCap < PRICE_SLIDER_MAX;

  const filteredProjects = useMemo(() => {
    return PROJECT_MARKET_ITEMS.filter((project) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        [project.title, project.subtitle, project.providerName, project.highlight, project.tags.join(' ')].some((text) =>
          text.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        );

      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(project.country);
      const matchesStage = selectedStages.length === 0 || selectedStages.includes(project.stage);
      const matchesLanguage = selectedLanguages.length === 0 || project.languages.some((lang) => selectedLanguages.includes(lang));
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => project.tags.includes(tag));
      const matchesBudget = project.priceRange.min <= budgetCap;

      return matchesSearch && matchesCountry && matchesStage && matchesLanguage && matchesTags && matchesBudget;
    });
  }, [searchTerm, selectedCountries, selectedStages, selectedLanguages, selectedTags, budgetCap]);

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    switch (sortMode) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'price':
        return list.sort((a, b) => calcAveragePrice(a) - calcAveragePrice(b));
      case 'recent':
        return list.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
      default:
        return list.sort((a, b) => {
          const scoreA = (a.featured ? 1 : 0) + a.successRate;
          const scoreB = (b.featured ? 1 : 0) + b.successRate;
          return scoreB - scoreA;
        });
    }
  }, [filteredProjects, sortMode]);

  const stats = useMemo(() => {
    const total = sortedProjects.length;
    if (total === 0) {
      return {
        total,
        averagePrice: 0,
        averageRating: 0,
        highSuccessRatio: 0,
      };
    }
    const avgPrice = Math.round(sortedProjects.reduce((sum, project) => sum + calcAveragePrice(project), 0) / total);
    const avgRating = sortedProjects.reduce((sum, project) => sum + project.rating, 0) / total;
    const highSuccessRatio = Math.round((sortedProjects.filter((project) => project.successRate >= 0.85).length / total) * 100);
    return {
      total,
      averagePrice: avgPrice,
      averageRating: avgRating,
      highSuccessRatio,
    };
  }, [sortedProjects]);

  const selectedProjectsForCompare = useMemo(() => sortedProjects.filter((item) => compareIds.includes(item.id)), [sortedProjects, compareIds]);

  const topSuccessProjects = useMemo(
    () =>
      [...PROJECT_MARKET_ITEMS]
        .sort((a, b) => b.successRate - a.successRate)
        .slice(0, 4),
    [],
  );

  const latestProjects = useMemo(
    () =>
      [...PROJECT_MARKET_ITEMS]
        .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
        .slice(0, 4),
    [],
  );

  const toggleArrayValue = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCountries([]);
    setSelectedStages([]);
    setSelectedLanguages([]);
    setSelectedTags([]);
    setBudgetCap(PRICE_SLIDER_MAX);
    setActionState({ message: '筛选条件已重置', variant: 'default' });
  };

  const handleAddToShortlist = (project: ProjectItem) => {
    setActionState({
      message: `${project.title} 已加入推荐清单，可在 CRM 中继续跟进。`,
      variant: 'success',
    });
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        setActionState({
          message: `最多可同时比较 ${MAX_COMPARE_ITEMS} 个项目，已为你保留之前的选择。`,
          variant: 'destructive',
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleOpenCompare = () => {
    if (compareIds.length < 2) {
      setActionState({
        message: '至少选择 2 个项目再进行对比噢。',
        variant: 'default',
      });
      return;
    }
    setCompareOpen(true);
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-indigo-200 shadow-lg dark:border-indigo-500/40">
        {heroCover ? (
          <div className="absolute inset-0">
            <img src={heroCover} alt="Project marketplace hero" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-indigo-900/40 to-gray-900/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-900" />
        )}

        <div className="relative z-10 flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-50">
              <Sparkles className="h-3.5 w-3.5" />
              Project Marketplace
            </div>
            <div>
              <h1 className="text-3xl font-semibold lg:text-[2.4rem]">
                全球项目生态，助力顾问打造高转化留学方案
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100">
                借鉴知识花园的视觉语言，我们为项目上架与推介打造沉浸式展示大厅。支持多维筛选、精选推荐、实时洞察和对比决策，帮助团队在最短时间内找到最适合学生的服务组合。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-100/90">
                  <Building2 className="h-4 w-4" />
                  在架项目
                </div>
                <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
                <p className="text-xs text-indigo-100/70">筛选条件下可直接推荐的方案</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-100/90">
                  <BarChart3 className="h-4 w-4" />
                  成功率 ≥ 85%
                </div>
                <p className="mt-2 text-2xl font-semibold">{stats.highSuccessRatio}%</p>
                <p className="text-xs text-indigo-100/70">近 30 天高成功率项目占比</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-100/90">
                  <Star className="h-4 w-4 text-amber-300" />
                  平均评分
                </div>
                <p className="mt-2 text-2xl font-semibold">{stats.averageRating ? stats.averageRating.toFixed(1) : '--'}</p>
                <p className="text-xs text-indigo-100/70">基于学生与顾问的真实反馈</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-100/90">
                  <Globe2 className="h-4 w-4" />
                  覆盖国家
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {derivedFilters.countries.length}
                </p>
                <p className="text-xs text-indigo-100/70">同步展示 5 个重点留学目的地</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {HERO_TABS.map((tab) => (
                <span key={tab} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-indigo-50">
                  {tab}
                </span>
              ))}
            </div>
          </div>

          {featuredProjects[0] ? (
            <div className="w-full max-w-sm rounded-3xl border border-white/30 bg-white/90 p-5 shadow-2xl backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/80">
              <div className="overflow-hidden rounded-2xl">
                <img src={featuredProjects[0].coverImage} alt={featuredProjects[0].title} className="h-40 w-full object-cover" />
              </div>
              <div className="mt-4 space-y-3 text-gray-700 dark:text-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-indigo-600">
                    {featuredProjects[0].category}
                  </span>
                  <span className="text-indigo-500 dark:text-indigo-300">精选推荐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {featuredProjects[0].title}
                </h3>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{featuredProjects[0].highlight}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    {featuredProjects[0].rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {featuredProjects[0].reviewCount} 条评价
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {Math.round(featuredProjects[0].successRate * 100)}% 转化
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/60 px-3 py-2 text-xs text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                  <ArrowRight className="h-4 w-4" />
                  {featuredProjects[0].insight ?? '近期咨询量稳定增长'}
                </div>
                <Button
                  size="sm"
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-500"
                  onClick={() => navigate(`/admin/project-marketplace/${featuredProjects[0].id}`)}
                >
                  查看详情
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {actionState ? (
        <Alert variant={actionState.variant} className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionState.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">可用项目总数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.total} 个</p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">过滤条件下的有效方案</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">平均价格</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.averagePrice ? formatCurrency(stats.averagePrice, 'CNY') : '--'}
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">以人民币计算</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">平均评分</p>
          <p className="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.averageRating ? stats.averageRating.toFixed(1) : '--'}
            <Star className="h-4 w-4 text-amber-400" />
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">来自学生与顾问的真实反馈</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">高成功率项目占比</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-500">{stats.highSuccessRatio}%</p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">成功率 ≥ 85% 的方案</p>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Filter className="h-4 w-4 text-indigo-500" />
            精准筛选
          </div>
          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
              重置筛选
            </Button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-4 md:items-center">
          <div className="md:col-span-2">
            <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/60">
              <Search className="mr-3 h-4 w-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="搜索项目 / 机构 / 标签"
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">预算上限 (¥)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={PRICE_SLIDER_MIN}
                max={PRICE_SLIDER_MAX}
                step={5000}
                value={budgetCap}
                onChange={(event) => setBudgetCap(Number(event.target.value))}
                className="h-2 w-full cursor-pointer rounded-lg bg-indigo-100 accent-indigo-500 dark:bg-indigo-500/20"
              />
              <span className="w-20 text-right text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                ¥{(budgetCap / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">排序方式</label>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {Object.entries(SORT_MODE_LABELS).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">国家 / 地区</p>
            <div className="flex flex-wrap gap-2">
              {derivedFilters.countries.map((country) => {
                const active = selectedCountries.includes(country);
                return (
                  <button
                    key={country}
                    onClick={() => toggleArrayValue(country, selectedCountries, setSelectedCountries)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-all',
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    )}
                  >
                    {country}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">阶段</p>
            <div className="flex flex-wrap gap-2">
              {derivedFilters.stages.map((stage) => {
                const active = selectedStages.includes(stage);
                return (
                  <button
                    key={stage}
                    onClick={() => toggleArrayValue(stage, selectedStages, setSelectedStages)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    )}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">服务语言</p>
            <div className="flex flex-wrap gap-2">
              {derivedFilters.languages.map((language) => {
                const active = selectedLanguages.includes(language);
                return (
                  <button
                    key={language}
                    onClick={() => toggleArrayValue(language, selectedLanguages, setSelectedLanguages)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    )}
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">标签</p>
            <div className="flex flex-wrap gap-2">
              {derivedFilters.tags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleArrayValue(tag, selectedTags, setSelectedTags)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {featuredProjects.length ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Award className="h-4 w-4 text-amber-400" />
              官方推荐 / 高转化项目
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">根据近 30 天咨询数据自动更新</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-rose-50 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-amber-500/40 dark:from-amber-950/30 dark:via-gray-900 dark:to-rose-950/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Featured</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.providerName}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400" onClick={() => setActiveProject(project)}>
                    查看详情
                  </Button>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{project.highlight}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-amber-500 shadow-sm dark:bg-white/10">
                    <Star className="h-3.5 w-3.5" />
                    {project.rating.toFixed(1)} 分
                  </span>
                  <span>最近咨询趋势：{project.insight ?? '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              高成功率榜单
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">近 90 天表现</span>
          </div>
          <div className="mt-4 space-y-3">
            {topSuccessProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200/70 bg-gray-50/60 px-4 py-3 text-sm text-gray-600 transition hover:border-indigo-200 hover:bg-white dark:border-gray-700/60 dark:bg-gray-800/40 dark:text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-indigo-500 shadow-sm dark:bg-gray-900/80">
                    {project.country.slice(0, 2)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{project.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{project.providerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-500">{Math.round(project.successRate * 100)}%</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">成功率</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <ArrowRight className="h-4 w-4 text-indigo-500" />
              最新上架 / 更新
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">实时跟进项目迭代</span>
          </div>
          <div className="mt-4 space-y-3">
            {latestProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200/70 bg-gray-50/60 px-4 py-3 text-sm text-gray-600 transition hover:border-purple-200 hover:bg-white dark:border-gray-700/60 dark:bg-gray-800/40 dark:text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-purple-500 shadow-sm dark:bg-gray-900/80">
                    {project.stage.slice(0, 2)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{project.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{project.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-indigo-500">{project.updatedAt}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">最近更新</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">项目列表</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              共 {sortedProjects.length} 个项目，支持快速对比与推荐清单。
            </p>
          </div>
          <div className="flex items-center gap-2">
            {VIEW_MODE_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.id}
                  size="icon"
                  variant={viewMode === option.id ? 'default' : 'ghost'}
                  className={cn(viewMode === option.id ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'text-gray-500 hover:text-indigo-500')}
                  onClick={() => setViewMode(option.id)}
                  title={option.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {sortedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 p-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
            <Users className="h-10 w-10 text-gray-300 dark:text-gray-700" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">当前筛选条件下没有匹配的项目，可以尝试放宽条件或清空筛选。</p>
            <Button className="mt-6 bg-indigo-600 text-white hover:bg-indigo-500" onClick={resetFilters}>
              清空筛选条件
            </Button>
          </div>
        ) : (
          <div className={cn('grid gap-4', viewMode === 'grid' ? 'lg:grid-cols-2' : 'lg:grid-cols-1')}>
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onViewDetail={(item) => navigate(`/admin/project-marketplace/${item.id}`)}
                onToggleCompare={handleToggleCompare}
                selectedForCompare={compareIds.includes(project.id)}
                onAddToShortlist={handleAddToShortlist}
              />
            ))}
          </div>
        )}
      </section>

      {compareIds.length > 0 ? (
        <div className="sticky bottom-6 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/90 px-5 py-3 shadow-lg backdrop-blur dark:border-indigo-500/40 dark:bg-indigo-500/10">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Share2 className="h-4 w-4" />
            已选择 {compareIds.length} / {MAX_COMPARE_ITEMS} 个项目对比
          </div>
          <div className="flex items-center gap-2">
            {compareIds.map((id) => {
              const project = PROJECT_MARKET_ITEMS.find((item) => item.id === id);
              return (
                <Badge key={id} className="bg-white text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                  {project?.title ?? id}
                </Badge>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCompareIds([])}>
              清空
            </Button>
            <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-500" onClick={handleOpenCompare}>
              开始对比
            </Button>
          </div>
        </div>
      ) : null}

      <CompareDrawer projects={selectedProjectsForCompare} open={compareOpen} onOpenChange={setCompareOpen} />
    </div>
  );
};

export default ProjectMarketplacePage;


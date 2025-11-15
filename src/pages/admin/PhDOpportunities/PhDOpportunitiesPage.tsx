import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  AlertCircle,
  ExternalLink,
  Filter,
  Flag,
  Globe2,
  GraduationCap,
  Heart,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Timer,
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PhdFundingLevel, PhdPosition, PhdPositionStatus } from '../../../types/phd';
import PhdShortlistPanel from './components/PhdShortlistPanel';
import { fetchPhdPositions } from '../../../services/phdPositions';
import { addPhdFavorite, fetchPhdFavorites, removePhdFavorite } from '@/services/phdFavoritesService';
import { useAuth } from '@/context/AuthContext';

const fundingLevelLabel: Record<PhdFundingLevel, string> = {
  full: '全额资助',
  partial: '部分资助',
  unspecified: '资助待确认',
};

const statusLabel: Record<PhdPositionStatus, string> = {
  open: '开放中',
  closing_soon: '即将截止',
  expired: '已截止',
};

const statusStyle: Record<PhdPositionStatus, string> = {
  open: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  closing_soon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  expired: 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400',
};

const fundingStyle: Record<PhdFundingLevel, string> = {
  full: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200',
  partial: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-200',
  unspecified: 'bg-slate-100 text-slate-500 dark:bg-slate-800/40 dark:text-slate-200',
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '待更新';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '待更新';
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCountryLabel = (code?: string | null) => {
  if (!code) return '未知地区';
  const upper = code.toUpperCase();
  if (upper === 'NL') return '荷兰';
  if (upper === 'US') return '美国';
  if (upper === 'UK') return '英国';
  return upper;
};

type SortOption = 'deadline' | 'matchScore' | 'university';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'deadline', label: '按截止时间' },
  { value: 'matchScore', label: '按匹配度' },
  { value: 'university', label: '按院校名称' },
];

const getStatusTrendText = (status: PhdPositionStatus, deadline?: string | null) => {
  if (!deadline) return '申请截止时间待更新';
  const now = new Date();
  const positionDeadline = new Date(deadline);
  if (Number.isNaN(positionDeadline.getTime())) return '申请截止时间待更新';

  if (status === 'expired' || positionDeadline < now) {
    return '该岗位已截止';
  }

  const diffTime = positionDeadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return '距离截止不足 1 天';
  }

  if (diffDays <= 7) {
    return `距离截止还有 ${diffDays} 天`;
  }

  return `距离截止还有约 ${Math.ceil(diffDays / 7)} 周`;
};

const truncateText = (text: string, length = 220) => {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
};

const normalizeDiscipline = (value?: string | null) => value?.trim();

type FeedbackState = {
  message: string;
  variant: 'success' | 'info' | 'error';
} | null;

const PhDOpportunitiesPage = () => {
  const navigate = useNavigate();
  const { userType, profile, loading: authLoading } = useAuth();
  const employeeId = userType === 'admin' && profile ? Number(profile.id) : null;
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState<string>('all');
  const [funding, setFunding] = useState<'all' | PhdFundingLevel>('all');
  const [discipline, setDiscipline] = useState<string>('all');
  const [status, setStatus] = useState<'all' | PhdPositionStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('deadline');
  const [shortlistPanelOpen, setShortlistPanelOpen] = useState(false);
  const [positions, setPositions] = useState<PhdPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const loadPositions = useCallback(async () => {
    try {
      if (!loading) {
        setRefreshing(true);
      }
      setErrorMessage(null);
      const { positions: fetched } = await fetchPhdPositions({ limit: 300 });
      setPositions(fetched);
    } catch (error) {
      const message = error instanceof Error ? error.message : '博士岗位数据加载失败';
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  useEffect(() => {
    if (authLoading) return;
    if (!employeeId) {
      setFavoriteIds([]);
      return;
    }
    setFavoritesLoading(true);
    fetchPhdFavorites(employeeId)
      .then((ids) => setFavoriteIds(ids))
      .catch((error) => {
        console.error('[PhDOpportunities] 获取收藏清单失败', error);
        setFeedback({ message: '加载博士收藏清单失败，请稍后重试。', variant: 'error' });
      })
      .finally(() => setFavoritesLoading(false));
  }, [authLoading, employeeId]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const countries = useMemo(() => {
    const codes = positions
      .map((position) => position.country)
      .filter(Boolean)
      .map((code) => code!.toUpperCase());
    return Array.from(new Set(codes)).sort();
  }, [positions]);

  const disciplines = useMemo(() => {
    const set = new Set<string>();
    positions.forEach((position) => {
      const dept = normalizeDiscipline(position.department);
      if (dept) {
        set.add(dept);
      }
    });

    if (set.size === 0) {
      positions.forEach((position) => {
        position.tags?.forEach((tag) => {
          const trimmed = tag.trim();
          const lower = trimmed.toLowerCase();
          if (
            trimmed &&
            lower !== 'phd' &&
            lower !== 'temporary' &&
            lower !== 'full' &&
            lower !== 'partial' &&
            lower !== 'unspecified'
          ) {
            set.add(trimmed);
          }
        });
      });
    }

    return Array.from(set).sort();
  }, [positions]);

  const filteredPositions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const list = positions.filter((position) => {
      const matchesSearch =
        !normalizedSearch ||
        [position.titleEn, position.titleZh, position.university, position.city, position.country]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(normalizedSearch));

      const matchesCountry =
        country === 'all' ||
        (position.country && position.country.toUpperCase() === country);

      const matchesFunding = funding === 'all' || position.fundingLevel === funding;
      const matchesDiscipline =
        discipline === 'all' ||
        (normalizeDiscipline(position.department) === discipline) ||
        (position.tags?.some((tag) => tag.trim() === discipline));
      const matchesStatus = status === 'all' || position.status === status;
      return (
        matchesSearch &&
        matchesCountry &&
        matchesFunding &&
        matchesDiscipline &&
        matchesStatus
      );
    });

    return [...list].sort((a, b) => {
      if (sortOption === 'deadline') {
        const aTime = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      }
      if (sortOption === 'matchScore') {
        return b.matchScore - a.matchScore;
      }
      return a.university.localeCompare(b.university, 'en');
    });
  }, [country, discipline, funding, positions, search, sortOption, status]);

  const shortlistedPositions = useMemo(() => {
    if (favoriteIds.length === 0) return [];
    const lookup = new Map(positions.map((position) => [position.id, position]));
    return favoriteIds
      .map((id) => lookup.get(id))
      .filter((position): position is PhdPosition => Boolean(position));
  }, [positions, favoriteIds]);

  const insights = useMemo(() => {
    const total = positions.length;
    const closingSoon = positions.filter((position) => position.status === 'closing_soon').length;
    const fullFunding = positions.filter((position) => position.fundingLevel === 'full').length;
    const internationalFriendly = positions.filter((position) => position.supportsInternational).length;
    return { total, closingSoon, fullFunding, internationalFriendly };
  }, [positions]);

  const handleToggleFavorite = useCallback(
    async (position: PhdPosition, nextState: boolean) => {
      if (!employeeId) {
        setFeedback({ message: '当前账号未绑定员工信息，无法收藏岗位。', variant: 'error' });
        return;
      }
      try {
        if (nextState) {
          await addPhdFavorite(position.id, employeeId);
          setFavoriteIds((prev) => (prev.includes(position.id) ? prev : [...prev, position.id]));
          setFeedback({ message: `已收藏 ${position.titleEn}`, variant: 'success' });
        } else {
          await removePhdFavorite(position.id, employeeId);
          setFavoriteIds((prev) => prev.filter((existing) => existing !== position.id));
          setFeedback({ message: `已移除 ${position.titleEn}`, variant: 'info' });
        }
      } catch (error) {
        console.error('[PhDOpportunities] 更新收藏失败', error);
        setFeedback({ message: '更新收藏失败，请稍后重试。', variant: 'error' });
      }
    },
    [employeeId],
  );

  const handleRemoveFavorite = useCallback(
    async (id: string) => {
      if (!employeeId) {
        setFeedback({ message: '当前账号未绑定员工信息，无法收藏岗位。', variant: 'error' });
        return;
      }
      try {
        await removePhdFavorite(id, employeeId);
        setFavoriteIds((prev) => prev.filter((existing) => existing !== id));
        setFeedback({ message: '已从收藏清单移除', variant: 'info' });
      } catch (error) {
        console.error('[PhDOpportunities] 移除收藏失败', error);
        setFeedback({ message: '移除收藏失败，请稍后重试。', variant: 'error' });
      }
    },
    [employeeId],
  );

  const toggleShortlistPanel = () => {
    setShortlistPanelOpen((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-indigo-500">
            <GraduationCap className="h-4 w-4" />
            全球博士岗位中心
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">全球博士岗位</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            实时同步全球博士岗位，支持按招生状态、资助方式与申请要求筛选，帮助顾问与学生快速锁定合适机会。
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto">
          <Button
            variant="outline"
            className="self-start rounded-full border-indigo-200 text-sm text-indigo-600 dark:border-indigo-500/40 dark:text-indigo-200"
            onClick={loadPositions}
            disabled={loading || refreshing}
          >
            {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {refreshing ? '刷新中…' : '刷新数据库数据'}
          </Button>
        </div>
      </header>

      {feedback ? (
        <Alert
          className={`rounded-3xl border ${
            feedback.variant === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100'
              : feedback.variant === 'info'
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100'
                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      {errorMessage && (
        <Card className="rounded-3xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-100">
          <div className="flex items-center justify-between">
            <span>{errorMessage}</span>
            <Button variant="ghost" size="sm" onClick={loadPositions}>
              重新加载
            </Button>
          </div>
        </Card>
      )}

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4 lg:flex-1">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:flex-[2]">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="输入岗位、学校或城市关键词"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
              <SelectTrigger className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 md:w-44">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              地区
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="选择地区" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部地区</SelectItem>
                {countries.map((code) => (
                  <SelectItem key={code} value={code}>
                    {getCountryLabel(code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <Sparkles className="h-4 w-4" />
              资助
            </label>
            <Select value={funding} onValueChange={(value: 'all' | PhdFundingLevel) => setFunding(value)}>
              <SelectTrigger className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="选择资助情况" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="full">全额资助</SelectItem>
                <SelectItem value="partial">部分资助</SelectItem>
                <SelectItem value="unspecified">待确认</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <Timer className="h-4 w-4" />
              状态
            </label>
            <Select value={status} onValueChange={(value: 'all' | PhdPositionStatus) => setStatus(value)}>
              <SelectTrigger className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="open">开放中</SelectItem>
                <SelectItem value="closing_soon">即将截止</SelectItem>
                <SelectItem value="expired">已截止</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <GraduationCap className="h-4 w-4" />
              专业方向
            </label>
            {disciplines.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
                暂无专业方向数据
              </div>
            ) : (
              <Select value={discipline} onValueChange={setDiscipline}>
                <SelectTrigger className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="选择专业方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方向</SelectItem>
                  {disciplines.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

      </section>

      <section className="rounded-3xl p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-gray-900">
            <div className="rounded-full bg-indigo-50 p-2 text-indigo-500 dark:bg-indigo-800/40 dark:text-indigo-200">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-500/80">当前岗位</p>
              <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-100">{insights.total}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-gray-900">
            <div className="rounded-full bg-amber-50 p-2 text-amber-600 dark:bg-amber-800/40 dark:text-amber-200">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-500/80">即将截止</p>
              <p className="text-xl font-semibold text-amber-700 dark:text-amber-100">{insights.closingSoon}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-gray-900">
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-800/40 dark:text-emerald-200">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-500/70">接受国际学生</p>
              <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-100">{insights.internationalFriendly}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-gray-900">
            <div className="rounded-full bg-sky-50 p-2 text-sky-600 dark:bg-sky-800/40 dark:text-sky-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-sky-500/80">全额资助</p>
              <p className="text-xl font-semibold text-sky-700 dark:text-sky-100">{insights.fullFunding}</p>
            </div>
          </Card>
        </div>
      </section>

      {loading && (
        <Card className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          数据加载中，请稍候…
        </Card>
      )}

      <div className={`grid gap-6 ${shortlistPanelOpen ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Filter className="h-4 w-4 text-indigo-500" />
              共 {filteredPositions.length} 条岗位满足筛选条件
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-pink-600 dark:border-pink-500/40 dark:bg-pink-900/30 dark:text-pink-200">
                收藏清单 {favoriteIds.length}
              </Badge>
              <Button
                className={`rounded-2xl text-xs text-white ${shortlistPanelOpen ? 'bg-indigo-700 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                size="sm"
                onClick={toggleShortlistPanel}
                disabled={favoritesLoading}
              >
                {favoritesLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ClipboardList className="mr-2 h-4 w-4" />
                )}
                {shortlistPanelOpen ? '收起收藏清单' : '博士收藏清单'}
              </Button>
              <Button variant="outline" size="sm" disabled className="rounded-2xl border-dashed text-xs">
                导出 Excel（稍后接入）
              </Button>
            </div>
          </div>

          {!loading && filteredPositions.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-12 text-gray-500 dark:border-gray-700 dark:bg-gray-900/40">
              <Calendar className="h-8 w-8 text-gray-400" />
              <p className="text-sm">暂无符合条件的博士岗位，请调整筛选条件再试。</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredPositions.map((position) => {
                const shortlisted = favoriteIds.includes(position.id);
                return (
                  <Card
                    key={position.id}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500/40"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={statusStyle[position.status]}>{statusLabel[position.status]}</Badge>
                          <Badge className={fundingStyle[position.fundingLevel]}>
                            {fundingLevelLabel[position.fundingLevel]}
                          </Badge>
                          {position.supportsInternational && (
                            <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
                              支持国际学生
                            </Badge>
                          )}
                          <Badge className="rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-100">
                            匹配度 {position.matchScore}%
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {position.titleEn}
                            </h2>
                            {position.titleZh && (
                              <p className="text-lg font-medium text-gray-900 dark:text-white">
                                {position.titleZh}
                              </p>
                            )}
                          </div>
                          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <GraduationCap className="h-4 w-4 text-indigo-500" />
                            {position.university}
                            {position.department && (
                              <span className="text-xs text-gray-400"> · {position.department}</span>
                            )}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {position.city ? `${position.city}, ${getCountryLabel(position.country)}` : getCountryLabel(position.country)}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(position.deadline)} · {getStatusTrendText(position.status, position.deadline)}
                          </p>
                          {position.salaryRange && (
                            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Sparkles className="h-4 w-4 text-gray-400" />
                              薪资区间 {position.salaryRange}
                            </p>
                          )}
                        </div>

                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {truncateText(position.description)}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {position.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-100"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            key="detail"
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/admin/phd-opportunities/${position.id}`)}
                            className="rounded-full bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                          >
                            查看详情
                          </Button>
                          <Button
                            key="shortlist"
                            variant={shortlisted ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleToggleFavorite(position, !shortlisted)}
                            className={`rounded-full ${
                              shortlisted
                                ? 'border-indigo-500 bg-indigo-500 text-white dark:border-indigo-400 dark:bg-indigo-500/80'
                                : 'border-gray-300 text-gray-500 hover:text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100'
                            }`}
                          >
                            <Heart className={`mr-2 h-4 w-4 ${shortlisted ? 'fill-current' : ''}`} />
                            {shortlisted ? '已加入清单' : '收藏岗位'}
                          </Button>
                          <Button
                            key="apply"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(position.officialLink, '_blank', 'noopener,noreferrer')}
                            className="rounded-full text-indigo-500 hover:text-indigo-600"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            官网申请
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {shortlistPanelOpen && (
          <PhdShortlistPanel
            shortlist={shortlistedPositions}
            onRemove={handleRemoveFavorite}
            onViewDetail={(id) => navigate(`/admin/phd-opportunities/${id}`)}
            onOpenOfficialLink={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
          />
        )}
      </div>
    </div>
  );
};

export default PhDOpportunitiesPage; 


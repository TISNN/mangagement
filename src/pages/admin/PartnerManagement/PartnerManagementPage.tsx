import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Filter,
  Globe2,
  Handshake,
  Layers,
  Link,
  Loader2,
  Mail,
  MapPin,
  NotebookPen,
  Paperclip,
  Phone,
  Search,
  Sparkles,
  Star,
  User,
  Users2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Partner, PartnerEngagement, PartnerLevel, PartnerStatus, PartnerType, TimelineNoteType } from './types';
import { fetchPartnerMockData } from './mockData';
import {
  fetchPartners,
  createPartner,
  updatePartner,
  addPartnerTimeline,
  togglePartnerFavorite,
  type PartnerWritePayload,
  type PartnerTimelinePayload,
} from '@/services/partners';

const typeLabel: Record<PartnerType, string> = {
  university: '高校',
  professor: '教授',
  agency: '机构',
  company: '企业',
  other: '其他',
};

const statusLabel: Record<PartnerStatus, string> = {
  prospecting: '拓展中',
  negotiating: '洽谈中',
  active: '执行中',
  on_hold: '暂停',
  closed: '已结束',
};

const statusBadgeClass: Record<PartnerStatus, string> = {
  prospecting: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
  negotiating: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200',
  active: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200',
  on_hold: 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-300',
  closed: 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-200',
};

const levelLabel: Record<PartnerLevel, string> = {
  strategic: '战略',
  key: '重点',
  regular: '常规',
  watch: '观察',
};

const levelBadgeClass: Record<PartnerLevel, string> = {
  strategic: 'border border-indigo-200 text-indigo-600 dark:border-indigo-500/50 dark:text-indigo-200',
  key: 'border border-emerald-200 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-200',
  regular: 'border border-slate-200 text-slate-500 dark:border-slate-600 dark:text-slate-100',
  watch: 'border border-amber-200 text-amber-600 dark:border-amber-500/40 dark:text-amber-200',
};

const noteIconMap: Record<TimelineNoteType, { label: string; className: string }> = {
  call: { label: '电话', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200' },
  meeting: { label: '会议', className: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200' },
  email: { label: '邮件', className: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-200' },
  onsite: { label: '线下拜访', className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200' },
  document: { label: '文档', className: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-200' },
  other: { label: '其他', className: 'bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-300' },
};

const viewModeOptions = [
  { id: 'table', label: '表格视图' },
  { id: 'card', label: '卡片视图' },
];

const PartnerManagementPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | PartnerType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PartnerStatus>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | PartnerLevel>('all');
  const [countryFilter, setCountryFilter] = useState<'all' | string>('all');
  const [ownerFilter, setOwnerFilter] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [priorityDrawerOpen, setPriorityDrawerOpen] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerFormSubmitting, setPartnerFormSubmitting] = useState(false);
  const [partnerFormError, setPartnerFormError] = useState<string | null>(null);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [timelineTarget, setTimelineTarget] = useState<Partner | null>(null);
  const [timelineSubmitting, setTimelineSubmitting] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [timelineRequireRemindAt, setTimelineRequireRemindAt] = useState(false);
  const [timelineInitialValues, setTimelineInitialValues] = useState<TimelineFormValues>(buildTimelineFormValues());

  const partnerFormInitialValues = useMemo(() => buildPartnerFormValues(editingPartner), [editingPartner]);

  const loadPartners = async () => {
    try {
      setErrorMessage(null);
      if (!loading) {
        setRefreshing(true);
      }
      const records = await fetchPartners();
      if (records.length === 0) {
        const fallback = await fetchPartnerMockData();
        setPartners(fallback);
        setFavoriteIds(fallback.filter((partner) => partner.isFavorite).map((partner) => partner.id));
      } else {
        setPartners(records);
        setFavoriteIds(records.filter((partner) => partner.isFavorite).map((partner) => partner.id));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '合作方数据加载失败';
      setErrorMessage(message);
      const fallback = await fetchPartnerMockData();
      setPartners(fallback);
      setFavoriteIds(fallback.filter((partner) => partner.isFavorite).map((partner) => partner.id));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePartnerFormOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setEditingPartner(null);
      setPartnerFormError(null);
    }
    setPartnerFormOpen(nextOpen);
  };

  const handleTimelineDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimelineTarget(null);
      setTimelineError(null);
    }
    setTimelineDialogOpen(nextOpen);
  };

  const handleCreatePartnerClick = () => {
    setEditingPartner(null);
    setPartnerFormError(null);
    setPartnerFormOpen(true);
  };

  const handleEditPartnerClick = (partner: Partner) => {
    setEditingPartner(partner);
    setPartnerFormError(null);
    setPartnerFormOpen(true);
  };

  const handleAddTimelineClick = (partner: Partner) => {
    setTimelineTarget(partner);
    setTimelineError(null);
    setTimelineRequireRemindAt(false);
    setTimelineInitialValues(buildTimelineFormValues());
    setTimelineDialogOpen(true);
  };

  const handleAddReminderClick = (partner: Partner) => {
    setTimelineTarget(partner);
    setTimelineError(null);
    setTimelineRequireRemindAt(true);
    setTimelineInitialValues(
      buildTimelineFormValues({
        noteType: 'meeting',
        nextAction: '',
        remindAt: '',
      }),
    );
    setTimelineDialogOpen(true);
  };

  const handlePartnerFormSubmit = async (values: PartnerFormValues) => {
    setPartnerFormSubmitting(true);
    setPartnerFormError(null);
    const payload = mapFormValuesToPayload(values);
    try {
      let partnerId = editingPartner?.id ?? '';
      if (editingPartner) {
        await updatePartner(editingPartner.id, payload);
      } else {
        partnerId = await createPartner(payload);
      }
      await loadPartners();
      if (partnerId) {
        setSelectedPartnerId(partnerId);
      }
      setPartnerFormOpen(false);
      setEditingPartner(null);
    } catch (error) {
      setPartnerFormError(error instanceof Error ? error.message : '保存失败，请稍后再试');
    } finally {
      setPartnerFormSubmitting(false);
    }
  };

  const handleTimelineSubmit = async (values: TimelineFormValues) => {
    if (!timelineTarget) return;
    if (timelineRequireRemindAt && !values.remindAt) {
      setTimelineError('请设置提醒时间');
      return;
    }
    setTimelineSubmitting(true);
    setTimelineError(null);
    const payload = mapTimelineFormValues(values);
    try {
      await addPartnerTimeline(timelineTarget.id, payload);
      await loadPartners();
      setTimelineDialogOpen(false);
      setTimelineTarget(null);
    } catch (error) {
      setTimelineError(error instanceof Error ? error.message : '保存失败，请稍后再试');
    } finally {
      setTimelineSubmitting(false);
    }
  };

  const handleToggleFavorite = async (partner: Partner) => {
    const targetState = !favoriteIds.includes(partner.id);
    setFavoriteIds((prev) => (targetState ? [...prev, partner.id] : prev.filter((id) => id !== partner.id)));
    setFavoriteLoadingId(partner.id);
    try {
      await togglePartnerFavorite(partner.id, targetState);
      await loadPartners();
    } catch (error) {
      setFavoriteIds((prev) => (targetState ? prev.filter((id) => id !== partner.id) : [...prev, partner.id]));
      setErrorMessage(error instanceof Error ? error.message : '收藏操作失败，请稍后重试');
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  const countries = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((partner) => {
      if (partner.country) set.add(partner.country);
    });
    return Array.from(set).sort();
  }, [partners]);

  const owners = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((partner) => set.add(partner.ownerName));
    return Array.from(set).sort();
  }, [partners]);

  const filteredPartners = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return partners.filter((partner) => {
      const matchesKeyword =
        !keyword ||
        [partner.name, partner.summary, partner.ownerName, partner.country, partner.city, ...(partner.tags ?? [])]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(keyword));
      const matchesType = typeFilter === 'all' || partner.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
      const matchesLevel = levelFilter === 'all' || partner.level === levelFilter;
      const matchesCountry = countryFilter === 'all' || partner.country === countryFilter;
      const matchesOwner = ownerFilter === 'all' || partner.ownerName === ownerFilter;
      return matchesKeyword && matchesType && matchesStatus && matchesLevel && matchesCountry && matchesOwner;
    });
  }, [countryFilter, levelFilter, ownerFilter, partners, search, statusFilter, typeFilter]);

  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === selectedPartnerId),
    [partners, selectedPartnerId],
  );

  const insights = useMemo(() => {
    const total = partners.length;
    const active = partners.filter((partner) => partner.status === 'active').length;
    const negotiating = partners.filter((partner) => partner.status === 'negotiating').length;
    const reminders = partners.filter((partner) =>
      partner.timelines.some((item) => item.remindAt && new Date(item.remindAt) > new Date()),
    ).length;
    return { total, active, negotiating, reminders };
  }, [partners]);

  const priorityPartners = useMemo(
    () => partners.filter((partner) => favoriteIds.includes(partner.id)),
    [favoriteIds, partners],
  );

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStatusFilter('all');
    setLevelFilter('all');
    setCountryFilter('all');
    setOwnerFilter('all');
  };

  const handleSelectPartner = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
  };

  const handleCloseDetail = () => {
    setSelectedPartnerId(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-indigo-500">
            <Handshake className="h-4 w-4" />
            合作方管理
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">合作方管理中心</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            一处掌握老师与机构的全球合作伙伴：快速筛选、高效跟进、联动任务和提醒，确保每个合作动作都被记录。
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            className="rounded-full border-indigo-200 text-sm text-indigo-600 dark:border-indigo-500/40 dark:text-indigo-200"
            onClick={loadPartners}
            disabled={loading || refreshing}
          >
            {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {refreshing ? '同步中…' : '刷新数据'}
          </Button>
          <Button className="rounded-full bg-indigo-600 text-white hover:bg-indigo-500" onClick={handleCreatePartnerClick}>
            <NotebookPen className="mr-2 h-4 w-4" />
            新建合作方
          </Button>
        </div>
      </header>

      {errorMessage && (
        <Card className="rounded-3xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>
            <Button variant="ghost" size="sm" onClick={loadPartners}>
              重新加载
            </Button>
          </div>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-500/20 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between text-sm text-indigo-600 dark:text-indigo-200">
            <span className="font-medium">合作方总数</span>
            <Building2 className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{insights.total}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">本月 +2</span>
          </div>
        </Card>

        <Card className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-200">
            <span className="font-medium">执行中的合作</span>
            <Check className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{insights.active}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">按时推进</span>
          </div>
        </Card>

        <Card className="rounded-3xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-500/30 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-sm text-amber-600 dark:text-amber-200">
            <span className="font-medium">洽谈中的机会</span>
            <Filter className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{insights.negotiating}</span>
            <span className="text-xs text-amber-600 dark:text-amber-200">需保持跟进</span>
          </div>
        </Card>

        <Card className="rounded-3xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-500/30 dark:bg-sky-950/20">
          <div className="flex items-center justify-between text-sm text-sky-600 dark:text-sky-200">
            <span className="font-medium">待提醒的合作</span>
            <Bell className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{insights.reminders}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">含到期合同/回访</span>
          </div>
        </Card>
      </section>

      <Card className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4 lg:flex-1">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:flex-[2]">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索合作方、联系人、标签"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600" onClick={resetFilters}>
              重置筛选
            </Button>
          </div>

          <div className="flex gap-2">
            {viewModeOptions.map((option) => (
              <Button
                key={option.id}
                variant={viewMode === option.id ? 'default' : 'outline'}
                className={cn(
                  'rounded-full px-4 text-sm',
                  viewMode === option.id
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'border-gray-200 text-gray-500 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300',
                )}
                onClick={() => setViewMode(option.id as 'table' | 'card')}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label="类型"
            icon={<Layers className="h-4 w-4" />}
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as 'all' | PartnerType)}
            options={[
              { value: 'all', label: '全部类型' },
              { value: 'university', label: '高校' },
              { value: 'professor', label: '导师/教授' },
              { value: 'agency', label: '机构' },
              { value: 'company', label: '企业' },
              { value: 'other', label: '其他' },
            ]}
          />

          <FilterSelect
            label="状态"
            icon={<Sparkles className="h-4 w-4" />}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as 'all' | PartnerStatus)}
            options={[
              { value: 'all', label: '全部状态' },
              ...Object.entries(statusLabel).map(([key, label]) => ({ value: key, label })),
            ]}
          />

          <FilterSelect
            label="等级"
            icon={<Star className="h-4 w-4" />}
            value={levelFilter}
            onValueChange={(value) => setLevelFilter(value as 'all' | PartnerLevel)}
            options={[
              { value: 'all', label: '全部等级' },
              ...Object.entries(levelLabel).map(([key, label]) => ({ value: key, label })),
            ]}
          />

          <FilterSelect
            label="地区"
            icon={<MapPin className="h-4 w-4" />}
            value={countryFilter}
            onValueChange={(value) => setCountryFilter(value)}
            options={[{ value: 'all', label: '全部地区' }, ...countries.map((country) => ({ value: country, label: country }))]}
          />

          <FilterSelect
            label="负责人"
            icon={<Users2 className="h-4 w-4" />}
            value={ownerFilter}
            onValueChange={(value) => setOwnerFilter(value)}
            options={[{ value: 'all', label: '全部负责人' }, ...owners.map((name) => ({ value: name, label: name }))]}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              正在加载合作方...
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center text-gray-500 dark:text-gray-400">
              <Globe2 className="h-10 w-10 text-gray-400" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">暂无符合条件的合作方</p>
                <p className="text-sm">尝试调整筛选条件或创建新的合作伙伴。</p>
              </div>
              <Button variant="outline" onClick={resetFilters}>
                查看全部
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {viewMode === 'table' ? (
                <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      <th className="px-4 py-3">合作方</th>
                      <th className="px-4 py-3">联系人</th>
                      <th className="px-4 py-3">当前合作</th>
                      <th className="px-4 py-3">下一步动作</th>
                      <th className="px-4 py-3">负责人</th>
                      <th className="px-4 py-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 dark:divide-gray-800 dark:text-gray-200">
                    {filteredPartners.map((partner) => {
                      const primaryContact = partner.contacts.find((contact) => contact.isPrimary) ?? partner.contacts[0];
                      const currentEngagement = partner.engagements[0];
                      return (
                        <tr key={partner.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40">
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className={cn(
                                    'rounded-full p-1 transition hover:text-amber-500 disabled:opacity-40',
                                    favoriteIds.includes(partner.id) ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500',
                                  )}
                                  onClick={() => handleToggleFavorite(partner)}
                                  disabled={favoriteLoadingId === partner.id}
                                >
                                  <Star className={cn('h-4 w-4', favoriteIds.includes(partner.id) && 'fill-amber-400 text-amber-400')} />
                                </button>
                                <span className="font-semibold text-gray-900 dark:text-white">{partner.name}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className={cn('rounded-full px-2 py-1', statusBadgeClass[partner.status])}>{statusLabel[partner.status]}</span>
                                <span className={cn('rounded-full border px-2 py-1', levelBadgeClass[partner.level])}>{levelLabel[partner.level]}</span>
                                <span className="text-gray-400">·</span>
                                <span className="text-gray-500">{typeLabel[partner.type]}</span>
                              </div>
                              {partner.tags?.length ? (
                                <div className="flex flex-wrap gap-2">
                                  {partner.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="rounded-full bg-gray-100 px-2 py-0 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {primaryContact ? (
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{primaryContact.name}</span>
                                <span className="text-xs text-gray-500">{primaryContact.role ?? '联系人'}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">待添加</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {currentEngagement ? (
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-gray-900 dark:text-white">{currentEngagement.title}</span>
                                <span className="text-xs text-gray-500">{currentEngagement.category ?? '合作项目'}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">暂无活跃合作</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {currentEngagement?.nextAction ? (
                              <div className="flex flex-col gap-1 text-xs text-gray-500">
                                <span>{currentEngagement.nextAction}</span>
                                {currentEngagement.endDate && (
                                  <span className="text-[11px] text-gray-400">里程碑：{formatDate(currentEngagement.endDate)}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">未设置</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">{partner.ownerName}</span>
                              <span className="text-xs text-gray-500">{partner.ownerTitle ?? '合作负责人'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleSelectPartner(partner.id)}>
                                查看详情
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-200"
                                onClick={() => handleAddTimelineClick(partner)}
                              >
                                添加跟进
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 shadow-sm transition hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-500/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={cn(
                                'rounded-full p-1 transition hover:text-amber-500 disabled:opacity-40',
                                favoriteIds.includes(partner.id) ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500',
                              )}
                              onClick={() => handleToggleFavorite(partner)}
                              disabled={favoriteLoadingId === partner.id}
                            >
                              <Star className={cn('h-4 w-4', favoriteIds.includes(partner.id) && 'fill-amber-400 text-amber-400')} />
                            </button>
                            <span className="font-semibold">{partner.name}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                            <span className={cn('rounded-full px-2 py-1', statusBadgeClass[partner.status])}>{statusLabel[partner.status]}</span>
                            <span className={cn('rounded-full border px-2 py-1', levelBadgeClass[partner.level])}>{levelLabel[partner.level]}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500">{typeLabel[partner.type]}</span>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => handleSelectPartner(partner.id)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">{partner.summary ?? '暂无简介'}</p>

                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {partner.country && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {partner.country} {partner.city && `· ${partner.city}`}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {partner.ownerName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        <aside className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">重点合作方</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">收藏后可快速处理</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-indigo-500"
              onClick={() => setPriorityDrawerOpen((prev) => !prev)}
            >
              {priorityDrawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {priorityDrawerOpen && (
            <Card className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-4 dark:border-indigo-500/30 dark:from-indigo-950/30 dark:to-gray-950">
              <div className="space-y-4">
                {priorityPartners.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-indigo-200 p-4 text-sm text-indigo-600 dark:border-indigo-500/40 dark:text-indigo-200">
                    暂未收藏重点合作方，点击列表中的星标即可添加。
                  </div>
                ) : (
                  priorityPartners.map((partner) => (
                    <div key={partner.id} className="rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-white/5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{partner.name}</p>
                          <p className="text-xs text-gray-500">{partner.ownerName}</p>
                        </div>
                        <Badge variant="outline" className="rounded-full border-amber-200 text-amber-600 dark:border-amber-500/50 dark:text-amber-200">
                          {statusLabel[partner.status]}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{partner.engagements[0]?.nextAction ?? '暂无下一步'}</span>
                        <Button variant="ghost" size="sm" className="text-indigo-600" onClick={() => handleSelectPartner(partner.id)}>
                          查看
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          <Card className="rounded-3xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">风险与提醒</p>
            <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50/60 p-3 dark:border-amber-500/30 dark:bg-amber-900/10">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-200">合同即将到期</p>
                  <p className="text-gray-500 dark:text-gray-400">2 个合作需要在 12 月前续签。</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-500/30 dark:bg-indigo-900/10">
                <Bell className="mt-0.5 h-4 w-4 text-indigo-500" />
                <div>
                  <p className="font-medium text-indigo-700 dark:text-indigo-200">跟进提醒</p>
                  <p className="text-gray-500 dark:text-gray-400">本周 3 个合作超过 21 天未记录沟通。</p>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex">
          <div className="hidden flex-1 bg-black/40 backdrop-blur-sm md:block" onClick={handleCloseDetail} />
          <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 md:rounded-none">
            <div className="flex items-start justify-between border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusBadgeClass[selectedPartner.status])}>
                    {statusLabel[selectedPartner.status]}
                  </Badge>
                  <Badge variant="outline" className={cn('rounded-full px-3 py-1 text-xs font-semibold', levelBadgeClass[selectedPartner.level])}>
                    {levelLabel[selectedPartner.level]}
                  </Badge>
                  {selectedPartner.country && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800/50 dark:text-gray-200">
                      <MapPin className="h-3 w-3" />
                      {selectedPartner.country}
                      {selectedPartner.city && ` · ${selectedPartner.city}`}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPartner.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPartner.summary ?? '暂无简介'}</p>
                {selectedPartner.website && (
                  <a
                    href={selectedPartner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <Link className="h-4 w-4" />
                    访问官网
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="self-end" onClick={handleCloseDetail}>
                  关闭
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-gray-200 dark:border-gray-700"
                    onClick={() => selectedPartner && handleEditPartnerClick(selectedPartner)}
                  >
                    编辑
                  </Button>
                  <Button
                    className="rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
                    onClick={() => selectedPartner && handleAddTimelineClick(selectedPartner)}
                  >
                    新增跟进
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <CardSection title="联系人" description="主联系人与备用联系人">
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedPartner.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.role ?? '联系人'}</p>
                          </div>
                          {contact.isPrimary && (
                            <Badge className="rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">主联系人</Badge>
                          )}
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-gray-500">
                          {contact.email && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </p>
                          )}
                          {contact.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {contact.phone}
                            </p>
                          )}
                          {contact.linkedin && (
                            <a
                              href={contact.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
                            >
                              <ExternalLink className="h-4 w-4" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardSection>

                <CardSection title="合作范围" description="正在执行或计划的合作">
                  <div className="space-y-4">
                    {selectedPartner.engagements.length === 0 ? (
                      <EmptyHint text="暂无合作项目，点击“新增合作”快速创建。" />
                    ) : (
                      selectedPartner.engagements.map((engagement) => (
                        <div key={engagement.id} className="rounded-2xl border border-gray-100 p-4 shadow-sm dark:border-gray-800">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-base font-semibold text-gray-900 dark:text-white">{engagement.title}</p>
                              <p className="text-xs text-gray-500">{engagement.category ?? '合作项目'}</p>
                            </div>
                            <Badge className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                              {engagement.status === 'executing' ? '执行中' : engagement.status === 'planning' ? '规划中' : '合作'}
                            </Badge>
                          </div>
                          <div className="mt-3 grid gap-3 text-xs text-gray-500 sm:grid-cols-3">
                            <InfoRow label="合同状态" value={engagement.contractStatus ? contractLabel(engagement.contractStatus) : '待确认'} />
                            <InfoRow
                              label="时间"
                              value={
                                engagement.startDate
                                  ? `${formatDate(engagement.startDate)} — ${engagement.endDate ? formatDate(engagement.endDate) : '待定'}`
                                  : '待定'
                              }
                            />
                            <InfoRow label="负责人" value={engagement.ownerName ?? selectedPartner.ownerName} />
                          </div>
                          {engagement.nextAction && (
                            <div className="mt-3 rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-900/50 dark:text-gray-300">
                              下一步：{engagement.nextAction}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardSection>

                <CardSection title="关联资源" description="关联教授、学校、学生案例">
                  {selectedPartner.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.tags.map((tag) => (
                        <Badge key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <EmptyHint text="还没有关联标签或资源" />
                  )}
                </CardSection>
              </div>

              <div className="space-y-6">
                <CardSection title="跟进时间线" description="最近沟通记录与提醒">
                  <div className="space-y-4">
                    {selectedPartner.timelines.map((entry) => (
                      <div key={entry.id} className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', noteIconMap[entry.noteType].className)}>
                              {noteIconMap[entry.noteType].label}
                            </span>
                            <span>{entry.createdByName}</span>
                          </div>
                          <span>{formatDate(entry.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">{entry.content}</p>
                        {entry.nextAction && (
                          <p className="mt-1 text-xs text-indigo-600">下一步：{entry.nextAction}</p>
                        )}
                        {entry.attachments?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                            {entry.attachments.map((attachment) => (
                              <a
                                key={attachment.name}
                                href={attachment.url}
                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800/50"
                              >
                                <Paperclip className="h-3 w-3" />
                                {attachment.name}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardSection>

                <CardSection title="提醒" description="合同到期、回访计划">
                  <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>包含未来提醒的所有跟进记录</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() => selectedPartner && handleAddReminderClick(selectedPartner)}
                    >
                      新增提醒
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {selectedPartner.timelines
                      .filter((entry) => entry.remindAt)
                      .map((entry) => (
                        <div key={entry.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                          <p className="font-medium">提醒：{entry.nextAction ?? '跟进沟通'}</p>
                          <p className="mt-1 flex items-center gap-1">
                            <CalendarClock className="h-3 w-3" />
                            {formatDate(entry.remindAt!)}
                          </p>
                        </div>
                      ))}
                    {selectedPartner.timelines.every((entry) => !entry.remindAt) && <EmptyHint text="暂无未来提醒" />}
                  </div>
                </CardSection>

                {selectedPartner.risks?.length ? (
                  <CardSection title="风险提示" description="需要注意的问题">
                    <div className="space-y-3">
                      {selectedPartner.risks.map((risk) => (
                        <div key={risk} className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3 text-xs text-rose-600 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
                          {risk}
                        </div>
                      ))}
                    </div>
                  </CardSection>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      <PartnerFormDialog
        open={partnerFormOpen}
        onOpenChange={handlePartnerFormOpenChange}
        initialValues={partnerFormInitialValues}
        loading={partnerFormSubmitting}
        errorMessage={partnerFormError}
        isEditing={Boolean(editingPartner)}
        onSubmit={handlePartnerFormSubmit}
      />

      <TimelineDialog
        open={timelineDialogOpen}
        onOpenChange={handleTimelineDialogOpenChange}
        initialValues={timelineInitialValues}
        loading={timelineSubmitting}
        errorMessage={timelineError}
        partnerName={timelineTarget?.name ?? ''}
        requireRemindAt={timelineRequireRemindAt}
        onSubmit={handleTimelineSubmit}
      />
    </div>
  );
};

type FilterSelectProps = {
  label: string;
  icon: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
};

const FilterSelect = ({ label, icon, value, onValueChange, options }: FilterSelectProps) => (
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {icon}
      {label}
    </label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        <SelectValue placeholder="请选择" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

type CardSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const CardSection = ({ title, description, children }: CardSectionProps) => (
  <Card className="rounded-3xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <CardHeader className="p-0">
      <CardTitle className="text-lg text-gray-900 dark:text-white">{title}</CardTitle>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </CardHeader>
    <CardContent className="mt-4 p-0">{children}</CardContent>
  </Card>
);

const EmptyHint = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
    {text}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
    <p className="text-sm text-gray-700 dark:text-gray-200">{value}</p>
  </div>
);

type PartnerFormValues = {
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  level: PartnerLevel;
  country: string;
  city: string;
  ownerName: string;
  ownerTitle: string;
  website: string;
  summary: string;
  tags: string;
  highlight: string;
  internalNotes: string;
};

const PARTNER_FORM_DEFAULT: PartnerFormValues = {
  name: '',
  type: 'university',
  status: 'prospecting',
  level: 'regular',
  country: '',
  city: '',
  ownerName: '',
  ownerTitle: '',
  website: '',
  summary: '',
  tags: '',
  highlight: '',
  internalNotes: '',
};

type PartnerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: PartnerFormValues;
  loading: boolean;
  errorMessage: string | null;
  isEditing: boolean;
  onSubmit: (values: PartnerFormValues) => void;
};

const PartnerFormDialog = ({
  open,
  onOpenChange,
  initialValues,
  loading,
  errorMessage,
  isEditing,
  onSubmit,
}: PartnerFormDialogProps) => {
  const [formValues, setFormValues] = useState<PartnerFormValues>(initialValues);

  useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  const setField = <K extends keyof PartnerFormValues>(key: K, value: PartnerFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑合作方' : '新建合作方'}</DialogTitle>
          <DialogDescription>完善合作方基础信息，后续可继续补充联系人、合作记录与提醒。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partner-name">合作方名称 *</Label>
              <Input
                id="partner-name"
                required
                value={formValues.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="例如：牛津大学 · 计算机科学系"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner-owner">负责人</Label>
              <Input
                id="partner-owner"
                value={formValues.ownerName}
                onChange={(event) => setField('ownerName', event.target.value)}
                placeholder="例如：赵丽"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner-owner-title">负责人头衔</Label>
              <Input
                id="partner-owner-title"
                value={formValues.ownerTitle}
                onChange={(event) => setField('ownerTitle', event.target.value)}
                placeholder="例如：全球合作负责人"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner-country">地区</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="partner-country"
                  value={formValues.country}
                  onChange={(event) => setField('country', event.target.value)}
                  placeholder="国家"
                />
                <Input
                  value={formValues.city}
                  onChange={(event) => setField('city', event.target.value)}
                  placeholder="城市"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>类型</Label>
              <Select value={formValues.type} onValueChange={(value) => setField('type', value as PartnerType)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabel).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={formValues.status} onValueChange={(value) => setField('status', value as PartnerStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabel).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>合作等级</Label>
              <Select value={formValues.level} onValueChange={(value) => setField('level', value as PartnerLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择等级" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(levelLabel).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="partner-website">官网 / 介绍链接</Label>
              <Input
                id="partner-website"
                value={formValues.website}
                onChange={(event) => setField('website', event.target.value)}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partner-summary">简介</Label>
              <textarea
                id="partner-summary"
                className="min-h-[90px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500"
                value={formValues.summary}
                onChange={(event) => setField('summary', event.target.value)}
                placeholder="简要描述合作范围与亮点"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-highlight">当前重点</Label>
              <textarea
                id="partner-highlight"
                className="min-h-[90px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                value={formValues.highlight}
                onChange={(event) => setField('highlight', event.target.value)}
                placeholder="例如：国际博士班 80% 入选率"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partner-tags">标签（逗号分隔）</Label>
              <Input
                id="partner-tags"
                value={formValues.tags}
                onChange={(event) => setField('tags', event.target.value)}
                placeholder="联合培养, AI, 博士推荐"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-notes">内部备注</Label>
              <textarea
                id="partner-notes"
                className="min-h-[90px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                value={formValues.internalNotes}
                onChange={(event) => setField('internalNotes', event.target.value)}
                placeholder="用于团队内部提醒的信息"
              />
            </div>
          </div>

          {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-500" disabled={loading}>
              {loading ? '保存中…' : isEditing ? '保存变更' : '创建合作方'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type TimelineFormValues = {
  noteType: TimelineNoteType;
  content: string;
  nextAction: string;
  remindAt: string;
};

const TIMELINE_FORM_DEFAULT: TimelineFormValues = {
  noteType: 'meeting',
  content: '',
  nextAction: '',
  remindAt: '',
};

type TimelineDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: TimelineFormValues;
  loading: boolean;
  errorMessage: string | null;
  partnerName: string;
  requireRemindAt: boolean;
  onSubmit: (values: TimelineFormValues) => void;
};

const TimelineDialog = ({
  open,
  onOpenChange,
  initialValues,
  loading,
  errorMessage,
  partnerName,
  requireRemindAt,
  onSubmit,
}: TimelineDialogProps) => {
  const [formValues, setFormValues] = useState<TimelineFormValues>(initialValues);

  useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  const setField = <K extends keyof TimelineFormValues>(key: K, value: TimelineFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>新增跟进记录</DialogTitle>
          <DialogDescription>{partnerName ? `当前合作方：${partnerName}` : '填写沟通摘要与下一步计划。'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>记录类型</Label>
            <Select value={formValues.noteType} onValueChange={(value) => setField('noteType', value as TimelineNoteType)}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(noteIconMap).map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline-content">沟通摘要 *</Label>
            <textarea
              id="timeline-content"
              required
              className="min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              value={formValues.content}
              onChange={(event) => setField('content', event.target.value)}
              placeholder="记录会议要点、客户反馈或风险提示"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline-next-action">下一步动作</Label>
            <Input
              id="timeline-next-action"
              value={formValues.nextAction}
              onChange={(event) => setField('nextAction', event.target.value)}
              placeholder="例如：12 月 5 日前发送材料包"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline-remind">提醒时间（可选）</Label>
            <Input
              id="timeline-remind"
              type="datetime-local"
              value={formValues.remindAt}
              onChange={(event) => setField('remindAt', event.target.value)}
              required={requireRemindAt}
            />
            {requireRemindAt && <p className="text-xs text-gray-500 dark:text-gray-400">设置提醒时间后才会生成提醒卡片。</p>}
          </div>

          {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-500" disabled={loading}>
              {loading ? '保存中…' : '保存记录'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const buildPartnerFormValues = (partner?: Partner | null): PartnerFormValues => {
  if (!partner) {
    return { ...PARTNER_FORM_DEFAULT };
  }
  return {
    name: partner.name,
    type: partner.type,
    status: partner.status,
    level: partner.level,
    country: partner.country ?? '',
    city: partner.city ?? '',
    ownerName: partner.ownerName ?? '',
    ownerTitle: partner.ownerTitle ?? '',
    website: partner.website ?? '',
    summary: partner.summary ?? '',
    tags: partner.tags?.join(', ') ?? '',
    highlight: partner.highlight ?? '',
    internalNotes: partner.internalNotes ?? '',
  };
};

const buildTimelineFormValues = (preset?: Partial<TimelineFormValues>): TimelineFormValues => ({
  ...TIMELINE_FORM_DEFAULT,
  ...preset,
});

const mapFormValuesToPayload = (values: PartnerFormValues): PartnerWritePayload => ({
  name: values.name.trim(),
  type: values.type,
  status: values.status,
  level: values.level,
  country: values.country.trim() || undefined,
  city: values.city.trim() || undefined,
  ownerName: values.ownerName.trim() || undefined,
  ownerTitle: values.ownerTitle.trim() || undefined,
  website: values.website.trim() || undefined,
  summary: values.summary.trim() || undefined,
  tags: values.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
  highlight: values.highlight.trim() || undefined,
  internalNotes: values.internalNotes.trim() || undefined,
});

const mapTimelineFormValues = (values: TimelineFormValues): PartnerTimelinePayload => ({
  noteType: values.noteType,
  content: values.content.trim(),
  nextAction: values.nextAction.trim() || undefined,
  remindAt: values.remindAt ? new Date(values.remindAt).toISOString() : undefined,
});

const contractLabel = (status: NonNullable<PartnerEngagement['contractStatus']>) => {
  switch (status) {
    case 'draft':
      return '草拟';
    case 'reviewing':
      return '审核中';
    case 'signed':
      return '已签署';
    case 'expired':
      return '已到期';
    default:
      return '未知';
  }
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '待确认';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '待确认';
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
};

export default PartnerManagementPage;


import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import DoctoralFiltersPanel from './components/DoctoralFiltersPanel';
import ProfessorGrid from './components/ProfessorGrid';
import MatchInsightsPanel from './components/MatchInsightsPanel';
import ShortlistPanel from './components/ShortlistPanel';
import ProfessorMatchDrawer from './components/ProfessorMatchDrawer';
import {
  fetchProfessorFilters,
  fetchProfessors,
  fetchProfessorFavorites,
  addProfessorFavorite,
  removeProfessorFavorite,
  fetchProfessorDetail,
  createProfessorMatchRecord,
  fetchStudentsForMatching,
  StudentMatchOption,
} from '@/services/professorDirectoryService';
import { FundingIntensity, ProfessorFilterOptions, ProfessorProfile, SortMode } from './types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type FeedbackState = {
  message: string;
  variant: 'success' | 'info' | 'error';
} | null;

const LAST_PROFESSOR_TOTAL_KEY = 'professor-directory:last-total-count';

const ProfessorDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { userType, profile, loading: authLoading } = useAuth();
  const employeeId = userType === 'admin' && profile ? Number(profile.id) : null;

  const [filterOptions, setFilterOptions] = useState<ProfessorFilterOptions | null>(null);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersError, setFiltersError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedResearchTags, setSelectedResearchTags] = useState<string[]>([]);
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);
  const [onlyInternational, setOnlyInternational] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('matchScore');

  const [professors, setProfessors] = useState<ProfessorProfile[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 30;

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteProfiles, setFavoriteProfiles] = useState<ProfessorProfile[]>([]);
  const [favoritesPanelOpen, setFavoritesPanelOpen] = useState(false);

  const professorCacheRef = useRef<Map<number, ProfessorProfile>>(new Map());

  const [matchDrawerOpen, setMatchDrawerOpen] = useState(false);
  const [matchProfessor, setMatchProfessor] = useState<ProfessorProfile | null>(null);
  const [studentOptions, setStudentOptions] = useState<StudentMatchOption[]>([]);

  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newProfessorCount, setNewProfessorCount] = useState(0);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    setFiltersLoading(true);
    setFiltersError(null);
    fetchProfessorFilters()
      .then((options) => {
        if (!active) return;
        setFilterOptions(options);
      })
      .catch((error) => {
        console.error('[ProfessorDirectory] 获取筛选条件失败', error);
        if (active) setFiltersError('获取筛选条件失败，请稍后重试。');
      })
      .finally(() => active && setFiltersLoading(false));
    return () => {
      active = false;
    };
  }, [authLoading]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    fetchStudentsForMatching()
      .then((options) => {
        if (active) setStudentOptions(options);
      })
      .catch((error) => {
        console.warn('[ProfessorDirectory] 获取学生列表失败', error);
      });
    return () => {
      active = false;
    };
  }, [authLoading]);

  useEffect(() => {
    if (authLoading || !employeeId) {
      setFavoriteIds([]);
      setFavoriteProfiles([]);
      return;
    }
    let active = true;
    fetchProfessorFavorites(employeeId)
      .then((ids) => {
        if (active) setFavoriteIds(ids);
      })
      .catch((error) => {
        console.error('[ProfessorDirectory] 获取收藏失败', error);
        if (active) setFeedback({ message: '加载收藏列表失败，请稍后重试。', variant: 'error' });
      });
    return () => {
      active = false;
    };
  }, [authLoading, employeeId]);

  const pruneSelections = useCallback(
    (nextCountries: string[], options: ProfessorFilterOptions | null) => {
      if (!options) return;
      if (nextCountries.length === 0) {
        setSelectedUniversities([]);
        setSelectedResearchTags([]);
        return;
      }
      const allowedUniversities = new Set<string>();
      const allowedTags = new Set<string>();
      nextCountries.forEach((country) => {
        options.universitiesByCountry[country]?.forEach((item) => allowedUniversities.add(item));
        options.researchTagsByCountry[country]?.forEach((item) => allowedTags.add(item));
      });
      setSelectedUniversities((prev) => prev.filter((item) => allowedUniversities.has(item)));
      setSelectedResearchTags((prev) => prev.filter((item) => allowedTags.has(item)));
    },
    [],
  );

  useEffect(() => {
    pruneSelections(selectedCountries, filterOptions);
  }, [selectedCountries, filterOptions, pruneSelections]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCountries,
    selectedUniversities,
    selectedResearchTags,
    selectedFundingTypes,
    selectedIntakes,
    onlyInternational,
    sortMode,
  ]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    setListLoading(true);
    setListError(null);
    fetchProfessors({
      searchTerm,
      countries: selectedCountries,
      universities: selectedUniversities,
      researchTags: selectedResearchTags,
      fundingTypes: selectedFundingTypes as FundingIntensity[],
      intakes: selectedIntakes,
      onlyInternational,
      sortMode,
      page: currentPage,
      pageSize: PAGE_SIZE,
    })
      .then(({ profiles, total }) => {
        if (!active) return;
        setProfessors(profiles);
        setTotalCount(total);
        const cache = professorCacheRef.current;
        profiles.forEach((profile) => cache.set(profile.id, profile));
      })
      .catch((error) => {
        console.error('[ProfessorDirectory] 获取教授列表失败', error);
        if (active) setListError('获取教授列表失败，请稍后重试。');
      })
      .finally(() => active && setListLoading(false));
    return () => {
      active = false;
    };
  }, [
    authLoading,
    searchTerm,
    selectedCountries,
    selectedUniversities,
    selectedResearchTags,
    selectedFundingTypes,
    selectedIntakes,
    onlyInternational,
    sortMode,
    currentPage,
    PAGE_SIZE,
  ]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalCount, currentPage, PAGE_SIZE]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    const hydrateFavorites = async () => {
      const ids = favoriteIds;
      if (ids.length === 0) {
        if (active) setFavoriteProfiles([]);
        return;
      }
      const cache = professorCacheRef.current;
      const missing: number[] = [];
      ids.forEach((id) => {
        if (!cache.has(id)) {
          missing.push(id);
        }
      });
      if (missing.length > 0) {
        try {
          const fetched = await Promise.all(missing.map((id) => fetchProfessorDetail(id)));
          fetched
            .filter((item): item is ProfessorProfile => item !== null)
            .forEach((profile) => cache.set(profile.id, profile));
        } catch (error) {
          console.error('[ProfessorDirectory] 获取收藏教授详情失败', error);
        }
      }
      if (!active) return;
      const ordered = ids
        .map((id) => professorCacheRef.current.get(id))
        .filter((item): item is ProfessorProfile => Boolean(item));
      setFavoriteProfiles(ordered);
    };
    hydrateFavorites();
    return () => {
      active = false;
    };
  }, [authLoading, favoriteIds, professors]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleToggleSelection = useCallback(
    (value: string, selected: string[], setter: (next: string[]) => void) => {
      setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
    },
    [],
  );

  const handleCountryToggle = useCallback(
    (value: string) => {
      setSelectedCountries((prev) => {
        const next = prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
        pruneSelections(next, filterOptions ?? null);
        return next;
      });
    },
    [filterOptions, pruneSelections],
  );

  const handleViewDetail = useCallback((profile: ProfessorProfile) => {
    navigate(`/admin/professor-directory/${profile.id}`);
  }, [navigate]);

  const handleToggleFavorite = useCallback(
    async (profile: ProfessorProfile, nextState: boolean) => {
      if (!employeeId) {
        setFeedback({ message: '当前账号未关联员工信息，无法收藏。', variant: 'error' });
        return;
      }
      try {
        if (nextState) {
          await addProfessorFavorite(profile.id, employeeId);
          setFavoriteIds((prev) => (prev.includes(profile.id) ? prev : [...prev, profile.id]));
          setFeedback({ message: `已收藏 ${profile.name}`, variant: 'success' });
        } else {
          await removeProfessorFavorite(profile.id, employeeId);
          setFavoriteIds((prev) => prev.filter((id) => id !== profile.id));
          setFeedback({ message: `已移除 ${profile.name} 收藏`, variant: 'info' });
        }
        professorCacheRef.current.set(profile.id, profile);
      } catch (error) {
        console.error('[ProfessorDirectory] 更新收藏失败', error);
        setFeedback({ message: '更新收藏失败，请稍后再试。', variant: 'error' });
      }
    },
    [employeeId],
  );

  const handleOpenMatch = useCallback((profile: ProfessorProfile) => {
    setMatchProfessor(profile);
    setMatchDrawerOpen(true);
  }, []);

  const handleMatchSubmit = useCallback(
    async (professor: ProfessorProfile, payload: { studentId: number; targetIntake: string; customNote?: string }) => {
      if (!employeeId) {
        setFeedback({ message: '当前账号未关联员工信息，无法生成匹配记录。', variant: 'error' });
        return;
      }
      try {
        await createProfessorMatchRecord({
          professorId: professor.id,
          studentId: payload.studentId,
          employeeId,
          targetIntake: payload.targetIntake,
          customNote: payload.customNote,
        });
        setFeedback({
          message: `已为 ${professor.name} 创建匹配记录，申请工作台会提醒跟进。`,
          variant: 'success',
        });
      } catch (error) {
        console.error('[ProfessorDirectory] 创建匹配记录失败', error);
        setFeedback({ message: '生成匹配记录失败，请稍后重试。', variant: 'error' });
        throw error;
      }
    },
    [employeeId],
  );

  const handleRemoveFavorite = useCallback(
    async (id: number) => {
      if (!employeeId) {
        setFeedback({ message: '当前账号未关联员工信息，无法移除收藏。', variant: 'error' });
        return;
      }
      try {
        await removeProfessorFavorite(id, employeeId);
        setFavoriteIds((prev) => prev.filter((existing) => existing !== id));
        setFeedback({ message: '已从收藏清单移除', variant: 'info' });
      } catch (error) {
        console.error('[ProfessorDirectory] 移除收藏失败', error);
        setFeedback({ message: '移除收藏失败，请稍后重试。', variant: 'error' });
      }
    },
    [employeeId],
  );

  const handleToggleFavoritesPanel = useCallback(() => {
    setFavoritesPanelOpen((prev) => !prev);
  }, []);

  const handleSavePreset = useCallback(() => {
    const presetName = `导师筛选-${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(
      `professor-filter-${presetName}`,
      JSON.stringify({
        searchTerm,
        selectedCountries,
        selectedUniversities,
        selectedResearchTags,
        selectedFundingTypes,
        selectedIntakes,
        onlyInternational,
        sortMode,
      }),
    );
    setFeedback({ message: '筛选条件已保存，可在申请工作台引用此方案。', variant: 'success' });
  }, [
    onlyInternational,
    searchTerm,
    selectedCountries,
    selectedFundingTypes,
    selectedIntakes,
    selectedResearchTags,
    selectedUniversities,
    sortMode,
  ]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCountries([]);
    setSelectedUniversities([]);
    setSelectedResearchTags([]);
    setSelectedFundingTypes([]);
    setSelectedIntakes([]);
    setOnlyInternational(true);
    setSortMode('matchScore');
  }, []);

  const mapOptions = useCallback(
    (items: string[]) =>
      items.map((item) => ({
        label: item,
        value: item,
      })),
    [],
  );

  const availableUniversities = useMemo(() => {
    if (!filterOptions || selectedCountries.length === 0) {
      return [];
    }
    const combined = new Set<string>();
    selectedCountries.forEach((country) => {
      filterOptions.universitiesByCountry[country]?.forEach((university) => combined.add(university));
    });
    return Array.from(combined).sort((a, b) => a.localeCompare(b));
  }, [filterOptions, selectedCountries]);

  const availableResearchTags = useMemo(() => {
    if (!filterOptions) {
      return [];
    }
    if (selectedCountries.length === 0) {
      return filterOptions.topResearchTags;
    }
    const combined = new Set<string>();
    selectedCountries.forEach((country) => {
      filterOptions.researchTagsByCountry[country]?.forEach((tag) => combined.add(tag));
    });
    return Array.from(combined).sort((a, b) => a.localeCompare(b));
  }, [filterOptions, selectedCountries]);

  const isDefaultView = useMemo(() => {
    return (
      searchTerm.trim() === '' &&
      selectedCountries.length === 0 &&
      selectedUniversities.length === 0 &&
      selectedResearchTags.length === 0 &&
      selectedFundingTypes.length === 0 &&
      selectedIntakes.length === 0 &&
      onlyInternational === true &&
      sortMode === 'matchScore' &&
      currentPage === 1
    );
  }, [
    searchTerm,
    selectedCountries,
    selectedUniversities,
    selectedResearchTags,
    selectedFundingTypes,
    selectedIntakes,
    onlyInternational,
    sortMode,
    currentPage,
  ]);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  useEffect(() => {
    if (authLoading || listLoading) return;
    if (!isDefaultView) return;
    if (typeof window === 'undefined') return;

    const currentTotal = totalCount;
    if (currentTotal <= 0) return;

    const storedValue = window.localStorage.getItem(LAST_PROFESSOR_TOTAL_KEY);
    if (storedValue === null) {
      window.localStorage.setItem(LAST_PROFESSOR_TOTAL_KEY, String(currentTotal));
      return;
    }

    const previousTotal = Number(storedValue);
    if (Number.isNaN(previousTotal)) {
      window.localStorage.setItem(LAST_PROFESSOR_TOTAL_KEY, String(currentTotal));
      return;
    }

    if (currentTotal > previousTotal) {
      setNewProfessorCount(currentTotal - previousTotal);
      setUpdateDialogOpen(true);
    }

    window.localStorage.setItem(LAST_PROFESSOR_TOTAL_KEY, String(currentTotal));
  }, [authLoading, listLoading, totalCount, isDefaultView]);

  const insights = useMemo(() => {
    const total = totalCount;
    const visibleCount = professors.length;
    if (total === 0 || visibleCount === 0) {
      return {
        total,
        averageMatchScore: 0,
        internationalRatio: 0,
        fullFundingRatio: 0,
        nearestDeadline: undefined as string | undefined,
      };
    }

    const averageMatchScore = Math.round(
      professors.reduce((sum, profile) => sum + (profile.matchScore ?? 0), 0) / visibleCount,
    );
    const internationalRatio =
      professors.filter((profile) => profile.acceptsInternationalStudents).length / visibleCount;
    const fullFundingRatio =
      professors.filter((profile) =>
        profile.fundingOptions.some((option) => option.type === '全额奖学金'),
      ).length / visibleCount;
    const nearestDeadlineProfile = [...professors].sort(
      (a, b) => new Date(a.applicationWindow.end).getTime() - new Date(b.applicationWindow.end).getTime(),
    )[0];

    return {
      total,
      averageMatchScore,
      internationalRatio,
      fullFundingRatio,
      nearestDeadline: nearestDeadlineProfile?.applicationWindow.end,
    };
  }, [professors, totalCount]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageStart = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = totalCount === 0 ? 0 : Math.min(totalCount, currentPage * PAGE_SIZE);

  const handlePageChange = useCallback(
    (delta: number) => {
      setCurrentPage((prev) => {
        const next = prev + delta;
        if (next < 1 || next > totalPages) {
          return prev;
        }
        return next;
      });
    },
    [totalPages],
  );

  if (authLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
        正在同步账号信息，请稍候...
      </div>
    );
  }

  if (userType !== 'admin') {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900/60">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">需要管理员权限</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          全球教授库仅对内部顾问开放，请使用管理员身份登录。
        </p>
      </div>
    );
  }

  const countriesOptions = mapOptions(filterOptions?.countries ?? []);
  const fundingOptions = mapOptions(filterOptions?.fundingTypes ?? []);
  const intakeOptions = mapOptions(filterOptions?.intakes ?? []);

  return (
    <div className="space-y-8 pb-16">
      <header className="relative overflow-hidden rounded-3xl text-white shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1531972111231-7482a960e109?auto=format&fit=crop&w=1600&q=80"
          alt="Flowith 2025 春季招募"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/35 to-transparent" />
        <div className="relative flex flex-col gap-4 p-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">博士申请 · 导师匹配中心</p>
            <h1 className="mt-2 text-2xl font-semibold">全球教授库</h1>
            <p className="mt-2 max-w-3xl text-sm text-indigo-100">
              专为博士申请打造的导师检索与匹配工具，支持按国家、院校、招生年份、奖学金、研究方向、国际学生友好度等维度筛选。
              顾问可一键收藏、导出清单，并与申请工作台联动生成沟通任务。
            </p>
          </div>
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

      {filtersError ? (
        <Alert className="rounded-3xl border border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{filtersError}</AlertDescription>
        </Alert>
      ) : null}

      {filtersLoading && !filterOptions ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
          正在加载最新筛选条件...
        </div>
      ) : null}

      <DoctoralFiltersPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        countries={countriesOptions}
        selectedCountries={selectedCountries}
        onCountryToggle={handleCountryToggle}
        universities={mapOptions(availableUniversities)}
        selectedUniversities={selectedUniversities}
        onUniversityToggle={(value) => handleToggleSelection(value, selectedUniversities, setSelectedUniversities)}
        researchTags={mapOptions(availableResearchTags)}
        selectedResearchTags={selectedResearchTags}
        onResearchTagToggle={(value) => handleToggleSelection(value, selectedResearchTags, setSelectedResearchTags)}
        fundingTypes={fundingOptions}
        selectedFundingTypes={selectedFundingTypes}
        onFundingToggle={(value) => handleToggleSelection(value, selectedFundingTypes, setSelectedFundingTypes)}
        intakes={intakeOptions}
        selectedIntakes={selectedIntakes}
        onIntakeToggle={(value) => handleToggleSelection(value, selectedIntakes, setSelectedIntakes)}
        onlyInternational={onlyInternational}
        onInternationalToggle={setOnlyInternational}
        sortMode={sortMode}
        onSortChange={setSortMode}
        onResetFilters={resetFilters}
        researchTagsLimit={8}
      />

      <div className={`grid gap-6 ${favoritesPanelOpen ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
        <div className="space-y-6">
          <MatchInsightsPanel
            total={insights.total}
            averageMatchScore={insights.averageMatchScore}
            internationalRatio={insights.internationalRatio}
            fullFundingRatio={insights.fullFundingRatio}
            nearestDeadline={insights.nearestDeadline}
            onToggleFavorites={handleToggleFavoritesPanel}
            favoritesPanelOpen={favoritesPanelOpen}
            onSavePreset={handleSavePreset}
          />

          {listError ? (
            <Alert className="rounded-3xl border border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{listError}</AlertDescription>
            </Alert>
          ) : null}

          {listLoading && professors.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/60">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在加载教授数据...
              </div>
            </div>
          ) : (
            <ProfessorGrid
              profiles={professors}
              onViewDetail={handleViewDetail}
              onToggleFavorite={handleToggleFavorite}
              favoriteProfessorIds={favoriteIdSet}
              onOpenMatch={handleOpenMatch}
            />
          )}

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            共 {totalCount} 位教授 · 当前显示 {pageStart}-{pageEnd}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(-1)}
              className="border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              上一页
            </Button>
            <span className="min-w-[88px] text-center text-xs font-medium text-gray-500 dark:text-gray-400">
              第 {totalCount === 0 ? 0 : currentPage} / {totalCount === 0 ? 0 : totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || totalCount === 0}
              onClick={() => handlePageChange(1)}
              className="border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              下一页
            </Button>
          </div>
        </div>
        </div>

        {favoritesPanelOpen && (
          <ShortlistPanel shortlist={favoriteProfiles} onRemove={handleRemoveFavorite} onOpenMatch={handleOpenMatch} />
        )}
      </div>

      <Dialog open={updateDialogOpen && newProfessorCount > 0} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="w-full max-w-lg rounded-2xl border border-indigo-100 bg-white p-0 shadow-xl dark:border-indigo-500/40 dark:bg-gray-900 sm:max-w-xl">
          <DialogHeader className="space-y-3 px-6 pt-6 text-left">
            <DialogTitle className="flex items-center gap-3 px-2 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                <UserPlus className="h-5 w-5" />
              </span>
              教授库有新伙伴
            </DialogTitle>
            <DialogDescription className="px-1 text-sm leading-relaxed text-gray-500 dark:text-gray-300">
              自上次访问以来，教授库里又新增了 <span className="font-semibold text-indigo-600 dark:text-indigo-200">{newProfessorCount}</span>{' '}
              位教授。快去看看是否有适合当前学生的匹配人选。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-6 pb-6">
            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400" onClick={() => setUpdateDialogOpen(false)}>
              好的，马上查看
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProfessorMatchDrawer
        open={matchDrawerOpen}
        onOpenChange={setMatchDrawerOpen}
        professor={matchProfessor}
        studentOptions={studentOptions}
        onSubmit={handleMatchSubmit}
      />
    </div>
  );
};

export default ProfessorDirectoryPage;

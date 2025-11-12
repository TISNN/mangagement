import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
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

type FeedbackState = {
  message: string;
  variant: 'success' | 'info' | 'error';
} | null;

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

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteProfiles, setFavoriteProfiles] = useState<ProfessorProfile[]>([]);

  const professorCacheRef = useRef<Map<number, ProfessorProfile>>(new Map());

  const [matchDrawerOpen, setMatchDrawerOpen] = useState(false);
  const [matchProfessor, setMatchProfessor] = useState<ProfessorProfile | null>(null);
  const [studentOptions, setStudentOptions] = useState<StudentMatchOption[]>([]);

  const [feedback, setFeedback] = useState<FeedbackState>(null);

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
  }, [employeeId]);

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
    })
      .then((rows) => {
        if (!active) return;
        setProfessors(rows);
        const cache = professorCacheRef.current;
        rows.forEach((profile) => cache.set(profile.id, profile));
      })
      .catch((error) => {
        console.error('[ProfessorDirectory] 获取教授列表失败', error);
        if (active) setListError('获取教授列表失败，请稍后重试。');
      })
      .finally(() => active && setListLoading(false));
    return () => {
      active = false;
    };
  }, [authLoading, searchTerm, selectedCountries, selectedUniversities, selectedResearchTags, selectedFundingTypes, selectedIntakes, onlyInternational, sortMode]);

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

  const handleExport = useCallback(() => {
    if (professors.length === 0) {
      setFeedback({ message: '当前筛选没有可导出的教授，请调整条件。', variant: 'info' });
      return;
    }
    const rows = professors.map((profile) => ({
      名称: profile.name,
      院校: profile.university,
      招生状态: profile.phdSupervisionStatus,
      入学季: profile.intake,
      研究方向: profile.researchTags.join(' / '),
      奖学金: profile.fundingOptions.map((option) => option.type).join(' / '),
    }));
    const csvHeader = Object.keys(rows[0]).join(',');
    const csvBody = rows
      .map((row) => Object.values(row).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`${csvHeader}\n${csvBody}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `教授筛选_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ message: '已导出当前筛选结果，文件下载成功。', variant: 'success' });
  }, [professors]);

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

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const insights = useMemo(() => {
    const total = professors.length;
    if (total === 0) {
      return {
        total,
        averageMatchScore: 0,
        internationalRatio: 0,
        fullFundingRatio: 0,
        nearestDeadline: undefined as string | undefined,
      };
    }

    const averageMatchScore = Math.round(
      professors.reduce((sum, profile) => sum + (profile.matchScore ?? 0), 0) / total,
    );
    const internationalRatio =
      professors.filter((profile) => profile.acceptsInternationalStudents).length / total;
    const fullFundingRatio =
      professors.filter((profile) =>
        profile.fundingOptions.some((option) => option.type === '全额奖学金'),
      ).length / total;
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
  }, [professors]);

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
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="International collaboration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-indigo-900/65 to-indigo-800/70" />
        <div className="relative flex flex-col gap-4 p-8 lg:flex-row lg:items-center lg:justify-between">
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <MatchInsightsPanel
            total={insights.total}
            averageMatchScore={insights.averageMatchScore}
            internationalRatio={insights.internationalRatio}
            fullFundingRatio={insights.fullFundingRatio}
            nearestDeadline={insights.nearestDeadline}
            onExport={handleExport}
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
        </div>

        <ShortlistPanel shortlist={favoriteProfiles} onRemove={handleRemoveFavorite} onOpenMatch={handleOpenMatch} />
      </div>

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

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import DoctoralFiltersPanel from './components/DoctoralFiltersPanel';
import ProfessorGrid from './components/ProfessorGrid';
import ProfessorDetailDrawer from './components/ProfessorDetailDrawer';
import MatchInsightsPanel from './components/MatchInsightsPanel';
import ShortlistPanel from './components/ShortlistPanel';
import ProfessorMatchDrawer from './components/ProfessorMatchDrawer';
import { getProfessorFilterOptions, PROFESSOR_PROFILES } from './data';
import { ProfessorProfile, SortMode } from './types';

type FeedbackState = {
  message: string;
  variant: 'success' | 'info';
} | null;

const STUDENT_OPTIONS = [
  { id: 'stu-1001', name: '李晨', targetProgram: '计算机科学 PhD', targetIntake: '2026 Fall' },
  { id: 'stu-1002', name: '王悦', targetProgram: '教育技术 PhD', targetIntake: '2026 Fall' },
  { id: 'stu-1003', name: 'Zoe Chen', targetProgram: '金融科技 PhD', targetIntake: '2026 Fall' },
];

const ProfessorDirectoryPage: React.FC = () => {
  const filterOptions = useMemo(() => getProfessorFilterOptions(), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedResearchTags, setSelectedResearchTags] = useState<string[]>([]);
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);
  const [onlyInternational, setOnlyInternational] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('matchScore');

  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorProfile | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [matchDrawerOpen, setMatchDrawerOpen] = useState(false);
  const [matchProfessor, setMatchProfessor] = useState<ProfessorProfile | null>(null);

  const [shortlist, setShortlist] = useState<ProfessorProfile[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleToggle = (value: string, selected: string[], setter: (next: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const filteredProfiles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return PROFESSOR_PROFILES.filter((profile) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          profile.name,
          profile.university,
          profile.college,
          profile.researchTags.join(' '),
          profile.signatureProjects.join(' '),
          profile.phdSupervisionStatus,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(profile.country);
      const matchesUniversity = selectedUniversities.length === 0 || selectedUniversities.includes(profile.university);
      const matchesTags =
        selectedResearchTags.length === 0 ||
        selectedResearchTags.every((tag) => profile.researchTags.includes(tag));
      const matchesFunding =
        selectedFundingTypes.length === 0 ||
        profile.fundingOptions.some((option) => selectedFundingTypes.includes(option.type));
      const matchesIntake =
        selectedIntakes.length === 0 || selectedIntakes.includes(profile.applicationWindow.intake);
      const matchesInternational = !onlyInternational || profile.acceptsInternationalStudents;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesUniversity &&
        matchesTags &&
        matchesFunding &&
        matchesIntake &&
        matchesInternational
      );
    });
  }, [
    searchTerm,
    selectedCountries,
    selectedUniversities,
    selectedResearchTags,
    selectedFundingTypes,
    selectedIntakes,
    onlyInternational,
  ]);

  const sortedProfiles = useMemo(() => {
    const list = [...filteredProfiles];

    switch (sortMode) {
      case 'recentlyReviewed':
        return list.sort(
          (a, b) => new Date(b.lastReviewedAt).getTime() - new Date(a.lastReviewedAt).getTime(),
        );
      case 'fundingPriority':
        return list.sort((a, b) => {
          const weight = (profile: ProfessorProfile) =>
            profile.fundingOptions.some((option) => option.type === '全额奖学金') ? 1 : 0;
          return weight(b) - weight(a) || b.matchScore - a.matchScore;
        });
      case 'matchScore':
      default:
        return list.sort((a, b) => b.matchScore - a.matchScore);
    }
  }, [filteredProfiles, sortMode]);

  const insights = useMemo(() => {
    const total = sortedProfiles.length;
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
      sortedProfiles.reduce((sum, profile) => sum + profile.matchScore, 0) / total,
    );
    const internationalRatio =
      sortedProfiles.filter((profile) => profile.acceptsInternationalStudents).length / total;
    const fullFundingRatio =
      sortedProfiles.filter((profile) =>
        profile.fundingOptions.some((option) => option.type === '全额奖学金'),
      ).length / total;
    const nearestDeadlineProfile = [...sortedProfiles].sort(
      (a, b) => new Date(a.applicationWindow.end).getTime() - new Date(b.applicationWindow.end).getTime(),
    )[0];

    return {
      total,
      averageMatchScore,
      internationalRatio,
      fullFundingRatio,
      nearestDeadline: nearestDeadlineProfile?.applicationWindow.end,
    };
  }, [sortedProfiles]);

  const handleViewDetail = (profile: ProfessorProfile) => {
    setSelectedProfessor(profile);
    setDetailOpen(true);
  };

  const handleAddToShortlist = (profile: ProfessorProfile) => {
    setShortlist((prev) => {
      if (prev.some((item) => item.id === profile.id)) {
        setFeedback({ message: '教授已在收藏清单中', variant: 'info' });
        return prev;
      }
      setFeedback({ message: `已将 ${profile.name} 添加到收藏清单`, variant: 'success' });
      return [...prev, profile];
    });
  };

  const handleOpenMatch = (profile: ProfessorProfile) => {
    setMatchProfessor(profile);
    setMatchDrawerOpen(true);
  };

  const handleRemoveFromShortlist = (id: string) => {
    setShortlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExport = () => {
    const rows = sortedProfiles.map((profile) => ({
      名称: profile.name,
      院校: profile.university,
      招生状态: profile.phdSupervisionStatus,
      入学季: profile.applicationWindow.intake,
      研究方向: profile.researchTags.join(' / '),
      奖学金: profile.fundingOptions.map((option) => option.type).join(' / '),
    }));
    const csvHeader = Object.keys(rows[0] ?? {}).join(',');
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
  };

  const handleSavePreset = () => {
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
  };

  const handleMatchSubmit = async (professor: ProfessorProfile, payload: { studentId: string; targetIntake: string; customNote?: string }) => {
    // 模拟写入成功
    await new Promise((resolve) => setTimeout(resolve, 400));
    setFeedback({
      message: `已将 ${professor.name} 加入学生方案，并生成待沟通任务。`,
      variant: 'success',
    });
  };

  const toggleFunctions = {
    countries: (value: string) => handleToggle(value, selectedCountries, setSelectedCountries),
    universities: (value: string) => handleToggle(value, selectedUniversities, setSelectedUniversities),
    researchTags: (value: string) => handleToggle(value, selectedResearchTags, setSelectedResearchTags),
    fundingTypes: (value: string) => handleToggle(value, selectedFundingTypes, setSelectedFundingTypes),
    intakes: (value: string) => handleToggle(value, selectedIntakes, setSelectedIntakes),
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCountries([]);
    setSelectedUniversities([]);
    setSelectedResearchTags([]);
    setSelectedFundingTypes([]);
    setSelectedIntakes([]);
    setOnlyInternational(true);
    setSortMode('matchScore');
  };

  const mapOptions = (items: string[]) =>
    items.map((item) => ({
      label: item,
      value: item,
    }));

  const availableUniversities = useMemo(() => {
    if (selectedCountries.length === 0) {
      return [];
    }
    const combined = new Set<string>();
    selectedCountries.forEach((country) => {
      filterOptions.universitiesByCountry[country]?.forEach((university) => combined.add(university));
    });
    return Array.from(combined).sort();
  }, [selectedCountries, filterOptions.universitiesByCountry]);

  const availableResearchTags = useMemo(() => {
    if (selectedCountries.length === 0) {
      return filterOptions.topResearchTags;
    }
    const combined = new Set<string>();
    selectedCountries.forEach((country) => {
      filterOptions.researchTagsByCountry[country]?.forEach((tag) => combined.add(tag));
    });
    return Array.from(combined).sort();
  }, [selectedCountries, filterOptions.researchTagsByCountry, filterOptions.topResearchTags]);

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
              : 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      <DoctoralFiltersPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        countries={mapOptions(filterOptions.countries)}
        selectedCountries={selectedCountries}
        onCountryToggle={toggleFunctions.countries}
        universities={mapOptions(availableUniversities)}
        selectedUniversities={selectedUniversities}
        onUniversityToggle={toggleFunctions.universities}
        researchTags={mapOptions(availableResearchTags)}
        selectedResearchTags={selectedResearchTags}
        onResearchTagToggle={toggleFunctions.researchTags}
        fundingTypes={mapOptions(filterOptions.fundingTypes)}
        selectedFundingTypes={selectedFundingTypes}
        onFundingToggle={toggleFunctions.fundingTypes}
        intakes={mapOptions(filterOptions.intakes)}
        selectedIntakes={selectedIntakes}
        onIntakeToggle={toggleFunctions.intakes}
        onlyInternational={onlyInternational}
        onInternationalToggle={setOnlyInternational}
        sortMode={sortMode}
        onSortChange={setSortMode}
        onResetFilters={resetFilters}
        researchTagsLimit={12}
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

          <ProfessorGrid
            profiles={sortedProfiles}
            onViewDetail={handleViewDetail}
            onAddToShortlist={handleAddToShortlist}
            onOpenMatch={handleOpenMatch}
          />
        </div>

        <ShortlistPanel
          shortlist={shortlist}
          onRemove={handleRemoveFromShortlist}
          onOpenMatch={handleOpenMatch}
        />
      </div>

      <ProfessorDetailDrawer open={detailOpen} onOpenChange={setDetailOpen} profile={selectedProfessor} />

      <ProfessorMatchDrawer
        open={matchDrawerOpen}
        onOpenChange={setMatchDrawerOpen}
        professor={matchProfessor}
        studentOptions={STUDENT_OPTIONS}
        onSubmit={handleMatchSubmit}
      />
    </div>
  );
};

export default ProfessorDirectoryPage;


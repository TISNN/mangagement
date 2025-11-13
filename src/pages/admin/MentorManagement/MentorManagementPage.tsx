import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Download, Globe2, Sparkles, Users } from 'lucide-react';

import { MENTOR_TEAM } from './data';
import type { MentorRecord, MentorView } from './types';
import {
  AvailabilityView,
  FilterBar,
  InsightsView,
  MentorRoster,
  MissionPerformanceView,
  SharedResources,
  SkillMatrixView,
  SummaryCards,
} from './components';
import { filterMentors } from './utils';
import {
  getStoredMentorMarketplaceSelection,
  MENTOR_MARKET_SELECTION_EVENT,
} from './mentorMarketplaceStorage';

const mentorTabs: { id: MentorView; label: string; icon: React.ReactNode }[] = [
  { id: 'roster', label: '导师名册', icon: <Users className="h-4 w-4" /> },
  { id: 'matrix', label: '能力矩阵', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'availability', label: '排班与可用性', icon: <Download className="h-4 w-4" /> },
  { id: 'mission', label: '任务与绩效', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'insights', label: '数据洞察', icon: <Sparkles className="h-4 w-4" /> },
];

const MentorManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<MentorView>('roster');
  const [search, setSearch] = useState('');
  const [selectedMentors, setSelectedMentors] = useState<Set<string>>(new Set(['mentor-1', 'mentor-2']));
  const [marketSelectionCount, setMarketSelectionCount] = useState(
    () => getStoredMentorMarketplaceSelection().size,
  );

  const filteredTeam = useMemo(() => filterMentors(MENTOR_TEAM, search), [search]);

  const toggleTeamMentor = (mentorId: string) => {
    setSelectedMentors((prev) => {
      const next = new Set(prev);
      if (next.has(mentorId)) {
        next.delete(mentorId);
      } else {
        next.add(mentorId);
      }
      return next;
    });
  };

  const handleViewDetail = (mentorId: string) => {
    navigate(`/admin/mentors/${mentorId}`);
  };

  useEffect(() => {
    const handleSelectionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ ids: string[] }>).detail;
      if (detail?.ids) {
        setMarketSelectionCount(detail.ids.length);
      } else {
        setMarketSelectionCount(getStoredMentorMarketplaceSelection().size);
      }
    };

    const syncFromStorage = () => {
      setMarketSelectionCount(getStoredMentorMarketplaceSelection().size);
    };

    window.addEventListener(MENTOR_MARKET_SELECTION_EVENT, handleSelectionChange as EventListener);
    window.addEventListener('focus', syncFromStorage);

    return () => {
      window.removeEventListener(
        MENTOR_MARKET_SELECTION_EVENT,
        handleSelectionChange as EventListener,
      );
      window.removeEventListener('focus', syncFromStorage);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">导师管理中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Management Center</p>
          <p className="max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            统一管理内部导师与外部人才市场，结合档案、排班、绩效与共享资源，构建高效稳定的导师运营体系。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
            <Download className="h-4 w-4" />
            导出导师档案
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            <Users className="h-4 w-4" />
            新增导师
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500"
            onClick={() => navigate('/admin/mentor-marketplace')}
          >
            <Globe2 className="h-4 w-4" />
            导师人才市场
            {marketSelectionCount > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">
                {marketSelectionCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <SummaryCards />

      <FilterBar search={search} setSearch={setSearch} />

      <div className="rounded-2xl bg-white p-2 dark:bg-gray-800">
        <div className="flex flex-wrap gap-2">
          {mentorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                view === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'roster' && (
        <MentorRoster
          mentors={filteredTeam}
          selectedIds={selectedMentors}
          onToggleSelect={toggleTeamMentor}
          hideSelectAction
          onViewDetail={handleViewDetail}
        />
      )}

      {view === 'matrix' && <SkillMatrixView />}

      {view === 'availability' && <AvailabilityView />}

      {view === 'mission' && <MissionPerformanceView />}

      {view === 'insights' && <InsightsView />}

      <SharedResources />
    </div>
  );
};

export default MentorManagementPage;


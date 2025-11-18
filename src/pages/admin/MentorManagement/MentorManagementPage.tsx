import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Globe2, Sparkles, Users, Plus, Loader2, AlertCircle, Calendar } from 'lucide-react';

import type { MentorRecord, MentorView, SummaryMetric } from './types';
import {
  AvailabilityView,
  FilterBar,
  InsightsView,
  MentorRoster,
  MissionPerformanceView,
  SkillMatrixView,
  SummaryCards,
} from './components';
import { filterMentors } from './utils';
import {
  getStoredMentorMarketplaceSelection,
  MENTOR_MARKET_SELECTION_EVENT,
} from './mentorMarketplaceStorage';
import { fetchAllMentors, getMentorSummaryMetrics } from './services/mentorManagementService';
import { CreateMentorModal } from './components/CreateMentorModal';

const mentorTabs: { id: MentorView; label: string; icon: React.ReactNode }[] = [
  { id: 'roster', label: '导师名册', icon: <Users className="h-4 w-4" /> },
  { id: 'matrix', label: '能力矩阵', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'availability', label: '排班与可用性', icon: <Calendar className="h-4 w-4" /> },
  { id: 'mission', label: '任务与绩效', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'insights', label: '数据洞察', icon: <Sparkles className="h-4 w-4" /> },
];

const MentorManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<MentorView>('roster');
  const [search, setSearch] = useState('');
  const [selectedMentors, setSelectedMentors] = useState<Set<string>>(new Set());
  const [marketSelectionCount, setMarketSelectionCount] = useState(
    () => getStoredMentorMarketplaceSelection().size,
  );

  // 数据状态
  const [mentors, setMentors] = useState<MentorRecord[]>([]);
  const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 加载数据
  useEffect(() => {
    loadMentorData();
  }, []);

  const loadMentorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [mentorsData, metricsData] = await Promise.all([
        fetchAllMentors(),
        getMentorSummaryMetrics(),
      ]);
      
      setMentors(mentorsData);
      setSummaryMetrics(metricsData);
    } catch (err) {
      console.error('加载导师数据失败:', err);
      setError(err instanceof Error ? err.message : '加载数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = useMemo(() => filterMentors(mentors, search), [mentors, search]);

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
    // 提取数字ID（格式：mentor-123）
    const id = mentorId.replace('mentor-', '');
    navigate(`/admin/mentors/${id}`);
  };

  const handleCreateMentor = () => {
    setShowCreateModal(true);
  };

  const handleMentorCreated = () => {
    // 重新加载导师数据
    loadMentorData();
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

  // 加载状态
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">正在加载导师数据...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadMentorData}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">导师管理中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Management Center</p>
          <p className="max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            统一管理内部导师与外部人才市场，结合档案、排班、绩效，构建高效稳定的导师运营体系。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateMentor}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
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

      <SummaryCards metrics={summaryMetrics} />

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
        <>
          {filteredTeam.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center dark:border-gray-700/60 dark:bg-gray-800">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                {search ? '未找到匹配的导师' : '暂无导师数据'}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {search ? '请尝试其他搜索关键词' : '请先添加导师'}
              </p>
            </div>
          ) : (
        <MentorRoster
          mentors={filteredTeam}
          selectedIds={selectedMentors}
          onToggleSelect={toggleTeamMentor}
          hideSelectAction
          onViewDetail={handleViewDetail}
        />
          )}
        </>
      )}

      {view === 'matrix' && <SkillMatrixView />}

      {view === 'availability' && <AvailabilityView />}

      {view === 'mission' && <MissionPerformanceView />}

      {view === 'insights' && <InsightsView />}

      {/* 创建导师模态框 */}
      <CreateMentorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleMentorCreated}
      />
    </div>
  );
};

export default MentorManagementPage;


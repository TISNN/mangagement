import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Filter, NotebookPen, Search, Sparkles, Star, Users, Clock, TrendingUp } from 'lucide-react';

import { Button } from '../../../components/ui/button';

import { TEMPLATE_LIBRARY } from './data';
import type { TemplatePlaybook } from './types';

const CHANNEL_FILTERS: Array<{ id: string; label: string }> = [
  { id: 'all', label: '全部渠道' },
  { id: '电话', label: '电话' },
  { id: '邮件', label: '邮件' },
  { id: '微信', label: '微信' },
  { id: '会议', label: '会议' },
  { id: '短信', label: '短信' },
];

const STAGE_FILTERS: Array<{ id: string; label: string }> = [
  { id: 'all', label: '全部阶段' },
  { id: '初次沟通', label: '初次沟通' },
  { id: '深度沟通', label: '深度沟通' },
  { id: '合同拟定', label: '合同拟定' },
  { id: '签约', label: '签约' },
];

const highlightBadgeStyle =
  'inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200';

const ItemCard: React.FC<{ item: TemplatePlaybook; onViewDetail: (id: string) => void }> = ({ item, onViewDetail }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.aiPrompt);
    } catch (error) {
      console.error('复制话术失败', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-blue-500/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</span>
            <span className={highlightBadgeStyle}>{item.channel}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-200">
              {item.stage}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <Copy className="h-3.5 w-3.5" />
            复制话术
          </Button>
          <Button size="sm" onClick={() => onViewDetail(item.id)} className="gap-1 bg-blue-600 text-white hover:bg-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            查看详情
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
          <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">适用场景</div>
          <p className="mt-1">{item.scenario}</p>
        </div>
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
          <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">行动提示</div>
          <p className="mt-1">{item.nextAction}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {item.highlights.map((highlight) => (
          <span key={highlight} className={highlightBadgeStyle}>
            <Sparkles className="h-3 w-3" /> {highlight}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {item.owner}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> 更新 {item.lastUpdated}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-500" /> 评分 {item.rating}
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-500" /> 使用 {item.usage} 次
        </span>
      </div>
    </div>
  );
};

const CRMTemplateLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredTemplates = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return TEMPLATE_LIBRARY.filter((item) => {
      const matchKeyword =
        !keyword ||
        [item.title, item.description, item.scenario, item.owner].some((field) => field.toLowerCase().includes(keyword));
      const matchChannel = channelFilter === 'all' || item.channel === channelFilter;
      const matchStage = stageFilter === 'all' || item.stage === stageFilter;
      return matchKeyword && matchChannel && matchStage;
    });
  }, [channelFilter, stageFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            <NotebookPen className="h-8 w-8 text-blue-500" />
            模板与话术库
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-6">
            汇总高分话术、邮件模板与会议脚本，支持按渠道与阶段筛选，帮助顾问快速响应客户需求。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/crm-lead-list')}
            className="gap-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回线索列表
          </Button>
          <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            创建专属模板
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="搜索标题 / 场景 / 负责人"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 w-64 rounded-lg border border-gray-200 pl-9 pr-3 text-sm shadow-sm outline-none transition hover:border-blue-200 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <Button variant="outline" className="gap-1 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Filter className="h-3.5 w-3.5" /> 高级筛选
            </Button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">共 {filteredTemplates.length} 条模板</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CHANNEL_FILTERS.map((filter) => {
            const isActive = channelFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setChannelFilter(filter.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                    : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {STAGE_FILTERS.map((filter) => {
            const isActive = stageFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setStageFilter(filter.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition ${
                  isActive
                    ? 'border-purple-500 bg-purple-50 text-purple-600 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-200'
                    : 'border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-purple-500 dark:hover:text-purple-200'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredTemplates.map((item) => (
          <ItemCard key={item.id} item={item} onViewDetail={(id) => navigate(`/admin/crm-template-library/${id}`)} />
        ))}
        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
            <NotebookPen className="h-8 w-8 text-gray-400" />
            暂无匹配模板，试试调整筛选条件或创建新的模板。
          </div>
        )}
      </div>
    </div>
  );
};

export default CRMTemplateLibraryPage;


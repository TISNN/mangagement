import React from 'react';
import { Filter, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SortMode } from '../types';

interface ToggleGroupOption {
  label: string;
  value: string;
}

interface DoctoralFiltersPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  countries: ToggleGroupOption[];
  selectedCountries: string[];
  onCountryToggle: (value: string) => void;
  universities: ToggleGroupOption[];
  selectedUniversities: string[];
  onUniversityToggle: (value: string) => void;
  researchTags: ToggleGroupOption[];
  selectedResearchTags: string[];
  onResearchTagToggle: (value: string) => void;
  fundingTypes: ToggleGroupOption[];
  selectedFundingTypes: string[];
  onFundingToggle: (value: string) => void;
  intakes: ToggleGroupOption[];
  selectedIntakes: string[];
  onIntakeToggle: (value: string) => void;
  onlyInternational: boolean;
  onInternationalToggle: (value: boolean) => void;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  onResetFilters: () => void;
  researchTagsLimit?: number;
}

const TogglePill: React.FC<{
  option: ToggleGroupOption;
  active: boolean;
  onClick: (value: string) => void;
}> = ({ option, active, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(option.value)}
    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
      active
        ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm'
        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-400 hover:text-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300'
    }`}
  >
    {option.label}
  </button>
);

const ToggleGroup: React.FC<{
  title: string;
  options: ToggleGroupOption[];
  selected: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
}> = ({ title, options, selected, onToggle, placeholder }) => {
  if (options.length === 0) {
    if (!placeholder) {
      return null;
    }
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
        <p className="rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-400 dark:bg-gray-800/60 dark:text-gray-500">
          {placeholder}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <TogglePill key={option.value} option={option} active={selected.includes(option.value)} onClick={onToggle} />
        ))}
      </div>
    </div>
  );
};

const DoctoralFiltersPanel: React.FC<DoctoralFiltersPanelProps> = ({
  searchTerm,
  onSearchChange,
  countries,
  selectedCountries,
  onCountryToggle,
  universities,
  selectedUniversities,
  onUniversityToggle,
  researchTags,
  selectedResearchTags,
  onResearchTagToggle,
  fundingTypes,
  selectedFundingTypes,
  onFundingToggle,
  intakes,
  selectedIntakes,
  onIntakeToggle,
  onlyInternational,
  onInternationalToggle,
  sortMode,
  onSortChange,
  onResetFilters,
  researchTagsLimit = 12,
}) => {
  const [showAllResearchTags, setShowAllResearchTags] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  React.useEffect(() => {
    setShowAllResearchTags(false);
  }, [researchTags]);
  
  const limitedResearchTags = React.useMemo(() => {
    if (showAllResearchTags || researchTagsLimit === undefined) {
      return researchTags;
    }
    return researchTags.slice(0, researchTagsLimit);
  }, [researchTags, researchTagsLimit, showAllResearchTags]);
  const canToggleResearchTags = researchTagsLimit !== undefined && researchTags.length > researchTagsLimit;

  return (
    <section className="space-y-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/60">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Filter className="h-4 w-4 text-indigo-500" />
          <span>导师筛选器</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-indigo-500 transition hover:text-indigo-400"
          >
            {isExpanded ? '收起筛选' : '展开全部'}
          </button>
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-xs text-gray-500 hover:text-indigo-600">
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            重置
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜索教授姓名、研究主题或代表项目"
          className="h-9 rounded-xl bg-gray-50 pl-9 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-gray-800/80 dark:text-gray-200"
        />
      </div>

      {/* 主要筛选项：国家和院校 - 始终显示 */}
      <div className="grid gap-3 md:grid-cols-2">
        <ToggleGroup title="国家/地区" options={countries} selected={selectedCountries} onToggle={onCountryToggle} />
        <ToggleGroup
          title="院校"
          options={universities}
          selected={selectedUniversities}
          onToggle={onUniversityToggle}
          placeholder="请先选择国家"
        />
      </div>

      {/* 展开时显示的其他筛选项 */}
      {isExpanded && (
        <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">研究方向标签</p>
              {canToggleResearchTags && (
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-500 transition hover:text-indigo-400"
                  onClick={() => setShowAllResearchTags((prev) => !prev)}
                >
                  {showAllResearchTags ? '收起' : `显示全部 ${researchTags.length} 个`}
                </button>
              )}
            </div>
            {researchTags.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-400 dark:bg-gray-800/60 dark:text-gray-500">
                请先选择国家，系统会推荐高频研究方向
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {limitedResearchTags.map((option) => (
                  <TogglePill
                    key={option.value}
                    option={option}
                    active={selectedResearchTags.includes(option.value)}
                    onClick={onResearchTagToggle}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ToggleGroup title="资助情况" options={fundingTypes} selected={selectedFundingTypes} onToggle={onFundingToggle} />
            <ToggleGroup title="目标入学季" options={intakes} selected={selectedIntakes} onToggle={onIntakeToggle} />

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">国际学生</p>
              <div className="flex gap-1.5">
                <Button
                  variant={onlyInternational ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onInternationalToggle(true)}
                  className={`h-7 text-xs ${onlyInternational ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : ''}`}
                >
                  仅国际
                </Button>
                <Button
                  variant={!onlyInternational ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onInternationalToggle(false)}
                  className={`h-7 text-xs ${!onlyInternational ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : ''}`}
                >
                  全部
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">排序方式</p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={sortMode === 'matchScore' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange('matchScore')}
                className={`h-7 text-xs ${sortMode === 'matchScore' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : ''}`}
              >
                匹配度
              </Button>
              <Button
                variant={sortMode === 'recentlyReviewed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange('recentlyReviewed')}
                className={`h-7 text-xs ${sortMode === 'recentlyReviewed' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : ''}`}
              >
                最近审核
              </Button>
              <Button
                variant={sortMode === 'fundingPriority' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange('fundingPriority')}
                className={`h-7 text-xs ${sortMode === 'fundingPriority' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : ''}`}
              >
                奖学金
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctoralFiltersPanel;


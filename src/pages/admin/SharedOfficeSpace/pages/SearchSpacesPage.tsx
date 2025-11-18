/**
 * 搜索空间页面
 * 浏览和搜索所有可用空间
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map, List, Filter, X } from 'lucide-react';
import { SpaceCard } from '../components/SpaceCard';
import { getSpaces } from '../services/spaceService';
import type { OfficeSpace, SpaceFilters, SpaceType, PricingModel } from '../types';
import { SPACE_TYPE_LABELS, PRICING_MODEL_LABELS } from '../types';

export const SearchSpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<OfficeSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SpaceFilters>({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadSpaces();
  }, [filters]);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      const result = await getSpaces(filters);
      setSpaces(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('加载空间列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchText: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchText || undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof SpaceFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.city ||
    filters.space_type ||
    filters.pricing_model ||
    filters.min_price ||
    filters.max_price ||
    filters.min_capacity
  );

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索空间名称、地址或描述..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadSpaces()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            筛选
            {hasActiveFilters && (
              <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                !
              </span>
            )}
          </button>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 border-l border-gray-300 dark:border-gray-600 ${
                viewMode === 'map'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">筛选条件</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  清除全部
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 城市 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                城市
              </label>
              <input
                type="text"
                placeholder="输入城市"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* 空间类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                空间类型
              </label>
              <select
                value={filters.space_type || 'all'}
                onChange={(e) =>
                  handleFilterChange('space_type', e.target.value === 'all' ? undefined : e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">全部类型</option>
                {Object.entries(SPACE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 价格模式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                价格模式
              </label>
              <select
                value={filters.pricing_model || 'all'}
                onChange={(e) =>
                  handleFilterChange('pricing_model', e.target.value === 'all' ? undefined : e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">全部</option>
                {Object.entries(PRICING_MODEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 最小容量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                最小容量
              </label>
              <input
                type="number"
                placeholder="人数"
                value={filters.min_capacity || ''}
                onChange={(e) =>
                  handleFilterChange('min_capacity', e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* 价格范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                最低价格
              </label>
              <input
                type="number"
                placeholder="¥"
                value={filters.min_price || ''}
                onChange={(e) =>
                  handleFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                最高价格
              </label>
              <input
                type="number"
                placeholder="¥"
                value={filters.max_price || ''}
                onChange={(e) =>
                  handleFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        找到 <span className="font-semibold text-gray-900 dark:text-white">{total}</span> 个可用空间
      </div>

      {/* 空间列表 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">没有找到匹配的空间</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              清除筛选条件
            </button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onClick={() => navigate(`/admin/shared-office/spaces/${space.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">地图视图功能待实现</p>
        </div>
      )}

      {/* 分页 */}
      {total > (filters.limit || 20) && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
            disabled={filters.page === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            第 {filters.page || 1} 页，共 {Math.ceil(total / (filters.limit || 20))} 页
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
            disabled={(filters.page || 1) >= Math.ceil(total / (filters.limit || 20))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};


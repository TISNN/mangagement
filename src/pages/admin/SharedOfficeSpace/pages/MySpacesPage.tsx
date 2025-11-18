/**
 * 我的空间列表页面
 * 显示我发布的所有空间
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, MoreVertical } from 'lucide-react';
import { SpaceCard } from '../components/SpaceCard';
import { StatsCard } from '../components/StatsCard';
import { getMySpaces, getSpaceStats } from '../services/spaceService';
import type { OfficeSpace, SpaceStats } from '../types';
import { Building2, CheckCircle, Clock, Pause } from 'lucide-react';

export const MySpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<OfficeSpace[]>([]);
  const [stats, setStats] = useState<SpaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [spacesData, statsData] = await Promise.all([
        getMySpaces(1, { status: statusFilter, search }), // TODO: 获取真实用户ID
        getSpaceStats(1), // TODO: 获取真实用户ID
      ]);
      setSpaces(spacesData);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="总空间数"
            value={stats.total}
            icon={Building2}
            color="blue"
          />
          <StatsCard
            title="已发布"
            value={stats.released}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="待审核"
            value={stats.pending}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="总预约数"
            value={stats.total_bookings}
            icon={Building2}
            color="purple"
          />
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索空间名称或地址..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">全部状态</option>
            <option value="draft">草稿</option>
            <option value="pending">待审核</option>
            <option value="released">已发布</option>
            <option value="suspended">已下架</option>
          </select>
        </div>
        <button
          onClick={() => navigate('/admin/shared-office/my-spaces/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          发布新空间
        </button>
      </div>

      {/* 空间列表 */}
      {spaces.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">还没有发布任何空间</p>
          <button
            onClick={() => navigate('/admin/shared-office/my-spaces/new')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            发布第一个空间
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onClick={() => navigate(`/admin/shared-office/spaces/${space.id}`)}
              showActions
              onEdit={() => navigate(`/admin/shared-office/my-spaces/${space.id}/edit`)}
              onManage={() => navigate(`/admin/shared-office/spaces/${space.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};


/**
 * 概览页面
 * 显示统计数据和快速入口
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Calendar, TrendingUp, Plus, Search } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { getSpaceStats } from '../services/spaceService';
import { getRequestStats } from '../services/requestService';
import { getBookingStats } from '../services/bookingService';
import type { SpaceStats, RequestStats, BookingStats } from '../types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [spaceStats, setSpaceStats] = useState<SpaceStats | null>(null);
  const [requestStats, setRequestStats] = useState<RequestStats | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [spaces, requests, bookings] = await Promise.all([
        getSpaceStats(),
        getRequestStats(),
        getBookingStats(),
      ]);
      setSpaceStats(spaces);
      setRequestStats(requests);
      setBookingStats(bookings);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="总空间数"
          value={spaceStats?.total || 0}
          icon={Building2}
          color="blue"
          subtitle={`已发布 ${spaceStats?.released || 0} 个`}
        />
        <StatsCard
          title="总需求数"
          value={requestStats?.total || 0}
          icon={FileText}
          color="green"
          subtitle={`匹配中 ${requestStats?.matching || 0} 个`}
        />
        <StatsCard
          title="总预约数"
          value={bookingStats?.total || 0}
          icon={Calendar}
          color="purple"
          subtitle={`已完成 ${bookingStats?.completed || 0} 个`}
        />
        <StatsCard
          title="匹配成功率"
          value={
            requestStats?.total && requestStats.total > 0
              ? `${Math.round((requestStats.booked / requestStats.total) * 100)}%`
              : '0%'
          }
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/shared-office/my-spaces/new')}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">发布空间</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            发布您的办公空间，让更多人使用
          </p>
        </button>

        <button
          onClick={() => navigate('/admin/shared-office/my-requests/new')}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">发布需求</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            发布您的空间需求，快速找到合适空间
          </p>
        </button>

        <button
          onClick={() => navigate('/admin/shared-office/search')}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">搜索空间</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            浏览所有可用空间，找到最适合的
          </p>
        </button>
      </div>
    </div>
  );
};


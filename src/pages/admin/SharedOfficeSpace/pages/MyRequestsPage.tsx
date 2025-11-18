/**
 * 我的需求页面
 * 显示我发布的所有需求
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { StatsCard } from '../components/StatsCard';
import { getMyRequests, getRequestStats, cancelRequest } from '../services/requestService';
import type { SpaceRequest, RequestStats } from '../types';

export const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SpaceRequest[]>([]);
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, statsData] = await Promise.all([
        getMyRequests(1, { status: statusFilter, search }), // TODO: 获取真实用户ID
        getRequestStats(1), // TODO: 获取真实用户ID
      ]);
      setRequests(requestsData);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId: number) => {
    if (!confirm('确定要取消这个需求吗？')) {
      return;
    }

    try {
      await cancelRequest(requestId, 1); // TODO: 获取真实用户ID
      loadData();
    } catch (error) {
      console.error('取消需求失败:', error);
      alert('取消需求失败，请重试');
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="总需求数"
            value={stats.total}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="已发布"
            value={stats.published}
            icon={FileText}
            color="green"
          />
          <StatsCard
            title="匹配中"
            value={stats.matching}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="已预约"
            value={stats.booked}
            icon={CheckCircle}
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
              placeholder="搜索需求标题或描述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadData()}
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
            <option value="published">已发布</option>
            <option value="matching">匹配中</option>
            <option value="booked">已预约</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <button
          onClick={() => navigate('/admin/shared-office/my-requests/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          发布新需求
        </button>
      </div>

      {/* 需求列表 */}
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">还没有发布任何需求</p>
          <button
            onClick={() => navigate('/admin/shared-office/my-requests/new')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            发布第一个需求
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => navigate(`/admin/shared-office/requests/${request.id}`)}
              showActions
              onView={() => navigate(`/admin/shared-office/requests/${request.id}`)}
              onCancel={() => handleCancel(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};


/**
 * 我的预约页面
 * 显示我申请的所有预约
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { getBookings, getBookingStats, cancelBooking } from '../services/bookingService';
import type { Booking, BookingStats, BookingStatus } from '../types';
import { BOOKING_STATUS_LABELS } from '../types';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, statsData] = await Promise.all([
        getBookings({
          requester_id: 1, // TODO: 获取真实用户ID
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page: 1,
          limit: 50,
        }),
        getBookingStats(1, 'requester'), // TODO: 获取真实用户ID
      ]);
      setBookings(bookingsData.data);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm('确定要取消这个预约吗？取消后可能无法恢复。')) {
      return;
    }

    try {
      await cancelBooking(bookingId, 1, '用户主动取消'); // TODO: 获取真实用户ID
      loadData();
    } catch (error) {
      console.error('取消预约失败:', error);
      alert('取消预约失败，请重试');
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
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
            title="总预约数"
            value={stats.total}
            icon={Calendar}
            color="blue"
          />
          <StatsCard
            title="待审核"
            value={stats.pending}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="已确认"
            value={stats.confirmed}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="已完成"
            value={stats.completed}
            icon={CheckCircle}
            color="purple"
          />
        </div>
      )}

      {/* 筛选栏 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索空间名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">全部状态</option>
          {Object.entries(BOOKING_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 预约列表 */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">还没有任何预约</p>
          <button
            onClick={() => navigate('/admin/shared-office/search')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            去搜索空间
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings
            .filter((booking) => {
              if (search) {
                return booking.space?.name?.toLowerCase().includes(search.toLowerCase());
              }
              return true;
            })
            .map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/admin/shared-office/bookings/${booking.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {booking.space?.name || '未知空间'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.booking_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {booking.start_time} - {booking.end_time}
                        </span>
                      </div>
                      {booking.price && (
                        <div className="font-medium text-gray-900 dark:text-white">
                          ¥{booking.price}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(booking.status)}`}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </span>
                </div>

                {booking.purpose && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    用途：{booking.purpose}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    提供方：{booking.provider_name || '未知'}
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(booking.id);
                        }}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        取消预约
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/shared-office/bookings/${booking.id}`);
                      }}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};


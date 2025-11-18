/**
 * 空间详情页面
 * 显示空间的完整信息
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, CheckCircle, Calendar, Clock, Phone, Mail, Edit, ArrowLeft } from 'lucide-react';
import { getSpaceById } from '../services/spaceService';
import { createBooking } from '../services/bookingService';
import type { OfficeSpace, CreateBookingData } from '../types';
import { SPACE_TYPE_LABELS, PRICING_MODEL_LABELS } from '../types';

export const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<OfficeSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<CreateBookingData>({
    space_id: parseInt(id || '0'),
    booking_date: '',
    start_time: '',
    end_time: '',
    expected_attendees: 1,
    purpose: '',
    contact_phone: '',
  });

  useEffect(() => {
    if (id) {
      loadSpace();
    }
  }, [id]);

  const loadSpace = async () => {
    try {
      setLoading(true);
      const data = await getSpaceById(parseInt(id || '0'));
      setSpace(data);
    } catch (error) {
      console.error('加载空间详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingData.booking_date || !bookingData.start_time || !bookingData.end_time) {
      alert('请填写完整的预约信息');
      return;
    }

    try {
      await createBooking(bookingData, 1); // TODO: 获取真实用户ID
      alert('预约申请已提交，等待审核');
      navigate('/admin/shared-office/my-bookings');
    } catch (error) {
      console.error('创建预约失败:', error);
      alert('创建预约失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">空间不存在或已被删除</p>
        <button
          onClick={() => navigate('/admin/shared-office/search')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回搜索
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      {/* 空间基本信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* 图片轮播 */}
        <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
          {space.photos && space.photos.length > 0 ? (
            <img
              src={space.photos[0]}
              alt={space.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MapPin className="w-16 h-16" />
            </div>
          )}
          {space.is_verified && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              已认证
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {space.name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                  {SPACE_TYPE_LABELS[space.space_type]}
                </span>
                {space.rating_count > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{space.average_rating.toFixed(1)}</span>
                    <span className="text-gray-500">({space.rating_count}条评价)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 地址 */}
          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{space.address}</p>
              <p className="text-sm">
                {space.city}
                {space.district && ` · ${space.district}`}
                {space.street && ` · ${space.street}`}
              </p>
            </div>
          </div>

          {/* 关键信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">可容纳人数</div>
              <div className="flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-white">
                <Users className="w-5 h-5" />
                {space.capacity} 人
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">面积</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {space.area ? `${space.area} ㎡` : '未知'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">价格</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {space.pricing_model === 'free' ? (
                  <span className="text-green-600">免费</span>
                ) : space.price ? (
                  <span>
                    ¥{space.price}
                    {space.pricing_model === 'hourly' && '/小时'}
                    {space.pricing_model === 'daily' && '/天'}
                    {space.pricing_model === 'per_use' && '/次'}
                  </span>
                ) : (
                  <span>{PRICING_MODEL_LABELS[space.pricing_model]}</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">预约次数</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {space.booking_count} 次
              </div>
            </div>
          </div>

          {/* 描述 */}
          {space.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">空间描述</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {space.description}
              </p>
            </div>
          )}

          {/* 设施 */}
          {space.facilities && space.facilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">设施清单</h3>
              <div className="flex flex-wrap gap-2">
                {space.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 使用规则 */}
          {space.rules && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">使用规则</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{space.rules}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {showBookingForm ? '取消预约' : '申请预约'}
            </button>
          </div>
        </div>
      </div>

      {/* 预约表单 */}
      {showBookingForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">预约信息</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  使用日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={bookingData.booking_date}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, booking_date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  预计人数
                </label>
                <input
                  type="number"
                  min="1"
                  max={space.capacity}
                  value={bookingData.expected_attendees}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      expected_attendees: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={bookingData.start_time}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, start_time: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={bookingData.end_time}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, end_time: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                使用用途
              </label>
              <textarea
                value={bookingData.purpose}
                onChange={(e) =>
                  setBookingData((prev) => ({ ...prev, purpose: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="请描述您的使用用途..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                联系电话
              </label>
              <input
                type="tel"
                value={bookingData.contact_phone}
                onChange={(e) =>
                  setBookingData((prev) => ({ ...prev, contact_phone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="请输入您的联系电话"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleBooking}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                提交预约申请
              </button>
              <button
                onClick={() => setShowBookingForm(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


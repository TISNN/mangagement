/**
 * 需求详情页面
 * 显示需求信息和匹配推荐
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import { getRequestById } from '../services/requestService';
import { getMatchRecommendations, calculateMatchScore } from '../services/matchService';
import { SpaceCard } from '../components/SpaceCard';
import type { SpaceRequest, MatchResult, OfficeSpace } from '../types';
import { SPACE_TYPE_LABELS, REQUEST_STATUS_LABELS, URGENCY_LABELS } from '../types';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<SpaceRequest | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const requestData = await getRequestById(parseInt(id || '0'));
      setRequest(requestData);
      
      // 如果需求已发布，加载匹配推荐
      if (requestData && requestData.status === 'published') {
        loadMatches();
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    if (!id) return;
    try {
      setLoadingMatches(true);
      const matchResults = await getMatchRecommendations(parseInt(id));
      setMatches(matchResults);
    } catch (error) {
      console.error('加载匹配推荐失败:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">需求不存在或已被删除</p>
        <button
          onClick={() => navigate('/admin/shared-office/my-requests')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回
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

      {/* 需求信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {request.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                {SPACE_TYPE_LABELS[request.request_type]}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                {REQUEST_STATUS_LABELS[request.status]}
              </span>
              {request.urgency !== 'normal' && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded text-sm">
                  {URGENCY_LABELS[request.urgency]}
                </span>
              )}
            </div>
          </div>
          {request.status !== 'completed' && request.status !== 'cancelled' && (
            <button
              onClick={() => navigate(`/admin/shared-office/my-requests/${request.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              编辑
            </button>
          )}
        </div>

        {/* 需求详情 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">目标位置</span>
            </div>
            <p className="text-gray-900 dark:text-white">
              {request.target_cities.join('、')}
              {request.target_districts && request.target_districts.length > 0 && (
                <span className="text-gray-500"> · {request.target_districts.join('、')}</span>
              )}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">使用时间</span>
            </div>
            <p className="text-gray-900 dark:text-white">
              {request.use_date} {request.use_time_start} - {request.use_time_end}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">预计人数</span>
            </div>
            <p className="text-gray-900 dark:text-white">{request.expected_capacity} 人</p>
          </div>

          {request.duration_hours && (
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">预计时长</span>
              </div>
              <p className="text-gray-900 dark:text-white">{request.duration_hours} 小时</p>
            </div>
          )}
        </div>

        {request.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">需求描述</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {request.description}
            </p>
          </div>
        )}

        {request.required_facilities && request.required_facilities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">必需设施</h3>
            <div className="flex flex-wrap gap-2">
              {request.required_facilities.map((facility, index) => (
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
      </div>

      {/* 匹配推荐 */}
      {request.status === 'published' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              匹配推荐
            </h2>
            <button
              onClick={loadMatches}
              disabled={loadingMatches}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {loadingMatches ? '匹配中...' : '重新匹配'}
            </button>
          </div>

          {loadingMatches ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">正在匹配...</div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">暂无匹配的空间</p>
              <button
                onClick={() => navigate('/admin/shared-office/search')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                去搜索空间
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.space_id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm font-medium">
                          匹配度 {match.match_score}%
                        </span>
                        {match.space?.is_verified && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                            已认证
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {match.space?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {match.space?.city}
                        {match.space?.district && ` · ${match.space.district}`}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/shared-office/spaces/${match.space_id}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      查看详情
                    </button>
                  </div>

                  {/* 匹配详情 */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <div>
                      <span className="font-medium">位置:</span> {match.location_score}%
                    </div>
                    <div>
                      <span className="font-medium">时间:</span> {match.time_score}%
                    </div>
                    <div>
                      <span className="font-medium">类型:</span> {match.type_score}%
                    </div>
                    <div>
                      <span className="font-medium">容量:</span> {match.capacity_score}%
                    </div>
                    <div>
                      <span className="font-medium">价格:</span> {match.price_score}%
                    </div>
                    <div>
                      <span className="font-medium">设施:</span> {match.facility_score}%
                    </div>
                  </div>

                  {match.space && (
                    <div className="flex items-center gap-4 text-sm">
                      {match.space.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{match.space.average_rating.toFixed(1)}</span>
                          <span className="text-gray-500">({match.space.rating_count}条评价)</span>
                        </div>
                      )}
                      <span className="text-gray-500">
                        已预约 {match.space.booking_count} 次
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


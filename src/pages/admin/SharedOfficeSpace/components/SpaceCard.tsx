/**
 * 空间卡片组件
 * 用于展示空间信息的可复用组件
 */

import React from 'react';
import { MapPin, Users, Star, CheckCircle } from 'lucide-react';
import type { OfficeSpace } from '../types';
import { SPACE_TYPE_LABELS, PRICING_MODEL_LABELS } from '../types';

interface SpaceCardProps {
  space: OfficeSpace;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onManage?: () => void;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  onClick,
  showActions = false,
  onEdit,
  onManage,
}) => {
  const mainPhoto = space.photos && space.photos.length > 0 ? space.photos[0] : null;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* 图片区域 */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {mainPhoto ? (
          <img
            src={mainPhoto}
            alt={space.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        {/* 认证标识 */}
        {space.is_verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            已认证
          </div>
        )}
        {/* 状态标签 */}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {SPACE_TYPE_LABELS[space.space_type]}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {space.name}
        </h3>

        {/* 地址 */}
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {space.city}
            {space.district && ` · ${space.district}`}
            {space.street && ` · ${space.street}`}
          </span>
        </div>

        {/* 容量和价格 */}
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>可容纳 {space.capacity} 人</span>
          </div>
          <div className="text-gray-900 dark:text-white font-medium">
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

        {/* 评分 */}
        {space.rating_count > 0 && (
          <div className="flex items-center gap-1 text-sm mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-900 dark:text-white font-medium">
              {space.average_rating.toFixed(1)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ({space.rating_count}条评价)
            </span>
          </div>
        )}

        {/* 操作按钮 */}
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                编辑
              </button>
            )}
            {onManage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onManage();
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                管理
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


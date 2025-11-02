// 导师卡片组件

import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  User 
} from 'lucide-react';
import type { Mentor } from '../types/mentor.types';

interface MentorCardProps {
  mentor: Mentor;
  onClick?: (mentor: Mentor) => void;
}

/**
 * MentorCard - 展示单个导师信息的卡片组件
 */
export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  // 默认头像 - 使用 DiceBear API 根据导师名字生成
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`;

  return (
    <div
      onClick={() => onClick?.(mentor)}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 
        p-6 transition-all
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600' : ''}
      `}
    >
      {/* 头部:头像和基本信息 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 头像 */}
        <img
          src={mentor.avatarUrl || defaultAvatar}
          alt={mentor.name}
          className="h-16 w-16 rounded-xl object-cover"
        />
        
        {/* 基本信息 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
            {mentor.name}
          </h3>
          
          {/* 专业级别 */}
          {mentor.expertiseLevel && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {mentor.expertiseLevel}
            </span>
          )}
          
          {/* 活跃状态 */}
          {mentor.isActive && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              在职
            </span>
          )}
        </div>
      </div>

      {/* 个人简介 */}
      {mentor.bio && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {mentor.bio}
        </p>
      )}

      {/* 详细信息网格 */}
      <div className="space-y-2">
        {/* 地理位置 */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span>{mentor.location}</span>
        </div>

        {/* 服务范围 */}
        {mentor.serviceScope.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {mentor.serviceScope.map((scope, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 专业方向 */}
        {mentor.specializations.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <GraduationCap className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {mentor.specializations.slice(0, 3).map((spec, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  {spec}
                  {index < Math.min(mentor.specializations.length - 1, 2) && ', '}
                </span>
              ))}
              {mentor.specializations.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  +{mentor.specializations.length - 3} 更多
                </span>
              )}
            </div>
          </div>
        )}

        {/* 时薪 */}
        {mentor.hourlyRate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>¥{mentor.hourlyRate}/小时</span>
          </div>
        )}
      </div>
    </div>
  );
};


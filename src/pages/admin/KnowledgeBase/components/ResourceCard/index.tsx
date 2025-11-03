/**
 * 资源卡片组件
 * 用于在网格视图中显示单个知识库资源
 */

import React from 'react';
import { 
  Bookmark, 
  Share, 
  MoreVertical, 
  Clock, 
  Users, 
  Download, 
  ArrowUpRight,
  Video
} from 'lucide-react';
import { UIKnowledgeResource } from '../../types/knowledge.types';
import { RESOURCE_TYPE_CONFIG } from '../../utils/knowledgeConstants';
import { formatDate, formatNumber } from '../../utils/knowledgeMappers';

interface ResourceCardProps {
  resource: UIKnowledgeResource;
  onView: (id: number) => void;
  onBookmark: (id: number, isBookmarked: boolean) => void;
  onDownload?: (id: number, fileUrl?: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onView,
  onBookmark,
  onDownload
}) => {
  const typeConfig = RESOURCE_TYPE_CONFIG[resource.type];
  const ResourceTypeIcon = typeConfig.icon;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(resource.id, resource.isBookmarked);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(resource.id, resource.fileUrl);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onView(resource.id)}
    >
      {/* 缩略图 */}
      {resource.thumbnailUrl && (
        <div className="h-40 relative">
          <img 
            src={resource.thumbnailUrl} 
            alt={resource.title} 
            className="w-full h-full object-cover"
          />
          {resource.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
          {resource.isFeatured && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-medium">
              精选资源
            </div>
          )}
        </div>
      )}

      {/* 内容 */}
      <div className="p-5">
        {/* 类型标签和操作按钮 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${typeConfig.bgColor}`}>
              <ResourceTypeIcon className={`h-4 w-4 ${typeConfig.textColor}`} />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {typeConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleBookmarkClick}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" 
              title={resource.isBookmarked ? "取消收藏" : "收藏"}
            >
              <Bookmark className={`h-4 w-4 ${resource.isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400" 
              title="分享"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="h-4 w-4" />
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
              title="更多选项"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="font-bold text-lg mb-1 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
          {resource.title}
        </h3>

        {/* 分类和标签 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-medium">
            {resource.category}
          </span>
          {resource.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
          {resource.tags.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{resource.tags.length - 2}</span>
          )}
        </div>

        {/* 描述 */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {resource.description}
        </p>

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(resource.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{formatNumber(resource.views)} 次浏览</span>
            </div>
          </div>
          {resource.downloads > 0 && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{formatNumber(resource.downloads)} 次下载</span>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {resource.authorName}
          </div>
          {resource.fileUrl ? (
            <button 
              onClick={handleDownloadClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              下载
            </button>
          ) : (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <ArrowUpRight className="h-3 w-3" />
              查看
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


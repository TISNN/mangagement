/**
 * 资源卡片组件
 * 用于在网格视图中显示单个知识库资源
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bookmark, 
  Share, 
  MoreVertical, 
  Clock, 
  Users, 
  Download, 
  ArrowUpRight,
  Video,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Mail,
  Check,
  Edit,
  Trash2,
  Star,
  Copy
} from 'lucide-react';
import { UIKnowledgeResource } from '../../types/knowledge.types';
import { RESOURCE_TYPE_CONFIG } from '../../utils/knowledgeConstants';
import { formatDate, formatNumber } from '../../utils/knowledgeMappers';

interface ResourceCardProps {
  resource: UIKnowledgeResource;
  onView: (id: number) => void;
  onBookmark: (id: number, isBookmarked: boolean) => void;
  onDownload?: (id: number, fileUrl?: string) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleFeatured?: (id: number, isFeatured: boolean) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onView,
  onBookmark,
  onDownload,
  onEdit,
  onDelete,
  onToggleFeatured
}) => {
  const typeConfig = RESOURCE_TYPE_CONFIG[resource.type];
  const ResourceTypeIcon = typeConfig.icon;

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
    setShowMoreMenu(false);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreMenu(!showMoreMenu);
    setShowShareMenu(false);
  };

  // 分享功能
  const copyLink = () => {
    const url = `${window.location.origin}/admin/knowledge/detail/${resource.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const shareToTwitter = () => {
    const url = `${window.location.origin}/admin/knowledge/detail/${resource.id}`;
    const text = `推荐一个学习资源：${resource.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = `${window.location.origin}/admin/knowledge/detail/${resource.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareByEmail = () => {
    const url = `${window.location.origin}/admin/knowledge/detail/${resource.id}`;
    const subject = `分享资源：${resource.title}`;
    const body = `我想和你分享这个学习资源：\n\n${resource.title}\n${resource.description}\n\n查看详情：${url}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setShowShareMenu(false);
  };

  // 更多选项功能
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(resource.id);
    }
    setShowMoreMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!onDelete) {
      alert('删除功能未启用');
      return;
    }
    
    if (confirm('确定要删除这个资源吗？此操作无法撤销。')) {
      onDelete(resource.id);
    }
    setShowMoreMenu(false);
  };

  const handleToggleFeatured = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFeatured) {
      onToggleFeatured(resource.id, resource.isFeatured);
    }
    setShowMoreMenu(false);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onView(resource.id)}
    >
      {/* 缩略图 - 始终显示，如果没有上传则显示自动生成的默认封面图 */}
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
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            精选资源
          </div>
        )}
      </div>

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
            {/* 收藏按钮 */}
            <button 
              onClick={handleBookmarkClick}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
              title={resource.isBookmarked ? "取消收藏" : "收藏"}
            >
              <Bookmark className={`h-4 w-4 ${resource.isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
            </button>
            
            {/* 分享按钮和菜单 */}
            <div className="relative" ref={shareMenuRef}>
              <button 
                className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" 
                title="分享"
                onClick={handleShareClick}
              >
                <Share className="h-4 w-4" />
              </button>
              
              {/* 分享下拉菜单 */}
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyLink(); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">已复制链接</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>复制链接</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); shareToTwitter(); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <span>分享到 Twitter</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); shareToFacebook(); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <span>分享到 Facebook</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); shareByEmail(); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>邮件分享</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* 更多选项按钮和菜单 */}
            <div className="relative" ref={moreMenuRef}>
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" 
                title="更多选项"
                onClick={handleMoreClick}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {/* 更多选项下拉菜单 */}
              {showMoreMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[100] max-h-[400px] overflow-y-auto">
                  {/* 简化菜单 - 只保留最常用的选项 */}
                  
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                      <span>编辑</span>
                    </button>
                  )}
                  
                  {onToggleFeatured && (
                    <button
                      onClick={handleToggleFeatured}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Star className={`h-4 w-4 ${resource.isFeatured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      <span>{resource.isFeatured ? '取消精选' : '设为精选'}</span>
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); copyLink(); }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4 text-green-600" />
                    <span>复制链接</span>
                  </button>
                  
                  {/* 删除按钮 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>删除资源</span>
                  </button>
                </div>
              )}
            </div>
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

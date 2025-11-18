/**
 * 团队动态组件
 * 展示公告、系统通知和协作讨论
 */

import React, { useState } from 'react';
import { BellRing, Tag, MessageCircle, Trophy, MessageSquare, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { FeedItem } from '../types';
import { FEED_ITEMS } from '../constants';

interface TeamFeedProps {
  onSubscribe?: () => void;
  onComment?: (feedId: string) => void;
}

const TeamFeed: React.FC<TeamFeedProps> = ({ onSubscribe, onComment }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedFeeds, setExpandedFeeds] = useState<Set<string>>(new Set(['feed-1']));

  const toggleFeed = (feedId: string) => {
    const newExpanded = new Set(expandedFeeds);
    if (newExpanded.has(feedId)) {
      newExpanded.delete(feedId);
    } else {
      newExpanded.add(feedId);
    }
    setExpandedFeeds(newExpanded);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">团队动态</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">整合公告、系统提醒与协作讨论，支持评论互动与附件查看</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={onSubscribe}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <BellRing className="h-3.5 w-3.5" /> 订阅提醒
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {FEED_ITEMS.map((item) => {
            const isExpandedItem = expandedFeeds.has(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt={item.author} className="h-10 w-10 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {item.author} · {item.time} · {item.visibility === 'org' ? '全公司可见' : '团队可见'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        <Tag className="h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {isExpandedItem && (
                  <>
                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.content}</p>
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                        {item.attachments.map((attachment) => (
                          <span
                            key={attachment}
                            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2 py-0.5 dark:border-indigo-500/30 dark:bg-indigo-900/20"
                          >
                            <FileText className="h-3 w-3" /> {attachment}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> 评论 {item.comments ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5" /> 点赞 {item.likes ?? 0}
                  </span>
                  <button
                    onClick={() => {
                      toggleFeed(item.id);
                      if (!isExpandedItem) {
                        onComment?.(item.id);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> {isExpandedItem ? '收起' : '展开'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamFeed;


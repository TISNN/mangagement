/**
 * 知识库筛选 Hook
 * 管理筛选条件和资源过滤逻辑
 */

import { useState, useMemo, useCallback } from 'react';
import { UIKnowledgeResource, KnowledgeFilters } from '../types/knowledge.types';
import { DEFAULT_FILTERS } from '../utils/knowledgeConstants';

export function useKnowledgeFilters(resources: UIKnowledgeResource[]) {
  const [filters, setFilters] = useState<KnowledgeFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'bookmarked' | 'recent'>('all');

  // 更新单个筛选条件
  const updateFilter = useCallback((key: keyof KnowledgeFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActiveTab('all');
  }, []);

  // 筛选后的资源
  const filteredResources = useMemo(() => {
    let result = [...resources];

    // 1. Tab 筛选
    if (activeTab === 'featured') {
      result = result.filter(r => r.isFeatured);
    } else if (activeTab === 'bookmarked') {
      result = result.filter(r => r.isBookmarked);
    } else if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(r => new Date(r.updatedAt) >= thirtyDaysAgo);
    }

    // 2. 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 3. 分类筛选
    if (filters.category && filters.category !== '全部分类') {
      result = result.filter(r => r.category === filters.category);
    }

    // 4. 类型筛选
    if (filters.type && filters.type !== 'all') {
      result = result.filter(r => r.type === filters.type);
    }

    // 5. 作者筛选
    if (filters.author) {
      result = result.filter(r => r.authorName === filters.author);
    }

    // 6. 标签筛选
    if (filters.tag) {
      result = result.filter(r => r.tags.includes(filters.tag));
    }

    // 7. 时间范围筛选
    if (filters.dateRange && filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange);
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);
      result = result.filter(r => new Date(r.createdAt) >= dateThreshold);
    }

    // 8. 排序
    switch (filters.sortBy) {
      case 'date_desc':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'views_desc':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'downloads_desc':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        break;
      case 'name_desc':
        result.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'));
        break;
    }

    return result;
  }, [resources, filters, activeTab]);

  // 获取所有唯一的分类
  const categories = useMemo(() => {
    const uniqueCategories = new Set(resources.map(r => r.category));
    return ['全部分类', ...Array.from(uniqueCategories)];
  }, [resources]);

  // 获取所有唯一的作者
  const authors = useMemo(() => {
    const uniqueAuthors = new Set(resources.map(r => r.authorName));
    return ['全部作者', ...Array.from(uniqueAuthors)];
  }, [resources]);

  // 获取所有唯一的标签
  const tags = useMemo(() => {
    const allTags = resources.flatMap(r => r.tags);
    const uniqueTags = new Set(allTags);
    return Array.from(uniqueTags);
  }, [resources]);

  return {
    filters,
    activeTab,
    filteredResources,
    categories,
    authors,
    tags,
    updateFilter,
    setActiveTab,
    resetFilters
  };
}


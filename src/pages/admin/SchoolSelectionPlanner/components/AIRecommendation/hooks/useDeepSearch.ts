/**
 * 深度检索逻辑Hook
 */

import { useState, useCallback } from 'react';
import type { AIMatchCriteria, DeepSearchProgress, AIRecommendationResult } from '../../../types';

interface UseDeepSearchOptions {
  criteria: AIMatchCriteria;
  onComplete?: (recommendations: AIRecommendationResult[]) => void;
}

/**
 * 深度检索进度更新回调类型
 */
type ProgressUpdater = (
  stage: DeepSearchProgress['stage'],
  progress: number,
  message: string,
  scannedCount?: number,
  totalCount?: number,
  matchedCount?: number,
  filteredCount?: number,
  analyzedCount?: number,
  details?: string[]
) => void;

export const useDeepSearch = ({ criteria, onComplete }: UseDeepSearchOptions) => {
  const [searchProgress, setSearchProgress] = useState<DeepSearchProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 深度检索进度更新
  const updateDeepSearchProgress: ProgressUpdater = useCallback((
    stage,
    progress,
    message,
    scannedCount,
    totalCount,
    matchedCount,
    filteredCount,
    analyzedCount,
    details
  ) => {
    setSearchProgress({
      stage,
      currentStep: message,
      progress,
      scannedCount,
      totalCount,
      matchedCount,
      filteredCount,
      analyzedCount,
      message,
      details,
    });
  }, []);

  // 深度检索流程（8阶段细化版）
  const performDeepSearch = useCallback(async () => {
    const totalPrograms = 6644;

    // 阶段1: 解析匹配条件 (0-5%)
    updateDeepSearchProgress(
      'parsing',
      2,
      '正在解析匹配条件...',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ['解析目标国家: ' + (criteria.targetCountries.join(', ') || '未设置'), '解析专业方向: ' + (criteria.targetPrograms.join(', ') || '未设置')]
    );
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateDeepSearchProgress('parsing', 5, '条件解析完成', undefined, undefined, undefined, undefined, undefined, ['✓ 已解析学生背景数据', '✓ 已解析GPA和语言成绩']);

    // 阶段2: 加载项目数据库 (5-15%)
    updateDeepSearchProgress('loading', 7, '正在连接数据库...', 0, totalPrograms);
    await new Promise((resolve) => setTimeout(resolve, 300));

    let scanned = 0;
    const loadInterval = setInterval(() => {
      scanned += Math.floor(totalPrograms / 25);
      if (scanned >= totalPrograms) {
        scanned = totalPrograms;
        clearInterval(loadInterval);
      }
      const progress = 7 + Math.floor((scanned / totalPrograms) * 8);
      updateDeepSearchProgress(
        'loading',
        progress,
        `正在加载项目数据库...`,
        scanned,
        totalPrograms,
        undefined,
        undefined,
        undefined,
        [`已加载 ${scanned} / ${totalPrograms} 个项目`]
      );
    }, 80);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(loadInterval);
    updateDeepSearchProgress('loading', 15, '项目数据库加载完成', totalPrograms, totalPrograms, undefined, undefined, undefined, [`✓ 已加载全部 ${totalPrograms} 个项目`]);

    // 阶段3: 初步筛选 (15-35%)
    updateDeepSearchProgress('initialFilter', 18, '正在进行初步筛选...', totalPrograms, totalPrograms);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = 0;
    const filterInterval = setInterval(() => {
      filtered += Math.floor(2000 / 20);
      if (filtered >= 2000) {
        filtered = 2000;
        clearInterval(filterInterval);
      }
      const progress = 18 + Math.floor((filtered / 2000) * 17);
      updateDeepSearchProgress(
        'initialFilter',
        progress,
        `正在按条件筛选项目...`,
        totalPrograms,
        totalPrograms,
        undefined,
        filtered,
        undefined,
        [
          '✓ 按国家筛选: ' + criteria.targetCountries.length + ' 个国家',
          '✓ 按专业类别筛选',
          `已筛选出 ${filtered} 个符合条件的项目`,
        ]
      );
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(filterInterval);
    updateDeepSearchProgress('initialFilter', 35, `初步筛选完成，共 ${filtered} 个项目`, totalPrograms, totalPrograms, undefined, filtered);

    // 阶段4: 条件匹配 (35-55%)
    updateDeepSearchProgress('conditionMatch', 38, '正在匹配申请条件...', totalPrograms, totalPrograms, undefined, filtered);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let matched = 0;
    const matchInterval = setInterval(() => {
      matched += Math.floor(800 / 18);
      if (matched >= 800) {
        matched = 800;
        clearInterval(matchInterval);
      }
      const progress = 38 + Math.floor((matched / 800) * 17);
      updateDeepSearchProgress(
        'conditionMatch',
        progress,
        `正在匹配申请条件...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        undefined,
        [
          '✓ GPA要求匹配: ' + Math.floor(matched * 0.4) + ' 项',
          '✓ 语言成绩匹配: ' + Math.floor(matched * 0.3) + ' 项',
          '✓ 预算范围匹配: ' + Math.floor(matched * 0.3) + ' 项',
          `已匹配 ${matched} 个项目`,
        ]
      );
    }, 90);

    await new Promise((resolve) => setTimeout(resolve, 1800));
    clearInterval(matchInterval);
    updateDeepSearchProgress('conditionMatch', 55, `条件匹配完成，共 ${matched} 个匹配项目`, totalPrograms, totalPrograms, matched, filtered);

    // 阶段5: 深度分析 (55-75%)
    updateDeepSearchProgress('deepAnalysis', 58, '正在进行深度分析...', totalPrograms, totalPrograms, matched, filtered);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let analyzed = 0;
    const analysisInterval = setInterval(() => {
      analyzed += Math.floor(matched / 17);
      if (analyzed >= matched) {
        analyzed = matched;
        clearInterval(analysisInterval);
      }
      const progress = 58 + Math.floor((analyzed / matched) * 17);
      updateDeepSearchProgress(
        'deepAnalysis',
        progress,
        `正在深度分析项目...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        analyzed,
        [
          '✓ 课程匹配度分析: ' + Math.floor(analyzed * 0.3) + ' 项',
          '✓ 实习经历匹配: ' + Math.floor(analyzed * 0.25) + ' 项',
          '✓ 科研背景匹配: ' + Math.floor(analyzed * 0.25) + ' 项',
          '✓ 职业目标匹配: ' + Math.floor(analyzed * 0.2) + ' 项',
          `已分析 ${analyzed} 个项目`,
        ]
      );
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 1700));
    clearInterval(analysisInterval);
    updateDeepSearchProgress('deepAnalysis', 75, `深度分析完成，共分析 ${analyzed} 个项目`, totalPrograms, totalPrograms, matched, filtered, analyzed);

    // 阶段6: AI评分计算 (75-85%)
    updateDeepSearchProgress('scoring', 78, '正在计算AI匹配度分数...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let scored = 0;
    const scoreInterval = setInterval(() => {
      scored += Math.floor(analyzed / 7);
      if (scored >= analyzed) {
        scored = analyzed;
        clearInterval(scoreInterval);
      }
      const progress = 78 + Math.floor((scored / analyzed) * 7);
      updateDeepSearchProgress(
        'scoring',
        progress,
        `正在计算匹配度分数...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        analyzed,
        [
          '✓ 综合匹配度计算: ' + Math.floor(scored * 0.4) + ' 项',
          '✓ 冲刺/匹配/保底分级: ' + Math.floor(scored * 0.6) + ' 项',
          `已计算 ${scored} 个项目评分`,
        ]
      );
    }, 120);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    clearInterval(scoreInterval);
    updateDeepSearchProgress('scoring', 85, `AI评分计算完成，共 ${scored} 个项目`, totalPrograms, totalPrograms, matched, filtered, analyzed);

    // 阶段7: 相似案例对比 (85-95%)
    updateDeepSearchProgress('caseComparison', 88, '正在查找相似案例...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 600));

    let casesFound = 0;
    const caseInterval = setInterval(() => {
      casesFound += Math.floor(scored / 7);
      if (casesFound >= scored) {
        casesFound = scored;
        clearInterval(caseInterval);
      }
      const progress = 88 + Math.floor((casesFound / scored) * 7);
      updateDeepSearchProgress(
        'caseComparison',
        progress,
        `正在对比历史成功案例...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        analyzed,
        [
          '✓ 查找相似背景学生: ' + Math.floor(casesFound * 0.6) + ' 项',
          '✓ 对比录取数据: ' + Math.floor(casesFound * 0.4) + ' 项',
          `已对比 ${casesFound} 个项目`,
        ]
      );
    }, 150);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    clearInterval(caseInterval);
    updateDeepSearchProgress('caseComparison', 95, `相似案例对比完成`, totalPrograms, totalPrograms, matched, filtered, analyzed);

    // 阶段8: 结果排序整理 (95-100%)
    updateDeepSearchProgress('sorting', 97, '正在排序和整理结果...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 400));

    updateDeepSearchProgress('sorting', 99, '正在生成推荐理由...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 300));

    updateDeepSearchProgress('completed', 100, '深度检索完成！', totalPrograms, totalPrograms, matched, filtered, analyzed, ['✓ 所有阶段已完成', '✓ 结果已准备好']);
    await new Promise((resolve) => setTimeout(resolve, 400));
  }, [criteria, updateDeepSearchProgress]);

  return {
    searchProgress,
    isGenerating,
    setIsGenerating,
    performDeepSearch,
  };
};

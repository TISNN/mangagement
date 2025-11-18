/**
 * 报表与导出组件
 * 展示分群历史、活动归因和数据导出
 */

import React, { useState } from 'react';
import { Download, Share2, Mail, Users, FileText, Calendar } from 'lucide-react';
import { REPORT_ITEMS } from '../constants';

interface ReportsAndExportProps {
  onExport?: () => void;
  onShare?: (reportId: string) => void;
}

const ReportsAndExport: React.FC<ReportsAndExportProps> = ({ onExport, onShare }) => {
  const [selectedType, setSelectedType] = useState<'all' | 'history' | 'attribution' | 'export'>('all');

  const filteredReports =
    selectedType === 'all'
      ? REPORT_ITEMS
      : REPORT_ITEMS.filter((report) => report.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'history':
        return <Calendar className="h-4 w-4" />;
      case 'attribution':
        return <FileText className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'history':
        return '分群历史';
      case 'attribution':
        return '活动归因';
      case 'export':
        return '数据导出';
      default:
        return '全部';
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">报表与导出</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">追踪分群历史与活动效果，支持数据同步</p>
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-sky-200 hover:text-sky-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
        >
          <Download className="h-3.5 w-3.5" /> 导出报表
        </button>
      </div>

      {/* 类型筛选 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(['all', 'history', 'attribution', 'export'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedType === type
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {getTypeIcon(type)}
            {getTypeLabel(type)}
          </button>
        ))}
      </div>

      {/* 报表列表 */}
      <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
        {filteredReports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/40">
            <FileText className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">暂无 {getTypeLabel(selectedType)} 报表</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {getTypeIcon(report.type)}
                  <span className="font-semibold text-gray-900 dark:text-white">{report.title}</span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">更新：{report.updatedAt}</span>
              </div>
              <p className="mt-2 leading-5">{report.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {report.owner}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> 自动推送
                </span>
                <button
                  onClick={() => onShare?.(report.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-sky-200 hover:text-sky-600 dark:border-gray-600 dark:hover:border-sky-500 dark:hover:text-sky-300"
                >
                  <Share2 className="h-3.5 w-3.5" /> 分享
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsAndExport;


/**
 * 分群引擎组件
 * 展示分群条件构建器和实时统计
 */

import React, { useState } from 'react';
import { SlidersHorizontal, Eye, Plus, X } from 'lucide-react';
import { SEGMENT_CONDITIONS, SEGMENT_TEMPLATES } from '../constants';

interface SegmentationBuilderProps {
  onSaveTemplate?: () => void;
  onPreview?: () => void;
  onCreateSegment?: () => void;
}

const SegmentationBuilder: React.FC<SegmentationBuilderProps> = ({
  onSaveTemplate,
  onPreview,
  onCreateSegment,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="space-y-4">
      {/* 分群模板选择 */}
      {showTemplates && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">分群模板</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">选择预设模板快速创建分群</p>
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300"
            >
              <X className="h-3.5 w-3.5" /> 关闭
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {SEGMENT_TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                    : 'border-gray-200 bg-gray-50 hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  {template.isDynamic && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                      动态
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{template.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{template.population}</span>
                  <span
                    className={
                      template.growth.startsWith('+')
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-rose-500 dark:text-rose-300'
                    }
                  >
                    {template.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {selectedTemplate && (
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowTemplates(false);
                  setSelectedTemplate(null);
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onCreateSegment?.();
                  setShowTemplates(false);
                  setSelectedTemplate(null);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                使用此模板
              </button>
            </div>
          )}
        </div>
      )}

      {/* 分群引擎 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">分群引擎</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">拖拽式条件构建 + 实时结果预览</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <Plus className="h-3.5 w-3.5" /> 选择模板
            </button>
            <button
              onClick={onSaveTemplate}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> 保存为模板
            </button>
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <Eye className="h-3.5 w-3.5" /> 预览样本
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-3">
            {SEGMENT_CONDITIONS.map((condition, index) => (
              <div
                key={condition.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
              >
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                  <span>条件 {index + 1}</span>
                  {condition.relation && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {condition.relation}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {condition.type}
                  </span>
                  <span>{condition.field}</span>
                  <span className="text-gray-400">{condition.operator}</span>
                  <span className="rounded bg-white px-2 py-0.5 text-xs text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-200">
                    {condition.value}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={onCreateSegment}
              className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
            >
              <Plus className="mx-auto h-5 w-5" />
              <span className="mt-2 block">添加条件</span>
            </button>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
            <div className="font-semibold">实时统计</div>
            <div className="mt-3 grid gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span>匹配客户数</span>
                <span className="text-lg font-semibold">128</span>
              </div>
              <div className="flex items-center justify-between">
                <span>占 CRM 总客户</span>
                <span className="text-base font-semibold">3.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>流失风险占比</span>
                <span className="text-base font-semibold">6%</span>
              </div>
              <div className="mt-3 rounded-lg border border-white/60 bg-white/80 p-3 text-xs text-indigo-600 shadow-sm dark:border-indigo-200/40 dark:bg-indigo-900/40 dark:text-indigo-200">
                <div className="font-semibold">AI 提示</div>
                <p className="mt-1 leading-5">
                  最近 30 天新增 24 人，建议同步营销自动化，安排续约顾问提前介入，并关注 6 位高风险客户的投诉处理进度。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentationBuilder;


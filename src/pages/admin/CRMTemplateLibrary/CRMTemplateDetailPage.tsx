import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, NotebookPen, Star, Users, Clock, LayoutList, Sparkles, AlertCircle } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { TEMPLATE_LIBRARY } from './data';

const CRMTemplateDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();

  const template = useMemo(() => TEMPLATE_LIBRARY.find((item) => item.id === templateId), [templateId]);

  const handleCopyPrompt = async () => {
    if (!template?.aiPrompt) return;
    try {
      await navigator.clipboard.writeText(template.aiPrompt);
    } catch (error) {
      console.error('复制提示词失败', error);
    }
  };

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
        <AlertCircle className="h-10 w-10 text-amber-500" />
        <p>未找到对应话术模板，请返回模板库重新选择。</p>
        <Button onClick={() => navigate('/admin/crm-template-library')} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回模板库
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
            <NotebookPen className="h-3.5 w-3.5" />
            {template.channel} · {template.stage}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{template.title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">{template.scenario}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/crm-template-library')}
            className="gap-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回模板库
          </Button>
          <Button onClick={handleCopyPrompt} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Copy className="h-4 w-4" />
            复制 AI 提示词
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">模板概览</h2>
          <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <li className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
              <Users className="h-3.5 w-3.5 text-blue-500" /> 负责人：{template.owner}
            </li>
            <li className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
              <Clock className="h-3.5 w-3.5 text-emerald-500" /> 最新更新：{template.lastUpdated}
            </li>
            <li className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
              <Star className="h-3.5 w-3.5 text-amber-500" /> 评分：{template.rating}
            </li>
            <li className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
              <LayoutList className="h-3.5 w-3.5 text-indigo-500" /> 使用次数：{template.usage}
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">行动提示</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{template.nextAction}</p>
          <div className="mt-4 space-y-2">
            {template.highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
              >
                <Sparkles className="h-3 w-3" /> {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">执行脚本</h2>
        <div className="mt-4 space-y-4">
          {template.scriptSections.map((section) => (
            <div key={section.title} className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">AI 辅助提示词</h2>
          <Button size="sm" variant="outline" onClick={handleCopyPrompt} className="gap-2">
            <Copy className="h-3.5 w-3.5" /> 复制
          </Button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900/90 p-4 text-xs leading-6 text-gray-100 shadow-inner">{template.aiPrompt}</pre>
      </div>
    </div>
  );
};

export default CRMTemplateDetailPage;


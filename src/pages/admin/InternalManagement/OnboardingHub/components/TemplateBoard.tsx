import { ClipboardCheck, Layers, RefreshCw } from 'lucide-react';

import type { ProcessTemplate } from '../data';

interface TemplateBoardProps {
  templates: ProcessTemplate[];
}

const STATUS_STYLE: Record<ProcessTemplate['status'], string> = {
  启用: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
  草稿: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  停用: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300',
};

export const TemplateBoard: React.FC<TemplateBoardProps> = ({ templates }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">流程模板管理</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            按岗位与地点维护入离职模板，确保任务与责任人清晰，支持版本追踪。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[TemplateBoard] 新建流程模板')}
          >
            新建模板
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[TemplateBoard] 导出模板')}
          >
            导出
          </button>
        </div>
      </header>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {templates.map((template) => (
          <div key={template.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.4fr,1fr,1fr]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[template.status]}`}>
                  {template.status}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                  {template.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  适用岗位：{template.applicableRoles.join(' / ')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  更新于 {template.lastUpdated}
                </span>
                <span>版本 {template.version}</span>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-gray-50/80 p-3 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
              <p className="text-gray-400 dark:text-gray-500">流程步骤</p>
              <ul className="space-y-2">
                {template.steps.map((step) => (
                  <li key={step.id} className="flex items-start gap-2">
                    <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{step.title}</p>
                      <p>{step.ownerRole}</p>
                      <p className="text-gray-400 dark:text-gray-500">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-gray-400 dark:text-gray-500">操作</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => console.info('[TemplateBoard] 预览模板', { templateId: template.id })}
                >
                  预览
                </button>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => console.info('[TemplateBoard] 克隆模板', { templateId: template.id })}
                >
                  克隆
                </button>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => console.info('[TemplateBoard] 配置提醒', { templateId: template.id })}
                >
                  配置提醒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



import { ShieldCheck, ShieldHalf, Users } from 'lucide-react';

import type { RoleTemplate } from '../../types';

interface RoleTemplateGridProps {
  templates: RoleTemplate[];
  onPreview?: (roleId: string) => void;
}

export const RoleTemplateGrid: React.FC<RoleTemplateGridProps> = ({ templates, onPreview }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {templates.map((template) => (
        <div
          key={template.id}
          className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                {template.critical ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-900/40 dark:text-red-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    高敏
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                    <ShieldHalf className="h-3.5 w-3.5" />
                    标准
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onPreview?.(template.id)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            >
              查看绑定成员
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800/50">
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              {template.memberCount} 人
            </span>
            <span className="rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800/50">
              最近更新：{template.lastUpdated}
            </span>
            <span className="rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800/50">
              负责人：{template.owners.join('、')}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
            <p className="font-medium text-gray-900 dark:text-white">权限范围</p>
            <ul className="mt-2 grid gap-1 md:grid-cols-2">
              {template.permissions.map((permission) => (
                <li key={permission} className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};


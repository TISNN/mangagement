import { FormSnapshot } from '../types';
import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface FormAssistantPanelProps {
  forms: FormSnapshot[];
}

export const FormAssistantPanel = ({ forms }: FormAssistantPanelProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, id: string) => {
    if (!value || value === '未填写') return;
    await navigator.clipboard.writeText(value);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 1200);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">网申助手</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">账号、问答、Essay 草稿一键复制</p>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">共 {forms.length} 条</span>
      </div>

      <div className="mt-4 space-y-4">
        {forms.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
            暂无网申信息
          </div>
        )}

        {forms.map((form) => (
          <div
            key={form.id}
            className="rounded-2xl border border-slate-100 px-4 py-3 dark:border-slate-800"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{form.schoolName}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{form.programName}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span>{form.status}</span>
                {form.portalLink && (
                  <a
                    href={form.portalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                  >
                    Portal
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {form.fields.map((field) => (
                <div key={field.id} className="rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/60">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{field.label}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {field.value}
                    </p>
                    {field.copyable && (
                      <button
                        onClick={() => handleCopy(field.value, field.id)}
                        className="flex items-center gap-1 text-xs text-blue-500"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{copiedField === field.id ? '已复制' : '复制'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


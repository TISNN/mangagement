import { Download, FileText, Shield } from 'lucide-react';

import type { DocumentItem } from '../data';

interface DocumentCenterProps {
  documents: DocumentItem[];
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ documents }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">资料与签署管理</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            集中管理劳动合同、Offer、离职协议等关键文件，记录签署进度。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[DocumentCenter] 上传文件')}
          >
            上传
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[DocumentCenter] 触发电子签署')}
          >
            发起电子签署
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">员工</th>
              <th className="px-4 py-3 text-left font-medium">文件类型</th>
              <th className="px-4 py-3 text-left font-medium">文件名</th>
              <th className="px-4 py-3 text-left font-medium">签署状态</th>
              <th className="px-4 py-3 text-left font-medium">责任人</th>
              <th className="px-4 py-3 text-left font-medium">备注</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {documents.map((item) => (
              <tr key={item.id} className="text-gray-600 dark:text-gray-300">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.employeeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    {item.documentType}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-blue-600 underline-offset-2 hover:underline dark:text-blue-200">
                  {item.fileName}
                </td>
                <td className="px-4 py-3 text-xs">
                  {item.signed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                      已签署 {item.signedAt}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-600 dark:bg-amber-900/30 dark:text-amber-200">
                      待签署
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{item.owner}</td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{item.notes ?? '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                      onClick={() => window.open(item.fileUrl, '_blank')}
                    >
                      <Download className="h-3.5 w-3.5" />
                      下载
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                      onClick={() => console.info('[DocumentCenter] 发送签署提醒', { documentId: item.id })}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      签署提醒
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



import React from 'react';
import { Sparkles, CheckCircle2, FolderOpen } from 'lucide-react';
import { SERVICE_PACKAGES } from './serviceCenterData';

const ServiceCenterCatalogPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">服务包目录</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            按照数字化建设、品牌营销、法律合规、礼品定制、运营支持进行分类管理，可快速生成报价并关联案例。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300">
            <Sparkles className="h-4 w-4" /> AI 生成组合套餐
          </button>
          <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300">
            <FolderOpen className="h-4 w-4" /> 管理案例库
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {SERVICE_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-2xl border bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-gray-900/40 ${pkg.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                {pkg.category}
              </span>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                查看案例
              </button>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">交付范围</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {pkg.outline.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{pkg.price}</span>
              <span className="text-gray-500 dark:text-gray-400">{pkg.duration}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                请求服务
              </button>
              <button className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200">
                生成报价
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCenterCatalogPage;

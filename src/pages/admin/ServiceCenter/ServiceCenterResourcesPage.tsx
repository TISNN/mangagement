import React from 'react';
import { Users } from 'lucide-react';
import { EXPERTS } from './serviceCenterData';

const ServiceCenterResourcesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">专家资源池</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            统一管理内部专家与外部合作伙伴的技能矩阵、排期与利用率，支持项目指派与协作。
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300">
          <Users className="h-4 w-4" /> 新增合作伙伴
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {EXPERTS.map((expert) => (
          <div key={expert.name} className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{expert.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{expert.specialty}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                {expert.availability}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">利用率</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-700/60">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
                    style={{ width: `${expert.utilization}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{expert.utilization}%</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">技能标签</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {expert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <button className="rounded-xl bg-gray-900 px-3 py-1.5 font-semibold text-white hover:bg-gray-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                指派任务
              </button>
              <button className="rounded-xl border border-gray-300 px-3 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200">
                查看档案
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
        <p className="font-semibold text-gray-900 dark:text-white">资源治理建议</p>
        <ul className="mt-3 space-y-2">
          <li>• 引入技能矩阵维度（编程语言、设计领域、法律专长）辅助匹配。</li>
          <li>• 支持排班同步与外部合作伙伴合同管理，规避资源冲突。</li>
          <li>• 将项目评分反馈至专家画像，形成绩效闭环。</li>
          <li>• 通过知识花园输出培训与 SOP，帮助新伙伴快速适配交付标准。</li>
        </ul>
      </div>
    </div>
  );
};

export default ServiceCenterResourcesPage;

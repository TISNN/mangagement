import React from 'react';
import { Download, MessageCircle } from 'lucide-react';
import { CLIENT_PORTAL_UPDATES, KNOWLEDGE_ITEMS } from './serviceCenterData';

const ServiceCenterClientPortalPage: React.FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">客户门户动态</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              合作机构实时查看项目进度、上传资产、完成审批与付款，关键操作会同步至服务中心。
            </p>
          </div>
          <Download className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="mt-5 space-y-4">
          {CLIENT_PORTAL_UPDATES.map((update) => (
            <div key={update.client} className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700/70">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{update.client}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{update.time}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{update.message}</p>
            </div>
          ))}
        </div>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
          <MessageCircle className="h-4 w-4" /> 进入客户门户
        </button>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">交互协作建议</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li>• 支持在线会议纪要与操作指引，减少多轮沟通成本。</li>
            <li>• 客户可上传素材、审批文件，自动触发任务更新与提醒。</li>
            <li>• 集成支付/发票模块，实现订金、阶段款与尾款的全流程闭环。</li>
            <li>• 与 CRM 联动，记录客户满意度与续约意向，触发自动跟进。</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">知识成果沉淀</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            交付成果可沉淀为 SOP 与模板，发布至知识花园或团队空间，驱动知识变现与复用。
          </p>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {KNOWLEDGE_ITEMS.map((item) => (
              <div key={item.title} className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700/70">
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterClientPortalPage;

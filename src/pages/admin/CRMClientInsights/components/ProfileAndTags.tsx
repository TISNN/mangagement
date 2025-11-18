/**
 * 客户画像与标签组件
 * 展示客户画像卡片、标签体系和管理中心
 */

import React, { useState } from 'react';
import { Users, Tag, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { TAG_CATEGORIES, SAMPLE_CUSTOMER_PROFILE, CUSTOMER_JOURNEY_STEPS } from '../constants';

interface ProfileAndTagsProps {
  onSwitchCustomer?: () => void;
  onManageTags?: () => void;
}

const ProfileAndTags: React.FC<ProfileAndTagsProps> = ({ onSwitchCustomer, onManageTags }) => {
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      {/* 客户画像卡片 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">客户画像</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">集中展示客户的核心背景与旅程节点</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsProfileExpanded(!isProfileExpanded)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              {isProfileExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isProfileExpanded ? '收起' : '展开'}
            </button>
            <button
              onClick={onSwitchCustomer}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <Users className="h-3.5 w-3.5" /> 切换客户
            </button>
          </div>
        </div>

        {isProfileExpanded && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
              <div className="text-sm font-semibold">
                {SAMPLE_CUSTOMER_PROFILE.name} · {SAMPLE_CUSTOMER_PROFILE.project}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>地区：{SAMPLE_CUSTOMER_PROFILE.region}</div>
                <div>顾问：{SAMPLE_CUSTOMER_PROFILE.advisor}</div>
                <div>当前阶段：{SAMPLE_CUSTOMER_PROFILE.stage}</div>
                <div>推荐来源：{SAMPLE_CUSTOMER_PROFILE.source}</div>
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <div>最近互动：{SAMPLE_CUSTOMER_PROFILE.lastInteraction}</div>
                <div>最近消费：{SAMPLE_CUSTOMER_PROFILE.lastConsumption}</div>
                <div>服务满意度：{SAMPLE_CUSTOMER_PROFILE.satisfaction}</div>
              </div>
            </div>

            <div className="grid gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>客户旅程</span>
                <span>阶段完成率 68%</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CUSTOMER_JOURNEY_STEPS.map((step, index) => (
                  <span
                    key={step}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                      index < 4
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : index === 4
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Target className="h-3 w-3" /> {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 标签体系 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">标签体系</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">按类别展示客户标签，支持快速筛选</p>
          </div>
          <button
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-violet-200 hover:text-violet-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-300"
          >
            {isTagsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isTagsExpanded ? '收起' : '展开'}
          </button>
        </div>

        {isTagsExpanded && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {TAG_CATEGORIES.map((category) => (
              <div key={category.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                <div className={`mb-3 rounded-lg p-3 ${category.colorClass}`}>
                  <h3 className="text-sm font-semibold">{category.title}</h3>
                  <p className="mt-1 text-xs leading-4">{category.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 标签管理中心 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">标签管理中心</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">支持创建、合并与自动打标签规则配置</p>
          </div>
          <button
            onClick={onManageTags}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-violet-200 hover:text-violet-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-300"
          >
            <Tag className="h-3.5 w-3.5" /> 管理标签
          </button>
        </div>
        <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-900/20">
            <div className="text-sm font-semibold text-violet-700 dark:text-violet-200">自动规则示例</div>
            <ul className="mt-2 space-y-1 leading-5">
              <li>• 活动报名 ≥ 2 次 → 自动打标签「活动活跃」</li>
              <li>• 续约金额 ≥ 20w → 自动打标签「高价值」并抄送经理</li>
              <li>• 服务满意度 &lt; 3 → 触发风险标签「需关注」</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">标签统计</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <div>标签总量：186</div>
              <div>本月新增：24</div>
              <div>自动规则：12 条</div>
              <div>共享标签占比：68%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAndTags;


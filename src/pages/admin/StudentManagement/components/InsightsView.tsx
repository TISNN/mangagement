import React from 'react';
import { BarChart3 } from 'lucide-react';
import SectionHeader from './SectionHeader';

const InsightsView: React.FC = () => (
  <div className="space-y-4">
    <SectionHeader
      title="学生数据洞察"
      description="结合服务进度、转化漏斗、满意度与风险数据，输出趋势与策略建议。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
          <BarChart3 className="h-4 w-4" />
          导出分析报告
        </button>
      }
    />
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {[
        { title: '服务类型占比', placeholder: '环形图展示语言培训/文书/网申/全程服务占比。' },
        { title: '转化漏斗', placeholder: '条形图或漏斗图显示线索 → 面谈 → 签约 → 活跃 → 完成。' },
        { title: '学生满意度趋势', placeholder: '折线图展示满意度平均分与反馈量走势。' },
        { title: '风险热力图', placeholder: '热力图展示不同服务阶段的风险分布。' },
      ].map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{card.title}</h3>
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            {card.placeholder}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default InsightsView;


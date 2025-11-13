import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Download,
  Filter,
  KanbanSquare,
  LayoutList,
  ListChecks,
  Mail,
  PhoneCall,
  Search,
  Sparkles,
  Tag,
  UserCircle,
  UserPlus,
} from 'lucide-react';

import type { LeadRecord, LeadTableViewMode, QuickFilter } from '../types';
import { stageColorMap } from '../utils';
import LeadStageKanban from './LeadStageKanban';

interface LeadTableTabProps {
  quickFilters: QuickFilter[];
  leads: LeadRecord[];
  syncedLeads: Record<string, { studentId: string }>;
  onCreateStudent: (lead: LeadRecord) => void;
  viewMode: LeadTableViewMode;
  onChangeView: (mode: LeadTableViewMode) => void;
}

const LeadTableTab: React.FC<LeadTableTabProps> = ({ quickFilters, leads, syncedLeads, onCreateStudent, viewMode, onChangeView }) => {
  const navigate = useNavigate();
  const renderToolbar = () => (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="搜索线索 / 项目 / 电话"
            className="h-9 rounded-lg border border-gray-200 pl-9 pr-3 text-sm shadow-sm outline-none transition hover:border-blue-200 focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
          <Filter className="h-3.5 w-3.5" />
          高级筛选
        </button>
        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
          <ListChecks className="h-3.5 w-3.5" />
          保存视图
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <button
          onClick={() => onChangeView('table')}
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 transition ${
            viewMode === 'table'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-200'
              : 'border-gray-200 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500'
          }`}
        >
          <LayoutList className="h-3.5 w-3.5" /> 表格
        </button>
        <button
          onClick={() => onChangeView('kanban')}
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 transition ${
            viewMode === 'kanban'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-200'
              : 'border-gray-200 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500'
          }`}
        >
          <KanbanSquare className="h-3.5 w-3.5" /> 看板
        </button>
      </div>
    </div>
  );

  if (viewMode === 'kanban') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          {renderToolbar()}
        </div>
        <LeadStageKanban leads={leads} />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        {renderToolbar()}

        <div className="mt-4 flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:border-blue-500/60 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <Sparkles className="h-3 w-3" />
              {filter.label}
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                {filter.value}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="border-b border-gray-200 px-5 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          共 {leads.length} 条线索 · 勾选后可执行批量操作
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3 text-left font-medium">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </th>
                <th className="px-5 py-3 text-left font-medium">线索</th>
                <th className="px-5 py-3 text-left font-medium">意向项目</th>
                <th className="px-5 py-3 text-left font-medium">阶段</th>
                <th className="px-5 py-3 text-left font-medium">负责人</th>
                <th className="px-5 py-3 text-left font-medium">渠道</th>
                <th className="px-5 py-3 text-left font-medium">最近跟进</th>
                <th className="px-5 py-3 text-left font-medium">下一步动作</th>
                <th className="px-5 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                >
                  <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                        {lead.avatar ? (
                          <img
                            src={lead.avatar}
                            alt={lead.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UserCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{lead.name}</div>
                        <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-blue-500 dark:text-blue-300">
                          {lead.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 dark:bg-blue-900/30">
                              <Tag className="h-3 w-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{lead.project}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${stageColorMap[lead.stage]}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{lead.owner}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>{lead.channel}</div>
                    {lead.campaign && <div className="text-[11px] text-gray-400 dark:text-gray-500">{lead.campaign}</div>}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{lead.lastTouch}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="line-clamp-2 leading-5">{lead.nextAction}</div>
                    {lead.risk && (
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
                        <AlertTriangle className="h-3 w-3" /> {lead.risk}
                      </div>
                    )}
                  </td>
                  <td
                    className="px-5 py-4 text-right text-xs text-gray-500 dark:text-gray-400"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:text-blue-300">
                      <PhoneCall className="h-3.5 w-3.5" /> 跟进
                    </button>
                    <button className="ml-2 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:text-blue-300">
                      <Mail className="h-3.5 w-3.5" /> 邮件
                    </button>
                    <button
                      onClick={() => onCreateStudent(lead)}
                      disabled={Boolean(syncedLeads[lead.id])}
                      className="ml-2 inline-flex items-center gap-1 rounded-lg border border-indigo-200 px-2.5 py-1 text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 dark:border-indigo-500/40 dark:text-indigo-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
                    >
                      {syncedLeads[lead.id] ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          已创建
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5" />
                          一键建档
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
          <div className="flex flex-wrap items-center gap-2">
            <span>已选 0 项</span>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
              <ClipboardList className="h-3.5 w-3.5" /> 批量分配
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
              <Sparkles className="h-3.5 w-3.5" /> 创建任务
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
              <Tag className="h-3.5 w-3.5" /> 打标签
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover-border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
              <Download className="h-3.5 w-3.5" /> 导出
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadTableTab;

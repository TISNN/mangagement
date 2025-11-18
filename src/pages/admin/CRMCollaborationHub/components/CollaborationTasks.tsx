/**
 * 协作任务与请求组件
 * 展示跨部门协作任务和进度追踪
 */

import React, { useState } from 'react';
import { Sparkles, MessageSquare, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { CollaborationTask } from '../types';
import { COLLAB_TASKS } from '../constants';

interface CollaborationTasksProps {
  onCreateRequest?: () => void;
  onViewCommunication?: (taskId: string) => void;
  onCompleteTask?: (taskId: string) => void;
}

const statusStyles: Record<CollaborationTask['status'], string> = {
  待处理: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  进行中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  已完成: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const priorityStyles: Record<CollaborationTask['priority'], string> = {
  高: 'text-rose-500 dark:text-rose-300',
  中: 'text-indigo-500 dark:text-indigo-300',
  低: 'text-gray-400 dark:text-gray-500',
};

const CollaborationTasks: React.FC<CollaborationTasksProps> = ({
  onCreateRequest,
  onViewCommunication,
  onCompleteTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['task-1']));
  const [statusFilter, setStatusFilter] = useState<'all' | CollaborationTask['status']>('all');

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const filteredTasks =
    statusFilter === 'all' ? COLLAB_TASKS : COLLAB_TASKS.filter((task) => task.status === statusFilter);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">协作任务与请求</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">按部门与状态跟踪跨团队协作进度，SLA 超时将自动高亮</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={onCreateRequest}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5" /> 创建请求
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* 状态筛选 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(['all', '待处理', '进行中', '已完成'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'all' ? '全部' : status}
              </button>
            ))}
          </div>

          {/* 任务列表 */}
          <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/40">
                <p className="text-sm text-gray-500">暂无 {statusFilter === 'all' ? '' : statusFilter} 任务</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isExpandedTask = expandedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <span>{task.title}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${priorityStyles[task.priority]}`}>
                        优先级：{task.priority}
                      </span>
                    </div>
                    {isExpandedTask && (
                      <>
                        <div className="mt-2 grid gap-2 text-xs text-gray-500 dark:text-gray-400 md:grid-cols-2">
                          <div>需求部门：{task.department}</div>
                          <div>发起人：{task.requester}</div>
                          <div>负责人：{task.assignee}</div>
                          <div>截止时间：{task.due}</div>
                          <div>服务协议：{task.sla}</div>
                        </div>
                        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                          {task.history.map((log, index) => (
                            <div key={index}>• {log}</div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                      >
                        {isExpandedTask ? '收起' : '展开'}
                      </button>
                      <button
                        onClick={() => onViewCommunication?.(task.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> 查看沟通
                      </button>
                      {task.status !== '已完成' && (
                        <button
                          onClick={() => onCompleteTask?.(task.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> 完成任务
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CollaborationTasks;


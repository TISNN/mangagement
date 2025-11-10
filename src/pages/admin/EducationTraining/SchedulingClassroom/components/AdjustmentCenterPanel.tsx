import { CalendarClock, ClipboardPenLine, FileCheck2, RefreshCcw } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { AdjustmentRequest } from '../types';

interface Props {
  adjustments: AdjustmentRequest[];
}

const requestTypeLabel: Record<AdjustmentRequest['type'], string> = {
  leave: '请假',
  reschedule: '调课',
  makeup: '补课',
};

const statusStyle: Record<AdjustmentRequest['status'], string> = {
  pending: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
  approved: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
  declined: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',
};

export const AdjustmentCenterPanel = ({ adjustments }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">调课与请假中心</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">汇总学员与教师的调课需求，记录审批结果并追踪待办，保障教学连续性。</p>
        </div>
      </header>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">调课工单列表</CardTitle>
          <CardDescription>审批状态一目了然，便于班主任与教务跟进处理。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {adjustments.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white/70 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{request.className}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">申请人：{request.requester}</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusStyle[request.status]}`}>
                  <RefreshCcw className="h-4 w-4" />
                  {request.status === 'pending' ? '待审批' : request.status === 'approved' ? '已通过' : '已驳回'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <ClipboardPenLine className="h-4 w-4 text-blue-500" />
                  类型：{requestTypeLabel[request.type]}
                </p>
                <p className="leading-relaxed">原因：{request.reason}</p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-emerald-500" />
                  目标日期：{request.targetDate}
                </p>
                <p className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-gray-400" />
                  审核人：{request.reviewer}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

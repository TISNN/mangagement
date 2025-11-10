import { BellRing, Bot, Mail, MessageSquareText, RefreshCcw } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { NotificationChannel } from '../types';

interface Props {
  channels: NotificationChannel[];
}

const channelIconMap: Record<NotificationChannel['channel'], JSX.Element> = {
  email: <Mail className="h-4 w-4 text-blue-500" />,
  sms: <MessageSquareText className="h-4 w-4 text-emerald-500" />,
  wechat: <Bot className="h-4 w-4 text-green-500" />,
  dingtalk: <Bot className="h-4 w-4 text-sky-500" />,
  calendar: <BellRing className="h-4 w-4 text-indigo-500" />,
};

export const NotificationPanel = ({ channels }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">通知与同步</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">统一管理邮件、短信、日历等同步渠道，确保排课变更及时触达老师与学员。</p>
        </div>
      </header>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">同步渠道配置</CardTitle>
          <CardDescription>查看自动同步状态与最后更新时间，必要时手动刷新通知。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-900/70">
              <div className="mt-1 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center dark:bg-blue-900/40">
                {channelIconMap[channel.channel]}
              </div>
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                <p className="font-semibold text-gray-900 dark:text-white">{channel.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{channel.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">上次同步：{channel.lastSync}</p>
                <span className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${channel.autoSync ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                  <RefreshCcw className="h-3.5 w-3.5" /> {channel.autoSync ? '自动同步开启' : '需手动刷新'}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

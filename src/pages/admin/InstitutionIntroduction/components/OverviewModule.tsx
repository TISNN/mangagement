import React from 'react';
import { ArrowRight, Download, Share2, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { HighlightCard, HeroStat } from '../types';

interface OverviewModuleProps {
  heroStats: HeroStat[];
  highlights: HighlightCard[];
  onDownloadBrochure: () => void;
  onBookIntro: () => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  heroStats,
  highlights,
  onDownloadBrochure,
  onBookIntro,
}) => {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg dark:border-gray-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_50%)]" />
        <div className="relative flex flex-col gap-10 p-8 md:flex-row md:items-center md:p-12">
          <div className="flex-1 space-y-6">
            <div>
              <Badge className="mb-3 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                机构介绍 · 面向学生与家长
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                学屿留学 · 全链路留学服务，助力每一次理想Offer
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-blue-50 md:text-base">
                我们以顾问 + 导师 + 数据中台的三重保障，陪伴学生从背景规划、申请执行到入学衔接。透明流程、实时进度与真实案例，让学生与家长清楚看到每一步的努力与成长。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onBookIntro}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-900/20 hover:bg-blue-50 dark:bg-white dark:text-blue-700"
              >
                <Video className="h-4 w-4" />
                预约线上机构说明会
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadBrochure}
                className="flex items-center gap-2 rounded-xl border-white/60 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
                下载机构手册
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-white/50 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
                分享给家长
              </Button>
            </div>
          </div>

          <Card className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border-white/20 bg-white/10 p-6 text-white backdrop-blur md:w-96">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-100">重点为你准备</p>
            <ul className="space-y-3 text-sm text-blue-50">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 text-blue-200" />
                服务流程、导师团队、案例成果一目了然
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 text-blue-200" />
                真实可验证的成绩与奖学金数据
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 text-blue-200" />
                官方支付渠道、合同与保障说明
              </li>
            </ul>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-xs text-blue-50">
              <p className="font-semibold text-white">温馨提示</p>
              <p className="mt-1">
                说明会包含线下参观与线上直播两种形式，可根据家庭所在城市预约；预约成功后我们会在 24 小时内联系确认。
              </p>
            </div>
          </Card>
        </div>

        <div className="border-t border-white/10 bg-white/10 px-6 py-4 text-xs text-blue-50 md:px-12 md:py-5">
          <p>
            * 我们承诺所有数据真实可追溯，签约前可申请查看匿名化案例材料与顾问资质证明。
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {heroStats.map((stat) => (
          <Card key={stat.id} className="group relative overflow-hidden rounded-3xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
            <div className="absolute -top-10 right-0 h-24 w-24 rounded-full bg-blue-100 opacity-40 blur-2xl transition duration-500 group-hover:scale-110 dark:bg-blue-600/30" />
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{stat.hint}</p>
            {stat.trend && (
              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                {stat.trend.label} {stat.trend.value}
              </div>
            )}
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">机构优势亮点</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">方法论、团队、数据与保障四大维度帮助学生稳定拿Offer。</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {highlights.map((highlight) => (
            <Card key={highlight.id} className="relative overflow-hidden rounded-3xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <div className="absolute inset-y-0 right-0 w-32 rounded-l-full bg-gradient-to-l from-blue-100/80 via-blue-50/30 to-transparent opacity-60 dark:from-blue-500/10" />
              <div className="relative flex items-start gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                  <highlight.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{highlight.title}</h3>
                    {highlight.badge && (
                      <Badge className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                        {highlight.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{highlight.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {highlight.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};


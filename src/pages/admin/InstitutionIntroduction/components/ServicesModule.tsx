import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { ServiceFlowStep, ServiceOffering } from '../types';

interface ServicesModuleProps {
  services: ServiceOffering[];
  flowSteps: ServiceFlowStep[];
  onBookService: (service: ServiceOffering) => void;
  onViewCase: (caseId: string) => void;
}

const formatCurrency = (value: number, currency: 'CNY' | 'USD') => {
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'zh-CN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};

export const ServicesModule: React.FC<ServicesModuleProps> = ({ services, flowSteps, onBookService, onViewCase }) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [selectedService, setSelectedService] = useState<ServiceOffering | null>(null);

  const categories = useMemo(() => ['全部', ...Array.from(new Set(services.map((service) => service.category)))], [services]);

  const filteredServices = useMemo(() => {
    if (activeCategory === '全部') {
      return services;
    }
    return services.filter((service) => service.category === activeCategory);
  }, [activeCategory, services]);

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">核心服务方案</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              针对不同阶段与专业的学生，提供覆盖规划、申请、背景提升的多类型服务组合。
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-100'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredServices.map((service) => (
            <Card key={service.id} className="flex h-full flex-col gap-5 rounded-3xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                    {service.category}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-emerald-500/50 bg-emerald-50/80 text-xs text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {service.duration}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    SLA 保障
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{service.tagline}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">服务费用</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(service.priceRange.min, service.priceRange.currency)} - {formatCurrency(service.priceRange.max, service.priceRange.currency)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">含顾问、导师、交付管理费用</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">适合学生</p>
                    <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      {service.suitableFor.slice(0, 3).map((fit) => (
                        <li key={fit} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span>{fit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">服务亮点</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {service.processHighlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                    <Layers className="h-3.5 w-3.5" />
                    共 {service.deliverables.length} 项核心交付
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    含 AI 工具支持
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setSelectedService(service)}>
                    查看服务详情
                  </Button>
                  <Button onClick={() => onBookService(service)} className="bg-blue-600 text-white hover:bg-blue-500">
                    预约方案讨论
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">标准化交付流程</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">每个阶段都有明确时间表、责任人与成果交付，确保学生和家长随时可追踪。</p>
          </div>
          <Button variant="outline" className="rounded-full border-blue-200 bg-white text-sm text-blue-600 hover:border-blue-300 hover:text-blue-700 dark:border-blue-500/30 dark:bg-gray-900/60 dark:text-blue-200">
            <FileText className="mr-2 h-4 w-4" />
            下载流程手册
          </Button>
        </div>

        <div className="space-y-4">
          {flowSteps.map((step, index) => {
            const relatedCaseId = services[index % services.length]?.caseIds?.[0];
            return (
              <div key={step.id} className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
                <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-blue-200 via-blue-100 to-transparent dark:from-blue-500/30 md:block" />
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                  <div className="flex items-center gap-3 md:w-48">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">{step.timeframe}</p>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                        <Calendar className="h-3.5 w-3.5" />
                        负责人：{step.owner}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                        <Clock className="h-3.5 w-3.5" />
                        交付物：{step.deliverable}
                      </span>
                    </div>
                    {step.reminder && <p className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">{step.reminder}</p>}
                  </div>
                  <div className="flex items-start">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (relatedCaseId) {
                          onViewCase(relatedCaseId);
                        }
                      }}
                      disabled={!relatedCaseId}
                    >
                      查看案例参考 <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={Boolean(selectedService)} onOpenChange={(open) => !open && setSelectedService(null)}>
        {selectedService && (
          <DialogContent className="max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">{selectedService.title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">{selectedService.tagline}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <section className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">价格区间</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(selectedService.priceRange.min, selectedService.priceRange.currency)} -{' '}
                    {formatCurrency(selectedService.priceRange.max, selectedService.priceRange.currency)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">支持分期与奖学金抵扣</p>
                </Card>
                <Card className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">保障与权益</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {selectedService.guarantees.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>

              <section className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">服务交付清单</p>
                <ul className="grid gap-3 md:grid-cols-2">
                  {selectedService.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-blue-500" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">最适合的学生画像</p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {selectedService.suitableFor.map((fit) => (
                    <li key={fit} className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
                      <span>{fit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-500"
                  onClick={() => {
                    onBookService(selectedService);
                    setSelectedService(null);
                  }}
                >
                  预约专属顾问
                </Button>
                <Button variant="outline" onClick={() => setSelectedService(null)}>
                  关闭
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};


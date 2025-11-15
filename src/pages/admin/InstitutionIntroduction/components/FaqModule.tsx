import React, { useMemo, useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { FAQItem } from '../types';

interface FaqModuleProps {
  faqItems: FAQItem[];
  onContact: () => void;
}

export const FaqModule: React.FC<FaqModuleProps> = ({ faqItems, onContact }) => {
  const [activeCategory, setActiveCategory] = useState<FAQItem['category'] | '全部'>('全部');
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set([faqItems[0]?.id].filter(Boolean) as string[]));

  const categories = useMemo(() => ['全部', ...Array.from(new Set(faqItems.map((faq) => faq.category)))], [faqItems]);

  const filteredFaqs = useMemo(() => {
    if (activeCategory === '全部') {
      return faqItems;
    }
    return faqItems.filter((faq) => faq.category === activeCategory);
  }, [activeCategory, faqItems]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">常见问题</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">覆盖服务流程、费用与合同、隐私安全以及其他高频疑问。</p>
        </div>
        <Button variant="outline" onClick={onContact}>
          <MessageCircleQuestion className="mr-2 h-4 w-4" />
          没有找到答案？联系顾问
        </Button>
      </section>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category as FAQItem['category'] | '全部')}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-100'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <Card className="space-y-2 rounded-3xl border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqIds.has(faq.id);
          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-transparent px-3 py-2 transition hover:border-blue-100 dark:hover:border-blue-400/40"
            >
              <button
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="flex flex-1 items-start gap-3">
                  <HelpCircle className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-200" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{faq.question}</p>
                      <Badge variant="outline" className="rounded-full border-blue-200 text-[10px] font-semibold text-blue-600 dark:border-blue-500/40 dark:text-blue-200">
                        {faq.category}
                      </Badge>
                    </div>
                    {isOpen && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>}
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </button>
            </div>
          );
        })}
      </Card>
    </div>
  );
};


import React, { useMemo, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import {
  INSTITUTION_CASES,
  INSTITUTION_CONTACTS,
  INSTITUTION_CREDENTIALS,
  INSTITUTION_FAQ,
  INSTITUTION_HERO_STATS,
  INSTITUTION_HIGHLIGHTS,
  INSTITUTION_LOCATIONS,
  INSTITUTION_PAYMENT_CHANNELS,
  INSTITUTION_SERVICE_FLOW,
  INSTITUTION_SERVICES,
  INSTITUTION_TEAM,
  INSTITUTION_TESTIMONIALS,
} from './data';
import { CredibilityModule } from './components/CredibilityModule';
import { FaqModule } from './components/FaqModule';
import { OverviewModule } from './components/OverviewModule';
import { ProofModule } from './components/ProofModule';
import { ServicesModule } from './components/ServicesModule';
import type { ServiceOffering } from './types';

const MODULES = [
  { key: 'overview', label: '机构亮点', description: '定位 · 数据 · 方法论' },
  { key: 'services', label: '服务体系', description: '方案 · 流程 · SLA' },
  { key: 'proof', label: '成果背书', description: '案例 · 团队 · 口碑' },
  { key: 'credibility', label: '资质与收款', description: '证件 · 地址 · 支付' },
  { key: 'faq', label: '常见问题', description: '答疑 · 咨询入口' },
] as const;

type ModuleKey = (typeof MODULES)[number]['key'];

const InstitutionIntroductionPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [focusedCaseId, setFocusedCaseId] = useState<string | null>(null);

  const sortedCases = useMemo(() => [...INSTITUTION_CASES].sort((a, b) => a.timeline.localeCompare(b.timeline)), []);

  const handleShowFeedback = (message: string, nextModule?: ModuleKey) => {
    setFeedbackMessage(message);
    if (nextModule) {
      setActiveModule(nextModule);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadBrochure = () => {
    handleShowFeedback('机构介绍手册已准备好，请在浏览器下载列表中查看 PDF 文件。（示例场景）');
  };

  const handleBookIntro = () => {
    handleShowFeedback('已收到你的说明会预约需求，我们会在 24 小时内联系确认时间。', 'credibility');
  };

  const handleBookService = (service: ServiceOffering) => {
    handleShowFeedback(`已为你创建“${service.title}”的方案讨论需求，顾问将与家长确认具体时间。`, 'proof');
  };

  const handleViewCase = (caseId: string) => {
    setFocusedCaseId(caseId);
    setActiveModule('proof');
  };

  const handleContact = () => {
    handleShowFeedback('顾问助手已收到咨询请求，我们将通过电话或微信与你联系。', 'credibility');
  };

  const handleRequestVisit = () => {
    handleShowFeedback('线下参观预约提交成功，请保持电话畅通，我们会安排顾问确认行程。', 'credibility');
  };

  const handleContactConsultant = () => {
    handleShowFeedback('顾问已收到你的需求，会在 2 小时内与学生与家长建立沟通群。', 'credibility');
  };

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-200">INSTITUTION INTRO</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">机构介绍中心</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
              提供机构定位、服务体系、成果案例、资质审核与付款信息的一站式介绍页，便于学生与家长快速了解并建立信任，支持顾问在沟通时作为说明材料快捷分享。
            </p>
          </div>
          <Button variant="outline" onClick={handleDownloadBrochure} className="rounded-full border-blue-200 px-5 text-sm font-semibold text-blue-600 hover:border-blue-300 hover:text-blue-700 dark:border-blue-500/40 dark:text-blue-200">
            打包下载机构手册
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {MODULES.map((module) => (
            <button
              key={module.key}
              onClick={() => setActiveModule(module.key)}
              className={`flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left text-xs transition md:flex-row md:items-center md:gap-3 md:text-sm ${
                activeModule === module.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-100'
              }`}
            >
              <span className="font-semibold">{module.label}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{module.description}</span>
            </button>
          ))}
        </div>
      </header>

      {feedbackMessage && (
        <Alert className="flex items-start gap-3 rounded-2xl border-blue-200 bg-blue-50 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/40 dark:text-blue-100">
          <AlertDescription>{feedbackMessage}</AlertDescription>
        </Alert>
      )}

      {activeModule === 'overview' && (
        <OverviewModule
          heroStats={INSTITUTION_HERO_STATS}
          highlights={INSTITUTION_HIGHLIGHTS}
          onDownloadBrochure={handleDownloadBrochure}
          onBookIntro={handleBookIntro}
        />
      )}

      {activeModule === 'services' && (
        <ServicesModule
          services={INSTITUTION_SERVICES}
          flowSteps={INSTITUTION_SERVICE_FLOW}
          onBookService={handleBookService}
          onViewCase={handleViewCase}
        />
      )}

      {activeModule === 'proof' && (
        <ProofModule
          cases={sortedCases}
          team={INSTITUTION_TEAM}
          testimonials={INSTITUTION_TESTIMONIALS}
          onContactConsultant={handleContactConsultant}
          focusedCaseId={focusedCaseId}
          onClearFocusedCase={() => setFocusedCaseId(null)}
        />
      )}

      {activeModule === 'credibility' && (
        <CredibilityModule
          credentials={INSTITUTION_CREDENTIALS}
          locations={INSTITUTION_LOCATIONS}
          payments={INSTITUTION_PAYMENT_CHANNELS}
          contacts={INSTITUTION_CONTACTS}
          onRequestVisit={handleRequestVisit}
        />
      )}

      {activeModule === 'faq' && <FaqModule faqItems={INSTITUTION_FAQ} onContact={handleContact} />}
    </div>
  );
};

export default InstitutionIntroductionPage;


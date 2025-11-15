import type { LucideIcon } from 'lucide-react';

export interface HeroStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  trend?: {
    label: string;
    value: string;
  };
}

export interface HighlightCard {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  badge?: string;
  icon: LucideIcon;
}

export interface ServiceOffering {
  id: string;
  category: string;
  title: string;
  tagline: string;
  priceRange: {
    min: number;
    max: number;
    currency: 'CNY' | 'USD';
  };
  duration: string;
  deliverables: string[];
  guarantees: string[];
  suitableFor: string[];
  processHighlights: string[];
  caseIds: string[];
}

export interface ServiceFlowStep {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  owner: string;
  deliverable: string;
  reminder?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  studentProfile: string;
  challenge: string;
  strategy: string[];
  results: {
    outcome: string;
    scholarship?: string;
    offerList: string[];
  };
  advisorComment: string;
  tags: string[];
  timeline: string;
  assets: string[];
  coverImage: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  experienceYears: number;
  avatar: string;
  successCases: number;
}

export interface Testimonial {
  id: string;
  author: string;
  relation: string;
  content: string;
  highlight: string;
  rating: number;
  source?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: '服务流程' | '费用与合同' | '隐私与安全' | '其他';
}

export interface CredentialItem {
  id: string;
  type: '营业执照' | '办学许可证' | '合作认证' | '获奖证书';
  title: string;
  issuedBy: string;
  issueDate: string;
  credentialNumber: string;
  expireDate?: string;
  description: string;
  mediaUrl: string;
  caution?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  businessHours: string;
  transportGuide: string[];
  mapUrl: string;
}

export type PaymentChannelType = 'bank' | 'wechat' | 'alipay';

export interface PaymentChannel {
  id: string;
  type: PaymentChannelType;
  displayName: string;
  accountMasked: string;
  accountFull?: string;
  bankName?: string;
  qrCodeUrl?: string;
  notes?: string;
  lastVerifiedAt: string;
  contactPerson: string;
}

export interface ContactEntry {
  id: string;
  label: string;
  value: string;
  type: 'phone' | 'email' | 'wechat' | 'mini-program' | 'form';
  actionLabel?: string;
}


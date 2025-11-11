export type ProjectStage = '本科' | '硕士' | '博士' | '语言' | '职业发展';

export interface ProjectPriceRange {
  min: number;
  max: number;
  currency: 'CNY' | 'USD' | 'EUR';
}

export interface ProjectPackage {
  name: string;
  minPrice: number;
  maxPrice?: number;
  currency: 'CNY' | 'USD' | 'EUR';
  deliverables: string[];
  durationWeeks?: number;
  seatLimit?: number | null;
}

export interface ProjectTimelineItem {
  label: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  providerName: string;
  providerAvatar?: string;
  providerType: '机构' | '导师';
  country: string;
  city?: string;
  stage: ProjectStage;
  category: string;
  highlight: string;
  description: string;
  coverImage: string;
  languages: string[];
  tags: string[];
  focusAreas: string[];
  supportChannels: string[];
  successRate: number;
  rating: number;
  reviewCount: number;
  priceRange: ProjectPriceRange;
  durationWeeks: number;
  startDates: string[];
  packages: ProjectPackage[];
  timeline: ProjectTimelineItem[];
  featured?: boolean;
  insight?: string;
  updatedAt: string;
}

export interface MarketplaceFilterOptions {
  countries: string[];
  stages: ProjectStage[];
  languages: string[];
  tags: string[];
}


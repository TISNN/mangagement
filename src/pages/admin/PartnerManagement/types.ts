export type PartnerType = 'university' | 'professor' | 'agency' | 'company' | 'other';

export type PartnerStatus = 'prospecting' | 'negotiating' | 'active' | 'on_hold' | 'closed';

export type PartnerLevel = 'strategic' | 'key' | 'regular' | 'watch';

export type PartnerContact = {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  linkedin?: string;
  isPrimary?: boolean;
};

export type PartnerEngagementStatus = 'planning' | 'executing' | 'completed' | 'on_hold';

export type PartnerEngagement = {
  id: string;
  title: string;
  category?: string;
  status: PartnerEngagementStatus;
  contractStatus?: 'draft' | 'reviewing' | 'signed' | 'expired';
  startDate?: string;
  endDate?: string;
  nextAction?: string;
  ownerName?: string;
};

export type TimelineNoteType = 'call' | 'meeting' | 'email' | 'onsite' | 'document' | 'other';

export type PartnerTimelineEntry = {
  id: string;
  noteType: TimelineNoteType;
  content: string;
  nextAction?: string;
  remindAt?: string;
  attachments?: { name: string; url: string }[];
  createdAt: string;
  createdBy?: string;
  createdByName: string;
};

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  level: PartnerLevel;
  country?: string;
  city?: string;
  website?: string;
  logoUrl?: string;
  summary?: string;
  rating?: number;
  tags?: string[];
  ownerId?: string;
  ownerName: string;
  ownerTitle?: string;
  contacts: PartnerContact[];
  engagements: PartnerEngagement[];
  timelines: PartnerTimelineEntry[];
  risks?: string[];
  internalNotes?: string;
  highlight?: string;
  createdAt?: string;
  lastUpdatedAt: string;
  isFavorite?: boolean;
};


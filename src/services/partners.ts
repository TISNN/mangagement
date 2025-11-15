import supabase from '@/lib/supabase';
import type {
  Partner,
  PartnerContact,
  PartnerEngagement,
  PartnerTimelineEntry,
  PartnerLevel,
  PartnerStatus,
  PartnerType,
  PartnerEngagementStatus,
  TimelineNoteType,
} from '@/pages/admin/PartnerManagement/types';

type PartnerRow = {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  level: PartnerLevel;
  logo_url: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  summary: string | null;
  rating: number | null;
  tags: string[] | null;
  owner_id: string | null;
  owner_name: string | null;
  owner_title: string | null;
  highlight: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

type PartnerContactRow = {
  id: string;
  partner_id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  wechat: string | null;
  linkedin: string | null;
  is_primary: boolean | null;
  created_at: string;
  updated_at: string;
};

type PartnerEngagementRow = {
  id: string;
  partner_id: string;
  title: string;
  category: string | null;
  related_student_id: string | null;
  related_professor_id: string | null;
  contract_status: 'draft' | 'reviewing' | 'signed' | 'expired' | null;
  start_date: string | null;
  end_date: string | null;
  status: PartnerEngagementStatus;
  next_action: string | null;
  owner_id: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
};

type PartnerTimelineRow = {
  id: string;
  partner_id: string;
  note_type: TimelineNoteType;
  content: string;
  next_action: string | null;
  remind_at: string | null;
  attachments: { name: string; url: string }[] | null;
  created_by: string | null;
  created_by_name: string | null;
  created_at: string;
};

type PartnerFavoriteRow = {
  id: string;
  partner_id: string;
  user_id: string | null;
  user_name: string | null;
};

const DEFAULT_FAVORITE_USER_ID = '00000000-0000-0000-0000-000000000000';

const mapContact = (contact: PartnerContactRow): PartnerContact => ({
  id: contact.id,
  name: contact.name,
  role: contact.role ?? undefined,
  email: contact.email ?? undefined,
  phone: contact.phone ?? undefined,
  wechat: contact.wechat ?? undefined,
  linkedin: contact.linkedin ?? undefined,
  isPrimary: Boolean(contact.is_primary),
});

const mapEngagement = (engagement: PartnerEngagementRow): PartnerEngagement => ({
  id: engagement.id,
  title: engagement.title,
  category: engagement.category ?? undefined,
  status: engagement.status,
  contractStatus: engagement.contract_status ?? undefined,
  startDate: engagement.start_date ?? undefined,
  endDate: engagement.end_date ?? undefined,
  nextAction: engagement.next_action ?? undefined,
  ownerName: engagement.owner_name ?? undefined,
});

const mapTimeline = (timeline: PartnerTimelineRow): PartnerTimelineEntry => ({
  id: timeline.id,
  noteType: timeline.note_type,
  content: timeline.content,
  nextAction: timeline.next_action ?? undefined,
  remindAt: timeline.remind_at ?? undefined,
  attachments: timeline.attachments ?? [],
  createdBy: timeline.created_by ?? undefined,
  createdByName: timeline.created_by_name ?? '',
  createdAt: timeline.created_at,
});

const mapPartner = (
  row: PartnerRow & {
    partner_contacts: PartnerContactRow[] | null;
    partner_engagements: PartnerEngagementRow[] | null;
    partner_timelines: PartnerTimelineRow[] | null;
    partner_favorites: PartnerFavoriteRow[] | null;
  },
): Partner => ({
  id: row.id,
  name: row.name,
  type: row.type,
  status: row.status,
  level: row.level,
  logoUrl: row.logo_url ?? undefined,
  country: row.country ?? undefined,
  city: row.city ?? undefined,
  website: row.website ?? undefined,
  summary: row.summary ?? undefined,
  rating: row.rating ?? undefined,
  tags: row.tags ?? undefined,
  ownerId: row.owner_id ?? undefined,
  ownerName: row.owner_name ?? '未分配',
  ownerTitle: row.owner_title ?? undefined,
  highlight: row.highlight ?? undefined,
  internalNotes: row.internal_notes ?? undefined,
  createdAt: row.created_at,
  lastUpdatedAt: row.updated_at,
  isFavorite: Boolean(
    (row.partner_favorites ?? []).find((favorite) => (favorite.user_id ?? DEFAULT_FAVORITE_USER_ID) === DEFAULT_FAVORITE_USER_ID),
  ),
  contacts: (row.partner_contacts ?? []).map(mapContact).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
  engagements: (row.partner_engagements ?? []).map(mapEngagement).sort((a, b) => {
    const aDate = a.endDate ?? a.startDate ?? '';
    const bDate = b.endDate ?? b.startDate ?? '';
    return bDate.localeCompare(aDate);
  }),
  timelines: (row.partner_timelines ?? []).map(mapTimeline).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
});

export type PartnerWritePayload = {
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  level: PartnerLevel;
  country?: string;
  city?: string;
  website?: string;
  summary?: string;
  ownerId?: string;
  ownerName?: string;
  ownerTitle?: string;
  tags?: string[];
  highlight?: string;
  internalNotes?: string;
};

export type PartnerTimelinePayload = {
  noteType: TimelineNoteType;
  content: string;
  nextAction?: string;
  remindAt?: string;
};

export const fetchPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select(
      `
        *,
        partner_contacts(*),
        partner_engagements(*),
        partner_timelines(*),
        partner_favorites(*)
      `,
    )
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((row) => mapPartner(row as Parameters<typeof mapPartner>[0]));
};

export const createPartner = async (payload: PartnerWritePayload): Promise<string> => {
  const { data, error } = await supabase
    .from('partners')
    .insert({
      name: payload.name,
      type: payload.type,
      status: payload.status,
      level: payload.level,
      country: payload.country,
      city: payload.city,
      website: payload.website,
      summary: payload.summary,
      owner_id: payload.ownerId,
      owner_name: payload.ownerName,
      owner_title: payload.ownerTitle,
      tags: payload.tags?.length ? payload.tags : null,
      highlight: payload.highlight,
      internal_notes: payload.internalNotes,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data?.id ?? '';
};

export const updatePartner = async (partnerId: string, payload: PartnerWritePayload) => {
  const { error } = await supabase
    .from('partners')
    .update({
      name: payload.name,
      type: payload.type,
      status: payload.status,
      level: payload.level,
      country: payload.country,
      city: payload.city,
      website: payload.website,
      summary: payload.summary,
      owner_id: payload.ownerId,
      owner_name: payload.ownerName,
      owner_title: payload.ownerTitle,
      tags: payload.tags?.length ? payload.tags : null,
      highlight: payload.highlight,
      internal_notes: payload.internalNotes,
    })
    .eq('id', partnerId);

  if (error) {
    throw error;
  }
};

export const addPartnerTimeline = async (partnerId: string, payload: PartnerTimelinePayload) => {
  const { error } = await supabase.from('partner_timelines').insert({
    partner_id: partnerId,
    note_type: payload.noteType,
    content: payload.content,
    next_action: payload.nextAction,
    remind_at: payload.remindAt,
  });

  if (error) {
    throw error;
  }
};

export const togglePartnerFavorite = async (partnerId: string, nextState: boolean) => {
  if (nextState) {
    const { error } = await supabase.from('partner_favorites').insert({
      partner_id: partnerId,
      user_id: DEFAULT_FAVORITE_USER_ID,
    });
    if (error && error.code !== '23505') {
      throw error;
    }
    return;
  }

  const { error } = await supabase
    .from('partner_favorites')
    .delete()
    .eq('partner_id', partnerId)
    .eq('user_id', DEFAULT_FAVORITE_USER_ID);

  if (error) {
    throw error;
  }
};

export default fetchPartners;


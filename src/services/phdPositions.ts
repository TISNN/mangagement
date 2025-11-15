import type { PhdFundingLevel, PhdPosition, PhdPositionStatus } from '../types/phd';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[phdPositions] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.');
}

const FUNCTION_ENDPOINT = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/phd-positions`
  : undefined;

const baseHeaders: HeadersInit = {
  apikey: SUPABASE_ANON_KEY ?? '',
  Authorization: `Bearer ${SUPABASE_ANON_KEY ?? ''}`,
  'Content-Type': 'application/json',
};

export interface FetchPhdPositionsOptions {
  status?: string;
  funding?: string;
  country?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'deadline' | 'match_score' | 'university';
  order?: 'asc' | 'desc';
  sourceId?: string;
}

interface SupabasePhdRecord {
  source_id: string;
  official_link: string;
  apply_link: string | null;
  title_en: string | null;
  title_zh: string | null;
  university: string | null;
  department: string | null;
  country: string | null;
  city: string | null;
  intake_term: string | null;
  deadline: string | null;
  deadline_status: 'confirmed' | 'estimated' | 'unknown' | null;
  employment_type: string | null;
  workload_hours_per_week: string | null;
  education_level: string | null;
  funding_level: PhdFundingLevel | null;
  supports_international: boolean | null;
  description_en: string | null;
  description_zh: string | null;
  requirements_en: string | null;
  requirements_zh: string | null;
  application_steps_en: string | null;
  application_steps_zh: string | null;
  tags: string[] | null;
  match_score: number | null;
  status: PhdPositionStatus | null;
  last_scraped_at: string | null;
  raw_payload: unknown;
}

const mapRecord = (record: SupabasePhdRecord): PhdPosition => ({
  id: record.source_id,
  sourceId: record.source_id,
  titleEn: record.title_en ?? '未命名博士岗位',
  titleZh: record.title_zh ?? undefined,
  university: record.university ?? '院校待确认',
  department: record.department,
  country: record.country,
  city: record.city,
  officialLink: record.official_link ?? '#',
  intakeTerm: record.intake_term,
  deadline: record.deadline,
  deadlineStatus: record.deadline_status ?? 'unknown',
  employmentType: record.employment_type ?? undefined,
  workload: record.workload_hours_per_week ?? undefined,
  educationLevel: record.education_level ?? undefined,
  salaryRange: undefined,
  fundingLevel: record.funding_level ?? 'unspecified',
  supportsInternational: Boolean(record.supports_international),
  description: record.description_zh || record.description_en || '暂无岗位简介',
  requirements: record.requirements_zh || record.requirements_en || '暂无申请要求',
  applicationSteps:
    record.application_steps_zh || record.application_steps_en || '暂无申请流程说明',
  tags: record.tags ?? [],
  status: record.status ?? 'open',
  matchScore: record.match_score ?? 50,
  lastScrapedAt: record.last_scraped_at ?? undefined,
});

const buildQueryString = (options: FetchPhdPositionsOptions = {}) => {
  const params = new URLSearchParams();
  if (options.status && options.status !== 'all') params.set('status', options.status);
  if (options.funding && options.funding !== 'all') params.set('funding', options.funding);
  if (options.country && options.country !== 'all') params.set('country', options.country);
  if (options.tags && options.tags.length > 0) params.set('tags', options.tags.join(','));
  if (options.search) params.set('search', options.search);
  if (options.limit) params.set('limit', String(options.limit));
  if (options.offset) params.set('offset', String(options.offset));
  if (options.sort) params.set('sort', options.sort);
  if (options.order) params.set('order', options.order);
  if (options.sourceId) params.set('source_id', options.sourceId);
  return params.toString();
};

export const fetchPhdPositions = async (options: FetchPhdPositionsOptions = {}) => {
  if (!FUNCTION_ENDPOINT) {
    throw new Error('缺少 Supabase Functions 配置，请检查 VITE_SUPABASE_URL');
  }

  const queryString = buildQueryString(options);
  const response = await fetch(
    queryString ? `${FUNCTION_ENDPOINT}?${queryString}` : FUNCTION_ENDPOINT,
    {
      method: 'GET',
      headers: baseHeaders,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || '加载博士岗位数据失败');
  }

  const payload: { data: SupabasePhdRecord[]; count: number } = await response.json();
  return {
    positions: payload.data.map(mapRecord),
    count: payload.count,
  };
};

export const fetchPhdPositionById = async (sourceId: string) => {
  const { positions } = await fetchPhdPositions({ sourceId, limit: 1 });
  return positions[0] ?? null;
};


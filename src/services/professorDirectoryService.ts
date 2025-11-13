import supabase from '@/lib/supabase';
import {
  SortMode,
  FundingIntensity,
  ProfessorFilterOptions,
  ProfessorProfile,
  ApplicationWindow,
  FundingOption,
  PhDRequirement,
  PlacementRecord,
  ResearchProject,
  SchoolInfo,
} from '@/pages/admin/ProfessorDirectory/types';

export interface ProfessorQueryParams {
  searchTerm?: string;
  countries?: string[];
  universities?: string[];
  researchTags?: string[];
  fundingTypes?: FundingIntensity[];
  intakes?: string[];
  onlyInternational?: boolean;
  sortMode?: SortMode;
  page?: number;
  pageSize?: number;
}

export interface ProfessorMatchPayload {
  professorId: number;
  studentId: number;
  employeeId: number;
  targetIntake: string;
  customNote?: string;
}

export interface StudentMatchOption {
  id: number;
  name: string;
  educationLevel?: string | null;
  status?: string | null;
  primaryService?: string | null;
}

export interface FetchProfessorsResult {
  profiles: ProfessorProfile[];
  total: number;
}

export interface ProfessorUpdatePayload {
  primaryTitle?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  personalPage?: string | null;
  phdSupervisionStatus?: string | null;
  acceptsInternationalStudents?: boolean;
  internalNotes?: string | null;
}

type SchoolRow = {
  id: string;
  en_name: string;
  cn_name: string | null;
  country: string;
  city: string | null;
  qs_rank_2024: number | null;
  qs_rank_2025: number | null;
  logo_url: string | null;
  website_url: string | null;
};

type ProfessorRow = {
  id: number;
  name: string;
  avatar_url: string | null;
  profile_url: string | null;
  primary_title: string | null;
  additional_titles: string[] | null;
  biography: string | null;
  education: string[] | null;
  research_interests: string[] | null;
  research_projects: unknown;
  awards: string[] | null;
  courses: string[] | null;
  school_id: string | null;
  schools: SchoolRow | SchoolRow[] | null;  // Supabase JOIN可能返回对象或数组
  university: string;
  college: string | null;
  country: string;
  city: string | null;
  research_tags: string[] | null;
  signature_projects: string[] | null;
  contact_email: string | null;
  contact_phone: string | null;
  personal_page: string | null;
  publications: unknown;
  accepts_international_students: boolean | null;
  phd_supervision_status: string | null;
  phd_requirements: unknown;
  funding_options: unknown;
  funding_types: string[] | null;
  application_window: unknown;
  intake: string | null;
  recent_placements: unknown;
  last_reviewed_at: string | null;
  internal_notes: string | null;
  match_score: number | null;
  response_time: string | null;
};

const isJsonArray = (value: unknown): value is Record<string, unknown>[] => Array.isArray(value);
const isJsonObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item === null || item === undefined) return '';
      return String(item).trim();
    })
    .filter((item) => item.length > 0);
};

const toResearchProjects = (value: unknown): ResearchProject[] => {
  if (!isJsonArray(value)) return [];
  const projects: ResearchProject[] = [];
  value.forEach((item) => {
    if (!isJsonObject(item)) return;
    const titleRaw = item['title'];
    const title = titleRaw ? String(titleRaw).trim() : '';
    if (!title) return;
    const descriptionRaw = item['description'];
    const description = descriptionRaw ? String(descriptionRaw) : undefined;
    const tags = toStringArray(item['tags']);
    const project: ResearchProject = {
      title,
      ...(description ? { description } : {}),
      ...(tags.length > 0 ? { tags } : {}),
    };
    projects.push(project);
  });
  return projects;
};

const toApplicationWindow = (value: unknown): ApplicationWindow => {
  if (!isJsonObject(value)) {
    return { start: '', end: '', intake: '' };
  }

  return {
    start: String(value.start ?? ''),
    end: String(value.end ?? ''),
    intake: String(value.intake ?? ''),
  };
};

const toFundingOptions = (value: unknown): FundingOption[] => {
  if (!isJsonArray(value)) return [];
  return value
    .map((item) => {
      if (!isJsonObject(item)) return null;
      const type = String(item.type ?? '') as FundingIntensity;
      const description = String(item.description ?? '');
      if (!type || !description) return null;
      return { type, description };
    })
    .filter(Boolean) as FundingOption[];
};

const toPublications = (value: unknown): { title: string; year: number; link?: string }[] => {
  if (!isJsonArray(value)) return [];
  return value
    .map((item) => {
      if (!isJsonObject(item)) return null;
      const title = String(item.title ?? '');
      const year = Number(item.year ?? 0);
      const link = item.link ? String(item.link) : undefined;
      if (!title || Number.isNaN(year)) return null;
      return { title, year, link };
    })
    .filter(Boolean) as { title: string; year: number; link?: string }[];
};

const toPhdRequirements = (value: unknown): PhDRequirement => {
  if (!isJsonObject(value)) {
    return {
      languageTests: [],
      researchExperience: '',
      recommendationLetters: 0,
    };
  }

  const language = Array.isArray(value.languageTests)
    ? value.languageTests.map((item: unknown) => String(item))
    : [];

  return {
    languageTests: language,
    minimumGPA: value.minimumGPA ? String(value.minimumGPA) : undefined,
    publicationsPreferred: value.publicationsPreferred ? String(value.publicationsPreferred) : undefined,
    researchExperience: String(value.researchExperience ?? ''),
    recommendationLetters: Number(value.recommendationLetters ?? 0),
    additionalNotes: value.additionalNotes ? String(value.additionalNotes) : undefined,
  };
};

const toPlacements = (value: unknown): PlacementRecord[] => {
  if (!isJsonArray(value)) return [];
  return value
    .map((item) => {
      if (!isJsonObject(item)) return null;
      const year = Number(item.year ?? 0);
      const student = String(item.student ?? '');
      const destination = String(item.destination ?? '');
      const highlight = item.highlight ? String(item.highlight) : undefined;
      if (Number.isNaN(year) || !student || !destination) return null;
      return { year, student, destination, highlight };
    })
    .filter(Boolean) as PlacementRecord[];
};

const mapProfessorRow = (row: ProfessorRow): ProfessorProfile => {
  // Supabase JOIN返回的schools可能是单个对象或数组，取第一个
  const schoolData = Array.isArray(row.schools) ? row.schools[0] : row.schools;
  
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar_url ?? undefined,
    profileUrl: row.profile_url ?? undefined,
    primaryTitle: row.primary_title ?? undefined,
    additionalTitles: row.additional_titles ? toStringArray(row.additional_titles) : [],
    biography: row.biography ?? undefined,
    education: toStringArray(row.education),
    researchInterests: toStringArray(row.research_interests),
    researchProjects: toResearchProjects(row.research_projects),
    awards: toStringArray(row.awards),
    courses: toStringArray(row.courses),
    schoolId: row.school_id ?? undefined,
    school: schoolData ? {
      id: schoolData.id,
      enName: schoolData.en_name,
      cnName: schoolData.cn_name ?? undefined,
      country: schoolData.country,
      city: schoolData.city ?? undefined,
      qsRank2024: schoolData.qs_rank_2024 ?? undefined,
      qsRank2025: schoolData.qs_rank_2025 ?? undefined,
      logoUrl: schoolData.logo_url ?? undefined,
      websiteUrl: schoolData.website_url ?? undefined,
    } : undefined,
    university: row.university,
    college: row.college ?? '',
    country: row.country,
    city: row.city ?? undefined,
    researchTags: row.research_tags ?? [],
    signatureProjects: row.signature_projects ?? [],
    contactEmail: row.contact_email ?? '',
    contactPhone: row.contact_phone ?? undefined,
    personalPage: row.personal_page ?? undefined,
    publications: toPublications(row.publications),
    acceptsInternationalStudents: row.accepts_international_students ?? true,
    phdSupervisionStatus: row.phd_supervision_status ?? '',
    phdRequirements: toPhdRequirements(row.phd_requirements),
    fundingOptions: toFundingOptions(row.funding_options),
    applicationWindow: toApplicationWindow(row.application_window),
    intake: row.intake ?? '',
    recentPlacements: toPlacements(row.recent_placements),
    lastReviewedAt: row.last_reviewed_at ?? '',
    internalNotes: row.internal_notes ?? '',
    matchScore: row.match_score ?? 0,
    responseTime: row.response_time ?? '',
  };
};

const sortProfessorsInMemory = (items: ProfessorProfile[], mode: SortMode = 'matchScore'): ProfessorProfile[] => {
  const cloned = [...items];
  switch (mode) {
    case 'recentlyReviewed':
      return cloned.sort((a, b) => (b.lastReviewedAt || '').localeCompare(a.lastReviewedAt || ''));
    case 'fundingPriority':
      return cloned.sort((a, b) => {
        const score = (item: ProfessorProfile) => {
          if (item.fundingOptions.some((option) => option.type === '全额奖学金')) return 2;
          if (item.fundingOptions.some((option) => option.type === '部分奖学金')) return 1;
          return 0;
        };
        return score(b) - score(a) || b.matchScore - a.matchScore;
      });
    case 'matchScore':
    default:
      return cloned.sort((a, b) => b.matchScore - a.matchScore);
  }
};

export const fetchProfessorFilters = async (): Promise<ProfessorFilterOptions> => {
  const { data, error } = await supabase
    .from('professors')
    .select('country, university, research_tags, funding_types, intake')
    .eq('is_active', true);

  if (error) {
    throw error;
  }

  const countries = new Set<string>();
  const universitiesByCountry: Record<string, Set<string>> = {};
  const researchTagsByCountry: Record<string, Set<string>> = {};
  const fundingTypes = new Set<string>();
  const intakes = new Set<string>();
  const tagFrequency: Record<string, number> = {};

  data.forEach((row) => {
    if (!row.country) return;
    countries.add(row.country);

    if (!universitiesByCountry[row.country]) {
      universitiesByCountry[row.country] = new Set<string>();
    }
    if (row.university) {
      universitiesByCountry[row.country]!.add(row.university);
    }

    if (!researchTagsByCountry[row.country]) {
      researchTagsByCountry[row.country] = new Set<string>();
    }
    (row.research_tags ?? []).forEach((tag: string) => {
      researchTagsByCountry[row.country]!.add(tag);
      tagFrequency[tag] = (tagFrequency[tag] ?? 0) + 1;
    });

    (row.funding_types ?? []).forEach((type: string) => fundingTypes.add(type));
    if (row.intake) {
      intakes.add(row.intake);
    }
  });

  const topResearchTags = Object.entries(tagFrequency)
    .sort((a, b) => {
      if (b[1] === a[1]) {
        return a[0].localeCompare(b[0]);
      }
      return b[1] - a[1];
    })
    .map(([tag]) => tag);

  const toSortedArray = (record: Record<string, Set<string>>) =>
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, Array.from(value).sort((a, b) => a.localeCompare(b))]),
    );

  return {
    countries: Array.from(countries).sort((a, b) => a.localeCompare(b)),
    universitiesByCountry: toSortedArray(universitiesByCountry),
    researchTagsByCountry: toSortedArray(researchTagsByCountry),
    topResearchTags,
    fundingTypes: Array.from(fundingTypes) as FundingIntensity[],
    intakes: Array.from(intakes).sort((a, b) => a.localeCompare(b)),
  };
};

export const fetchProfessors = async (params: ProfessorQueryParams): Promise<FetchProfessorsResult> => {
  const {
    searchTerm,
    countries = [],
    universities = [],
    researchTags = [],
    fundingTypes = [],
    intakes = [],
    onlyInternational = true,
    sortMode = 'matchScore',
    page = 1,
    pageSize = 30,
  } = params;

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  let query = supabase
    .from('professors')
    .select(
      `
        id,
        name,
        avatar_url,
        profile_url,
        primary_title,
        additional_titles,
        biography,
        education,
        research_interests,
        research_projects,
        awards,
        courses,
        school_id,
        schools (
          id,
          en_name,
          cn_name,
          country,
          city,
          qs_rank_2024,
          qs_rank_2025,
          logo_url,
          website_url
        ),
        university,
        college,
        country,
        city,
        research_tags,
        signature_projects,
        contact_email,
        contact_phone,
        personal_page,
        publications,
        accepts_international_students,
        phd_supervision_status,
        phd_requirements,
        funding_options,
        funding_types,
        application_window,
        intake,
        recent_placements,
        last_reviewed_at,
        internal_notes,
        match_score,
        response_time
      `,
      { count: 'exact' },
    )
    .eq('is_active', true)
    .range(from, to);

  if (countries.length > 0) {
    query = query.in('country', countries);
  }

  if (universities.length > 0) {
    query = query.in('university', universities);
  }

  if (researchTags.length > 0) {
    query = query.contains('research_tags', researchTags);
  }

  if (fundingTypes.length > 0) {
    query = query.contains('funding_types', fundingTypes);
  }

  if (intakes.length > 0) {
    query = query.in('intake', intakes);
  }

  if (onlyInternational) {
    query = query.eq('accepts_international_students', true);
  }

  if (searchTerm && searchTerm.trim()) {
    const normalized = searchTerm.trim();
    const likeTerm = `%${normalized}%`;
    query = query.or(
      [
        `name.ilike.${likeTerm}`,
        `university.ilike.${likeTerm}`,
        `college.ilike.${likeTerm}`,
        `country.ilike.${likeTerm}`,
        `phd_supervision_status.ilike.${likeTerm}`,
      ].join(','),
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  const mapped = (data ?? []).map((row) => mapProfessorRow(row as ProfessorRow));
  const sorted = sortProfessorsInMemory(mapped, sortMode);
  return {
    profiles: sorted,
    total: count ?? sorted.length,
  };
};

const mapProfessorUpdatePayload = (payload: ProfessorUpdatePayload) => {
  const update: Record<string, unknown> = {};
  if (payload.primaryTitle !== undefined) {
    update.primary_title = payload.primaryTitle ?? null;
  }
  if (payload.contactEmail !== undefined) {
    update.contact_email = payload.contactEmail ?? null;
  }
  if (payload.contactPhone !== undefined) {
    update.contact_phone = payload.contactPhone ?? null;
  }
  if (payload.personalPage !== undefined) {
    update.personal_page = payload.personalPage ?? null;
  }
  if (payload.phdSupervisionStatus !== undefined) {
    update.phd_supervision_status = payload.phdSupervisionStatus ?? null;
  }
  if (payload.acceptsInternationalStudents !== undefined) {
    update.accepts_international_students = payload.acceptsInternationalStudents;
  }
  if (payload.internalNotes !== undefined) {
    update.internal_notes = payload.internalNotes ?? null;
  }
  return update;
};

export const updateProfessorProfile = async (
  id: number,
  payload: ProfessorUpdatePayload,
): Promise<void> => {
  const update = mapProfessorUpdatePayload(payload);
  if (Object.keys(update).length === 0) {
    return;
  }
  const { error } = await supabase
    .from('professors')
    .update(update)
    .eq('id', id);
  if (error) {
    throw error;
  }
};

export const deleteProfessor = async (id: number): Promise<void> => {
  const { error } = await supabase.from('professors').delete().eq('id', id);
  if (error) {
    throw error;
  }
};

export const fetchProfessorDetail = async (id: number): Promise<ProfessorProfile | null> => {
  const { data, error } = await supabase
    .from('professors')
    .select(
      `
        id,
        name,
        avatar_url,
        profile_url,
        primary_title,
        additional_titles,
        biography,
        education,
        research_interests,
        research_projects,
        awards,
        courses,
        school_id,
        schools (
          id,
          en_name,
          cn_name,
          country,
          city,
          qs_rank_2024,
          qs_rank_2025,
          logo_url,
          website_url
        ),
        university,
        college,
        country,
        city,
        research_tags,
        signature_projects,
        contact_email,
        contact_phone,
        personal_page,
        publications,
        accepts_international_students,
        phd_supervision_status,
        phd_requirements,
        funding_options,
        funding_types,
        application_window,
        intake,
        recent_placements,
        last_reviewed_at,
        internal_notes,
        match_score,
        response_time
      `,
    )
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) return null;
  return mapProfessorRow(data as ProfessorRow);
};

export const fetchProfessorFavorites = async (employeeId: number): Promise<number[]> => {
  const { data, error } = await supabase
    .from('professor_favorites')
    .select('professor_id')
    .eq('employee_id', employeeId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => Number(row.professor_id));
};

export const fetchSchoolById = async (schoolId: string): Promise<SchoolInfo | null> => {
  const { data, error } = await supabase
    .from('schools')
    .select(
      `
        id,
        en_name,
        cn_name,
        country,
        city,
        qs_rank_2024,
        qs_rank_2025,
        logo_url,
        website_url
      `,
    )
    .eq('id', schoolId)
    .maybeSingle();

  if (error) {
    console.error('[fetchSchoolById] 查询学校信息失败', error);
    return null;
  }

  if (!data) return null;

  const school: SchoolInfo = {
    id: data.id,
    enName: data.en_name,
    cnName: data.cn_name ?? undefined,
    country: data.country,
    city: data.city ?? undefined,
    qsRank2024: data.qs_rank_2024 ?? undefined,
    qsRank2025: data.qs_rank_2025 ?? undefined,
    logoUrl: data.logo_url ?? undefined,
    websiteUrl: data.website_url ?? undefined,
  };

  return school;
};

export const addProfessorFavorite = async (professorId: number, employeeId: number): Promise<void> => {
  const { error } = await supabase
    .from('professor_favorites')
    .insert({ professor_id: professorId, employee_id: employeeId })
    .select('id')
    .single();

  if (error && error.code !== '23505') {
    throw error;
  }
};

export const removeProfessorFavorite = async (professorId: number, employeeId: number): Promise<void> => {
  const { error } = await supabase
    .from('professor_favorites')
    .delete()
    .eq('professor_id', professorId)
    .eq('employee_id', employeeId);

  if (error) {
    throw error;
  }
};

export const createProfessorMatchRecord = async ({
  professorId,
  studentId,
  employeeId,
  targetIntake,
  customNote,
}: ProfessorMatchPayload): Promise<void> => {
  const { error } = await supabase.from('professor_match_records').insert({
    professor_id: professorId,
    student_id: studentId,
    employee_id: employeeId,
    target_intake: targetIntake,
    custom_note: customNote,
  });

  if (error) {
    throw error;
  }
};

export const fetchStudentsForMatching = async (limit = 30): Promise<StudentMatchOption[]> => {
  const { data, error } = await supabase
    .from('students')
    .select('id, name, education_level, status')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: Number(row.id),
    name: row.name ?? '未命名学生',
    educationLevel: row.education_level,
    status: row.status,
  }));
};


import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[phd-positions] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SORT_COLUMN_MAP: Record<string, string> = {
  deadline: 'deadline',
  match_score: 'match_score',
  university: 'university',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const limitParam = Number(searchParams.get('limit') ?? '100');
    const offsetParam = Number(searchParams.get('offset') ?? '0');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 100;
    const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0;

    const statusFilter = searchParams.get('status');
    const fundingFilter = searchParams.get('funding');
    const countryFilter = searchParams.get('country');
    const supportsInternational = searchParams.get('international');
    const tagsParam = searchParams.get('tags');
    const searchValue = searchParams.get('search');
    const sourceId = searchParams.get('source_id');
    const sortParam = searchParams.get('sort') ?? 'deadline';
    const orderParam = searchParams.get('order') ?? 'asc';

    const sortColumn = SORT_COLUMN_MAP[sortParam] ?? 'deadline';
    const ascending = orderParam !== 'desc';

    let query = supabase
      .from('phd_positions')
      .select('*', { count: 'exact' })
      .order(sortColumn, { ascending, nullsLast: true })
      .range(offset, offset + limit - 1);

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (fundingFilter && fundingFilter !== 'all') {
      query = query.eq('funding_level', fundingFilter);
    }

    if (countryFilter && countryFilter !== 'all') {
      query = query.eq('country', countryFilter);
    }

    if (supportsInternational === 'true') {
      query = query.eq('supports_international', true);
    } else if (supportsInternational === 'false') {
      query = query.eq('supports_international', false);
    }

    if (sourceId) {
      query = query.eq('source_id', sourceId);
    }

    if (tagsParam) {
      const tags = tagsParam
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (tags.length > 0) {
        query = query.contains('tags', tags);
      }
    }

    if (searchValue) {
      const escaped = searchValue.replace(/,/g, '\\,').trim();
      if (escaped) {
        const pattern = `%${escaped}%`;
        query = query.or(
          [
            `title_en.ilike.${pattern}`,
            `title_zh.ilike.${pattern}`,
            `university.ilike.${pattern}`,
            `city.ilike.${pattern}`,
            `description_en.ilike.${pattern}`,
          ].join(','),
        );
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[phd-positions] Query error', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ data: data ?? [], count: count ?? 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[phd-positions] Unexpected error', error);
    return new Response(JSON.stringify({ error: error.message ?? 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


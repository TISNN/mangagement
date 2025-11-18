/**
 * 空间需求管理服务
 */

import { supabase } from '../../../../lib/supabase';
import type {
  SpaceRequest,
  CreateRequestData,
  UpdateRequestData,
  RequestFilters,
  RequestStats,
} from '../types';

/**
 * 创建需求
 */
export async function createRequest(
  data: CreateRequestData,
  userId: number
): Promise<SpaceRequest> {
  try {
    const { data: request, error } = await supabase
      .from('shared_office_requests')
      .insert({
        ...data,
        requester_id: userId,
        requester_type: 'employee',
        status: 'published',
        created_by: userId,
        updated_by: userId,
      })
      .select(`
        *,
        employees:requester_id(name)
      `)
      .single();

    if (error) throw error;
    return transformRequest(request);
  } catch (error) {
    console.error('创建需求失败:', error);
    throw error;
  }
}

/**
 * 更新需求
 */
export async function updateRequest(
  id: number,
  data: UpdateRequestData,
  userId: number
): Promise<SpaceRequest> {
  try {
    const { data: request, error } = await supabase
      .from('shared_office_requests')
      .update({
        ...data,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('requester_id', userId)
      .select(`
        *,
        employees:requester_id(name)
      `)
      .single();

    if (error) throw error;
    return transformRequest(request);
  } catch (error) {
    console.error('更新需求失败:', error);
    throw error;
  }
}

/**
 * 获取需求列表
 */
export async function getRequests(filters?: RequestFilters): Promise<{
  data: SpaceRequest[];
  total: number;
  page: number;
  limit: number;
}> {
  try {
    let query = supabase
      .from('shared_office_requests')
      .select(`
        *,
        employees:requester_id(name)
      `, { count: 'exact' });

    // 搜索过滤
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // 城市过滤
    if (filters?.target_cities && filters.target_cities.length > 0) {
      query = query.contains('target_cities', filters.target_cities);
    }

    // 类型过滤
    if (filters?.request_type && filters.request_type !== 'all') {
      query = query.eq('request_type', filters.request_type);
    }

    // 状态过滤
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // 紧急程度过滤
    if (filters?.urgency && filters.urgency !== 'all') {
      query = query.eq('urgency', filters.urgency);
    }

    // 日期范围过滤
    if (filters?.use_date_from) {
      query = query.gte('use_date', filters.use_date_from);
    }
    if (filters?.use_date_to) {
      query = query.lte('use_date', filters.use_date_to);
    }

    // 需求方过滤
    if (filters?.requester_id) {
      query = query.eq('requester_id', filters.requester_id);
    }

    // 分页
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: (data || []).map(transformRequest),
      total: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error('获取需求列表失败:', error);
    throw error;
  }
}

/**
 * 获取需求详情
 */
export async function getRequestById(id: number): Promise<SpaceRequest | null> {
  try {
    const { data, error } = await supabase
      .from('shared_office_requests')
      .select(`
        *,
        employees:requester_id(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return transformRequest(data);
  } catch (error) {
    console.error('获取需求详情失败:', error);
    throw error;
  }
}

/**
 * 获取我的需求列表
 */
export async function getMyRequests(
  userId: number,
  filters?: { status?: string; search?: string }
): Promise<SpaceRequest[]> {
  try {
    let query = supabase
      .from('shared_office_requests')
      .select(`
        *,
        employees:requester_id(name)
      `)
      .eq('requester_id', userId)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformRequest);
  } catch (error) {
    console.error('获取我的需求列表失败:', error);
    throw error;
  }
}

/**
 * 取消需求
 */
export async function cancelRequest(id: number, userId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('shared_office_requests')
      .update({
        status: 'cancelled',
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('requester_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('取消需求失败:', error);
    throw error;
  }
}

/**
 * 获取需求统计
 */
export async function getRequestStats(userId?: number): Promise<RequestStats> {
  try {
    let query = supabase.from('shared_office_requests').select('status', { count: 'exact' });

    if (userId) {
      query = query.eq('requester_id', userId);
    }

    query = query.neq('status', 'cancelled');

    const { data, error } = await query;

    if (error) throw error;

    const stats: RequestStats = {
      total: 0,
      published: 0,
      matching: 0,
      booked: 0,
      completed: 0,
    };

    if (data) {
      stats.total = data.length;
      data.forEach((item: any) => {
        if (item.status === 'published') stats.published++;
        else if (item.status === 'matching') stats.matching++;
        else if (item.status === 'booked') stats.booked++;
        else if (item.status === 'completed') stats.completed++;
      });
    }

    return stats;
  } catch (error) {
    console.error('获取需求统计失败:', error);
    throw error;
  }
}

/**
 * 转换数据库数据为前端格式
 */
function transformRequest(data: any): SpaceRequest {
  return {
    id: data.id,
    title: data.title,
    request_type: data.request_type,
    description: data.description,
    target_cities: Array.isArray(data.target_cities) ? data.target_cities : [],
    target_districts: Array.isArray(data.target_districts) ? data.target_districts : [],
    max_distance: data.max_distance,
    use_date: data.use_date,
    use_time_start: data.use_time_start,
    use_time_end: data.use_time_end,
    duration_hours: data.duration_hours ? parseFloat(data.duration_hours) : undefined,
    expected_capacity: data.expected_capacity,
    required_facilities: Array.isArray(data.required_facilities) ? data.required_facilities : [],
    preferences: data.preferences,
    budget_range: data.budget_range,
    max_budget: data.max_budget ? parseFloat(data.max_budget) : undefined,
    status: data.status,
    urgency: data.urgency || 'normal',
    matched_space_id: data.matched_space_id,
    booking_id: data.booking_id,
    requester_id: data.requester_id,
    requester_type: data.requester_type || 'employee',
    requester_name: data.employees?.name,
    created_at: data.created_at,
    updated_at: data.updated_at,
    expires_at: data.expires_at,
  };
}


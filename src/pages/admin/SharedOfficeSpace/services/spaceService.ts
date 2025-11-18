/**
 * 共享办公空间管理服务
 * 处理所有与空间相关的数据库操作
 */

import { supabase } from '../../../../lib/supabase';
import type {
  OfficeSpace,
  CreateSpaceData,
  UpdateSpaceData,
  SpaceFilters,
  SpaceStats,
} from '../types';

/**
 * 创建空间
 */
export async function createSpace(
  data: CreateSpaceData,
  userId: number
): Promise<OfficeSpace> {
  try {
    const { data: space, error } = await supabase
      .from('shared_office_spaces')
      .insert({
        ...data,
        provider_id: userId,
        provider_type: 'employee',
        status: 'pending', // 默认待审核
        created_by: userId,
        updated_by: userId,
      })
      .select(`
        *,
        employees:provider_id(name)
      `)
      .single();

    if (error) throw error;
    return transformSpace(space);
  } catch (error) {
    console.error('创建空间失败:', error);
    throw error;
  }
}

/**
 * 更新空间
 */
export async function updateSpace(
  id: number,
  data: UpdateSpaceData,
  userId: number
): Promise<OfficeSpace> {
  try {
    const { data: space, error } = await supabase
      .from('shared_office_spaces')
      .update({
        ...data,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        employees:provider_id(name)
      `)
      .single();

    if (error) throw error;
    return transformSpace(space);
  } catch (error) {
    console.error('更新空间失败:', error);
    throw error;
  }
}

/**
 * 获取空间列表
 */
export async function getSpaces(filters?: SpaceFilters): Promise<{
  data: OfficeSpace[];
  total: number;
  page: number;
  limit: number;
}> {
  try {
    let query = supabase
      .from('shared_office_spaces')
      .select(`
        *,
        employees:provider_id(name)
      `, { count: 'exact' });

    // 搜索过滤
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
      );
    }

    // 城市过滤
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    // 区域过滤
    if (filters?.district) {
      query = query.eq('district', filters.district);
    }

    // 类型过滤
    if (filters?.space_type && filters.space_type !== 'all') {
      query = query.eq('space_type', filters.space_type);
    }

    // 价格模式过滤
    if (filters?.pricing_model && filters.pricing_model !== 'all') {
      query = query.eq('pricing_model', filters.pricing_model);
    }

    // 价格范围过滤
    if (filters?.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    // 容量过滤
    if (filters?.min_capacity) {
      query = query.gte('capacity', filters.min_capacity);
    }

    // 认证状态过滤
    if (filters?.is_verified !== undefined) {
      query = query.eq('is_verified', filters.is_verified);
    }

    // 状态过滤
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    } else {
      // 默认只显示已发布的空间
      query = query.eq('status', 'released');
    }

    // 可用性过滤
    query = query.eq('is_available', true);

    // 分页
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    // 排序
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: (data || []).map(transformSpace),
      total: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error('获取空间列表失败:', error);
    throw error;
  }
}

/**
 * 获取空间详情
 */
export async function getSpaceById(id: number): Promise<OfficeSpace | null> {
  try {
    const { data, error } = await supabase
      .from('shared_office_spaces')
      .select(`
        *,
        employees:provider_id(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // 未找到
      }
      throw error;
    }

    // 增加浏览次数
    await supabase
      .from('shared_office_spaces')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return transformSpace(data);
  } catch (error) {
    console.error('获取空间详情失败:', error);
    throw error;
  }
}

/**
 * 获取我的空间列表
 */
export async function getMySpaces(
  userId: number,
  filters?: { status?: string; search?: string }
): Promise<OfficeSpace[]> {
  try {
    let query = supabase
      .from('shared_office_spaces')
      .select(`
        *,
        employees:provider_id(name)
      `)
      .eq('provider_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformSpace);
  } catch (error) {
    console.error('获取我的空间列表失败:', error);
    throw error;
  }
}

/**
 * 删除空间
 */
export async function deleteSpace(id: number, userId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('shared_office_spaces')
      .update({
        status: 'deleted',
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('provider_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('删除空间失败:', error);
    throw error;
  }
}

/**
 * 上架/下架空间
 */
export async function toggleSpaceStatus(
  id: number,
  status: 'released' | 'suspended',
  userId: number
): Promise<OfficeSpace> {
  try {
    const { data, error } = await supabase
      .from('shared_office_spaces')
      .update({
        status,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('provider_id', userId)
      .select(`
        *,
        employees:provider_id(name)
      `)
      .single();

    if (error) throw error;
    return transformSpace(data);
  } catch (error) {
    console.error('更新空间状态失败:', error);
    throw error;
  }
}

/**
 * 获取空间统计
 */
export async function getSpaceStats(userId?: number): Promise<SpaceStats> {
  try {
    let query = supabase.from('shared_office_spaces').select('status', { count: 'exact' });

    if (userId) {
      query = query.eq('provider_id', userId);
    }

    query = query.neq('status', 'deleted');

    const { data, error } = await query;

    if (error) throw error;

    const stats: SpaceStats = {
      total: 0,
      released: 0,
      pending: 0,
      suspended: 0,
      total_bookings: 0,
    };

    if (data) {
      stats.total = data.length;
      data.forEach((item: any) => {
        if (item.status === 'released') stats.released++;
        else if (item.status === 'pending') stats.pending++;
        else if (item.status === 'suspended') stats.suspended++;
      });
    }

    // 获取预约总数
    if (userId) {
      const { count } = await supabase
        .from('shared_office_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', userId);
      stats.total_bookings = count || 0;
    }

    return stats;
  } catch (error) {
    console.error('获取空间统计失败:', error);
    throw error;
  }
}

/**
 * 转换数据库数据为前端格式
 */
function transformSpace(data: any): OfficeSpace {
  return {
    id: data.id,
    name: data.name,
    space_type: data.space_type,
    description: data.description,
    address: data.address,
    city: data.city,
    district: data.district,
    street: data.street,
    building: data.building,
    latitude: data.latitude ? parseFloat(data.latitude) : undefined,
    longitude: data.longitude ? parseFloat(data.longitude) : undefined,
    area: data.area ? parseFloat(data.area) : undefined,
    capacity: data.capacity,
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    photos: Array.isArray(data.photos) ? data.photos : [],
    available_days: Array.isArray(data.available_days) ? data.available_days : [],
    available_time_slots: Array.isArray(data.available_time_slots)
      ? data.available_time_slots
      : [],
    is_available: data.is_available ?? true,
    pricing_model: data.pricing_model,
    price: data.price ? parseFloat(data.price) : undefined,
    currency: data.currency || 'CNY',
    rules: data.rules,
    special_notes: data.special_notes,
    is_verified: data.is_verified ?? false,
    verification_docs: Array.isArray(data.verification_docs)
      ? data.verification_docs
      : [],
    status: data.status,
    view_count: data.view_count || 0,
    booking_count: data.booking_count || 0,
    completed_count: data.completed_count || 0,
    average_rating: data.average_rating ? parseFloat(data.average_rating) : 0,
    rating_count: data.rating_count || 0,
    provider_id: data.provider_id,
    provider_type: data.provider_type || 'employee',
    provider_name: data.employees?.name,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}


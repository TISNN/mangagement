/**
 * 预约管理服务
 */

import { supabase } from '../../../../lib/supabase';
import type {
  Booking,
  CreateBookingData,
  BookingFilters,
  BookingStats,
} from '../types';

/**
 * 创建预约申请
 */
export async function createBooking(
  data: CreateBookingData,
  userId: number
): Promise<Booking> {
  try {
    // 先获取空间信息以获取提供方ID
    const { data: space, error: spaceError } = await supabase
      .from('shared_office_spaces')
      .select('provider_id, pricing_model, price')
      .eq('id', data.space_id)
      .single();

    if (spaceError) throw spaceError;

    const { data: booking, error } = await supabase
      .from('shared_office_bookings')
      .insert({
        ...data,
        requester_id: userId,
        provider_id: space.provider_id,
        pricing_model: space.pricing_model,
        price: space.price,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `)
      .single();

    if (error) throw error;

    // 更新需求的匹配状态
    if (data.request_id) {
      await supabase
        .from('shared_office_requests')
        .update({
          status: 'matching',
          matched_space_id: data.space_id,
          booking_id: booking.id,
        })
        .eq('id', data.request_id);
    }

    // 更新空间的预约次数
    await supabase.rpc('increment_booking_count', { space_id: data.space_id });

    return transformBooking(booking);
  } catch (error) {
    console.error('创建预约失败:', error);
    throw error;
  }
}

/**
 * 审核预约申请
 */
export async function reviewBooking(
  bookingId: number,
  action: 'approve' | 'reject',
  providerId: number,
  reason?: string
): Promise<Booking> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (action === 'approve') {
      updateData.status = 'confirmed';
      updateData.confirmed_at = new Date().toISOString();
    } else {
      updateData.status = 'cancelled';
      updateData.cancellation_reason = reason;
      updateData.cancelled_by = providerId;
      updateData.cancelled_at = new Date().toISOString();
    }

    const { data: booking, error } = await supabase
      .from('shared_office_bookings')
      .update(updateData)
      .eq('id', bookingId)
      .eq('provider_id', providerId)
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `)
      .single();

    if (error) throw error;

    // 如果确认，更新需求状态
    if (action === 'approve' && booking.request_id) {
      await supabase
        .from('shared_office_requests')
        .update({ status: 'booked' })
        .eq('id', booking.request_id);
    }

    return transformBooking(booking);
  } catch (error) {
    console.error('审核预约失败:', error);
    throw error;
  }
}

/**
 * 取消预约
 */
export async function cancelBooking(
  bookingId: number,
  userId: number,
  reason: string
): Promise<Booking> {
  try {
    const { data: booking, error } = await supabase
      .from('shared_office_bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_by: userId,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `)
      .single();

    if (error) throw error;

    // 更新需求状态
    if (booking.request_id) {
      await supabase
        .from('shared_office_requests')
        .update({ status: 'published', matched_space_id: null, booking_id: null })
        .eq('id', booking.request_id);
    }

    return transformBooking(booking);
  } catch (error) {
    console.error('取消预约失败:', error);
    throw error;
  }
}

/**
 * 签到
 */
export async function checkIn(bookingId: number, userId: number): Promise<Booking> {
  try {
    const { data: booking, error } = await supabase
      .from('shared_office_bookings')
      .update({
        check_in_time: new Date().toISOString(),
        status: 'completed', // 使用中
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `)
      .single();

    if (error) throw error;
    return transformBooking(booking);
  } catch (error) {
    console.error('签到失败:', error);
    throw error;
  }
}

/**
 * 签退
 */
export async function checkOut(bookingId: number, userId: number): Promise<Booking> {
  try {
    const { data: booking, error } = await supabase
      .from('shared_office_bookings')
      .update({
        check_out_time: new Date().toISOString(),
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `)
      .single();

    if (error) throw error;

    // 更新空间完成次数
    await supabase.rpc('increment_completed_count', { space_id: booking.space_id });

    // 更新需求状态
    if (booking.request_id) {
      await supabase
        .from('shared_office_requests')
        .update({ status: 'completed' })
        .eq('id', booking.request_id);
    }

    return transformBooking(booking);
  } catch (error) {
    console.error('签退失败:', error);
    throw error;
  }
}

/**
 * 获取预约列表
 */
export async function getBookings(filters?: BookingFilters): Promise<{
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}> {
  try {
    let query = supabase
      .from('shared_office_bookings')
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `, { count: 'exact' });

    if (filters?.space_id) {
      query = query.eq('space_id', filters.space_id);
    }

    if (filters?.request_id) {
      query = query.eq('request_id', filters.request_id);
    }

    if (filters?.requester_id) {
      query = query.eq('requester_id', filters.requester_id);
    }

    if (filters?.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.booking_date_from) {
      query = query.gte('booking_date', filters.booking_date_from);
    }

    if (filters?.booking_date_to) {
      query = query.lte('booking_date', filters.booking_date_to);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: (data || []).map(transformBooking),
      total: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error('获取预约列表失败:', error);
    throw error;
  }
}

/**
 * 获取预约详情
 */
export async function getBookingById(id: number): Promise<Booking | null> {
  try {
    const { data, error } = await supabase
      .from('shared_office_bookings')
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*),
        requester:requester_id(name),
        provider:provider_id(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return transformBooking(data);
  } catch (error) {
    console.error('获取预约详情失败:', error);
    throw error;
  }
}

/**
 * 获取预约统计
 */
export async function getBookingStats(userId?: number, role?: 'requester' | 'provider'): Promise<BookingStats> {
  try {
    let query = supabase.from('shared_office_bookings').select('status', { count: 'exact' });

    if (userId) {
      if (role === 'requester') {
        query = query.eq('requester_id', userId);
      } else if (role === 'provider') {
        query = query.eq('provider_id', userId);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats: BookingStats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    if (data) {
      stats.total = data.length;
      data.forEach((item: any) => {
        if (item.status === 'pending') stats.pending++;
        else if (item.status === 'confirmed') stats.confirmed++;
        else if (item.status === 'completed') stats.completed++;
        else if (item.status === 'cancelled') stats.cancelled++;
      });
    }

    return stats;
  } catch (error) {
    console.error('获取预约统计失败:', error);
    throw error;
  }
}

/**
 * 转换数据库数据为前端格式
 */
function transformBooking(data: any): Booking {
  return {
    id: data.id,
    space_id: data.space_id,
    request_id: data.request_id,
    requester_id: data.requester_id,
    provider_id: data.provider_id,
    booking_date: data.booking_date,
    start_time: data.start_time,
    end_time: data.end_time,
    expected_attendees: data.expected_attendees,
    purpose: data.purpose,
    special_requirements: data.special_requirements,
    contact_phone: data.contact_phone,
    contact_wechat: data.contact_wechat,
    pricing_model: data.pricing_model,
    price: data.price ? parseFloat(data.price) : undefined,
    payment_status: data.payment_status || 'pending',
    payment_method: data.payment_method,
    payment_time: data.payment_time,
    status: data.status,
    cancellation_reason: data.cancellation_reason,
    cancelled_by: data.cancelled_by,
    cancelled_at: data.cancelled_at,
    check_in_time: data.check_in_time,
    check_out_time: data.check_out_time,
    actual_attendees: data.actual_attendees,
    usage_notes: data.usage_notes,
    requester_rated: data.requester_rated || false,
    provider_rated: data.provider_rated || false,
    created_at: data.created_at,
    updated_at: data.updated_at,
    confirmed_at: data.confirmed_at,
    completed_at: data.completed_at,
    // 关联数据
    space: data.shared_office_spaces,
    request: data.shared_office_requests,
    requester_name: data.requester?.name,
    provider_name: data.provider?.name,
  };
}


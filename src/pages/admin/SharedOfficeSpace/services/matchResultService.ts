/**
 * 匹配结果管理服务
 * 处理匹配结果的保存、查询和更新
 */

import { supabase } from '../../../../lib/supabase';
import type { MatchResult } from '../types';

/**
 * 保存匹配结果到数据库
 */
export async function saveMatchResults(
  matchResults: MatchResult[]
): Promise<void> {
  try {
    if (matchResults.length === 0) return;

    const records = matchResults.map((result) => ({
      space_id: result.space_id,
      request_id: result.request_id,
      match_score: result.match_score,
      location_score: result.location_score,
      time_score: result.time_score,
      type_score: result.type_score,
      capacity_score: result.capacity_score,
      price_score: result.price_score,
      facility_score: result.facility_score,
      status: result.status,
      is_auto_recommended: result.is_auto_recommended,
    }));

    const { error } = await supabase
      .from('shared_office_matches')
      .upsert(records, {
        onConflict: 'space_id,request_id',
        ignoreDuplicates: false,
      });

    if (error) throw error;
  } catch (error) {
    console.error('保存匹配结果失败:', error);
    throw error;
  }
}

/**
 * 获取需求的匹配结果
 */
export async function getMatchResultsByRequest(
  requestId: number
): Promise<MatchResult[]> {
  try {
    const { data, error } = await supabase
      .from('shared_office_matches')
      .select(`
        *,
        shared_office_spaces:space_id(*),
        shared_office_requests:request_id(*)
      `)
      .eq('request_id', requestId)
      .order('match_score', { ascending: false });

    if (error) throw error;

    return (data || []).map(transformMatchResult);
  } catch (error) {
    console.error('获取匹配结果失败:', error);
    throw error;
  }
}

/**
 * 更新匹配结果状态
 */
export async function updateMatchStatus(
  matchId: number,
  status: 'recommended' | 'viewed' | 'applied' | 'ignored'
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'viewed') {
      updateData.viewed_at = new Date().toISOString();
    } else if (status === 'applied') {
      updateData.applied_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('shared_office_matches')
      .update(updateData)
      .eq('id', matchId);

    if (error) throw error;
  } catch (error) {
    console.error('更新匹配状态失败:', error);
    throw error;
  }
}

/**
 * 转换数据库数据为前端格式
 */
function transformMatchResult(data: any): MatchResult {
  return {
    id: data.id,
    space_id: data.space_id,
    request_id: data.request_id,
    match_score: parseFloat(data.match_score),
    location_score: parseFloat(data.location_score || 0),
    time_score: parseFloat(data.time_score || 0),
    type_score: parseFloat(data.type_score || 0),
    capacity_score: parseFloat(data.capacity_score || 0),
    price_score: parseFloat(data.price_score || 0),
    facility_score: parseFloat(data.facility_score || 0),
    status: data.status,
    is_auto_recommended: data.is_auto_recommended || false,
    created_at: data.created_at,
    viewed_at: data.viewed_at,
    applied_at: data.applied_at,
    space: data.shared_office_spaces,
    request: data.shared_office_requests,
  };
}


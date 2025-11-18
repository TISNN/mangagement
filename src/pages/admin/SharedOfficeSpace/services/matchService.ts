/**
 * 匹配算法服务
 * 实现智能匹配算法，根据多个维度计算匹配分数
 */

import { getSpaces } from './spaceService';
import { getRequestById } from './requestService';
import type { SpaceRequest, OfficeSpace, MatchResult, SpaceType } from '../types';

// 匹配权重配置
const MATCH_WEIGHTS = {
  location: 0.3,    // 地理位置 30%
  time: 0.25,       // 时间 25%
  type: 0.2,        // 类型 20%
  capacity: 0.1,    // 容量 10%
  price: 0.1,       // 价格 10%
  facility: 0.05,  // 设施 5%
};

/**
 * 计算两点之间的直线距离（公里）
 * 使用 Haversine 公式
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球半径（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 计算地理位置匹配分（0-100）
 */
function calculateLocationScore(
  request: SpaceRequest,
  space: OfficeSpace
): number {
  // 如果需求没有指定城市，返回0分
  if (!request.target_cities || request.target_cities.length === 0) {
    return 0;
  }

  // 城市匹配
  const cityMatch = request.target_cities.includes(space.city);
  if (!cityMatch) {
    return 0; // 不同城市，直接返回0分
  }

  let score = 80; // 同城基础分

  // 区域匹配（如果指定了区域）
  if (request.target_districts && request.target_districts.length > 0) {
    if (space.district && request.target_districts.includes(space.district)) {
      score = 100; // 同区满分
    } else {
      score = 70; // 同城不同区
    }
  }

  // 距离匹配（如果需求指定了最大距离且有经纬度）
  if (
    request.max_distance &&
    space.latitude &&
    space.longitude &&
    request.target_cities.length === 1
  ) {
    // 如果有目标区域的经纬度，可以计算精确距离
    // 这里简化处理：如果有最大距离限制，同城同区给满分
    if (space.district && request.target_districts?.includes(space.district)) {
      score = 100;
    }
  }

  return Math.min(100, score);
}

/**
 * 计算时间匹配分（0-100）
 */
function calculateTimeScore(request: SpaceRequest, space: OfficeSpace): number {
  // 检查可用日期
  const useDate = new Date(request.use_date);
  const dayOfWeek = useDate.getDay(); // 0=周日, 1=周一, ..., 6=周六
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let dateMatch = false;
  if (isWeekday && space.available_days.includes('weekday')) {
    dateMatch = true;
  } else if (isWeekend && space.available_days.includes('weekend')) {
    dateMatch = true;
  } else if (space.available_days.includes('holiday')) {
    // 节假日匹配（简化处理）
    dateMatch = true;
  }

  if (!dateMatch) {
    return 0; // 日期不匹配，返回0分
  }

  // 检查时间段匹配
  const requestStart = request.use_time_start;
  const requestEnd = request.use_time_end;

  if (!space.available_time_slots || space.available_time_slots.length === 0) {
    return 50; // 没有指定时间段，给中等分数
  }

  // 检查是否有时间段匹配
  let bestMatch = 0;
  for (const slot of space.available_time_slots) {
    const slotStart = slot.start;
    const slotEnd = slot.end;

    // 精确匹配
    if (requestStart >= slotStart && requestEnd <= slotEnd) {
      bestMatch = Math.max(bestMatch, 100);
    }
    // 部分重叠
    else if (
      (requestStart >= slotStart && requestStart < slotEnd) ||
      (requestEnd > slotStart && requestEnd <= slotEnd) ||
      (requestStart < slotStart && requestEnd > slotEnd)
    ) {
      // 计算重叠比例
      const overlapStart = Math.max(requestStart, slotStart);
      const overlapEnd = Math.min(requestEnd, slotEnd);
      const requestDuration = getTimeDuration(requestStart, requestEnd);
      const overlapDuration = getTimeDuration(overlapStart, overlapEnd);
      const overlapRatio = overlapDuration / requestDuration;
      bestMatch = Math.max(bestMatch, overlapRatio * 80); // 部分重叠最高80分
    }
    // 可调整（需求时间在可用时间段之前或之后，但差距不大）
    else {
      const timeDiff = getTimeDifference(requestStart, slotStart);
      if (timeDiff <= 60) {
        // 差距在1小时内，给部分分数
        bestMatch = Math.max(bestMatch, 60 - timeDiff);
      }
    }
  }

  return bestMatch;
}

/**
 * 计算时间差（分钟）
 */
function getTimeDifference(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  return Math.abs((h1 - h2) * 60 + (m1 - m2));
}

/**
 * 计算时间段时长（分钟）
 */
function getTimeDuration(start: string, end: string): number {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  return (h2 - h1) * 60 + (m2 - m1);
}

/**
 * 计算空间类型匹配分（0-100）
 */
function calculateTypeScore(request: SpaceRequest, space: OfficeSpace): number {
  // 完全匹配
  if (request.request_type === space.space_type) {
    return 100;
  }

  // 兼容匹配规则
  const compatibilityMap: Record<SpaceType, SpaceType[]> = {
    office: ['office', 'shared_desk'],
    meeting_room: ['meeting_room', 'conference_room', 'office'],
    conference_room: ['conference_room', 'meeting_room', 'office'],
    shared_desk: ['shared_desk', 'office'],
    other: ['other', 'office', 'meeting_room', 'conference_room'],
  };

  const compatibleTypes = compatibilityMap[request.request_type] || [];
  if (compatibleTypes.includes(space.space_type)) {
    // 根据兼容程度给分
    const index = compatibleTypes.indexOf(space.space_type);
    return 100 - index * 20; // 第一个兼容类型80分，第二个60分，以此类推
  }

  return 0; // 不兼容
}

/**
 * 计算容量匹配分（0-100）
 */
function calculateCapacityScore(
  request: SpaceRequest,
  space: OfficeSpace
): number {
  const required = request.expected_capacity;
  const available = space.capacity;

  if (available >= required) {
    // 容量充足
    if (available === required) {
      return 100; // 刚好匹配，满分
    } else if (available <= required * 1.5) {
      return 90; // 容量充足但不过大
    } else {
      return 80; // 容量过大，但可用
    }
  } else {
    // 容量不足
    const ratio = available / required;
    if (ratio >= 0.8) {
      return 60; // 略小但勉强可用
    } else if (ratio >= 0.6) {
      return 40; // 较小，不太合适
    } else {
      return 0; // 太小，不可用
    }
  }
}

/**
 * 计算价格匹配分（0-100）
 */
function calculatePriceScore(request: SpaceRequest, space: OfficeSpace): number {
  // 免费优先
  if (space.pricing_model === 'free') {
    return 100;
  }

  // 如果需求没有预算限制
  if (!request.budget_range || request.budget_range === 'negotiable') {
    return 80; // 可协商，给中等分数
  }

  // 如果空间价格模式是可协商
  if (space.pricing_model === 'negotiable') {
    return 70; // 可协商，给中等分数
  }

  // 如果空间没有设置价格
  if (!space.price) {
    return 50; // 价格未知，给较低分数
  }

  // 根据预算范围判断
  const maxBudget = request.max_budget;
  if (maxBudget) {
    if (space.price <= maxBudget) {
      return 100; // 在预算内，满分
    } else if (space.price <= maxBudget * 1.2) {
      return 70; // 略超预算但可协商
    } else {
      return 30; // 超出预算较多
    }
  }

  // 根据预算范围标签判断
  switch (request.budget_range) {
    case 'free':
      return space.pricing_model === 'free' ? 100 : 0;
    case 'under_100':
      return space.price <= 100 ? 100 : space.price <= 120 ? 70 : 0;
    case '100_300':
      return space.price >= 100 && space.price <= 300
        ? 100
        : space.price <= 350
        ? 70
        : 0;
    case '300_500':
      return space.price >= 300 && space.price <= 500
        ? 100
        : space.price <= 600
        ? 70
        : 0;
    case 'over_500':
      return space.price >= 500 ? 100 : space.price >= 400 ? 70 : 0;
    default:
      return 50; // 未知预算，给中等分数
  }
}

/**
 * 计算设施匹配分（0-100）
 */
function calculateFacilityScore(
  request: SpaceRequest,
  space: OfficeSpace
): number {
  // 如果需求没有必需设施
  if (
    !request.required_facilities ||
    request.required_facilities.length === 0
  ) {
    return 100; // 没有要求，给满分
  }

  // 如果空间没有设施信息
  if (!space.facilities || space.facilities.length === 0) {
    return 0; // 没有设施，不匹配
  }

  // 计算匹配的设施数量
  const required = request.required_facilities;
  const available = space.facilities;
  const matched = required.filter((facility) =>
    available.some(
      (avail) => avail.toLowerCase().includes(facility.toLowerCase()) ||
                 facility.toLowerCase().includes(avail.toLowerCase())
    )
  );

  if (matched.length === required.length) {
    return 100; // 完全满足
  } else if (matched.length > 0) {
    return (matched.length / required.length) * 80; // 部分满足，按比例给分
  } else {
    return 0; // 完全不匹配
  }
}

/**
 * 计算总匹配分数（0-100）
 */
export function calculateMatchScore(
  request: SpaceRequest,
  space: OfficeSpace
): number {
  const locationScore = calculateLocationScore(request, space);
  const timeScore = calculateTimeScore(request, space);
  const typeScore = calculateTypeScore(request, space);
  const capacityScore = calculateCapacityScore(request, space);
  const priceScore = calculatePriceScore(request, space);
  const facilityScore = calculateFacilityScore(request, space);

  const totalScore =
    locationScore * MATCH_WEIGHTS.location +
    timeScore * MATCH_WEIGHTS.time +
    typeScore * MATCH_WEIGHTS.type +
    capacityScore * MATCH_WEIGHTS.capacity +
    priceScore * MATCH_WEIGHTS.price +
    facilityScore * MATCH_WEIGHTS.facility;

  return Math.round(totalScore * 100) / 100; // 保留两位小数
}

/**
 * 执行匹配算法
 * 为指定需求匹配所有可用空间，返回按匹配分数排序的结果
 */
export async function performMatching(
  requestId: number
): Promise<MatchResult[]> {
  try {
    // 获取需求信息
    const request = await getRequestById(requestId);
    if (!request) {
      throw new Error('需求不存在');
    }

    // 获取所有可用空间
    const filters: any = {
      status: 'released',
      is_available: true,
      page: 1,
      limit: 1000, // 获取足够多的空间进行匹配
    };

    // 如果指定了城市，添加城市过滤
    if (request.target_cities && request.target_cities.length > 0) {
      filters.city = request.target_cities[0]; // 先匹配第一个城市
    }

    const { data: spaces } = await getSpaces(filters);

    // 计算每个空间的匹配分数
    const matchResults: MatchResult[] = spaces
      .map((space) => {
        const matchScore = calculateMatchScore(request, space);
        const locationScore = calculateLocationScore(request, space);
        const timeScore = calculateTimeScore(request, space);
        const typeScore = calculateTypeScore(request, space);
        const capacityScore = calculateCapacityScore(request, space);
        const priceScore = calculatePriceScore(request, space);
        const facilityScore = calculateFacilityScore(request, space);

        return {
          id: 0, // 临时ID，实际应该从数据库获取
          space_id: space.id,
          request_id: requestId,
          match_score: matchScore,
          location_score: locationScore,
          time_score: timeScore,
          type_score: typeScore,
          capacity_score: capacityScore,
          price_score: priceScore,
          facility_score: facilityScore,
          status: 'recommended',
          is_auto_recommended: true,
          created_at: new Date().toISOString(),
          space,
          request,
        };
      })
      .filter((result) => result.match_score > 0) // 过滤掉匹配分数为0的结果
      .sort((a, b) => {
        // 排序规则：
        // 1. 按匹配分数降序
        // 2. 认证空间优先
        // 3. 高评价优先
        if (a.match_score !== b.match_score) {
          return b.match_score - a.match_score;
        }
        if (a.space?.is_verified !== b.space?.is_verified) {
          return b.space?.is_verified ? 1 : -1;
        }
        return (b.space?.average_rating || 0) - (a.space?.average_rating || 0);
      })
      .slice(0, 10); // 只返回Top 10

    // 保存匹配结果到数据库（可选）
    // await saveMatchResults(matchResults);

    return matchResults;
  } catch (error) {
    console.error('执行匹配算法失败:', error);
    throw error;
  }
}

/**
 * 获取需求的匹配推荐
 */
export async function getMatchRecommendations(
  requestId: number
): Promise<MatchResult[]> {
  return performMatching(requestId);
}

/**
 * 批量匹配多个需求
 */
export async function batchMatching(
  requestIds: number[]
): Promise<Map<number, MatchResult[]>> {
  const results = new Map<number, MatchResult[]>();

  for (const requestId of requestIds) {
    try {
      const matches = await performMatching(requestId);
      results.set(requestId, matches);
    } catch (error) {
      console.error(`需求 ${requestId} 匹配失败:`, error);
      results.set(requestId, []);
    }
  }

  return results;
}


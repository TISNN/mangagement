/**
 * 共享办公空间匹配系统 - 类型定义
 */

// ==================== 空间类型 ====================

export type SpaceType = 
  | 'office'           // 办公室
  | 'meeting_room'     // 会议室
  | 'conference_room'  // 会谈室
  | 'shared_desk'      // 共享工位
  | 'other';           // 其他

export type SpaceStatus = 
  | 'draft'      // 草稿
  | 'pending'    // 待审核
  | 'released'   // 已发布
  | 'suspended' // 已下架
  | 'deleted';   // 已删除

export type PricingModel = 
  | 'free'        // 免费
  | 'hourly'      // 按小时
  | 'daily'       // 按天
  | 'per_use'     // 按次
  | 'negotiable'; // 面议

export interface OfficeSpace {
  id: number;
  name: string;
  space_type: SpaceType;
  description?: string;
  address: string;
  city: string;
  district?: string;
  street?: string;
  building?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  capacity: number;
  facilities: string[];
  photos: string[];
  available_days: string[];
  available_time_slots: TimeSlot[];
  is_available: boolean;
  pricing_model: PricingModel;
  price?: number;
  currency: string;
  rules?: string;
  special_notes?: string;
  is_verified: boolean;
  verification_docs?: string[];
  status: SpaceStatus;
  view_count: number;
  booking_count: number;
  completed_count: number;
  average_rating: number;
  rating_count: number;
  provider_id: number;
  provider_type: string;
  provider_name?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
}

// ==================== 需求类型 ====================

export type RequestStatus = 
  | 'draft'      // 草稿
  | 'published'  // 已发布
  | 'matching'   // 匹配中
  | 'booked'     // 已预约
  | 'completed'  // 已完成
  | 'cancelled'; // 已取消

export type Urgency = 
  | 'normal'    // 一般
  | 'urgent'    // 较急
  | 'emergency'; // 紧急

export type BudgetRange = 
  | 'free'        // 免费
  | 'under_100'   // 100元以下
  | '100_300'     // 100-300元
  | '300_500'     // 300-500元
  | 'over_500'    // 500元以上
  | 'negotiable'; // 面议

export interface SpaceRequest {
  id: number;
  title: string;
  request_type: SpaceType;
  description?: string;
  target_cities: string[];
  target_districts?: string[];
  max_distance?: number;
  use_date: string;
  use_time_start: string;
  use_time_end: string;
  duration_hours?: number;
  expected_capacity: number;
  required_facilities: string[];
  preferences?: string;
  budget_range?: BudgetRange;
  max_budget?: number;
  status: RequestStatus;
  urgency: Urgency;
  matched_space_id?: number;
  booking_id?: number;
  requester_id: number;
  requester_type: string;
  requester_name?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

// ==================== 预约类型 ====================

export type BookingStatus = 
  | 'pending'    // 待审核
  | 'confirmed'  // 已确认
  | 'cancelled'  // 已取消
  | 'completed'; // 已完成

export type PaymentStatus = 
  | 'pending'   // 待支付
  | 'paid'      // 已支付
  | 'refunded'; // 已退款

export interface Booking {
  id: number;
  space_id: number;
  request_id?: number;
  requester_id: number;
  provider_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  expected_attendees?: number;
  purpose?: string;
  special_requirements?: string;
  contact_phone?: string;
  contact_wechat?: string;
  pricing_model?: PricingModel;
  price?: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_time?: string;
  status: BookingStatus;
  cancellation_reason?: string;
  cancelled_by?: number;
  cancelled_at?: string;
  check_in_time?: string;
  check_out_time?: string;
  actual_attendees?: number;
  usage_notes?: string;
  requester_rated: boolean;
  provider_rated: boolean;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  completed_at?: string;
  // 关联数据
  space?: OfficeSpace;
  request?: SpaceRequest;
  requester_name?: string;
  provider_name?: string;
}

// ==================== 评价类型 ====================

export type RatingType = 
  | 'provider_rating'  // 对提供方的评价
  | 'requester_rating'; // 对需求方的评价

export interface Rating {
  id: number;
  booking_id: number;
  space_id?: number;
  rater_id: number;
  rated_id: number;
  rating_type: RatingType;
  overall_rating: number;
  punctuality_rating?: number;
  cleanliness_rating?: number;
  facility_rating?: number;
  service_rating?: number;
  value_rating?: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  // 关联数据
  rater_name?: string;
  rated_name?: string;
}

// ==================== 匹配类型 ====================

export interface MatchResult {
  id: number;
  space_id: number;
  request_id: number;
  match_score: number;
  location_score: number;
  time_score: number;
  type_score: number;
  capacity_score: number;
  price_score: number;
  facility_score: number;
  status: 'recommended' | 'viewed' | 'applied' | 'ignored';
  is_auto_recommended: boolean;
  created_at: string;
  viewed_at?: string;
  applied_at?: string;
  // 关联数据
  space?: OfficeSpace;
  request?: SpaceRequest;
}

// ==================== 信用分类型 ====================

export type CreditLevel = 
  | 'excellent' // 优秀 (≥150分)
  | 'good'      // 良好 (120-149分)
  | 'normal'    // 一般 (100-119分)
  | 'poor'      // 较差 (80-99分)
  | 'bad';      // 差 (<80分)

export interface CreditScore {
  id: number;
  user_id: number;
  user_type: string;
  credit_score: number;
  credit_level: CreditLevel;
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  average_rating: number;
  violation_count: number;
  created_at: string;
  updated_at: string;
  last_calculated_at?: string;
}

// ==================== 表单类型 ====================

export interface CreateSpaceData {
  name: string;
  space_type: SpaceType;
  description?: string;
  address: string;
  city: string;
  district?: string;
  street?: string;
  building?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  capacity: number;
  facilities: string[];
  photos: string[];
  available_days: string[];
  available_time_slots: TimeSlot[];
  pricing_model: PricingModel;
  price?: number;
  currency?: string;
  rules?: string;
  special_notes?: string;
  verification_docs?: string[];
}

export interface UpdateSpaceData extends Partial<CreateSpaceData> {
  status?: SpaceStatus;
  is_available?: boolean;
}

export interface CreateRequestData {
  title: string;
  request_type: SpaceType;
  description?: string;
  target_cities: string[];
  target_districts?: string[];
  max_distance?: number;
  use_date: string;
  use_time_start: string;
  use_time_end: string;
  duration_hours?: number;
  expected_capacity: number;
  required_facilities: string[];
  preferences?: string;
  budget_range?: BudgetRange;
  max_budget?: number;
  urgency?: Urgency;
}

export interface UpdateRequestData extends Partial<CreateRequestData> {
  status?: RequestStatus;
}

export interface CreateBookingData {
  space_id: number;
  request_id?: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  expected_attendees?: number;
  purpose?: string;
  special_requirements?: string;
  contact_phone?: string;
  contact_wechat?: string;
}

// ==================== 筛选类型 ====================

export interface SpaceFilters {
  search?: string;
  city?: string;
  district?: string;
  space_type?: SpaceType | 'all';
  pricing_model?: PricingModel | 'all';
  min_price?: number;
  max_price?: number;
  min_capacity?: number;
  facilities?: string[];
  is_verified?: boolean;
  status?: SpaceStatus | 'all';
  available_date?: string;
  available_time_start?: string;
  available_time_end?: string;
  min_rating?: number;
  page?: number;
  limit?: number;
}

export interface RequestFilters {
  search?: string;
  target_cities?: string[];
  request_type?: SpaceType | 'all';
  status?: RequestStatus | 'all';
  urgency?: Urgency | 'all';
  use_date_from?: string;
  use_date_to?: string;
  budget_range?: BudgetRange | 'all';
  requester_id?: number;
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  space_id?: number;
  request_id?: number;
  requester_id?: number;
  provider_id?: number;
  status?: BookingStatus | 'all';
  booking_date_from?: string;
  booking_date_to?: string;
  page?: number;
  limit?: number;
}

// ==================== 统计类型 ====================

export interface SpaceStats {
  total: number;
  released: number;
  pending: number;
  suspended: number;
  total_bookings: number;
}

export interface RequestStats {
  total: number;
  published: number;
  matching: number;
  booked: number;
  completed: number;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

// ==================== 常量 ====================

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  office: '办公室',
  meeting_room: '会议室',
  conference_room: '会谈室',
  shared_desk: '共享工位',
  other: '其他',
};

export const SPACE_STATUS_LABELS: Record<SpaceStatus, string> = {
  draft: '草稿',
  pending: '待审核',
  released: '已发布',
  suspended: '已下架',
  deleted: '已删除',
};

export const PRICING_MODEL_LABELS: Record<PricingModel, string> = {
  free: '免费',
  hourly: '按小时',
  daily: '按天',
  per_use: '按次',
  negotiable: '面议',
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  draft: '草稿',
  published: '已发布',
  matching: '匹配中',
  booked: '已预约',
  completed: '已完成',
  cancelled: '已取消',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: '待审核',
  confirmed: '已确认',
  cancelled: '已取消',
  completed: '已完成',
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  normal: '一般',
  urgent: '较急',
  emergency: '紧急',
};

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  free: '免费',
  under_100: '100元以下',
  '100_300': '100-300元',
  '300_500': '300-500元',
  over_500: '500元以上',
  negotiable: '面议',
};

export const CREDIT_LEVEL_LABELS: Record<CreditLevel, string> = {
  excellent: '优秀',
  good: '良好',
  normal: '一般',
  poor: '较差',
  bad: '差',
};


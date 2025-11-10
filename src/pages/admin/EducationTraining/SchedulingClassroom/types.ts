export type ClassMode = 'online' | 'offline' | 'hybrid';

export interface ClassProfile {
  id: string;
  name: string;
  program: string;
  level: string;
  capacity: number;
  enrolled: number;
  advisor: string;
  leadTeacher: string;
  assistants: string[];
  mode: ClassMode;
  scheduleStatus: 'draft' | 'published' | 'in-progress';
  startDate: string;
  endDate: string;
}

export interface ScheduleSlot {
  id: string;
  classId: string;
  topic: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  mode: ClassMode;
  status: 'scheduled' | 'adjusted' | 'pending';
  notes?: string;
}

export interface ConstraintRule {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'error';
  impactedClasses: string[];
  resolution?: string;
}

export interface OptimizationSuggestion {
  id: string;
  category: 'capacity' | 'teacher-load' | 'room-utilization' | 'continuity';
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionOwner: string;
}

export interface TeacherAvailability {
  id: string;
  name: string;
  subjects: string[];
  weeklyHours: number;
  bookedHours: number;
  preferredSlots: string[];
  status: 'available' | 'busy' | 'overload';
}

export interface RoomResource {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'studio' | 'virtual';
  capacity: number;
  equipment: string[];
  availableHours: string[];
  utilization: number;
}

export interface AdjustmentRequest {
  id: string;
  className: string;
  requester: string;
  type: 'leave' | 'reschedule' | 'makeup';
  reason: string;
  targetDate: string;
  status: 'pending' | 'approved' | 'declined';
  reviewer: string;
}

export interface NotificationChannel {
  id: string;
  name: string;
  channel: 'email' | 'sms' | 'wechat' | 'dingtalk' | 'calendar';
  description: string;
  autoSync: boolean;
  lastSync: string;
}


export interface MetricCard {
  id: string;
  title: string;
  value: string;
  delta?: string;
  trend: 'up' | 'down' | 'flat';
}

export interface HeatmapSnapshot {
  id: string;
  label: string;
  value: number;
}

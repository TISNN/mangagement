/**
 * 阶段相关类型定义
 */

import React from 'react';

export interface StageInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}


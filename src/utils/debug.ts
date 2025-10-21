/**
 * 调试工具 - 用于检查数据库和前端字段映射
 */

import { syncService } from '../services';

// 数据库学生表的字段
export const DB_STUDENT_FIELDS = [
  'is_active',
  'created_at',
  'updated_at',
  'id',
  'gender',
  'avatar_url',
  'student_number',
  'education_level',
  'school',
  'major',
  'target_countries',
  'status',
  'name',
  'email',
  'contact'
];

// 前端学生对象的字段
export const FRONTEND_STUDENT_FIELDS = [
  'is_active',
  'created_at',
  'updated_at',
  'person_id',
  'gender',
  'avatar_url',
  'studentNumber',
  'educationLevel',
  'school',
  'major',
  'targetCountries',
  'status',
  'name',
  'email',
  'contact'
];

// 字段映射关系
export const FIELD_MAPPING: Record<string, string | ((dbValue: any) => any)> = {
  'id': 'person_id',
  'student_number': 'studentNumber',
  'education_level': 'educationLevel',
  'target_countries': (val: string[]) => val ? [...val] : [],
  'is_active': (val: boolean) => !!val,
  'created_at': (val: string) => val,
  'updated_at': (val: string) => val,
  'status': (val: string) => val || '活跃'
};

/**
 * 检查学生数据映射是否正确
 * @param dbData 数据库中的学生数据
 * @param frontendData 前端显示的学生数据
 * @returns 映射检查结果
 */
export function checkStudentMapping(dbData: any, frontendData: any): { 
  isCorrect: boolean; 
  missingFields: string[]; 
  extraFields: string[];
  fieldMappingErrors: Record<string, { dbValue: any, frontendValue: any }>;
} {
  console.group('数据映射检查');
  console.log('数据库原始数据:', dbData);
  console.log('前端映射数据:', frontendData);
  
  // 检查是否所有必要的字段都存在
  const missingFields: string[] = [];
  const extraFields: string[] = [];
  const fieldMappingErrors: Record<string, { dbValue: any, frontendValue: any }> = {};
  
  // 检查数据库中的字段是否都被正确映射到前端
  for (const dbField of DB_STUDENT_FIELDS) {
    // 获取映射的前端字段名
    const frontendField = FIELD_MAPPING[dbField] 
      ? (typeof FIELD_MAPPING[dbField] === 'string' 
         ? FIELD_MAPPING[dbField] as string 
         : dbField)
      : dbField;
    
    // 检查前端数据是否包含该字段
    if (frontendData[frontendField] === undefined) {
      missingFields.push(dbField);
      continue;
    }
    
    // 检查字段值映射是否正确
    const dbValue = dbData[dbField];
    const frontendValue = frontendData[frontendField];
    
    // 应用映射转换
    const mappingFn = FIELD_MAPPING[dbField];
    let expectedValue;
    
    if (mappingFn && typeof mappingFn !== 'string') {
      // 如果有映射函数，使用它来计算期望值
      expectedValue = mappingFn(dbValue);
    } else {
      // 否则直接比较值
      expectedValue = dbValue;
    }
    
    // 特殊处理数组和对象类型
    let isEqual = false;
    if (Array.isArray(expectedValue) && Array.isArray(frontendValue)) {
      isEqual = JSON.stringify(expectedValue) === JSON.stringify(frontendValue);
    } else if (
      expectedValue && typeof expectedValue === 'object' && 
      frontendValue && typeof frontendValue === 'object'
    ) {
      isEqual = JSON.stringify(expectedValue) === JSON.stringify(frontendValue);
    } else if (expectedValue instanceof Date && frontendValue instanceof Date) {
      isEqual = expectedValue.getTime() === frontendValue.getTime();
    } else {
      // 基本类型比较
      isEqual = expectedValue === frontendValue;
    }
    
    // 如果映射不正确，记录错误
    if (!isEqual) {
      fieldMappingErrors[dbField] = {
        dbValue,
        frontendValue
      };
    }
  }
  
  // 检查前端数据中是否有多余的字段
  for (const frontendField of Object.keys(frontendData)) {
    if (!FRONTEND_STUDENT_FIELDS.includes(frontendField)) {
      extraFields.push(frontendField);
    }
  }
  
  const isCorrect = missingFields.length === 0 && Object.keys(fieldMappingErrors).length === 0;
  
  // 输出检查结果
  console.log('映射检查结果:', isCorrect ? '正确' : '有错误');
  if (missingFields.length > 0) {
    console.warn('缺少字段:', missingFields);
  }
  if (extraFields.length > 0) {
    console.warn('多余字段:', extraFields);
  }
  if (Object.keys(fieldMappingErrors).length > 0) {
    console.error('字段映射错误:', fieldMappingErrors);
  }
  console.groupEnd();
  
  return {
    isCorrect,
    missingFields,
    extraFields,
    fieldMappingErrors
  };
}

/**
 * 诊断学生数据同步问题
 */
export function diagnoseStudentDataSync() {
  console.group('数据同步诊断');
  
  // 检查本地存储缓存
  try {
    const authToken = localStorage.getItem('supabase.auth.token');
    console.log('Auth Token 存在:', !!authToken);
  } catch (error) {
    console.warn('无法访问localStorage:', error);
  }
  
  // 检查网络连接
  console.log('网络连接状态:', navigator.onLine ? '在线' : '离线');
  
  // 检查活跃订阅
  const activeSubscriptions = syncService.getActiveSubscriptions();
  console.log('活跃订阅数量:', Object.keys(activeSubscriptions).length);
  console.log('活跃订阅:', activeSubscriptions);
  
  console.groupEnd();
}

/**
 * 设置API日志记录器
 * 覆盖原始fetch方法，记录所有API请求
 */
export function setupAPILogger() {
  // 保存原始fetch函数
  const originalFetch = window.fetch;
  let requestCounter = 0;
  
  // 替换fetch函数
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const requestId = ++requestCounter;
    const url = typeof input === 'string' ? input : input.url;
    
    // 只记录Supabase请求
    if (!url.includes('supabase')) {
      return originalFetch(input, init);
    }
    
    const method = init?.method || 'GET';
    const startTime = Date.now();
    
    console.group(`API请求 #${requestId}: ${method} ${url}`);
    console.log('请求时间:', new Date(startTime).toISOString());
    if (init?.body) {
      try {
        console.log('请求体:', JSON.parse(init.body as string));
      } catch {
        console.log('请求体:', init.body);
      }
    }
    
    try {
      const response = await originalFetch(input, init);
      const endTime = Date.now();
      console.log('响应时间:', new Date(endTime).toISOString());
      console.log('请求耗时:', endTime - startTime, 'ms');
      console.log('响应状态:', response.status, response.statusText);
      
      // 克隆响应以便我们可以同时读取流
      const clonedResponse = response.clone();
      
      try {
        const responseData = await clonedResponse.json();
        console.log('响应数据:', responseData);
      } catch (error) {
        console.log('无法解析响应为JSON');
      }
      
      console.groupEnd();
      return response;
    } catch (error) {
      console.error('请求失败:', error);
      console.groupEnd();
      throw error;
    }
  };
  
  console.log('API日志记录器已设置');
} 
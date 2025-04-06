/**
 * 日期工具函数 - 使用本地时区和格式
 */

/**
 * 格式化日期为本地格式
 * @param dateString 日期字符串或Date对象
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // 默认选项 - 年月日
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    // 合并选项
    const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    
    // 使用浏览器的本地格式
    return date.toLocaleDateString(undefined, mergedOptions);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '无效日期';
  }
}

/**
 * 格式化日期和时间为本地格式
 * @param dateInput 日期字符串或Date对象
 * @param options 格式化选项
 * @returns 格式化后的日期和时间字符串
 */
export function formatDateTime(dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // 默认选项 - 年月日时分
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // 合并选项
    const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    
    // 使用浏览器的本地格式
    return date.toLocaleString(undefined, mergedOptions);
  } catch (error) {
    console.error('日期时间格式化错误:', error);
    return '无效日期';
  }
}

/**
 * 获取当前日期时间的ISO字符串（本地时区）
 * @returns ISO格式的日期时间字符串
 */
export function getCurrentLocalISOString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString();
}

/**
 * 获取当前日期（本地时区）
 * @returns YYYY-MM-DD格式的日期字符串
 */
export function getCurrentLocalDate(): string {
  return getCurrentLocalISOString().split('T')[0];
} 
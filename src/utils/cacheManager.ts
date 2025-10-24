/**
 * 缓存管理工具
 * 用于清除所有localStorage缓存
 */

/**
 * 清除所有应用缓存
 */
export const clearAllCache = (): void => {
  try {
    const keysToRemove = [
      'cachedSchools',
      'cachedSchoolsTimestamp',
      'cachedPrograms',
      'cachedProgramsTimestamp',
      'programSearchHistory'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ 所有缓存已清除');
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
};

/**
 * 在控制台中暴露清除缓存函数
 */
if (typeof window !== 'undefined') {
  (window as any).clearAppCache = clearAllCache;
}


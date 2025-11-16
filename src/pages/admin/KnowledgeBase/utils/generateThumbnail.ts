/**
 * 生成默认封面图工具函数
 * 当资源没有上传封面图时，自动生成黑色背景+白色文字的封面图
 */

/**
 * 生成默认封面图的 Data URL
 * @param title 资源标题
 * @param width 图片宽度，默认 800
 * @param height 图片高度，默认 400
 * @returns 返回 base64 编码的图片 Data URL
 */
export function generateDefaultThumbnail(
  title: string = '未命名资源',
  width: number = 800,
  height: number = 400
): string {
  // 如果标题为空，使用默认标题
  const displayTitle = title.trim() || '未命名资源';
  // 创建 canvas 元素
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    // 如果无法创建 canvas，返回一个简单的占位符
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj48L3RleHQ+PC9zdmc+';
  }

  // 填充黑色背景
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // 设置文字样式
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 48px Arial, sans-serif';

  // 处理标题文字：如果太长则换行
  const maxWidth = width - 80; // 左右各留 40px 边距
  const words = displayTitle.split('');
  const lines: string[] = [];
  let currentLine = '';

  // 简单的中英文混合换行处理
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i];
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // 限制最多显示 3 行
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].slice(0, -3) + '...';
  }

  // 计算行高和总高度
  const lineHeight = 60;
  const totalHeight = displayLines.length * lineHeight;
  const startY = (height - totalHeight) / 2 + lineHeight / 2;

  // 绘制文字
  displayLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  // 返回 base64 编码的图片
  return canvas.toDataURL('image/png');
}

/**
 * 生成默认封面图的缓存 Map
 * 避免重复生成相同标题的封面图
 */
const thumbnailCache = new Map<string, string>();

/**
 * 获取默认封面图（带缓存）
 * @param title 资源标题
 * @returns 返回 base64 编码的图片 Data URL
 */
export function getDefaultThumbnail(title: string = '未命名资源'): string {
  // 规范化标题（去除首尾空格，如果为空则使用默认值）
  const normalizedTitle = title.trim() || '未命名资源';
  
  // 如果缓存中有，直接返回
  if (thumbnailCache.has(normalizedTitle)) {
    return thumbnailCache.get(normalizedTitle)!;
  }

  // 生成新的封面图
  const thumbnail = generateDefaultThumbnail(normalizedTitle);
  
  // 缓存结果（限制缓存大小，避免内存溢出）
  if (thumbnailCache.size > 100) {
    // 删除最旧的缓存（简单策略：清空一半）
    const keysToDelete = Array.from(thumbnailCache.keys()).slice(0, 50);
    keysToDelete.forEach(key => thumbnailCache.delete(key));
  }
  
  thumbnailCache.set(normalizedTitle, thumbnail);
  return thumbnail;
}


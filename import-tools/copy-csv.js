// 复制CSV文件到导入工具目录
const fs = require('fs');
const path = require('path');

// 源文件路径（项目根目录下的CSV文件）
const sourcePath = path.join('..', '2025 QS World University Rankings 2.2 (For qs.com).csv');

// 目标文件路径（当前目录）
const targetPath = '2025 QS World University Rankings 2.2 (For qs.com).csv';

// 检查源文件是否存在
if (!fs.existsSync(sourcePath)) {
  console.error(`错误: 源文件不存在 "${sourcePath}"`);
  process.exit(1);
}

// 复制文件
try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`成功: 文件已复制到 "${targetPath}"`);
} catch (error) {
  console.error('错误: 复制文件时出错', error);
  process.exit(1);
} 
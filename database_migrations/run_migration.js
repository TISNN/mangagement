/**
 * 执行数据库迁移脚本
 * 自动将迁移SQL应用到Supabase数据库
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 数据库迁移工具\n');
console.log('═'.repeat(80));

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ 错误: 未找到 Supabase 配置');
  console.error('请确保 .env 文件中包含:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration() {
  try {
    console.log('📂 读取迁移SQL文件...');
    const migrationFile = join(__dirname, '001_add_task_domain_and_linked_entity.sql');
    const sql = readFileSync(migrationFile, 'utf-8');
    
    console.log('✅ SQL文件读取成功\n');
    console.log('📊 准备执行以下操作:');
    console.log('  1. 添加 task_domain 字段');
    console.log('  2. 添加 linked_entity_type 字段');
    console.log('  3. 添加 linked_entity_id 字段');
    console.log('  4. 创建索引优化查询性能');
    console.log('  5. 回填历史数据');
    console.log('  6. 创建统计视图\n');
    
    console.log('⚠️  注意: 此操作将修改数据库结构和数据');
    console.log('建议在执行前备份重要数据\n');
    console.log('═'.repeat(80));
    
    // 分割SQL语句（按照注释块分组）
    const statements = sql
      .split(/-- \d+\./g)
      .filter(s => s.trim() && !s.trim().startsWith('--'))
      .map(s => s.trim());
    
    console.log(`\n📝 共有 ${statements.length} 个SQL语句块\n`);
    
    // 由于 Supabase JS 客户端限制，需要使用 REST API
    console.log('⚠️  重要提示:');
    console.log('Supabase JS 客户端不支持直接执行DDL语句（ALTER TABLE等）');
    console.log('请使用以下方式之一执行迁移:\n');
    
    console.log('方式1: Supabase Dashboard (推荐)');
    console.log('  1. 访问: https://supabase.com/dashboard/project/swyajeiqqewyckzbfkid/sql');
    console.log('  2. 点击 "New Query"');
    console.log('  3. 复制 001_add_task_domain_and_linked_entity.sql 的内容');
    console.log('  4. 点击 "RUN" 执行\n');
    
    console.log('方式2: 使用 psql 命令行');
    console.log('  psql "postgresql://postgres:[PASSWORD]@db.swyajeiqqewyckzbfkid.supabase.co:5432/postgres" < 001_add_task_domain_and_linked_entity.sql\n');
    
    console.log('方式3: 手动执行关键语句');
    console.log('  复制以下SQL并在Supabase SQL Editor中执行:\n');
    console.log('─'.repeat(80));
    
    // 提取关键的ALTER TABLE语句
    const keyStatements = `
-- 添加新字段
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_domain VARCHAR(50) DEFAULT 'general';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_entity_type VARCHAR(20) DEFAULT 'none';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_entity_id INTEGER;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_domain ON tasks(task_domain);
CREATE INDEX IF NOT EXISTS idx_tasks_linked_entity ON tasks(linked_entity_type, linked_entity_id);

-- 回填历史数据
UPDATE tasks 
SET task_domain = 'student_success',
    linked_entity_type = 'student',
    linked_entity_id = related_student_id
WHERE related_student_id IS NOT NULL AND task_domain = 'general';

UPDATE tasks 
SET task_domain = 'marketing',
    linked_entity_type = 'lead',
    linked_entity_id = related_lead_id
WHERE related_lead_id IS NOT NULL AND task_domain = 'general';
`;
    
    console.log(keyStatements);
    console.log('─'.repeat(80));
    
    // 验证当前数据库状态
    console.log('\n🔍 验证当前数据库状态...');
    const { data: currentData, error: checkError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ 查询失败:', checkError.message);
      return;
    }
    
    if (currentData && currentData.length > 0) {
      const fields = Object.keys(currentData[0]);
      console.log('\n当前 tasks 表字段:');
      fields.forEach(f => console.log('  •', f));
      
      const hasTaskDomain = fields.includes('task_domain');
      const hasLinkedType = fields.includes('linked_entity_type');
      const hasLinkedId = fields.includes('linked_entity_id');
      
      console.log('\n迁移状态:');
      console.log('  task_domain        :', hasTaskDomain ? '✅ 已存在' : '❌ 需要添加');
      console.log('  linked_entity_type :', hasLinkedType ? '✅ 已存在' : '❌ 需要添加');
      console.log('  linked_entity_id   :', hasLinkedId ? '✅ 已存在' : '❌ 需要添加');
      
      if (hasTaskDomain && hasLinkedType && hasLinkedId) {
        console.log('\n✅ 数据库已完成迁移！');
        
        // 检查数据分布
        const { data: stats } = await supabase
          .from('tasks')
          .select('task_domain, linked_entity_type');
        
        if (stats) {
          console.log('\n📊 数据分布统计:');
          const domainCount = {};
          const typeCount = {};
          
          stats.forEach(task => {
            domainCount[task.task_domain || 'null'] = (domainCount[task.task_domain || 'null'] || 0) + 1;
            typeCount[task.linked_entity_type || 'null'] = (typeCount[task.linked_entity_type || 'null'] || 0) + 1;
          });
          
          console.log('\n  任务域分布:');
          Object.entries(domainCount).forEach(([key, count]) => {
            console.log(`    ${key.padEnd(20)}: ${count}`);
          });
          
          console.log('\n  关联类型分布:');
          Object.entries(typeCount).forEach(([key, count]) => {
            console.log(`    ${key.padEnd(20)}: ${count}`);
          });
        }
      } else {
        console.log('\n⚠️  数据库需要迁移，请按照上述方式之一执行SQL');
      }
    }
    
  } catch (error) {
    console.error('\n❌ 迁移过程出错:', error.message);
    console.error(error);
  }
}

runMigration();


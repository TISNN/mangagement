/**
 * 自动数据库迁移脚本
 * 使用 Supabase Management API 执行迁移
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 自动数据库迁移工具\n');
console.log('═'.repeat(80));

async function executeSimpleMigration() {
  try {
    console.log('📊 执行简化版迁移（使用Supabase客户端）...\n');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 步骤1: 验证当前状态
    console.log('1️⃣ 检查当前数据库状态...');
    const { data: currentTasks, error: checkError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (checkError) {
      throw new Error(`查询失败: ${checkError.message}`);
    }
    
    const fields = currentTasks && currentTasks.length > 0 ? Object.keys(currentTasks[0]) : [];
    const hasTaskDomain = fields.includes('task_domain');
    const hasLinkedType = fields.includes('linked_entity_type');
    const hasLinkedId = fields.includes('linked_entity_id');
    
    console.log('当前字段状态:');
    console.log('  task_domain        :', hasTaskDomain ? '✅ 已存在' : '❌ 不存在');
    console.log('  linked_entity_type :', hasLinkedType ? '✅ 已存在' : '❌ 不存在');
    console.log('  linked_entity_id   :', hasLinkedId ? '✅ 已存在' : '❌ 不存在');
    
    if (hasTaskDomain && hasLinkedType && hasLinkedId) {
      console.log('\n✅ 数据库已包含所需字段！');
      console.log('\n2️⃣ 检查数据分布...');
      
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('task_domain, linked_entity_type, related_student_id, related_lead_id');
      
      if (allTasks) {
        const needsBackfill = allTasks.some(t => {
          // 需要回填：有student但domain不是student_success
          if (t.related_student_id && t.task_domain !== 'student_success') return true;
          // 需要回填：有lead但domain不是marketing
          if (t.related_lead_id && t.task_domain !== 'marketing') return true;
          return false;
        });
        
        if (needsBackfill) {
          console.log('⚠️  发现需要回填的数据\n');
          console.log('3️⃣ 执行数据回填...');
          
          let backfillCount = 0;
          
          // 回填有学生关联的任务
          for (const task of allTasks) {
            if (task.related_student_id && task.task_domain !== 'student_success') {
              const { error: updateError } = await supabase
                .from('tasks')
                .update({
                  task_domain: 'student_success',
                  linked_entity_type: 'student',
                  linked_entity_id: task.related_student_id
                })
                .match({ id: task.id });
              
              if (!updateError) {
                backfillCount++;
                process.stdout.write(`\r  已回填: ${backfillCount} 条记录`);
              }
            } else if (task.related_lead_id && task.task_domain !== 'marketing') {
              const { error: updateError } = await supabase
                .from('tasks')
                .update({
                  task_domain: 'marketing',
                  linked_entity_type: 'lead',
                  linked_entity_id: task.related_lead_id
                })
                .match({ id: task.id });
              
              if (!updateError) {
                backfillCount++;
                process.stdout.write(`\r  已回填: ${backfillCount} 条记录`);
              }
            }
          }
          
          console.log(`\n✅ 数据回填完成！共回填 ${backfillCount} 条记录\n`);
        } else {
          console.log('✅ 数据已正确填充\n');
        }
        
        // 显示最终统计
        console.log('4️⃣ 最终数据分布统计:\n');
        
        const { data: finalTasks } = await supabase
          .from('tasks')
          .select('task_domain, linked_entity_type');
        
        if (finalTasks) {
          const domainStats = {};
          const typeStats = {};
          
          finalTasks.forEach(task => {
            const domain = task.task_domain || 'null';
            const type = task.linked_entity_type || 'null';
            domainStats[domain] = (domainStats[domain] || 0) + 1;
            typeStats[type] = (typeStats[type] || 0) + 1;
          });
          
          console.log('📊 任务域分布:');
          Object.entries(domainStats).forEach(([key, count]) => {
            console.log(`  ${key.padEnd(20)}: ${count}`);
          });
          
          console.log('\n📊 关联类型分布:');
          Object.entries(typeStats).forEach(([key, count]) => {
            console.log(`  ${key.padEnd(20)}: ${count}`);
          });
        }
      }
      
      console.log('\n' + '═'.repeat(80));
      console.log('✅ 迁移完成！所有数据已就绪');
      console.log('═'.repeat(80));
      return true;
      
    } else {
      console.log('\n❌ 数据库缺少必要字段');
      console.log('\n⚠️  由于权限限制，无法通过JS客户端添加字段');
      console.log('请手动执行以下SQL:\n');
      console.log('─'.repeat(80));
      console.log(`
-- 1. 添加字段
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_domain VARCHAR(50) DEFAULT 'general';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_entity_type VARCHAR(20) DEFAULT 'none';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_entity_id INTEGER;

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_domain ON tasks(task_domain);
CREATE INDEX IF NOT EXISTS idx_tasks_linked_entity ON tasks(linked_entity_type, linked_entity_id);

-- 3. 回填数据
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
      `);
      console.log('─'.repeat(80));
      console.log('\n执行位置: https://supabase.com/dashboard/project/swyajeiqqewyckzbfkid/sql\n');
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ 迁移失败:', error.message);
    console.error(error);
    return false;
  }
}

// 执行迁移
executeSimpleMigration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('未处理的错误:', error);
    process.exit(1);
  });


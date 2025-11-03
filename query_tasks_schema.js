/**
 * 查询 tasks 表的字段结构
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function getTasksTableSchema() {
  console.log('📋 查询 tasks 表的字段结构...\n');
  console.log('═'.repeat(80));

  try {
    // 方法1: 查询 information_schema
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'tasks' })
      .select();

    if (error && error.code === '42883') {
      // 如果RPC函数不存在，使用直接查询方式
      console.log('⚠️  使用备用方案查询表结构...\n');
      
      // 直接查询一条记录来获取字段
      const { data: sampleData, error: sampleError } = await supabase
        .from('tasks')
        .select('*')
        .limit(1)
        .single();

      if (sampleError) {
        throw sampleError;
      }

      console.log('📊 tasks 表字段列表:\n');
      console.log('字段名'.padEnd(30) + '示例值'.padEnd(30) + '类型');
      console.log('─'.repeat(80));

      Object.entries(sampleData).forEach(([key, value]) => {
        const valueStr = value === null ? 'NULL' : 
                        typeof value === 'object' ? JSON.stringify(value).substring(0, 25) + '...' :
                        String(value).substring(0, 25);
        const type = value === null ? 'unknown' : 
                    Array.isArray(value) ? 'array' :
                    typeof value;
        
        console.log(
          key.padEnd(30) +
          valueStr.padEnd(30) +
          type
        );
      });

      // 获取更多样本数据以了解数据范围
      console.log('\n' + '═'.repeat(80));
      console.log('📊 查询所有 tasks 记录以分析字段...\n');
      
      const { data: allTasks, error: allError, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' });

      if (allError) {
        throw allError;
      }

      console.log(`✅ 共找到 ${count} 条任务记录\n`);

      // 分析字段统计信息
      if (allTasks && allTasks.length > 0) {
        console.log('📈 字段详细分析:\n');
        console.log('─'.repeat(80));
        
        const fieldStats = {};
        const firstTask = allTasks[0];
        
        Object.keys(firstTask).forEach(field => {
          const values = allTasks.map(t => t[field]).filter(v => v !== null && v !== undefined);
          const nullCount = allTasks.length - values.length;
          
          fieldStats[field] = {
            type: Array.isArray(firstTask[field]) ? 'array' : typeof firstTask[field],
            nullCount: nullCount,
            nonNullCount: values.length,
            sampleValues: [...new Set(values.slice(0, 5))]
          };
        });

        Object.entries(fieldStats).forEach(([field, stats]) => {
          console.log(`\n🔹 ${field}`);
          console.log(`   类型: ${stats.type}`);
          console.log(`   非空: ${stats.nonNullCount} / ${allTasks.length}`);
          console.log(`   空值: ${stats.nullCount}`);
          
          if (stats.sampleValues.length > 0) {
            console.log(`   示例值: ${stats.sampleValues.map(v => 
              typeof v === 'object' ? JSON.stringify(v) : v
            ).join(', ')}`);
          }
        });
      }

      console.log('\n' + '═'.repeat(80));
      console.log('✅ tasks 表结构分析完成！');
      
    } else if (error) {
      throw error;
    } else {
      // 如果RPC成功
      console.log('📊 tasks 表字段详情:\n');
      columns.forEach(col => {
        console.log(`字段名: ${col.column_name}`);
        console.log(`类型: ${col.data_type}`);
        console.log(`可空: ${col.is_nullable}`);
        console.log(`默认值: ${col.column_default || 'None'}`);
        console.log('─'.repeat(80));
      });
    }

  } catch (error) {
    console.error('❌ 查询失败:', error.message);
    console.error('错误详情:', error);
  }
}

getTasksTableSchema();


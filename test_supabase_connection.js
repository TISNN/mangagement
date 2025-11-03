/**
 * Supabase 连接测试脚本
 * 测试数据库连接和基本查询功能
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 开始测试 Supabase 连接...\n');
console.log('📍 Supabase URL:', SUPABASE_URL);
console.log('🔑 API Key:', SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置');
console.log('─'.repeat(60));

async function testSupabaseConnection() {
  try {
    // 1. 创建客户端
    console.log('\n1️⃣ 创建 Supabase 客户端...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ 客户端创建成功');

    // 2. 测试数据库连接 - 获取表列表
    console.log('\n2️⃣ 测试数据库连接（查询学生表）...');
    const { data: students, error: studentsError, count } = await supabase
      .from('students')
      .select('id, name', { count: 'exact', head: false })
      .limit(5);

    if (studentsError) {
      console.error('❌ 学生表查询失败:', studentsError.message);
      throw studentsError;
    }
    
    console.log(`✅ 学生表查询成功，共有 ${count} 条记录`);
    console.log('📊 前5条数据:', students);

    // 3. 测试任务表
    console.log('\n3️⃣ 测试任务表查询...');
    const { data: tasks, error: tasksError, count: taskCount } = await supabase
      .from('tasks')
      .select('id, title, status', { count: 'exact' })
      .limit(5);

    if (tasksError) {
      console.error('❌ 任务表查询失败:', tasksError.message);
    } else {
      console.log(`✅ 任务表查询成功，共有 ${taskCount} 条记录`);
      console.log('📊 前5条数据:', tasks);
    }

    // 4. 测试员工表
    console.log('\n4️⃣ 测试员工表查询...');
    const { data: employees, error: employeesError, count: empCount } = await supabase
      .from('employees')
      .select('id, name, position', { count: 'exact' })
      .limit(5);

    if (employeesError) {
      console.error('❌ 员工表查询失败:', employeesError.message);
    } else {
      console.log(`✅ 员工表查询成功，共有 ${empCount} 条记录`);
      console.log('📊 前5条数据:', employees);
    }

    // 5. 测试认证状态
    console.log('\n5️⃣ 测试认证状态...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ 认证检查失败:', authError.message);
    } else {
      console.log(session ? '✅ 已登录' : '⚠️ 未登录（使用匿名访问）');
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Supabase 连接测试完成！所有基本功能正常');
    console.log('═'.repeat(60));

    return {
      success: true,
      stats: {
        students: count,
        tasks: taskCount,
        employees: empCount,
      }
    };

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('错误详情:', error);
    
    console.log('\n💡 排查建议:');
    console.log('1. 检查 .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
    console.log('2. 确认 Supabase 项目是否正常运行');
    console.log('3. 检查网络连接');
    console.log('4. 验证 API Key 权限设置');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
testSupabaseConnection()
  .then(result => {
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('未处理的错误:', error);
    process.exit(1);
  });


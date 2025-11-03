/**
 * MCP Server 测试脚本
 * 测试本地 Supabase MCP Server 的功能
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 测试 Supabase MCP Server\n');
console.log('═'.repeat(60));

// 启动 MCP Server
const serverPath = join(__dirname, '.cursor', 'supabase_mcp_server.js');
const server = spawn('node', [serverPath]);

// 测试用例
const tests = [
  {
    name: '列出所有表',
    request: {
      tool: 'list_tables',
      params: {}
    }
  },
  {
    name: '获取tasks表结构',
    request: {
      tool: 'get_table_schema',
      params: {
        table: 'tasks'
      }
    }
  },
  {
    name: '查询进行中的任务',
    request: {
      tool: 'query_table',
      params: {
        table: 'tasks',
        select: 'id, title, status, priority',
        filters: { status: '进行中' },
        limit: 5
      }
    }
  },
  {
    name: '统计学生总数',
    request: {
      tool: 'count_records',
      params: {
        table: 'students'
      }
    }
  }
];

let currentTest = 0;

// 监听服务器输出
server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    const test = tests[currentTest - 1];
    
    console.log(`\n✅ 测试 ${currentTest}: ${test.name}`);
    console.log('─'.repeat(60));
    console.log('响应:', JSON.stringify(response, null, 2));
    
    // 运行下一个测试
    if (currentTest < tests.length) {
      runTest(tests[currentTest]);
    } else {
      console.log('\n' + '═'.repeat(60));
      console.log('✅ 所有测试完成！');
      server.kill();
      process.exit(0);
    }
  } catch (e) {
    console.error('解析响应失败:', e.message);
  }
});

server.stderr.on('data', (data) => {
  console.log('[Server]', data.toString().trim());
});

server.on('close', (code) => {
  console.log(`\n服务器已关闭，退出码: ${code}`);
});

// 运行测试
function runTest(test) {
  currentTest++;
  console.log(`\n🧪 运行测试 ${currentTest}: ${test.name}`);
  console.log('请求:', JSON.stringify(test.request, null, 2));
  server.stdin.write(JSON.stringify(test.request) + '\n');
}

// 等待服务器启动
setTimeout(() => {
  if (currentTest === 0) {
    runTest(tests[0]);
  }
}, 1000);

// 超时保护
setTimeout(() => {
  console.error('\n❌ 测试超时');
  server.kill();
  process.exit(1);
}, 30000);


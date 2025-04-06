// 数据库结构获取脚本
// 运行此脚本可以获取Supabase数据库的结构并生成markdown文档

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Supabase配置信息 - 从环境变量中获取
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';

console.log('使用Supabase URL:', supabaseUrl);
console.log('API密钥长度:', supabaseKey.length);

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 要检查的表名列表
const tableNames = [
  'finance_transactions',
  'finance_categories',
  'finance_accounts',
  'finance_service_types',
  'people',
  'persons',
  'projects',
  'students',
  'services'
];

// 获取表的数据
async function fetchTableData(tableName) {
  console.log(`获取 ${tableName} 表的数据...`);
  try {
    // 尝试直接获取表数据，因为get_table_schema函数可能不可用
    const { data: sampleData, error: dataError } = await supabase
      .from(tableName)
      .select('*')
      .limit(5);

    if (dataError) {
      console.error(`获取 ${tableName} 表数据出错:`, dataError);
      return { exists: false, schema: null, sampleData: null, error: dataError };
    }

    // 如果获取到了数据，说明表存在
    console.log(`成功获取到 ${tableName} 表的 ${sampleData?.length || 0} 条数据`);

    // 获取记录总数
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error(`获取 ${tableName} 表记录数出错:`, countError);
    }

    // 从样例数据推断表结构
    const schema = sampleData && sampleData.length > 0 
      ? Object.keys(sampleData[0]).map(column_name => ({
          column_name,
          data_type: typeof sampleData[0][column_name],
          is_nullable: true // 无法通过API直接判断是否可空
        }))
      : [];

    return {
      exists: true,
      schema,
      sampleData,
      count: count || 'unknown',
      error: null
    };
  } catch (err) {
    console.error(`处理 ${tableName} 表时发生错误:`, err);
    return { exists: false, schema: null, sampleData: null, error: err };
  }
}

// 生成数据库文档的函数
async function generateDatabaseDoc() {
  try {
    console.log('开始生成数据库文档...');
    
    // 收集所有表的数据
    const tablesData = {};
    for (const tableName of tableNames) {
      tablesData[tableName] = await fetchTableData(tableName);
    }
    
    // 生成markdown文档
    let markdown = `# Supabase 数据库文档

## 数据库概览

数据库URL: ${supabaseUrl}

本文档基于实际API调用，描述了当前Supabase数据库的结构和关系。
文档生成时间: ${new Date().toLocaleString()}

## 数据表结构

`;
    
    // 添加每个表的信息
    for (const tableName of tableNames) {
      const tableData = tablesData[tableName];
      
      if (tableData.exists && tableData.sampleData && tableData.sampleData.length > 0) {
        markdown += `### 表: ${tableName}\n\n`;
        
        // 表说明
        let tableDescription = '';
        if (tableName === 'finance_transactions') tableDescription = '财务交易表 - 存储所有财务交易记录';
        else if (tableName === 'finance_categories') tableDescription = '财务分类表 - 定义交易的分类';
        else if (tableName === 'finance_accounts') tableDescription = '财务账户表 - 记录各种财务账户';
        else if (tableName === 'finance_service_types') tableDescription = '服务类型表 - 定义提供的各种服务类型';
        else if (tableName === 'people' || tableName === 'persons') tableDescription = '人员表 - 存储客户、合作伙伴等人员信息';
        else if (tableName === 'projects') tableDescription = '项目表 - 存储各种申请和服务项目';
        else if (tableName === 'students') tableDescription = '学生表 - 存储学生相关信息';
        else if (tableName === 'services') tableDescription = '服务表 - 定义服务项目';
        
        markdown += `${tableDescription}\n\n`;
        
        // 记录数
        markdown += `**记录总数:** ${tableData.count}\n\n`;
        
        // 表结构
        if (tableData.schema && tableData.schema.length > 0) {
          markdown += `**表结构:**\n\n`;
          markdown += `| 字段名 | 数据类型 | 是否为空 | 描述 |\n`;
          markdown += `|--------|----------|----------|------|\n`;
          
          tableData.schema.forEach(column => {
            markdown += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable ? '可为空' : '非空'} | ${getColumnDescription(tableName, column.column_name)} |\n`;
          });
          
          markdown += `\n`;
        } else {
          markdown += `表结构信息不可用\n\n`;
        }
        
        // 样例数据
        if (tableData.sampleData && tableData.sampleData.length > 0) {
          markdown += `**样例数据:**\n\n`;
          markdown += `\`\`\`json\n${JSON.stringify(tableData.sampleData, null, 2)}\n\`\`\`\n\n`;
        } else {
          markdown += `无样例数据\n\n`;
        }
        
        // 分隔线
        markdown += `---\n\n`;
      } else if (tableData.error) {
        markdown += `### 表: ${tableName}\n\n`;
        markdown += `获取信息出错: ${tableData.error.message || '未知错误'}\n\n`;
        markdown += `---\n\n`;
      }
    }
    
    // 添加数据库关系信息
    markdown += `## 数据库关系\n\n`;
    markdown += `根据表结构分析，数据库表之间存在以下关系:\n\n`;
    markdown += `- \`finance_transactions\` 表通过外键关联到以下表：\n`;
    markdown += `  - \`person_id\` -> \`people\` 或 \`persons\`表\n`;
    markdown += `  - \`project_id\` -> \`projects\`表\n`;
    markdown += `  - \`service_type_id\` -> \`finance_service_types\`表\n`;
    markdown += `  - \`category_id\` -> \`finance_categories\`表\n`;
    markdown += `  - \`account_id\` -> \`finance_accounts\`表\n\n`;
    markdown += `- \`projects\` 表通过 \`client_id\` 关联到 \`people\` 或 \`persons\` 表\n\n`;
    
    // 访问方式部分
    markdown += `## 访问方式\n\n`;
    markdown += `数据库通过Supabase提供的API进行访问，使用JavaScript客户端库。\n\n`;
    markdown += `### 初始化客户端\n\n`;
    markdown += `\`\`\`javascript\n`;
    markdown += `import { createClient } from '@supabase/supabase-js';\n\n`;
    markdown += `const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;\n`;
    markdown += `const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;\n\n`;
    markdown += `export const supabase = createClient(supabaseUrl, supabaseKey);\n`;
    markdown += `\`\`\`\n\n`;
    
    markdown += `### 查询示例\n\n`;
    markdown += `\`\`\`javascript\n`;
    markdown += `// 获取所有交易记录（包含关联数据）\n`;
    markdown += `async function getAllTransactions() {\n`;
    markdown += `  const { data, error } = await supabase\n`;
    markdown += `    .from('finance_transactions')\n`;
    markdown += `    .select(\`\n`;
    markdown += `      *,\n`;
    markdown += `      person:person_id(*),\n`;
    markdown += `      project:project_id(*),\n`;
    markdown += `      service_type:service_type_id(*),\n`;
    markdown += `      category:category_id(*),\n`;
    markdown += `      account:account_id(*)\n`;
    markdown += `    \`)\n`;
    markdown += `    .order('transaction_date', { ascending: false });\n\n`;
    markdown += `  if (error) throw error;\n`;
    markdown += `  return data;\n`;
    markdown += `}\n`;
    markdown += `\`\`\`\n\n`;
    
    // 写入文件
    fs.writeFileSync(path.join(process.cwd(), 'SUPABASE_DATABASE.md'), markdown);
    console.log('数据库文档已生成并保存到 SUPABASE_DATABASE.md');
  } catch (err) {
    console.error('生成数据库文档时出错:', err);
  }
}

// 获取字段描述的辅助函数
function getColumnDescription(tableName, columnName) {
  // 根据表名和字段名返回相应的描述
  const descriptions = {
    'finance_transactions': {
      'id': '交易ID，主键',
      'person_id': '关联人员ID，外键',
      'project_id': '关联项目ID，外键',
      'service_type_id': '服务类型ID，外键',
      'amount': '交易金额',
      'direction': '交易方向，"收入"或"支出"',
      'status': '交易状态，"已完成"、"待收款"、"待支付"或"已取消"',
      'category_id': '交易分类ID，外键',
      'transaction_date': '交易日期',
      'account_id': '账户ID，外键',
      'notes': '交易备注',
      'remarks': '交易备注',
      'created_at': '创建时间',
      'updated_at': '更新时间'
    },
    'finance_categories': {
      'id': '分类ID，主键',
      'name': '分类名称，如"服务收入"、"咨询支出"',
      'description': '分类描述',
      'direction': '分类方向，"收入"或"支出"',
      'is_active': '是否激活'
    },
    'finance_accounts': {
      'id': '账户ID，主键',
      'name': '账户名称，如"银行账户"',
      'account_type': '账户类型',
      'balance': '账户余额',
      'is_active': '是否激活'
    },
    'finance_service_types': {
      'id': '服务类型ID，主键',
      'name': '服务类型名称，如"意大利临床医学本科"',
      'description': '服务描述',
      'is_active': '是否激活'
    }
  };

  // 所有表通用的字段描述
  const commonDescriptions = {
    'id': 'ID，主键',
    'created_at': '创建时间',
    'updated_at': '更新时间'
  };

  // 首先检查特定表的特定字段
  if (descriptions[tableName] && descriptions[tableName][columnName]) {
    return descriptions[tableName][columnName];
  }
  
  // 然后检查通用字段
  if (commonDescriptions[columnName]) {
    return commonDescriptions[columnName];
  }
  
  // 默认返回空字符串
  return '';
}

// 执行生成文档的函数
generateDatabaseDoc()
  .then(() => console.log('文档生成完成'))
  .catch(err => console.error('文档生成过程中发生错误:', err)); 
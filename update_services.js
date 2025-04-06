// 更新服务类型的脚本
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从.env文件或环境变量获取Supabase凭证
// 如果没有设置，请替换为您的实际值
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // 使用service key以获得更高权限

// 确保有提供URL和Key
if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 请设置SUPABASE_URL和SUPABASE_SERVICE_KEY环境变量');
  console.error('您可以在Supabase项目设置中找到这些凭证');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 读取SQL文件
const sqlFilePath = path.join(__dirname, 'update_service_types.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

// 将SQL拆分为多个语句（根据分号分隔）
const statements = sqlQuery
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

async function executeSQL() {
  console.log('开始更新服务类型...');
  
  try {
    // 逐个执行SQL语句
    for (const [index, statement] of statements.entries()) {
      console.log(`执行语句 ${index + 1}/${statements.length}`);
      
      // 执行SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        query: statement + ';'
      });
      
      if (error) {
        console.error(`语句 ${index + 1} 执行失败:`, error);
      } else {
        console.log(`语句 ${index + 1} 执行成功!`);
        if (data) {
          console.log('结果:', data);
        }
      }
    }
    
    console.log('服务类型更新完成!');
    
    // 查询当前的服务类型列表
    const { data, error } = await supabase
      .from('service_types')
      .select('*')
      .order('id');
      
    if (error) {
      console.error('获取服务类型列表失败:', error);
    } else {
      console.log('当前服务类型列表:');
      console.table(data);
    }
  } catch (error) {
    console.error('执行过程中发生错误:', error);
  }
}

// 执行更新操作
executeSQL(); 
// updateFinance.js
// 导入Supabase客户端
import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 更新财务数据函数
async function updateFinancialData() {
  try {
    console.log('开始更新财务数据...');
    
    // 首先检查账户和分类是否存在，如果不存在则创建
    const { data: accountsExist } = await supabase
      .from('finance_accounts')
      .select('id, name')
      .eq('name', '银行账户');
    
    if (!accountsExist || accountsExist.length === 0) {
      console.log('创建银行账户...');
      await supabase.from('finance_accounts').insert([
        { name: '银行账户', account_type: '银行', balance: 0, is_active: true }
      ]);
    }
    
    // 检查分类并创建
    const { data: categoriesExist } = await supabase
      .from('finance_categories')
      .select('id, name');
    
    if (!categoriesExist || categoriesExist.length === 0) {
      console.log('创建交易分类...');
      await supabase.from('finance_categories').insert([
        { name: '服务收入', direction: '收入', is_active: true },
        { name: '咨询支出', direction: '支出', is_active: true }
      ]);
    }
    
    // 添加相关人员信息
    console.log('添加人员信息...');
    const people = [
      { name: '李润泽', email: 'lrz@example.com', created_at: new Date() },
      { name: '段星宇', email: 'dxy@example.com', created_at: new Date() },
      { name: '美际', type: '机构', contact: 'contact@meiji.com', created_at: new Date() }
    ];
    
    await supabase.from('persons').upsert(people, { 
      onConflict: 'name'
    });
    
    // 添加服务类型
    console.log('添加服务类型...');
    const serviceTypes = [
      { name: '意大利临床医学本科', is_active: true },
      { name: '澳城保录设计学硕士 定金', is_active: true }
    ];
    
    await supabase.from('finance_service_types').upsert(serviceTypes, {
      onConflict: 'name'
    });
    
    // 获取人员和服务类型的ID
    const { data: peopleData } = await supabase.from('persons').select('id, name');
    const { data: serviceTypesData } = await supabase.from('finance_service_types').select('id, name');
    const { data: accountsData } = await supabase.from('finance_accounts').select('id, name');
    const { data: categoriesData } = await supabase.from('finance_categories').select('id, name');
    
    console.log('获取到的人员数据:', peopleData);
    console.log('获取到的服务类型数据:', serviceTypesData);
    console.log('获取到的账户数据:', accountsData);
    console.log('获取到的分类数据:', categoriesData);
    
    // 添加项目
    console.log('添加项目信息...');
    const projects = [
      { 
        name: '意大利临床医学本科申请', 
        status: '进行中',
        client_id: peopleData?.find(p => p.name === '李润泽')?.id,
        start_date: '2024-01-01',
        created_at: new Date()
      },
      { 
        name: '澳城保录设计学硕士申请', 
        status: '进行中',
        client_id: peopleData?.find(p => p.name === '段星宇')?.id,
        start_date: '2024-03-23',
        created_at: new Date()
      }
    ];
    
    await supabase.from('projects').upsert(projects, {
      onConflict: 'name'
    });
    
    // 获取项目ID
    const { data: projectsData } = await supabase.from('projects').select('id, name');
    console.log('获取到的项目数据:', projectsData);
    
    // 构建交易数据
    console.log('添加交易记录...');
    const transactions = [
      {
        person_id: peopleData?.find(p => p.name === '李润泽')?.id,
        project_id: projectsData?.find(p => p.name === '意大利临床医学本科申请')?.id,
        service_type_id: serviceTypesData?.find(s => s.name === '意大利临床医学本科')?.id,
        amount: 23000,
        direction: '收入',
        status: '已完成',
        category_id: categoriesData?.find(c => c.name === '服务收入')?.id,
        transaction_date: '2024-01-01',
        account_id: accountsData?.find(a => a.name === '银行账户')?.id,
        notes: '全程申请',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        person_id: peopleData?.find(p => p.name === '段星宇')?.id,
        project_id: projectsData?.find(p => p.name === '澳城保录设计学硕士申请')?.id,
        service_type_id: serviceTypesData?.find(s => s.name === '澳城保录设计学硕士 定金')?.id,
        amount: 10000,
        direction: '收入',
        status: '已完成',
        category_id: categoriesData?.find(c => c.name === '服务收入')?.id,
        transaction_date: '2024-03-23',
        account_id: accountsData?.find(a => a.name === '银行账户')?.id,
        notes: '全程申请',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        person_id: peopleData?.find(p => p.name === '美际')?.id,
        project_id: projectsData?.find(p => p.name === '澳城保录设计学硕士申请')?.id,
        service_type_id: serviceTypesData?.find(s => s.name === '澳城保录设计学硕士 定金')?.id,
        amount: 5000,
        direction: '支出',
        status: '已完成',
        category_id: categoriesData?.find(c => c.name === '咨询支出')?.id,
        transaction_date: '2024-03-23',
        account_id: accountsData?.find(a => a.name === '银行账户')?.id,
        notes: '支出',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    // 添加交易记录
    const { data, error } = await supabase.from('finance_transactions').upsert(transactions);
    
    if (error) {
      console.error('更新财务数据失败', error);
      return { success: false, error };
    }
    
    console.log('成功更新财务数据');
    return { success: true, data };
  } catch (error) {
    console.error('处理数据时出错', error);
    return { success: false, error };
  }
}

// 运行更新函数
updateFinancialData().then(result => {
  console.log('操作结果:', result);
  process.exit(0);
}).catch(err => {
  console.error('操作失败:', err);
  process.exit(1);
}); 
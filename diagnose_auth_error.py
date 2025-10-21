#!/usr/bin/env python3
"""
诊断 Supabase Auth 错误
"""

from supabase import create_client, Client

SUPABASE_URL = "https://swyajeiqqewyckzbfkid.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs"

def main():
    print("=" * 80)
    print("诊断 Supabase Auth 错误")
    print("=" * 80)
    print()

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 测试1: 检查 employees 表访问
    print("测试 1: 检查 employees 表访问权限")
    print("-" * 80)
    try:
        result = supabase.table('employees').select('id, name, email, auth_id').limit(5).execute()
        print(f"✅ 可以访问 employees 表")
        print(f"   查询到 {len(result.data)} 条记录")
        for emp in result.data:
            print(f"   - {emp['name']} ({emp['email']})")
    except Exception as e:
        print(f"❌ 访问失败: {e}")
    print()

    # 测试2: 尝试用邮箱查询
    print("测试 2: 使用邮箱查询 employees")
    print("-" * 80)
    test_email = "evanxu@studylandsedu.com"
    try:
        result = supabase.table('employees').select('*').eq('email', test_email).execute()
        print(f"✅ 查询成功")
        if result.data:
            print(f"   找到记录: {result.data[0]['name']}")
            print(f"   Auth ID: {result.data[0].get('auth_id')}")
        else:
            print(f"   未找到邮箱为 {test_email} 的记录")
    except Exception as e:
        print(f"❌ 查询失败: {e}")
    print()

    # 测试3: 检查 students 表
    print("测试 3: 检查 students 表访问权限")
    print("-" * 80)
    try:
        result = supabase.table('students').select('id, name, email, auth_id').limit(5).execute()
        print(f"✅ 可以访问 students 表")
        print(f"   查询到 {len(result.data)} 条记录")
    except Exception as e:
        print(f"❌ 访问失败: {e}")
    print()

    # 测试4: 检查 RLS 策略
    print("测试 4: 检查可能的 RLS 问题")
    print("-" * 80)
    print("提示: 如果上面的查询都成功,但登录失败,")
    print("      可能是 RLS (Row Level Security) 策略的问题")
    print()
    print("解决方案:")
    print("1. 检查 employees 和 students 表的 RLS 是否启用")
    print("2. 如果启用了 RLS,需要添加允许匿名访问的策略")
    print()
    print("在 Supabase SQL Editor 运行:")
    print("""
-- 临时禁用 RLS 进行测试
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- 或者添加允许查询的策略
CREATE POLICY "Allow anon select" ON employees
  FOR SELECT USING (true);

CREATE POLICY "Allow anon select" ON students
  FOR SELECT USING (true);
""")
    print()

    # 测试5: 尝试简单的 Auth 登录测试
    print("测试 5: 检查 Auth 配置")
    print("-" * 80)
    print("⚠️  注意: 使用 anon key 无法直接测试登录")
    print("   需要实际的用户凭据")
    print()
    print("请确认:")
    print("1. ✅ 在 Supabase Dashboard → Authentication → Users 中有用户")
    print("2. ✅ 用户的邮箱与 employees/students 表中的邮箱匹配")
    print("3. ✅ employees/students 表中的 auth_id 已正确设置")
    print()

if __name__ == "__main__":
    main()


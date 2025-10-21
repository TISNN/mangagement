#!/usr/bin/env python3
"""
Supabase 认证系统配置检查和设置脚本
用于检查数据库结构并自动配置认证所需的字段
"""

import os
from supabase import create_client, Client

# Supabase 配置
SUPABASE_URL = "https://swyajeiqqewyckzbfkid.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs"

def main():
    print("=" * 60)
    print("Supabase 认证系统配置检查")
    print("=" * 60)
    print()

    # 创建 Supabase 客户端
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ 成功连接到 Supabase")
    except Exception as e:
        print(f"❌ 连接 Supabase 失败: {e}")
        return

    print()
    print("-" * 60)
    print("检查 employees 表")
    print("-" * 60)

    # 检查 employees 表
    try:
        # 查询表结构 (查询一条记录来查看字段)
        result = supabase.table('employees').select('*').limit(1).execute()
        
        if result.data:
            print(f"✅ employees 表存在,共有 {len(result.data[0].keys())} 个字段")
            print("\n字段列表:")
            for field in sorted(result.data[0].keys()):
                print(f"  - {field}")
            
            # 检查是否有 auth_id 字段
            if 'auth_id' in result.data[0]:
                print("\n✅ auth_id 字段已存在")
            else:
                print("\n⚠️  auth_id 字段不存在")
                print("   需要添加此字段来关联 Supabase Auth 用户")
        else:
            print("⚠️  employees 表为空")
            
        # 查询所有员工
        all_employees = supabase.table('employees').select('id, name, email, position, is_active, auth_id').execute()
        print(f"\n员工总数: {len(all_employees.data)}")
        
        if all_employees.data:
            print("\n员工列表:")
            for emp in all_employees.data:
                auth_status = "✅ 已关联" if emp.get('auth_id') else "❌ 未关联"
                active_status = "✅ 激活" if emp.get('is_active') else "❌ 未激活"
                print(f"  - ID: {emp.get('id')}, 姓名: {emp.get('name')}, 邮箱: {emp.get('email')}")
                print(f"    职位: {emp.get('position')}, 状态: {active_status}, Auth: {auth_status}")
                if emp.get('auth_id'):
                    print(f"    Auth ID: {emp.get('auth_id')}")
        
    except Exception as e:
        print(f"❌ 查询 employees 表失败: {e}")

    print()
    print("-" * 60)
    print("检查 students 表")
    print("-" * 60)

    # 检查 students 表
    try:
        result = supabase.table('students').select('*').limit(1).execute()
        
        if result.data:
            print(f"✅ students 表存在,共有 {len(result.data[0].keys())} 个字段")
            print("\n字段列表:")
            for field in sorted(result.data[0].keys()):
                print(f"  - {field}")
            
            # 检查是否有 auth_id 字段
            if 'auth_id' in result.data[0]:
                print("\n✅ auth_id 字段已存在")
            else:
                print("\n⚠️  auth_id 字段不存在")
                print("   需要添加此字段来关联 Supabase Auth 用户")
        else:
            print("⚠️  students 表为空")
            
        # 统计学生数量
        all_students = supabase.table('students').select('id, name, email, status, auth_id').execute()
        print(f"\n学生总数: {len(all_students.data)}")
        
        # 统计有 auth_id 的学生
        students_with_auth = [s for s in all_students.data if s.get('auth_id')]
        print(f"已关联 Auth 的学生: {len(students_with_auth)}")
        
    except Exception as e:
        print(f"❌ 查询 students 表失败: {e}")

    print()
    print("-" * 60)
    print("检查 Auth 用户")
    print("-" * 60)
    
    # 注意: anon key 无法直接查询 auth.users 表
    # 需要使用 service_role key 或通过 Supabase Dashboard 查看
    print("⚠️  使用 anon key 无法直接查询 auth.users 表")
    print("   请访问 Supabase Dashboard → Authentication → Users 查看")
    print("   或使用 service_role key 运行此脚本")

    print()
    print("=" * 60)
    print("检查完成!")
    print("=" * 60)
    print()
    
    # 提供下一步建议
    print("📋 下一步操作建议:")
    print()
    print("1. 如果 auth_id 字段不存在,需要运行以下 SQL:")
    print("   ALTER TABLE employees ADD COLUMN IF NOT EXISTS auth_id UUID;")
    print("   ALTER TABLE students ADD COLUMN IF NOT EXISTS auth_id UUID;")
    print()
    print("2. 在 Supabase Dashboard 创建 Auth 用户:")
    print("   Authentication → Users → Add user")
    print()
    print("3. 关联 Auth 用户到 employees 表:")
    print("   UPDATE employees")
    print("   SET auth_id = 'user-uuid-from-auth'")
    print("   WHERE email = 'user-email@example.com';")
    print()
    print("4. 测试登录:")
    print("   访问 http://localhost:5173/login")
    print()

if __name__ == "__main__":
    main()


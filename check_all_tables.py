#!/usr/bin/env python3
"""
全面检查 Supabase 数据库的所有表和结构
"""

import os
from supabase import create_client, Client
import json

# Supabase 配置
SUPABASE_URL = "https://swyajeiqqewyckzbfkid.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs"

# 需要检查的关键表
KEY_TABLES = [
    'employees',
    'students', 
    'service_types',
    'student_services',
    'mentors',
    'finance_transactions',
    'finance_accounts',
    'finance_categories',
    'schools',
    'programs',
    'leads',
    'projects',
    'chat_channels',
    'chat_messages',
    'employee_roles',
    'permissions',
    'role_permissions',
    'employee_role_assignments'
]

def get_table_structure(supabase: Client, table_name: str):
    """获取表结构"""
    try:
        result = supabase.table(table_name).select('*').limit(1).execute()
        if result.data and len(result.data) > 0:
            return list(result.data[0].keys())
        else:
            # 如果表为空，尝试查询但不限制
            result = supabase.table(table_name).select('*').limit(0).execute()
            return []
    except Exception as e:
        return None

def get_table_count(supabase: Client, table_name: str):
    """获取表记录数"""
    try:
        result = supabase.table(table_name).select('id', count='exact').execute()
        return result.count
    except:
        try:
            result = supabase.table(table_name).select('*', count='exact').execute()
            return result.count
        except:
            return None

def check_auth_related_fields(fields):
    """检查是否有认证相关字段"""
    auth_fields = []
    if 'auth_id' in fields:
        auth_fields.append('auth_id ✅')
    if 'email' in fields:
        auth_fields.append('email')
    if 'password' in fields:
        auth_fields.append('password')
    return auth_fields

def main():
    print("=" * 80)
    print("Supabase 数据库全面检查")
    print("=" * 80)
    print()

    # 创建 Supabase 客户端
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ 成功连接到 Supabase")
        print()
    except Exception as e:
        print(f"❌ 连接 Supabase 失败: {e}")
        return

    print("=" * 80)
    print("检查所有关键表")
    print("=" * 80)
    print()

    table_summary = []
    
    for table_name in KEY_TABLES:
        print(f"{'─' * 80}")
        print(f"📊 表: {table_name}")
        print(f"{'─' * 80}")
        
        # 获取表结构
        fields = get_table_structure(supabase, table_name)
        
        if fields is None:
            print(f"❌ 表不存在或无法访问")
            table_summary.append({
                'name': table_name,
                'status': '❌ 不存在',
                'count': 0,
                'fields': []
            })
            print()
            continue
        
        if len(fields) == 0:
            print(f"⚠️  表存在但为空，无法获取字段结构")
            count = get_table_count(supabase, table_name)
            table_summary.append({
                'name': table_name,
                'status': '⚠️  空表',
                'count': count or 0,
                'fields': []
            })
            print()
            continue
        
        # 获取记录数
        count = get_table_count(supabase, table_name)
        
        print(f"✅ 表存在")
        print(f"📈 记录数: {count if count is not None else '未知'}")
        print(f"🔢 字段数: {len(fields)}")
        print()
        
        # 检查认证相关字段
        auth_fields = check_auth_related_fields(fields)
        if auth_fields:
            print(f"🔐 认证相关字段: {', '.join(auth_fields)}")
            print()
        
        # 显示所有字段
        print("字段列表:")
        for i, field in enumerate(sorted(fields), 1):
            # 标记重要字段
            important = ""
            if field == 'id':
                important = " 🔑 (主键)"
            elif field == 'auth_id':
                important = " 🔐 (Auth关联)"
            elif field.endswith('_id') or field.endswith('_ref_id'):
                important = " 🔗 (外键)"
            elif field == 'email':
                important = " 📧 (邮箱)"
            elif field == 'created_at':
                important = " 📅 (创建时间)"
            elif field == 'updated_at':
                important = " ⏰ (更新时间)"
                
            print(f"  {i:2d}. {field}{important}")
        
        table_summary.append({
            'name': table_name,
            'status': '✅ 正常',
            'count': count or 0,
            'fields': fields,
            'auth_fields': auth_fields
        })
        
        print()

    # 打印总结
    print("=" * 80)
    print("📋 表结构总结")
    print("=" * 80)
    print()
    
    print(f"{'表名':<30} {'状态':<12} {'记录数':<10} {'字段数':<8} {'Auth字段'}")
    print("─" * 80)
    
    for table in table_summary:
        status = table['status']
        count = table['count']
        field_count = len(table['fields'])
        auth = '✅' if table.get('auth_fields') else '❌'
        
        print(f"{table['name']:<30} {status:<12} {count:<10} {field_count:<8} {auth}")
    
    print()
    print("=" * 80)
    print("🔐 认证系统相关检查")
    print("=" * 80)
    print()
    
    # 检查认证必需的表和字段
    auth_checks = {
        'employees': ['id', 'email', 'name', 'auth_id', 'is_active'],
        'students': ['id', 'email', 'name', 'auth_id', 'status'],
        'employee_roles': ['id', 'name'],
        'permissions': ['id', 'code', 'name'],
        'role_permissions': ['role_id', 'permission_id'],
        'employee_role_assignments': ['employee_id', 'role_id']
    }
    
    for table_name, required_fields in auth_checks.items():
        table_data = next((t for t in table_summary if t['name'] == table_name), None)
        
        if not table_data:
            print(f"❌ {table_name}: 表不存在")
            continue
        
        if table_data['status'] != '✅ 正常':
            print(f"⚠️  {table_name}: {table_data['status']}")
            continue
        
        missing_fields = [f for f in required_fields if f not in table_data['fields']]
        
        if missing_fields:
            print(f"⚠️  {table_name}: 缺少字段 {', '.join(missing_fields)}")
        else:
            print(f"✅ {table_name}: 所有必需字段齐全")
    
    print()
    print("=" * 80)
    print("💡 建议和下一步")
    print("=" * 80)
    print()
    
    # 检查 students 表的 auth_id
    students_table = next((t for t in table_summary if t['name'] == 'students'), None)
    if students_table and 'auth_id' not in students_table['fields']:
        print("🔧 需要修复:")
        print("   1. students 表缺少 auth_id 字段")
        print("   2. 运行以下 SQL:")
        print("      ALTER TABLE students ADD COLUMN auth_id UUID;")
        print("      CREATE INDEX idx_students_auth_id ON students(auth_id);")
        print()
    
    # 检查权限系统表
    permission_tables = ['employee_roles', 'permissions', 'role_permissions', 'employee_role_assignments']
    missing_permission_tables = [t for t in permission_tables if t not in [s['name'] for s in table_summary if s['status'] == '✅ 正常']]
    
    if missing_permission_tables:
        print("⚠️  权限系统表:")
        print(f"   缺少或无法访问: {', '.join(missing_permission_tables)}")
        print("   权限系统可能无法正常工作")
        print()
    
    print("✅ 可以立即测试:")
    print("   - 管理员登录 (employees 表已配置好 auth_id)")
    print("   - 访问 http://localhost:5173/login")
    print()
    
    # 保存详细报告到文件
    with open('database_structure_report.json', 'w', encoding='utf-8') as f:
        json.dump(table_summary, f, indent=2, ensure_ascii=False)
    
    print("📄 详细报告已保存到: database_structure_report.json")
    print()

if __name__ == "__main__":
    main()


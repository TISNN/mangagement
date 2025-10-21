#!/usr/bin/env python3
"""
最终测试 Supabase Auth 登录
"""

from supabase import create_client, Client

SUPABASE_URL = "https://swyajeiqqewyckzbfkid.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs"

def test_login():
    print("=" * 60)
    print("测试 Supabase Auth 登录")
    print("=" * 60)
    print()

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    try:
        # 尝试登录
        print("尝试登录...")
        print("邮箱: evanxu@studylandsedu.com")
        print("密码: Admin123!")
        print()

        response = supabase.auth.sign_in_with_password({
            "email": "evanxu@studylandsedu.com",
            "password": "Admin123!"
        })

        if response.user:
            print("✅ 登录成功!")
            print()
            print(f"User ID: {response.user.id}")
            print(f"Email: {response.user.email}")
            print(f"Role: {response.user.role}")
            print()
            
            # 查询员工信息
            print("查询员工信息...")
            employee = supabase.table('employees').select('*').eq('auth_id', response.user.id).single().execute()
            
            if employee.data:
                print("✅ 找到员工资料!")
                print(f"姓名: {employee.data['name']}")
                print(f"职位: {employee.data['position']}")
                print()
                print("🎉 完整的认证流程成功!")
            else:
                print("⚠️  未找到对应的员工资料")
        else:
            print("❌ 登录失败: 未返回用户信息")

    except Exception as e:
        print(f"❌ 登录失败: {e}")
        print()
        print("请检查:")
        print("1. 密码是否正确")
        print("2. 邮箱是否已确认")
        print("3. 用户是否存在")

if __name__ == "__main__":
    test_login()


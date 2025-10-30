#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
添加汪子涵的选校列表到数据库
"""

import os
from supabase import create_client, Client
from datetime import datetime

# Supabase 配置
SUPABASE_URL = "https://wnkbznecihafvulczihg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indua2J6bmVjaWhhZnZ1bGN6aWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MTYyOTMsImV4cCI6MjA1MzI5MjI5M30.P9BtOl9LZz90WGXe9oW7i7B4mQKt8_LrxSMBujJPYUE"

# 初始化 Supabase 客户端
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 汪子涵的选校数据
university_choices = [
    {
        "school_name": "帝国理工学院",
        "program_name": "商业经济与战略理学硕士",
        "application_type": "冲刺院校"
    },
    {
        "school_name": "慕尼黑工业大学（德国）",
        "program_name": "财务与信息管理硕士",
        "application_type": "冲刺院校"
    },
    {
        "school_name": "新加坡国立大学",
        "program_name": "金融理学硕士",
        "application_type": "冲刺院校"
    },
    {
        "school_name": "香港大学",
        "program_name": "金融学硕士",
        "application_type": "冲刺院校"
    },
    {
        "school_name": "伦敦政治经济学院",
        "program_name": "信息系统与数字化创新管理理学硕士",
        "application_type": "目标院校"
    },
    {
        "school_name": "南洋理工大学",
        "program_name": "供应链工程理学硕士",
        "application_type": "目标院校"
    },
    {
        "school_name": "新加坡国立大学",
        "program_name": "供应链管理理学硕士",
        "application_type": "目标院校"
    },
    {
        "school_name": "香港大学",
        "program_name": "工程硕士（工业工程与物流管理）",
        "application_type": "目标院校"
    },
    {
        "school_name": "香港理工大学",
        "program_name": "工业物流系统理学硕士",
        "application_type": "保底院校"
    },
    {
        "school_name": "曼彻斯特大学",
        "program_name": "运营项目与供应链管理理学硕士",
        "application_type": "保底院校"
    },
]


def find_or_create_student(name: str) -> int:
    """查找或创建学生记录"""
    print(f"\n🔍 查找学生: {name}")
    
    # 首先在 leads 表中查找
    response = supabase.table('leads').select('id, name').eq('name', name).execute()
    
    if response.data and len(response.data) > 0:
        student_id = response.data[0]['id']
        print(f"✅ 找到学生 ID: {student_id}")
        return student_id
    
    # 如果不存在，创建新的学生记录
    print(f"⚠️  学生不存在，创建新记录...")
    new_student = {
        'name': name,
        'status': '咨询中',
        'source': '直接添加',
        'created_at': datetime.now().isoformat()
    }
    
    response = supabase.table('leads').insert(new_student).execute()
    
    if response.data and len(response.data) > 0:
        student_id = response.data[0]['id']
        print(f"✅ 创建学生成功，ID: {student_id}")
        return student_id
    
    raise Exception("❌ 创建学生失败")


def add_university_choices(student_id: int, choices: list):
    """添加选校列表"""
    print(f"\n📝 开始添加选校列表...")
    
    success_count = 0
    error_count = 0
    
    for i, choice in enumerate(choices, 1):
        try:
            # 准备数据
            data = {
                'student_id': student_id,
                'school_name': choice['school_name'],
                'program_name': choice['program_name'],
                'program_level': '硕士',  # 默认为硕士
                'application_type': choice['application_type'],
                'submission_status': '未投递',
                'priority_rank': i,
                'created_at': datetime.now().isoformat()
            }
            
            # 插入数据
            response = supabase.table('final_university_choices').insert(data).execute()
            
            if response.data:
                print(f"  ✅ [{i}/10] {choice['school_name']} - {choice['program_name']}")
                success_count += 1
            else:
                print(f"  ❌ [{i}/10] 添加失败: {choice['school_name']}")
                error_count += 1
                
        except Exception as e:
            print(f"  ❌ [{i}/10] 错误: {choice['school_name']} - {str(e)}")
            error_count += 1
    
    print(f"\n📊 完成统计:")
    print(f"  ✅ 成功: {success_count}")
    print(f"  ❌ 失败: {error_count}")
    print(f"  📦 总计: {len(choices)}")
    
    return success_count, error_count


def main():
    """主函数"""
    print("=" * 60)
    print("📚 添加汪子涵的选校列表到数据库")
    print("=" * 60)
    
    try:
        # 1. 查找或创建学生
        student_id = find_or_create_student("汪子涵")
        
        # 2. 添加选校列表
        success_count, error_count = add_university_choices(student_id, university_choices)
        
        # 3. 显示结果
        print("\n" + "=" * 60)
        if error_count == 0:
            print("🎉 所有选校数据添加成功！")
        else:
            print(f"⚠️  完成添加，但有 {error_count} 条数据失败")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ 程序执行失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()


import os
import json
import requests
import dotenv

# 加载.env文件中的环境变量
dotenv.load_dotenv()

# 从环境变量中获取Supabase配置
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "https://swyajeiqqewyckzbfkid.supabase.co")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs")

# 获取所有数据库记录
def get_all_programs():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/programs?select=id,en_name,cn_name,school_id",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"获取所有记录失败: {response.status_code}")
            return []
    except Exception as e:
        print(f"获取所有记录出错: {e}")
        return []

# 读取JSON文件
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 删除指定ID的记录
def delete_records(ids):
    if not ids:
        print("没有需要删除的记录")
        return 0
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    deleted_count = 0
    
    for id_to_delete in ids:
        try:
            response = requests.delete(
                f"{SUPABASE_URL}/rest/v1/programs?id=eq.{id_to_delete}",
                headers=headers
            )
            
            if response.status_code in (200, 204):
                deleted_count += 1
                print(f"已删除记录ID: {id_to_delete}")
            else:
                print(f"删除记录失败: {id_to_delete}, 状态码: {response.status_code}")
        except Exception as e:
            print(f"删除记录出错: {id_to_delete}, 错误: {e}")
        
    return deleted_count

def main():
    # 获取所有数据库记录
    db_programs = get_all_programs()
    print(f"数据库中有 {len(db_programs)} 条记录")
    
    # 读取JSON文件
    json_programs = read_json_file('/Users/evanxu/Downloads/project/singapore_programs_processed.json')
    print(f"JSON文件中有 {len(json_programs)} 条记录")
    
    # 创建JSON中专业的唯一标识集合
    json_keys = set()
    for program in json_programs:
        key = f"{program['en_name']}_{program['school_id']}"
        json_keys.add(key)
    
    # 检查数据库中存在但JSON文件中不存在的记录
    extra_records = []
    extra_keys = set()
    
    for program in db_programs:
        key = f"{program['en_name']}_{program['school_id']}"
        if key not in json_keys and key not in extra_keys:
            extra_records.append(program)
            extra_keys.add(key)
    
    print(f"发现 {len(extra_records)} 条额外记录:")
    for i, record in enumerate(extra_records, 1):
        print(f"{i}. ID: {record['id']}, 英文名: {record['en_name']}, 中文名: {record.get('cn_name', '')}, 学校ID: {record['school_id']}")
    
    # 自动删除这些额外记录
    if extra_records:
        ids_to_delete = [record['id'] for record in extra_records]
        print(f"\n开始删除这 {len(ids_to_delete)} 条额外记录...")
        
        deleted = delete_records(ids_to_delete)
        print(f"已删除 {deleted} 条额外记录")
        
        # 检查删除后的记录数
        db_programs_after = get_all_programs()
        print(f"删除后数据库中有 {len(db_programs_after)} 条记录")

if __name__ == "__main__":
    main() 
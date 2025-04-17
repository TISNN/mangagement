import os
import json
import time
import requests
import dotenv

# 加载.env文件中的环境变量
dotenv.load_dotenv()

# 从环境变量中获取Supabase配置
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "https://swyajeiqqewyckzbfkid.supabase.co")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs")

print(f"使用Supabase URL: {SUPABASE_URL}")
print(f"API密钥已加载")

# 查询当前记录总数
def get_current_count():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "count=exact"
    }
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/programs?select=id",
            headers=headers
        )
        
        # 从响应头中获取记录总数
        if response.status_code == 200 and 'content-range' in response.headers:
            content_range = response.headers['content-range']
            if content_range:
                count = content_range.split('/')[1]
                return int(count)
        
        # 如果上面的方法失败，手动计数
        if response.status_code == 200:
            return len(response.json())
            
        return 0
    except Exception as e:
        print(f"查询记录数出错: {e}")
        return 0

# 获取所有记录
def get_all_programs():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/programs?select=id,en_name,school_id,created_at",
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

# 查找重复项
def find_duplicates(programs):
    # 使用字典检测重复
    duplicates = {}
    
    for program in programs:
        key = f"{program['en_name']}_{program['school_id']}"
        if key in duplicates:
            duplicates[key].append(program)
        else:
            duplicates[key] = [program]
    
    # 只保留有重复的项
    duplicates = {k: v for k, v in duplicates.items() if len(v) > 1}
    
    print(f"找到 {len(duplicates)} 组重复数据")
    return duplicates

# 获取要删除的重复记录ID
def get_duplicate_ids(duplicates):
    ids_to_delete = []
    
    for key, records in duplicates.items():
        # 按创建时间排序，保留最新的记录
        sorted_records = sorted(records, key=lambda x: x.get('created_at', ''), reverse=True)
        
        # 第一个是最新的，保留，其余的删除
        for record in sorted_records[1:]:
            ids_to_delete.append(record['id'])
    
    print(f"需要删除 {len(ids_to_delete)} 条重复记录")
    return ids_to_delete

# 删除重复记录
def delete_duplicates(ids_to_delete):
    if not ids_to_delete:
        print("没有重复记录需要删除")
        return 0
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    deleted_count = 0
    batch_size = 5  # 每次删除的数量
    
    for i in range(0, len(ids_to_delete), batch_size):
        batch = ids_to_delete[i:i+batch_size]
        
        for id_to_delete in batch:
            try:
                # 逐条删除记录
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
            
            # 每条记录之间稍微暂停
            time.sleep(0.2)
        
        # 每批次之间稍微暂停
        print(f"已完成第 {i//batch_size + 1} 批删除")
        time.sleep(1)
    
    return deleted_count

def main():
    # 显示当前记录数
    initial_count = get_current_count()
    print(f"清理前数据库中有 {initial_count} 条记录")
    
    if initial_count == 0:
        print("数据库中没有记录，无需清理")
        return
    
    # 获取所有记录
    programs = get_all_programs()
    
    if not programs:
        print("获取记录失败，无法进行清理")
        return
    
    print(f"成功获取 {len(programs)} 条记录")
    
    # 查找重复项
    duplicates = find_duplicates(programs)
    
    if not duplicates:
        print("没有发现重复记录，无需清理")
        return
    
    # 获取要删除的重复记录ID
    ids_to_delete = get_duplicate_ids(duplicates)
    
    if not ids_to_delete:
        print("没有找到需要删除的记录")
        return
    
    # 删除重复记录
    deleted = delete_duplicates(ids_to_delete)
    print(f"已删除 {deleted} 条重复记录")
    
    # 显示最终记录数
    final_count = get_current_count()
    print(f"清理后数据库中有 {final_count} 条记录")
    print(f"减少了 {initial_count - final_count} 条记录")

if __name__ == "__main__":
    main() 
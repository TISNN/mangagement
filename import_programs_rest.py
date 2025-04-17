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

# 读取JSON文件
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 查询当前已有记录数
def get_current_count():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "count=exact"
    }
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/programs?select=count",
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            if result and len(result) > 0:
                return result[0]['count']
            
        return 0
    except Exception as e:
        print(f"查询记录数出错: {e}")
        return 0

# 预处理JSON数据，移除tuition_fee_text字段，确保与数据库表结构匹配
def preprocess_program(program):
    # 复制一份，避免修改原始数据
    new_program = program.copy()
    
    # 格式化字段
    for key in new_program:
        # 确保字符串字段不为None
        if isinstance(new_program[key], str):
            new_program[key] = new_program[key].strip()
            if new_program[key] == "nan" or new_program[key] == "":
                new_program[key] = None
    
    return new_program

# 批量导入记录到Supabase
def import_programs(programs, batch_size=10):
    total = len(programs)
    imported = 0
    failed = 0
    
    print(f"开始导入 {total} 条记录...")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    # 分批处理
    for i in range(0, total, batch_size):
        batch = programs[i:i+batch_size]
        processed_batch = [preprocess_program(program) for program in batch]
        
        try:
            # 发送POST请求插入批次数据
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/programs",
                headers=headers,
                json=processed_batch
            )
            
            # 检查响应
            if response.status_code in (200, 201):
                imported += len(processed_batch)
                print(f"成功导入批次 {i//batch_size + 1}/{(total+batch_size-1)//batch_size}: {len(processed_batch)} 条记录")
            else:
                print(f"批次 {i//batch_size + 1}/{(total+batch_size-1)//batch_size} 导入失败: 状态码 {response.status_code}")
                print(f"错误信息: {response.text[:200]}...")
                failed += len(batch)
                
                # 尝试逐个导入
                print("尝试逐条导入此批次...")
                for j, program in enumerate(processed_batch):
                    try:
                        single_response = requests.post(
                            f"{SUPABASE_URL}/rest/v1/programs",
                            headers=headers,
                            json=[program]
                        )
                        
                        if single_response.status_code in (200, 201):
                            imported += 1
                            failed -= 1
                            print(f"  记录 {j+1} 导入成功")
                        else:
                            print(f"  记录 {j+1} 导入失败: 状态码 {single_response.status_code}")
                            print(f"  错误信息: {single_response.text[:100]}...")
                    except Exception as e:
                        print(f"  记录 {j+1} 处理出错: {e}")
        except Exception as e:
            print(f"批次 {i//batch_size + 1}/{(total+batch_size-1)//batch_size} 处理出错: {e}")
            failed += len(batch)
        
        # 稍作暂停，避免API限制
        time.sleep(1)
    
    print(f"导入完成: 成功 {imported}, 失败 {failed}, 总计 {total}")
    return imported, failed

def main():
    # 显示当前记录数
    initial_count = get_current_count()
    print(f"导入前数据库中已有 {initial_count} 条记录")
    
    # 读取JSON文件
    file_path = "singapore_programs_processed.json"
    
    if not os.path.exists(file_path):
        print(f"错误: 找不到文件 {file_path}")
        print("请确认文件路径是否正确，或者当前工作目录是否是项目根目录")
        return
        
    programs = read_json_file(file_path)
    
    if not programs:
        print(f"未找到有效的记录数据，文件: {file_path}")
        return
    
    print(f"从JSON文件中读取了 {len(programs)} 条记录")
    
    # 如果已导入一些记录，则跳过这些记录
    if initial_count > 0:
        if initial_count >= len(programs):
            print(f"数据库中已有 {initial_count} 条记录，所有 {len(programs)} 条记录已导入完成")
            return
            
        print(f"跳过已导入的 {initial_count} 条记录")
        programs = programs[initial_count:]
    
    if not programs:
        print("所有记录已导入，无需再导入")
        return
    
    print(f"准备导入 {len(programs)} 条新记录")
    
    # 导入记录
    imported, failed = import_programs(programs)
    
    # 显示最终记录数
    final_count = get_current_count()
    print(f"导入后数据库中共有 {final_count} 条记录")
    print(f"新增记录数: {final_count - initial_count}")

if __name__ == "__main__":
    main() 
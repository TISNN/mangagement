import os
import re
import time
import json
from supabase import create_client

# Supabase配置
SUPABASE_URL = "https://swyajeiqqewyckzbfkid.supabase.co"
# 注意：在实际使用中，不要将API密钥硬编码在代码中，应该使用环境变量
SUPABASE_KEY = "你的Supabase服务密钥"  # 需要替换为实际的服务密钥

# 初始化Supabase客户端
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 读取SQL文件
def read_sql_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

# 从SQL文件中提取INSERT语句
def extract_inserts(sql_content):
    # 使用正则表达式查找所有INSERT语句
    insert_pattern = r"INSERT INTO public\.programs\s*\([^)]+\)\s*VALUES\s*\(([^;]+)\);"
    value_matches = re.findall(insert_pattern, sql_content, re.DOTALL)
    
    inserts = []
    for value_str in value_matches:
        # 解析VALUES部分
        values = []
        current_value = ""
        in_quotes = False
        quote_char = None
        
        for char in value_str:
            if char in ["'", '"'] and (not in_quotes or quote_char == char):
                in_quotes = not in_quotes
                if in_quotes:
                    quote_char = char
                else:
                    quote_char = None
                current_value += char
            elif char == ',' and not in_quotes:
                values.append(current_value.strip())
                current_value = ""
            else:
                current_value += char
        
        # 添加最后一个值
        if current_value.strip():
            values.append(current_value.strip())
        
        # 提取字段值
        if len(values) >= 18:  # 确保有足够的字段
            try:
                # 解析字段值
                school_id = values[0].strip("'")
                en_name = values[1].strip("'")
                cn_name = values[2].strip("'")
                duration = values[3].strip("'")
                
                # 处理tuition_fee (可能是数字或NULL)
                tuition_fee_str = values[4].strip()
                if tuition_fee_str.upper() == 'NULL':
                    tuition_fee = None
                else:
                    tuition_fee = float(tuition_fee_str)
                
                apply_requirements = values[5].strip("'")
                # created_at和updated_at使用NOW()，会在插入时自动生成
                language_requirements = values[8].strip("'")
                curriculum = values[9].strip("'")
                tags = values[10].strip("'")
                objectives = values[11].strip("'")
                faculty = values[12].strip("'")
                category = values[13].strip("'")
                entry_month = values[14].strip("'")
                interview = values[15].strip("'")
                analysis = values[16].strip("'")
                url = values[17].strip("'")
                
                # 创建记录对象
                program = {
                    "school_id": school_id,
                    "en_name": en_name,
                    "cn_name": cn_name,
                    "duration": duration,
                    "tuition_fee": tuition_fee,
                    "apply_requirements": apply_requirements,
                    "language_requirements": language_requirements,
                    "curriculum": curriculum,
                    "tags": tags,
                    "objectives": objectives,
                    "faculty": faculty,
                    "category": category,
                    "entry_month": entry_month,
                    "interview": interview,
                    "analysis": analysis,
                    "url": url
                }
                inserts.append(program)
            except Exception as e:
                print(f"解析记录时出错: {e}")
                print(f"问题值: {values}")
    
    return inserts

# 批量导入记录到Supabase
def import_programs(programs, batch_size=10):
    total = len(programs)
    imported = 0
    failed = 0
    
    print(f"开始导入 {total} 条记录...")
    
    # 分批处理
    for i in range(0, total, batch_size):
        batch = programs[i:i+batch_size]
        try:
            # 插入批次数据
            response = supabase.table('programs').insert(batch).execute()
            
            # 检查响应
            if hasattr(response, 'data') and response.data:
                success_count = len(response.data)
                imported += success_count
                print(f"成功导入批次 {i//batch_size + 1}: {success_count} 条记录")
            else:
                print(f"批次 {i//batch_size + 1} 导入失败: {response}")
                failed += len(batch)
        except Exception as e:
            print(f"批次 {i//batch_size + 1} 导入出错: {e}")
            failed += len(batch)
        
        # 稍作暂停，避免API限制
        time.sleep(1)
    
    print(f"导入完成: 成功 {imported}, 失败 {failed}, 总计 {total}")
    return imported, failed

# 查询当前已有记录数
def get_current_count():
    try:
        response = supabase.table('programs').select('count', count='exact').execute()
        if hasattr(response, 'count'):
            return response.count
        return 0
    except Exception as e:
        print(f"查询记录数出错: {e}")
        return 0

def main():
    # 显示当前记录数
    initial_count = get_current_count()
    print(f"导入前数据库中已有 {initial_count} 条记录")
    
    # 读取SQL文件
    sql_content = read_sql_file("all_batches.sql")
    
    # 提取INSERT语句
    programs = extract_inserts(sql_content)
    
    if not programs:
        print("未找到有效的INSERT语句")
        return
    
    print(f"从SQL文件中提取了 {len(programs)} 条记录")
    
    # 导入记录
    imported, failed = import_programs(programs)
    
    # 显示最终记录数
    final_count = get_current_count()
    print(f"导入后数据库中共有 {final_count} 条记录")
    print(f"新增记录数: {final_count - initial_count}")

if __name__ == "__main__":
    main() 
import os
import time
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

# 将SQL文件分割成单个INSERT语句
def split_sql_statements(sql_content):
    # 按分号分割SQL语句
    statements = []
    current_statement = ""
    in_quotes = False
    quote_char = None
    
    for char in sql_content:
        if char in ["'", '"'] and (not in_quotes or quote_char == char):
            in_quotes = not in_quotes
            if in_quotes:
                quote_char = char
            else:
                quote_char = None
        
        current_statement += char
        
        if char == ';' and not in_quotes:
            # 剔除SQL注释行和空行
            if "INSERT INTO" in current_statement and "public.programs" in current_statement:
                statements.append(current_statement.strip())
            current_statement = ""
    
    return statements

# 查询当前已有记录数
def get_current_count():
    try:
        result = supabase.rpc('select_count_from_programs').execute()
        if hasattr(result, 'data') and result.data:
            return result.data
        return 0
    except Exception as e:
        print(f"查询记录数出错: {e}")
        # 回退方法：直接执行SQL查询
        try:
            result = supabase.sql("SELECT COUNT(*) FROM public.programs").execute()
            if hasattr(result, 'data') and result.data:
                return result.data[0]['count']
            return 0
        except Exception as e2:
            print(f"回退查询记录数也出错: {e2}")
            return 0

# 执行单个SQL语句
def execute_sql(sql_statement):
    try:
        result = supabase.sql(sql_statement).execute()
        return True, result
    except Exception as e:
        print(f"执行SQL语句出错: {e}")
        print(f"问题SQL: {sql_statement[:100]}...")
        return False, str(e)

# 批量执行SQL语句
def execute_sql_batch(statements, batch_size=10):
    total = len(statements)
    success = 0
    failed = 0
    
    print(f"开始执行 {total} 条SQL语句...")
    
    # 分批处理
    for i in range(0, total, batch_size):
        batch = statements[i:i+batch_size]
        
        # 将多个语句合并成一个事务
        transaction = "BEGIN;\n"
        for stmt in batch:
            transaction += stmt + "\n"
        transaction += "COMMIT;"
        
        try:
            success_flag, result = execute_sql(transaction)
            if success_flag:
                success += len(batch)
                print(f"成功执行批次 {i//batch_size + 1}: {len(batch)} 条语句")
            else:
                failed += len(batch)
                print(f"批次 {i//batch_size + 1} 执行失败: {result}")
                
                # 如果整个批次失败，尝试一条一条执行
                print("尝试逐条执行此批次...")
                for j, stmt in enumerate(batch):
                    success_flag, result = execute_sql(stmt)
                    if success_flag:
                        success += 1
                        failed -= 1
                        print(f"  语句 {j+1} 执行成功")
                    else:
                        print(f"  语句 {j+1} 执行失败: {result}")
        except Exception as e:
            print(f"批次 {i//batch_size + 1} 处理出错: {e}")
            failed += len(batch)
        
        # 稍作暂停，避免API限制
        time.sleep(1)
    
    print(f"执行完成: 成功 {success}, 失败 {failed}, 总计 {total}")
    return success, failed

def main():
    # 显示当前记录数
    initial_count = get_current_count()
    print(f"导入前数据库中已有 {initial_count} 条记录")
    
    # 读取SQL文件
    sql_content = read_sql_file("all_batches.sql")
    
    # 分割SQL语句
    statements = split_sql_statements(sql_content)
    
    if not statements:
        print("未找到有效的SQL语句")
        return
    
    print(f"从SQL文件中提取了 {len(statements)} 条语句")
    
    # 执行SQL语句
    success, failed = execute_sql_batch(statements)
    
    # 显示最终记录数
    final_count = get_current_count()
    print(f"导入后数据库中共有 {final_count} 条记录")
    print(f"新增记录数: {final_count - initial_count}")

if __name__ == "__main__":
    main() 
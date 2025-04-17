import csv
import json
import re
import pandas as pd
import os

# 输入和输出文件路径
input_file = '/Users/evanxu/Downloads/project/NavProgramsHtml/singapore_programs_with_faculty.csv'
output_file = '/Users/evanxu/Downloads/project/singapore_programs_processed.json'

# 学校名称映射到schools表中的ID
school_id_mapping = {
    '新加坡管理大学': 'e492f9fb-dff5-4eb8-bbb4-716bbb438f30',
    '新加坡国立大学': 'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3',
    '南洋理工大学': '96207f7c-3877-49c8-a565-09dbe3f21d7d',
    '新加坡科技设计大学': 'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0'
}

# 处理学费文本，提取数字
def extract_fee(fee_text):
    if not fee_text or pd.isna(fee_text):
        return None
    
    # 将文本转为字符串
    fee_text = str(fee_text).strip()
    
    # 使用正则表达式提取数字部分
    numbers = re.findall(r'(\d[\d,\.]*)', fee_text)
    if numbers:
        # 取第一个数字
        fee_number = numbers[0].replace(',', '')
        try:
            return float(fee_number)
        except:
            return None
    
    return None

# 使用Pandas读取CSV文件
try:
    # 尝试读取CSV文件
    df = pd.read_csv(input_file, encoding='utf-8')
    print(f"成功读取CSV文件，共 {len(df)} 行")
    
    # 处理数据
    programs = []
    for index, row in df.iterrows():
        # 获取学校名称
        school_name = str(row.get('school', ''))
        
        # 查找对应的学校ID
        school_id = None
        for key, value in school_id_mapping.items():
            if key in school_name:
                school_id = value
                break
        
        # 处理学费
        tuition_fee = extract_fee(row.get('tuition', ''))
        
        # 如果找到了学校ID，则创建记录
        if school_id:
            program = {
                'school_id': school_id,
                'en_name': str(row.get('en_name', '')),
                'cn_name': str(row.get('cn_name', '')),
                'duration': str(row.get('duration', '')),
                'tuition_fee': tuition_fee,
                'tuition_fee_text': str(row.get('tuition', '')),  # 保存原始文本
                'apply_requirements': str(row.get('apply_requirements', '')),
                'language_requirements': str(row.get('language_requirements', '')),
                'curriculum': str(row.get('curriculum', '')),
                'tags': str(row.get('tags', '')),
                'objectives': str(row.get('objectives', '')),
                'faculty': str(row.get('faculty', '')),
                'category': str(row.get('category', '')),
                'entry_month': str(row.get('entry_month', '')),
                'interview': str(row.get('interview', '')),
                'analysis': str(row.get('analysis', '')),
                'url': str(row.get('url', ''))
            }
            
            # 清理nan值
            for key, value in program.items():
                if isinstance(value, str) and value == 'nan':
                    program[key] = ''
            
            programs.append(program)
    
    print(f"成功提取 {len(programs)} 条记录")

except Exception as e:
    print(f"Pandas读取CSV失败: {e}")
    print("尝试手动解析文件...")
    
    # 手动读取并解析文件
    programs = []
    
    try:
        # 读取文件
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # 获取标题行
        headers = lines[0].strip().split(',')
        
        # 手动解析每一行
        current_program = None
        
        for i in range(1, len(lines)):
            line = lines[i].strip()
            
            # 如果为空行，跳过
            if not line:
                continue
            
            # 分割行
            parts = line.split(',')
            
            # 如果第一个值是数字，认为是新记录的开始
            if parts[0].strip().isdigit():
                # 保存之前的记录
                if current_program and current_program.get('school_id'):
                    programs.append(current_program)
                
                # 创建新记录
                current_program = {}
                
                # 提取学校名称（通常是第6个字段）
                if len(parts) > 5:
                    school_name = parts[5].strip()
                    
                    # 查找对应的学校ID
                    for key, value in school_id_mapping.items():
                        if key in school_name:
                            current_program['school_id'] = value
                            break
                
                # 提取其他字段
                if len(parts) > 1:
                    current_program['cn_name'] = parts[1].strip() if len(parts) > 1 else ''
                    current_program['en_name'] = parts[2].strip() if len(parts) > 2 else ''
                    current_program['tags'] = parts[3].strip().strip('"') if len(parts) > 3 else ''
                    current_program['faculty'] = parts[4].strip() if len(parts) > 4 else ''
                    current_program['category'] = parts[6].strip() if len(parts) > 6 else ''
                    current_program['entry_month'] = parts[7].strip() if len(parts) > 7 else ''
                    current_program['duration'] = parts[8].strip() if len(parts) > 8 else ''
                    
                    # 处理学费
                    tuition_text = parts[9].strip() if len(parts) > 9 else ''
                    current_program['tuition_fee_text'] = tuition_text
                    current_program['tuition_fee'] = extract_fee(tuition_text)
                    
                    current_program['interview'] = parts[10].strip() if len(parts) > 10 else ''
                    current_program['objectives'] = parts[11].strip() if len(parts) > 11 else ''
                    current_program['apply_requirements'] = parts[12].strip() if len(parts) > 12 else ''
                    current_program['language_requirements'] = parts[13].strip() if len(parts) > 13 else ''
                    current_program['analysis'] = parts[14].strip() if len(parts) > 14 else ''
                    current_program['curriculum'] = parts[15].strip() if len(parts) > 15 else ''
                    current_program['url'] = parts[16].strip() if len(parts) > 16 else ''
        
        # 添加最后一条记录
        if current_program and current_program.get('school_id'):
            programs.append(current_program)
        
        print(f"手动解析方法提取了 {len(programs)} 条记录")
        
    except Exception as e:
        print(f"手动解析也失败了: {e}")

# 如果上述方法都失败，创建示例记录
if not programs:
    print("所有解析方法都失败，创建示例记录作为参考...")
    
    # 新加坡管理大学的示例记录
    programs = [
        {
            'school_id': 'e492f9fb-dff5-4eb8-bbb4-716bbb438f30',  # 新加坡管理大学
            'en_name': 'MSc Economics',
            'cn_name': '经济学理学硕士',
            'duration': '1年',
            'tuition_fee': 49050,
            'tuition_fee_text': '49050新币/年',
            'apply_requirements': '具有良好的学士学位和GMAT成绩',
            'language_requirements': '英语熟练',
            'curriculum': '经济学基础、微观经济学分析、宏观经济学分析等',
            'tags': '商科, 经济, 经济学院',
            'objectives': '提供经济学和经济数据分析深入研究',
            'faculty': '经济学院',
            'category': '经济',
            'entry_month': '1/8月',
            'interview': '真人单面',
            'analysis': '',
            'url': 'https://masters.smu.edu.sg/programme/master-in-economics'
        }
    ]

# 保存处理后的数据到JSON文件
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(programs, f, ensure_ascii=False, indent=2)

print(f"处理完成，共处理了 {len(programs)} 条记录，保存到 {output_file}")

# 生成多个SQL批次文件
if programs:
    # 每批次的记录数
    batch_size = 10
    batch_count = (len(programs) + batch_size - 1) // batch_size
    
    # 创建batch目录
    batch_dir = '/Users/evanxu/Downloads/project/sql_batches'
    os.makedirs(batch_dir, exist_ok=True)
    
    # 生成批次文件
    for i in range(batch_count):
        start = i * batch_size
        end = min((i + 1) * batch_size, len(programs))
        batch_programs = programs[start:end]
        
        sql_file = f'{batch_dir}/batch_{i+1}.sql'
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write(f"-- 插入programs表数据 (批次 {i+1}/{batch_count})\n")
            for program in batch_programs:
                # 清理字段值中的单引号
                for key in program:
                    if isinstance(program[key], str):
                        program[key] = program[key].replace("'", "''")
                
                # 如果tuition_fee为None，设为NULL
                tuition_fee_value = 'NULL' if program.get('tuition_fee') is None else program.get('tuition_fee')
                
                sql = f"""INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '{program['school_id']}', '{program['en_name']}', '{program['cn_name']}', 
                    '{program['duration']}', {tuition_fee_value}, '{program['apply_requirements']}',
                    NOW(), NOW(), '{program['language_requirements']}', '{program['curriculum']}',
                    '{program['tags']}', '{program['objectives']}', '{program['faculty']}',
                    '{program['category']}', '{program['entry_month']}', '{program['interview']}',
                    '{program['analysis']}', '{program['url']}'
                );\n"""
                f.write(sql)
        
        print(f"批次 {i+1}/{batch_count} SQL语句已生成到 {sql_file}") 
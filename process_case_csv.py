import pandas as pd
import re

# 读取CSV文件
input_file = 'casedata/case.csv'
output_file = 'casedata/case_processed.csv'

# 读取CSV文件
df = pd.read_csv(input_file)

# 定义提取函数
def extract_background_info(background):
    if pd.isna(background):
        return None, None, None
    
    # 尝试解析基本背景数据
    items = background.split('，')
    
    admission_year = None
    gpa = None
    language_scores = None
    
    if len(items) >= 1:
        admission_year = items[0].strip()
    
    if len(items) >= 2:
        # 提取GPA，通常是"GPA"后面的数字
        gpa_match = re.search(r'GPA\s*([0-9.]+)', items[1])
        if gpa_match:
            gpa = gpa_match.group(1)
    
    # 如果有第三个及以后的元素，全部作为language_scores
    if len(items) >= 3:
        # 将第三个及以后的所有元素合并为language_scores
        language_scores = '，'.join(items[2:]).strip()
    
    return admission_year, gpa, language_scores

# 为每一行应用提取函数
extracted_data = df['基本背景'].apply(lambda x: pd.Series(extract_background_info(x)))
extracted_data.columns = ['admission_year', 'gpa', 'language_scores']

# 将提取的数据添加到原始DataFrame
df = pd.concat([df, extracted_data], axis=1)

# 保存处理后的数据
df.to_csv(output_file, index=False, encoding='utf-8')

print(f"文件处理完成，已保存到 {output_file}") 
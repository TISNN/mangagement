#    python3 json_to_csv_converter.py --country hongkong
import os
import json
import csv
import re
import sys
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description='将JSON文件转换为CSV格式')
    parser.add_argument('--country', type=str, help='要处理的国家文件夹名称（如uk, australia, hongkong, singapore, macau, us）')
    parser.add_argument('--output', type=str, help='输出CSV文件路径')
    return parser.parse_args()

# 指定JSON文件目录和输出CSV文件路径的基本路径
base_json_dir = '/Users/evanxu/Downloads/project/src/programme'

# 定义字段名称（CSV的表头）
fieldnames = ['school_name', 'major_name', 'ename', 'tags', 'introduction', 
              'requirements', 'objectives', 'language_requirements', 
              'curriculum', 'success_cases', 'country', 'filename']

# 递归遍历目录查找所有JSON文件
def find_json_files(directory):
    json_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                json_files.append(os.path.join(root, file))
    return json_files

# 处理每个JSON文件
def process_json_files(json_files):
    all_data = []
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # 获取国家信息（从文件路径中提取）
                country_match = re.search(r'programme/([^/]+)/', json_file)
                country = country_match.group(1) if country_match else ""
                
                # 添加国家和文件名信息
                data['country'] = country
                data['filename'] = os.path.basename(json_file)
                
                # 确保所有字段都存在
                for field in fieldnames:
                    if field not in data:
                        data[field] = ""
                
                # 将数据添加到列表中
                all_data.append(data)
                print(f"处理文件: {json_file}")
        except Exception as e:
            print(f"处理文件 {json_file} 时出错: {e}")
    return all_data

# 将数据写入CSV文件
def write_to_csv(data, output_file):
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            # 对字段值进行处理，移除可能影响CSV格式的字符
            for key, value in row.items():
                if isinstance(value, str):
                    # 替换换行符为空格
                    row[key] = value.replace('\n', ' ')
            writer.writerow(row)
    print(f"已将 {len(data)} 条记录写入 {output_file}")

def main():
    args = parse_arguments()
    
    # 根据命令行参数确定处理的目录和输出文件
    if args.country:
        country_dir = os.path.join(base_json_dir, args.country)
        if not os.path.exists(country_dir):
            print(f"错误: 未找到国家文件夹 '{args.country}'")
            print(f"可用的国家文件夹有: {', '.join(os.listdir(base_json_dir))}")
            return
        json_dir = country_dir
        output_csv = args.output if args.output else f'/Users/evanxu/Downloads/project/{args.country}_programmes.csv'
    else:
        json_dir = base_json_dir
        output_csv = args.output if args.output else '/Users/evanxu/Downloads/project/programmes.csv'
    
    print(f"开始搜索JSON文件...")
    json_files = find_json_files(json_dir)
    print(f"找到 {len(json_files)} 个JSON文件")
    
    if len(json_files) == 0:
        print(f"错误: 在目录 '{json_dir}' 中未找到JSON文件")
        return
    
    print(f"开始处理JSON文件...")
    all_data = process_json_files(json_files)
    
    print(f"开始写入CSV文件...")
    write_to_csv(all_data, output_csv)
    
    print(f"转换完成！输出文件: {output_csv}")

if __name__ == '__main__':
    main() 
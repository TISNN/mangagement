import pandas as pd
import json
import os

def clean_macau_programs():
    # 设置文件路径
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_dir, 'australia_programs_new.csv')
    
    # 读取CSV文件
    print(f"正在读取 {input_file}...")
    df = pd.read_csv(input_file)
    
    # 记录原始数据行数
    original_count = len(df)
    print(f"原始数据行数: {original_count}")
    
    # 提取获取失败的URL
    failed_urls = df[df['中文名称'] == '获取失败']['项目链接'].tolist()
    
    # 如果有获取失败的URL，保存到文件
    if failed_urls:
        failed_urls_file = os.path.join(current_dir, 'failed_us_urls.txt')
        print(f"发现 {len(failed_urls)} 个获取失败的URL")
        with open(failed_urls_file, 'w', encoding='utf-8') as f:
            for url in failed_urls:
                f.write(f"{url}\n")
        print(f"已将获取失败的URL保存到 {failed_urls_file}")
    else:
        print("没有发现获取失败的URL")
    
    # 删除获取失败的记录
    df = df[df['中文名称'] != '获取失败']
   
    
    # 保存清理后的数据
    output_file = os.path.join(current_dir, 'australia_programs_cleaned.csv')
    df.to_csv(output_file, index=False, encoding='utf-8')
    
    # 打印统计信息
    final_count = len(df)
    print("\n数据清理完成:")
    print(f"原始数据行数: {original_count}")
    print(f"获取失败记录数: {len(failed_urls)}")
    print(f"清理后数据行数: {final_count}")
    print(f"已保存清理后的数据到 {output_file}")

if __name__ == "__main__":
    clean_macau_programs() 
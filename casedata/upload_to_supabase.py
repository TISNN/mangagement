#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pandas as pd
import argparse
import logging
import sys
import os
import json
from datetime import datetime
from pathlib import Path
from supabase import create_client, Client

# 设置日志记录
def setup_logging(log_name=None):
    if log_name is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_name = f"supabase_upload_{timestamp}.log"
    
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # 创建控制台处理程序
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('%(levelname)s: %(message)s')
    console_handler.setFormatter(console_format)
    
    # 创建文件处理程序
    file_handler = logging.FileHandler(log_name, encoding='utf-8')
    file_handler.setLevel(logging.INFO)
    file_format = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(file_format)
    
    # 添加处理程序到日志记录器
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger

# 获取Supabase连接
def get_supabase_client(url, key):
    try:
        supabase = create_client(url, key)
        return supabase
    except Exception as e:
        logging.error(f"连接Supabase失败: {str(e)}")
        raise

# 加载数据到Supabase
def load_data_to_supabase(csv_path, supabase_url, supabase_key, dry_run=False):
    logger = setup_logging()
    logger.info(f"开始将数据上传到Supabase")
    
    # 检查CSV文件是否存在
    csv_file = Path(csv_path)
    if not csv_file.exists():
        logger.error(f"CSV文件不存在: {csv_path}")
        raise FileNotFoundError(f"CSV文件不存在: {csv_path}")
    
    # 读取CSV文件
    try:
        logger.info(f"读取CSV文件: {csv_path}")
        df = pd.read_csv(csv_path)
        logger.info(f"CSV文件读取成功，共{len(df)}行数据")
    except Exception as e:
        logger.error(f"CSV文件读取失败: {str(e)}")
        raise
    
    # 获取Supabase连接
    try:
        logger.info("连接到Supabase数据库")
        supabase = get_supabase_client(supabase_url, supabase_key)
        logger.info("Supabase连接成功")
    except Exception as e:
        logger.error(f"Supabase连接失败: {str(e)}")
        raise
    
    # 获取学校数据
    try:
        logger.info("从Supabase获取学校数据")
        schools_response = supabase.table("schools").select("id, cn_name").execute()
        schools_data = schools_response.data
        
        # 创建学校名称到ID的映射
        schools_map = {school['cn_name']: school['id'] for school in schools_data}
        logger.info(f"获取到{len(schools_map)}所学校信息")
    except Exception as e:
        logger.error(f"获取学校数据失败: {str(e)}")
        raise
    
    # 获取项目数据
    try:
        logger.info("从Supabase获取项目数据")
        programs_response = supabase.table("programs").select("id, school_id, cn_name, en_name").execute()
        programs_data = programs_response.data
        
        # 创建(学校ID, 项目名称)到项目ID的映射
        cn_programs_map = {(program['school_id'], program['cn_name']): program['id'] for program in programs_data if program['cn_name']}
        en_programs_map = {(program['school_id'], program['en_name']): program['id'] for program in programs_data if program['en_name']}
        logger.info(f"获取到{len(programs_data)}个项目信息")
    except Exception as e:
        logger.error(f"获取项目数据失败: {str(e)}")
        raise
    
    # 处理数据并上传
    successful_insertions = 0
    failed_insertions = 0
    
    if dry_run:
        logger.info("运行在试运行模式，不会实际写入数据库")
    
    for index, row in df.iterrows():
        try:
            # 查找学校ID
            school_name = row.get('school')
            school_id = None
            
            if school_name and school_name in schools_map:
                school_id = schools_map[school_name]
                logger.info(f"找到学校 '{school_name}' 的ID: {school_id}")
            else:
                logger.warning(f"学校 '{school_name}' 在数据库中未找到")
            
            # 查找项目ID
            program_name = row.get('applied_program')
            program_id = None
            
            if school_id and program_name:
                # 尝试中文名匹配
                if (school_id, program_name) in cn_programs_map:
                    program_id = cn_programs_map[(school_id, program_name)]
                    logger.info(f"找到项目 '{program_name}' 的ID: {program_id}")
                # 尝试英文名匹配
                elif (school_id, program_name) in en_programs_map:
                    program_id = en_programs_map[(school_id, program_name)]
                    logger.info(f"找到项目 '{program_name}' 的ID: {program_id}")
                else:
                    # 尝试模糊匹配
                    for (sid, pname), pid in cn_programs_map.items():
                        if sid == school_id and (pname in program_name or program_name in pname):
                            program_id = pid
                            logger.info(f"模糊匹配到项目 '{program_name}' → '{pname}' 的ID: {program_id}")
                            break
                    
                    if not program_id:
                        for (sid, pname), pid in en_programs_map.items():
                            if sid == school_id and (pname in program_name or program_name in pname):
                                program_id = pid
                                logger.info(f"模糊匹配到项目 '{program_name}' → '{pname}' 的ID: {program_id}")
                                break
                
                if not program_id:
                    logger.warning(f"项目 '{program_name}' 在学校ID {school_id} 下未找到")
            
            # 准备插入数据
            success_case_data = {
                "school_id": school_id,
                "program_id": program_id,
                "student_name": row.get('student_name'),
                "cn_name": row.get('cn_name'),
                "bachelor_university": row.get('bachelor_university'),
                "bachelor_major": row.get('bachelor_major'),
                "admission_year": row.get('admission_year'),
                "gpa": row.get('gpa'),
                "language_scores": row.get('language_scores'),
                "experience": row.get('experience')
            }
            
            # 过滤掉None值
            success_case_data = {k: v for k, v in success_case_data.items() if v is not None}
            
            if not dry_run:
                try:
                    # 插入数据到success_cases表
                    insert_response = supabase.table("success_cases").insert(success_case_data).execute()
                    if insert_response.data:
                        successful_insertions += 1
                        logger.info(f"成功插入记录 {index+1}/{len(df)}")
                    else:
                        failed_insertions += 1
                        logger.warning(f"插入记录 {index+1}/{len(df)} 失败: {insert_response.error}")
                except Exception as e:
                    failed_insertions += 1
                    logger.error(f"插入记录 {index+1}/{len(df)} 时发生错误: {str(e)}")
            else:
                # 在试运行模式下，只打印将要插入的数据
                logger.info(f"将要插入的数据 {index+1}/{len(df)}: {json.dumps(success_case_data, ensure_ascii=False)}")
                successful_insertions += 1
        
        except Exception as e:
            failed_insertions += 1
            logger.error(f"处理记录 {index+1}/{len(df)} 时发生错误: {str(e)}")
    
    # 打印统计信息
    logger.info("数据导入完成")
    logger.info(f"成功: {successful_insertions}, 失败: {failed_insertions}, 总计: {len(df)}")
    
    if failed_insertions > 0:
        logger.warning("部分数据导入失败，请查看日志获取详细信息")
    
    return successful_insertions, failed_insertions

def main():
    parser = argparse.ArgumentParser(description='将CSV数据上传到Supabase数据库')
    parser.add_argument('--csv', required=True, help='CSV文件路径')
    parser.add_argument('--url', required=True, help='Supabase项目URL')
    parser.add_argument('--key', required=True, help='Supabase API密钥')
    parser.add_argument('--dry-run', action='store_true', help='试运行模式，不会实际写入数据库')
    
    args = parser.parse_args()
    
    try:
        successful, failed = load_data_to_supabase(
            args.csv,
            args.url,
            args.key,
            args.dry_run
        )
        print(f"数据导入完成。成功: {successful}, 失败: {failed}")
        sys.exit(0 if failed == 0 else 1)
    except Exception as e:
        print(f"错误: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
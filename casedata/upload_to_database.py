import pandas as pd
import os
import logging
from pathlib import Path
import argparse
import sys
from datetime import datetime

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"db_upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def get_db_connection(db_type, db_config):
    """根据数据库类型建立连接"""
    try:
        if db_type.lower() == 'sqlite':
            import sqlite3
            conn = sqlite3.connect(db_config['db_path'])
            return conn, conn.cursor()
        
        elif db_type.lower() == 'mysql':
            import mysql.connector
            conn = mysql.connector.connect(
                host=db_config.get('host', 'localhost'),
                user=db_config.get('user', 'root'),
                password=db_config.get('password', ''),
                database=db_config.get('database', '')
            )
            return conn, conn.cursor()
        
        elif db_type.lower() == 'postgresql':
            import psycopg2
            conn = psycopg2.connect(
                host=db_config.get('host', 'localhost'),
                user=db_config.get('user', 'postgres'),
                password=db_config.get('password', ''),
                dbname=db_config.get('database', ''),
                port=db_config.get('port', 5432)
            )
            return conn, conn.cursor()
        
        else:
            raise ValueError(f"不支持的数据库类型: {db_type}")
    
    except Exception as e:
        logger.error(f"数据库连接失败: {e}")
        raise

def load_data_to_database(csv_file, db_type='sqlite', db_config=None, dry_run=False):
    """将CSV数据加载到数据库"""
    if db_config is None:
        db_config = {}
    
    # 确保CSV文件存在
    if not Path(csv_file).exists():
        logger.error(f"CSV文件不存在: {csv_file}")
        return False
    
    try:
        # 读取CSV文件
        logger.info(f"读取CSV文件: {csv_file}")
        df = pd.read_csv(csv_file)
        logger.info(f"CSV文件读取成功，共 {len(df)} 行数据")
        
        if dry_run:
            logger.info("试运行模式，不会实际写入数据库")
            return True
        
        # 连接到数据库
        conn, cursor = get_db_connection(db_type, db_config)
        logger.info(f"成功连接到 {db_type} 数据库")
        
        try:
            # 获取schools表中的学校信息
            cursor.execute("SELECT id, cn_name FROM schools")
            schools = cursor.fetchall()
            school_mapping = {school[1]: school[0] for school in schools}  # 学校中文名到id的映射
            logger.info(f"获取到 {len(school_mapping)} 个学校记录")
            
            # 获取programs表中的项目信息
            cursor.execute("SELECT id, school_id, cn_name, en_name FROM programs")
            programs = cursor.fetchall()
            logger.info(f"获取到 {len(programs)} 个项目记录")
            
            # 创建映射字典: (学校id, 项目中文名) -> program_id 和 (学校id, 项目英文名) -> program_id
            program_mapping = {}
            for prog_id, school_id, prog_cn_name, prog_en_name in programs:
                if prog_cn_name:
                    program_mapping[(school_id, prog_cn_name)] = prog_id
                if prog_en_name:
                    program_mapping[(school_id, prog_en_name)] = prog_id
            
            # 处理每一行数据并插入数据库
            success_count = 0
            error_count = 0
            not_found_schools = set()
            not_found_programs = set()
            
            for index, row in df.iterrows():
                try:
                    # 查找学校id
                    applied_school = row.get('cn_name')  # 在CSV中的学校字段名
                    applied_program = row.get('applied_program')  # 在CSV中的项目字段名
                    
                    # 直接在映射中查找学校
                    school_id = school_mapping.get(applied_school)
                    
                    # 如果直接查找失败，尝试模糊匹配
                    if school_id is None and applied_school:
                        for school_name, s_id in school_mapping.items():
                            if school_name and (applied_school in school_name or school_name in applied_school):
                                school_id = s_id
                                break
                    
                    # 如果仍未找到学校，记录下来
                    if school_id is None and applied_school:
                        not_found_schools.add(applied_school)
                    
                    # 如果找到了学校id，查找项目id
                    program_id = None
                    if school_id is not None and applied_program:
                        program_id = program_mapping.get((school_id, applied_program))
                        
                        # 如果直接查找失败，尝试模糊匹配
                        if program_id is None:
                            for (s_id, prog_name), p_id in program_mapping.items():
                                if s_id == school_id and prog_name and applied_program and (
                                        applied_program in prog_name or prog_name in applied_program):
                                    program_id = p_id
                                    break
                        
                        # 如果仍未找到项目，记录下来
                        if program_id is None:
                            not_found_programs.add((applied_school, applied_program))
                    
                    # 准备插入数据
                    student_name = row.get('student_name', '')
                    admission_year = row.get('admission_year', '')
                    gpa = row.get('gpa', '')
                    language_scores = row.get('language_scores', '')
                    experience = row.get('experience', '')
                    created_at = row.get('created_at', '')
                    updated_at = row.get('updated_at', '')
                    bachelor_university = row.get('bachelor_university', '')
                    bachelor_major = row.get('bachelor_major', '')
                    
                    # 插入数据到success_cases表
                    cursor.execute('''
                        INSERT INTO success_cases 
                        (student_name, program_id, admission_year, gpa, language_scores, experience, 
                         created_at, updated_at, bachelor_university, bachelor_major)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        student_name, program_id, admission_year, gpa, language_scores, experience,
                        created_at, updated_at, bachelor_university, bachelor_major
                    ))
                    
                    success_count += 1
                    
                    if success_count % 100 == 0:
                        logger.info(f"已成功处理 {success_count} 行数据")
                    
                except Exception as e:
                    logger.error(f"处理第 {index+1} 行时出错: {e}")
                    error_count += 1
            
            # 提交事务
            conn.commit()
            
            # 记录未找到的学校和项目
            if not_found_schools:
                logger.warning(f"未找到以下学校: {', '.join(not_found_schools)}")
            
            if not_found_programs:
                logger.warning(f"未找到以下学校项目组合: {not_found_programs}")
            
            logger.info(f"数据上传完成。成功: {success_count}, 失败: {error_count}")
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"处理数据时出错: {e}")
            return False
            
        finally:
            cursor.close()
            conn.close()
            logger.info("数据库连接已关闭")
    
    except Exception as e:
        logger.error(f"处理CSV数据时出错: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='将CSV数据上传到数据库')
    parser.add_argument('--csv', required=True, help='CSV文件路径')
    parser.add_argument('--db-type', default='sqlite', choices=['sqlite', 'mysql', 'postgresql'], help='数据库类型')
    parser.add_argument('--db-path', help='SQLite数据库文件路径')
    parser.add_argument('--host', default='localhost', help='数据库主机地址')
    parser.add_argument('--port', type=int, help='数据库端口')
    parser.add_argument('--user', help='数据库用户名')
    parser.add_argument('--password', help='数据库密码')
    parser.add_argument('--database', help='数据库名称')
    parser.add_argument('--dry-run', action='store_true', help='试运行模式，不会实际写入数据库')
    
    args = parser.parse_args()
    
    db_config = {}
    if args.db_type == 'sqlite':
        if not args.db_path:
            parser.error("使用SQLite时必须指定 --db-path")
        db_config['db_path'] = args.db_path
    else:
        db_config = {
            'host': args.host,
            'port': args.port,
            'user': args.user,
            'password': args.password,
            'database': args.database
        }
    
    success = load_data_to_database(args.csv, args.db_type, db_config, args.dry_run)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 
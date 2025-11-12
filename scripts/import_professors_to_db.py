#!/usr/bin/env python3
"""
将爬取的教授数据导入到Supabase数据库
"""

import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# Supabase配置
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL', 'https://swyajeiqqewyckzbfkid.supabase.co')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY', '')


class ProfessorImporter:
    def __init__(self):
        """初始化导入器"""
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.nus_school_id = None
        self.imported_count = 0
        self.skipped_count = 0
        self.error_count = 0
        self.profile_url_field = self.detect_profile_url_field()
    
    def detect_profile_url_field(self) -> str:
        """检测数据库中用于存储详情链接的字段"""
        try:
            self.supabase.table('professors').select('profile_url').limit(1).execute()
            print("✓ 检测到 professors.profile_url 字段，将写入该列")
            return 'profile_url'
        except Exception:
            print("⚠ 未检测到 professors.profile_url 字段，回退使用 avatar_url")
            return 'avatar_url'
    
    def get_nus_school_id(self):
        """获取NUS的school_id"""
        try:
            response = self.supabase.table('schools') \
                .select('id') \
                .eq('en_name', 'National University of Singapore') \
                .single() \
                .execute()
            
            if response.data:
                self.nus_school_id = response.data['id']
                print(f"✓ 找到NUS学校ID: {self.nus_school_id}")
                return True
            else:
                print("✗ 未找到NUS学校记录，请先在schools表中添加")
                return False
                
        except Exception as e:
            print(f"✗ 获取NUS学校ID失败: {e}")
            return False
    
    def check_if_exists(self, name, email):
        """检查教授是否已存在，返回已有记录的ID或None"""
        try:
            if email:
                by_email = self.supabase.table('professors').select('id').eq('contact_email', email).execute()
                if by_email.data:
                    return by_email.data[0]['id']
            by_name = self.supabase.table('professors').select('id').eq('name', name).execute()
            if by_name.data:
                return by_name.data[0]['id']
            return None
        except Exception as e:
            print(f"检查教授是否存在时出错: {e}")
            return None
    
    def import_professor(self, prof_data):
        """导入单个教授"""
        try:
            name = prof_data.get('name', '')
            email = prof_data.get('email', '')
            
            if not name:
                print(f"  ✗ 跳过: 缺少姓名")
                self.skipped_count += 1
                return False
            
            # 检查是否已存在
            existing_id = self.check_if_exists(name, email)
            
            # 准备数据
            # 研究方向标签
            research_tags = prof_data.get('research_areas', [])
            if not research_tags and prof_data.get('research_interests'):
                research_tags = prof_data['research_interests']

            # 研究项目 -> signature_projects & funding_options
            research_projects = prof_data.get('research_projects', [])
            signature_projects = []
            research_projects_detail = []
            for project in research_projects:
                title = project.get('title')
                tags = project.get('tags', [])
                if title:
                    if tags:
                        signature_projects.append(f"{title} ({', '.join(tags)})")
                    else:
                        signature_projects.append(title)
                    research_projects_detail.append({
                        'title': title,
                        'description': project.get('description'),
                        'tags': tags
                    })

            # 代表性论文
            publications = []
            for pub in prof_data.get('publications', []):
                title = pub.get('title')
                year = pub.get('year')
                citation = pub.get('full_citation')
                if title:
                    publications.append({
                        'title': title,
                        'year': year,
                        'citation': citation,
                    })

            # 博士校友 -> recent_placements
            recent_placements = []
            for alumni in prof_data.get('phd_alumni', []):
                year = alumni.get('graduation_year')
                student = alumni.get('name')
                destination = alumni.get('first_placement') or alumni.get('current_position') or alumni.get('institution')
                if student and destination:
                    recent_placements.append({
                        'year': year or 0,
                        'student': student,
                        'destination': destination,
                        'highlight': alumni.get('institution'),
                    })
            recent_placements = recent_placements or []

            # 教授记录
            professor_record = {
                'name': name,
                'primary_title': prof_data.get('appointment'),
                'additional_titles': prof_data.get('additional_titles') or [],
                'biography': prof_data.get('profile'),
                'education': prof_data.get('education') or [],
                'research_interests': prof_data.get('research_interests') or [],
                'research_projects': research_projects_detail or [],
                'awards': prof_data.get('awards') or [],
                'courses': prof_data.get('courses') or [],
                'university': 'National University of Singapore',
                'school_id': self.nus_school_id,
                'college': 'School of Computing - Department of Information Systems and Analytics',
                'country': '新加坡',
                'city': '新加坡',
                'contact_email': email if email else None,
                'contact_phone': prof_data.get('phone'),
                'personal_page': prof_data.get('personal_page'),
                'avatar_url': prof_data.get('avatar_url'),
                'research_tags': research_tags,
                'signature_projects': signature_projects,
                'funding_options': [],
                'phd_supervision_status': '待确认',  # 默认状态
                'accepts_international_students': True,  # 默认接受国际学生
                'is_active': True,
                'match_score': 0,
                'intake': '2025 Fall',  # 默认入学季
                'funding_types': [],
                'publications': publications,
                'recent_placements': recent_placements,
                'phd_requirements': {
                    'languageTests': ['TOEFL', 'IELTS'],
                    'recommendationLetters': 2,
                    'researchExperience': '需要'
                },
                'application_window': {
                    'start': '2024-09-01',
                    'end': '2025-01-15',
                    'intake': '2025 Fall'
                },
                'internal_notes': f'从NUS官网导入，职位: {prof_data.get("appointment", "未知")}'
            }
            
            profile_url_value = prof_data.get('profile_url')
            if profile_url_value:
                if self.profile_url_field != 'avatar_url':
                    professor_record[self.profile_url_field] = profile_url_value
            
            if existing_id:
                response = self.supabase.table('professors') \
                    .update(professor_record) \
                    .eq('id', existing_id) \
                    .execute()
                if response.data:
                    print(f"  △ 已更新: {name}")
                    self.skipped_count += 1
                    return True
                else:
                    print(f"  ✗ 更新失败: {name}")
                    self.error_count += 1
                    return False
            else:
                response = self.supabase.table('professors') \
                    .insert(professor_record) \
                    .execute()
                
                if response.data:
                    print(f"  ✓ 导入成功: {name}")
                    self.imported_count += 1
                    return True
                else:
                    print(f"  ✗ 导入失败: {name}")
                    self.error_count += 1
                    return False
                
        except Exception as e:
            print(f"  ✗ 导入 {prof_data.get('name', 'Unknown')} 时出错: {e}")
            self.error_count += 1
            return False
    
    def import_from_json(self, json_file):
        """从JSON文件导入"""
        try:
            # 读取JSON文件
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            professors = data.get('professors', [])
            total = len(professors)
            
            print(f"\n准备导入 {total} 位教授...")
            print("="*60)
            
            # 逐个导入
            for i, prof in enumerate(professors, 1):
                print(f"\n[{i}/{total}] {prof.get('name', 'Unknown')}")
                self.import_professor(prof)
            
            # 打印摘要
            print("\n" + "="*60)
            print("导入完成!")
            print("="*60)
            print(f"成功导入: {self.imported_count} 位")
            print(f"已存在跳过: {self.skipped_count} 位")
            print(f"错误: {self.error_count} 位")
            print(f"总计: {total} 位")
            
        except FileNotFoundError:
            print(f"✗ 文件不存在: {json_file}")
        except json.JSONDecodeError:
            print(f"✗ JSON格式错误: {json_file}")
        except Exception as e:
            print(f"✗ 导入过程出错: {e}")


def main():
    """主函数"""
    print("="*60)
    print("NUS Professor Data Importer")
    print("="*60)
    
    # 检查Supabase配置
    if not SUPABASE_KEY:
        print("✗ 错误: 未配置SUPABASE_KEY")
        print("请在.env文件中设置 VITE_SUPABASE_ANON_KEY")
        return
    
    # JSON文件路径
    json_file = "/Users/evanxu/Downloads/mangagement-d0918fc8ddf240e444778d69a1e8e3a08a6b2dbc/scripts/nus_isa_professors.json"
    
    if not os.path.exists(json_file):
        print(f"✗ 文件不存在: {json_file}")
        print("请先运行爬虫: python3 nus_professor_scraper.py")
        return
    
    # 创建导入器
    importer = ProfessorImporter()
    
    # 获取NUS学校ID
    if not importer.get_nus_school_id():
        return
    
    # 导入数据
    importer.import_from_json(json_file)


if __name__ == "__main__":
    main()


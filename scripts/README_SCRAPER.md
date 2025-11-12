# NUS Computing Faculty Scraper 使用指南

## 功能说明

这个爬虫用于抓取NUS Computing学院Department of Information Systems and Analytics的教授信息。

### 特性
- ✅ 自动过滤Part-Time教授
- ✅ 提取完整的教授信息（姓名、职位、邮箱、电话、办公室、研究领域）
- ✅ 支持导出JSON和CSV格式
- ✅ 无头模式运行，不打开浏览器窗口

## 安装依赖

### 1. 安装Python依赖
```bash
cd scripts
pip install -r requirements_scraper.txt
```

### 2. 安装ChromeDriver

**方法一：使用webdriver-manager（推荐）**
```python
# 代码已集成，首次运行会自动下载
from webdriver_manager.chrome import ChromeDriverManager
```

**方法二：手动安装**
- macOS: `brew install --cask chromedriver`
- 或从 https://chromedriver.chromium.org/ 下载

## 使用方法

### 基本使用
```bash
python3 nus_professor_scraper.py
```

### 输出文件
运行完成后会生成两个文件：
- `nus_isa_professors.json` - JSON格式的完整数据
- `nus_isa_professors.csv` - CSV格式，可用Excel打开

## 数据字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| name | 教授姓名 | "Prof. John Doe" |
| appointment | 职位 | "Professor" |
| email | 邮箱 | "johndoe@comp.nus.edu.sg" |
| phone | 电话 | "+65 6516 xxxx" |
| office | 办公室 | "COM2-02-01" |
| research_areas | 研究领域 | ["AI", "Machine Learning"] |

## 自定义配置

### 修改目标系别
编辑 `nus_professor_scraper.py` 第18行：
```python
self.target_department = "Department of Computer Science"  # 改为其他系别
```

### 修改筛选条件
编辑 `_is_part_time` 方法添加更多过滤规则：
```python
def _is_part_time(self, professor):
    appointment = professor.get('appointment', '').lower()
    # 添加更多过滤条件
    if 'visiting' in appointment:
        return True
    return 'part-time' in appointment
```

## 故障排查

### 问题1: ChromeDriver版本不匹配
**解决方案：**
```bash
pip install --upgrade webdriver-manager
```

### 问题2: 页面加载超时
**解决方案：**
增加等待时间，修改第36行：
```python
self.wait = WebDriverWait(self.driver, 30)  # 从20秒改为30秒
```

### 问题3: 数据为空
**原因：** 页面结构可能已变化
**解决方案：**
1. 关闭无头模式查看实际页面：
```python
# 注释掉第23行
# chrome_options.add_argument('--headless')
```
2. 检查页面结构并更新选择器

### 问题4: SSL证书错误
**解决方案：**
添加忽略SSL错误的选项：
```python
chrome_options.add_argument('--ignore-certificate-errors')
```

## 进阶用法

### 1. 批量爬取多个系别
```python
departments = [
    "Department of Computer Science",
    "Department of Information Systems and Analytics"
]

for dept in departments:
    scraper = NUSProfessorScraper()
    scraper.target_department = dept
    scraper.scrape_professors()
    scraper.save_to_json(f"{dept.lower().replace(' ', '_')}.json")
    scraper.close()
```

### 2. 添加重试机制
```python
from tenacity import retry, stop_after_attempt, wait_fixed

@retry(stop=stop_after_attempt(3), wait=wait_fixed(5))
def scrape_with_retry():
    scraper.scrape_professors()
```

### 3. 添加代理
```python
chrome_options.add_argument('--proxy-server=http://proxy.example.com:8080')
```

## 注意事项

⚠️ **重要提示：**
1. 遵守网站的robots.txt规则
2. 合理控制爬取频率，避免对服务器造成压力
3. 仅用于学术研究或个人学习，不得用于商业用途
4. 数据可能有延迟，建议定期更新

## 数据导入到professors表

爬取完成后，可以使用以下SQL将数据导入到数据库：

```sql
-- 示例：插入教授数据
INSERT INTO professors (
  name, 
  university, 
  school_id,
  college,
  country,
  city,
  contact_email,
  research_tags,
  phd_supervision_status
) VALUES (
  '教授姓名',
  'National University of Singapore',
  (SELECT id FROM schools WHERE en_name = 'National University of Singapore'),
  'Department of Information Systems and Analytics',
  '新加坡',
  '新加坡',
  'email@comp.nus.edu.sg',
  ARRAY['研究领域1', '研究领域2'],
  '招生中'
);
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！


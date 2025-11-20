# 爬虫工具使用指南

本目录包含多个网页爬虫工具，用于从不同网站抓取数据。

---

## 📚 指南者留学Offer案例库爬虫 (compass_offer_scraper.py)

### 功能说明

爬取指南者留学网站的offer案例库，从一级列表页获取所有offer链接，然后访问每个详情页提取学生申请信息。

**数据来源：** https://www.compassedu.hk/offer

### 提取的数据字段

| 字段 | 说明 | 示例 |
|------|------|------|
| student_name | 学生姓名 | "L同学" |
| admission_school | 录取学校 | "香港理工大学" |
| admission_major | 录取专业 | "公司管治硕士" |
| graduation_school | 毕业学校 | "江苏第二师范学院" |
| undergraduate_major | 本科专业 | "财务管理" |
| basic_background | 基本背景 | "应届生，GPA3.26，雅思6.5、六级452.0" |
| main_experiences | 主要经历 | "1. 数据要素市场化能否促进企业数字化创新..." |

### 使用方法

**基本使用（测试模式，只爬取10条）：**
```bash
cd scripts
python3 compass_offer_scraper.py --max-offers 10 --headless
```

**完整爬取（推荐无头模式）：**
```bash
python3 compass_offer_scraper.py --headless --output-json offers.json --output-csv offers.csv
```

**参数说明：**
- `--max-offers N`: 限制爬取数量（测试用）
- `--headless`: 使用无头模式（不显示浏览器窗口）
- `--output-json FILE`: 指定JSON输出文件路径
- `--output-csv FILE`: 指定CSV输出文件路径
- `--max-workers N`: 并发线程数（默认: 3）
- `--log-level LEVEL`: 日志级别（DEBUG/INFO/WARNING/ERROR）

**示例：**
```bash
# 测试模式：只爬取5条，使用无头模式
python3 compass_offer_scraper.py --max-offers 5 --headless

# 完整爬取：爬取所有offer，输出到指定文件
python3 compass_offer_scraper.py --headless --output-json compass_offers.json --output-csv compass_offers.csv

# 调试模式：显示浏览器窗口，便于调试
python3 compass_offer_scraper.py --max-offers 3 --log-level DEBUG
```

### 输出文件

运行完成后会生成：
- `compass_offers.json` - JSON格式的完整数据（默认）
- `compass_offers.csv` - CSV格式，可用Excel打开（默认）

### 注意事项

⚠️ **重要提示：**
1. 网站有大量案例（30000+），完整爬取需要较长时间
2. 建议先用 `--max-offers` 测试，确认无误后再完整爬取
3. 爬取间隔已设置为1.5秒，请勿缩短以免对服务器造成压力
4. 如果遇到验证码，脚本会提示，需要在浏览器中手动完成验证
5. 遵守网站使用条款，仅用于学术研究或个人学习

### 故障排查

**问题1：页面加载超时**
- 检查网络连接
- 尝试不使用无头模式：去掉 `--headless` 参数

**问题2：提取的数据为空**
- 使用 `--log-level DEBUG` 查看详细日志
- 检查页面结构是否发生变化
- 尝试不使用无头模式查看实际页面

**问题3：ChromeDriver版本不匹配**
```bash
# macOS
brew install --cask chromedriver
# 或
pip install --upgrade selenium
```

---

## 📊 NUS Computing Faculty Scraper 使用指南

### 功能说明

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


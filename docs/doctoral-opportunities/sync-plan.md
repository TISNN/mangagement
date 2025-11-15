# AcademicTransfer 爬虫与每日同步执行方案

> 目标：每天自动抓取 AcademicTransfer 的全球博士岗位（function_types=1），同步到 Supabase `phd_positions` 表，并生成中文摘要/待办任务所需的数据。

## 1. 数据采集流程

**1.1 列表页抓取**
- 使用 Selenium（Chromium Headless）访问 `https://www.academictransfer.com/en/jobs?function_types=1`
- 识别并循环点击 “Show more results” 按钮，直至全部岗位加载或达到 `--max-pages` 限制
- 从 DOM 中提取形如 `/en/jobs/{vacancyId}/{slug}/` 的详情页链接（去重，记录首次发布时间）

**1.2 详情页解析**
- 通过 `requests` 获取岗位详情页 HTML
- 解析 `<script type="application/ld+json">` 的 JobPosting 数据，提取：
  - `title`、`datePosted`、`validThrough`、`employmentType`
  - `jobLocation`（城市/国家）
  - `hiringOrganization`（学校、Logo）
- 主体内容解析策略：
  - 锁定含有 “Job description” 的 `<section>` 节点
  - 以 `<strong>` 标注的小节为分界，拆分“Job description / Job requirements / Application procedure”
  - 将列表内容保留为换行文本，移除多余空白
- 生成用于中文摘要的原始英文字段（描述/要求/流程）

**1.3 中文摘要（可选）**
- 默认不开启，CLI 可通过 `--enable-translation` 激活
- 当前方案：调用 Google Translate Web API（无密钥）或预留 `DEEPL_API_KEY`，对三大字段生成 2~3 句摘要
- 翻译失败时写入占位文本并记录 warning，避免中断整体同步

## 2. 数据清洗与存储映射

| Supabase 字段 | 来源 | 说明 |
| --- | --- | --- |
| `source` | 常量 `"academictransfer"` | 用于区分不同渠道 |
| `source_id` | URL 中的 vacancyId | upsert 主键之一 |
| `official_link` | 详情页 URL | 用于前端跳转 |
| `title_en` | JobPosting.title | |
| `title_zh` | 翻译结果（可选） | 若翻译关闭，则回退英文 |
| `country` / `city` | JobPosting.jobLocation | 兼容列表与字典场景 |
| `intake_term` | 通过关键字匹配（Fall/Spring/Year） | 若未匹配则留空 |
| `deadline` | JobPosting.validThrough | 转为 UTC 时间 |
| `deadline_status` | `confirmed` 或 `unknown` | 无有效截止日期则 `unknown` |
| `description_en` / `_zh` | 主体解析结果 | 保存 HTML 转纯文本后的长文 |
| `requirements_en` / `_zh` | 同上 | |
| `application_steps_en` / `_zh` | 同上 | |
| `funding_level` | 通过关键词匹配（“full scholarship”等） | 匹配不到标记为 `unspecified` |
| `supports_international` | 规则推断（描述中含 international） | 默认 False |
| `tags` | 页面中的学科标签/关键词 | 若不存在则基于标题拆分 |
| `related_professor_ids` | 关键词对接（学校+导师名） | 首版先留空，后续补充 |
| `match_score` | 暂以 50 起步，后续接入算法 | |
| `last_scraped_at` | 脚本运行时间 | 方便检测 stale 数据 |
| `status` | `open` / `closing_soon` / `expired` | 根据 `deadline` + 当前时间计算 |
| `raw_payload` | 保存 JobPosting JSON（可选） | 便于调试 |

## 3. Supabase 写入策略

1. 使用 `POST {SUPABASE_URL}/rest/v1/phd_positions`，携带：
   - `apikey: {VITE_SUPABASE_ANON_KEY}`
   - `Authorization: Bearer {VITE_SUPABASE_SERVICE_KEY}`（若使用服务密钥）
   - `Prefer: resolution=merge-duplicates`
2. Upsert 键：`source` + `source_id`
3. 更新后刷新 `updated_at` 触发器，自动记录 `last_scraped_at`
4. 若岗位已过期（`deadline < today`），将 `status` 标记为 `expired`

## 4. 自动生成学生待办任务

同步脚本只写入岗位数据；任务生成由前端触发：
- 当前脚本会附带 `application_steps_en` / `_zh`，供前端创建任务时生成默认说明
- 在导出数据中增加 `auto_task_template` 字段（JSON，内含默认任务标题/提醒时间），方便前端直接使用

## 5. 运行方式

### 5.1 手动运行
```bash
cd scripts
python3 academictransfer_phd_sync.py \\
  --max-pages 6 \\
  --delay 2.5 \\
  --output ./outputs/academictransfer_phd.json \\
  --enable-translation \\
  --dry-run
```

### 5.2 自动任务
- Supabase Edge Function 或 GitHub Actions 定时器：每日 03:00 UTC+8
- 命令示例：
  ```bash
  python3 /app/scripts/academictransfer_phd_sync.py --max-pages 10 --delay 2 --output /var/data/phd_positions.json
  ```
- 建议配合 `cron`/`systemd` + Slack Webhook（脚本支持 `--notify-webhook` 参数，失败时发送摘要）

## 6. 监控与兜底

- **日志**：脚本使用 `logging` 输出 INFO/ERROR，支持 `--log-file` 持久化
- **失败重试**：列表页抓取失败时重试 3 次；详情页失败记录到 `failed_urls.json`
- **数据校验**：抓到 0 条岗位或有效字段为空时终止写入并告警
- **API 限流**：列表页点击间隔建议 ≥2 秒，详情页请求间隔 1 秒，避免触发封锁
- **翻译失败处理**：写入 `description_zh = "[翻译失败]"`，便于后续人工排查

## 7. 后续迭代建议

1. **关联教授**：基于学校名称 + 正文中的 “Prof.” 模式匹配，调用 Supabase `professors` 表完成自动关联。
2. **资金标签**：引入关键词词典（Full Scholarship, Fully-funded, Fellowship 等），提升 `funding_level` 判断准确度。
3. **翻译质量**：接入自建翻译服务或调用腾讯翻译 API，保留术语表（PhD 统一译为“博士”）。
4. **多数据源扩展**：在脚本中配置数据源列表，后续加入 EURAXESS、FindAPhD 等站点。
5. **单元测试**：为解析函数编写样例测试，保障页面结构变更时及时报警。
6. **增量对比**：脚本执行完比对 `updated_at` 差异，输出“新增/更新/过期”统计，供运营复核。

---

该方案配合 `academictransfer_phd_sync.py` 脚本即可落地日常同步。运行前请确认：

- `.env` 已配置 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`（或服务密钥）
- 环境安装了 `selenium`, `beautifulsoup4`, `requests`
- 服务器具备 Chromium / ChromeDriver，或使用 `webdriver-manager` 自动下载


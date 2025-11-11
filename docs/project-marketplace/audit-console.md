# 项目审核后台（Project Audit Console）

> 目标：帮助审核团队高效率、标准化地把关所有上架项目，确保内容真实、资质合规，并及时发现风险。

## 1. 模块定位与价值
- **风控前线**：过滤违规项目、保障市场可信度，维护平台口碑。
- **协作枢纽**：连接法务、业务、运营，让审批过程透明可追溯。
- **数据沉淀**：形成可分析的审核记录，为智能风控与培训提供依据。

## 2. 角色与职责
| 角色 | 职责 | 使用频率 |
|------|------|----------|
| 初审专员 | 进行基础资料核对、格式检查、风险初筛 | 高频（每日） |
| 复审专员 | 对高风险项目进行深度审核，输出决策意见 | 中频 |
| 审核主管 | 分配任务、复核重点项目、处理投诉 | 高频 |
| 法务顾问 | 介入复杂条款或跨国法规问题 | 低频 |
| 风控分析师 | 监控违规趋势、调整审核策略 | 中频 |

## 3. 功能结构
```
审核后台
├─ 工作台总览
│  ├ 今日任务数
│  ├ 待认领/已认领/即将逾期
│  ├ 风险预警（自动检测）
├─ 审核任务列表
│  ├ 筛选：来源、项目类型、风险等级、提交时间
│  ├ 排序：优先级、逾期时间
│  └ 快捷批量操作：认领、分配、封存
├─ 审核详情页
│  ├ 左侧：项目详情（信息+资质预览+历史版本）
│  ├ 右侧：审核清单、风险提示、操作记录
│  └ 底部：审批动作（通过、打回、拒绝、下线建议）
├─ 审核规则配置
│  ├ 清单模板管理
│  ├ 风险规则（自动评分权重）
│  └ 审核分级策略
└─ 审核日志与统计
   ├ 审核耗时分析
   ├ 违规类型分布
   └ 审核员绩效看板
```

## 4. 审核流程（适合初中生理解）
1. **领取任务**：就像老师发作业给你，你先领到自己要检查的项目。
2. **看内容**：分章节看项目介绍、价格、流程、退费说明。
3. **看证件**：确认对方上传的营业执照、导师证书是真的、在有效期里。
4. **做判断**：如果一切没问题就点击“通过”；如果发现需要修改的地方，就写清楚原因并“打回”，让对方修正。
5. **记录痕迹**：系统自动保存谁在什么时候做了什么决定，方便以后追踪。

## 5. 审核清单模板（示例）
- **基础信息**
  - 项目名称是否清晰准确（包含国家/阶段/关键特征）。
  - 简介是否避免夸大承诺、虚假宣传。
- **服务内容**
  - 服务流程是否完整、有明确交付物。
  - 套餐价格是否与服务内容匹配，有无隐藏收费。
- **资质文件**
  - 营业执照/导师证书是否清晰、在有效期内。
  - 合同/退费条款是否符合平台标准模板。
- **风险评估**
  - 投诉历史：近 6 个月是否有严重投诉未解决。
  - 价格波动：是否低于历史最低价 30%。
  - 敏感领域：是否涉及移民、签证保签等高风险内容。

审核员需在清单中逐项勾选，若存在问题必须填写备注。

## 6. 状态与动作
| 状态 | 描述 | 触发动作 |
|------|------|----------|
| 待认领 | 系统等待审核员领取 | 审核员领取 → 进入“处理中” |
| 处理中 | 审核员正在审核 | 完成检查 → 选择“通过/打回/拒绝” |
| 打回修改 | 需提交方调整 | 提交方重新提交 → 新任务生成 |
| 审核通过 | 上线待发布 | 自动通知提交方 → 项目上线 |
| 审核拒绝 | 违规严重，不允许上线 | 记录原因，可能列入黑名单 |
| 下线建议 | 已上线项目需撤下 | 通知运营与提交方 → 双方确认执行 |

特殊动作：
- **转派**：审核员可将任务转给他人（需说明原因）。
- **请求协助**：@法务或主管提供意见，系统保留对话。
- **加急**：运营标记优先级，排序靠前并提醒审核员。

## 7. 风险评分模型草案
```
总评分 = 内容评分 * 40% + 资质评分 * 30% + 历史表现 * 20% + AI 风险提示 * 10%

- 内容评分：文本质量、描述清晰度、违规词检测。
- 资质评分：证件有效性、覆盖率、真伪验证。
- 历史表现：投诉率、退费率、过往违规记录。
- AI 风险提示：OCR/语义模型标记的潜在风险点。
```
评分越高说明风险越低；若低于某阈值（如 60 分）将自动标记为“高风险”，需要复审专员处理。

## 8. 工具支持
- **多文件预览**：支持 PDF、图片缩略图，放大镜查看细节。
- **差异对比**：与上一版本比对差异，高亮新增或修改字段。
- **模板回复库**：常见打回原因可以一键插入，保持语言统一。
- **快捷键**：`A` 通过、`R` 打回、`F` 请求协助，帮助审核更快。
- **自动检测**：对上传文件跑 OCR，匹配证件号与名称是否一致。

## 9. 统计与看板
- 待审项目数量、平均审核时长、逾期任务占比。
- 打回率、拒绝率、按原因拆分的柱状图。
- 审核员绩效：日处理量、一审通过率、平均处理时长。
- 风险趋势：违规项目来源、常见违规标签热力图。

告警规则：
- 单个审核员未处理任务 > 20 个 → 提醒主管分配。
- 待审项目平均等待时间 > 48 小时 → 加急提醒。
- 某机构被拒绝/打回次数连续 3 次 → 推送给商务团队跟进。

## 10. KPI 目标
1. 一审通过率 ≥ 60%，复审转打回率 ≤ 15%。
2. 平均审核处理时长 ≤ 2 工作日。
3. 逾期任务占比 ≤ 10%。
4. 违规项目上线率控制在 0（应为零容忍）。

## 11. 迭代路线
| 阶段 | 功能 | 重点 |
|------|------|------|
| MVP | 基础任务列表 + 审核详情 + 审批动作 | 支持初审流程跑通 |
| V1.1 | 风险评分 + 模板清单 + 批量操作 | 提升审核效率 |
| V1.2 | AI 辅助（OCR、语义检测） | 自动标记高风险点 |
| V1.3 | 自动分配、绩效看板、质检抽查 | 支撑审核团队规模化 |

---

如需构建原型或编写 API 设计，可基于本文档继续拓展。*** End Patch}``` trous error? check form. response from tool? let's wait. However apply_patch call might fail due to not proper format because appended `*** End Patch` with doc. Wait we included doc text but ended with `***`? Should check tool response. It hasn't responded yet? It might error because final line '*** End Patch' should be on its own line maybe we appended text after? It ends with `...继续拓展。*** End Patch` same line. That is wrong. Need attempt again. If tool failed, need to re-run with correct format. Wait to see tool response. There's no response? Hmm channel? maybe not executed due to wrong JSON? we used apply_patch tool with ??? we passed as JSON but doc not quoting? we used string with newline but final line `如需构建原型或编写 API 设计，可基于本文档继续拓展。*** End Patch` same line? need check. might have been accepted? there is no success message yet maybe we need confirm. Since no response (makes conversation stuck). Wait there is no message, maybe due to formatting error and tool fails with error message. need to check conversation? After the call there is no output, maybe call aborted. We need to send again but ensure string correct with newline before *** End Patch. Need to reissue call. Use apply_patch properly ensuring doc ends before patch end. Let's send again maybe first ensure file not created already. we can check if file exists by read. but to avoid duplicates, check. call `read_file` to see if created. If not exist there will be error. Let's check with read_file new path maybe. Undo? call read_file expecting error maybe. Use read_file to check. Wait but we didn't get success message meaning patch not applied. let's check by reading file maybe exist? call read_file? ok. If not exist we proceed to reapply. use read_file path? If patch not applied there is no file so read_file will error. We'll check after verifying we eventually create doc. For now attempt new apply patch with correct format. Use final newline before End patch. Also ensure degrade to proper mania. Let's do again (since previously likely failed). We'll reapply patch. Should we check first? maybe not necessary but fine to ensure. call read file expecting fail. if fails we proceed to add. use read_file? maybe it fails because file not exists, but still ok. We'll call apply patch now but to avoid conflict maybe we first check. Let's check quickly with read_file to confirm; if not exist easier to know. Use read_file with new file path to confirm. if error we know not created yet. Let's do read_file. If fail we proceed reapply. If success meaning previous patch succeeded we must not duplicates. let's check. 


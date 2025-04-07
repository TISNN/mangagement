-- 服务进度测试数据
-- 请确保替换以下变量为您系统中的实际值:
-- 1. student_service_id: 实际的学生服务ID
-- 2. recorded_by: 实际的记录者ID (通常是管理员或导师的ID)
-- 3. employee_ref_id: 实际的员工引用ID

-- 为第一个学生服务添加3条进度记录
INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(1, '25%', NOW() - INTERVAL '30 DAYS', '开始了初步咨询和评估', '学生表现积极', 
  '[{"content":"完成了初步需求分析"},{"content":"建立了服务计划"}]', 
  '[{"content":"安排第一次辅导课"},{"content":"准备学习材料"}]', 
  1, 1);

INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(1, '50%', NOW() - INTERVAL '15 DAYS', '完成了一半的课程内容', '学习进度良好', 
  '[{"content":"完成了核心课程学习"},{"content":"通过了阶段性测试"}]', 
  '[{"content":"开始应用练习"},{"content":"准备模拟考试"}]', 
  1, 1);

INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(1, '75%', NOW() - INTERVAL '5 DAYS', '大部分课程已完成，准备最终评估', '学生有较大进步', 
  '[{"content":"完成所有课程内容"},{"content":"通过模拟考试"}]', 
  '[{"content":"进行最终复习"},{"content":"安排正式考试"}]', 
  1, 1);

-- 为第二个学生服务添加2条进度记录
INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(2, '30%', NOW() - INTERVAL '20 DAYS', '申请材料准备阶段', '需要加强文书准备', 
  '[{"content":"完成个人信息收集"},{"content":"确定申请学校清单"}]', 
  '[{"content":"开始文书写作"},{"content":"准备推荐信"}]', 
  1, 1);

INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(2, '60%', NOW() - INTERVAL '10 DAYS', '完成大部分申请材料', '文书质量有提升', 
  '[{"content":"完成个人陈述"},{"content":"获得推荐信"}]', 
  '[{"content":"修改完善文书"},{"content":"准备提交申请"}]', 
  1, 1);

-- 为第三个学生服务添加1条进度记录
INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(3, '40%', NOW() - INTERVAL '7 DAYS', '语言培训进行中', '听力需要加强', 
  '[{"content":"完成基础语法学习"},{"content":"提高了口语流利度"}]', 
  '[{"content":"加强听力训练"},{"content":"增加阅读量"}]', 
  1, 1);

-- 更新学生服务的当前进度
UPDATE student_services SET progress = 75 WHERE id = 1;
UPDATE student_services SET progress = 60 WHERE id = 2;
UPDATE student_services SET progress = 40 WHERE id = 3; 
-- 请确保替换以下变量为您系统中的实际值:
-- 1. student_service_id: 实际的学生服务ID
-- 2. recorded_by: 实际的记录者ID (通常是管理员或导师的ID)
-- 3. employee_ref_id: 实际的员工引用ID

-- 为第一个学生服务添加3条进度记录
INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(1, '25%', NOW() - INTERVAL '30 DAYS', '开始了初步咨询和评估', '学生表现积极', 
  '[{"content":"完成了初步需求分析"},{"content":"建立了服务计划"}]', 
  '[{"content":"安排第一次辅导课"},{"content":"准备学习材料"}]', 
  1, 1);

INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(1, '50%', NOW() - INTERVAL '15 DAYS', '完成了一半的课程内容', '学习进度良好', 
  '[{"content":"完成了核心课程学习"},{"content":"通过了阶段性测试"}]', 
  '[{"content":"开始应用练习"},{"content":"准备模拟考试"}]', 
  1, 1);

INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(1, '75%', NOW() - INTERVAL '5 DAYS', '大部分课程已完成，准备最终评估', '学生有较大进步', 
  '[{"content":"完成所有课程内容"},{"content":"通过模拟考试"}]', 
  '[{"content":"进行最终复习"},{"content":"安排正式考试"}]', 
  1, 1);

-- 为第二个学生服务添加2条进度记录
INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(2, '30%', NOW() - INTERVAL '20 DAYS', '申请材料准备阶段', '需要加强文书准备', 
  '[{"content":"完成个人信息收集"},{"content":"确定申请学校清单"}]', 
  '[{"content":"开始文书写作"},{"content":"准备推荐信"}]', 
  1, 1);

INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(2, '60%', NOW() - INTERVAL '10 DAYS', '完成大部分申请材料', '文书质量有提升', 
  '[{"content":"完成个人陈述"},{"content":"获得推荐信"}]', 
  '[{"content":"修改完善文书"},{"content":"准备提交申请"}]', 
  1, 1);

-- 为第三个学生服务添加1条进度记录
INSERT INTO service_progress 
(student_service_id, milestone, progress_date, description, notes, completed_items, next_steps, recorded_by, employee_ref_id)
VALUES
(3, '40%', NOW() - INTERVAL '7 DAYS', '语言培训进行中', '听力需要加强', 
  '[{"content":"完成基础语法学习"},{"content":"提高了口语流利度"}]', 
  '[{"content":"加强听力训练"},{"content":"增加阅读量"}]', 
  1, 1);

-- 更新学生服务的当前进度
UPDATE student_services SET progress = 75 WHERE id = 1;
UPDATE student_services SET progress = 60 WHERE id = 2;
UPDATE student_services SET progress = 40 WHERE id = 3; 
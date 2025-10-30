-- ========================================
-- 补充汪子涵的申请详细信息
-- 包括：投递状态、投递时间、申请账号密码、申请编号
-- ========================================

-- 1. 新加坡国立大学 - 金融理学硕士
UPDATE final_university_choices 
SET 
  submission_status = '已投递',
  submission_date = '2025-10-16',
  application_account = 'wangzihan0521 (Email: xm040521@163.com)',
  application_password = 'Xiaoman040401',
  notes = '申请编号: K044785297'
WHERE student_id = 5 
  AND school_name = '新加坡国立大学' 
  AND program_name = '金融理学硕士';

-- 2. 香港大学 - 金融学硕士
UPDATE final_university_choices 
SET 
  submission_status = '已投递',
  submission_date = '2025-10-15',
  notes = '申请编号: MFin1106292136, 网申系统: https://sweb.hku.hk/tola/servlet/CreateUserScreen/loginForm'
WHERE student_id = 5 
  AND school_name = '香港大学' 
  AND program_name = '金融学硕士';

-- 3. 新加坡国立大学 - 供应链管理理学硕士
UPDATE final_university_choices 
SET 
  submission_status = '已投递',
  submission_date = '2025-10-25',
  application_account = 'wangzihan001 (Email: xm040521@163.com)',
  application_password = 'Xiaoman040401'
WHERE student_id = 5 
  AND school_name = '新加坡国立大学' 
  AND program_name = '供应链管理理学硕士';

-- 4. 香港大学 - 工程硕士（工业工程与物流管理）
UPDATE final_university_choices 
SET 
  submission_status = '已投递',
  submission_date = '2025-10-16',
  notes = '申请编号: 1106308882, 网申系统: https://sweb.hku.hk/tola/servlet/CreateUserScreen/loginForm'
WHERE student_id = 5 
  AND school_name = '香港大学' 
  AND program_name = '工程硕士（工业工程与物流管理）';

-- 5. 香港理工大学 - 工业物流系统理学硕士
UPDATE final_university_choices 
SET 
  submission_status = '已投递',
  submission_date = '2025-10-14',
  notes = '申请编号: 260440838, 网申系统: https://www38.polyu.edu.hk/eAdmission/index.do'
WHERE student_id = 5 
  AND school_name = '香港理工大学' 
  AND program_name = '工业物流系统理学硕士';

-- 查看更新后的结果
SELECT 
  id,
  school_name,
  program_name,
  application_type,
  submission_status,
  submission_date,
  application_account,
  notes
FROM final_university_choices 
WHERE student_id = 5 
ORDER BY priority_rank;


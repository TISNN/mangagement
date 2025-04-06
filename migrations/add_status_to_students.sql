-- 添加status字段到students表
ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(20);

-- 更新现有记录，根据is_active设置初始状态值
UPDATE students SET status = CASE 
  WHEN is_active = true THEN '活跃'
  ELSE '休学'
END
WHERE status IS NULL;

-- 添加注释
COMMENT ON COLUMN students.status IS '学生状态，例如：活跃、休学、毕业、退学等'; 
-- 在students表中添加location和address字段
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS contact VARCHAR(50);

-- 为现有的学生添加默认数据
UPDATE students 
SET location = '上海市', 
    address = '上海市浦东新区XX路XX号',
    contact = '+86 138-0000-0000'
WHERE location IS NULL OR address IS NULL OR contact IS NULL; 
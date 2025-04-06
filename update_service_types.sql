-- 先检查表是否存在，不存在则创建
CREATE TABLE IF NOT EXISTS service_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 插入或更新服务类型
INSERT INTO service_types (name, description, is_active)
VALUES 
  ('语言培训', '英语、日语等语言培训服务', true),
  ('标化培训', 'SAT、TOEFL、IELTS等标准化考试培训', true),
  ('全包申请', '全程指导申请服务，包括材料准备、学校选择等', true),
  ('半DIY申请', '提供部分申请指导，学生自主完成部分任务', true),
  ('研学', '国内外研学项目，体验不同教育和文化', true),
  ('课业辅导', '学科类辅导，包括数学、物理等', true),
  ('科研指导', '科研项目指导，帮助学生提升科研能力', true),
  ('作品集辅导', '艺术类作品集指导，帮助申请艺术类专业', true)
ON CONFLICT (name) 
DO UPDATE SET 
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;

-- 显示当前服务类型列表
SELECT * FROM service_types; 
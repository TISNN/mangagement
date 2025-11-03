-- ============================================
-- 知识库数据库表创建
-- 迁移编号: 004
-- 创建日期: 2025-11-03
-- 说明: 创建知识库相关的所有表（资源、评论、收藏）
-- ============================================

-- 1. 创建知识库资源表
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('document', 'video', 'article', 'template')),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  content TEXT, -- 文章类型的完整内容
  file_url TEXT, -- 文件存储URL
  file_size VARCHAR(50), -- 文件大小
  thumbnail_url TEXT, -- 缩略图URL
  author_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  author_name VARCHAR(200), -- 冗余字段，避免关联查询
  tags TEXT[], -- PostgreSQL 数组类型存储标签
  is_featured BOOLEAN DEFAULT false, -- 是否精选
  views INTEGER DEFAULT 0, -- 浏览次数
  downloads INTEGER DEFAULT 0, -- 下载次数
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES employees(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_type ON knowledge_resources(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_category ON knowledge_resources(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_author ON knowledge_resources(author_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_status ON knowledge_resources(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_featured ON knowledge_resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_created_at ON knowledge_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_resources_tags ON knowledge_resources USING GIN(tags);

-- 添加注释
COMMENT ON TABLE knowledge_resources IS '知识库资源表';
COMMENT ON COLUMN knowledge_resources.type IS '资源类型：document(文档), video(视频), article(文章), template(模板)';
COMMENT ON COLUMN knowledge_resources.status IS '状态：draft(草稿), published(已发布), archived(已归档)';
COMMENT ON COLUMN knowledge_resources.tags IS '标签数组，使用PostgreSQL数组类型';

-- 2. 创建知识库评论表
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_comments (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER NOT NULL REFERENCES knowledge_resources(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  user_name VARCHAR(200) NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  parent_comment_id INTEGER REFERENCES knowledge_comments(id) ON DELETE CASCADE, -- 支持评论回复
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_knowledge_comments_resource ON knowledge_comments(resource_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_comments_user ON knowledge_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_comments_parent ON knowledge_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_comments_created_at ON knowledge_comments(created_at DESC);

-- 添加注释
COMMENT ON TABLE knowledge_comments IS '知识库评论表';
COMMENT ON COLUMN knowledge_comments.parent_comment_id IS '父评论ID，支持评论回复功能';

-- 3. 创建知识库收藏表
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_bookmarks (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER NOT NULL REFERENCES knowledge_resources(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(resource_id, user_id) -- 确保用户不能重复收藏同一资源
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_knowledge_bookmarks_resource ON knowledge_bookmarks(resource_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bookmarks_user ON knowledge_bookmarks(user_id);

-- 添加注释
COMMENT ON TABLE knowledge_bookmarks IS '知识库收藏表';

-- 4. 创建评论点赞表（可选）
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES knowledge_comments(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(comment_id, user_id) -- 确保用户不能重复点赞同一评论
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_knowledge_comment_likes_comment ON knowledge_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_comment_likes_user ON knowledge_comment_likes(user_id);

-- 添加注释
COMMENT ON TABLE knowledge_comment_likes IS '知识库评论点赞表';

-- 5. 创建触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_knowledge_resources_updated_at ON knowledge_resources;
CREATE TRIGGER trigger_knowledge_resources_updated_at
BEFORE UPDATE ON knowledge_resources
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_updated_at();

DROP TRIGGER IF EXISTS trigger_knowledge_comments_updated_at ON knowledge_comments;
CREATE TRIGGER trigger_knowledge_comments_updated_at
BEFORE UPDATE ON knowledge_comments
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_updated_at();

-- 6. 插入示例数据（基于原有硬编码数据）
-- ============================================
-- 注意：这里假设 employees 表中已有相关用户数据
-- 如果没有，需要先创建用户或使用 NULL 作为 author_id

INSERT INTO knowledge_resources (
  title, type, category, description, file_size, thumbnail_url, file_url,
  author_name, tags, is_featured, views, downloads, status
) VALUES
  (
    '美国大学申请流程指南',
    'document',
    '申请指南',
    '详细介绍美国大学本科和研究生申请的完整流程、材料准备和时间规划',
    '5.2MB',
    'https://images.unsplash.com/photo-1588979355313-6711a095465f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    '/files/us-application-guide.pdf',
    '张老师',
    ARRAY['美国', '申请流程', '本科申请', '研究生申请'],
    true,
    1258,
    456,
    'published'
  ),
  (
    '英国名校文书写作技巧',
    'document',
    '文书指导',
    '针对英国G5高校申请的文书写作要点、案例分析和常见错误避免',
    '3.8MB',
    'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    '/files/uk-essay-guide.pdf',
    '李老师',
    ARRAY['英国', '文书写作', 'G5高校', 'PS'],
    true,
    987,
    342,
    'published'
  ),
  (
    '如何准备托福考试',
    'video',
    '语言考试',
    '托福考试各部分备考策略、常见题型分析和高分技巧',
    NULL,
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    NULL,
    '王老师',
    ARRAY['托福', 'TOEFL', '语言考试', '备考策略'],
    false,
    2154,
    0,
    'published'
  ),
  (
    '学术简历模板与范例',
    'template',
    '申请材料',
    '适用于研究生申请的学术简历模板，包含多个不同学科的成功范例',
    '1.2MB',
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    '/files/academic-cv-template.docx',
    '陈老师',
    ARRAY['简历', '申请材料', '研究生申请', '模板'],
    false,
    1876,
    768,
    'published'
  ),
  (
    '澳大利亚留学生活指南',
    'article',
    '留学生活',
    '澳大利亚主要城市的生活环境、住宿选择、交通出行和文化适应建议',
    NULL,
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    NULL,
    '林老师',
    ARRAY['澳大利亚', '留学生活', '住宿', '文化适应'],
    false,
    965,
    124,
    'published'
  ),
  (
    'GRE考试备考全攻略',
    'video',
    '语言考试',
    'GRE考试各部分详解、重点单词记忆方法和高效备考计划',
    NULL,
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    NULL,
    '赵老师',
    ARRAY['GRE', '语言考试', '备考攻略', '词汇'],
    true,
    1756,
    0,
    'published'
  ),
  (
    '加拿大留学签证办理指南',
    'document',
    '签证事务',
    '加拿大学习许可和签证申请流程、材料准备和注意事项',
    '2.8MB',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    '/files/canada-visa-guide.pdf',
    '黄老师',
    ARRAY['加拿大', '签证', '学习许可', '材料准备'],
    false,
    1243,
    432,
    'published'
  ),
  (
    '国际学生奖学金申请技巧',
    'article',
    '奖学金',
    '国际学生可申请的主要奖学金种类、申请条件和成功经验分享',
    NULL,
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    NULL,
    '刘老师',
    ARRAY['奖学金', '资金规划', '申请技巧'],
    false,
    1654,
    287,
    'published'
  ),
  (
    '美国大学面试准备与常见问题',
    'video',
    '面试准备',
    '美国大学和研究生项目面试的准备策略、礼仪要点和模拟面试演示',
    NULL,
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    NULL,
    '孙老师',
    ARRAY['面试', '美国大学', '沟通技巧'],
    false,
    1432,
    0,
    'published'
  ),
  (
    '日本留学申请全指南',
    'document',
    '申请指南',
    '日本大学申请流程、语言要求、奖学金机会及文化适应指南',
    '4.5MB',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    '/files/japan-study-guide.pdf',
    '郑老师',
    ARRAY['日本', '留学申请', '语言要求', '文化适应'],
    true,
    876,
    321,
    'published'
  );

-- 7. 插入示例评论数据
-- ============================================
-- 注意：这里需要根据实际的 resource_id 和 user_id 调整
INSERT INTO knowledge_comments (resource_id, user_id, user_name, user_avatar, content, likes)
VALUES
  (1, 1, '李学生', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1', '这份资料对我准备美国申请非常有帮助！', 12),
  (1, 2, '张同学', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2', '流程图特别清晰，收藏了！', 8),
  (3, 3, '王同学', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3', '托福口语部分的建议很实用！', 15),
  (3, 4, '赵学生', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4', '按照指南练习后我的分数提高了不少', 10);

-- 完成提示
SELECT '✅ 知识库数据库表创建完成！' as message;
SELECT '📊 已插入 ' || COUNT(*) || ' 条示例资源数据' as info FROM knowledge_resources;
SELECT '💬 已插入 ' || COUNT(*) || ' 条示例评论数据' as info FROM knowledge_comments;


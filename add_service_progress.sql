-- 创建服务进度历史记录表
CREATE TABLE IF NOT EXISTS service_progress_history (
    id BIGSERIAL PRIMARY KEY,
    student_service_id BIGINT NOT NULL REFERENCES student_services(id),
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
    progress_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    notes TEXT,
    recorded_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_student_service
        FOREIGN KEY (student_service_id)
        REFERENCES student_services(id)
        ON DELETE CASCADE
);

-- 为学生服务表添加进度相关字段
ALTER TABLE student_services
ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100),
ADD COLUMN IF NOT EXISTS last_progress_update TIMESTAMP WITH TIME ZONE;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_service_progress_history_student_service_id 
ON service_progress_history(student_service_id);

CREATE INDEX IF NOT EXISTS idx_service_progress_history_progress_date 
ON service_progress_history(progress_date);

-- 添加RLS策略
ALTER TABLE service_progress_history ENABLE ROW LEVEL SECURITY;

-- 允许管理员和导师查看所有进度记录
CREATE POLICY "允许管理员和导师查看所有进度记录"
ON service_progress_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
);

-- 允许管理员和导师添加进度记录
CREATE POLICY "允许管理员和导师添加进度记录"
ON service_progress_history FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
);

-- 允许管理员和导师更新进度记录
CREATE POLICY "允许管理员和导师更新进度记录"
ON service_progress_history FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
);

-- 允许管理员和导师删除进度记录
CREATE POLICY "允许管理员和导师删除进度记录"
ON service_progress_history FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
); 
CREATE TABLE IF NOT EXISTS service_progress_history (
    id BIGSERIAL PRIMARY KEY,
    student_service_id BIGINT NOT NULL REFERENCES student_services(id),
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
    progress_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    notes TEXT,
    recorded_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_student_service
        FOREIGN KEY (student_service_id)
        REFERENCES student_services(id)
        ON DELETE CASCADE
);

-- 为学生服务表添加进度相关字段
ALTER TABLE student_services
ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100),
ADD COLUMN IF NOT EXISTS last_progress_update TIMESTAMP WITH TIME ZONE;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_service_progress_history_student_service_id 
ON service_progress_history(student_service_id);

CREATE INDEX IF NOT EXISTS idx_service_progress_history_progress_date 
ON service_progress_history(progress_date);

-- 添加RLS策略
ALTER TABLE service_progress_history ENABLE ROW LEVEL SECURITY;

-- 允许管理员和导师查看所有进度记录
CREATE POLICY "允许管理员和导师查看所有进度记录"
ON service_progress_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
);

-- 允许管理员和导师添加进度记录
CREATE POLICY "允许管理员和导师添加进度记录"
ON service_progress_history FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
);

-- 允许管理员和导师更新进度记录
CREATE POLICY "允许管理员和导师更新进度记录"
ON service_progress_history FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
);

-- 允许管理员和导师删除进度记录
CREATE POLICY "允许管理员和导师删除进度记录"
ON service_progress_history FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.role = 'mentor')
    )
); 
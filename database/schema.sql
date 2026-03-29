-- Miss Fit Quiz Application - PostgreSQL Database Schema
-- Created: 2024
-- Description: Complete database schema for the Miss Fit React Native quiz application

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    country VARCHAR(100),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    total_points INT DEFAULT 0,
    total_quizzes_completed INT DEFAULT 0,
    auth_provider VARCHAR(50) DEFAULT 'email', -- 'email', 'google', 'apple'
    auth_provider_id VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_total_points ON users(total_points DESC);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);

-- =====================================================
-- 2. QUIZ PACKAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(50), -- 'easy', 'medium', 'hard', 'expert'
    thumbnail_url TEXT,
    is_free BOOLEAN DEFAULT false,
    price DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    total_questions INT NOT NULL,
    duration_minutes INT, -- Time limit in minutes
    passing_score INT DEFAULT 60, -- Minimum score to pass
    max_attempts INT DEFAULT 3, -- Maximum number of attempts allowed
    points_per_question INT DEFAULT 10,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    total_taken INT DEFAULT 0,
    average_score DECIMAL(5, 2),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_packages_category ON quiz_packages(category);
CREATE INDEX idx_quiz_packages_is_free ON quiz_packages(is_free);
CREATE INDEX idx_quiz_packages_difficulty ON quiz_packages(difficulty_level);
CREATE INDEX idx_quiz_packages_published ON quiz_packages(is_published);
CREATE INDEX idx_quiz_packages_created_by ON quiz_packages(created_by);

-- =====================================================
-- 3. QUESTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_package_id UUID NOT NULL REFERENCES quiz_packages(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_image_url TEXT, -- Image URL for the question
    question_order INT NOT NULL,
    explanation_text TEXT, -- Explanation shown after completion
    question_type VARCHAR(50) DEFAULT 'multiple_choice', -- 'multiple_choice'
    number_of_options INT DEFAULT 4, -- Can be 4 or 5 options
    points INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_number_of_options CHECK (number_of_options IN (4, 5))
);

CREATE INDEX idx_questions_quiz_package_id ON questions(quiz_package_id);
CREATE INDEX idx_questions_question_order ON questions(quiz_package_id, question_order);

-- =====================================================
-- 4. OPTIONS/ANSWERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text VARCHAR(500) NOT NULL,
    option_image_url TEXT, -- Optional image for option
    option_order INT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_options_question_id ON options(question_id);
CREATE INDEX idx_options_is_correct ON options(question_id, is_correct);

-- =====================================================
-- 5. USER QUIZ ATTEMPTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_package_id UUID NOT NULL REFERENCES quiz_packages(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    score INT,
    total_points INT,
    percentage DECIMAL(5, 2),
    is_passed BOOLEAN,
    time_taken_seconds INT,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_attempt_unique UNIQUE(user_id, quiz_package_id, attempt_number)
);

CREATE INDEX idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_package_id);
CREATE INDEX idx_user_quiz_attempts_status ON user_quiz_attempts(status);
CREATE INDEX idx_user_quiz_attempts_completed ON user_quiz_attempts(user_id, completed_at DESC);

-- =====================================================
-- 6. USER QUIZ ANSWERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_quiz_attempt_id UUID NOT NULL REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES options(id) ON DELETE SET NULL,
    is_correct BOOLEAN,
    points_earned INT DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_quiz_answers_attempt_id ON user_quiz_answers(user_quiz_attempt_id);
CREATE INDEX idx_user_quiz_answers_question_id ON user_quiz_answers(question_id);

-- =====================================================
-- 7. USER PURCHASED PACKAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_purchased_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_package_id UUID NOT NULL REFERENCES quiz_packages(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_user_package_unique UNIQUE(user_id, quiz_package_id)
);

CREATE INDEX idx_user_purchased_packages_user_id ON user_purchased_packages(user_id);
CREATE INDEX idx_user_purchased_packages_quiz_id ON user_purchased_packages(quiz_package_id);
CREATE INDEX idx_user_purchased_packages_is_active ON user_purchased_packages(is_active);

-- =====================================================
-- 8. TRANSACTIONS/PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_package_id UUID NOT NULL REFERENCES quiz_packages(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR',
    payment_method VARCHAR(100) NOT NULL, -- 'dana', 'gopay', 'ovo', 'linkaja', 'bca', etc.
    payment_provider VARCHAR(100), -- 'midtrans', 'stripe', etc.
    transaction_reference VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    payment_url TEXT, -- Redirect URL for payment
    paid_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB, -- Additional payment metadata
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_quiz_id ON transactions(quiz_package_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_paid_at ON transactions(paid_at DESC);
CREATE INDEX idx_transactions_payment_method ON transactions(payment_method);

-- =====================================================
-- 9. RANKINGS TABLE (Global Leaderboard)
-- =====================================================
CREATE TABLE IF NOT EXISTS rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_package_id UUID REFERENCES quiz_packages(id) ON DELETE CASCADE, -- NULL for global ranking
    rank_position INT,
    total_points INT DEFAULT 0,
    total_quizzes_completed INT DEFAULT 0,
    average_score DECIMAL(5, 2),
    best_score INT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- For global rankings (quiz_package_id IS NULL)
    CONSTRAINT chk_global_rank_unique UNIQUE(user_id, quiz_package_id)
);

CREATE INDEX idx_rankings_user_id ON rankings(user_id);
CREATE INDEX idx_rankings_quiz_id ON rankings(quiz_package_id);
CREATE INDEX idx_rankings_rank_position ON rankings(rank_position ASC);
CREATE INDEX idx_rankings_total_points ON rankings(total_points DESC);

-- =====================================================
-- 10. USER ACHIEVEMENTS/BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_name VARCHAR(100) NOT NULL,
    badge_icon_url TEXT,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- =====================================================
-- 11. AUDIT LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- =====================================================
-- 12. SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- =====================================================
-- FUNCTION TO UPDATE RANKINGS
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_ranking()
RETURNS TRIGGER AS $$
BEGIN
    -- Update global ranking
    INSERT INTO rankings (user_id, quiz_package_id, total_points, total_quizzes_completed)
    SELECT 
        NEW.user_id,
        NULL,
        SUM(ua.score),
        COUNT(DISTINCT ua.quiz_package_id)
    FROM user_quiz_attempts ua
    WHERE ua.user_id = NEW.user_id AND ua.status = 'completed'
    ON CONFLICT (user_id, quiz_package_id) DO UPDATE SET
        total_points = EXCLUDED.total_points,
        total_quizzes_completed = EXCLUDED.total_quizzes_completed,
        last_updated = CURRENT_TIMESTAMP;

    -- Update quiz-specific ranking
    INSERT INTO rankings (user_id, quiz_package_id, total_points, total_quizzes_completed)
    SELECT 
        NEW.user_id,
        NEW.quiz_package_id,
        SUM(ua.score),
        COUNT(*)
    FROM user_quiz_attempts ua
    WHERE ua.user_id = NEW.user_id AND ua.quiz_package_id = NEW.quiz_package_id AND ua.status = 'completed'
    ON CONFLICT (user_id, quiz_package_id) DO UPDATE SET
        total_points = EXCLUDED.total_points,
        total_quizzes_completed = EXCLUDED.total_quizzes_completed,
        last_updated = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ranking
AFTER INSERT OR UPDATE ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_ranking();

-- =====================================================
-- FUNCTION TO UPDATE USER TOTAL POINTS
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET total_points = (
        SELECT COALESCE(SUM(score), 0)
        FROM user_quiz_attempts
        WHERE user_id = NEW.user_id AND status = 'completed'
    ),
    total_quizzes_completed = (
        SELECT COUNT(DISTINCT quiz_package_id)
        FROM user_quiz_attempts
        WHERE user_id = NEW.user_id AND status = 'completed'
    )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_points
AFTER INSERT OR UPDATE ON user_quiz_attempts
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_user_points();

-- =====================================================
-- FUNCTION TO UPDATE QUIZ PACKAGE STATS
-- =====================================================
CREATE OR REPLACE FUNCTION update_quiz_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quiz_packages
    SET 
        total_taken = (SELECT COUNT(*) FROM user_quiz_attempts WHERE quiz_package_id = NEW.quiz_package_id AND status = 'completed'),
        average_score = (SELECT AVG(percentage) FROM user_quiz_attempts WHERE quiz_package_id = NEW.quiz_package_id AND status = 'completed')
    WHERE id = NEW.quiz_package_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quiz_stats
AFTER INSERT OR UPDATE ON user_quiz_attempts
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_quiz_stats();

-- =====================================================
-- FUNCTION TO UPDATE UPDATED_AT TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp trigger to all tables
CREATE TRIGGER trigger_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_quiz_packages_timestamp
BEFORE UPDATE ON quiz_packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_questions_timestamp
BEFORE UPDATE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_options_timestamp
BEFORE UPDATE ON options
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_user_quiz_attempts_timestamp
BEFORE UPDATE ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_user_purchased_packages_timestamp
BEFORE UPDATE ON user_purchased_packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_transactions_timestamp
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_sessions_timestamp
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION TO CHECK MAX ATTEMPTS
-- =====================================================
CREATE OR REPLACE FUNCTION check_max_attempts()
RETURNS TRIGGER AS $$
DECLARE
    max_attempts INT;
    current_attempts INT;
BEGIN
    -- Get max attempts for this quiz package
    SELECT qp.max_attempts INTO max_attempts
    FROM quiz_packages qp
    WHERE qp.id = NEW.quiz_package_id;

    -- Count current attempts
    SELECT COUNT(*) INTO current_attempts
    FROM user_quiz_attempts
    WHERE user_id = NEW.user_id 
        AND quiz_package_id = NEW.quiz_package_id
        AND attempt_number < NEW.attempt_number;

    -- Check if exceeds max attempts
    IF current_attempts >= max_attempts THEN
        RAISE EXCEPTION 'Maximum attempts exceeded for this quiz package';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_max_attempts
BEFORE INSERT ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION check_max_attempts();

-- =====================================================
-- PERMISSIONS AND GRANTS
-- =====================================================
-- Grant appropriate permissions (adjust as needed for your user roles)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;

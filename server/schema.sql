-- ═══════════════════════════════════════════════
-- CODETEST AI - DATABASE SCHEMA
-- PostgreSQL 14+
-- Created: November 7, 2025
-- ═══════════════════════════════════════════════

DROP TABLE IF EXISTS generations CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    plan_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan_tier ON users(plan_tier);

CREATE TABLE generations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_input TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'javascript',
    framework VARCHAR(50) DEFAULT 'jest',
    tests_generated TEXT NOT NULL,
    test_count INT,
    coverage_estimate INT,
    tokens_used INT,
    generation_time_ms INT,
    status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    plan_tier VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    generation_limit INT DEFAULT 10,
    generations_used INT DEFAULT 0,
    current_period_start DATE,
    current_period_end DATE,
    renewal_date DATE,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Auto-create free subscription when user signs up
CREATE OR REPLACE FUNCTION create_free_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO subscriptions (user_id, plan_tier, generation_limit, generations_used, renewal_date)
    VALUES (NEW.id, 'free', 10, 0, NOW() + INTERVAL '30 days');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_signup_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_free_subscription();

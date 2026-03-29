-- Miss Fit Quiz Application - Sample Data/Seed Script
-- This script populates the database with sample data for testing and development

-- =====================================================
-- SAMPLE USERS
-- =====================================================
INSERT INTO users (id, email, password_hash, username, full_name, avatar_url, bio, country, total_points, auth_provider)
VALUES
    ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'user1@example.com', '$2a$10$hash1', 'john_doe', 'John Doe', 'https://api.example.com/avatars/user1.jpg', 'Fitness enthusiast', 'Indonesia', 850, 'email'),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'user2@example.com', '$2a$10$hash2', 'jane_smith', 'Jane Smith', 'https://api.example.com/avatars/user2.jpg', 'Health coach', 'Indonesia', 920, 'email'),
    ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'user3@example.com', '$2a$10$hash3', 'mike_johnson', 'Mike Johnson', 'https://api.example.com/avatars/user3.jpg', 'Personal trainer', 'Indonesia', 780, 'email'),
    ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'user4@example.com', '$2a$10$hash4', 'sarah_williams', 'Sarah Williams', 'https://api.example.com/avatars/user4.jpg', 'Nutrition expert', 'Indonesia', 1050, 'email'),
    ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'user5@example.com', '$2a$10$hash5', 'alex_brown', 'Alex Brown', 'https://api.example.com/avatars/user5.jpg', 'Wellness coach', 'Indonesia', 650, 'email'),
    ('550e8400-e29b-41d4-a716-446655440006'::uuid, 'creator@example.com', '$2a$10$hash6', 'quiz_creator', 'Quiz Creator', 'https://api.example.com/avatars/creator.jpg', 'Professional quiz creator', 'Indonesia', 0, 'email');

-- =====================================================
-- SAMPLE QUIZ PACKAGES
-- =====================================================
INSERT INTO quiz_packages (id, title, description, category, difficulty_level, thumbnail_url, is_free, price, total_questions, duration_minutes, passing_score, max_attempts, points_per_question, created_by, is_published, published_at, total_taken, average_score)
VALUES
    ('660e8400-e29b-41d4-a716-446655440001'::uuid, 'Basic Nutrition', 'Learn the fundamentals of nutrition and healthy eating', 'Nutrition', 'easy', 'https://api.example.com/thumbnails/nutrition.jpg', true, 0, 10, 15, 60, 5, 10, '550e8400-e29b-41d4-a716-446655440006'::uuid, true, NOW(), 120, 75.5),
    ('660e8400-e29b-41d4-a716-446655440002'::uuid, 'Fitness Fundamentals', 'Master the basics of fitness and exercise', 'Fitness', 'easy', 'https://api.example.com/thumbnails/fitness.jpg', true, 0, 15, 20, 65, 3, 10, '550e8400-e29b-41d4-a716-446655440006'::uuid, true, NOW(), 95, 72.3),
    ('660e8400-e29b-41d4-a716-446655440003'::uuid, 'Advanced Nutrition Certification', 'Professional nutrition knowledge', 'Nutrition', 'hard', 'https://api.example.com/thumbnails/advanced-nutrition.jpg', false, 149000, 30, 60, 75, 2, 15, '550e8400-e29b-41d4-a716-446655440006'::uuid, true, NOW(), 45, 68.2),
    ('660e8400-e29b-41d4-a716-446655440004'::uuid, 'Personal Training Essentials', 'Comprehensive personal training course', 'Fitness', 'medium', 'https://api.example.com/thumbnails/pt-essentials.jpg', false, 199000, 25, 50, 70, 3, 15, '550e8400-e29b-41d4-a716-446655440006'::uuid, true, NOW(), 67, 71.8),
    ('660e8400-e29b-41d4-a716-446655440005'::uuid, 'Mental Health & Wellness', 'Understanding mental health and wellness', 'Wellness', 'medium', 'https://api.example.com/thumbnails/mental-health.jpg', true, 0, 12, 20, 60, 5, 10, '550e8400-e29b-41d4-a716-446655440006'::uuid, true, NOW(), 78, 73.4);

-- =====================================================
-- SAMPLE QUESTIONS
-- =====================================================
-- Questions for "Basic Nutrition" quiz
INSERT INTO questions (id, quiz_package_id, question_text, question_image_url, question_order, explanation_text, number_of_options, points)
VALUES
    ('770e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 'Which macronutrient is essential for building muscle?', 'https://api.example.com/questions/q1.jpg', 1, 'Proteins are made up of amino acids that build and repair muscle tissue.', 4, 10),
    ('770e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 'How many calories should an average adult consume per day?', NULL, 2, 'The average adult should consume around 2000-2500 calories per day, depending on activity level and metabolism.', 4, 10),
    ('770e8400-e29b-41d4-a716-446655440003'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 'What is the primary function of dietary fiber?', 'https://api.example.com/questions/q3.jpg', 3, 'Dietary fiber helps with digestion, maintains healthy cholesterol levels, and promotes a feeling of fullness.', 4, 10),
    ('770e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 'Which vitamin is important for bone health?', NULL, 4, 'Vitamin D is crucial for calcium absorption and bone health. It can be obtained from sunlight, fatty fish, and fortified dairy products.', 4, 10),
    ('770e8400-e29b-41d4-a716-446655440005'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 'What is the recommended daily water intake?', 'https://api.example.com/questions/q5.jpg', 5, 'The common recommendation is 8 glasses (about 2 liters) of water per day, though individual needs may vary.', 4, 10);

-- Questions for "Fitness Fundamentals" quiz
INSERT INTO questions (id, quiz_package_id, question_text, question_image_url, question_order, explanation_text, number_of_options, points)
VALUES
    ('770e8400-e29b-41d4-a716-446655440006'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 'What is the ideal heart rate for moderate cardio exercise?', NULL, 1, 'The target heart rate zone for moderate cardio is approximately 50-70% of your maximum heart rate (220 - your age).', 4, 10),
    ('770e8400-e29b-41d4-a716-446655440007'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 'How often should you exercise per week for health benefits?', 'https://api.example.com/questions/q7.jpg', 2, 'The WHO recommends at least 150 minutes of moderate aerobic exercise or 75 minutes of vigorous exercise per week.', 4, 10),
    ('770e8400-e29b-41d4-a716-446655440008'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 'What is the purpose of a warm-up before exercise?', NULL, 3, 'A warm-up prepares your body for exercise by increasing heart rate, circulation, and muscle temperature, reducing injury risk.', 4, 10);

-- =====================================================
-- SAMPLE OPTIONS
-- =====================================================
-- Options for question 1 (Which macronutrient...)
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440001'::uuid, '770e8400-e29b-41d4-a716-446655440001'::uuid, 'Carbohydrates', NULL, 1, false),
    ('880e8400-e29b-41d4-a716-446655440002'::uuid, '770e8400-e29b-41d4-a716-446655440001'::uuid, 'Proteins', NULL, 2, true),
    ('880e8400-e29b-41d4-a716-446655440003'::uuid, '770e8400-e29b-41d4-a716-446655440001'::uuid, 'Fats', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440004'::uuid, '770e8400-e29b-41d4-a716-446655440001'::uuid, 'Water', NULL, 4, false);

-- Options for question 2 (How many calories...)
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440005'::uuid, '770e8400-e29b-41d4-a716-446655440002'::uuid, '1000-1500', NULL, 1, false),
    ('880e8400-e29b-41d4-a716-446655440006'::uuid, '770e8400-e29b-41d4-a716-446655440002'::uuid, '2000-2500', NULL, 2, true),
    ('880e8400-e29b-41d4-a716-446655440007'::uuid, '770e8400-e29b-41d4-a716-446655440002'::uuid, '3000-3500', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440008'::uuid, '770e8400-e29b-41d4-a716-446655440002'::uuid, '4000+', NULL, 4, false);

-- Options for question 3 (What is the primary function...)
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440009'::uuid, '770e8400-e29b-41d4-a716-446655440003'::uuid, 'Provide energy', NULL, 1, false),
    ('880e8400-e29b-41d4-a716-446655440010'::uuid, '770e8400-e29b-41d4-a716-446655440003'::uuid, 'Aid in digestion and cholesterol management', NULL, 2, true),
    ('880e8400-e29b-41d4-a716-446655440011'::uuid, '770e8400-e29b-41d4-a716-446655440003'::uuid, 'Build muscle', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440012'::uuid, '770e8400-e29b-41d4-a716-446655440003'::uuid, 'Improve brain function', NULL, 4, false);

-- Options for question 4 (Which vitamin...)
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440013'::uuid, '770e8400-e29b-41d4-a716-446655440004'::uuid, 'Vitamin A', NULL, 1, false),
    ('880e8400-e29b-41d4-a716-446655440014'::uuid, '770e8400-e29b-41d4-a716-446655440004'::uuid, 'Vitamin B', NULL, 2, false),
    ('880e8400-e29b-41d4-a716-446655440015'::uuid, '770e8400-e29b-41d4-a716-446655440004'::uuid, 'Vitamin D', NULL, 3, true),
    ('880e8400-e29b-41d4-a716-446655440016'::uuid, '770e8400-e29b-41d4-a716-446655440004'::uuid, 'Vitamin C', NULL, 4, false);

-- Options for question 5 (What is the recommended...)
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440017'::uuid, '770e8400-e29b-41d4-a716-446655440005'::uuid, '2 liters (8 glasses)', NULL, 1, true),
    ('880e8400-e29b-41d4-a716-446655440018'::uuid, '770e8400-e29b-41d4-a716-446655440005'::uuid, '1 liter (4 glasses)', NULL, 2, false),
    ('880e8400-e29b-41d4-a716-446655440019'::uuid, '770e8400-e29b-41d4-a716-446655440005'::uuid, '4 liters (16 glasses)', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440020'::uuid, '770e8400-e29b-41d4-a716-446655440005'::uuid, '3 liters (12 glasses)', NULL, 4, false);

-- Options for fitness question 1
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440021'::uuid, '770e8400-e29b-41d4-a716-446655440006'::uuid, '50-70% of maximum heart rate', NULL, 1, true),
    ('880e8400-e29b-41d4-a716-446655440022'::uuid, '770e8400-e29b-41d4-a716-446655440006'::uuid, '30-50% of maximum heart rate', NULL, 2, false),
    ('880e8400-e29b-41d4-a716-446655440023'::uuid, '770e8400-e29b-41d4-a716-446655440006'::uuid, '80-100% of maximum heart rate', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440024'::uuid, '770e8400-e29b-41d4-a716-446655440006'::uuid, 'No specific range', NULL, 4, false);

-- Options for fitness question 2
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440025'::uuid, '770e8400-e29b-41d4-a716-446655440007'::uuid, '150 minutes of moderate or 75 minutes of vigorous', NULL, 1, true),
    ('880e8400-e29b-41d4-a716-446655440026'::uuid, '770e8400-e29b-41d4-a716-446655440007'::uuid, '30 minutes daily', NULL, 2, false),
    ('880e8400-e29b-41d4-a716-446655440027'::uuid, '770e8400-e29b-41d4-a716-446655440007'::uuid, 'As much as possible', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440028'::uuid, '770e8400-e29b-41d4-a716-446655440007'::uuid, 'Once a week', NULL, 4, false);

-- Options for fitness question 3
INSERT INTO options (id, question_id, option_text, option_image_url, option_order, is_correct)
VALUES
    ('880e8400-e29b-41d4-a716-446655440029'::uuid, '770e8400-e29b-41d4-a716-446655440008'::uuid, 'Increase heart rate and body temperature', NULL, 1, true),
    ('880e8400-e29b-41d4-a716-446655440030'::uuid, '770e8400-e29b-41d4-a716-446655440008'::uuid, 'Cool down muscles', NULL, 2, false),
    ('880e8400-e29b-41d4-a716-446655440031'::uuid, '770e8400-e29b-41d4-a716-446655440008'::uuid, 'Stretch muscles', NULL, 3, false),
    ('880e8400-e29b-41d4-a716-446655440032'::uuid, '770e8400-e29b-41d4-a716-446655440008'::uuid, 'Build muscle', NULL, 4, false);

-- =====================================================
-- SAMPLE USER QUIZ ATTEMPTS
-- =====================================================
INSERT INTO user_quiz_attempts (id, user_id, quiz_package_id, attempt_number, started_at, completed_at, score, total_points, percentage, is_passed, time_taken_seconds, status)
VALUES
    ('990e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '12 minutes', 85, 100, 85, true, 720, 'completed'),
    ('990e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '18 minutes', 92, 150, 92, true, 1080, 'completed'),
    ('990e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '14 minutes', 90, 100, 90, true, 840, 'completed'),
    ('990e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 1, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '20 minutes', 88, 150, 88, true, 1200, 'completed'),
    ('990e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '11 minutes', 78, 100, 78, true, 660, 'completed'),
    ('990e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '15 minutes', 95, 100, 95, true, 900, 'completed');

-- =====================================================
-- SAMPLE USER PURCHASED PACKAGES
-- =====================================================
INSERT INTO user_purchased_packages (id, user_id, quiz_package_id, purchase_date, is_active)
VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440003'::uuid, NOW() - INTERVAL '30 days', true),
    ('aa0e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440004'::uuid, NOW() - INTERVAL '15 days', true),
    ('aa0e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440004'::uuid, NOW() - INTERVAL '20 days', true),
    ('aa0e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440003'::uuid, NOW() - INTERVAL '45 days', true);

-- =====================================================
-- SAMPLE TRANSACTIONS
-- =====================================================
INSERT INTO transactions (id, user_id, quiz_package_id, amount, currency, payment_method, status, paid_at, transaction_reference)
VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440003'::uuid, 149000, 'IDR', 'dana', 'completed', NOW() - INTERVAL '30 days', 'TRX-20240101-001'),
    ('bb0e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440004'::uuid, 199000, 'IDR', 'gopay', 'completed', NOW() - INTERVAL '15 days', 'TRX-20240115-002'),
    ('bb0e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440004'::uuid, 199000, 'IDR', 'ovo', 'completed', NOW() - INTERVAL '20 days', 'TRX-20240110-003'),
    ('bb0e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440003'::uuid, 149000, 'IDR', 'linkaja', 'completed', NOW() - INTERVAL '45 days', 'TRX-20231215-004');

-- =====================================================
-- SAMPLE RANKINGS
-- =====================================================
INSERT INTO rankings (id, user_id, quiz_package_id, rank_position, total_points, total_quizzes_completed, average_score, best_score)
VALUES
    -- Global rankings
    ('cc0e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, NULL, 1, 1050, 3, 92.5, 95),
    ('cc0e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, NULL, 2, 920, 4, 85.0, 90),
    ('cc0e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, NULL, 3, 850, 2, 87.5, 92),
    ('cc0e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, NULL, 4, 780, 2, 78.0, 80),
    ('cc0e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, NULL, 5, 650, 1, 65.0, 65),
    -- Quiz-specific rankings for Basic Nutrition
    ('cc0e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 1, 95, 1, 95.0, 95),
    ('cc0e8400-e29b-41d4-a716-446655440007'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 2, 90, 1, 90.0, 90),
    ('cc0e8400-e29b-41d4-a716-446655440008'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 3, 85, 1, 85.0, 85),
    ('cc0e8400-e29b-41d4-a716-446655440009'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 4, 78, 1, 78.0, 78);

-- =====================================================
-- SAMPLE USER QUIZ ANSWERS
-- =====================================================
INSERT INTO user_quiz_answers (id, user_quiz_attempt_id, question_id, selected_option_id, is_correct, points_earned, answered_at)
VALUES
    ('dd0e8400-e29b-41d4-a716-446655440001'::uuid, '990e8400-e29b-41d4-a716-446655440001'::uuid, '770e8400-e29b-41d4-a716-446655440001'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, true, 10, NOW() - INTERVAL '5 days' + INTERVAL '1 minute'),
    ('dd0e8400-e29b-41d4-a716-446655440002'::uuid, '990e8400-e29b-41d4-a716-446655440001'::uuid, '770e8400-e29b-41d4-a716-446655440002'::uuid, '880e8400-e29b-41d4-a716-446655440006'::uuid, true, 10, NOW() - INTERVAL '5 days' + INTERVAL '2 minutes'),
    ('dd0e8400-e29b-41d4-a716-446655440003'::uuid, '990e8400-e29b-41d4-a716-446655440001'::uuid, '770e8400-e29b-41d4-a716-446655440003'::uuid, '880e8400-e29b-41d4-a716-446655440010'::uuid, true, 10, NOW() - INTERVAL '5 days' + INTERVAL '3 minutes'),
    ('dd0e8400-e29b-41d4-a716-446655440004'::uuid, '990e8400-e29b-41d4-a716-446655440001'::uuid, '770e8400-e29b-41d4-a716-446655440004'::uuid, '880e8400-e29b-41d4-a716-446655440015'::uuid, true, 10, NOW() - INTERVAL '5 days' + INTERVAL '4 minutes'),
    ('dd0e8400-e29b-41d4-a716-446655440005'::uuid, '990e8400-e29b-41d4-a716-446655440001'::uuid, '770e8400-e29b-41d4-a716-446655440005'::uuid, '880e8400-e29b-41d4-a716-446655440017'::uuid, true, 10, NOW() - INTERVAL '5 days' + INTERVAL '5 minutes'),
    ('dd0e8400-e29b-41d4-a716-446655440006'::uuid, '990e8400-e29b-41d4-a716-446655440002'::uuid, '770e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440021'::uuid, true, 10, NOW() - INTERVAL '3 days' + INTERVAL '1 minute'),
    ('dd0e8400-e29b-41d4-a716-446655440007'::uuid, '990e8400-e29b-41d4-a716-446655440002'::uuid, '770e8400-e29b-41d4-a716-446655440007'::uuid, '880e8400-e29b-41d4-a716-446655440025'::uuid, true, 10, NOW() - INTERVAL '3 days' + INTERVAL '2 minutes');

-- =====================================================
-- SAMPLE USER BADGES
-- =====================================================
INSERT INTO user_badges (id, user_id, badge_name, badge_icon_url, description, earned_at)
VALUES
    ('ee0e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Quiz Master', 'https://api.example.com/badges/master.png', 'Completed 10 quizzes', NOW() - INTERVAL '10 days'),
    ('ee0e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Perfect Score', 'https://api.example.com/badges/perfect.png', 'Scored 100% on a quiz', NOW() - INTERVAL '5 days'),
    ('ee0e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Consistent Learner', 'https://api.example.com/badges/consistent.png', 'Completed quizzes for 7 days straight', NOW() - INTERVAL '3 days'),
    ('ee0e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Early Adopter', 'https://api.example.com/badges/early.png', 'One of the first users', NOW() - INTERVAL '60 days');

-- =====================================================
-- VACUUM AND ANALYZE
-- =====================================================
VACUUM ANALYZE;

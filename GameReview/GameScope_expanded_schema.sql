-- ============================================================
-- GameScope - Steam Game Review Database
-- MySQL 8.0+ schema
--
-- Based on the current Python pipeline:
--   SteamGameReviewer.py
--       -> steam_reviews_<app_id>.csv
--   filter_reviews.py
--       -> steam_reviews_filtered_<app_id>.csv
--   csv_to_mysql.py
--       -> MySQL
--
-- IMPORTANT:
-- The current csv_to_mysql.py creates one table per game.
-- This schema intentionally uses ONE normalized reviews table
-- related to ONE games table instead.
--
-- MySQL 8.0+
-- ============================================================


-- ============================================================
-- 1. DATABASE
-- ============================================================

CREATE DATABASE IF NOT EXISTS game_reviews
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE game_reviews;


-- ============================================================
-- 2. GAMES
-- ============================================================
-- One row per Steam game.
--
-- The current Python collector already provides:
--   app_id
--   game_name
--
-- The remaining columns are optional game metadata and can
-- be populated later if needed.

CREATE TABLE IF NOT EXISTS games (
    game_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    app_id INT UNSIGNED NOT NULL,
    game_name VARCHAR(255) NOT NULL,

    -- Optional metadata for future expansion
    game_description TEXT,
    developer VARCHAR(255),
    publisher VARCHAR(255),
    release_date DATE,
    price DECIMAL(10,2),
    currency CHAR(3),
    website VARCHAR(500),


    PRIMARY KEY (game_id),
    UNIQUE KEY uq_games_app_id (app_id),
    KEY idx_games_name (game_name)
) ENGINE=InnoDB;


-- ============================================================
-- 3. REVIEWS
-- ============================================================
-- One row per Steam review.
--
-- Fields directly supported by the current collector:
--   review_id
--   app_id
--   review_text
--   recommended
--   playtime_hours
--   playtime_at_review_hours
--   helpful_votes
--
-- The reviewer Steam ID is intentionally not stored.
-- The review is treated as anonymous at the database level.
--
-- game_id is the database relationship to games.
--
-- review_id remains the primary key because the collector gets
-- Steam's recommendationid and uses it to prevent duplicates.

CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(255) NOT NULL,
    game_id INT UNSIGNED NOT NULL,

    review_text TEXT,

    recommended BOOLEAN NOT NULL,

    playtime_hours DECIMAL(10,2),
    playtime_at_review_hours DECIMAL(10,2),

    helpful_votes INT UNSIGNED NOT NULL DEFAULT 0,


    PRIMARY KEY (review_id),

    CONSTRAINT fk_reviews_game
        FOREIGN KEY (game_id)
        REFERENCES games(game_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_reviews_helpful_votes
        CHECK (helpful_votes >= 0),

    CONSTRAINT chk_reviews_playtime
        CHECK (
            playtime_hours IS NULL
            OR playtime_hours >= 0
        ),

    CONSTRAINT chk_reviews_playtime_at_review
        CHECK (
            playtime_at_review_hours IS NULL
            OR playtime_at_review_hours >= 0
        ),

    KEY idx_reviews_game_id (game_id),
    KEY idx_reviews_recommended (recommended),
    KEY idx_reviews_helpful_votes (helpful_votes),
    KEY idx_reviews_game_recommended (game_id, recommended),
) ENGINE=InnoDB;


-- ============================================================
-- 4. IMPORT BATCHES
-- ============================================================
-- Keeps track of each CSV import.
--
-- This is useful because the current project has a pipeline:
-- collect -> filter -> import.
--
-- It lets you demonstrate which game was imported, how many
-- reviews were processed, and when the import happened.

CREATE TABLE IF NOT EXISTS import_batches (
    import_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    game_id INT UNSIGNED NOT NULL,

    source_filename VARCHAR(255),

    reviews_in_file INT UNSIGNED NOT NULL DEFAULT 0,
    reviews_imported INT UNSIGNED NOT NULL DEFAULT 0,
    reviews_skipped INT UNSIGNED NOT NULL DEFAULT 0,

    status ENUM('STARTED', 'COMPLETED', 'FAILED')
        NOT NULL DEFAULT 'STARTED',

    error_message TEXT,

    PRIMARY KEY (import_id),

    CONSTRAINT fk_import_batches_game
        FOREIGN KEY (game_id)
        REFERENCES games(game_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    KEY idx_import_batches_game (game_id),
    KEY idx_import_batches_status (status)
) ENGINE=InnoDB;


-- ============================================================
-- 5. REVIEW FILTER RESULTS
-- ============================================================
-- The current filter_reviews.py removes reviews but only writes
-- the reviews that pass the filter to the filtered CSV.
--
-- This table is therefore optional until the Python filter is
-- changed to save rejected reviews.
--
-- It is included so the database can eventually record:
--   empty review
--   too short
--   ascii art / symbols
--   checkbox template
--   non-latin alphabet
--   repeated words
--   duplicate
--   not english
--
-- A review that survives the filter can be recorded as PASSED.
--
-- This table does NOT require the current importer to populate it.

CREATE TABLE IF NOT EXISTS review_filter_results (
    filter_result_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    review_id VARCHAR(255) NOT NULL,

    filter_status ENUM('PASSED', 'REMOVED') NOT NULL,
    removal_reason VARCHAR(100),

    PRIMARY KEY (filter_result_id),

    CONSTRAINT fk_filter_review
        FOREIGN KEY (review_id)
        REFERENCES reviews(review_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    KEY idx_filter_review_id (review_id),
    KEY idx_filter_status (filter_status),
    KEY idx_filter_reason (removal_reason)
) ENGINE=InnoDB;


-- ============================================================
-- 6. USEFUL VIEWS
-- ============================================================

-- ------------------------------------------------------------
-- View: complete review information
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW v_review_details AS
SELECT
    r.review_id,
    g.game_id,
    g.app_id,
    g.game_name,
    r.review_text,
    r.recommended,
    r.playtime_hours,
    r.playtime_at_review_hours,
    r.helpful_votes
FROM reviews r
JOIN games g
    ON r.game_id = g.game_id;


-- ------------------------------------------------------------
-- View: review statistics for each game
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW v_game_review_statistics AS
SELECT
    g.game_id,
    g.app_id,
    g.game_name,

    COUNT(r.review_id) AS total_reviews,

    SUM(
        CASE
            WHEN r.recommended = TRUE THEN 1
            ELSE 0
        END
    ) AS recommended_reviews,

    SUM(
        CASE
            WHEN r.recommended = FALSE THEN 1
            ELSE 0
        END
    ) AS not_recommended_reviews,

    ROUND(
        AVG(
            CASE
                WHEN r.recommended = TRUE THEN 1
                ELSE 0
            END
        ) * 100,
        2
    ) AS recommendation_percentage,

    ROUND(AVG(r.playtime_hours), 2) AS average_playtime_hours,

    ROUND(
        AVG(r.playtime_at_review_hours),
        2
    ) AS average_playtime_at_review_hours,

    SUM(r.helpful_votes) AS total_helpful_votes,

    ROUND(
        AVG(r.helpful_votes),
        2
    ) AS average_helpful_votes,

    MAX(r.helpful_votes) AS most_helpful_votes

FROM games g
LEFT JOIN reviews r
    ON g.game_id = r.game_id

GROUP BY
    g.game_id,
    g.app_id,
    g.game_name;


-- ------------------------------------------------------------
-- View: positive reviews
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW v_positive_reviews AS
SELECT
    *
FROM v_review_details
WHERE recommended = TRUE;


-- ------------------------------------------------------------
-- View: negative reviews
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW v_negative_reviews AS
SELECT
    *
FROM v_review_details
WHERE recommended = FALSE;


-- ============================================================
-- 7. DATABASE VALIDATION / TEST QUERIES
-- ============================================================
-- These are intentionally commented out so running the schema
-- does not automatically dump database contents.
--
-- Uncomment these while testing.


-- Show all tables:
-- SHOW TABLES;


-- Inspect table definitions:
-- DESCRIBE games;
-- DESCRIBE reviews;
-- DESCRIBE import_batches;
-- DESCRIBE review_filter_results;


-- Show all games:
-- SELECT * FROM games;


-- Show all reviews:
-- SELECT * FROM reviews;


-- Show complete review information:
-- SELECT * FROM v_review_details
-- LIMIT 20;


-- Show statistics for every game:
-- SELECT *
-- FROM v_game_review_statistics;


-- Count reviews:
-- SELECT COUNT(*) AS total_reviews
-- FROM reviews;


-- Count games:
-- SELECT COUNT(*) AS total_games
-- FROM games;


-- Find recommended reviews:
-- SELECT
--     game_name,
--     review_text,
--     helpful_votes
-- FROM v_positive_reviews
-- ORDER BY helpful_votes DESC;


-- Find non-recommended reviews:
-- SELECT
--     game_name,
--     review_text,
--     helpful_votes
-- FROM v_negative_reviews
-- ORDER BY helpful_votes DESC;


-- Find the most helpful reviews:
-- SELECT
--     game_name,
--     review_text,
--     recommended,
--     helpful_votes
-- FROM v_review_details
-- ORDER BY helpful_votes DESC
-- LIMIT 20;


-- Find reviews from players with the highest playtime:
-- SELECT
--     game_name,
--     playtime_hours,
--     recommended,
--     review_text
-- FROM v_review_details
-- WHERE playtime_hours IS NOT NULL
-- ORDER BY playtime_hours DESC
-- LIMIT 20;


-- Compare recommendation percentages:
-- SELECT
--     game_name,
--     total_reviews,
--     recommended_reviews,
--     not_recommended_reviews,
--     recommendation_percentage
-- FROM v_game_review_statistics
-- WHERE total_reviews > 0
-- ORDER BY recommendation_percentage DESC;


-- ============================================================
-- 8. DATA INTEGRITY TESTS
-- ============================================================
-- These queries help verify that the database is behaving
-- correctly after importing data.


-- Reviews without a valid game relationship:
-- This should return ZERO rows.
--
-- SELECT r.review_id
-- FROM reviews r
-- LEFT JOIN games g
--     ON r.game_id = g.game_id
-- WHERE g.game_id IS NULL;


-- Duplicate review IDs:
-- This should return ZERO rows.
--
-- SELECT
--     review_id,
--     COUNT(*) AS occurrences
-- FROM reviews
-- GROUP BY review_id
-- HAVING COUNT(*) > 1;


-- Reviews with invalid negative playtime:
-- This should return ZERO rows.
--
-- SELECT *
-- FROM reviews
-- WHERE playtime_hours < 0
--    OR playtime_at_review_hours < 0;


-- Reviews with invalid negative helpful votes:
-- This should return ZERO rows.
--
-- SELECT *
-- FROM reviews
-- WHERE helpful_votes < 0;


-- Games with no reviews:
-- Useful for identifying games that have been added but
-- have not yet had reviews imported.
--
-- SELECT
--     g.game_id,
--     g.app_id,
--     g.game_name
-- FROM games g
-- LEFT JOIN reviews r
--     ON g.game_id = r.game_id
-- WHERE r.review_id IS NULL;


-- ============================================================
-- END OF SCHEMA
-- ============================================================

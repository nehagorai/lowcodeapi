-- =====================================================
-- LowCodeAPI Seed Database Migration
-- =====================================================
-- This file creates a complete seed database with all tables
-- Created: 2024-12-19
-- Purpose: Initialize a fresh database for development/testing
-- =====================================================

-- Set MySQL configuration
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET TIME_ZONE = "+00:00";

-- =====================================================
-- 1. CORE TABLES (Base structure)
-- =====================================================

-- Providers table
CREATE TABLE IF NOT EXISTS `providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(50) DEFAULT NULL,
  `provider_identifier` varchar(50) NOT NULL,
  `provider_name` varchar(50) NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `auth_type` varchar(20) DEFAULT NULL,
  `auth_config` json DEFAULT NULL,
  `fields` json DEFAULT NULL,
  `presets` json DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  `hidden` tinyint NOT NULL DEFAULT '0',
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ref_idx` (`ref_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Users table (includes all columns from base + migrations)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(255) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `avatars` json DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `user_token` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `service_limit` int DEFAULT '2',
  `cache_duration` int DEFAULT '120',
  `full_access` tinyint(1) NOT NULL DEFAULT '0',
  `billing_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `country_code` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `extra` json DEFAULT NULL,
  `export_user` tinyint(1) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `login_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `ref_idx` (`ref_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 2. LOGGING AND MONITORING TABLES
-- =====================================================

-- Log request table (referenced in migrations but not in base)
CREATE TABLE IF NOT EXISTS `log_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(50) NOT NULL,
  `user_ref_id` varchar(50) DEFAULT NULL,
  `provider` varchar(25) DEFAULT NULL,
  `method` varchar(10) NOT NULL,
  `intent` varchar(255) NOT NULL,
  `path` varchar(500) NOT NULL,
  `payload` JSON NOT NULL,
  `api_endpoint` TEXT NOT NULL,
  `response` JSON NOT NULL,
  `trace` varchar(255) DEFAULT NULL,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `client_ip` varchar(255) NOT NULL,
  `client_headers` JSON NOT NULL,
  `response_headers` JSON NOT NULL,
  `is_error` BOOLEAN DEFAULT FALSE,
  `error` JSON DEFAULT NULL,
  `via_provider` VARCHAR(25) DEFAULT NULL,
  `service_type` VARCHAR(25) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ref_idx` (`ref_id`) USING BTREE,
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE,
  KEY `provider_idx` (`provider`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 3. PROVIDER AUTHENTICATION TABLES
-- =====================================================

-- Provider credentials and tokens
CREATE TABLE IF NOT EXISTS `providers_credential_and_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `provider` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `auth_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `config` json DEFAULT NULL,
  `provider_data` json DEFAULT NULL,
  `credentials` json DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `descriptions` text,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `provider_error` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE,
  KEY `provider_idx` (`provider`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Provider OAuth credentials
CREATE TABLE IF NOT EXISTS `providers_oauth_credentials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `provider` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `auth_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `credentials` json DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `descriptions` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE,
  KEY `provider_idx` (`provider`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 4. USER MANAGEMENT TABLES
-- =====================================================

-- Users activated providers
CREATE TABLE IF NOT EXISTS `users_activated_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_ref_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `provider_ref_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ref_idx` (`ref_id`) USING BTREE,
  KEY `provider_ref_id` (`provider_ref_id`),
  KEY `user_ref_id` (`user_ref_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Users API tokens
CREATE TABLE IF NOT EXISTS `users_api_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_ref_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `api_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `api_token_credits` int DEFAULT '500',
  `api_credit_consumed` int DEFAULT '0',
  `last_used` datetime DEFAULT NULL,
  `api_token_expiry` int DEFAULT '90',
  `api_token_config` json DEFAULT NULL,
  `remark` text,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ref_idx` (`ref_id`) USING BTREE,
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 5. USER INTENT AND CONFIGURATION TABLES
-- =====================================================

-- Users providers saved intents
CREATE TABLE IF NOT EXISTS `users_providers_saved_intents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref_id` varchar(50) NOT NULL,
  `provider` varchar(25) NOT NULL,
  `method` varchar(10) NOT NULL,
  `intent` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `saved_mode` varchar(10) NOT NULL DEFAULT "fav",
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_saved_intent_idx` (`intent`) USING BTREE,
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE,
  KEY `provider_idx` (`provider`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Users providers intent hydration
CREATE TABLE IF NOT EXISTS `users_providers_intent_hydration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `provider` varchar(25) NOT NULL,
  `method` varchar(10) NOT NULL,
  `intent` varchar(255) NOT NULL,
  `body` json,
  `query_params` json,
  `path_params` json,
  `headers` json,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_providers_intent_hydration_idx` (`intent`) USING BTREE,
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE,
  KEY `provider_idx` (`provider`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Users unified config
CREATE TABLE IF NOT EXISTS `users_unified_config` (
  `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `ref_id` VARCHAR(255),
  `user_ref_id` VARCHAR(255) NOT NULL,
  `unified_type` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255),
  `json_config` JSON,
  `remark` TEXT,
  `active` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `ref_idx` (`ref_id`) USING BTREE,
  KEY `user_ref_idx` (`user_ref_id`) USING BTREE,
  KEY `unified_type_idx` (`unified_type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add unique constraint for users unified config
ALTER TABLE `users_unified_config` ADD CONSTRAINT `fk_users_unified_config_idx` UNIQUE (`user_ref_id`, `unified_type`);

-- =====================================================
-- 6. PROVIDER INTENT SYSTEM TABLES
-- =====================================================

-- Providers intents
CREATE TABLE IF NOT EXISTS `providers_intents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(50) NOT NULL,
  `provider_id` varchar(50) DEFAULT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `provider_intent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `provider_alias_intent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `category` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `type` varchar(10) DEFAULT NULL,
  `request_type` varchar(25) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `params` json DEFAULT NULL,
  `path_params` json DEFAULT NULL,
  `body` json DEFAULT NULL,
  `custom_headers` json DEFAULT NULL,
  `domain_params` json DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `auth` json DEFAULT NULL,
  `response_format` json DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `active` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ref_idx` (`ref_id`) USING BTREE,
  KEY `provider_id_idx` (`provider_id`) USING BTREE,
  KEY `category_idx` (`category`(50)) USING BTREE,
  KEY `method_idx` (`method`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Providers intent default payloads
CREATE TABLE IF NOT EXISTS `providers_intent_default_payloads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` varchar(50) NOT NULL,
  `intent_ref_id` varchar(50) DEFAULT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `method` varchar(10) DEFAULT NULL,
  `query_params` json DEFAULT NULL,
  `path_params` json DEFAULT NULL,
  `body` json DEFAULT NULL,
  `custom_headers` json DEFAULT NULL,
  `response_format` json DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `active` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ref_idx` (`ref_id`) USING BTREE,
  KEY `intent_ref_idx` (`intent_ref_id`) USING BTREE,
  KEY `method_idx` (`method`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 7. SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample provider
INSERT INTO `providers` (`ref_id`, `provider_identifier`, `provider_name`, `category`, `auth_type`, `active`, `hidden`) VALUES
('prov_001', 'google', 'Google', 'productivity', 'oauth2', 1, 0),
('prov_002', 'slack', 'Slack', 'communication', 'oauth2', 1, 0),
('prov_003', 'trello', 'Trello', 'project_management', 'oauth2', 1, 0);

-- Insert sample user
INSERT INTO `users` (`ref_id`, `email`, `username`, `first_name`, `last_name`, `email_verified`, `active`, `country_code`) VALUES
('user_001', 'admin@lowcodeapi.com', 'admin', 'Admin', 'User', 1, 1, 'US'),
('user_002', 'demo@lowcodeapi.com', 'demo', 'Demo', 'User', 1, 1, 'US');

-- Insert sample API token
INSERT INTO `users_api_tokens` (`ref_id`, `user_ref_id`, `api_token`, `active`) VALUES
('token_001', 'user_001', 'demo_api_token_12345', 1);

-- =====================================================
-- 8. FINAL CONFIGURATION
-- =====================================================

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;

-- Display table creation summary
SELECT 
  TABLE_NAME,
  TABLE_ROWS,
  DATA_LENGTH,
  INDEX_LENGTH
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
ORDER BY TABLE_NAME;

-- =====================================================
-- Migration completed successfully!
-- =====================================================
-- Tables created: 12
-- Users table columns: 28 (including avatars, extra, username)
-- Sample data inserted: 3 providers, 2 users, 1 API token
-- Database ready for development/testing
-- =====================================================

-- 20 Apr 2024

ALTER table log_request ADD column intent varchar(255) NOT NULL after method;
ALTER table log_request ADD column client_ip varchar(255) NOT NULL after path;

ALTER table log_request ADD column started_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP after trace;

ALTER table log_request ADD column completed_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP after started_at;

ALTER table log_request ADD column client_headers JSON NOT NULL after trace;
ALTER table log_request ADD column response_headers JSON NOT NULL after client_headers;

ALTER table log_request ADD column payload JSON NOT NULL after path;
ALTER table log_request ADD column response JSON NOT NULL after payload;
ALTER table log_request ADD column api_endpoint TEXT NOT NULL after path;

-- 

-- 18 June 2024
ALTER TABLE log_request ADD COLUMN ref_id VARCHAR(16) not NULL AFTER id;
ALTER TABLE log_request ADD COLUMN is_error BOOLEAN after response_headers;
ALTER TABLE log_request ADD COLUMN error JSON after is_error;


-- 25 June 2024

CREATE TABLE `users_providers_saved_intents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref_id` varchar(50) NOT NULL,
  `provider` varchar(25) NOT NULL,
  `method` varchar(10) NOT NULL,
  `intent` varchar(255) NOT NULL,
  `saved_mode` varchar(10) NOT NULL DEFAULT "fav",
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_saved_intent_idx` (`intent`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 26 June 2024

CREATE TABLE `users_providers_intent_hydration` (
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
  KEY `users_providers_intent_hydration_idx` (`intent`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 27 June, 2024

ALTER table log_request MODIFY COLUMN ref_id varchar(50);

-- 4 July 2024

ALTER TABLE users ADD COLUMN username VARCHAR(50) NOT NULL after avatars;

-- 5 Aug 2024

CREATE TABLE users_unified_config (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ref_id VARCHAR(255),
  user_ref_id VARCHAR(255) NOT NULL,
  unified_type VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  json_config JSON,
  remark TEXT,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users_unified_config ADD CONSTRAINT fk_users_unified_config_idx UNIQUE (user_ref_id, unified_type);

ALTER TABLE log_request ADD COLUMN via_provider VARCHAR(25) after provider;
ALTER TABLE log_request ADD COLUMN service_type VARCHAR(25) after user_ref_id;



CREATE TABLE `providers_intents` (
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
  KEY `ref_idx` (`ref_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `providers_intent_default_payloads` (
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
  KEY `ref_idx` (`ref_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
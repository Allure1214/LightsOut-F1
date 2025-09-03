-- PostgreSQL Database Setup Script for Formula 1 Website
-- Run this script in psql or pgAdmin

-- Create database
CREATE DATABASE formula1_db;

-- Create user (optional - you can use default postgres user)
CREATE USER formula1_user WITH PASSWORD 'your_secure_password';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE formula1_db TO formula1_user;

-- Connect to the database
\c formula1_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO formula1_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO formula1_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO formula1_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO formula1_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO formula1_user;

-- Show database info
SELECT current_database(), current_user;

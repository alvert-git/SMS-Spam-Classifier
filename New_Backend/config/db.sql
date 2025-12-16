CREATE TABLE users (
    -- Primary Key and Identifiers
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NULL, -- Allow NULL for users registered locally

    -- User Information
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,

    -- Authentication Details
    password_hash VARCHAR(100) NULL,    -- Allow NULL for users who sign up via Google
    auth_method VARCHAR(10) NOT NULL DEFAULT 'local', -- 'local' or 'google'
    
    -- Profile Data
    profile_picture TEXT NULL,          -- Use TEXT for storing a URL to the profile picture

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predictions (
    -- Primary Key
    id SERIAL PRIMARY KEY,

    -- Foreign Key to the users table
    user_id INT NOT NULL,
    
    -- Input Data
    message TEXT NOT NULL,              -- The original message text input by the user
    transformed TEXT NULL,              -- The preprocessed text (useful for debugging/analysis)

    -- Prediction Results
    prediction INT NOT NULL,       -- The binary prediction (0 for Ham, 1 for Spam)
    result VARCHAR(10) NOT NULL,        -- The human-readable result ('Not Spam' or 'Spam')
    
    -- Probabilities (Using JSONB for flexible, indexed storage)
    -- This stores the structured data like: {"Ham": "0.15%", "Spam": "99.85%"}
    probabilities JSONB NOT NULL,       

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    -- 1. Foreign Key Constraint
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE -- If a user is deleted, all their predictions are also deleted
);

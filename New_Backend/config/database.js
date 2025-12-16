// backend/config/database.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// The connection string from your Neon database, stored in .env
const connectionString = process.env.DATABASE_URL; 

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set. Please create a .env file.');
}

// Create a new Pool instance.
// The connectionString handles host, user, password, and database.
const pool = new Pool({
    connectionString: connectionString,
    // Add SSL configuration for cloud databases like Neon, if necessary
    ssl: {
        rejectUnauthorized: false // Often required for development/testing with Neon
    }
});

// Simple utility function for querying
const query = (text, params) => {
    return pool.query(text, params);
};

// Test connection on server start
pool.on('connect', () => {
    console.log('PostgreSQL client connected successfully!');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});


module.exports = {
    query,
    pool
};
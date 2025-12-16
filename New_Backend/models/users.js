// backend/models/users.js
const { query } = require('../config/database');

/**
 * Creates a new user in the database for local registration.
 * @param {string} name
 * @param {string} email
 * @param {string} password_hash
 * @returns {object} The inserted user's ID.
 */
async function createLocalUser(name, email, password_hash) {
    const sql = `
        INSERT INTO users (name, email, password_hash, auth_method)
        VALUES ($1, $2, $3, 'local')
        RETURNING id;
    `;
    
    try {
        const result = await query(sql, [name, email, password_hash]);
        
        return { 
            success: true, 
            insertId: result.rows[0].id
        };
        
    } catch (error) {
        if (error.code === '23505') {
            throw new Error("Duplicate email.");
        }
        console.error("Error creating local user:", error);
        throw new Error("Database error during user creation.");
    }
}

/**
 * Finds a user by their email, including auth-specific fields.
 * @param {string} email
 * @returns {object|undefined} The user object or undefined.
 */
async function findUserByEmail(email){
    // Selecting all relevant fields for login/validation
    const sql = `
        SELECT 
            id, name, email, password_hash, google_id, profile_picture, auth_method, created_at, updated_at
        FROM users 
        WHERE email = $1;
    `;

    const result = await query(sql, [email]);
    return result.rows[0];
}

/**
 * Finds a user by their ID.
 * @param {number} id
 * @returns {object|undefined} The user object or undefined.
 */
async function findUserById(id){
    const sql = `
        SELECT id, name, email, google_id, profile_picture, auth_method, created_at, updated_at 
        FROM users 
        WHERE id = $1;
    `;

    const result = await query(sql, [id]);
    return result.rows[0];
}

module.exports = { createLocalUser, findUserByEmail, findUserById }; // Note: renamed createUser
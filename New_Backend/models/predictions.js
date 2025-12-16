// backend/models/predictions.js
const { query } = require('../config/database');

/**
 * Inserts a new spam prediction record into the database.
 * @param {number} userId - The ID of the user who made the prediction.
 * @param {object} data - The prediction data from the Flask API.
 * @returns {object} The newly created prediction record (including DB ID and created_at).
 */
async function createPrediction(userId, data) {
    const { 
        message, 
        prediction, 
        probabilities, 
        result, // <-- Keep this name for the spam check result
        transformed 
    } = data;

    const sql = `
        INSERT INTO predictions (user_id, message, prediction, probabilities, result, transformed)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, created_at;
    `;
    
    try {
        // RENAME the database result variable to avoid conflict
        const dbResult = await query(sql, [
            userId,
            message,
            prediction,
            probabilities,
            result, // <-- This now correctly refers to the destructured variable
            transformed
        ]);
        
        // Use the new variable name here
        return dbResult.rows[0]; 
        
    } catch (error) {
        console.error("Database error during prediction creation:", error);
        throw new Error("Failed to save prediction to the database.");
    }
}

/**
 * Retrieves all prediction records for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Array<object>} A list of prediction records.
 */
async function getPredictionsByUserId(userId) {
    const sql = `
        SELECT id, message, prediction, result, created_at
        FROM predictions
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;
    
    const result = await query(sql, [userId]);
    return result.rows;
}

/**
 * Retrieves a single prediction record by its ID, ensuring it belongs to the user.
 * @param {number} predictionId - The ID of the prediction record.
 * @param {number} userId - The ID of the user.
 * @returns {object|undefined} The prediction object or undefined.
 */
async function getPredictionById(predictionId, userId) {
    const sql = `
        SELECT id, message, prediction, probabilities, result, transformed, created_at
        FROM predictions
        WHERE id = $1 AND user_id = $2;
    `;
    
    const result = await query(sql, [predictionId, userId]);
    return result.rows[0];
}

/**
 * Deletes a prediction record by its ID, ensuring it belongs to the user.
 * @param {number} predictionId - The ID of the prediction record.
 * @param {number} userId - The ID of the user.
 * @returns {number} The number of rows deleted (0 or 1).
 */
async function deletePrediction(predictionId, userId) {
    const sql = `
        DELETE FROM predictions
        WHERE id = $1 AND user_id = $2
        RETURNING id;
    `;
    
    const result = await query(sql, [predictionId, userId]);
    return result.rowCount;
}
async function totalMessageScanned(userID) {
    const sql = `SELECT COUNT(*) FROM predictions WHERE user_id = $1`;
    const result = await query(sql, [userID]);
    // PostgreSQL count returns a string, so we convert it to a number
    return parseInt(result.rows[0].count, 10); 
}

/**
 * Retrieves the count of messages classified as Spam for a user.
 */
async function spamCount(userID) {
    const sql = `SELECT COUNT(*) FROM predictions WHERE user_id = $1 AND result = 'Spam'`;
    const result = await query(sql, [userID]);
    return parseInt(result.rows[0].count, 10);
}

/**
 * Retrieves the count of messages classified as Ham for a user.
 */
async function hamCount(userID) {
    const sql = `SELECT COUNT(*) FROM predictions WHERE user_id = $1 AND result = 'Not Spam'`;
    const result = await query(sql, [userID]);
    return parseInt(result.rows[0].count, 10);
}


module.exports = {
    createPrediction,
    getPredictionsByUserId,
    getPredictionById,
    deletePrediction,
    totalMessageScanned,
    spamCount, // <-- Export new functions
    hamCount   // <-- Export new functions
};
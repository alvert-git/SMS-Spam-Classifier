// spamRoutes.js (FINAL VERSION)

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authmiddleware");
const axios = require('axios');
const predictionModel = require('../models/predictions'); // <--- Import the new model

// --- 1. POST / (Create and Save Prediction) ---
router.post('/', protect, async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id; // Assuming protect middleware attaches user

    if (!message) {
        return res.status(400).json({ error: "Message content is required for prediction." });
    }
    const API_URL = `${process.env.NEXT_NEXT_FLASK_URL}/predict`
    // 'http://127.0.0.1:5000/predict'
    try {
        // Call the Flask API
        const flaskResponse = await axios.post(API_URL, { message });
        const predictionData = flaskResponse.data;

        // Save the prediction to the database using the model function
        const dbResult = await predictionModel.createPrediction(userId, predictionData);

        // Combine the prediction data with the newly created DB record info
        const responsePayload = {
            ...predictionData,
            id: dbResult.id,
            created_at: dbResult.created_at,
        };

        res.status(201).json(responsePayload); 

    } catch (error) {
        // Handle errors (Flask API errors, network errors, or database errors)
        if (error.response) {
            console.error(`Flask API Error (${error.response.status}):`, error.response.data);
            return res.status(502).json({ 
                error: "Failed to get a valid response from the Spam Classifier API.",
                details: error.response.data
            });
        } else if (error.request) {
            console.error("Network Error: Flask server is unreachable.", error.message);
            return res.status(503).json({ 
                error: "Spam Classifier API is currently unavailable.",
                details: error.message
            });
        } else {
            // This catches the custom error thrown by predictionModel.createPrediction
            console.error("Processing Error:", error.message);
            res.status(500).json({ 
                error: "An internal server error occurred while processing the request.",
                details: error.message
            });
        }
    }
});

// --- 2. GET / (Read All Predictions for User) ---
router.get('/', protect, async (req, res) => {
    const userId = req.user.id;

    try {
        const predictions = await predictionModel.getPredictionsByUserId(userId);
        res.status(200).json(predictions);
    } catch (error) {
        console.error("Error fetching predictions:", error);
        res.status(500).json({ error: "Failed to retrieve predictions." });
    }
});

router.get('/stats', protect, async (req, res) => {
    // 1. Get the userId from the protected route middleware
    const userId = req.user.id; 
    
    try {
        // 2. Fetch all three counts concurrently for efficiency
        const [total, spam, ham] = await Promise.all([
            predictionModel.totalMessageScanned(userId),
            predictionModel.spamCount(userId),
            predictionModel.hamCount(userId)
        ]);

        // 3. Send the response in the structured format the frontend expects
        res.json({
            total_scanned: total,
            spam_detected: spam,
            ham_detected: ham,
        });

    } catch (error) {
        console.error("Error getting message statistics:", error);
        res.status(500).json({ error: "Failed to retrieve dashboard statistics." });
    }
});

// --- 3. GET /:id (Read Single Prediction by ID) ---
router.get('/:id', protect, async (req, res) => {
    const userId = req.user.id;
    const predictionId = req.params.id;

    try {
        const prediction = await predictionModel.getPredictionById(predictionId, userId);

        if (!prediction) {
            return res.status(404).json({ error: "Prediction not found or unauthorized." });
        }
        
        res.status(200).json(prediction);
    } catch (error) {
        console.error("Error fetching single prediction:", error);
        res.status(500).json({ error: "Failed to retrieve prediction." });
    }
});

// --- 4. DELETE /:id (Delete a Prediction) ---
router.delete('/:id', protect, async (req, res) => {
    const userId = req.user.id;
    const predictionId = req.params.id;

    try {
        const rowCount = await predictionModel.deletePrediction(predictionId, userId);

        if (rowCount === 0) {
            return res.status(404).json({ error: "Prediction not found or unauthorized to delete." });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting prediction:", error);
        res.status(500).json({ error: "Failed to delete prediction." });
    }
});



module.exports = router;

// backend/routes/authRoute.js
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    findUserByEmail,
    createLocalUser,
    findUserById,
} = require("../models/users"); // Adjusted path assuming you use a models folder

dotenv.config();

const saltRounds = 10;

// --- REGISTRATION ---
router.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        // 1. Check if user exists (PostgreSQL unique violation handles this too, but this gives a cleaner message)
        const userExists = await findUserByEmail(email);

        if (userExists) {
            return res.status(409).json({ // Use 409 Conflict for resource conflict
                message: "User already exists"
            });
        }

        // 2. Hash Password and Create User
        const password_hash = await bcrypt.hash(password, saltRounds);
    const userIdResult = await createLocalUser(name, email, password_hash);

        // 3. Retrieve the full user object (excluding the hash)
        const user = await findUserById(userIdResult.insertId);

        // 4. Create and Sign JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'1d'}, (err, token) => {
            if (err) throw err;

            res.status(201).json({
                message: "User registered successfully",
                user,
                token: token,
            });
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find User (this now includes password_hash)
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }
        
        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        // 3. Create and Sign JWT (exclude password_hash from the token payload)
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                
                // 4. Send Response
                // Create a secure response object without the password hash
                const responseUser = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
                
                res.json({
                    message: "Login successful",
                    token: token,
                    user: responseUser
                });
            }
        );

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
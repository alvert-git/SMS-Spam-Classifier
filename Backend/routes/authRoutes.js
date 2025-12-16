// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT signing
// 1. Import the Prisma client instance
const prisma = require('../lib/prisma'); 

// Ensure you have a JWT_SECRET defined in your .env file

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.User_Spam.findUnique({
            where: {
                email: email, // Find user by unique 'email' field
            },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await prisma.User_Spam.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword, // Save the HASHED password
                authMethods: 'local', // Must match one of the values in your AuthMethod enum
            },
            // Select only the fields you want returned to the application
            select: {
                id: true,
                name: true,
                email: true,
                // Do NOT select the password hash
            }
        });

        // --- 4. Generate JWT Token ---
        // Assuming your JWT payload uses the user's 'id' (which is now 'Int' in PostgreSQL)
        const payload = {
            user_payload: {
                id: newUser.id
            }
        };
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                // Handle JWT signing error
                console.error("JWT Sign Error:", err);
                return res.status(500).send("Token generation error");
            }
            
            // --- 5. Send successful response ---
            res.status(201).json({
                user: newUser, // newUser already contains the selected fields (id, name, email)
                token,
                message: "User Registered Successfully"
            });
        });

    } catch (error) {
        console.log("Error in registering: " + error.message);
        // Log the full error object for debugging, but send a generic message to the client
        res.status(500).send("Server error during registration");
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // --- 1. Find the user by email, and crucially, SELECT the password hash ---
        const user = await prisma.User_Spam.findUnique({
            where: {
                email: email,
            },
            // We need the password hash for comparison, so we explicitly select it.
            // We also select other fields needed for the response.
            select: {
                id: true,
                name: true,
                email: true,
                password: true, // IMPORTANT: Select the hashed password
                // Assuming you have a 'role' field in your model:
                // role: true, 
            }
        });

        // --- 2. Check if user exists ---
        if (!user) {
            // Use a generic message for security (don't reveal if email or password was wrong)
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- 3. Compare the provided password with the stored hash ---
        // Note: The stored hash is in user.password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- 4. Prepare the response user object (without the password hash) ---
        // Destructure to separate the password from the rest of the user data
        const { password: _, ...userWithoutPassword } = user;
        
        // --- 5. Generate JWT Token ---
        const payload = {
            user_payload: {
                id: user.id,
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error("JWT Sign Error:", err);
                return res.status(500).send("Token generation error");
            }

            // --- 6. Send successful response ---
            res.status(201).json({
                user: userWithoutPassword, // Send the user object without the hash
                token,
                message: "User LoggedIn Successfully"
            });
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Server error");
    }
});
// Don't forget to export the router!
module.exports = router;

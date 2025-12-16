// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode"

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Custom Hook to consume the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Optional: for initial load check

    // Initial check (Runs once on mount)
    useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp > currentTime) {
                // FIX: Assuming your JWT token's payload contains a 'user' object 
                // or the top-level claims are the user data. Adjust accordingly.
                // Example: If token payload is { exp: ..., iat: ..., user: { id, name, ... } }
                setIsAuthenticated(true);
                setUser(decoded.user); // <--- Ensure this is the actual user object
            } else {
                localStorage.removeItem('auth-token');
            }
        } catch (error) {
            localStorage.removeItem('auth-token');
            console.error("Token decoding failed:", error); // Added logging
        }
    }
    setLoading(false);
}, []);

    // --- State Management Functions ---

    // Function to handle successful login
    const login = (token, userData) => {
    localStorage.setItem('auth-token', token);
    setIsAuthenticated(true);
    setUser(userData); 
};

    // Function to handle logout (The one you need!)
    const logout = () => {
        localStorage.removeItem('auth-token');
        setIsAuthenticated(false);
        setUser(null);
        // No need to navigate here, let the component that calls logout handle navigation
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login, // Expose login function
        logout, // Expose logout function
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Optional: Render a loading screen while checking the token */}
            {loading ? <div>Loading Authentication...</div> : children}
        </AuthContext.Provider>
    );
};

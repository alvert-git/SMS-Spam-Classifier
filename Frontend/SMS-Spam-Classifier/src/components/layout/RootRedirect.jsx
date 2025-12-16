// src/components/common/RootRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import Home from '../../pages/Home'; // Adjust path as needed

const RootRedirect = () => {
    const { isAuthenticated, loading } = useAuth();

    // 1. Show a loading state while the token is being checked
    if (loading) {
        // This will display the "Loading Authentication..." from your AuthProvider
        return null; 
    }

    // 2. If authenticated, redirect to the Dashboard
    if (isAuthenticated) {
        // Use Navigate to force a redirect
        return <Navigate to="/dashboard" replace />;
    }

    // 3. If not authenticated, render the Home page
    return <Home />;
};

export default RootRedirect;

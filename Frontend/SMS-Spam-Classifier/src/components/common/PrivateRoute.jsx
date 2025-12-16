// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
// NOTE: You might need to adjust the path to useAuth based on your project structure

/**
 * A wrapper component that checks authentication status.
 * If authenticated, it renders the child route via <Outlet />.
 * If not authenticated, it redirects to the login page.
 */
const PrivateRoute = () => {
    // 1. Check authentication status
    const { isAuthenticated } = useAuth();

    // 2. Decide what to render
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
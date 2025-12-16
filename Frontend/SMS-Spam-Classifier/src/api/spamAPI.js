// src/api/spamApi.js

// Use a base URL for cleaner code. Replace with your actual environment variable access.
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Calls the backend API to check a message for spam and saves the result.
 * @param {string} message - The message text to analyze.
 * @returns {Promise<object>} The prediction result object.
 */
export async function checkMessage(message) {
    const token = localStorage.getItem('auth-token'); // Assuming you store your JWT token here

    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    const response = await fetch(`${BASE_URL}/api/checkmessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Send the token in the Authorization header for the 'protect' middleware
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ message }),
    });

    // Check for HTTP errors (4xx or 5xx)
    if (!response.ok) {
        const errorData = await response.json();
        // Throw an error with the detailed message from the backend
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetches all recent scan history for the logged-in user.
 * @returns {Promise<Array<object>>} A list of recent scan objects.
 */
export async function getRecentScans() {
    const token = localStorage.getItem('auth-token');

    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    const response = await fetch(`${BASE_URL}/api/checkmessage`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}


export async function deleteScan(scanId) {
    const token = localStorage.getItem('auth-token');
    const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Assuming BASE_URL is defined

    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    const response = await fetch(`${BASE_URL}/api/checkmessage/${scanId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    // The backend returns 204 No Content on successful delete
    if (response.status === 204) {
        return; // Success
    }
    
    // Handle other errors (404, 500, etc.)
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
}

export async function getDashboardMetrics() {
    const token = localStorage.getItem('auth-token'); // Assuming you use 'auth-token'
    const BASE_URL = import.meta.env.VITE_BACKEND_URL; 

    if (!token) {
        // Return default/zero metrics if not logged in, or throw an error
        return { total_scanned: 0, spam_detected: 0, ham_detected: 0 };
    }

    const response = await fetch(`${BASE_URL}/api/checkmessage/stats`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        // Handle unauthorized or server errors
        throw new Error(`Failed to fetch metrics: HTTP status ${response.status}`);
    }

    return response.json();
}
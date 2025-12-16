// src/pages/Dashboard.jsx (Updated)
import React, { useState, useEffect } from "react"; // <-- Import useEffect
import Recent_Scan from "../components/common/Recent_Scan";
import Form_Scan from "../components/common/Form_Scan";
import { getDashboardMetrics } from "../api/spamAPI"; // <-- Import API function


const Dashboard = () => {
  // State to trigger a refresh in Recent_Scan and Metrics
  const [refreshKey, setRefreshKey] = useState(0); 
  
  // State for dashboard metrics
  const [metrics, setMetrics] = useState({
    total: '...', // Use placeholder during loading
    spam: '...',
    ham: '...',
  });
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  // Function to fetch metrics
  const fetchMetrics = async () => {
    setIsMetricsLoading(true);
    setMetricsError(null);
    try {
      const data = await getDashboardMetrics();
      setMetrics({
        total: data.total_scanned.toLocaleString(), // Format numbers nicely
        spam: data.spam_detected.toLocaleString(),
        ham: data.ham_detected.toLocaleString(),
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      setMetricsError("Failed to load metrics.");
      setMetrics({ total: 'N/A', spam: 'N/A', ham: 'N/A' });
    } finally {
      setIsMetricsLoading(false);
    }
  };

  // useEffect to fetch data on mount and on refreshKey change
  useEffect(() => {
    fetchMetrics();
  }, [refreshKey]); // Re-run fetch when refreshKey changes
  

  // Function to run when Form_Scan successfully completes a scan
  const handleScanComplete = (newScanResult) => {
    // Increment the key to force Recent_Scan AND Metrics to re-fetch data
    setRefreshKey(prevKey => prevKey + 1); 
  };
  
  // Determine the value to display on the cards based on loading/error state
  const getCardValue = (key) => {
      if (isMetricsLoading) return '...';
      if (metricsError) return 'N/A';
      return metrics[key];
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Overview Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Welcome back! Here is a summary of your activity.
      </p>

      {/* Display error message if metrics failed to load */}
      {metricsError && (
          <div className="text-red-500 mb-4">{metricsError}</div>
      )}

      {/* Example Dashboard Content: Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Message Scanned" value={getCardValue('total')} />
        <Card title="Spam Detected" value={getCardValue('spam')} />
        <Card title="Ham Detected" value={getCardValue('ham')} />
      </div>

      {/* Pass the callback function to Form_Scan */}
      <Form_Scan onScanComplete={handleScanComplete} /> 

      {/* Pass the refreshKey to Recent_Scan */}
      <Recent_Scan refreshTrigger={refreshKey} /> 
    </div>
  );
};

// Simple Card Component (You can add conditional styling for loading state if you wish)
const Card = ({ title, value }) => (
  <div
    className={`p-6 rounded-xl shadow-md dark:bg-black dark:text-white bg-white text-black dark:shadow-white/30`}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium opacity-80">{title}</span>
    </div>
    <div className={`text-3xl font-bold mt-2 ${value === '...' ? 'animate-pulse' : ''}`}>{value}</div>
  </div>
);

export default Dashboard;

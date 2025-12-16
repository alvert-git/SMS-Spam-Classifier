// src/components/common/Recent_Scan.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { getRecentScans, deleteScan } from '../../api/spamAPI'; // <-- Import deleteScan
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate for View/Re-scan

// Helper functions (getBadgeClasses) remain the same

// Note: You can optionally pass a callback prop like `onScanDeleted` 
// if you need to update a parent component (like Dashboard) after a delete.
const Recent_Scan = ({ refreshTrigger }) => { 
    const [scans, setScans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to fetch data (remains the same)
    const fetchScans = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getRecentScans();
            setScans(data);
        } catch (err) {
            console.error("Failed to fetch recent scans:", err);
            setError("Failed to load history. Please ensure you are logged in.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScans();
    }, [refreshTrigger]); 
    
    // --- New Delete Handler ---
    const handleDelete = async (scanId) => {
        if (!window.confirm("Are you sure you want to delete this scan history item?")) {
            return;
        }
        
        try {
            await deleteScan(scanId);
            
            // Optimistically update the UI: remove the deleted item from the state
            setScans(prevScans => prevScans.filter(scan => scan.id !== scanId));
            
        } catch (err) {
            console.error("Error deleting scan:", err);
            alert(`Failed to delete scan: ${err.message}`);
        }
    };
    
    // --- New View/Re-scan Handler ---
     const handleView = async (scan) => {
        try {
             // Fetch the full details using GET /api/checkmessage/:id
             const token = localStorage.getItem('auth-token');
             const BASE_URL = import.meta.env.VITE_BACKEND_URL;

             const response = await fetch(`${BASE_URL}/api/checkmessage/${scan.id}`, {
                 method: 'GET',
                 headers: { 'Authorization': `Bearer ${token}` },
             });
             
             if (!response.ok) throw new Error("Failed to fetch scan details.");
             
             const fullScanDetails = await response.json();
             
             // Navigate to the Analytics page, passing the full result AND the message text
             navigate('/dashboard/analytics', { 
                 state: { 
                     scanResult: fullScanDetails,
                     // Pass the message text separately for the Form_Scan component
                     initialMessage: scan.message 
                 } 
             });
             
        } catch (error) {
            console.error("Error viewing scan:", error);
            alert("Could not retrieve full scan details for viewing.");
        }
    };


    const getBadgeClasses = (result) => {
        if (result === "Spam") {
            return {
                bg: "bg-red-100 dark:bg-red-900/40",
                text: "text-red-700 dark:text-red-300",
            };
        }
        return {
            bg: "bg-green-100 dark:bg-green-900/40",
            text: "text-green-700 dark:text-green-300",
        };
    };

    // ... (Loading/Error/Empty state checks remain the same) ...
    if (isLoading) {
        return <div className="p-6 mt-10 text-center dark:text-white">Loading recent scans...</div>;
    }

    if (error) {
        return <div className="p-6 mt-10 text-center text-red-500">{error}</div>;
    }

    if (scans.length === 0) {
        return <div className="p-6 mt-10 text-center dark:text-gray-400">No recent scans found. Start by analyzing a message!</div>;
    }

    return (
        <div className="bg-white dark:bg-black shadow-md dark:shadow-white/50 rounded-xl p-6 mt-10">
            <h2 className="text-[#111318] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Recent Scans
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {/* Table Head: ADD 'Actions' column */}
                <thead className="border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-[#616f89] dark:text-gray-400">
                      Content Snippet
                    </th>
                    <th className="p-3 text-sm font-semibold text-[#616f89] dark:text-gray-400">
                      Result
                    </th>
                    <th className="p-3 text-sm font-semibold text-[#616f89] dark:text-gray-400">
                      Date
                    </th>
                    <th className="p-3 text-sm font-semibold text-[#616f89] dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body - Dynamic Rendering */}
                <tbody>
                  {scans.map((scan, index) => {
                    const { bg, text } = getBadgeClasses(scan.result);
                    const isLastRow = index === scans.length - 1;
                    const rowClasses = isLastRow
                      ? ""
                      : "border-b border-gray-200 dark:border-gray-800";
                      
                    const dateDisplay = new Date(scan.created_at).toLocaleString(); 

                    return (
                      <tr key={scan.id} className={rowClasses}>
                        {/* Content Snippet */}
                        <td
                          className="p-3 text-sm text-[#111318] dark:text-white/90 max-w-xs truncate"
                          title={scan.message} 
                        >
                          {scan.message}
                        </td>
                        {/* Result Badge */}
                        <td className="p-3 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${bg} ${text}`}
                          >
                            {scan.result}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="p-3 text-sm text-[#616f89] dark:text-gray-400 whitespace-nowrap">
                          {dateDisplay}
                        </td>
                        
                        {/* Actions Column: NEW */}
                        <td className="p-3 text-sm whitespace-nowrap">
                          {/* View/Re-scan Button */}
                          <button 
                            onClick={() => handleView(scan)}
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium mr-3"
                            title="View full analysis in Analytics page"
                          >
                            View
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDelete(scan.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
                            title="Delete this scan history"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        </div>
    );
};

export default Recent_Scan;

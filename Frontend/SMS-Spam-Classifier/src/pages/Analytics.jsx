// src/pages/Analytics.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <-- Import useLocation
import Form_Scan from "../components/common/Form_Scan";
import Recent_Scan from "../components/common/Recent_Scan";
import PieChart from "../components/common/PieChart"; 

const CUSTOM_COLORS = {
  Spam: "#E53935", // Red
  Ham: "#43A047",  // Green
};

// Helper function to transform API result into Pie Chart data
const transformResultToChartData = (result) => {
    if (!result || !result.probabilities) return [];

    const spamProb = parseFloat(result.probabilities.Spam);
    const hamProb = parseFloat(result.probabilities.Ham);

    return [
        { label: "Ham", value: hamProb, percentage: `${hamProb.toFixed(2)}%` },
        { label: "Spam", value: spamProb, percentage: `${spamProb.toFixed(2)}%` },
    ];
};


const Analytics = () => {
  const location = useLocation();
  // Retrieve the scanResult from the navigation state
  const initialScanResult = location.state?.scanResult || null; 
  const initialMessage = location.state?.initialMessage || ""; // <-- New line

  const [currentScan, setCurrentScan] = useState(initialScanResult);
  const [chartData, setChartData] = useState(transformResultToChartData(initialScanResult));

  // If the user lands directly on the page without a scan, the chart will be empty.
  // We can provide a default message or data.
  const defaultData = [
    { label: "Ham", value: 50, percentage: "50%" },
    { label: "Spam", value: 50, percentage: "50%" }
  ];
  
  // This effect ensures the state updates if the user navigates back to Analytics
  // with new state (though the Form_Scan component already handles the navigation).
  useEffect(() => {
    if (location.state?.scanResult) {
      setCurrentScan(location.state.scanResult);
      setChartData(transformResultToChartData(location.state.scanResult));
    }
  }, [location.state]);


  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Analytics
      </h1>
      <div className="grid grid-cols-4 gap-4">
        
        {/* Left Column: Form and History */}
        <div className="col-span-3">
          {/* Keep Form_Scan here so users can perform a new scan */}
           <Form_Scan initialMessage={initialMessage} /> 
          <Recent_Scan />
        </div>
        
        {/* Right Column: Analysis Breakdown */}
        <div className="bg-white dark:bg-black shadow-md dark:shadow-white/50 rounded-xl p-6 mt-10 ">
           <h2 className="text-[#111318] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
          Analysis Breakdown
        </h2>
        
        {currentScan ? (
            <>
                {/* Display the analyzed message */}
                <div className={`p-4 rounded-lg mb-4 ${currentScan.result === 'Spam' ? 'bg-red-50 dark:bg-red-900/20 border border-red-300' : 'bg-green-50 dark:bg-green-900/20 border border-green-300'}`}>
                    <p className="mt-2 font-bold text-lg">
                        Result: <span className={currentScan.result === 'Spam' ? 'text-red-600' : 'text-green-600'}>{currentScan.result}</span>
                    </p>
                </div>
                
                {/* Chart and Legend for the CURRENT SCAN */}
                <div className="flex items-center justify-center flex-col">
                    <PieChart data={chartData} width={300} height={200} />
                    
                    <div className="flex flex-col items-start space-x-6">
                        {chartData.map((item) => (
                            <div key={item.label} className="flex items-center space-x-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: CUSTOM_COLORS[item.label] }}
                                />
                                <span className="text-base text-gray-700 dark:text-gray-300">
                                    {item.label}: 
                                    <strong className="ml-1 font-semibold">{item.percentage}</strong>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            // Default state when no scan result is passed
            <div className="text-center p-10 dark:text-gray-400">
                <p className="mt-2">Use the form on the left to analyze a message.</p>
              
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

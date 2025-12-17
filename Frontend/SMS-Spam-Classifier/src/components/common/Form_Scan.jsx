// src/components/common/Form_Scan.jsx (Updated for Navigation)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import { checkMessage } from '../../api/spamAPI'; 
import { useEffect } from 'react';

const Form_Scan = ({ initialMessage = "" }) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // <-- Initialize navigate


    useEffect(() => {
        setMessage(initialMessage);
    }, [initialMessage]);

     const handleAnalyze = async () => {
       
        if (!message.trim()) {
            setError("Please enter a message to analyze.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await checkMessage(message);
            
            // Navigate to the Analytics page, passing the new result
            // Note: We pass the *current* message text for consistency
            navigate('/dashboard/analytics', { 
                state: { 
                    scanResult: result,
                    initialMessage: message // Pass the text that was just analyzed
                } 
            });

        } catch (err) {
            console.error("Scan Error:", err);
            setError(err.message || "An unknown error occurred during scanning.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black shadow-md dark:shadow-white/50 rounded-xl p-6 mt-10 ">
            {/* ... (Header and Description) ... */}
            <h2 className="text-[#111318] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Check a Message for Spam
            </h2>
            <p className="text-[#616f89] dark:text-gray-400 text-sm mb-4">
              Paste your SMS or email content below to get an instant analysis.
            </p>

            {/* Textarea */}
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-white/5 dark:placeholder-white dark:text-white p-3 h-40 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              placeholder="Enter message text here..."
              value={message} // The value is now controlled by the state
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {/* Button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg dark:bg-white dark:text-black bg-black text-white h-10 px-5 text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Message
                </>
              )}
            </button>
          </div>
      );
};

export default Form_Scan;

// src/components/DynamicBackground.jsx

import React, { useContext } from 'react';
import { ThemeContext } from "../../context/ThemeContext"; // Assuming this path is correct


const DynamicBackground = () => {
    const { theme } = useContext(ThemeContext);

    // 1. Define the background styles based on the theme
    const backgroundStyles =
        theme === "dark"
            ? {
                // Dark Mode Background (Grid Lines)
                backgroundImage: `
                    linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
                    radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
                `,
                backgroundSize: "40px 40px, 40px 40px, 100% 100%",
            }
            : {
                // Light Mode Background (Diagonal Cross Grid)
                backgroundImage: `
                    linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
                    linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
                `,
                backgroundSize: "40px 40px",
                WebkitMaskImage:
                    "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                maskImage:
                    "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            };

    return (
        <div className="absolute inset-0 z-0" style={backgroundStyles} />
    );
};

export default DynamicBackground;

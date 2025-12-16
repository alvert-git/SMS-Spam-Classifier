import { ArrowRight } from "lucide-react";
import React, { useContext } from "react";
// 💡 Import the dynamic background component
import DynamicBackground from "../components/common/DynamicBackground";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import dark_dashboard from "/images/dark_dashboard.png"
import light_dashboard from "/images/light_dashboard.png"

// Component for the small badge at the top (Updated for theme support)
const NewPatternsBadge = () => (
  // 💡 Updated classes for dark/light mode contrast
  <div
    className="inline-flex items-center space-x-2 px-4 py-2 
                   bg-gray-100 dark:bg-gray-900 
                   rounded-full border 
                   border-gray-300 dark:border-gray-700 
                   shadow-lg text-sm 
                   text-gray-700 dark:text-gray-300 
                   transition-all duration-300 
                   hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
  >
    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
    <span>Latest Updated Modal</span>
  </div>
);

// Component for the Call-to-Action buttons (Optimized for contrast)
const CTAButton = ({ icon, title, subtitle, isPrimary = false }) => (
  <button
    className={`flex items-center p-4 rounded-xl transition-all duration-300 ease-in-out w-full max-w-xs ${
      isPrimary
        ? "bg-purple-600/10 border border-purple-500 hover:bg-purple-600/20"
        : "bg-pink-600/10 border border-pink-500 hover:bg-pink-600/20"
    } shadow-lg backdrop-blur-sm`}
  >
    <div
      className={`p-2 rounded-lg ${
        isPrimary ? "bg-purple-600" : "bg-pink-600"
      }`}
    >
      {icon}
    </div>
    <div className="ml-4 text-left">
      <p className="text-gray-900 dark:text-white font-semibold text-sm transition-colors">
        {title}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors">
        {subtitle}
      </p>
    </div>
  </button>
);

const Home = () => {
  const { theme } = useContext(ThemeContext);

  // 💡 REMOVE the local gridBackgroundStyle and the div that used it.
  // We use the separate DynamicBackground component instead.

  return (
    // 💡 Main Container: Apply default light mode BG and text, then dark: overrides
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-300">
      {/* 1. Dynamic Background Layer */}
      <DynamicBackground />

      {/* 2. Content Container */}
      <div className="relative z-10 text-center px-4 py-20 max-w-6xl mx-auto">
        {/* Top Badge */}
        <div className="mb-5">
          <NewPatternsBadge />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          {/* 💡 Theme-aware primary text */}
          <span className="block text-gray-900 dark:text-white transition-colors">
            Spam Classifier
          </span>

          {/* Sub-heading with dynamic gradient (or use theme-aware colors) */}
          <span
            className="block text-transparent bg-clip-text bg-gradient-to-r 
                           from-blue-500 to-purple-600 
                           dark:from-gray-300 dark:to-gray-500"
          >
            Email Spam Classification
          </span>
        </h1>

        {/* Subtext */}
        {/* 💡 Theme-aware subtext */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 transition-colors">
          Trained on a massive, diverse dataset, this high-accuracy classifier
          uses advanced NLP to instantly separate legitimate emails from
          malicious junk.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/login" className="w-full flex justify-center">
            <CTAButton
              icon={<ArrowRight className="w-6 h-6 text-white" />}
              title="Get Started"
              subtitle="See patterns in action"
              isPrimary={true}
            />
          </Link>
          {/* Example of a secondary button, not primary, using pink */}
          <CTAButton
            icon={<ArrowRight className="w-6 h-6 text-white" />}
            title="Read Docs"
            subtitle="Learn about the model"
            isPrimary={false}
          />
        </div>
      </div>


    <div className='w-full px-4 sm:px-8 md:px-18 py-8 md:py-10 hidden md:flex justify-center'>
                <div className='relative max-w-6xl w-full'>
                    <img 
                      src = {theme === 'dark' ? dark_dashboard : light_dashboard} 
                      alt='admin' 
                      className='w-full h-auto object-contain rounded-md'
                    />
                </div>
            </div>
    </div>
  );
};

export default Home;

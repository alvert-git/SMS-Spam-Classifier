// src/components/layout/Footer.jsx

import React from 'react';
import { Github, Linkedin, ExternalLink, Mail } from 'lucide-react';

// Define your personal links
const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/alvert-git", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/albert-belbase-a8a666281/", label: "LinkedIn" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:albertbelbase018@gmail.com", label: "Email" },
];

const portfolioLink = {
    icon: <ExternalLink className="w-5 h-5" />, 
    href: "albert.com.np", 
    text: "Visit My Portfolio",
};

const Footer = () => {
  return (
    // Base Footer Container: Full width, subtle background, transitions for theme change
    <footer className="w-full border-t 
                       border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-900 
                       py-8 sm:py-10  transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* --- 1. Highlighted Branding Statement --- */}
        <p className="text-xl sm:text-2xl font-extrabold mb-4 
                      text-gray-900 dark:text-white transition-colors duration-300">
          Designed and developed by <span className="text-purple-600 dark:text-indigo-400">Albert Belbase.</span>
        </p>
        
        {/* --- 2. Social Links and Portfolio --- */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6">
          
          {/* Social Icons Group */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                // Theme-aware icon styling with hover effect
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                {link.icon}
              </a>
            ))}
          </div>
          
          {/* Portfolio Link */}
          <a
            href={portfolioLink.href}
            target="_blank"
            rel="noopener noreferrer"
            // Theme-aware text link styling with hover
            className="flex items-center space-x-2 text-sm font-medium 
                       text-gray-600 dark:text-gray-400 
                       hover:text-purple-600 dark:hover:text-indigo-400 
                       transition-colors duration-200"
          >
            {portfolioLink.text}
            {portfolioLink.icon}
          </a>
        </div>
        
        {/* --- 3. Copyright / Small Text --- */}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} Classifier. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
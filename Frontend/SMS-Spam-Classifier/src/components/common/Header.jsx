// src/components/Header.jsx
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import { LogOut, Sun, Moon, LogIn } from "lucide-react"; 

// Import your context/hook
import { ThemeContext } from "../../context/ThemeContext"; 
import { useAuth } from '../../context/AuthContext'; // <--- Import useAuth

// Import your images
import logo from "/images/logo.png";
import logo_dark from "/images/logo_dark.png";
import default_user from "/images/default_user.png";


const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  
  // 1. Theme Context
  const { theme, setTheme } = useContext(ThemeContext);
  
  // 2. Auth Context Integration
  // Destructure the necessary state and the logout function
  const { isAuthenticated, user, logout } = useAuth(); 

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 3. Logout Handler with Confirmation
  const handleLogout = () => {
    const isConfirmed = confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      // Call the global logout function from the Context
      // This clears the token (if implemented in context) and updates isAuthenticated to false
      logout(); 
      
      // Navigate to the home page or login page after logout
      navigate("/");

      // Optional: Provide feedback
      alert("You have been successfully logged out.");
    } else {
      console.log("Logout cancelled.");
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-3">
            <img 
              className="w-10 h-10 object-contain" 
              src={theme === 'dark' ? logo : logo_dark} 
              alt="logo" 
            />
            <Link to='/'>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-wider">
              CLASSIFIER
            </h1>
            </Link>
          </div>

          {/* Actions Section (Theme Switch, Login/Profile) */}
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Login Button or Profile Picture (Conditional Rendering) */}
            {isAuthenticated ? (
              // --------------------------------------------------
              // CONDITION: User is logged in
              // --------------------------------------------------
              <div className="flex items-center space-x-3">
                {/* Profile Picture (Link to Profile Page) */}
                <Link to='/profile'>
                  <img 
                    className='w-10 h-10 rounded-full border-2 border-indigo-500 cursor-pointer object-cover' 
                    // Use user.profilePicture if available, otherwise use default_user
                    src={user?.profilePicture || default_user} 
                    alt={user?.name || "user profile"} 
                  />
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
              </div>
            ) : (
              // --------------------------------------------------
              // CONDITION: User is logged out
              // --------------------------------------------------
              <Link 
                to='/login' 
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

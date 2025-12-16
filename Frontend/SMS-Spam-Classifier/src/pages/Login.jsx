import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import { jwtDecode } from "jwt-decode";
import logo_dark from "/images/logo_dark.png";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const navigate = useNavigate();
  // Destructure the theme from the context
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Start loading

    const LOGIN_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`; 

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login Success:", data);

      let userPayload = null;
      try {
            const decoded = jwtDecode(data.token);
            // Assuming your token payload structure is { exp: ..., iat: ..., user: { id, name, ... } }
            // ADJUST: If your token directly holds user data (e.g., { id, name, ...}), use 'decoded'
            userPayload = decoded.user || decoded; // Use decoded.user if nested, otherwise use decoded itself
        } catch (decodeError) {
            console.error("Token decoding failed after login:", decodeError);
            setError("Authentication failed after successful server response.");
            setLoading(false);
            return; // Stop execution if decoding fails
        }
      login(data.token, userPayload);
      
      // 2. Navigate the user to the dashboard
      navigate('/dashboard'); // <-- This will now work!

    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

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

  // 2. Determine the main container's background color and text color class
  const mainContainerClasses =
    theme === "dark"
      ? "min-h-screen w-full bg-black relative overflow-hidden text-white"
      : "min-h-screen w-full bg-white relative text-black";

  // 3. Determine the text color for the form's labels
  const labelTextColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <div className={mainContainerClasses}>
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 z-0" style={backgroundStyles} />

      {/* Content Wrapper */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-8 md:px-20 pt-2 md:pt-5 lg:px-56 z-10">
        {/* White/Dark Box - Changed to be dynamic */}
        <div
          className={`relative w-full max-w-md md:max-w-xl rounded-md flex flex-col items-center justify-center gap-2 py-2 md:py-5 px-6 sm:px-8 md:px-12 z-10 
          ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}`}
        >
          <div className="flex items-center">
            {/* Logo changes based on theme */}
            <img
              src={theme === "dark" ? logo : logo_dark}
              alt="main logo"
              className="h-10 md:h-20 object-cover"
            />
            <span className={`font-bold text-2xl ${labelTextColor}`}>
              Classfier
            </span>
          </div>

          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-medium text-center ${labelTextColor}`}
          >
            Login to your account
          </h1>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 md:space-y-6 mt-4"
          >
            {/* Email */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 md:mb-2 ${labelTextColor}`}
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-2 md:py-3 border rounded-lg text-[#626262] outline-none transition-all
                  ${
                    theme === "dark"
                      ? "bg-[#262626] border-[#444444] focus:ring-1 focus:ring-white focus:border-transparent"
                      : "bg-white border-gray-300 focus:ring-1 focus:ring-black focus:border-transparent"
                  }`}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 md:mb-2 ${labelTextColor}`}
              >
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 md:py-3 border rounded-lg text-[#626262] outline-none transition-all
                  ${
                    theme === "dark"
                      ? "bg-[#262626] border-[#444444] focus:ring-1 focus:ring-white focus:border-transparent"
                      : "bg-white border-gray-300 focus:ring-1 focus:ring-black focus:border-transparent"
                  }`}
                required
              />
            </div>

            {/* Login Button - Changed to use form submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-9 md:h-10 w-full px-6 bg-black text-white rounded-md text-xs md:text-sm 
                                    border-[0.5px] border-[#626262] transition-all duration-200 ease-out
                                    hover:shadow-md hover:scale-[1.02] hover:cursor-pointer"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

            <Link to="/register">
              <button
                type="button"
                className={`h-9 md:h-10 w-full px-6 rounded-md text-xs md:text-sm 
                        border-[0.5px] border-[#626262] transition-all duration-200 ease-out
                        hover:shadow-md hover:scale-[1.02] hover:cursor-pointer
                        ${
                          theme === "dark"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
              >
                Don't have an account? Sign Up
              </button>
            </Link>

            {/* Divider */}
            <div className="flex items-center justify-center pt-5 space-x-2 md:space-x-4">
              <div className="flex-1 h-px bg-[#626262]"></div>
              <p className="text-xs md:text-sm text-[#626262] whitespace-nowrap">
                or continue with
              </p>
              <div className="flex-1 h-px bg-[#626262]"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              // onClick={handleGoogleLogin}
              className="h-9 md:h-10 w-full px-6 bg-black text-white rounded-md text-xs md:text-sm 
                                    border-[0.5px] border-[#626262] transition-all duration-200 ease-out
                                    hover:shadow-md hover:scale-[1.02] hover:cursor-pointer"
            >
              Login with Google
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs md:text-sm text-center text-[#626262] whitespace-nowrap mt-4">
            By logging in, you agree to our Terms of <br />
            Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

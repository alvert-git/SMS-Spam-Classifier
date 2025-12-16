import React, { useEffect, useState, useContext } from 'react';
// Assuming you have a ThemeContext and a routing library
import { ThemeContext } from '../context/ThemeContext'; 
import { Link, useNavigate } from 'react-router-dom';
import logo from "/images/logo.png";
import logo_dark from "/images/logo_dark.png";

const Register = () => {
  // 1. Get the theme from context
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate(); // Hook for navigation
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    const REGISTER_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;

    try {
        const response = await fetch(REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // The formData object already contains {name, email, password}
            body: JSON.stringify(formData) 
        });

        if (!response.ok) {
            // Read the error message provided by your backend
            const errorData = await response.json(); 
            // The backend returns { message: "User already exists" } or { message: "Internal Server Error" }
            throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Registration Success:", data);
        
        // --- SUCCESS HANDLING ---
        // 1. Store the token (e.g., in localStorage)
        localStorage.setItem('auth-token', data.token);
        
        // 2. You might want to store user data in global state/context
        // setUser(data.user); 
        
        // 3. Navigate the user to the dashboard
        navigate('/dashboard'); 

    } catch (error) {
        // CRITICAL FIX: Use the 'error' object here
        setError(error.message); 
        console.error("Registration Error:", error);
    } finally {
        setLoading(false);
    }
}

if(loading){
  return <div className={`min-h-screen flex items-center justify-center ${mainContainerClasses}`}>Loading.....</div>
}

  // --- Dynamic Theme Logic ---

  // 2. Define the background styles based on the theme
  const backgroundStyles = theme === 'dark' ? {
    // Dark Mode Background (Grid Lines)
    backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
    `,
    backgroundSize: "40px 40px, 40px 40px, 100% 100%",
  } : {
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

  // 3. Determine the main container's background color and text color class
  const mainContainerClasses = theme === 'dark' 
    ? 'min-h-screen w-full bg-black relative overflow-hidden text-white' 
    : 'min-h-screen w-full bg-white relative text-black';

  // 4. Determine the text color for general text
  const textColorClass = theme === 'dark' ? 'text-white' : 'text-black';
  const subTextColorClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBgClass = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white';
  const inputBgClass = theme === 'dark' 
    ? 'bg-[#262626] border-[#444444] focus:ring-1 focus:ring-white focus:border-transparent' 
    : 'bg-white border-gray-300 focus:ring-1 focus:ring-black focus:border-transparent';


  if(loading){
    return <div className={`min-h-screen flex items-center justify-center ${mainContainerClasses}`}>Loading.....</div>
  }

  const labelTextColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <div className={mainContainerClasses}>
      
      {/* Dynamic Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={backgroundStyles}
      />

      <div className='relative w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 md:px-20 lg:px-56 pt-1 md:pt-5 pb-10 md:pb-20'>
        
        {/* Background Image (Kept the original logic, assuming it's an overlay) */}
        <div className='absolute -bottom-40 md:-bottom-60 left-1/2 transform -translate-x-1/2 z-0 w-4/5 md:w-auto'>
          <img 
            src='/images/redellipse.png' 
            alt='background' 
            className='h-auto opacity-70 w-full max-w-2xl'
          />
        </div>

        {/* content Card - Dynamic Background and Shadow */}
        <div className={`relative h-full w-full max-w-md rounded-md flex flex-col items-center justify-center gap-6 py-12 px-6 sm:px-8 z-10 ${cardBgClass} ${theme === 'dark' ? 'shadow-lg shadow-black/50' : 'shadow-sm'}`}>
          
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
          
          <div className='text-center space-y-2'>
            <h1 className={`text-2xl md:text-3xl font-medium ${textColorClass}`}>
              Create an account
            </h1>
            <p className={`text-sm ${subTextColorClass}`}>
              Join us to get started
            </p>
          </div>

          <div className='w-full space-y-2'>
          <form onSubmit={handleSubmit} className='w-full space-y-4 md:space-y-6'>

          {/* Full Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 md:mb-2 ${textColorClass}`}>
             Full Name:
            </label>
            <input 
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Enter your Full Name'
              className={`w-full px-4 py-2 md:py-3 border rounded-lg text-[#626262] outline-none transition-all ${inputBgClass}`}
              required
            />
          </div>

          {/* email */}
          <div>
            <label className={`block text-sm font-medium mb-1 md:mb-2 ${textColorClass}`}>
              Email:
            </label>
            <input 
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Enter your email address'
              className={`w-full px-4 py-2 md:py-3 border rounded-lg text-[#626262] outline-none transition-all ${inputBgClass}`}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-1 md:mb-2 ${textColorClass}`}>
              Password:
            </label>
            <input 
              type='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Enter your password'
              className={`w-full px-4 py-2 md:py-3 border rounded-lg text-[#626262] outline-none transition-all ${inputBgClass}`}
              required
            />
          </div>
          
          {/* Display Error Message */}
          {error && (
            <p className='text-red-500 text-sm text-center'>{error}</p>
          )}

          {/* Register Button */}
          <button
            type='submit'
            className="h-9 md:h-10 w-full px-6 bg-black text-white rounded-md text-xs md:text-sm 
                      border-[0.5px] border-[#626262] transition-all duration-200 ease-out
                      hover:shadow-md hover:scale-[1.02] hover:cursor-pointer"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          </form>


             {/* Divider - Dynamic colors for dark mode */}
          <div className='flex items-center justify-center space-x-2 md:space-x-4'>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-[#444444]' : 'bg-[#626262]'}`}></div>
            <p className='text-xs md:text-sm text-[#626262] whitespace-nowrap'>or continue with</p>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-[#444444]' : 'bg-[#626262]'}`}></div>
          </div>
           
           
            {/* Google Button */}
            <button
              type='button'
              onClick={handleGoogleLogin}
              className="h-12 w-full bg-black text-white flex items-center justify-center gap-3 rounded-md border-[0.5px] border-[#626262] hover:scale-[1.02] transition shadow-md"
            >
              {/* Optional: Add a Google Icon SVG here */}
              <span>Sign up with Google</span>
            </button>
        

            {/* Divider */}
            <div className='flex items-center justify-center space-x-2'>
              <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-[#444444]' : 'bg-gray-200'}`} />
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>OR</span>
              <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-[#444444]' : 'bg-gray-200'}`} />
            </div>

            {/* Login Redirect - Using Link for proper SPA navigation */}
            <Link
              to='/login'
              className={`h-12 w-full flex items-center justify-center rounded-md border-[0.5px] transition 
                        ${theme === 'dark' 
                          ? 'bg-black text-white border-[#626262] hover:bg-[#1a1a1a]' 
                          : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                        }`}
            >
              Already have an account? Log In
            </Link>
          </div>

          <p className='text-xs text-center text-[#626262] mt-4'>
            By clicking on sign up, you agree to our Terms of <br />Service and Privacy Policy
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;

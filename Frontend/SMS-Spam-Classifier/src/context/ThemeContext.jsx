import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext()

export const ThemeProvider=({children})=>{
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
      
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        // Save the current theme preference
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    const value = {
        theme,
        setTheme,
        toggleTheme
    };
    return <ThemeContext.Provider value = {value}>
        {children}
    </ThemeContext.Provider>
}

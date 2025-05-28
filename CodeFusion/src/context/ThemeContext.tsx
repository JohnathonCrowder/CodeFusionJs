import React, { createContext, useState, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if user previously set a preference or use system preference
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        return savedTheme === 'true';
      }
    } catch (error) {
      // localStorage might not be available (e.g., in some test environments)
      console.warn('localStorage is not available:', error);
    }
    
    // Check system preference if localStorage is not available or has no saved value
    try {
      // First check if window exists (for SSR compatibility)
      if (typeof window === 'undefined') {
        return false;
      }
      
      // Then check if matchMedia is available
      if (!window.matchMedia) {
        // This explicit throw will ensure the console.warn is called
        throw new Error('matchMedia is undefined');
      }
      
      // Use matchMedia to check for dark mode preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      // matchMedia might not be available in some browsers or test environments
      console.warn('matchMedia is not available:', error);
      return false;
    }
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to html element when darkMode state changes
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch (error) {
      console.warn('Failed to save theme preference to localStorage:', error);
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
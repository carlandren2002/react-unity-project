import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

/**
 * Context to store theme state and toggler function.
 * @type {React.Context<{theme: 'light' | 'dark', toggleTheme: () => void}>}
 */
const ThemeContext = createContext();

/**
 * ThemeProvider component to provide theme context to the application.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} Theme provider wrapping children.
 */
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // Get system theme ('light' or 'dark')
  const [theme, setTheme] = useState(systemTheme); // Default theme to system preference

  useEffect(() => {
    setTheme(systemTheme); // Sync theme with system theme changes
  }, [systemTheme]);

  /**
   * Toggles theme between light and dark.
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context.
 * @returns {{theme: 'light' | 'dark', toggleTheme: () => void}} Theme context values.
 */
export const useTheme = () => useContext(ThemeContext);
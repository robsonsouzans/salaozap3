
import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface DarkModeProviderProps {
  children: React.ReactNode;
}

const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Update the class on the html element
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  return <>{children}</>;
};

export default DarkModeProvider;

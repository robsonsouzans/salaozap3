
import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface DarkModeProviderProps {
  children: React.ReactNode;
}

const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Update the class on the html element with transition
    const root = window.document.documentElement;
    
    // Add transition class first
    root.classList.add('transition-colors');
    root.style.transitionDuration = '300ms';
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Optional: Remove transition after change to prevent unwanted transitions
    const timeout = setTimeout(() => {
      root.classList.remove('transition-colors');
      root.style.transitionDuration = '';
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [theme]);
  
  return <>{children}</>;
};

export default DarkModeProvider;

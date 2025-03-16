
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Home, Calendar, User, Search, Settings, LogOut, Menu } from 'lucide-react';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Agendamentos', path: '/appointments', icon: Calendar },
    { name: 'Pesquisar', path: '/search', icon: Search },
    { name: 'Perfil', path: '/profile', icon: User },
    { name: 'Configurações', path: '/settings', icon: Settings },
  ];
  
  // Check if the current path starts with a nav item path
  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {/* Mobile menu trigger */}
      <div className="fixed top-4 left-4 md:hidden z-50">
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '240px',
          transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        className="hidden md:block fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-100 z-40 dark:bg-gray-900 dark:border-gray-800"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-gray-800">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <Logo size="medium" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {isCollapsed && <Logo size="small" withText={false} className="mx-auto" />}
            
            <button
              onClick={() => setIsCollapsed(prev => !prev)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors dark:hover:bg-gray-800 dark:text-gray-400"
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActivePath(item.path) 
                        ? 'bg-salon-50 text-salon-700 dark:bg-gray-800 dark:text-salon-400' 
                        : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      isActivePath(item.path) 
                        ? 'text-salon-500' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {isActivePath(item.path) && (
                      <motion.div
                        layoutId="sidebarIndicator"
                        className="absolute left-0 w-1 h-6 bg-salon-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            {children}
            <Link
              to="/logout"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-salon-600 dark:text-gray-300 dark:hover:text-salon-400"
            >
              <LogOut className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </motion.aside>
      
      {/* Mobile sidebar - overlay */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsCollapsed(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 md:hidden dark:bg-gray-900"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-gray-800">
                <Logo size="medium" />
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors dark:hover:bg-gray-800 dark:text-gray-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="flex-1 py-6">
                <ul className="space-y-2 px-3">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActivePath(item.path) 
                            ? 'bg-salon-50 text-salon-700 dark:bg-gray-800 dark:text-salon-400' 
                            : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300'
                        }`}
                        onClick={() => setIsCollapsed(false)}
                      >
                        <item.icon className={`h-5 w-5 mr-2 flex-shrink-0 ${
                          isActivePath(item.path) 
                            ? 'text-salon-500' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                        <span>{item.name}</span>
                        
                        {isActivePath(item.path) && (
                          <motion.div
                            layoutId="mobileSidebarIndicator"
                            className="absolute left-0 w-1 h-6 bg-salon-500 rounded-r-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                {children}
                <Link
                  to="/logout"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-salon-600 dark:text-gray-300 dark:hover:text-salon-400"
                  onClick={() => setIsCollapsed(false)}
                >
                  <LogOut className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span>Sair</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

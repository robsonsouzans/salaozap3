
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Agenda', path: '/appointments', icon: Calendar },
    { name: 'Pesquisar', path: '/search', icon: Search },
    { name: 'Perfil', path: '/profile', icon: User },
  ];
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50 dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon className={`h-5 w-5 mb-1 ${location.pathname === item.path ? 'text-salon-500' : 'text-gray-500'}`} />
            <span>{item.name}</span>
            {location.pathname === item.path && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute -top-1 w-1 h-1 rounded-full bg-salon-500"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;

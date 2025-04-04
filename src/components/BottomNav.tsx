
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Search, Menu, Store, Scissors, BarChart, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '@/lib/auth';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const isClient = user?.role === 'client';
  
  useEffect(() => {
    // Atualiza o usuário se mudar
    setUser(getCurrentUser());
  }, [location.pathname]);
  
  // Menu para clientes
  const clientNavItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Agendar', path: '/appointments/new', icon: Calendar },
    { name: 'Buscar', path: '/search', icon: Search },
    { name: 'Favoritos', path: '/favorites', icon: Heart },
    { name: 'Perfil', path: '/profile', icon: User },
  ];
  
  // Menu para proprietários de salão
  const salonNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Agenda', path: '/appointments', icon: Calendar },
    { name: 'Serviços', path: '/services', icon: Scissors },
    { name: 'Finanças', path: '/finances', icon: BarChart },
    { name: 'Perfil', path: '/profile', icon: User },
  ];
  
  const navItems = isClient ? clientNavItems : salonNavItems;
  
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
            className="flex flex-col items-center justify-center w-full h-full text-xs text-gray-500 hover:text-salon-500 dark:text-gray-400 dark:hover:text-white"
          >
            <item.icon className={`h-5 w-5 mb-1 ${location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) ? 'text-salon-500 dark:text-white' : ''}`} />
            <span className={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) ? 'text-salon-500 dark:text-white font-medium' : ''}>{item.name}</span>
            {(location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)) && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute -top-1 w-1 h-1 rounded-full bg-salon-500 dark:bg-white"
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

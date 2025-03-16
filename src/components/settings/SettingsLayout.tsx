
import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  currentTab?: string;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  children, 
  title, 
  description, 
  currentTab = "general" 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (value: string) => {
    if (value === currentTab) return;
    
    const basePath = "/settings";
    switch (value) {
      case "general":
        navigate(basePath);
        break;
      case "appearance":
        navigate(`${basePath}/appearance`);
        break;
      case "notifications":
        navigate(`${basePath}/notifications`);
        break;
      case "security":
        navigate(`${basePath}/security`);
        break;
      default:
        navigate(basePath);
    }
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <SidebarMenu />
        <div className="mt-auto mb-4 px-3">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-8 bg-gray-100 dark:bg-gray-800 p-1">
                  <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    Aparência
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    Segurança
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={currentTab}>
                  {children}
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SettingsLayout;

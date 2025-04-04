
import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs as RadixTabs } from '@radix-ui/react-tabs';
import { 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Clock, 
  CreditCard, 
  Link as LinkIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const settingsTabs = [
    { id: "general", name: "Geral", icon: Settings, path: "/settings" },
    { id: "appearance", name: "Aparência", icon: Palette, path: "/settings/appearance" },
    { id: "notifications", name: "Notificações", icon: Bell, path: "/settings/notifications" },
    { id: "security", name: "Segurança", icon: Shield, path: "/settings/security" },
    { id: "business-hours", name: "Horários", icon: Clock, path: "/settings/business-hours" },
    { id: "payment-methods", name: "Pagamentos", icon: CreditCard, path: "/settings/payment-methods" },
    { id: "integrations", name: "Integrações", icon: LinkIcon, path: "/settings/integrations" },
  ];
  
  const handleTabChange = (value: string) => {
    if (value === currentTab) return;
    
    const tab = settingsTabs.find(tab => tab.id === value);
    if (tab) {
      navigate(tab.path);
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
              {isMobile ? (
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="mb-8 bg-gray-100 dark:bg-gray-800 p-1 grid grid-cols-2 h-auto">
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
              ) : (
                <div className="flex gap-8">
                  <div className="w-64 shrink-0">
                    <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium mb-3 text-gray-500 dark:text-gray-400 text-sm">Configurações</h3>
                      <div className="space-y-1">
                        {settingsTabs.map((tab) => {
                          const isActive = tab.id === currentTab;
                          const TabIcon = tab.icon;
                          
                          return (
                            <Button 
                              key={tab.id}
                              variant={isActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start",
                                isActive ? "bg-gray-100 dark:bg-gray-700 font-medium" : ""
                              )}
                              onClick={() => navigate(tab.path)}
                            >
                              <TabIcon className="mr-2 h-4 w-4" />
                              {tab.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    {children}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SettingsLayout;

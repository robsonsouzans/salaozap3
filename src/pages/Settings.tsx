
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Clock, DollarSign, Globe, LucideIcon, 
  Moon, Paintbrush, Shield, Sun, User 
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import SidebarMenu from '@/components/SidebarMenu';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from "@/hooks/use-toast";

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-start">
        <div className="mr-4 mt-0.5 rounded-full bg-salon-50 p-2 dark:bg-gray-800">
          <Icon className="h-5 w-5 text-salon-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso"
    });
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
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                Configurações
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gerencie suas preferências e detalhes da conta
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Tabs defaultValue="general" className="w-full">
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
                
                <TabsContent value="general">
                  <Card className="border-none shadow-md dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Configurações gerais</CardTitle>
                      <CardDescription>
                        Gerencie as configurações gerais da sua conta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <SettingItem
                        icon={User}
                        title="Informações pessoais"
                        description="Atualize seus dados pessoais e informações de contato"
                      >
                        <Button variant="outline" size="sm">Editar</Button>
                      </SettingItem>
                      
                      <SettingItem
                        icon={Globe}
                        title="Idioma"
                        description="Escolha o idioma de preferência para a sua interface"
                      >
                        <select className="h-9 rounded-md px-3 py-2 border border-input bg-transparent text-sm ring-offset-background">
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </SettingItem>
                      
                      <SettingItem
                        icon={Clock}
                        title="Fuso horário"
                        description="Configure o fuso horário para os agendamentos"
                      >
                        <select className="h-9 rounded-md px-3 py-2 border border-input bg-transparent text-sm ring-offset-background">
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/Recife">Recife (GMT-3)</option>
                          <option value="America/Manaus">Manaus (GMT-4)</option>
                        </select>
                      </SettingItem>
                      
                      <SettingItem
                        icon={DollarSign}
                        title="Moeda"
                        description="Escolha a moeda para exibição de valores"
                      >
                        <select className="h-9 rounded-md px-3 py-2 border border-input bg-transparent text-sm ring-offset-background">
                          <option value="BRL">Real (R$)</option>
                          <option value="USD">Dólar (US$)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </SettingItem>
                      
                      <div className="pt-4">
                        <Button onClick={saveSettings}>Salvar alterações</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance">
                  <Card className="border-none shadow-md dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Aparência</CardTitle>
                      <CardDescription>
                        Personalize a aparência do aplicativo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <SettingItem
                        icon={Paintbrush}
                        title="Tema"
                        description="Escolha entre tema claro, escuro ou automático"
                      >
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={theme === 'light' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTheme('light')}
                            className="rounded-full w-9 h-9 p-0"
                          >
                            <Sun className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTheme('dark')}
                            className="rounded-full w-9 h-9 p-0"
                          >
                            <Moon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={theme === 'system' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTheme('system')}
                          >
                            Sistema
                          </Button>
                        </div>
                      </SettingItem>
                      
                      <div className="pt-4">
                        <Button onClick={saveSettings}>Salvar alterações</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card className="border-none shadow-md dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Notificações</CardTitle>
                      <CardDescription>
                        Configure como e quando você recebe notificações
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <SettingItem
                        icon={Bell}
                        title="Email"
                        description="Receba notificações por email sobre agendamentos e promoções"
                      >
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </SettingItem>
                      
                      <SettingItem
                        icon={Bell}
                        title="SMS"
                        description="Receba lembretes por SMS sobre seus agendamentos"
                      >
                        <Switch
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </SettingItem>
                      
                      <SettingItem
                        icon={Bell}
                        title="Push"
                        description="Receba notificações push no seu dispositivo"
                      >
                        <Switch
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </SettingItem>
                      
                      <div className="pt-4">
                        <Button onClick={saveSettings}>Salvar alterações</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="border-none shadow-md dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Segurança</CardTitle>
                      <CardDescription>
                        Gerencie as configurações de segurança da sua conta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <SettingItem
                        icon={Shield}
                        title="Senha"
                        description="Altere sua senha de acesso"
                      >
                        <Button variant="outline" size="sm">Alterar</Button>
                      </SettingItem>
                      
                      <SettingItem
                        icon={Shield}
                        title="Autenticação de dois fatores"
                        description="Adicione uma camada extra de proteção ao seu login"
                      >
                        <Button variant="outline" size="sm">Configurar</Button>
                      </SettingItem>
                      
                      <SettingItem
                        icon={Shield}
                        title="Dispositivos conectados"
                        description="Revise os dispositivos conectados à sua conta"
                      >
                        <Button variant="outline" size="sm">Visualizar</Button>
                      </SettingItem>
                      
                      <div className="pt-4">
                        <Button onClick={saveSettings}>Salvar alterações</Button>
                      </div>
                    </CardContent>
                  </Card>
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

export default Settings;

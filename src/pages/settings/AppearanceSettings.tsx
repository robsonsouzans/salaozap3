
import React from 'react';
import { Moon, Paintbrush, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from "@/hooks/use-toast";
import SettingsLayout from '@/components/settings/SettingsLayout';

interface SettingItemProps {
  icon: React.ElementType;
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

const AppearanceSettings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso"
    });
  };
  
  return (
    <SettingsLayout 
      title="Configurações" 
      description="Gerencie suas preferências e detalhes da conta"
      currentTab="appearance"
    >
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
    </SettingsLayout>
  );
};

export default AppearanceSettings;

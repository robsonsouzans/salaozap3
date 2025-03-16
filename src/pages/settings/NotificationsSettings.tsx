
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

const NotificationsSettings: React.FC = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  
  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas com sucesso"
    });
  };
  
  return (
    <SettingsLayout 
      title="Configurações" 
      description="Gerencie suas preferências e detalhes da conta"
      currentTab="notifications"
    >
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

          <SettingItem
            icon={Bell}
            title="Promoções e novidades"
            description="Receba emails sobre promoções especiais e novidades"
          >
            <Switch
              checked={promotionalEmails}
              onCheckedChange={setPromotionalEmails}
            />
          </SettingItem>
          
          <div className="pt-4">
            <Button onClick={saveSettings}>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default NotificationsSettings;

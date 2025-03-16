
import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const SecuritySettings: React.FC = () => {
  const { toast } = useToast();
  
  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de segurança foram atualizadas com sucesso"
    });
  };
  
  const showPasswordDialog = () => {
    toast({
      title: "Alteração de senha",
      description: "O diálogo de alteração de senha seria exibido aqui"
    });
  };
  
  const showTwoFactorDialog = () => {
    toast({
      title: "Autenticação de dois fatores",
      description: "O diálogo de configuração de 2FA seria exibido aqui"
    });
  };
  
  const showDevicesDialog = () => {
    toast({
      title: "Dispositivos conectados",
      description: "O diálogo de dispositivos conectados seria exibido aqui"
    });
  };
  
  return (
    <SettingsLayout 
      title="Configurações" 
      description="Gerencie suas preferências e detalhes da conta"
      currentTab="security"
    >
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
            <Button variant="outline" size="sm" onClick={showPasswordDialog}>Alterar</Button>
          </SettingItem>
          
          <SettingItem
            icon={Shield}
            title="Autenticação de dois fatores"
            description="Adicione uma camada extra de proteção ao seu login"
          >
            <Button variant="outline" size="sm" onClick={showTwoFactorDialog}>Configurar</Button>
          </SettingItem>
          
          <SettingItem
            icon={Shield}
            title="Dispositivos conectados"
            description="Revise os dispositivos conectados à sua conta"
          >
            <Button variant="outline" size="sm" onClick={showDevicesDialog}>Visualizar</Button>
          </SettingItem>
          
          <div className="pt-4">
            <Button onClick={saveSettings}>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default SecuritySettings;

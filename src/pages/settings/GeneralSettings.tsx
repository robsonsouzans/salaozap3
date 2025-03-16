
import React from 'react';
import { Clock, DollarSign, Globe, User } from 'lucide-react';
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

const GeneralSettings: React.FC = () => {
  const { toast } = useToast();
  
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
      currentTab="general"
    >
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
    </SettingsLayout>
  );
};

export default GeneralSettings;

import React from 'react';
import { Globe, Instagram, Facebook, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import SettingsLayout from '@/components/settings/SettingsLayout';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  connected?: boolean;
  onToggle?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  connected = false,
  onToggle,
  onConnect,
  onDisconnect
}) => {
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
      <div className="flex items-center space-x-3">
        {onToggle && (
          <Switch
            checked={connected}
            onCheckedChange={onToggle}
          />
        )}
        {connected ? (
          onDisconnect && (
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              Desconectar
            </Button>
          )
        ) : (
          onConnect && (
            <Button size="sm" onClick={onConnect}>
              Conectar
            </Button>
          )
        )}
      </div>
    </div>
  );
};

const IntegrationsSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [integrations, setIntegrations] = React.useState({
    instagram: { connected: true, enabled: true },
    facebook: { connected: true, enabled: true },
    google: { connected: false, enabled: false },
    whatsapp: { connected: true, enabled: true },
  });
  
  const handleToggle = (integration) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        enabled: !prev[integration].enabled
      }
    }));
  };
  
  const handleConnect = (integration) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        connected: true,
        enabled: true
      }
    }));
    
    toast({
      title: "Integração conectada",
      description: `A integração com ${getIntegrationName(integration)} foi estabelecida com sucesso.`
    });
  };
  
  const handleDisconnect = (integration) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        connected: false,
        enabled: false
      }
    }));
    
    toast({
      title: "Integração desconectada",
      description: `A integração com ${getIntegrationName(integration)} foi removida.`
    });
  };
  
  const getIntegrationName = (key) => {
    switch (key) {
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'google': return 'Google';
      case 'whatsapp': return 'WhatsApp';
      default: return key;
    }
  };
  
  const saveSettings = () => {
    toast({
      title: "Integrações atualizadas",
      description: "Suas configurações de integração foram salvas com sucesso"
    });
  };
  
  return (
    <SettingsLayout 
      title="Integrações" 
      description="Gerencie integrações com outras plataformas e serviços"
      currentTab="general"
    >
      <Card className="border-none shadow-md dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Integrações de plataformas</CardTitle>
          <CardDescription>
            Conecte seu salão a redes sociais e outras plataformas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            icon={Instagram}
            title="Instagram"
            description="Permita que os clientes vejam seu Instagram e agendem serviços diretamente de lá"
            connected={integrations.instagram.connected}
            onToggle={() => handleToggle('instagram')}
            onDisconnect={() => handleDisconnect('instagram')}
          />
          
          <SettingItem
            icon={Facebook}
            title="Facebook"
            description="Integre sua página do Facebook para ampliar a visibilidade do seu salão"
            connected={integrations.facebook.connected}
            onToggle={() => handleToggle('facebook')}
            onDisconnect={() => handleDisconnect('facebook')}
          />
          
          <SettingItem
            icon={Globe}
            title="Google Meu Negócio"
            description="Permite que clientes encontrem seu salão no Google Maps e façam agendamentos"
            connected={integrations.google.connected}
            onConnect={() => handleConnect('google')}
            onDisconnect={() => handleDisconnect('google')}
          />
          
          <SettingItem
            icon={MessageSquare}
            title="WhatsApp"
            description="Integre com WhatsApp para comunicação direta com os clientes"
            connected={integrations.whatsapp.connected}
            onToggle={() => handleToggle('whatsapp')}
            onDisconnect={() => handleDisconnect('whatsapp')}
          />
          
          <div className="pt-4">
            <Button onClick={saveSettings}>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default IntegrationsSettings;

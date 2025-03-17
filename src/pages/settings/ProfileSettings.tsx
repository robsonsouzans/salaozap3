
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };
  
  return (
    <SettingsLayout 
      title="Configurações de Perfil" 
      description="Atualize suas informações pessoais e de contato"
      currentTab="general"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="Avatar" />
                <AvatarFallback>SZ</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-medium leading-6">Foto de Perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Esta foto será exibida em seu perfil
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Alterar</Button>
                  <Button variant="outline" size="sm">Remover</Button>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 py-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue="João Silva" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="joao.silva@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" defaultValue="(11) 98765-4321" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue="Rua Exemplo, 123" />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
};

export default ProfileSettings;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Star, Edit, Camera, 
  Calendar, LogOut, Lock, CreditCard, Heart, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { getCurrentUser, logout } from '@/lib/auth';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const isClient = user?.role === 'client';
  
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
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div
              variants={itemAnimation}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                  Perfil
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Gerencie suas informações pessoais e preferências
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="border-salon-500 text-salon-500 hover:bg-salon-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div 
                variants={itemAnimation}
                className="lg:col-span-1"
              >
                <Card className="bg-white shadow-md border-none dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative mb-4">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={user?.avatar || "https://source.unsplash.com/random/?face"} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <Button 
                            size="icon" 
                            className="w-8 h-8 rounded-full bg-salon-500 hover:bg-salon-600 text-white shadow-md"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-1">{user?.name || "Usuário"}</h2>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {isClient ? "Cliente" : "Proprietário de Salão"}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-salon-500 text-salon-500 hover:bg-salon-50 mb-6"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar perfil
                      </Button>
                      
                      <div className="w-full space-y-4">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p>{user?.email || "usuario@exemplo.com"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                            <p>(11) 98765-4321</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Localização</p>
                            <p>São Paulo, SP</p>
                          </div>
                        </div>
                        
                        {isClient && (
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Avaliações</p>
                              <p>12 avaliações feitas</p>
                            </div>
                          </div>
                        )}
                        
                        {!isClient && (
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Avaliação do salão</p>
                              <p>4.8/5 (86 avaliações)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                variants={itemAnimation}
                className="lg:col-span-2"
              >
                <Card className="bg-white shadow-md border-none dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Configurações</CardTitle>
                    <CardDescription>
                      Gerencie suas preferências de conta e privacidade
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="account" className="w-full">
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="account">Conta</TabsTrigger>
                        <TabsTrigger value="notifications">Notificações</TabsTrigger>
                        <TabsTrigger value="privacy">Privacidade</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="account" className="mt-0 space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Informações da conta</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <Button 
                                variant="outline" 
                                className="w-full justify-start h-auto p-4 text-left"
                              >
                                <div className="flex items-start">
                                  <Lock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Alterar senha</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Atualize sua senha para maior segurança
                                    </p>
                                  </div>
                                </div>
                              </Button>
                            </div>
                            
                            <div>
                              <Button 
                                variant="outline" 
                                className="w-full justify-start h-auto p-4 text-left"
                              >
                                <div className="flex items-start">
                                  <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Métodos de pagamento</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Adicione ou remova cartões e métodos de pagamento
                                    </p>
                                  </div>
                                </div>
                              </Button>
                            </div>
                            
                            {isClient && (
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Heart className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Salões favoritos</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Gerencie sua lista de salões favoritos
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            )}
                            
                            {!isClient && (
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Horários de funcionamento</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Configure os horários de atendimento
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4 text-red-500">Ações de risco</h3>
                          
                          <div className="space-y-4">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start h-auto p-4 text-left border-red-200 hover:bg-red-50 hover:text-red-500"
                            >
                              <div className="flex items-start">
                                <LogOut className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                                <div>
                                  <p className="font-medium">Desativar conta</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Desative temporariamente sua conta
                                  </p>
                                </div>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="notifications" className="mt-0">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Preferências de notificação</h3>
                            
                            <div className="space-y-4">
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Bell className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Notificações por email</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Receba lembretes e confirmações por email
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                              
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Bell className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Notificações por WhatsApp</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Receba lembretes e confirmações por WhatsApp
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                              
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Bell className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Notificações no aplicativo</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Configurar notificações push
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {isClient && (
                            <div>
                              <h3 className="text-lg font-medium mb-4">Comunicações de marketing</h3>
                              
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Promoções e ofertas</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Receba promoções de salões próximos
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="privacy" className="mt-0">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Privacidade e segurança</h3>
                            
                            <div className="space-y-4">
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Lock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Privacidade do perfil</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Controle quem pode ver suas informações
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                              
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Lock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Sessões ativas</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Gerencie dispositivos conectados
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                              
                              <div>
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start h-auto p-4 text-left"
                                >
                                  <div className="flex items-start">
                                    <Lock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Dados e permissões</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Gerencie dados e permissões
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Profile;


import React from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Check, X, Bell, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample appointments data
const confirmations = [
  {
    id: 1,
    client: 'Maria Silva',
    service: 'Corte Feminino',
    professional: 'Ana',
    date: '2023-07-20',
    time: '10:00',
    phone: '(11) 98765-4321',
    status: 'pending',
  },
  {
    id: 2,
    client: 'João Costa',
    service: 'Barba',
    professional: 'Carlos',
    date: '2023-07-20',
    time: '14:00',
    phone: '(11) 97654-3210',
    status: 'pending',
  },
  {
    id: 3,
    client: 'Ana Pereira',
    service: 'Manicure',
    professional: 'Patricia',
    date: '2023-07-21',
    time: '16:00',
    phone: '(11) 96543-2109',
    status: 'pending',
  },
  {
    id: 4,
    client: 'Fernando Santos',
    service: 'Corte Masculino',
    professional: 'Carlos',
    date: '2023-07-19',
    time: '11:30',
    phone: '(11) 95432-1098',
    status: 'confirmed',
  },
  {
    id: 5,
    client: 'Camila Oliveira',
    service: 'Escova',
    professional: 'Ana',
    date: '2023-07-19',
    time: '15:00',
    phone: '(11) 94321-0987',
    status: 'confirmed',
  },
  {
    id: 6,
    client: 'Bruno Silva',
    service: 'Corte Masculino',
    professional: 'Carlos',
    date: '2023-07-18',
    time: '09:30',
    phone: '(11) 93210-9876',
    status: 'canceled',
  },
];

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const AppointmentsConfirmationsPage: React.FC = () => {
  const [status, setStatus] = React.useState('pending');
  
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
  
  const filteredConfirmations = confirmations.filter(confirmation => {
    if (status === 'pending') {
      return confirmation.status === 'pending';
    } else if (status === 'confirmed') {
      return confirmation.status === 'confirmed';
    } else if (status === 'canceled') {
      return confirmation.status === 'canceled';
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <SidebarMenu />
        <div className="mt-auto mb-4 px-3">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                Confirmações de Agendamentos
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Envie lembretes e confirme agendamentos com seus clientes
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Status de Confirmações</CardTitle>
                  <CardDescription>
                    Gerencie confirmações e lembretes para os próximos agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={status} onValueChange={setStatus} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="pending">Pendentes</TabsTrigger>
                      <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                      <TabsTrigger value="canceled">Cancelados</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending" className="space-y-4">
                      {filteredConfirmations.length > 0 ? (
                        filteredConfirmations.map(confirmation => (
                          <div
                            key={confirmation.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-yellow-200 dark:bg-gray-800 dark:border-yellow-800"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                              <div className="rounded-full bg-yellow-100 p-2 text-yellow-500 dark:bg-yellow-900">
                                <Bell className="h-5 w-5" />
                              </div>
                              
                              <div>
                                <h3 className="font-medium">{confirmation.service}</h3>
                                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:gap-4">
                                  <span className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.client}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {formatDate(confirmation.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.time}
                                  </span>
                                  <span className="flex items-center">
                                    <Phone className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge>{confirmation.professional}</Badge>
                              <div className="flex space-x-2">
                                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                                  <Bell className="h-4 w-4 mr-1" />
                                  Lembrar
                                </Button>
                                <Button size="sm" variant="outline" className="border-salon-500 text-salon-500 hover:bg-salon-50">
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <Bell className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">Sem confirmações pendentes</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Todos os agendamentos foram confirmados.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="confirmed" className="space-y-4">
                      {filteredConfirmations.length > 0 ? (
                        filteredConfirmations.map(confirmation => (
                          <div
                            key={confirmation.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-green-200 dark:bg-gray-800 dark:border-green-800"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                              <div className="rounded-full bg-green-100 p-2 text-green-500 dark:bg-green-900">
                                <Check className="h-5 w-5" />
                              </div>
                              
                              <div>
                                <h3 className="font-medium">{confirmation.service}</h3>
                                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:gap-4">
                                  <span className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.client}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {formatDate(confirmation.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge>{confirmation.professional}</Badge>
                              <Button size="sm" variant="outline">
                                Detalhes
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <Check className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento confirmado</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Não há agendamentos confirmados no momento.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="canceled" className="space-y-4">
                      {filteredConfirmations.length > 0 ? (
                        filteredConfirmations.map(confirmation => (
                          <div
                            key={confirmation.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-red-200 dark:bg-gray-800 dark:border-red-800"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                              <div className="rounded-full bg-red-100 p-2 text-red-500 dark:bg-red-900">
                                <X className="h-5 w-5" />
                              </div>
                              
                              <div>
                                <h3 className="font-medium">{confirmation.service}</h3>
                                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:gap-4">
                                  <span className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.client}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {formatDate(confirmation.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {confirmation.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge>{confirmation.professional}</Badge>
                              <Button size="sm" variant="outline">
                                Reagendar
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <X className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento cancelado</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Não há agendamentos cancelados no momento.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Automação de Confirmações</CardTitle>
                  <CardDescription>
                    Configure lembretes automáticos para seus clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">Funcionalidade em desenvolvimento</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      A configuração de lembretes automáticos estará disponível em breve. 
                      Esta funcionalidade permitirá enviar notificações por WhatsApp e SMS para seus clientes.
                    </p>
                    <Button className="mt-4 bg-salon-500 hover:bg-salon-600">
                      Entrar na lista de espera
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AppointmentsConfirmationsPage;

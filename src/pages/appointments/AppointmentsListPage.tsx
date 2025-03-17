
import React from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, Clock, User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const appointments = [
  {
    id: 1,
    client: 'Maria Silva',
    service: 'Corte Feminino',
    professional: 'Ana',
    date: '2023-07-15',
    time: '10:00',
    status: 'scheduled',
    phone: '(11) 98765-4321',
  },
  {
    id: 2,
    client: 'João Costa',
    service: 'Barba',
    professional: 'Carlos',
    date: '2023-07-15',
    time: '14:00',
    status: 'scheduled',
    phone: '(11) 97654-3210',
  },
  {
    id: 3,
    client: 'Ana Pereira',
    service: 'Manicure',
    professional: 'Patricia',
    date: '2023-07-15',
    time: '16:00',
    status: 'scheduled',
    phone: '(11) 96543-2109',
  },
  {
    id: 4,
    client: 'Fernando Santos',
    service: 'Corte Masculino',
    professional: 'Carlos',
    date: '2023-07-14',
    time: '11:30',
    status: 'completed',
    phone: '(11) 95432-1098',
  },
  {
    id: 5,
    client: 'Camila Oliveira',
    service: 'Escova',
    professional: 'Ana',
    date: '2023-07-14',
    time: '15:00',
    status: 'completed',
    phone: '(11) 94321-0987',
  },
  {
    id: 6,
    client: 'Bruno Silva',
    service: 'Corte Masculino',
    professional: 'Carlos',
    date: '2023-07-13',
    time: '09:30',
    status: 'cancelled',
    phone: '(11) 93210-9876',
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

const AppointmentsListPage: React.FC = () => {
  const [status, setStatus] = React.useState('upcoming');
  const [searchTerm, setSearchTerm] = React.useState('');
  
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
  
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.professional.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (status === 'upcoming') {
      return matchesSearch && appointment.status === 'scheduled';
    } else if (status === 'completed') {
      return matchesSearch && appointment.status === 'completed';
    } else if (status === 'cancelled') {
      return matchesSearch && appointment.status === 'cancelled';
    }
    
    return matchesSearch;
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
            <motion.div 
              variants={itemAnimation}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                  Lista de Agendamentos
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Gerencie todos os seus agendamentos
                </p>
              </div>
              
              <Button className="bg-salon-500 hover:bg-salon-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo agendamento
              </Button>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Agendamentos</CardTitle>
                    
                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar agendamento..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={status} onValueChange={setStatus} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                      <TabsTrigger value="completed">Concluídos</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming" className="space-y-4">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(appointment => (
                          <div
                            key={appointment.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                              <div className="rounded-full bg-salon-100 p-2 text-salon-500 dark:bg-salon-900">
                                <Calendar className="h-5 w-5" />
                              </div>
                              
                              <div>
                                <h3 className="font-medium">{appointment.service}</h3>
                                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:gap-4">
                                  <span className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    {appointment.client}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {formatDate(appointment.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge>{appointment.professional}</Badge>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                                  <X className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <Calendar className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento encontrado</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {searchTerm ? `Não encontramos resultados para "${searchTerm}"` : 'Não há agendamentos futuros.'}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="completed" className="space-y-4">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(appointment => (
                          <div
                            key={appointment.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                              <div className="rounded-full bg-green-100 p-2 text-green-500 dark:bg-green-900">
                                <Check className="h-5 w-5" />
                              </div>
                              
                              <div>
                                <h3 className="font-medium">{appointment.service}</h3>
                                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:gap-4">
                                  <span className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    {appointment.client}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {formatDate(appointment.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Button size="sm" variant="outline">
                              Ver detalhes
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <Check className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento concluído</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {searchTerm ? `Não encontramos resultados para "${searchTerm}"` : 'Não há agendamentos concluídos.'}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="cancelled" className="space-y-4">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(appointment => (
                          <div
                            key={appointment.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                              <div className="rounded-full bg-red-100 p-2 text-red-500 dark:bg-red-900">
                                <X className="h-5 w-5" />
                              </div>
                              
                              <div>
                                <h3 className="font-medium">{appointment.service}</h3>
                                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:gap-4">
                                  <span className="flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    {appointment.client}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {formatDate(appointment.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Button size="sm" variant="outline">
                              Reagendar
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <X className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento cancelado</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {searchTerm ? `Não encontramos resultados para "${searchTerm}"` : 'Não há agendamentos cancelados.'}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
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

export default AppointmentsListPage;

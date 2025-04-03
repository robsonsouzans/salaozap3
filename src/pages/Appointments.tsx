
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, Search, User, X, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { 
  Appointment, 
  getAllAppointments,
  getUpcomingAppointments,
  getCompletedAppointments,
  getCancelledAppointments,
  cancelAppointment
} from '@/lib/appointmentService';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [appointments, setAppointments] = useState<Record<string, Appointment[]>>({
    upcoming: [],
    past: [],
    cancelled: [],
  });
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  
  useEffect(() => {
    // Load appointments when the component mounts or tab changes
    loadAppointments();
  }, [activeTab]);
  
  const loadAppointments = () => {
    setAppointments({
      upcoming: getUpcomingAppointments(),
      past: getCompletedAppointments(),
      cancelled: getCancelledAppointments(),
    });
  };
  
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-salon-500">Agendado</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return null;
    }
  };
  
  const filterAppointments = (appointmentList: Appointment[]) => {
    if (!searchTerm) return appointmentList;
    
    return appointmentList.filter(
      appointment => 
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.professional.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.salonName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCancelAppointment = (id: string) => {
    cancelAppointment(id);
    setAppointmentToCancel(null);
    loadAppointments();
  };
  
  const handleRescheduleAppointment = (appointment: Appointment) => {
    // Navigate to the new appointment page with salon ID
    if (appointment.salonId) {
      navigate(`/appointments/new/salon/${appointment.salonId}`);
    } else {
      navigate('/appointments/new');
    }
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
                  Agendamentos
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Gerencie todos os seus agendamentos
                </p>
              </div>
              
              <Button 
                className="bg-salon-500 hover:bg-salon-600"
                onClick={() => navigate('/appointments/new')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Novo agendamento
              </Button>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="bg-white shadow-md border-none dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Seus agendamentos</CardTitle>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar agendamentos"
                          className="pl-9 h-10 w-full md:w-[200px] lg:w-[300px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filtros
                      </Button>
                    </div>
                  </div>
                  
                  {showFilters && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 border flex flex-wrap gap-4">
                      <div>
                        <p className="text-sm mb-2">Período</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Hoje</Button>
                          <Button size="sm" variant="outline">Esta semana</Button>
                          <Button size="sm" variant="outline">Este mês</Button>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 ml-auto self-start"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-4 w-4" />
                        Fechar
                      </Button>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="mb-6 grid grid-cols-3 w-full md:w-auto">
                      <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                      <TabsTrigger value="past">Realizados</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                    </TabsList>
                    
                    {['upcoming', 'past', 'cancelled'].map((tabId) => (
                      <TabsContent key={tabId} value={tabId} className="mt-0">
                        {filterAppointments(appointments[tabId]).length > 0 ? (
                          <div className="space-y-4">
                            {filterAppointments(appointments[tabId]).map((appointment) => (
                              <div
                                key={appointment.id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800"
                              >
                                <div className="flex items-center mb-4 md:mb-0">
                                  <div className="rounded-full bg-salon-100 p-2 mr-4">
                                    <Calendar className="h-5 w-5 text-salon-500" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">{appointment.service}</h3>
                                      {getStatusBadge(appointment.status)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      <p className="flex items-center">
                                        <User className="h-3.5 w-3.5 mr-1" />
                                        {appointment.professional}
                                        {appointment.salonName && (
                                          <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                            {appointment.salonName}
                                          </span>
                                        )}
                                      </p>
                                      <div className="flex flex-wrap gap-x-4 mt-1">
                                        <span className="flex items-center">
                                          <Calendar className="h-3.5 w-3.5 mr-1" />
                                          {formatDate(appointment.date)}
                                        </span>
                                        <span className="flex items-center">
                                          <Clock className="h-3.5 w-3.5 mr-1" />
                                          {appointment.time}
                                        </span>
                                        {appointment.price && (
                                          <span className="font-medium">{appointment.price}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex ml-11 md:ml-0 space-x-2">
                                  {tabId === 'upcoming' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-salon-500 text-salon-500 hover:bg-salon-50"
                                        onClick={() => handleRescheduleAppointment(appointment)}
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Reagendar
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Cancelar
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Manter Agendamento</AlertDialogCancel>
                                            <AlertDialogAction 
                                              className="bg-red-500 hover:bg-red-600"
                                              onClick={() => handleCancelAppointment(appointment.id)}
                                            >
                                              Sim, cancelar
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </>
                                  )}
                                  {tabId === 'cancelled' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-salon-500 text-salon-500 hover:bg-salon-50"
                                      onClick={() => handleRescheduleAppointment(appointment)}
                                    >
                                      Reagendar
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                  >
                                    Detalhes
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">
                              {tabId === 'upcoming'
                                ? 'Nenhum agendamento futuro encontrado.'
                                : tabId === 'past'
                                  ? 'Nenhum agendamento anterior encontrado.'
                                  : 'Nenhum agendamento cancelado encontrado.'}
                            </p>
                            {tabId === 'upcoming' && (
                              <Button 
                                className="bg-salon-500 hover:bg-salon-600"
                                onClick={() => navigate('/appointments/new')}
                              >
                                Agendar agora
                              </Button>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    ))}
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

export default Appointments;

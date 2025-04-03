
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Appointment, getUpcomingAppointments } from '@/lib/appointmentService';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const AppointmentsCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  useEffect(() => {
    loadAppointments();
  }, []);
  
  const loadAppointments = () => {
    const upcomingAppointments = getUpcomingAppointments();
    setAppointments(upcomingAppointments);
  };
  
  const getAppointmentsForDate = (selectedDate: Date | undefined): Appointment[] => {
    if (!selectedDate) return [];
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };
  
  const handlePrevDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }
  };
  
  const handleNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    }
  };
  
  const handleNewAppointment = (hour: number) => {
    if (date) {
      navigate('/appointments/new');
    }
  };
  
  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
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
                  Calendário de Agendamentos
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Visualize e gerencie seus agendamentos
                </p>
              </div>
              
              <Button 
                className="bg-salon-500 hover:bg-salon-600 text-white"
                onClick={() => navigate('/appointments/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo agendamento
              </Button>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-none shadow-md lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                  <CardDescription>
                    Selecione uma data para ver os agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border pointer-events-auto"
                    locale={ptBR}
                  />
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      {date?.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </CardTitle>
                    <CardDescription>
                      Horários disponíveis e agendamentos
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={handlePrevDay}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextDay}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const hour = 9 + i;
                      const timeStr = `${hour}:00`;
                      const appointmentsAtTime = appointments.filter(apt => 
                        apt.date === date?.toISOString().split('T')[0] && 
                        apt.time === timeStr
                      );
                      
                      const isBooked = appointmentsAtTime.length > 0;
                      const isPast = date && 
                        date.getDate() === new Date().getDate() && 
                        new Date().getHours() > hour;
                      
                      return (
                        <div
                          key={i}
                          className={`flex border rounded-md p-3 ${
                            isBooked 
                              ? 'bg-salon-50 border-salon-200 dark:bg-salon-900/20 dark:border-salon-800' 
                              : isPast 
                                ? 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800/40 dark:border-gray-700' 
                                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                          }`}
                        >
                          <div className="w-16 font-medium">
                            {hour}:00
                          </div>
                          
                          {isBooked ? (
                            <div className="flex-1">
                              {appointmentsAtTime.map((apt, index) => (
                                <div key={apt.id} className="mb-1 last:mb-0">
                                  <div className="font-medium text-salon-700 dark:text-salon-300">
                                    {apt.service}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {apt.professional} - {apt.salonName}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex-1 text-gray-500">
                              {isPast ? 'Horário passado' : 'Disponível'}
                            </div>
                          )}
                          
                          {!isPast && (
                            <div>
                              {isBooked ? (
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => openAppointmentDetails(appointmentsAtTime[0])}>
                                      Detalhes
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>Detalhes do Agendamento</SheetTitle>
                                      <SheetDescription>
                                        Informações sobre seu agendamento
                                      </SheetDescription>
                                    </SheetHeader>
                                    {selectedAppointment && (
                                      <div className="py-4 space-y-4">
                                        <div>
                                          <h3 className="font-medium text-lg">{selectedAppointment.service}</h3>
                                          <p className="text-sm text-gray-500">{selectedAppointment.salonName}</p>
                                        </div>
                                        
                                        <div className="flex items-center">
                                          <CalendarIcon className="h-4 w-4 mr-2" />
                                          <span>{format(new Date(selectedAppointment.date), "dd/MM/yyyy")}</span>
                                          <Clock className="h-4 w-4 ml-4 mr-2" />
                                          <span>{selectedAppointment.time}</span>
                                        </div>
                                        
                                        <div className="flex items-center">
                                          <User className="h-4 w-4 mr-2" />
                                          <span>{selectedAppointment.professional}</span>
                                        </div>
                                        
                                        {selectedAppointment.price && (
                                          <div className="font-medium mt-2">
                                            Valor: {selectedAppointment.price}
                                          </div>
                                        )}
                                        
                                        <div className="flex space-x-2 pt-4">
                                          <Button 
                                            variant="outline" 
                                            className="border-salon-500 text-salon-500 hover:bg-salon-50"
                                            onClick={() => navigate('/appointments/new')}
                                          >
                                            Reagendar
                                          </Button>
                                          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                                            Cancelar
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </SheetContent>
                                </Sheet>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-salon-500 border-salon-500"
                                  onClick={() => handleNewAppointment(hour)}
                                >
                                  Agendar
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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

export default AppointmentsCalendarPage;


import React from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppointmentsCalendarPage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
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
              
              <Button className="bg-salon-500 hover:bg-salon-600 text-white">
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
                    className="rounded-md border"
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
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const hour = 9 + i;
                      const isBooked = [10, 14, 16].includes(hour);
                      const isPast = new Date().getHours() > hour;
                      
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
                              <div className="font-medium text-salon-700 dark:text-salon-300">
                                {hour === 10 ? 'Corte Feminino' : hour === 14 ? 'Barba' : 'Manicure'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {hour === 10 ? 'Maria Silva' : hour === 14 ? 'João Costa' : 'Ana Pereira'} - {hour === 10 ? 'Ana' : hour === 14 ? 'Carlos' : 'Patrícia'}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 text-gray-500">
                              {isPast ? 'Horário passado' : 'Disponível'}
                            </div>
                          )}
                          
                          {!isPast && (
                            <div>
                              {isBooked ? (
                                <Button variant="outline" size="sm">
                                  Detalhes
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" className="text-salon-500 border-salon-500">
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

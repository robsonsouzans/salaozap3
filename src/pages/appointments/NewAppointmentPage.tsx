import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  Clock, User, 
  Check, X, ArrowLeft, 
  ChevronRight, Scissors,
  CalendarDays, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import {
  Service,
  Employee,
  Salon,
  addAppointment,
  getAvailableTimeSlots,
  getPopularTimeSlots,
  getEmployeesForSalon,
  getServicesForSalon,
  getSalonById,
  getServiceById,
  getEmployeeById,
  formatDate,
  formatDateTime,
  services as allServices,
  employees as allEmployees,
  salons as allSalons
} from '@/lib/appointmentService';

const NewAppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const path = window.location.pathname;
  const isServiceBooking = path.includes('/appointments/new/service/');
  const isProfessionalBooking = path.includes('/appointments/new/professional/');
  const isSalonBooking = path.includes('/appointments/new/salon/');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(id ? 1 : 0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [popularTimeSlots, setPopularTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [salon, setSalon] = useState<Salon | null>(null);
  const [availableSalons, setAvailableSalons] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<string>('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      if (isServiceBooking) {
        const service = getServiceById(id);
        if (service) {
          setSelectedService(service.id);
          setServices(allServices);
          setEmployees(allEmployees);
          setStep(2);
          setAvailableSalons(allSalons);
        }
      } else if (isProfessionalBooking) {
        const employee = getEmployeeById(id);
        if (employee) {
          setSelectedEmployee(employee.id);
          setEmployees([employee]);
          setServices(allServices);
          setStep(1);
          setAvailableSalons(allSalons);
        }
      } else if (isSalonBooking) {
        const salonData = getSalonById(id);
        if (salonData) {
          setSalon(salonData);
          setSelectedSalon(salonData.id);
          const salonServices = getServicesForSalon(id);
          setServices(salonServices);
          const salonEmployees = getEmployeesForSalon(id);
          setEmployees(salonEmployees);
        }
      }
    } else {
      setServices(allServices);
      setEmployees(allEmployees);
      setAvailableSalons(allSalons);
    }
  }, [id, isServiceBooking, isProfessionalBooking, isSalonBooking]);

  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
      setPopularTimeSlots(getPopularTimeSlots());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedSalon && !salon) {
      const salonData = getSalonById(selectedSalon);
      if (salonData) {
        setSalon(salonData);
        if (!isServiceBooking && !isProfessionalBooking) {
          const salonServices = getServicesForSalon(selectedSalon);
          setServices(salonServices);
          const salonEmployees = getEmployeesForSalon(selectedSalon);
          setEmployees(salonEmployees);
        }
      }
    }
  }, [selectedSalon, salon, isServiceBooking, isProfessionalBooking]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    
    if (step === 1) {
      setTimeout(() => setStep(2), 300);
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    
    if (step === 2) {
      setTimeout(() => setStep(3), 300);
    }
  };

  const handleSalonSelect = (salonId: string) => {
    setSelectedSalon(salonId);
    const salonData = getSalonById(salonId);
    if (salonData) {
      setSalon(salonData);
    }
    
    if (step === 0) {
      setTimeout(() => setStep(1), 300);
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    
    if (step === 3) {
      setTimeout(() => {
        if (selectedDate && selectedService && selectedEmployee) {
          setIsBookingDialogOpen(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (selectedDate && selectedTimeSlot && selectedService && selectedEmployee) {
        setIsBookingDialogOpen(true);
      } else {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todas as informações necessárias para o agendamento.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot && selectedService && selectedEmployee && salon) {
      setIsLoading(true);
      
      const service = getServiceById(selectedService);
      const employee = employees.find(emp => emp.id === selectedEmployee);
      
      addAppointment({
        service: service?.name || '',
        professional: employee?.name || '',
        professionalId: selectedEmployee,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTimeSlot,
        status: 'scheduled',
        salonName: salon.name,
        salonId: salon.id,
        price: service?.price,
        clientName: 'Você',
      });

      setTimeout(() => {
        setIsLoading(false);
        setIsBookingDialogOpen(false);
        setIsConfirmationDialogOpen(true);
      }, 1000);
    }
  };

  const handleFinish = () => {
    setIsConfirmationDialogOpen(false);
    navigate('/appointments');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };
  
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  const stepIndicators = [
    { title: "Serviço", icon: Scissors },
    { title: "Profissional", icon: User },
    { title: "Data/Hora", icon: CalendarDays },
    { title: "Confirmar", icon: Check }
  ];

  if (isServiceBooking || isProfessionalBooking) {
    if (!salon) {
      stepIndicators.unshift({ title: "Salão", icon: CalendarIcon });
    }
  }

  const currentService = services.find(s => s.id === selectedService);
  const currentEmployee = employees.find(e => e.id === selectedEmployee);

  const renderStepContent = () => {
    if ((isServiceBooking || isProfessionalBooking) && !salon && step === 0) {
      return (
        <motion.div 
          key="step-salon"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Selecionar Salão</CardTitle>
              <CardDescription>
                Escolha o salão para o seu agendamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableSalons.map((salonOption) => (
                  <motion.div 
                    key={salonOption.id}
                    variants={itemVariants}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedSalon === salonOption.id 
                        ? 'border-salon-500 bg-salon-50 dark:bg-salon-950/20 shadow-sm' 
                        : 'hover:border-salon-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => handleSalonSelect(salonOption.id)}
                  >
                    <div className={`rounded-full p-3 ${
                      selectedSalon === salonOption.id
                        ? 'bg-salon-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{salonOption.name}</h4>
                    </div>
                    
                    {selectedSalon === salonOption.id && (
                      <Check className="h-5 w-5 text-salon-500" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    switch (step) {
      case 0:
        return (
          <motion.div 
            key="step-0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle>Selecionar Salão</CardTitle>
                <CardDescription>
                  Escolha o salão para fazer seu agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-gray-500">
                  Esta funcionalidade será implementada em breve.
                  Use a pesquisa para encontrar e selecionar um salão.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => navigate('/salons')} variant="salon">
                    Buscar Salões
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
        
      case 1:
        return (
          <motion.div 
            key="step-1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle>Selecionar Serviço</CardTitle>
                <CardDescription>
                  Escolha o serviço que deseja agendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map(service => (
                    <motion.div 
                      key={service.id}
                      variants={itemVariants}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedService === service.id 
                          ? 'border-salon-500 bg-salon-50 dark:bg-salon-950/20 shadow-sm' 
                          : 'hover:border-salon-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div className={`rounded-full p-3 ${
                        selectedService === service.id
                          ? 'bg-salon-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}>
                        <Scissors className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="text-sm text-muted-foreground">Duração: {service.duration} min</div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant={selectedService === service.id ? "default" : "outline"} className={
                          selectedService === service.id 
                            ? "bg-salon-500 hover:bg-salon-600"
                            : ""
                        }>
                          {service.price}
                        </Badge>
                      </div>
                      
                      {selectedService === service.id && (
                        <Check className="h-5 w-5 text-salon-500" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div 
            key="step-2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle>Selecionar Profissional</CardTitle>
                <CardDescription>
                  Escolha o profissional para realizar o serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map(employee => (
                    <motion.div
                      key={employee.id}
                      variants={itemVariants}
                      className={`flex flex-col items-center text-center space-y-3 border rounded-xl p-4 cursor-pointer transition-all ${
                        selectedEmployee === employee.id 
                          ? 'border-salon-500 bg-salon-50 dark:bg-salon-950/20 shadow-sm' 
                          : 'hover:border-salon-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => handleEmployeeSelect(employee.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={employee.photo} />
                          <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        {selectedEmployee === employee.id && (
                          <div className="absolute -bottom-1 -right-1 bg-salon-500 text-white rounded-full p-0.5">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <div className="flex items-center justify-center mt-1 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div 
            key="step-3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Selecionar Data</CardTitle>
                  <CardDescription>
                    Escolha a data para o agendamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border p-3 pointer-events-auto"
                      locale={ptBR}
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                        date > new Date(new Date().setDate(new Date().getDate() + 60)) // Allow booking up to 60 days in advance
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Selecionar Horário</CardTitle>
                  <CardDescription>
                    Escolha o horário para o agendamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-5">
                      {popularTimeSlots.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Horários Recomendados:</h4>
                          <div className="flex flex-wrap gap-2">
                            {popularTimeSlots.map(timeSlot => (
                              availableTimeSlots.includes(timeSlot) && (
                                <Button
                                  key={`popular-${timeSlot}`}
                                  variant={selectedTimeSlot === timeSlot ? "salon" : "outline"}
                                  size="sm"
                                  className={selectedTimeSlot === timeSlot ? "" : "border-salon-500 text-salon-600"}
                                  onClick={() => handleTimeSlotSelect(timeSlot)}
                                >
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {timeSlot}
                                </Button>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {availableTimeSlots.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Todos os Horários:</h4>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {availableTimeSlots.map(timeSlot => (
                              <Button
                                key={timeSlot}
                                variant={selectedTimeSlot === timeSlot ? "salon" : "outline"}
                                size="sm"
                                className={selectedTimeSlot === timeSlot ? "" : ""}
                                onClick={() => handleTimeSlotSelect(timeSlot)}
                              >
                                {timeSlot}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">
                          Não há horários disponíveis para esta data. Por favor, selecione outra data.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">
                      Selecione uma data para ver os horários disponíveis.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {(selectedService || selectedEmployee || selectedDate || selectedTimeSlot) && (
              <Card className="border-none shadow-sm bg-salon-50 dark:bg-salon-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Resumo da Seleção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {salon && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salão:</span>
                      <span className="font-medium">{salon?.name}</span>
                    </div>
                  )}
                  {selectedService && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serviço:</span>
                      <span className="font-medium">{currentService?.name} ({currentService?.price})</span>
                    </div>
                  )}
                  {selectedEmployee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profissional:</span>
                      <span className="font-medium">{currentEmployee?.name}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>
                    </div>
                  )}
                  {selectedTimeSlot && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horário:</span>
                      <span className="font-medium">{selectedTimeSlot}</span>
                    </div>
                  )}
                </CardContent>
                {selectedDate && selectedTimeSlot && selectedService && selectedEmployee && salon && (
                  <CardFooter className="pt-0">
                    <Button className="w-full" variant="salon" onClick={() => setIsBookingDialogOpen(true)}>
                      <Check className="mr-2 h-4 w-4" /> Confirmar Agendamento
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
          </motion.div>
        );
        
      default:
        return null;
    }
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
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                    Novo Agendamento
                  </h1>
                  {salon && (
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        {salon.name}
                      </span>
                    </div>
                  )}
                  {isServiceBooking && currentService && (
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Serviço: {currentService.name}
                      </span>
                    </div>
                  )}
                  {isProfessionalBooking && currentEmployee && (
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Profissional: {currentEmployee.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {stepIndicators.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = idx <= step;
                    const isComplete = idx < step;
                    
                    return (
                      <React.Fragment key={item.title}>
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isActive ? 'bg-salon-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                          </div>
                          <span className={`text-xs mt-1.5 ${isActive ? 'text-salon-600 dark:text-salon-400 font-medium' : 'text-gray-500'}`}>
                            {item.title}
                          </span>
                        </div>
                        
                        {idx < stepIndicators.length - 1 && (
                          <div className={`h-1 flex-1 mx-2 rounded ${idx < step ? 'bg-salon-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Agendamento</DialogTitle>
            <DialogDescription>
              Revise as informações do seu agendamento antes de confirmar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {salon && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Salão</h4>
                <p className="font-medium">{salon.name}</p>
              </div>
            )}
            
            {selectedService && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Serviço</h4>
                <p className="font-medium">
                  {services.find(s => s.id === selectedService)?.name} - {services.find(s => s.id === selectedService)?.price}
                </p>
              </div>
            )}
            
            {selectedEmployee && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profissional</h4>
                <p className="font-medium">{employees.find(e => e.id === selectedEmployee)?.name}</p>
              </div>
            )}
            
            {selectedDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Data e Hora</h4>
                <p className="font-medium">
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTimeSlot}
                </p>
              </div>
            )}
            
            {currentService && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duração</h4>
                <p className="font-medium">{currentService.duration} minutos</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              variant="salon" 
              onClick={handleBooking} 
              className="mb-2 sm:mb-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600 dark:text-green-500">
              <Check className="h-6 w-6 mr-2" /> Agendamento Confirmado
            </DialogTitle>
            <DialogDescription>
              Seu agendamento foi realizado com sucesso
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium mb-2">
              {services.find(s => s.id === selectedService)?.name}
            </p>
            {selectedDate && (
              <p className="text-gray-500 dark:text-gray-400">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTimeSlot}
              </p>
            )}
            {salon && (
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {salon.name}
              </p>
            )}
            
            <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4 bg-gray-50 dark:bg-gray-800/50">
              <h4 className="font-medium mb-2">Lembretes</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 text-left space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Chegue 10 minutos antes do horário agendado</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Em caso de imprevisto, cancele com pelo menos 2 horas de antecedência</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Você receberá uma confirmação por e-mail</span>
                </li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                setIsConfirmationDialogOpen(false);
                setSelectedService('');
                setSelectedEmployee('');
                setSelectedDate(new Date());
                setSelectedTimeSlot('');
                setStep(1);
              }}
            >
              Novo Agendamento
            </Button>
            <Button 
              variant="salon" 
              className="flex-1" 
              onClick={handleFinish}
            >
              Ver Meus Agendamentos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default NewAppointmentPage;

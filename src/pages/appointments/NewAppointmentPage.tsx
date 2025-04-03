
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Check, X, ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Service,
  Employee,
  Salon,
  addAppointment,
  getAvailableTimeSlots,
  getEmployeesForSalon,
  getServicesForSalon,
  getSalonById,
  getServiceById
} from '@/lib/appointmentService';

const NewAppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(id ? 2 : 1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [salon, setSalon] = useState<Salon | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // If we have a salon ID from the URL, load salon data
      const salonData = getSalonById(id);
      if (salonData) {
        setSalon(salonData);
        // Load services for this salon
        const salonServices = getServicesForSalon(id);
        setServices(salonServices);
        // Load employees for this salon
        const salonEmployees = getEmployeesForSalon(id);
        setEmployees(salonEmployees);
      }
    }
  }, [id]);

  useEffect(() => {
    // When date changes, update available time slots
    if (selectedDate) {
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(''); // Reset time slot when date changes
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Open booking dialog if all selections are made
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
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot && selectedService && selectedEmployee && salon) {
      // Get the selected service and employee objects
      const service = getServiceById(selectedService);
      const employee = employees.find(emp => emp.id === selectedEmployee);
      
      // Add the new appointment
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

      // Close the dialog and show success message
      setIsBookingDialogOpen(false);
      setIsConfirmationDialogOpen(true);
    }
  };

  const handleFinish = () => {
    setIsConfirmationDialogOpen(false);
    navigate('/appointments');
  };

  // Animation variants
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        // Step 1: Select salon (this step is skipped if salon ID is provided in the URL)
        return (
          <Card className="border-none shadow-md">
            <CardHeader>
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
                <Button onClick={() => navigate('/salons')} className="bg-salon-500 hover:bg-salon-600">
                  Buscar Salões
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 2:
        // Step 2: Select service and employee
        return (
          <div className="grid gap-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Selecionar Serviço</CardTitle>
                <CardDescription>
                  Escolha o serviço que deseja agendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <RadioGroup value={selectedService} onValueChange={handleServiceSelect}>
                    {services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2 bg-white border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={service.id} id={`service-${service.id}`} />
                        <Label htmlFor={`service-${service.id}`} className="flex flex-1 justify-between cursor-pointer">
                          <span>{service.name}</span>
                          <span className="font-medium">{service.price}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Selecionar Profissional</CardTitle>
                <CardDescription>
                  Escolha o profissional para realizar o serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map(employee => (
                    <div
                      key={employee.id}
                      className={`flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedEmployee === employee.id ? 'ring-2 ring-salon-500 bg-salon-50' : ''
                      }`}
                      onClick={() => handleEmployeeSelect(employee.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.photo} />
                        <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{employee.name}</p>
                      </div>
                      {selectedEmployee === employee.id && (
                        <Check className="h-5 w-5 text-salon-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 3:
        // Step 3: Select date and time
        return (
          <div className="grid gap-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Selecionar Data</CardTitle>
                <CardDescription>
                  Escolha a data desejada para o agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border p-3"
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
              <CardHeader>
                <CardTitle>Selecionar Horário</CardTitle>
                <CardDescription>
                  Escolha o horário disponível para o agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTimeSlots.map(timeSlot => (
                        <Button
                          key={timeSlot}
                          variant={selectedTimeSlot === timeSlot ? "default" : "outline"}
                          className={selectedTimeSlot === timeSlot ? "bg-salon-500 hover:bg-salon-600" : ""}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">
                      Não há horários disponíveis para esta data. Por favor, selecione outra data.
                    </p>
                  )
                ) : (
                  <p className="text-center py-6 text-gray-500">
                    Selecione uma data para ver os horários disponíveis.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <div className="flex items-center mb-6">
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
                </div>
              </div>
              
              {/* Progress steps */}
              <div className="mb-6">
                <div className="flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-salon-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > 1 ? <Check className="h-4 w-4" /> : 1}
                    </div>
                    <span className="text-xs mt-1">Salão</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 flex-1 ${step > 1 ? 'bg-salon-500' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-salon-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > 2 ? <Check className="h-4 w-4" /> : 2}
                    </div>
                    <span className="text-xs mt-1">Serviço</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 flex-1 ${step > 2 ? 'bg-salon-500' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 3 ? 'bg-salon-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > 3 ? <Check className="h-4 w-4" /> : 3}
                    </div>
                    <span className="text-xs mt-1">Data/Hora</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              {renderStepContent()}
            </motion.div>

            <motion.div variants={itemAnimation} className="pt-4 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-salon-500 hover:bg-salon-600"
                disabled={(step === 2 && (!selectedService || !selectedEmployee)) || 
                          (step === 3 && (!selectedDate || !selectedTimeSlot))}
              >
                {step < 3 ? 'Continuar' : 'Agendar'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      {/* Booking Confirmation Dialog */}
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
                <h4 className="text-sm font-medium text-gray-500">Salão</h4>
                <p className="font-medium">{salon.name}</p>
              </div>
            )}
            
            {selectedService && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Serviço</h4>
                <p className="font-medium">
                  {services.find(s => s.id === selectedService)?.name} - {services.find(s => s.id === selectedService)?.price}
                </p>
              </div>
            )}
            
            {selectedEmployee && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Profissional</h4>
                <p className="font-medium">{employees.find(e => e.id === selectedEmployee)?.name}</p>
              </div>
            )}
            
            {selectedDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Data e Hora</h4>
                <p className="font-medium">
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTimeSlot}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBooking} className="bg-salon-500 hover:bg-salon-600 mb-2 sm:mb-0">
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <Check className="h-6 w-6 mr-2" /> Agendamento Confirmado
            </DialogTitle>
            <DialogDescription>
              Seu agendamento foi realizado com sucesso
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-4">
            <div className="bg-green-100 text-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium mb-2">
              {services.find(s => s.id === selectedService)?.name}
            </p>
            {selectedDate && (
              <p className="text-gray-500">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTimeSlot}
              </p>
            )}
          </div>
          
          <DialogFooter className="flex justify-center">
            <Button onClick={handleFinish} className="bg-salon-500 hover:bg-salon-600">
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

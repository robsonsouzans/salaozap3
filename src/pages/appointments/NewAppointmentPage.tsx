
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Salon, 
  Service, 
  Employee, 
  getServicesForSalon, 
  getEmployeesForSalon,
  getSalonById,
  getServiceById,
  getEmployeeById,
  getAvailableTimeSlots,
  getPopularTimeSlots,
  addAppointment,
  services as allServices
} from '@/lib/appointmentService';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectSeparator,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CalendarIcon, 
  CheckCircle2, 
  Star, 
  Building, 
  Scissors, 
  User,
  Info,
  Store,
  CreditCard,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getActivePaymentMethods } from '@/lib/paymentService';

// Tempo estimado tooltip
interface TimeTooltipProps {
  duration: number;
}

const formSchema = z.object({
  date: z.date(),
  salon: z.string().min(1, {
    message: "Selecione um salão.",
  }),
  service: z.string().min(1, {
    message: "Selecione um serviço.",
  }),
  professional: z.string().min(1, {
    message: "Selecione um profissional.",
  }),
  time: z.string().min(1, {
    message: "Selecione um horário.",
  }),
  paymentMethod: z.string().min(1, {
    message: "Selecione um método de pagamento.",
  }),
  requests: z.string().optional(),
});

interface TimeSlot {
  time: string;
  isPopular?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'pix' | 'money' | 'other';
  isDefault?: boolean;
}

const NewAppointmentPage: React.FC = () => {
  const { id: paramId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [bookingSource, setBookingSource] = useState<'salon' | 'service' | 'professional' | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [availableSalons, setAvailableSalons] = useState<Salon[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [popularTimes, setPopularTimes] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Appointment details, 2: Payment
  
  const user = getCurrentUser();
  
  const handleSalonChange = (salonName: string) => {
    const salon = availableSalons.find(s => s.name === salonName);
    if (salon) {
      setSelectedSalon(salon);
      
      const salonServices = getServicesForSalon(salon.id);
      setAvailableServices(salonServices);
      
      form.setValue("service", "");
      form.setValue("professional", "");
      setSelectedService(null);
      setSelectedEmployee(null);
      setAvailableEmployees([]);
    }
  };
  
  const handleServiceChange = (serviceName: string) => {
    const service = availableServices.find(s => s.name === serviceName);
    if (service) {
      setSelectedService(service);
      
      if (selectedSalon) {
        const employees = getEmployeesForSalon(selectedSalon.id);
        setAvailableEmployees(employees);
      }
      
      form.setValue("professional", "");
      setSelectedEmployee(null);
    }
  };
  
  const handleProfessionalChange = (professionalName: string) => {
    const professional = availableEmployees.find(e => e.name === professionalName);
    if (professional) {
      setSelectedEmployee(professional);
    }
  };

  const handlePaymentMethodChange = (paymentMethodId: string) => {
    setSelectedPaymentMethod(paymentMethodId);
  };
  
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const bookingType = pathParts[pathParts.length - 2];
    
    if (bookingType === 'salon' && paramId) {
      setBookingSource('salon');
      const salon = getSalonById(paramId);
      if (salon) {
        setSelectedSalon(salon);
        form.setValue("salon", salon.name);
        
        const salonServices = getServicesForSalon(paramId);
        setAvailableServices(salonServices);
      }
    } else if (bookingType === 'service' && paramId) {
      setBookingSource('service');
      const service = getServiceById(paramId);
      if (service) {
        setSelectedService(service);
        form.setValue("service", service.name);
        
        setAvailableSalons([
          { id: '1', name: 'Salão Glamour' },
          { id: '2', name: 'Bela Hair' },
          { id: '3', name: 'Barber Shop' },
          { id: '4', name: 'Espaço Beleza' },
        ]);
      }
    } else if (bookingType === 'professional' && paramId) {
      setBookingSource('professional');
      const professional = getEmployeeById(paramId);
      if (professional) {
        setSelectedEmployee(professional);
        form.setValue("professional", professional.name);
        
        setAvailableSalons([
          { id: '1', name: 'Salão Glamour' },
        ]);
        
        setAvailableServices(allServices);
      }
    } else {
      setAvailableSalons([
        { id: '1', name: 'Salão Glamour' },
        { id: '2', name: 'Bela Hair' },
        { id: '3', name: 'Barber Shop' },
        { id: '4', name: 'Espaço Beleza' },
      ]);
    }
    
    // Load payment methods
    const methods = getActivePaymentMethods();
    setPaymentMethods(methods);
    
    updateAvailableTimes(selectedDate);
    setPopularTimes(getPopularTimeSlots());
  }, [paramId]);
  
  const updateAvailableTimes = (date: Date) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const timeSlots = getAvailableTimeSlots(date);
      setAvailableTimes(timeSlots);
      setIsLoading(false);
    }, 500);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateAvailableTimes(date);
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: selectedDate,
      salon: selectedSalon?.name || "",
      service: selectedService?.name || "",
      professional: selectedEmployee?.name || "",
      time: selectedTime || "",
      paymentMethod: selectedPaymentMethod || "",
      requests: specialRequests,
    },
  });
  
  useEffect(() => {
    form.setValue("date", selectedDate);
  }, [selectedDate, form]);

  const proceedToPayment = () => {
    const isValid = form.trigger(['date', 'salon', 'service', 'professional', 'time']);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const goBackToDetails = () => {
    setCurrentStep(1);
  };
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Get the payment method name for display
      const paymentMethodName = paymentMethods.find(m => m.id === values.paymentMethod)?.name || values.paymentMethod;
      
      const newAppointment = {
        service: selectedService?.name || values.service,
        professional: selectedEmployee?.name || values.professional,
        professionalId: selectedEmployee?.id || '1',
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time,
        status: 'scheduled' as const,
        salonName: selectedSalon?.name || values.salon,
        salonId: selectedSalon?.id || '1',
        price: selectedService?.price || 'R$ 50,00',
        clientName: user?.name || 'Cliente',
        paymentMethod: paymentMethodName,
        paymentStatus: 'paid', // The appointment is considered paid when created
      };
      
      addAppointment(newAppointment);
      setIsSubmitting(false);
      
      toast({
        title: "Agendamento confirmado! 🎉",
        description: `Seu agendamento foi confirmado para ${format(values.date, 'dd/MM/yyyy')} às ${values.time}`,
      });
      
      navigate('/appointments');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        {user && <SidebarMenu />}
        <div className="mt-auto mb-4 px-3">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              {currentStep === 1 ? "Novo Agendamento" : "Forma de Pagamento"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {currentStep === 1 
                ? "Preencha os campos abaixo para agendar seu horário" 
                : "Escolha como deseja pagar pelo serviço"}
            </p>
          </div>
          
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep === 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentStep === 1 ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-300'}>Detalhes</span>
              <span className={currentStep === 2 ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-300'}>Pagamento</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {currentStep === 1 ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-medium">Data</h2>
                      </div>
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Escolha uma data para o agendamento</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full md:w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", {locale: ptBR})
                                    ) : (
                                      <span>Escolha uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  locale={ptBR}
                                  selected={field.value}
                                  onSelect={handleDateChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Selecione o dia que você gostaria de agendar.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Store className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-medium">Local e Serviço</h2>
                      </div>
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="salon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salão</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleSalonChange(value);
                                }} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um salão" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Salões disponíveis</SelectLabel>
                                    {availableSalons.map((salon) => (
                                      <SelectItem 
                                        key={salon.id} 
                                        value={salon.name}
                                        className="flex items-center justify-between"
                                      >
                                        <span>{salon.name}</span>
                                        {salon.id === '1' && (
                                          <Star className="h-4 w-4 ml-2 text-yellow-500" />
                                        )}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Onde você gostaria de realizar o agendamento?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="service"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Serviço</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleServiceChange(value);
                                }} 
                                value={field.value}
                                disabled={!selectedSalon && bookingSource !== 'service'}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um serviço" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Serviços disponíveis</SelectLabel>
                                    {availableServices.map((service) => (
                                      <SelectItem 
                                        key={service.id} 
                                        value={service.name}
                                      >
                                        <div className="flex justify-between items-center w-full">
                                          <span>{service.name}</span>
                                          <span className="text-muted-foreground text-sm">
                                            {service.price}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Qual serviço você gostaria de agendar?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="professional"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profissional</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProfessionalChange(value);
                              }} 
                              value={field.value}
                              disabled={!selectedService && bookingSource !== 'professional'}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um profissional" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Profissionais disponíveis</SelectLabel>
                                    {availableEmployees.map((employee) => (
                                      <SelectItem 
                                        key={employee.id} 
                                        value={employee.name}
                                        className="flex justify-between items-center"
                                      >
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <span>{employee.name}</span>
                                        </div>
                                        {employee.id === '1' && (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            Recomendado
                                          </span>
                                        )}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Com qual profissional você gostaria de agendar?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-medium">Horário</h2>
                      </div>
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              disabled={!selectedService || isLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={isLoading ? "Carregando horários..." : "Selecione um horário"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Horários populares</SelectLabel>
                                  {availableTimes
                                    .filter(time => popularTimes.includes(time))
                                    .map((time) => (
                                      <SelectItem key={time} value={time}>
                                        <div className="flex items-center justify-between w-full">
                                          <span>{time}</span>
                                          <span className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full ml-2">
                                            Popular
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  <SelectSeparator />
                                  <SelectLabel>Todos os horários</SelectLabel>
                                  {availableTimes
                                    .filter(time => !popularTimes.includes(time))
                                    .map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Qual horário você gostaria de agendar?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-medium">Observações</h2>
                      </div>
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="requests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pedidos especiais</FormLabel>
                            <FormControl>
                              <Input placeholder="Alguma observação?" {...field} />
                            </FormControl>
                            <FormDescription>
                              Alguma alergia, ou observação importante?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="button" 
                      className="w-full" 
                      size="lg"
                      onClick={proceedToPayment}
                      disabled={!selectedService || !selectedEmployee || !selectedTime}
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Continuar para Pagamento
                      </span>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-medium">Forma de Pagamento</h2>
                      </div>
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selecione uma forma de pagamento</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                handlePaymentMethodChange(value);
                              }} 
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma forma de pagamento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Métodos de pagamento</SelectLabel>
                                  {paymentMethods.map((method) => (
                                    <SelectItem 
                                      key={method.id} 
                                      value={method.id}
                                    >
                                      <div className="flex items-center gap-2">
                                        {method.type === 'credit' && <CreditCard className="h-4 w-4 text-blue-500" />}
                                        {method.type === 'debit' && <CreditCard className="h-4 w-4 text-green-500" />}
                                        {method.type === 'pix' && <DollarSign className="h-4 w-4 text-purple-500" />}
                                        {method.type === 'money' && <DollarSign className="h-4 w-4 text-green-600" />}
                                        <span>{method.name}</span>
                                        {method.isDefault && (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
                                            Padrão
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Este pagamento será processado no momento do serviço
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {selectedService && selectedEmployee && selectedTime && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 mb-4">
                        <h3 className="font-medium mb-2">Resumo do Agendamento</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p><strong>Serviço:</strong> {selectedService.name} ({selectedService.price})</p>
                          <p><strong>Duração estimada:</strong> {selectedService.duration} minutos</p>
                          <p><strong>Profissional:</strong> {selectedEmployee.name}</p>
                          <p><strong>Local:</strong> {selectedSalon?.name}</p>
                          <p><strong>Data e hora:</strong> {format(selectedDate, "PPP", {locale: ptBR})} às {selectedTime}</p>
                          <p><strong>Status de pagamento:</strong> <span className="text-yellow-500">Aguardando confirmação</span></p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full" 
                        size="lg"
                        onClick={goBackToDetails}
                      >
                        Voltar
                      </Button>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isSubmitting || !selectedPaymentMethod}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processando pagamento...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Confirmar e Pagar
                          </span>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default NewAppointmentPage;


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
  addAppointment
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
  BuildingStore, 
  Scissors, 
  User,
  Info
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
  requests: z.string().optional(),
});

interface TimeSlot {
  time: string;
  isPopular?: boolean;
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
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [availableSalons, setAvailableSalons] = useState<Salon[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [popularTimes, setPopularTimes] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = getCurrentUser();
  
  // Atualiza serviços quando o salão é selecionado
  const handleSalonChange = (salonName: string) => {
    const salon = availableSalons.find(s => s.name === salonName);
    if (salon) {
      setSelectedSalon(salon);
      
      // Busca serviços para o salão selecionado
      const salonServices = getServicesForSalon(salon.id);
      setAvailableServices(salonServices);
      
      // Reseta valores de serviço e profissional
      form.setValue("service", "");
      form.setValue("professional", "");
      setSelectedService(null);
      setSelectedEmployee(null);
      setAvailableEmployees([]);
    }
  };
  
  // Atualiza profissionais quando o serviço é selecionado
  const handleServiceChange = (serviceName: string) => {
    const service = availableServices.find(s => s.name === serviceName);
    if (service) {
      setSelectedService(service);
      
      // Busca profissionais para o salão selecionado
      if (selectedSalon) {
        const employees = getEmployeesForSalon(selectedSalon.id);
        setAvailableEmployees(employees);
      }
      
      // Reseta valor de profissional
      form.setValue("professional", "");
      setSelectedEmployee(null);
    }
  };
  
  // Seleciona profissional
  const handleProfessionalChange = (professionalName: string) => {
    const professional = availableEmployees.find(e => e.name === professionalName);
    if (professional) {
      setSelectedEmployee(professional);
    }
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
        
        // Carrega todos os salões que oferecem este serviço
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
        
        // Carrega todos os salões onde este profissional trabalha
        setAvailableSalons([
          { id: '1', name: 'Salão Glamour' },
        ]);
        
        // Carrega todos os serviços que este profissional oferece
        setAvailableServices(services);
      }
    } else {
      // Carrega todos os salões por padrão
      setAvailableSalons([
        { id: '1', name: 'Salão Glamour' },
        { id: '2', name: 'Bela Hair' },
        { id: '3', name: 'Barber Shop' },
        { id: '4', name: 'Espaço Beleza' },
      ]);
    }
    
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
      requests: specialRequests,
    },
  });
  
  useEffect(() => {
    form.setValue("date", selectedDate);
  }, [selectedDate, form]);
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
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
              Novo Agendamento
            </h1>
            <p className="text-muted-foreground text-sm">
              Preencha os campos abaixo para agendar seu horário
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Seção: Data */}
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
                
                {/* Seção: Detalhes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BuildingStore className="h-5 w-5 text-primary" />
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
                
                {/* Seção: Horário */}
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
                
                {/* Seção: Observações */}
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
                
                {/* Resumo e Botão de Envio */}
                {selectedService && selectedEmployee && selectedTime && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 mb-4">
                    <h3 className="font-medium mb-2">Resumo do Agendamento</h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p><strong>Serviço:</strong> {selectedService.name} ({selectedService.price})</p>
                      <p><strong>Duração estimada:</strong> {selectedService.duration} minutos</p>
                      <p><strong>Profissional:</strong> {selectedEmployee.name}</p>
                      <p><strong>Local:</strong> {selectedSalon?.name}</p>
                      <p><strong>Data e hora:</strong> {format(selectedDate, "PPP", {locale: ptBR})} às {selectedTime}</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Confirmar Agendamento
                    </span>
                  )}
                </Button>
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

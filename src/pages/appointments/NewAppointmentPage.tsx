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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Clock, HelpCircle, User } from "lucide-react";
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
  
  // Determine from URL if we're booking with a specific salon, service or professional
  const [bookingSource, setBookingSource] = useState<'salon' | 'service' | 'professional' | null>(null);
  
  // State for appointment form
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Available options based on selections
  const [availableSalons, setAvailableSalons] = useState<Salon[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = getCurrentUser();
  
  useEffect(() => {
    // Determine what kind of booking we're doing based on the URL
    const pathParts = window.location.pathname.split('/');
    const bookingType = pathParts[pathParts.length - 2]; // "salon", "service", or "professional"
    
    if (bookingType === 'salon' && paramId) {
      setBookingSource('salon');
      // Pre-select the salon from the URL parameter
      const salon = getSalonById(paramId);
      if (salon) {
        setSelectedSalon(salon);
        
        // Load services for this salon
        const salonServices = getServicesForSalon(paramId);
        setAvailableServices(salonServices);
      }
    } else if (bookingType === 'service' && paramId) {
      setBookingSource('service');
      // Pre-select the service from URL parameter
      const service = getServiceById(paramId);
      if (service) {
        setSelectedService(service);
      }
    } else if (bookingType === 'professional' && paramId) {
      setBookingSource('professional');
      // Pre-select the professional from URL parameter
      const professional = getEmployeeById(paramId);
      if (professional) {
        setSelectedEmployee(professional);
      }
    }
    
    // Load all salons by default
    setAvailableSalons([
      { id: '1', name: 'Salão Glamour' },
      { id: '2', name: 'Bela Hair' },
      { id: '3', name: 'Barber Shop' },
      { id: '4', name: 'Espaço Beleza' },
    ]);
    
    // Initialize available times
    updateAvailableTimes(selectedDate);
  }, [paramId]);
  
  const updateAvailableTimes = (date: Date) => {
    setIsLoading(true);
    
    // Mock loading time
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
  }, [selectedDate, form.setValue]);
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newAppointment = {
        service: selectedService?.name || values.service,
        professional: selectedEmployee?.name || values.professional,
        professionalId: selectedEmployee?.id || '1',
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time,
        status: 'scheduled',
        salonName: selectedSalon?.name || values.salon,
        salonId: selectedSalon?.id || '1',
        price: selectedService?.price || 'R$ 50,00',
      };
      
      addAppointment(newAppointment);
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
            Novo Agendamento
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
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
              
              <FormField
                control={form.control}
                name="salon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um salão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSalons.map((salon) => (
                          <SelectItem key={salon.id} value={salon.name}>
                            {salon.name}
                          </SelectItem>
                        ))}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableServices.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Qual serviço você gostaria de agendar?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="professional"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissional</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.name}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Com qual profissional você gostaria de agendar?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Qual horário você gostaria de agendar?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                      Alguma alergia, ou observação?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Agendando..." : "Agendar"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default NewAppointmentPage;

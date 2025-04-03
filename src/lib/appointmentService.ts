
import { toast } from "@/hooks/use-toast";
import { format, addDays, isBefore, isAfter, setHours, setMinutes, getHours, getMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Service {
  id: string;
  name: string;
  price: string;
  duration: number;
}

export interface Employee {
  id: string;
  name: string;
  photo?: string;
}

export interface Salon {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  service: string;
  professional: string;
  professionalId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  salonName?: string;
  salonId?: string;
  price?: string;
  clientName?: string;
}

// Mock data storage (replace with actual backend later)
let appointments: Appointment[] = [
  {
    id: '1',
    service: 'Corte de Cabelo',
    professional: 'Ana Silva',
    professionalId: '1',
    date: '2025-04-15',
    time: '14:30',
    status: 'scheduled',
    salonName: 'Salão Glamour',
    salonId: '1',
    price: 'R$ 50,00'
  },
  {
    id: '2',
    service: 'Manicure',
    professional: 'Camila Oliveira',
    professionalId: '2',
    date: '2025-04-20',
    time: '10:00',
    status: 'scheduled',
    salonName: 'Bela Hair',
    salonId: '2',
    price: 'R$ 35,00'
  },
  {
    id: '3',
    service: 'Corte e Barba',
    professional: 'João Pereira',
    professionalId: '3',
    date: '2024-03-10',
    time: '16:00',
    status: 'completed',
    salonName: 'Barber Shop',
    salonId: '3',
    price: 'R$ 70,00'
  },
  {
    id: '4',
    service: 'Tingimento',
    professional: 'Maria Souza',
    professionalId: '4',
    date: '2024-03-05',
    time: '13:30',
    status: 'completed',
    salonName: 'Salão Glamour',
    salonId: '1',
    price: 'R$ 120,00'
  },
  {
    id: '5',
    service: 'Hidratação',
    professional: 'Fernanda Lima',
    professionalId: '5',
    date: '2024-03-20',
    time: '11:00',
    status: 'cancelled',
    salonName: 'Espaço Beleza',
    salonId: '4',
    price: 'R$ 80,00'
  }
];

// Mock services data
export const services: Service[] = [
  { id: '1', name: 'Corte de Cabelo', price: 'R$ 50,00', duration: 30 },
  { id: '2', name: 'Manicure', price: 'R$ 35,00', duration: 45 },
  { id: '3', name: 'Corte e Barba', price: 'R$ 70,00', duration: 60 },
  { id: '4', name: 'Tingimento', price: 'R$ 120,00', duration: 90 },
  { id: '5', name: 'Hidratação', price: 'R$ 80,00', duration: 60 },
  { id: '6', name: 'Escova', price: 'R$ 45,00', duration: 45 },
];

// Mock employees data
export const employees: Employee[] = [
  { id: '1', name: 'Ana Silva', photo: '/placeholder.svg' },
  { id: '2', name: 'Camila Oliveira', photo: '/placeholder.svg' },
  { id: '3', name: 'João Pereira', photo: '/placeholder.svg' },
  { id: '4', name: 'Maria Souza', photo: '/placeholder.svg' },
  { id: '5', name: 'Fernanda Lima', photo: '/placeholder.svg' },
];

// Mock salons data
export const salons: Salon[] = [
  { id: '1', name: 'Salão Glamour' },
  { id: '2', name: 'Bela Hair' },
  { id: '3', name: 'Barber Shop' },
  { id: '4', name: 'Espaço Beleza' },
];

// Helper functions for formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date(dateString);
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
};

// Get all appointments
export const getAllAppointments = (): Appointment[] => {
  return [...appointments];
};

// Get upcoming appointments
export const getUpcomingAppointments = (): Appointment[] => {
  return appointments.filter(appointment => appointment.status === 'scheduled');
};

// Get completed appointments
export const getCompletedAppointments = (): Appointment[] => {
  return appointments.filter(appointment => appointment.status === 'completed');
};

// Get cancelled appointments
export const getCancelledAppointments = (): Appointment[] => {
  return appointments.filter(appointment => appointment.status === 'cancelled');
};

// Add new appointment
export const addAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
  const newAppointment = {
    ...appointment,
    id: Math.random().toString(36).substring(2, 9),
  };
  
  appointments.push(newAppointment);
  toast({
    title: "Agendamento criado",
    description: `${newAppointment.service} agendado com sucesso para ${formatDateTime(newAppointment.date, newAppointment.time)}`,
  });
  
  return newAppointment;
};

// Update appointment
export const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>): Appointment | null => {
  const index = appointments.findIndex(appointment => appointment.id === id);
  
  if (index === -1) {
    return null;
  }
  
  appointments[index] = { ...appointments[index], ...updatedAppointment };
  toast({
    title: "Agendamento atualizado",
    description: "Seu agendamento foi atualizado com sucesso",
  });
  
  return appointments[index];
};

// Cancel appointment
export const cancelAppointment = (id: string): boolean => {
  const index = appointments.findIndex(appointment => appointment.id === id);
  
  if (index === -1) {
    return false;
  }
  
  appointments[index].status = 'cancelled';
  toast({
    title: "Agendamento cancelado",
    description: "Seu agendamento foi cancelado com sucesso",
    variant: "destructive",
  });
  
  return true;
};

// Get available time slots for a given date
export const getAvailableTimeSlots = (date: Date): string[] => {
  // This is a mock implementation. In a real app, you'd query the backend for available slots
  const businessHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  
  // Filter out already booked slots for the selected date
  const dateString = date.toISOString().split('T')[0];
  const bookedSlots = appointments
    .filter(app => app.date === dateString && app.status === 'scheduled')
    .map(app => app.time);
  
  // Return available slots
  return businessHours.filter(time => !bookedSlots.includes(time));
};

// Get popular time slots (for recommendations)
export const getPopularTimeSlots = (): string[] => {
  return ['10:00', '14:00', '16:00']; // Most popular times
};

// Get services for a salon
export const getServicesForSalon = (salonId: string): Service[] => {
  // In a real app, you'd fetch this from the backend
  return services;
};

// Get employees for a salon
export const getEmployeesForSalon = (salonId: string): Employee[] => {
  // In a real app, you'd fetch this from the backend
  return employees;
};

// Get salon by ID
export const getSalonById = (id: string): Salon | undefined => {
  return salons.find(salon => salon.id === id);
};

// Get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

// Get employee by ID
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(employee => employee.id === id);
};

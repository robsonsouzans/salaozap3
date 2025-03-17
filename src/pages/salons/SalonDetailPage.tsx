
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Phone, Calendar, 
  Star, Heart, ChevronLeft, Scissors, 
  Users, DollarSign, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';

interface ServiceType {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface EmployeeType {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface TimeSlotType {
  time: string;
  available: boolean;
}

interface ReviewType {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userImage?: string;
}

const SalonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock data for demonstration
  const salon = {
    id: '1',
    name: 'Salão Glamour',
    address: 'Av. Paulista, 1000, São Paulo',
    phone: '(11) 99999-9999',
    rating: 4.9,
    reviewCount: 120,
    description: 'O Salão Glamour é especializado em beleza e estética, oferecendo serviços de alta qualidade realizados por profissionais experientes.',
    hours: '09:00 - 20:00 (Seg-Sáb)',
    images: [
      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ]
  };
  
  const services: ServiceType[] = [
    {
      id: '1',
      name: 'Corte de Cabelo',
      price: 'R$ 50,00',
      duration: '45 min',
      description: 'Inclui lavagem, corte e finalização.'
    },
    {
      id: '2',
      name: 'Coloração',
      price: 'A partir de R$ 120,00',
      duration: '2h',
      description: 'Coloração completa com produtos de alta qualidade.'
    },
    {
      id: '3',
      name: 'Manicure',
      price: 'R$ 35,00',
      duration: '45 min',
      description: 'Tratamento completo para unhas.'
    },
    {
      id: '4',
      name: 'Pedicure',
      price: 'R$ 45,00',
      duration: '1h',
      description: 'Tratamento completo para pés e unhas.'
    },
    {
      id: '5',
      name: 'Hidratação',
      price: 'R$ 80,00',
      duration: '1h',
      description: 'Hidratação profunda para cabelos.'
    }
  ];
  
  const employees: EmployeeType[] = [
    {
      id: '1',
      name: 'Ana Silva',
      role: 'Cabeleireira',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    },
    {
      id: '2',
      name: 'João Pereira',
      role: 'Barbeiro',
      image: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80'
    },
    {
      id: '3',
      name: 'Camila Oliveira',
      role: 'Manicure',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    },
    {
      id: '4',
      name: 'Maria Souza',
      role: 'Cabeleireira',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    }
  ];
  
  const timeSlots: TimeSlotType[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '12:00', available: true },
    { time: '13:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
    { time: '17:00', available: true },
    { time: '18:00', available: true },
    { time: '19:00', available: true }
  ];
  
  const reviews: ReviewType[] = [
    {
      id: '1',
      userName: 'Carlos Mendes',
      rating: 5,
      date: '2023-11-15',
      comment: 'Atendimento excelente, ambiente agradável e preços justos. Recomendo muito!',
      userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    },
    {
      id: '2',
      userName: 'Fernanda Lima',
      rating: 4,
      date: '2023-11-10',
      comment: 'Gostei bastante do serviço, o único ponto que poderia melhorar é o tempo de espera.',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    },
    {
      id: '3',
      userName: 'Roberto Alves',
      rating: 5,
      date: '2023-11-05',
      comment: 'Sempre saio satisfeito daqui. Profissionais muito capacitados!',
      userImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    }
  ];
  
  const handleBookAppointment = () => {
    if (!selectedService || !selectedEmployee || !selectedTimeSlot || !date) {
      toast({
        title: "Ops! Faltam informações.",
        description: "Selecione o serviço, profissional, data e horário.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call here
    toast({
      title: "Agendamento realizado!",
      description: "Você receberá uma confirmação em breve.",
    });
    
    setBookingDialogOpen(false);
    
    // Reset selections
    setSelectedService(null);
    setSelectedEmployee(null);
    setSelectedTimeSlot(null);
    
    // Navigate to appointments page
    setTimeout(() => {
      navigate('/appointments');
    }, 1500);
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
        {user && <SidebarMenu />}
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
            <motion.div variants={itemAnimation} className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/salons')}
                className="p-1"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                {salon.name}
              </h1>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[400px]">
                <div className="md:col-span-2 h-full">
                  <img
                    src={salon.images[0]}
                    alt={salon.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="hidden md:grid grid-rows-2 gap-4">
                  <img
                    src={salon.images[1]}
                    alt={salon.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <img
                    src={salon.images[2]}
                    alt={salon.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{salon.rating}</span>
                    <span className="text-gray-500">({salon.reviewCount} avaliações)</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{salon.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{salon.hours}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>{salon.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="hidden md:flex"
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? 'Favoritado' : 'Favoritar'}
                  </Button>
                </div>
              </div>
              
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {salon.description}
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full md:w-auto">
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendar Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agendar Serviço em {salon.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">1. Selecione o serviço</h3>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedService === service.id
                                ? 'border-salon-500 bg-salon-50 dark:bg-salon-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedService(service.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-500">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{service.price}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {service.duration}
                                </div>
                              </div>
                            </div>
                            {selectedService === service.id && (
                              <div className="mt-2 text-salon-500">
                                <Check className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-medium mb-3 mt-6">2. Selecione o profissional</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                        {employees.map((employee) => (
                          <div
                            key={employee.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors text-center ${
                              selectedEmployee === employee.id
                                ? 'border-salon-500 bg-salon-50 dark:bg-salon-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedEmployee(employee.id)}
                          >
                            <div className="w-16 h-16 mx-auto mb-2 relative">
                              <img
                                src={employee.image}
                                alt={employee.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                              {selectedEmployee === employee.id && (
                                <div className="absolute -bottom-1 -right-1 bg-salon-500 text-white rounded-full p-0.5">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-medium text-sm">{employee.name}</h4>
                            <p className="text-xs text-gray-500">{employee.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">3. Selecione a data</h3>
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border p-3 pointer-events-auto"
                      />
                      
                      <h3 className="text-lg font-medium mb-3 mt-6">4. Selecione o horário</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            className={`py-2 px-3 text-center rounded-md transition-colors ${
                              !slot.available
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                                : selectedTimeSlot === slot.time
                                ? 'bg-salon-500 text-white'
                                : 'bg-white text-gray-700 border hover:border-salon-500 dark:bg-gray-800 dark:text-gray-200'
                            }`}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Serviço:</span>
                          <span>
                            {selectedService 
                              ? services.find(s => s.id === selectedService)?.name 
                              : 'Não selecionado'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Profissional:</span>
                          <span>
                            {selectedEmployee 
                              ? employees.find(e => e.id === selectedEmployee)?.name 
                              : 'Não selecionado'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Data:</span>
                          <span>
                            {date 
                              ? date.toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  year: 'numeric' 
                                }) 
                              : 'Não selecionada'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Horário:</span>
                          <span>
                            {selectedTimeSlot || 'Não selecionado'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Valor estimado:</span>
                          <span className="font-medium text-salon-500">
                            {selectedService 
                              ? services.find(s => s.id === selectedService)?.price 
                              : '-'}
                          </span>
                        </div>
                        <Separator />
                        <Button 
                          size="lg" 
                          className="w-full mt-4"
                          onClick={handleBookAppointment}
                        >
                          Confirmar Agendamento
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Tabs defaultValue="services">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="services">Serviços</TabsTrigger>
                  <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border-none shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Scissors className="h-4 w-4 text-salon-500" />
                              <h3 className="font-medium">{service.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{service.price}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {service.duration}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="professionals" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="overflow-hidden border-none shadow-sm">
                      <div className="h-48">
                        <img
                          src={employee.image}
                          alt={employee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="text-center p-4">
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-medium">{salon.rating}</span>
                    </div>
                    <span className="text-gray-500">({salon.reviewCount} avaliações)</span>
                  </div>
                  
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-none shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          {review.userImage && (
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                src={review.userImage}
                                alt={review.userName}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-baseline gap-2 mb-1">
                              <h3 className="font-medium">{review.userName}</h3>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    Ver Mais Avaliações
                  </Button>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SalonDetailPage;

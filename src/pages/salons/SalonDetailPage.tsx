
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Phone, Calendar, 
  Star, Heart, ChevronLeft, Scissors, 
  Users, DollarSign, Check, CalendarDays,
  Camera, MessageSquare, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
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
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ],
    amenities: ['Wi-Fi Grátis', 'Estacionamento', 'Cafezinho', 'Área Kids', 'Acessível']
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

  const handleBookNow = () => {
    // Navigate to the appointment page with the salon ID
    navigate(`/appointments/new/salon/${id}`);
  };
  
  const handleBookAppointment = () => {
    if (!selectedService || !selectedEmployee || !selectedTimeSlot || !date) {
      toast({
        title: "Ops! Faltam informações.",
        description: "Selecione o serviço, profissional, data e horário.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, you would make an API call here
    setTimeout(() => {
      toast({
        title: "Agendamento realizado!",
        description: "Você receberá uma confirmação em breve.",
      });
      
      setBookingDialogOpen(false);
      setIsLoading(false);
      
      // Reset selections
      setSelectedService(null);
      setSelectedEmployee(null);
      setSelectedTimeSlot(null);
      
      // Navigate to appointments page
      setTimeout(() => {
        navigate('/appointments');
      }, 1500);
    }, 1000);
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

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === salon.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? salon.images.length - 1 : prev - 1));
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
            <motion.div variants={itemAnimation} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              </div>
              
              <Button
                variant={isFavorite ? "salon" : "salon-outline"}
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className="hidden md:flex"
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="w-full">
              <div className="relative overflow-hidden rounded-xl">
                {/* Main gallery preview */}
                <div className="group relative h-[300px] md:h-[400px] cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                  <img
                    src={salon.images[0]}
                    alt={salon.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center">
                      <Camera className="h-4 w-4 mr-1.5" />
                      <span>Ver todas as fotos ({salon.images.length})</span>
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail previews */}
                <div className="hidden md:grid grid-cols-4 gap-2 mt-2">
                  {salon.images.slice(1, 5).map((image, index) => (
                    <div 
                      key={index} 
                      className="relative h-24 cursor-pointer rounded overflow-hidden"
                      onClick={() => {
                        setActiveImageIndex(index + 1);
                        setIsGalleryOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${salon.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 3 && salon.images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">
                            +{salon.images.length - 5} fotos
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
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
                
                <div className="flex flex-wrap gap-2">
                  {salon.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="bg-salon-50 text-salon-600 dark:bg-salon-950/20 dark:text-salon-400">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {salon.description}
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="flex gap-3">
              <Button size="lg" variant="salon" className="flex-1" onClick={handleBookNow}>
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Agora
              </Button>
              
              <Button size="lg" variant="outline" className="flex gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="hidden sm:inline">Enviar Mensagem</span>
                <span className="sm:hidden">Mensagem</span>
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="md:hidden">
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-salon-500 text-salon-500' : ''}`} />
              </Button>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Tabs defaultValue="services" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-transparent border-b dark:border-gray-800">
                  <TabsTrigger value="services" className="data-[state=active]:border-b-2 data-[state=active]:border-salon-500 rounded-none data-[state=active]:text-salon-600 dark:data-[state=active]:text-salon-400 pb-2 -mb-[2px]">Serviços</TabsTrigger>
                  <TabsTrigger value="professionals" className="data-[state=active]:border-b-2 data-[state=active]:border-salon-500 rounded-none data-[state=active]:text-salon-600 dark:data-[state=active]:text-salon-400 pb-2 -mb-[2px]">Profissionais</TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-salon-500 rounded-none data-[state=active]:text-salon-600 dark:data-[state=active]:text-salon-400 pb-2 -mb-[2px]">Avaliações</TabsTrigger>
                  <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-salon-500 rounded-none data-[state=active]:text-salon-600 dark:data-[state=active]:text-salon-400 pb-2 -mb-[2px]">Informações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-salon-50 text-salon-600 dark:bg-salon-950/20 dark:text-salon-400 p-2 rounded-full">
                                <Scissors className="h-4 w-4" />
                              </div>
                              <h3 className="font-medium">{service.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-salon-50 text-salon-600 border-none dark:bg-salon-950/20 dark:text-salon-400">
                              {service.price}
                            </Badge>
                            <div className="flex items-center justify-end text-sm text-gray-500 mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {service.duration}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="salon" size="sm" className="w-full" onClick={handleBookNow}>
                            Agendar Serviço
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="professionals" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="overflow-hidden border-none shadow-sm hover:shadow transition-shadow group">
                      <div className="relative h-48">
                        <img
                          src={employee.image}
                          alt={employee.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                          <Button variant="salon" size="sm" className="w-full" onClick={handleBookNow}>
                            Agendar com {employee.name.split(' ')[0]}
                          </Button>
                        </div>
                      </div>
                      <CardContent className="text-center p-4">
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{employee.role}</p>
                        <div className="flex justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3.5 w-3.5 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-salon-50 dark:bg-salon-950/20 p-4 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-salon-600 dark:text-salon-400">{salon.rating}</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                star <= Math.floor(salon.rating) 
                                ? 'fill-amber-400 text-amber-400' 
                                : star <= salon.rating 
                                ? 'fill-amber-400/50 text-amber-400/50' 
                                : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{salon.reviewCount} avaliações</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-1">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            // Calculate percentage for each rating (mock data)
                            const percentage = rating === 5 ? 75 : 
                                             rating === 4 ? 20 : 
                                             rating === 3 ? 4 : 
                                             rating === 2 ? 1 : 0;
                            
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <span className="text-xs w-3 text-right">{rating}</span>
                                  <Star className="h-3 w-3 text-amber-400 ml-0.5" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-salon-500" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="salon">Avaliar Salão</Button>
                  </div>
                  
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-none shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          {review.userImage && (
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={review.userImage}
                                alt={review.userName}
                              />
                              <AvatarFallback>{review.userName.substring(0, 2)}</AvatarFallback>
                            </Avatar>
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
                                      ? 'fill-amber-400 text-amber-400'
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
                
                <TabsContent value="info" className="space-y-6">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-salon-500" />
                        <h3 className="font-medium">Horário de Funcionamento</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { day: 'Segunda-feira', hours: '09:00 - 20:00', isOpen: true },
                          { day: 'Terça-feira', hours: '09:00 - 20:00', isOpen: true },
                          { day: 'Quarta-feira', hours: '09:00 - 20:00', isOpen: true },
                          { day: 'Quinta-feira', hours: '09:00 - 20:00', isOpen: true },
                          { day: 'Sexta-feira', hours: '09:00 - 20:00', isOpen: true },
                          { day: 'Sábado', hours: '09:00 - 18:00', isOpen: true },
                          { day: 'Domingo', hours: 'Fechado', isOpen: false },
                        ].map((day) => (
                          <div key={day.day} className="flex justify-between items-center">
                            <span className="font-medium">{day.day}</span>
                            <span className={day.isOpen ? 'text-green-500' : 'text-red-500'}>
                              {day.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-salon-500" />
                        <h3 className="font-medium">Localização</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 dark:bg-gray-800 h-40 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Mapa indisponível</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-700 dark:text-gray-300">{salon.address}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Ver no Mapa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="h-4 w-4 text-salon-500" />
                        <h3 className="font-medium">Sobre o Salão</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {salon.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Formas de Pagamento</h4>
                          <p className="text-sm text-gray-500">
                            Dinheiro, Pix, Cartão de Crédito, Cartão de Débito
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Facilidades</h4>
                          <p className="text-sm text-gray-500">
                            {salon.amenities.join(', ')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      {/* Full Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black/95 border-gray-800">
          <DialogHeader className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
            <DialogTitle className="text-white">
              Fotos de {salon.name} ({activeImageIndex + 1}/{salon.images.length})
            </DialogTitle>
          </DialogHeader>
          
          <div className="h-[80vh] relative">
            <img 
              src={salon.images[activeImageIndex]} 
              alt={salon.name} 
              className="w-full h-full object-contain"
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 -translate-y-1/2 left-2 text-white bg-black/50 hover:bg-black/70" 
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 -translate-y-1/2 right-2 text-white bg-black/50 hover:bg-black/70" 
              onClick={nextImage}
            >
              <ChevronLeft className="h-6 w-6 transform rotate-180" />
            </Button>
          </div>
          
          <div className="bg-black p-4 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2">
              {salon.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`w-16 h-16 flex-shrink-0 cursor-pointer rounded transition-all ${activeImageIndex === index ? 'ring-2 ring-salon-500 scale-105' : 'opacity-70'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover rounded" 
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default SalonDetailPage;

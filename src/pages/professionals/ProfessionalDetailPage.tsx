
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, Heart, ChevronLeft, Scissors, 
  Clock, Calendar, MapPin, Users,
  MessageSquare, Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser } from '@/lib/auth';

// Example data for professionals (would come from API)
const professionals = [
  {
    id: 1,
    name: 'Amanda Silva',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    reviews: 187,
    specialty: 'Colorista e Cabeleireira',
    salon: 'Salão Beleza Divina',
    salonId: 1,
    price: '$$',
    availability: 'Hoje às 14:00',
    bio: 'Especialista em coloração e mechas, com mais de 10 anos de experiência no mercado da beleza. Apaixonada por transformações e técnicas inovadoras.',
    services: ['Corte', 'Coloração', 'Mechas', 'Escova'],
    workingSince: '2013',
    salonImage: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    salonLocation: 'Centro, São Paulo',
    portfolio: [
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1626382538637-4422b3af2544?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1549236177-97d7c8a23d04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    ],
    education: [
      { course: 'Especialização em Colorimetria', institution: 'Academia L\'Oréal', year: '2018' },
      { course: 'Técnicas Avançadas de Corte', institution: 'Vidal Sassoon Academy', year: '2015' },
    ],
  }
];

const reviews = [
  {
    id: 1,
    professionalId: 1,
    userName: "Isabela Martins",
    rating: 5,
    date: "2023-04-15",
    comment: "A Amanda é incrível! Fez exatamente o que eu queria, mechas perfeitas e super natural.",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 2,
    professionalId: 1,
    userName: "Luiza Santos",
    rating: 5,
    date: "2023-03-22",
    comment: "Profissional excelente! Foi super atenciosa e me deu ótimas dicas para manter meu cabelo.",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 3,
    professionalId: 1,
    userName: "Carolina Pereira",
    rating: 4,
    date: "2023-03-10",
    comment: "Muito bom atendimento. Só demorou um pouco mais do que o previsto.",
    userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 4,
    professionalId: 1,
    userName: "Ricardo Almeida",
    rating: 5,
    date: "2023-02-25",
    comment: "Atendimento impecável e resultado excelente. Recomendo muito!",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
  },
];

// Available time slots
const availableTimeSlots = [
  { date: new Date().toISOString().split('T')[0], times: ['09:00', '11:30', '14:00', '16:30'] },
  { 
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], 
    times: ['10:00', '13:00', '15:00', '17:30'] 
  },
  { 
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], 
    times: ['09:30', '12:00', '14:30', '18:00'] 
  }
];

const ProfessionalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find professional by ID
  const professional = professionals.find(p => p.id === Number(id)) || professionals[0];

  // Get reviews for this professional
  const professionalReviews = reviews.filter(r => r.professionalId === professional.id);
  
  const handleBooking = () => {
    navigate(`/appointments/new/professional/${professional.id}`);
  };
  
  const handleMessage = () => {
    toast({
      title: "Mensagem",
      description: `Iniciando conversa com ${professional.name}`,
    });
    // In a real app, navigate to messages or open a chat dialog
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
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
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(-1)}
                  className="p-1"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                  {professional.name}
                </h1>
              </div>
              
              <Button
                variant={isFavorite ? "professional" : "professional-outline"}
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <Avatar className="w-40 h-40 mb-4">
                    <AvatarImage src={professional.image} alt={professional.name} />
                    <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{professional.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({professional.reviews} avaliações)</span>
                  </div>
                  
                  <h2 className="text-lg font-medium text-center">{professional.specialty}</h2>
                  
                  <div className="flex flex-wrap gap-2 justify-center my-4">
                    {professional.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full mt-4">
                    <Button variant="professional" size="lg" onClick={handleBooking}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Horário
                    </Button>
                    
                    <Button variant="outline" onClick={handleMessage}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </div>
                  
                  <Card className="w-full mt-6">
                    <CardHeader>
                      <h3 className="text-base font-medium">Localização</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={professional.salonImage} 
                            alt={professional.salon} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{professional.salon}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{professional.salonLocation}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/salons/${professional.salonId}`)}>
                        Ver detalhes do salão
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:w-2/3">
                  <Tabs defaultValue="sobre" className="w-full">
                    <TabsList className="w-full justify-start mb-6 bg-transparent border-b dark:border-gray-800">
                      <TabsTrigger value="sobre" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 pb-2 -mb-[2px]">
                        Sobre
                      </TabsTrigger>
                      <TabsTrigger value="portfolio" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 pb-2 -mb-[2px]">
                        Portfólio
                      </TabsTrigger>
                      <TabsTrigger value="avaliacoes" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 pb-2 -mb-[2px]">
                        Avaliações
                      </TabsTrigger>
                      <TabsTrigger value="agenda" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 pb-2 -mb-[2px]">
                        Agenda
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="sobre" className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Biografia</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                          {professional.bio}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-3">Formação e Cursos</h3>
                        <div className="space-y-3">
                          {professional.education.map((edu, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                              <p className="font-medium">{edu.course}</p>
                              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                <span>{edu.institution}</span>
                                <span>{edu.year}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-3">Informações</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-1">Experiência</h4>
                            <p>Desde {professional.workingSince}</p>
                          </div>
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-1">Faixa de Preço</h4>
                            <p>{professional.price}</p>
                          </div>
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-1">Especialidade</h4>
                            <p>{professional.specialty}</p>
                          </div>
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-1">Disponibilidade</h4>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{professional.availability}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="portfolio" className="space-y-6">
                      <h3 className="font-medium mb-4">Trabalhos Realizados</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {professional.portfolio.map((image, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden aspect-square shadow-sm">
                            <img 
                              src={image} 
                              alt={`Trabalho de ${professional.name} #${idx+1}`}
                              className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="avaliacoes" className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-medium">{professional.rating}</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${
                                  star <= Math.floor(professional.rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : star <= professional.rating 
                                  ? 'fill-yellow-400/50 text-yellow-400/50' 
                                  : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">({professional.reviews} avaliações)</div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Avaliar
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {professionalReviews.map((review) => (
                          <Card key={review.id} className="border-none shadow-sm">
                            <CardContent className="p-4">
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
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  <div className="flex mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${
                                          i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button variant="outline" className="w-full">
                          Ver Mais Avaliações
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="agenda" className="space-y-6">
                      <h3 className="font-medium mb-4">Disponibilidade</h3>
                      <div className="space-y-6">
                        {availableTimeSlots.map((slot, idx) => {
                          const dateObj = new Date(slot.date);
                          const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          });
                          
                          return (
                            <div key={idx} className="space-y-3">
                              <h4 className="font-medium text-blue-600 dark:text-blue-400 capitalize">
                                {formattedDate}
                              </h4>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {slot.times.map((time, timeIdx) => (
                                  <Button 
                                    key={timeIdx} 
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:hover:bg-blue-900/30"
                                    onClick={handleBooking}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <Button variant="professional" className="w-full" onClick={handleBooking}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver Mais Horários Disponíveis
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ProfessionalDetailPage;

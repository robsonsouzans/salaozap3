
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, ChevronLeft, MapPin, 
  Star, DollarSign, Calendar, 
  Scissors, Users, Heart, Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';

// Service data
const services = [
  {
    id: 1, 
    name: 'Corte de Cabelo', 
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 50', 
    duration: '45 min',
    description: 'Cortes personalizados para todos os tipos de cabelo, incluindo lavagem e finalização. Nossos profissionais são especializados em diversas técnicas para criar o visual que você deseja. O serviço inclui consulta inicial para entender suas preferências e necessidades.',
    longDescription: 'O corte de cabelo é um dos serviços mais procurados em salões de beleza. É uma forma de renovar o visual, adequar o cabelo ao formato do rosto e expressar personalidade. O procedimento inclui análise do tipo de cabelo, formato do rosto e estilo pessoal do cliente, seguido pelo corte em si, que pode ser feito com tesoura, navalha ou máquina, dependendo do efeito desejado. Após o corte, o cabelo é lavado e finalizado com secador, chapinha ou modeladores, de acordo com o estilo escolhido. É recomendado fazer um corte de cabelo a cada 2 ou 3 meses para manter a forma e saúde dos fios.',
    category: 'Cabelo',
    salons: [1, 2, 3, 6],
    professionals: [1, 4, 6],
    benefits: [
      'Melhora a aparência e revitaliza o cabelo',
      'Remove as pontas duplas e cabelo danificado',
      'Facilita a manutenção diária do cabelo',
      'Permite experimentar novos estilos',
      'Pode adicionar volume e movimento ao cabelo'
    ],
    variations: [
      { name: 'Corte Feminino Longo', price: 'R$ 70,00', duration: '60 min' },
      { name: 'Corte Feminino Curto', price: 'R$ 50,00', duration: '45 min' },
      { name: 'Corte Masculino', price: 'R$ 45,00', duration: '30 min' },
      { name: 'Corte Infantil', price: 'R$ 40,00', duration: '30 min' }
    ]
  }
];

// Professional data
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
  },
  {
    id: 4,
    name: 'Pedro Almeida',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.6,
    reviews: 89,
    specialty: 'Corte Masculino e Barba',
    salon: 'Barbearia Moderna',
    salonId: 4,
    price: '$$',
  },
  {
    id: 6,
    name: 'Ricardo Torres',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    reviews: 135,
    specialty: 'Cabeleireiro e Visagista',
    salon: 'Art & Color Studio',
    salonId: 6,
    price: '$$$',
  }
];

// Salon data
const salons = [
  {
    id: 1,
    name: 'Salão Beleza Divina',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    reviews: 127,
    location: 'Centro, São Paulo',
    distance: '1.2 km',
    price: '$$',
  },
  {
    id: 2,
    name: 'Studio Hair Professional',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.5,
    reviews: 93,
    location: 'Pinheiros, São Paulo',
    distance: '3.5 km',
    price: '$$$',
  },
  {
    id: 3,
    name: 'Belle Spa & Cabelo',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    reviews: 218,
    location: 'Moema, São Paulo',
    distance: '5.1 km',
    price: '$$$$',
  },
  {
    id: 6,
    name: 'Art & Color Studio',
    image: 'https://images.unsplash.com/photo-1626383137804-ff908d2753d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.6,
    reviews: 115,
    location: 'Jardins, São Paulo',
    distance: '3.2 km',
    price: '$$$',
  }
];

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  
  // Find service by ID
  const service = services.find(s => s.id === Number(id)) || services[0];

  // Get professionals for this service
  const serviceProviders = service 
    ? professionals.filter(p => service.professionals.includes(p.id))
    : [];

  // Get salons for this service
  const serviceSalons = service 
    ? salons.filter(s => service.salons.includes(s.id))
    : [];
  
  const handleBookService = (salonId?: number, professionalId?: number) => {
    let bookingPath = '/appointments/new';
    
    if (professionalId) {
      bookingPath += `/professional/${professionalId}`;
      
      toast({
        title: "Agendamento iniciado",
        description: `Iniciando agendamento com profissional para ${service.name}`,
      });
    } 
    else if (salonId) {
      bookingPath += `/salon/${salonId}`;
      
      toast({
        title: "Agendamento iniciado",
        description: `Iniciando agendamento em salão para ${service.name}`,
      });
    }
    
    navigate(bookingPath);
  };
  
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
    
    toast({
      title: favorites.includes(id) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `Item ${id} ${favorites.includes(id) ? 'removido dos' : 'adicionado aos'} favoritos`,
    });
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
                  {service.name}
                </h1>
              </div>
              
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none dark:bg-emerald-950/20 dark:text-emerald-400">
                {service.category}
              </Badge>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="rounded-xl overflow-hidden mb-6">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <h3 className="text-lg font-medium">Informações</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm text-muted-foreground mb-1">Duração</h4>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm text-muted-foreground mb-1">Preço</h4>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                            <span>{service.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-2">Disponível em</h4>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-emerald-500" />
                            <span>{service.salons.length} salões</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-emerald-500" />
                            <span>{service.professionals.length} profissionais</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-medium">Benefícios</h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="mt-1 mr-2 h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:w-2/3">
                  <Tabs defaultValue="descricao">
                    <TabsList className="w-full justify-start mb-6 bg-transparent border-b dark:border-gray-800">
                      <TabsTrigger value="descricao" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 pb-2 -mb-[2px]">
                        Descrição
                      </TabsTrigger>
                      <TabsTrigger value="variacoes" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 pb-2 -mb-[2px]">
                        Variações
                      </TabsTrigger>
                      <TabsTrigger value="profissionais" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 pb-2 -mb-[2px]">
                        Profissionais
                      </TabsTrigger>
                      <TabsTrigger value="saloes" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 pb-2 -mb-[2px]">
                        Salões
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="descricao" className="space-y-6">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                          {service.longDescription}
                        </p>
                      </div>
                      
                      <Button variant="service" size="lg" className="mt-6" onClick={() => handleBookService()}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar este Serviço
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="variacoes" className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Este serviço está disponível nas seguintes variações:
                      </p>
                      
                      {service.variations.map((variation, idx) => (
                        <Card key={idx} className="overflow-hidden hover:shadow-sm transition-all cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 p-2 rounded-full">
                                    <Scissors className="h-4 w-4" />
                                  </div>
                                  <h3 className="font-medium">{variation.name}</h3>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none dark:bg-emerald-950/20 dark:text-emerald-400">
                                  {variation.price}
                                </Badge>
                                <div className="flex items-center justify-end text-sm text-muted-foreground mt-1">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {variation.duration}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Button variant="service" size="lg" className="mt-6" onClick={() => handleBookService()}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar este Serviço
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="profissionais" className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Conheça os profissionais especializados neste serviço:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceProviders.map((professional) => (
                          <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="relative pt-6 flex justify-center">
                              <Avatar className="h-24 w-24 border-4 border-background">
                                <AvatarImage src={professional.image} alt={professional.name} />
                                <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(professional.id + 100);
                                }}
                              >
                                <Heart 
                                  className={`h-5 w-5 ${favorites.includes(professional.id + 100) ? 'fill-blue-500 text-blue-500' : 'text-gray-500'}`} 
                                />
                              </Button>
                            </div>
                            <CardHeader className="p-4 pb-2 text-center">
                              <CardTitle className="text-lg">{professional.name}</CardTitle>
                              <div className="text-sm text-muted-foreground">{professional.specialty}</div>
                              <div className="flex items-center justify-center mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{professional.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">({professional.reviews})</span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {professional.salon}
                              </div>
                            </CardHeader>
                            <CardFooter className="p-4 pt-2 flex gap-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => navigate(`/professionals/${professional.id}`)}
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Perfil
                              </Button>
                              <Button 
                                variant="professional" 
                                className="flex-1" 
                                size="sm"
                                onClick={() => handleBookService(undefined, professional.id)}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Agendar
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="saloes" className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Salões que oferecem este serviço:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceSalons.map((salon) => (
                          <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                            <div className="relative">
                              <img 
                                src={salon.image} 
                                alt={salon.name} 
                                className="w-full h-40 object-cover"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(salon.id);
                                }}
                              >
                                <Heart 
                                  className={`h-5 w-5 ${favorites.includes(salon.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                                />
                              </Button>
                            </div>
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{salon.name}</CardTitle>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-sm font-medium">{salon.rating}</span>
                                  <span className="text-xs text-muted-foreground ml-1">({salon.reviews})</span>
                                </div>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{salon.location}</span>
                                <span className="mx-1">•</span>
                                <span>{salon.distance}</span>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 pb-2">
                              <div className="flex flex-wrap gap-1 my-2">
                                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-none dark:bg-emerald-950/20 dark:text-emerald-400">
                                  {service.name} 
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {service.price}
                                </Badge>
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 flex gap-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => navigate(`/salons/${salon.id}`)}
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Detalhes
                              </Button>
                              <Button 
                                variant="salon" 
                                className="flex-1" 
                                size="sm"
                                onClick={() => handleBookService(salon.id)}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Agendar
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
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

export default ServiceDetailPage;

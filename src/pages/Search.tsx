import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Scissors, Filter, Search as SearchIcon, 
  Heart, Calendar, Info, Users, Star, DollarSign
} from 'lucide-react';

import Sidebar from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Example data for salons
const salons = [
  {
    id: 1,
    name: 'Salão Beleza Divina',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    reviews: 127,
    location: 'Centro, São Paulo',
    distance: '1.2 km',
    services: ['Corte', 'Coloração', 'Manicure', 'Pedicure'],
    price: '$$',
    availability: 'Hoje às 14:00'
  },
  {
    id: 2,
    name: 'Studio Hair Professional',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.5,
    reviews: 93,
    location: 'Pinheiros, São Paulo',
    distance: '3.5 km',
    services: ['Corte', 'Penteado', 'Tratamentos'],
    price: '$$$',
    availability: 'Hoje às 16:30'
  },
  {
    id: 3,
    name: 'Belle Spa & Cabelo',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    reviews: 218,
    location: 'Moema, São Paulo',
    distance: '5.1 km',
    services: ['Spa', 'Massagem', 'Corte', 'Coloração'],
    price: '$$$$',
    availability: 'Amanhã às 10:00'
  },
  {
    id: 4,
    name: 'Barbearia Moderna',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.7,
    reviews: 156,
    location: 'Vila Madalena, São Paulo',
    distance: '2.8 km',
    services: ['Corte Masculino', 'Barba', 'Tratamentos'],
    price: '$$',
    availability: 'Hoje às 17:45'
  },
  {
    id: 5,
    name: 'Espaço Bem Estar',
    image: 'https://images.unsplash.com/photo-1500840216050-6ffa99d75160?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.3,
    reviews: 72,
    location: 'Itaim Bibi, São Paulo',
    distance: '4.3 km',
    services: ['Massagem', 'Unhas', 'Depilação'],
    price: '$$$',
    availability: 'Amanhã às 14:30'
  },
  {
    id: 6,
    name: 'Art & Color Studio',
    image: 'https://images.unsplash.com/photo-1626383137804-ff908d2753d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.6,
    reviews: 115,
    location: 'Jardins, São Paulo',
    distance: '3.2 km',
    services: ['Coloração', 'Mechas', 'Tratamentos'],
    price: '$$$',
    availability: 'Hoje às 15:15'
  }
];

// Example data for professionals (updated with new images)
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
    workingSince: '2013'
  },
  {
    id: 2,
    name: 'Rafael Costa',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.7,
    reviews: 103,
    specialty: 'Barbeiro',
    salon: 'Barbearia Moderna',
    salonId: 4,
    price: '$$',
    availability: 'Hoje às 16:00',
    bio: 'Barbeiro com técnicas tradicionais e modernas. Especialista em cortes masculinos, barba e tratamentos capilares.',
    services: ['Corte Masculino', 'Barba', 'Tratamentos'],
    workingSince: '2015'
  },
  {
    id: 3,
    name: 'Carolina Mendes',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    reviews: 156,
    specialty: 'Manicure e Pedicure',
    salon: 'Belle Spa & Cabelo',
    salonId: 3,
    price: '$$$',
    availability: 'Amanhã às 10:30',
    bio: 'Especialista em unhas, com formação em nail art e técnicas avançadas. Trabalha com os melhores produtos e tendências do mercado.',
    services: ['Manicure', 'Pedicure', 'Unhas em Gel', 'Nail Art'],
    workingSince: '2018'
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
    availability: 'Hoje às 18:00',
    bio: 'Expert em cortes masculinos modernos e tradicionais. Atualizado com as últimas tendências do universo da barbearia.',
    services: ['Corte Masculino', 'Barba', 'Tratamentos'],
    workingSince: '2017'
  },
  {
    id: 5,
    name: 'Mariana Santos',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    reviews: 201,
    specialty: 'Maquiadora Profissional',
    salon: 'Espaço Bem Estar',
    salonId: 5,
    price: '$$$',
    availability: 'Amanhã às 09:00',
    bio: 'Maquiadora profissional com experiência em eventos sociais, casamentos e editoriais de moda. Especialista em técnicas para valorizar a beleza natural.',
    services: ['Maquiagem Social', 'Maquiagem para Noivas', 'Design de Sobrancelhas'],
    workingSince: '2014'
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
    availability: 'Hoje às 15:30',
    bio: 'Cabeleireiro com formação em visagismo, especialista em encontrar o corte e cor ideais para cada cliente, considerando formato de rosto e estilo pessoal.',
    services: ['Corte', 'Coloração', 'Visagismo', 'Mechas'],
    workingSince: '2010'
  }
];

// Services data (expanded)
const services = [
  {
    id: 1, 
    name: 'Corte de Cabelo', 
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 50', 
    duration: '45 min',
    description: 'Cortes personalizados para todos os tipos de cabelo, incluindo lavagem e finalização.',
    category: 'Cabelo',
    salons: [1, 2, 3, 6],
    professionals: [1, 4, 6]
  },
  {
    id: 2, 
    name: 'Coloração', 
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 120', 
    duration: '2h',
    description: 'Coloração completa com produtos de alta qualidade para um resultado duradouro e brilhante.',
    category: 'Cabelo',
    salons: [1, 3, 6],
    professionals: [1, 6]
  },
  {
    id: 3, 
    name: 'Manicure', 
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 35', 
    duration: '40 min',
    description: 'Tratamento completo para unhas das mãos, incluindo corte, lixamento, hidratação e esmaltação.',
    category: 'Unhas',
    salons: [1, 3, 5],
    professionals: [3]
  },
  {
    id: 4, 
    name: 'Pedicure', 
    image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 45', 
    duration: '45 min',
    description: 'Cuidados completos para os pés e unhas, com esfoliação, hidratação e esmaltação.',
    category: 'Unhas',
    salons: [1, 3, 5],
    professionals: [3]
  },
  {
    id: 5, 
    name: 'Massagem', 
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 90', 
    duration: '1h',
    description: 'Massagem relaxante ou terapêutica para alívio de tensões e bem-estar do corpo.',
    category: 'Bem-estar',
    salons: [3, 5],
    professionals: []
  },
  {
    id: 6, 
    name: 'Depilação', 
    image: 'https://images.unsplash.com/photo-1615396899439-4c3e603abad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 40', 
    duration: '30 min',
    description: 'Remoção de pelos corporais com técnicas que garantem resultado duradouro.',
    category: 'Estética',
    salons: [3, 5],
    professionals: []
  },
  {
    id: 7, 
    name: 'Barba', 
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 35', 
    duration: '30 min',
    description: 'Modelagem completa de barba, com toalha quente, produtos especiais e finalização.',
    category: 'Barbearia',
    salons: [4],
    professionals: [2, 4]
  },
  {
    id: 8, 
    name: 'Maquiagem', 
    image: 'https://images.unsplash.com/photo-1596704017254-9b5e2b6776e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', 
    price: 'A partir de R$ 90', 
    duration: '1h',
    description: 'Maquiagem para diversas ocasiões, desde o dia a dia até eventos especiais.',
    category: 'Estética',
    salons: [1, 5],
    professionals: [5]
  }
];

// Professional reviews for dialog
const professionalReviews = [
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
    professionalId: 2,
    userName: "Marcos Silva",
    rating: 4,
    date: "2023-04-10",
    comment: "Muito bom o serviço, o Rafael é muito profissional e atencioso.",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 4,
    professionalId: 3,
    userName: "Paula Oliveira",
    rating: 5,
    date: "2023-04-05",
    comment: "Melhor manicure da cidade! Minhas unhas nunca ficaram tão bonitas.",
    userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
  }
];

const Search = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<typeof salons[0] | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<typeof professionals[0] | null>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [activeTab, setActiveTab] = useState('saloes');
  const [showServiceProviders, setShowServiceProviders] = useState(false);
  const [showProfessionalSalons, setShowProfessionalSalons] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Busca realizada",
      description: `Procurando por: ${searchQuery || 'todos os serviços'}`,
    });
  };
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    toast({
      title: "Filtro aplicado",
      description: `Filtro: ${filter}`,
    });
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };
  
  const handleBooking = (id: number, type: 'salon' | 'professional') => {
    toast({
      title: "Agendamento iniciado",
      description: `Iniciando agendamento com ${type === 'salon' ? 'salão' : 'profissional'} #${id}`,
    });
    navigate(`/appointments/new/${type}/${id}`);
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
  
  const viewSalonDetails = (salon: typeof salons[0]) => {
    setSelectedSalon(salon);
  };
  
  const viewProfessionalDetails = (professional: typeof professionals[0]) => {
    setSelectedProfessional(professional);
  };

  const viewServiceDetails = (service: typeof services[0]) => {
    setSelectedService(service);
    setShowServiceProviders(true);
  };

  const viewProfessionalSalons = (professional: typeof professionals[0]) => {
    setSelectedProfessional(professional);
    setShowProfessionalSalons(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowServiceProviders(false);
    setShowProfessionalSalons(false);
  };
  
  // Filter services by category
  const filteredServices = activeCategory 
    ? services.filter(service => service.category === activeCategory) 
    : services;

  // Get service categories
  const serviceCategories = Array.from(new Set(services.map(service => service.category)));
  
  // Find salons that offer a selected service
  const getSalonsForService = (serviceId: number) => {
    if (!selectedService) return [];
    const salonIds = selectedService.salons;
    return salons.filter(salon => salonIds.includes(salon.id));
  };

  // Find professionals that offer a selected service
  const getProfessionalsForService = (serviceId: number) => {
    if (!selectedService) return [];
    const professionalIds = selectedService.professionals;
    return professionals.filter(professional => professionalIds.includes(professional.id));
  };

  // Get salon by id
  const getSalonById = (id: number) => {
    return salons.find(salon => salon.id === id);
  };

  // Get reviews for a professional
  const getReviewsForProfessional = (professionalId: number) => {
    return professionalReviews.filter(review => review.professionalId === professionalId);
  };
  
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <div className="p-4">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Buscar Serviços</h1>
          
          <form onSubmit={handleSearch} className="flex mb-6 gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar salões, serviços ou profissionais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeFilter === 'proximidade' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterClick('proximidade')}
              className="flex gap-1 items-center"
            >
              <MapPin size={14} />
              <span>Proximidade</span>
            </Button>
            <Button 
              variant={activeFilter === 'avaliacao' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick('avaliacao')}
              className="flex gap-1 items-center"
            >
              <Star size={14} />
              <span>Melhor avaliação</span>
            </Button>
            <Button 
              variant={activeFilter === 'disponibilidade' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick('disponibilidade')}
              className="flex gap-1 items-center"
            >
              <Clock size={14} />
              <span>Disponibilidade</span>
            </Button>
            <Button 
              variant={activeFilter === 'servicos' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick('servicos')}
              className="flex gap-1 items-center"
            >
              <Scissors size={14} />
              <span>Serviços</span>
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFilter(null);
                toast({
                  title: "Filtros removidos",
                  description: "Todos os filtros foram removidos"
                });
              }}
              className="flex gap-1 items-center"
            >
              <Filter size={14} />
              <span>Limpar filtros</span>
            </Button>
          </div>
          
          <Tabs defaultValue="saloes" className="mb-6" onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="saloes">Salões</TabsTrigger>
              <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
            </TabsList>
            
            {/* Salões tab */}
            <TabsContent value="saloes" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salons.map((salon, index) => (
                  <motion.div
                    key={salon.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
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
                          onClick={() => toggleFavorite(salon.id)}
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
                          {salon.services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">{salon.price}</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{salon.availability}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-2 flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => viewSalonDetails(salon)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => handleBooking(salon.id, 'salon')}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Agendar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            {/* Profissionais tab */}
            <TabsContent value="profissionais" className="mt-2">
              {!showProfessionalSalons ? (
                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {professionals.map((professional, index) => (
                    <motion.div
                      key={professional.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                        <div className="relative pt-6 flex justify-center">
                          <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={professional.image} alt={professional.name} />
                            <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                            onClick={() => toggleFavorite(professional.id + 100)} // Offset to avoid collision with salon IDs
                          >
                            <Heart 
                              className={`h-5 w-5 ${favorites.includes(professional.id + 100) ? 'fill-blue-500 text-blue-500' : 'text-gray-500'}`} 
                            />
                          </Button>
                        </div>
                        <CardHeader className="p-4 pb-2 text-center">

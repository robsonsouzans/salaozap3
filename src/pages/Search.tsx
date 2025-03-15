
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Star, MapPin, Calendar, Sparkles, Search as SearchIcon, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';

// Sample data for salons and professionals
const salonData = [
  {
    id: 1,
    name: 'Espaço Beleza',
    image: 'https://source.unsplash.com/random/?salon,1',
    rating: 4.9,
    reviewCount: 127,
    distance: '1.2 km',
    address: 'Rua das Flores, 123',
    services: ['Corte', 'Coloração', 'Manicure'],
    featured: true
  },
  {
    id: 2,
    name: 'Studio Hair',
    image: 'https://source.unsplash.com/random/?salon,2',
    rating: 4.7,
    reviewCount: 89,
    distance: '1.8 km',
    address: 'Av. Paulista, 1500',
    services: ['Corte', 'Barba', 'Coloração'],
    featured: false
  },
  {
    id: 3,
    name: 'Bella Estética',
    image: 'https://source.unsplash.com/random/?salon,3',
    rating: 4.8,
    reviewCount: 112,
    distance: '0.5 km',
    address: 'Rua Augusta, 789',
    services: ['Manicure', 'Pedicure', 'Massagem'],
    featured: true
  },
  {
    id: 4,
    name: 'Salão VIP',
    image: 'https://source.unsplash.com/random/?salon,4',
    rating: 4.6,
    reviewCount: 74,
    distance: '2.3 km',
    address: 'Rua Consolação, 456',
    services: ['Corte', 'Penteado', 'Maquiagem'],
    featured: false
  }
];

const professionalData = [
  {
    id: 1,
    name: 'Ana Silva',
    image: 'https://source.unsplash.com/random/?hairstylist,1',
    role: 'Cabeleireira',
    rating: 4.9,
    reviewCount: 95,
    salon: 'Espaço Beleza',
    specialties: ['Cortes femininos', 'Coloração']
  },
  {
    id: 2,
    name: 'João Oliveira',
    image: 'https://source.unsplash.com/random/?barber,1',
    role: 'Barbeiro',
    rating: 4.8,
    reviewCount: 87,
    salon: 'Studio Hair',
    specialties: ['Cortes masculinos', 'Barba']
  },
  {
    id: 3,
    name: 'Camila Mendes',
    image: 'https://source.unsplash.com/random/?manicurist,1',
    role: 'Manicure',
    rating: 4.7,
    reviewCount: 68,
    salon: 'Bella Estética',
    specialties: ['Unhas em gel', 'Nail art']
  },
  {
    id: 4,
    name: 'Pedro Santos',
    image: 'https://source.unsplash.com/random/?hairstylist,2',
    role: 'Cabeleireiro',
    rating: 4.9,
    reviewCount: 102,
    salon: 'Salão VIP',
    specialties: ['Cortes', 'Química']
  }
];

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('salons');
  const [sortBy, setSortBy] = useState('rating');
  const { toast } = useToast();
  
  const handleBooking = (id: number, type: 'salon' | 'professional') => {
    toast({
      title: "Agendamento iniciado",
      description: `Agendando com ${type === 'salon' ? 'salão' : 'profissional'} #${id}`,
    });
  };
  
  const handleFavorite = (id: number, type: 'salon' | 'professional') => {
    toast({
      title: "Adicionado aos favoritos",
      description: `${type === 'salon' ? 'Salão' : 'Profissional'} foi adicionado aos favoritos`,
    });
  };
  
  const filteredSalons = salonData.filter(salon => 
    salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredProfessionals = professionalData.filter(pro => 
    pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const sortedSalons = [...filteredSalons].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });
  
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });
  
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
        <SidebarMenu />
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
            <motion.div
              variants={itemAnimation}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                  Encontrar Salões e Profissionais
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Descubra os melhores salões e profissionais da sua região
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, serviço ou localização..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex md:w-auto w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Ordenar por
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('rating')}>
                      Melhor avaliação
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('distance')}>
                      Menor distância
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('reviews')}>
                      Mais avaliações
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full md:w-1/3 mb-6">
                  <TabsTrigger value="salons">Salões</TabsTrigger>
                  <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                </TabsList>
                
                <TabsContent value="salons" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedSalons.map((salon) => (
                      <SalonCard 
                        key={salon.id}
                        salon={salon}
                        onBook={() => handleBooking(salon.id, 'salon')}
                        onFavorite={() => handleFavorite(salon.id, 'salon')}
                      />
                    ))}
                    
                    {sortedSalons.length === 0 && (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhum salão encontrado com esses critérios.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="professionals" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedProfessionals.map((professional) => (
                      <ProfessionalCard 
                        key={professional.id}
                        professional={professional}
                        onBook={() => handleBooking(professional.id, 'professional')}
                        onFavorite={() => handleFavorite(professional.id, 'professional')}
                      />
                    ))}
                    
                    {sortedProfessionals.length === 0 && (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhum profissional encontrado com esses critérios.
                        </p>
                      </div>
                    )}
                  </div>
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

interface SalonCardProps {
  salon: typeof salonData[0];
  onBook: () => void;
  onFavorite: () => void;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, onBook, onFavorite }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-none dark:bg-gray-800">
      <div className="relative">
        <img 
          src={salon.image} 
          alt={salon.name} 
          className="w-full h-48 object-cover"
        />
        {salon.featured && (
          <div className="absolute top-2 right-2 bg-salon-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            Destaque
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{salon.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-medium">{salon.rating}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">({salon.reviewCount})</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{salon.address} • {salon.distance}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {salon.services.map((service, idx) => (
            <Badge key={idx} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {service}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-salon-500 hover:bg-salon-600 text-white"
            onClick={onBook}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </Button>
          <Button 
            variant="outline" 
            className="border-salon-500 text-salon-500 hover:bg-salon-50 dark:border-salon-400 dark:text-salon-400 dark:hover:bg-gray-700"
            onClick={onFavorite}
          >
            Favoritar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ProfessionalCardProps {
  professional: typeof professionalData[0];
  onBook: () => void;
  onFavorite: () => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onBook, onFavorite }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-none dark:bg-gray-800">
      <div className="flex">
        <div className="w-1/3">
          <img 
            src={professional.image} 
            alt={professional.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 w-2/3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold">{professional.name}</h3>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-medium">{professional.rating}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">({professional.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center mb-1">
            <Badge className="bg-salon-100 text-salon-800 dark:bg-salon-900 dark:text-salon-200 border-none">
              {professional.role}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
            <Scissors className="h-4 w-4 mr-1" />
            <span>{professional.salon}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {professional.specialties.map((specialty, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1 bg-salon-500 hover:bg-salon-600 text-white"
              onClick={onBook}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
            <Button 
              variant="outline" 
              className="border-salon-500 text-salon-500 hover:bg-salon-50 dark:border-salon-400 dark:text-salon-400 dark:hover:bg-gray-700"
              onClick={onFavorite}
            >
              Favoritar
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Search;

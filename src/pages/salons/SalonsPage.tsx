
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, StarIcon, Filter, Scissors, Clock, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';

// Mock data for salons
const mockSalons = [
  {
    id: '1',
    name: 'Salão Glamour',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300&h=300&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    address: 'Rua das Flores, 123 - Centro',
    distance: '1.2 km',
    services: ['Corte', 'Coloração', 'Manicure', 'Pedicure'],
    priceRange: '$$',
    featured: true
  },
  {
    id: '2',
    name: 'Bela Hair',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&h=300&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 86,
    address: 'Avenida Paulista, 1500 - Bela Vista',
    distance: '3.5 km',
    services: ['Corte', 'Barba', 'Tratamento Capilar'],
    priceRange: '$',
    featured: false
  },
  {
    id: '3',
    name: 'Studio Beauty',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=300&h=300&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 210,
    address: 'Rua Augusta, 789 - Consolação',
    distance: '0.8 km',
    services: ['Corte', 'Maquiagem', 'Penteado', 'Depilação'],
    priceRange: '$$$',
    featured: true
  },
  {
    id: '4',
    name: 'Corte & Estilo',
    image: 'https://images.unsplash.com/photo-1580618864180-f6d7d39b8ff6?q=80&w=300&h=300&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 62,
    address: 'Rua Oscar Freire, 432 - Jardins',
    distance: '5.1 km',
    services: ['Corte', 'Escova', 'Hidratação'],
    priceRange: '$$',
    featured: false
  },
  {
    id: '5',
    name: 'Espaço da Beleza',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=300&h=300&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 142,
    address: 'Avenida Rebouças, 900 - Pinheiros',
    distance: '2.3 km',
    services: ['Coloração', 'Manicure', 'Pedicure', 'Design de Sobrancelhas'],
    priceRange: '$$',
    featured: true
  },
  {
    id: '6',
    name: 'Cabelos & Cia',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=300&h=300&auto=format&fit=crop',
    rating: 4.4,
    reviewCount: 95,
    address: 'Rua Teodoro Sampaio, 1020 - Pinheiros',
    distance: '3.0 km',
    services: ['Corte', 'Barba', 'Coloração'],
    priceRange: '$',
    featured: false
  }
];

const SalonCard = ({ salon, onClick }) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-none"
      onClick={() => onClick(salon.id)}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={salon.image} 
          alt={salon.name} 
          className="w-full h-full object-cover"
        />
        {salon.featured && (
          <Badge className="absolute top-2 right-2 bg-salon-500 hover:bg-salon-600">
            Destaque
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{salon.name}</h3>
            <div className="flex items-center mt-1 text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                {salon.rating} ({salon.reviewCount} avaliações)
              </span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{salon.address}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>a {salon.distance} de você</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{salon.priceRange}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {salon.services.map((service, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700">
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SalonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([1]);
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredSalons = mockSalons.filter(salon => 
    salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSalonClick = (id: string) => {
    navigate(`/salons/${id}`);
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
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo size="small" />
              <h1 className="ml-2 text-xl font-medium text-gray-900 dark:text-white">Salões</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/register')}
              >
                Cadastre-se
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={itemAnimation}>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
              Encontre os melhores salões de beleza
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Escolha entre centenas de profissionais qualificados
            </p>
          </motion.div>
          
          <motion.div variants={itemAnimation} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="pl-10 h-12"
              placeholder="Buscar por salão, serviço ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
              <span className="ml-1 sr-only sm:not-sr-only">Filtros</span>
            </Button>
          </motion.div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Preço</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={3}
                      step={1}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>$</span>
                      <span>$$</span>
                      <span>$$$</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Serviços</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                      Corte
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                      Coloração
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                      Manicure
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                      Pedicure
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                      Depilação
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Avaliação</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`rating-${rating}`}
                          className="h-4 w-4 text-salon-600 focus:ring-salon-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2">
                  Limpar filtros
                </Button>
                <Button size="sm">
                  Aplicar filtros
                </Button>
              </div>
            </motion.div>
          )}
          
          <motion.div variants={itemAnimation}>
            <Tabs defaultValue="list" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                  <TabsTrigger value="map">Mapa</TabsTrigger>
                </TabsList>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredSalons.length} salões encontrados
                </span>
              </div>
              
              <TabsContent value="list">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSalons.map((salon) => (
                    <SalonCard
                      key={salon.id}
                      salon={salon}
                      onClick={handleSalonClick}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="map">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[500px] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Visualização do mapa em desenvolvimento
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size="medium" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Conectando clientes a salões de beleza com facilidade e eficiência.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Links Rápidos</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-salon-600 dark:text-gray-400 dark:hover:text-salon-400">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-salon-600 dark:text-gray-400 dark:hover:text-salon-400">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-salon-600 dark:text-gray-400 dark:hover:text-salon-400">
                    Para salões
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Entre em contato</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-salon-600 dark:text-gray-400 dark:hover:text-salon-400">
                    contato@salaozap.com
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-salon-600 dark:text-gray-400 dark:hover:text-salon-400">
                    (11) 99999-9999
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} SalãoZap. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalonsPage;

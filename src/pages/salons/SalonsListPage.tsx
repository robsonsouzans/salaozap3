
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Scissors, Star, Filter, List, MapIcon, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';

interface SalonType {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  services: string[];
  image: string;
  isFavorite: boolean;
}

const SalonsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const user = getCurrentUser();
  
  // Mock data for salons
  const salons: SalonType[] = [
    {
      id: '1',
      name: 'Salão Glamour',
      address: 'Av. Paulista, 1000, São Paulo',
      distance: '1.2 km',
      rating: 4.9,
      reviewCount: 120,
      services: ['Corte', 'Coloração', 'Manicure'],
      image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Bela Hair',
      address: 'Rua Augusta, 789, São Paulo',
      distance: '0.8 km',
      rating: 4.7,
      reviewCount: 86,
      services: ['Corte', 'Penteado', 'Maquiagem'],
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
      isFavorite: false
    },
    {
      id: '3',
      name: 'Espaço Beleza',
      address: 'Rua Oscar Freire, 456, São Paulo',
      distance: '1.5 km',
      rating: 4.5,
      reviewCount: 64,
      services: ['Corte', 'Hidratação', 'Pedicure'],
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      isFavorite: false
    },
    {
      id: '4',
      name: 'Barber Shop',
      address: 'Rua da Consolação, 123, São Paulo',
      distance: '2.0 km',
      rating: 4.8,
      reviewCount: 92,
      services: ['Corte Masculino', 'Barba', 'Sombrancelha'],
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      isFavorite: true
    },
  ];
  
  const filterSalons = () => {
    if (!searchTerm) return salons;
    
    return salons.filter(
      salon => 
        salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
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
            <motion.div
              variants={itemAnimation}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                  Salões de Beleza
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Encontre os melhores salões perto de você
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-1" />
                  Lista
                </Button>
                <Button 
                  variant={viewMode === 'map' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <MapIcon className="h-4 w-4 mr-1" />
                  Mapa
                </Button>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-[400px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, serviço ou localização..."
                    className="pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </div>
              
              {showFilters && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Serviços</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer">Corte</Badge>
                      <Badge variant="outline" className="cursor-pointer">Coloração</Badge>
                      <Badge variant="outline" className="cursor-pointer">Manicure</Badge>
                      <Badge variant="outline" className="cursor-pointer">Pedicure</Badge>
                      <Badge variant="outline" className="cursor-pointer">Barba</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Avaliação</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="cursor-pointer">4+ estrelas</Badge>
                      <Badge variant="outline" className="cursor-pointer">3+ estrelas</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Distância</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="cursor-pointer">Até 1km</Badge>
                      <Badge variant="outline" className="cursor-pointer">Até 5km</Badge>
                      <Badge variant="outline" className="cursor-pointer">Até 10km</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterSalons().map((salon) => (
                    <Card 
                      key={salon.id} 
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none"
                      onClick={() => handleSalonClick(salon.id)}
                    >
                      <div className="relative h-40">
                        <img 
                          src={salon.image} 
                          alt={salon.name} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          className="absolute top-3 right-3 p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle favorite logic
                          }}
                        >
                          <Heart 
                            className={`h-5 w-5 ${salon.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </button>
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{salon.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{salon.address}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{salon.rating}</span>
                              <span className="text-sm text-gray-500">({salon.reviewCount})</span>
                              <span className="text-sm text-gray-500 ml-2">{salon.distance}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {salon.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              <Scissors className="h-3 w-3 mr-1" />
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Mapa em implementação</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SalonsListPage;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search as SearchIcon, MapPin, Star, Filter, 
  Clock, Calendar, Scissors, Phone, ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

interface SalonType {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  services: string[];
  distance?: string;
  isOpen: boolean;
}

interface ProfessionalType {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  salon: string;
  specialties: string[];
  available: boolean;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('salons');
  
  // Mock data
  const salons: SalonType[] = [
    {
      id: '1',
      name: 'Salão Glamour',
      image: 'https://source.unsplash.com/random/300x200/?salon',
      rating: 4.9,
      reviewCount: 120,
      address: 'Rua Augusta, 1200 - Consolação, São Paulo',
      services: ['Corte', 'Coloração', 'Tratamentos', 'Manicure'],
      distance: '1.2 km',
      isOpen: true
    },
    {
      id: '2',
      name: 'Bela Hair',
      image: 'https://source.unsplash.com/random/300x200/?hair',
      rating: 4.7,
      reviewCount: 86,
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
      services: ['Corte', 'Barba', 'Tratamentos Capilares'],
      distance: '2.5 km',
      isOpen: true
    },
    {
      id: '3',
      name: 'Espaço Beleza',
      image: 'https://source.unsplash.com/random/300x200/?beauty',
      rating: 4.5,
      reviewCount: 64,
      address: 'Rua Oscar Freire, 500 - Jardins, São Paulo',
      services: ['Corte', 'Maquiagem', 'Unhas', 'Depilação'],
      distance: '3.7 km',
      isOpen: false
    },
  ];
  
  const professionals: ProfessionalType[] = [
    {
      id: '1',
      name: 'Ana Silva',
      image: 'https://source.unsplash.com/random/100x100/?woman',
      rating: 4.9,
      reviewCount: 75,
      salon: 'Salão Glamour',
      specialties: ['Corte Feminino', 'Coloração'],
      available: true
    },
    {
      id: '2',
      name: 'João Pereira',
      image: 'https://source.unsplash.com/random/100x100/?man',
      rating: 4.8,
      reviewCount: 63,
      salon: 'Bela Hair',
      specialties: ['Corte Masculino', 'Barba'],
      available: true
    },
    {
      id: '3',
      name: 'Camila Oliveira',
      image: 'https://source.unsplash.com/random/100x100/?woman,2',
      rating: 4.7,
      reviewCount: 41,
      salon: 'Espaço Beleza',
      specialties: ['Manicure', 'Pedicure'],
      available: false
    },
  ];
  
  const filterSalons = () => {
    if (!searchTerm) return salons;
    
    return salons.filter(
      salon => 
        salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
        salon.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filterProfessionals = () => {
    if (!searchTerm) return professionals;
    
    return professionals.filter(
      professional => 
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        professional.salon.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      <Sidebar />
      
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
                  Pesquisar
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Encontre salões e profissionais próximos a você
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="bg-white shadow-md border-none dark:bg-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-salon-500 to-salon-600 p-6 text-white">
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
                    O que você está procurando hoje?
                  </h2>
                  
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Busque por salões, serviços ou profissionais..."
                      className="pl-10 h-12 text-gray-900 border-0 focus-visible:ring-2 focus-visible:ring-salon-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-white/20 hover:bg-white/30 cursor-pointer" onClick={() => setSearchTerm('Corte')}>
                      Corte
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 cursor-pointer" onClick={() => setSearchTerm('Coloração')}>
                      Coloração
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 cursor-pointer" onClick={() => setSearchTerm('Manicure')}>
                      Manicure
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 cursor-pointer" onClick={() => setSearchTerm('Barba')}>
                      Barba
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-0">
                  <Tabs defaultValue="salons" className="w-full" onValueChange={setActiveTab}>
                    <div className="px-6 pt-4">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="salons">Salões</TabsTrigger>
                        <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="salons" className="mt-4 px-6 pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">
                          {filterSalons().length} salões encontrados
                        </p>
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Filtros
                        </Button>
                      </div>
                      
                      {filterSalons().length > 0 ? (
                        <div className="space-y-6">
                          {filterSalons().map((salon) => (
                            <div 
                              key={salon.id}
                              className="flex flex-col md:flex-row gap-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                              <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                <img 
                                  src={salon.image} 
                                  alt={salon.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-bold">{salon.name}</h3>
                                    <div className="flex items-center mt-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="ml-1 text-sm">{salon.rating}</span>
                                      <span className="ml-1 text-xs text-gray-500">({salon.reviewCount} avaliações)</span>
                                    </div>
                                  </div>
                                  
                                  <Badge className={salon.isOpen ? "bg-green-500" : "bg-gray-500"}>
                                    {salon.isOpen ? "Aberto" : "Fechado"}
                                  </Badge>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{salon.address}</span>
                                    {salon.distance && (
                                      <Badge variant="outline" className="ml-2 h-5 px-1.5 border-gray-200">
                                        {salon.distance}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {salon.services.map((service, index) => (
                                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex justify-end mt-4">
                                  <Button variant="outline" size="sm" className="mr-2 border-salon-500 text-salon-500">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Contato
                                  </Button>
                                  <Button className="bg-salon-500 hover:bg-salon-600">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Agendar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 mb-4">
                            Nenhum salão encontrado para "{searchTerm}".
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setSearchTerm('')}
                          >
                            Limpar busca
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="professionals" className="mt-4 px-6 pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">
                          {filterProfessionals().length} profissionais encontrados
                        </p>
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Filtros
                        </Button>
                      </div>
                      
                      {filterProfessionals().length > 0 ? (
                        <div className="space-y-4">
                          {filterProfessionals().map((professional) => (
                            <div 
                              key={professional.id}
                              className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                <img 
                                  src={professional.image} 
                                  alt={professional.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold">{professional.name}</h3>
                                    <p className="text-sm text-gray-500">{professional.salon}</p>
                                    
                                    <div className="flex items-center mt-1">
                                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                      <span className="ml-1 text-sm">{professional.rating}</span>
                                      <span className="ml-1 text-xs text-gray-500">({professional.reviewCount})</span>
                                    </div>
                                  </div>
                                  
                                  <Badge className={professional.available ? "bg-green-500" : "bg-gray-500"}>
                                    {professional.available ? "Disponível" : "Indisponível"}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {professional.specialties.map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="ml-4">
                                <Button 
                                  className="bg-salon-500 hover:bg-salon-600"
                                  disabled={!professional.available}
                                >
                                  <Scissors className="h-4 w-4 mr-1" />
                                  Agendar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 mb-4">
                            Nenhum profissional encontrado para "{searchTerm}".
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setSearchTerm('')}
                          >
                            Limpar busca
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="bg-white shadow-md border-none dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Salões mais bem avaliados</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {salons.slice(0, 3).sort((a, b) => b.rating - a.rating).map((salon) => (
                      <div 
                        key={salon.id}
                        className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={salon.image} 
                            alt={salon.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold">{salon.name}</h3>
                          
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm">{salon.rating}</span>
                            <span className="ml-1 text-xs text-gray-500">({salon.reviewCount})</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span className="truncate">{salon.address.split(' - ')[0]}</span>
                          </div>
                          
                          <Button
                            variant="outline"
                            className="w-full mt-3 text-salon-500 border-salon-500"
                          >
                            Ver detalhes
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Search;

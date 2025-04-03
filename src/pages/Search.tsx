
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search as SearchIcon, 
  MapPin, 
  Scissors, 
  Star, 
  Filter, 
  List, 
  MapIcon, 
  Heart, 
  User,
  ChevronLeft,
  X,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentUser } from '@/lib/auth';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';

interface SearchResultItem {
  id: string;
  name: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  address?: string;
  price?: string;
  duration?: string;
  services?: string[];
  category?: string;
  description?: string;
  role?: string;
  salon?: string;
  specialties?: string[];
  isFavorite?: boolean;
}

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'salons' | 'services' | 'professionals'>('salons');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDetailItem, setActiveDetailItem] = useState<SearchResultItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const user = getCurrentUser();

  // Mock data for salons
  const salonsData: SearchResultItem[] = [
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

  // Mock data for services
  const servicesData: SearchResultItem[] = [
    {
      id: '1',
      name: 'Corte de Cabelo',
      price: 'R$ 50,00',
      duration: '45 min',
      description: 'Corte profissional que inclui lavagem, corte e finalização.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
      category: 'Cabelo'
    },
    {
      id: '2',
      name: 'Coloração',
      price: 'a partir de R$ 120,00',
      duration: '2h',
      description: 'Coloração completa com produtos de alta qualidade.',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
      category: 'Cabelo'
    },
    {
      id: '3',
      name: 'Manicure',
      price: 'R$ 35,00',
      duration: '45 min',
      description: 'Tratamento completo para unhas, incluindo corte, lixamento e esmaltação.',
      image: 'https://images.unsplash.com/photo-1610992755791-63b8cb29543a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      category: 'Unhas'
    },
    {
      id: '4',
      name: 'Barba',
      price: 'R$ 40,00',
      duration: '30 min',
      description: 'Modelagem de barba completa, incluindo toalha quente, óleo e finalização.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      category: 'Barba'
    }
  ];

  // Mock data for professionals
  const professionalsData: SearchResultItem[] = [
    {
      id: '1',
      name: 'Ana Silva',
      role: 'Cabeleireira',
      rating: 4.9,
      reviewCount: 78,
      salon: 'Salão Glamour',
      specialties: ['Cortes femininos', 'Coloração', 'Penteados'],
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      isFavorite: true,
      distance: '1.2 km'
    },
    {
      id: '2',
      name: 'João Pereira',
      role: 'Barbeiro',
      rating: 4.8,
      reviewCount: 65,
      salon: 'Barber Shop',
      specialties: ['Cortes masculinos', 'Barba', 'Sombrancelha'],
      image: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
      isFavorite: false,
      distance: '2.0 km'
    },
    {
      id: '3',
      name: 'Camila Oliveira',
      role: 'Manicure',
      rating: 4.7,
      reviewCount: 42,
      salon: 'Espaço Beleza',
      specialties: ['Manicure', 'Pedicure', 'Nail art'],
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      isFavorite: false,
      distance: '1.5 km'
    },
    {
      id: '4',
      name: 'Maria Souza',
      role: 'Cabeleireira',
      rating: 4.8,
      reviewCount: 96,
      salon: 'Bela Hair',
      specialties: ['Cortes', 'Mechas', 'Hidratação'],
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      isFavorite: true,
      distance: '0.8 km'
    }
  ];

  const getData = () => {
    switch (selectedCategory) {
      case 'salons':
        return filterItems(salonsData);
      case 'services':
        return filterItems(servicesData);
      case 'professionals':
        return filterItems(professionalsData);
      default:
        return [];
    }
  };

  const filterItems = (items: SearchResultItem[]) => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.services && item.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.salon && item.salon.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.specialties && item.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  };

  const handleItemClick = (item: SearchResultItem) => {
    setActiveDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const handleScheduleWithProfessional = (professionalId: string) => {
    navigate(`/appointments/new/professional/${professionalId}`);
  };

  const handleScheduleService = (serviceId: string) => {
    navigate(`/appointments/new/service/${serviceId}`);
  };

  const handleViewSalon = (salonId: string) => {
    navigate(`/salons/${salonId}`);
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

  const renderSalons = () => {
    const items = getData();
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((salon) => (
          <Card 
            key={salon.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none"
            onClick={() => handleItemClick(salon)}
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
                {salon.services?.map((service, idx) => (
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
    );
  };

  const renderServices = () => {
    const items = getData();
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((service) => (
          <Card 
            key={service.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none"
            onClick={() => handleItemClick(service)}
          >
            <div className="relative h-40">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <Badge variant="outline" className="bg-white/20 text-white border-none">
                  {service.category}
                </Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{service.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">{service.price}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mt-2">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderProfessionals = () => {
    const items = getData();
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((professional) => (
          <Card 
            key={professional.id}
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none"
            onClick={() => handleItemClick(professional)}
          >
            <div className="relative h-48">
              <img 
                src={professional.image} 
                alt={professional.name} 
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
                  className={`h-5 w-5 ${professional.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </button>
            </div>
            <CardContent className="pt-4 text-center">
              <h3 className="font-medium text-lg">{professional.name}</h3>
              <div className="text-sm text-gray-500 mb-1">{professional.role}</div>
              <div className="mb-1">{professional.salon}</div>
              <div className="flex justify-center items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{professional.rating}</span>
                <span className="text-sm text-gray-500">({professional.reviewCount})</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {professional.specialties?.slice(0, 3).map((specialty, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderDetailsModal = () => {
    if (!activeDetailItem) return null;
    
    // Different modals based on category
    if (selectedCategory === 'professionals') {
      return (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {activeDetailItem.name}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsDetailModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage src={activeDetailItem.image} alt={activeDetailItem.name} />
                <AvatarFallback>{activeDetailItem.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-xl">{activeDetailItem.name}</h3>
              <div className="text-gray-500">{activeDetailItem.role}</div>
              <div className="flex items-center gap-1 my-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{activeDetailItem.rating}</span>
                <span className="text-sm text-gray-500">({activeDetailItem.reviewCount} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{activeDetailItem.salon} • {activeDetailItem.distance}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Especialidades</h4>
              <div className="flex flex-wrap gap-1">
                {activeDetailItem.specialties?.map((specialty, idx) => (
                  <Badge key={idx} variant="outline">{specialty}</Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                className="w-full mb-2" 
                variant="default"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleScheduleWithProfessional(activeDetailItem.id);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar com este profissional
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleViewSalon(activeDetailItem.id);
                }}
              >
                Ver salão
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    } else if (selectedCategory === 'services') {
      return (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {activeDetailItem.name}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsDetailModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={activeDetailItem.image} 
              alt={activeDetailItem.name}
              className="w-full aspect-video object-cover rounded-lg"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{activeDetailItem.duration}</span>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">{activeDetailItem.price}</Badge>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">{activeDetailItem.description}</p>
            
            <div className="pt-4 border-t">
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleScheduleService(activeDetailItem.id);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar este serviço
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    } else {
      // Salons
      return (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {activeDetailItem.name}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsDetailModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={activeDetailItem.image} 
              alt={activeDetailItem.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{activeDetailItem.rating}</span>
              <span className="text-sm text-gray-500">({activeDetailItem.reviewCount} avaliações)</span>
              <span className="text-sm text-gray-500 ml-2">{activeDetailItem.distance}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{activeDetailItem.address}</span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Serviços disponíveis</h4>
              <div className="flex flex-wrap gap-1">
                {activeDetailItem.services?.map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <Scissors className="h-3 w-3 mr-1" />
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                className="w-full"
                variant="default" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleViewSalon(activeDetailItem.id);
                }}
              >
                Ver detalhes do salão
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    }
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
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                  Busca
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Encontre salões, serviços e profissionais
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
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
              
              <Tabs defaultValue={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'salons' | 'services' | 'professionals')}>
                <TabsList className="w-full mb-6 grid grid-cols-3">
                  <TabsTrigger value="salons">Salões</TabsTrigger>
                  <TabsTrigger value="services">Serviços</TabsTrigger>
                  <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                </TabsList>
                
                {viewMode === 'list' ? (
                  <>
                    <TabsContent value="salons">
                      <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        animate="show"
                      >
                        {renderSalons()}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="services">
                      <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        animate="show"
                      >
                        {renderServices()}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="professionals">
                      <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        animate="show"
                      >
                        {renderProfessionals()}
                      </motion.div>
                    </TabsContent>
                  </>
                ) : (
                  <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Mapa em implementação</p>
                  </div>
                )}
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        {renderDetailsModal()}
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default Search;

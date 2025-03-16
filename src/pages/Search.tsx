
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Scissors, Filter, Search as SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const salons = [
  {
    id: 1,
    name: 'Salão Beleza Divina',
    image: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.6,
    reviews: 115,
    location: 'Jardins, São Paulo',
    distance: '3.2 km',
    services: ['Coloração', 'Mechas', 'Tratamentos'],
    price: '$$$',
    availability: 'Hoje às 15:15'
  }
];

const professionals = [
  {
    id: 1,
    name: 'Amanda Silva',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    reviews: 187,
    specialty: 'Colorista e Cabeleireira',
    salon: 'Salão Beleza Divina',
    price: '$$',
    availability: 'Hoje às 14:00'
  },
  {
    id: 2,
    name: 'Rafael Costa',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.7,
    reviews: 103,
    specialty: 'Barbeiro',
    salon: 'Barbearia Moderna',
    price: '$$',
    availability: 'Hoje às 16:00'
  },
  {
    id: 3,
    name: 'Carolina Mendes',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    reviews: 156,
    specialty: 'Manicure e Pedicure',
    salon: 'Belle Spa & Cabelo',
    price: '$$$',
    availability: 'Amanhã às 10:30'
  },
  {
    id: 4,
    name: 'Pedro Almeida',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.6,
    reviews: 89,
    specialty: 'Corte Masculino e Barba',
    salon: 'Barbearia Moderna',
    price: '$$',
    availability: 'Hoje às 18:00'
  }
];

const Search = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
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
  
  const handleBooking = (id: number, type: 'salon' | 'professional') => {
    toast({
      title: "Agendamento iniciado",
      description: `Iniciando agendamento com ${type === 'salon' ? 'salão' : 'profissional'} #${id}`,
    });
    navigate(`/appointments/new/${type}/${id}`);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <div className="p-4">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="flex-1 overflow-auto">
        <div className="responsive-container py-6">
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
          
          <Tabs defaultValue="saloes" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="saloes">Salões</TabsTrigger>
              <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
            </TabsList>
            
            <TabsContent value="saloes" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salons.map((salon) => (
                  <Card key={salon.id} className="modern-card hover-lift">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarImage src={salon.image} alt={salon.name} />
                          <AvatarFallback>{salon.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{salon.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({salon.reviews})</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 text-lg">{salon.name}</CardTitle>
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
                    <CardFooter className="p-4 pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleBooking(salon.id, 'salon')}
                      >
                        Agendar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="profissionais" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionals.map((professional) => (
                  <Card key={professional.id} className="modern-card hover-lift">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarImage src={professional.image} alt={professional.name} />
                          <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{professional.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({professional.reviews})</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 text-lg">{professional.name}</CardTitle>
                      <CardDescription className="text-sm">{professional.specialty}</CardDescription>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <span>{professional.salon}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium">{professional.price}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{professional.availability}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleBooking(professional.id, 'professional')}
                      >
                        Agendar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="servicos" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, name: 'Corte de Cabelo', image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', price: 'A partir de R$ 50', duration: '45 min' },
                  { id: 2, name: 'Coloração', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', price: 'A partir de R$ 120', duration: '2h' },
                  { id: 3, name: 'Manicure', image: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', price: 'A partir de R$ 35', duration: '40 min' },
                  { id: 4, name: 'Pedicure', image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', price: 'A partir de R$ 45', duration: '45 min' },
                  { id: 5, name: 'Massagem', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', price: 'A partir de R$ 90', duration: '1h' },
                  { id: 6, name: 'Depilação', image: 'https://images.unsplash.com/photo-1615396899439-4c3e603abad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80', price: 'A partir de R$ 40', duration: '30 min' }
                ].map((service) => (
                  <Card key={service.id} className="modern-card hover-lift relative overflow-hidden">
                    <div className="absolute inset-0">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/40" />
                    </div>
                    <div className="relative">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium">{service.price}</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-2">
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            toast({
                              title: "Serviço selecionado",
                              description: `Serviço: ${service.name}`
                            });
                            navigate(`/search?service=${service.id}`);
                          }}
                        >
                          Encontrar profissionais
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Search;

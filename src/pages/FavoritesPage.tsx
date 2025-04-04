
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, MapPin, Clock, Heart } from "lucide-react";
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNav from '@/components/BottomNav';

interface FavoriteSalon {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  image: string;
  distance: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteSalon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading favorites from an API
    setTimeout(() => {
      setFavorites([
        {
          id: '1',
          name: 'Salão Bella Hair',
          rating: 4.8,
          reviewCount: 124,
          address: 'Rua Augusta, 1200 - Consolação',
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          distance: '1.2 km'
        },
        {
          id: '2',
          name: 'Studio Beauty & Care',
          rating: 4.5,
          reviewCount: 89,
          address: 'Av. Paulista, 1000 - Bela Vista',
          image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          distance: '0.8 km'
        },
        {
          id: '3',
          name: 'Espaço Glam',
          rating: 4.7,
          reviewCount: 156,
          address: 'Rua Oscar Freire, 123 - Jardins',
          image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          distance: '2.5 km'
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const removeFromFavorites = (id: string) => {
    setFavorites(favorites.filter(salon => salon.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 md:pt-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Favoritos</h1>
        <p className="text-gray-500 dark:text-gray-400">Salões que você salvou como favoritos</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" strokeWidth={1} />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Nenhum favorito ainda</h2>
          <p className="text-gray-500 mb-6">Você ainda não adicionou nenhum salão aos favoritos</p>
          <Button asChild>
            <Link to="/search">Buscar Salões</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((salon) => (
            <Card key={salon.id} className="overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={salon.image} 
                  alt={salon.name} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                  onClick={() => removeFromFavorites(salon.id)}
                >
                  <Heart className="h-5 w-5 fill-white" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <Link to={`/salons/${salon.id}`}>
                  <CardTitle className="text-lg hover:text-salon-500 transition-colors">
                    {salon.name}
                  </CardTitle>
                </Link>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{salon.rating}</span>
                  <span className="text-gray-500">({salon.reviewCount} avaliações)</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-2">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{salon.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>A {salon.distance} de distância</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/appointments/new/salon/${salon.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default FavoritesPage;

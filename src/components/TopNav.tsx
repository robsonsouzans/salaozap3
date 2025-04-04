
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Search, Menu, Store, Scissors, BarChart, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const TopNav: React.FC = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const isMobile = useIsMobile();
  const isClient = user?.role === 'client';
  
  if (isMobile) return null; // Não renderiza no mobile
  
  return (
    <div className="fixed top-0 left-0 right-0 md:left-[240px] h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-20 hidden md:flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <NavigationMenu>
          <NavigationMenuList>
            {isClient ? (
              <>
                <NavigationMenuItem>
                  <Link to="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Home className="h-4 w-4 mr-2" />
                      <span>Home</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/appointments/new" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Agendar</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/search" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Search className="h-4 w-4 mr-2" />
                      <span>Buscar Salões</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Agenda</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <Link to="/appointments" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Calendário</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Visualize sua agenda em formato de calendário
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/appointments/list" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Lista de Agendamentos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Veja todos seus agendamentos em formato de lista
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/appointments/confirmations" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Confirmações</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerencie solicitações pendentes de confirmação
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Scissors className="h-4 w-4 mr-2" />
                    <span>Gestão</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <Link to="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Serviços</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerencie os serviços oferecidos pelo seu salão
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/employees" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Funcionários</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Cadastre e gerencie sua equipe de profissionais
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/finances" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Finanças</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Acompanhe o desempenho financeiro do seu negócio
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Relatórios</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <Link to="/statistics" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Estatísticas</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Visualize métricas e indicadores de desempenho
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/reviews" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Avaliações</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Veja o feedback dos seus clientes
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/messages">
              <MessageCircle className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Link to="/profile" className="ml-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

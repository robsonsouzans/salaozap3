
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Settings, Users, Scissors, 
  Clock, MapPin, Calendar, 
  DollarSign, ChevronDown, ChevronRight,
  BarChart2, Bell, MessageSquare, Heart,
  Star, FileText, Home
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from '@/lib/auth';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  path?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const MenuItem = ({ icon, title, path, onClick, children }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = path ? location.pathname.startsWith(path) : false;
  
  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen);
    } else if (path) {
      navigate(path);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div className="mb-1">
      <button
        className={`w-full flex items-center justify-start py-2 px-3 text-sm rounded-md transition-colors ${
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center w-full">
          <span className="mr-2">{icon}</span>
          <span>{title}</span>
          {children && (
            <span className="ml-auto">
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
          )}
        </div>
      </button>
      
      {children && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-8 pr-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

type SubMenuItemProps = {
  title: string;
  path: string;
};

const SubMenuItem = ({ title, path }: SubMenuItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link to={path}>
      <button
        className={`w-full flex items-center justify-start py-1.5 px-3 text-sm rounded-md transition-colors ${
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        {title}
      </button>
    </Link>
  );
};

const SidebarMenu = () => {
  const user = getCurrentUser();
  const isSalon = user?.role === 'salon';
  const isClient = user?.role === 'client';
  const { toast } = useToast();
  
  if (!user) return null;
  
  // Salon Menu
  if (isSalon) {
    return (
      <div className="mt-2 space-y-1">
        <MenuItem 
          icon={<Home size={18} />} 
          title="Dashboard" 
          path="/dashboard"
        />
        
        <MenuItem 
          icon={<Calendar size={18} />} 
          title="Agendamentos" 
          path="/appointments"
        >
          <SubMenuItem title="Calendário" path="/appointments/calendar" />
          <SubMenuItem title="Lista de agendamentos" path="/appointments/list" />
          <SubMenuItem title="Confirmações" path="/appointments/confirmations" />
        </MenuItem>
        
        <MenuItem 
          icon={<Users size={18} />} 
          title="Funcionários" 
          path="/employees"
        />
        
        <MenuItem 
          icon={<Scissors size={18} />} 
          title="Serviços" 
          path="/services"
        />
        
        <MenuItem 
          icon={<DollarSign size={18} />} 
          title="Financeiro" 
          path="/finances"
        >
          <SubMenuItem title="Relatório de vendas" path="/finances/sales" />
          <SubMenuItem title="Comissões" path="/finances/commissions" />
          <SubMenuItem title="Faturamento" path="/finances/billing" />
          <SubMenuItem title="Pagamentos" path="/finances/payments" />
        </MenuItem>
        
        <MenuItem 
          icon={<Star size={18} />} 
          title="Avaliações" 
          path="/reviews"
        />
        
        <MenuItem 
          icon={<BarChart2 size={18} />} 
          title="Estatísticas" 
          path="/statistics"
        />
        
        <MenuItem 
          icon={<MessageSquare size={18} />} 
          title="Mensagens" 
          path="/messages"
        />
        
        <MenuItem 
          icon={<Settings size={18} />} 
          title="Configurações" 
          path="/settings"
        >
          <SubMenuItem title="Geral" path="/settings" />
          <SubMenuItem title="Perfil do Salão" path="/settings/profile" />
          <SubMenuItem title="Horários de funcionamento" path="/settings/business-hours" />
          <SubMenuItem title="Métodos de pagamento" path="/settings/payment-methods" />
          <SubMenuItem title="Integrações" path="/settings/integrations" />
          <SubMenuItem title="Notificações" path="/settings/notifications" />
          <SubMenuItem title="Aparência" path="/settings/appearance" />
          <SubMenuItem title="Segurança" path="/settings/security" />
        </MenuItem>
      </div>
    );
  }
  
  // Client Menu
  if (isClient) {
    return (
      <div className="mt-2 space-y-1">
        <MenuItem 
          icon={<Home size={18} />} 
          title="Dashboard" 
          path="/dashboard"
        />
        
        <MenuItem 
          icon={<Search size={18} />} 
          title="Buscar Salões" 
          path="/search"
        />
        
        <MenuItem 
          icon={<Calendar size={18} />} 
          title="Meus Agendamentos" 
          path="/appointments"
        />
        
        <MenuItem 
          icon={<Heart size={18} />} 
          title="Favoritos" 
          path="/favorites"
        />
        
        <MenuItem 
          icon={<Star size={18} />} 
          title="Avaliações" 
          path="/reviews"
        />
        
        <MenuItem 
          icon={<MessageSquare size={18} />} 
          title="Mensagens" 
          path="/messages"
        />
        
        <MenuItem 
          icon={<Settings size={18} />} 
          title="Configurações" 
          path="/settings"
        >
          <SubMenuItem title="Perfil" path="/settings" />
          <SubMenuItem title="Métodos de pagamento" path="/settings/payment-methods" />
          <SubMenuItem title="Notificações" path="/settings/notifications" />
          <SubMenuItem title="Segurança" path="/settings/security" />
        </MenuItem>
      </div>
    );
  }
  
  // Default (Admin) menu
  return (
    <div className="mt-2 space-y-1">
      <MenuItem 
        icon={<Home size={18} />} 
        title="Dashboard" 
        path="/dashboard"
      />
      
      <MenuItem 
        icon={<Users size={18} />} 
        title="Usuários" 
        path="/users"
      >
        <SubMenuItem title="Clientes" path="/users/clients" />
        <SubMenuItem title="Salões" path="/users/salons" />
        <SubMenuItem title="Administradores" path="/users/admins" />
      </MenuItem>
      
      <MenuItem 
        icon={<DollarSign size={18} />} 
        title="Financeiro" 
        path="/finances"
      >
        <SubMenuItem title="Transações" path="/finances/transactions" />
        <SubMenuItem title="Assinaturas" path="/finances/subscriptions" />
        <SubMenuItem title="Relatórios" path="/finances/reports" />
      </MenuItem>
      
      <MenuItem 
        icon={<FileText size={18} />} 
        title="Planos" 
        path="/plans"
      />
      
      <MenuItem 
        icon={<Bell size={18} />} 
        title="Notificações" 
        path="/notifications"
      />
      
      <MenuItem 
        icon={<Settings size={18} />} 
        title="Configurações" 
        path="/settings"
      >
        <SubMenuItem title="Sistema" path="/settings" />
        <SubMenuItem title="Integrações" path="/settings/integrations" />
        <SubMenuItem title="Segurança" path="/settings/security" />
      </MenuItem>
    </div>
  );
};

export default SidebarMenu;

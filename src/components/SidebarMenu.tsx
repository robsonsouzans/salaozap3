
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Settings, Users, Scissors, 
  Clock, MapPin, Calendar, 
  DollarSign, ChevronDown, ChevronRight
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
  const { toast } = useToast();
  
  if (!isSalon) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <MenuItem 
        icon={<Settings size={18} />} 
        title="Configurações" 
        path="/settings"
      >
        <SubMenuItem title="Geral" path="/settings" />
        <SubMenuItem title="Aparência" path="/settings/appearance" />
        <SubMenuItem title="Notificações" path="/settings/notifications" />
        <SubMenuItem title="Segurança" path="/settings/security" />
        <SubMenuItem title="Horários de funcionamento" path="/settings/business-hours" />
        <SubMenuItem title="Métodos de pagamento" path="/settings/payment-methods" />
        <SubMenuItem title="Integrações" path="/settings/integrations" />
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
        icon={<Clock size={18} />} 
        title="Horários" 
        path="/schedule"
      >
        <SubMenuItem title="Disponibilidade" path="/schedule/availability" />
        <SubMenuItem title="Bloqueio de horários" path="/schedule/blocks" />
      </MenuItem>
      
      <MenuItem 
        icon={<MapPin size={18} />} 
        title="Localização" 
        path="/location"
      >
        <SubMenuItem title="Endereço do salão" path="/location/address" />
        <SubMenuItem title="Área de atendimento" path="/location/service-area" />
      </MenuItem>
      
      <MenuItem 
        icon={<Calendar size={18} />} 
        title="Agendamentos" 
        path="/appointments"
      />
      
      <MenuItem 
        icon={<DollarSign size={18} />} 
        title="Financeiro" 
        path="/finances"
      >
        <SubMenuItem title="Relatório de vendas" path="/finances/sales" />
        <SubMenuItem title="Faturamento" path="/finances/billing" />
      </MenuItem>
    </div>
  );
};

export default SidebarMenu;

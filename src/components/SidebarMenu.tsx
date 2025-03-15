
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Settings, Users, Clock, Scissors, 
  ChevronDown, ChevronRight, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const MenuItem = ({ icon, title, onClick, children }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div className="mb-1">
      <Button
        variant="ghost"
        className="w-full justify-start py-2 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      </Button>
      
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

const SubMenuItem = ({ title, onClick }: { title: string; onClick?: () => void }) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start py-1 px-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

const SidebarMenu = () => {
  const user = getCurrentUser();
  const isSalon = user?.role === 'salon';
  
  if (!isSalon) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <MenuItem icon={<Settings size={18} />} title="Configurações">
        <SubMenuItem title="Horários de funcionamento" onClick={() => console.log('Horários clicked')} />
        <SubMenuItem title="Métodos de pagamento" onClick={() => console.log('Pagamentos clicked')} />
        <SubMenuItem title="Notificações" onClick={() => console.log('Notificações clicked')} />
        <SubMenuItem title="Integrações" onClick={() => console.log('Integrações clicked')} />
      </MenuItem>
      
      <MenuItem icon={<Users size={18} />} title="Funcionários">
        <SubMenuItem title="Listar funcionários" onClick={() => console.log('Listar funcionários clicked')} />
        <SubMenuItem title="Adicionar funcionário" onClick={() => console.log('Adicionar funcionário clicked')} />
        <SubMenuItem title="Comissões" onClick={() => console.log('Comissões clicked')} />
      </MenuItem>
      
      <MenuItem icon={<Scissors size={18} />} title="Serviços">
        <SubMenuItem title="Listar serviços" onClick={() => console.log('Listar serviços clicked')} />
        <SubMenuItem title="Adicionar serviço" onClick={() => console.log('Adicionar serviço clicked')} />
        <SubMenuItem title="Categorias" onClick={() => console.log('Categorias clicked')} />
      </MenuItem>
      
      <MenuItem icon={<Clock size={18} />} title="Horários">
        <SubMenuItem title="Disponibilidade" onClick={() => console.log('Disponibilidade clicked')} />
        <SubMenuItem title="Bloqueio de horários" onClick={() => console.log('Bloqueio clicked')} />
      </MenuItem>
      
      <MenuItem icon={<MapPin size={18} />} title="Localização">
        <SubMenuItem title="Endereço do salão" onClick={() => console.log('Endereço clicked')} />
        <SubMenuItem title="Área de atendimento" onClick={() => console.log('Área clicked')} />
      </MenuItem>
    </div>
  );
};

export default SidebarMenu;

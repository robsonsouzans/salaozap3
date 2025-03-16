
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Settings, Users, Clock, Scissors, 
  ChevronDown, ChevronRight, MapPin,
  Calendar, DollarSign, PlusCircle, Edit, Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
        className="w-full justify-start py-2 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
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

type SubMenuItemProps = {
  title: string;
  onClick?: () => void;
  isNew?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
};

const SubMenuItem = ({ title, onClick, isNew, isEdit, isDelete }: SubMenuItemProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Handle subitem click based on type
  const handleSubItemClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    // Default actions based on type
    if (isNew) {
      toast({
        title: "Novo item",
        description: `Criando novo ${title.toLowerCase()}`,
      });
    } else if (isEdit) {
      toast({
        title: "Editar item",
        description: `Editando ${title.toLowerCase()}`,
      });
    } else if (isDelete) {
      toast({
        title: "Excluir item",
        description: `Item excluído com sucesso`,
      });
    } else {
      // Regular navigation
      const path = title.toLowerCase().replace(/\s+/g, '-');
      navigate(`/dashboard/${path}`);
    }
  };
  
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start py-1 px-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
        isNew ? 'text-green-600 hover:text-green-700' : 
        isEdit ? 'text-blue-600 hover:text-blue-700' : 
        isDelete ? 'text-red-600 hover:text-red-700' : ''
      }`}
      onClick={handleSubItemClick}
    >
      {isNew && <PlusCircle size={16} className="mr-2" />}
      {isEdit && <Edit size={16} className="mr-2" />}
      {isDelete && <Trash size={16} className="mr-2" />}
      {title}
    </Button>
  );
};

// Dialogs for CRUD operations
const ServiceDialog = ({ type }: { type: 'new' | 'edit' | 'delete' }) => {
  const { toast } = useToast();
  
  const handleAction = () => {
    if (type === 'new') {
      toast({
        title: "Serviço adicionado",
        description: "O novo serviço foi adicionado com sucesso.",
      });
    } else if (type === 'edit') {
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
      });
    } else if (type === 'delete') {
      toast({
        title: "Serviço excluído",
        description: "O serviço foi excluído com sucesso.",
      });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full justify-start py-1 px-3 text-sm hover:bg-sidebar-accent transition-colors
            ${type === 'new' ? 'text-green-600 hover:text-green-700' : 
              type === 'edit' ? 'text-blue-600 hover:text-blue-700' : 
              'text-red-600 hover:text-red-700'}`}
        >
          {type === 'new' && <PlusCircle size={16} className="mr-2" />}
          {type === 'edit' && <Edit size={16} className="mr-2" />}
          {type === 'delete' && <Trash size={16} className="mr-2" />}
          {type === 'new' ? 'Adicionar serviço' : 
           type === 'edit' ? 'Editar serviço' : 
           'Excluir serviço'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'new' ? 'Novo Serviço' : 
             type === 'edit' ? 'Editar Serviço' : 
             'Confirmar Exclusão'}
          </DialogTitle>
          <DialogDescription>
            {type === 'new' ? 'Preencha os dados para adicionar um novo serviço' : 
             type === 'edit' ? 'Atualize os dados do serviço' : 
             'Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.'}
          </DialogDescription>
        </DialogHeader>
        
        {(type === 'new' || type === 'edit') && (
          <div className="grid gap-4 py-4">
            {/* Form fields would go here */}
            <p className="text-sm text-muted-foreground">Campos do formulário apareceriam aqui</p>
          </div>
        )}
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAction}>
              {type === 'new' ? 'Adicionar' : 
               type === 'edit' ? 'Atualizar' : 
               'Excluir'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SidebarMenu = () => {
  const user = getCurrentUser();
  const isSalon = user?.role === 'salon';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!isSalon) return null;
  
  const handleMenuAction = (action: string) => {
    toast({
      title: "Ação do menu",
      description: `Você selecionou: ${action}`,
    });
    
    // Navigate to appropriate page based on action
    const path = action.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/${path}`);
  };
  
  return (
    <div className="mt-2 space-y-1">
      <MenuItem icon={<Settings size={18} />} title="Configurações">
        <SubMenuItem title="Horários de funcionamento" onClick={() => handleMenuAction("Horários de funcionamento")} />
        <SubMenuItem title="Métodos de pagamento" onClick={() => handleMenuAction("Métodos de pagamento")} />
        <SubMenuItem title="Notificações" onClick={() => handleMenuAction("Notificações")} />
        <SubMenuItem title="Integrações" onClick={() => handleMenuAction("Integrações")} />
      </MenuItem>
      
      <MenuItem icon={<Users size={18} />} title="Funcionários">
        <SubMenuItem title="Listar funcionários" onClick={() => handleMenuAction("Listar funcionários")} />
        <SubMenuItem title="Adicionar funcionário" isNew onClick={() => handleMenuAction("Adicionar funcionário")} />
        <SubMenuItem title="Editar funcionário" isEdit onClick={() => handleMenuAction("Editar funcionário")} />
        <SubMenuItem title="Remover funcionário" isDelete onClick={() => handleMenuAction("Remover funcionário")} />
      </MenuItem>
      
      <MenuItem icon={<Scissors size={18} />} title="Serviços">
        <SubMenuItem title="Listar serviços" onClick={() => handleMenuAction("Listar serviços")} />
        <ServiceDialog type="new" />
        <ServiceDialog type="edit" />
        <ServiceDialog type="delete" />
      </MenuItem>
      
      <MenuItem icon={<Clock size={18} />} title="Horários">
        <SubMenuItem title="Disponibilidade" onClick={() => handleMenuAction("Disponibilidade")} />
        <SubMenuItem title="Bloqueio de horários" onClick={() => handleMenuAction("Bloqueio de horários")} />
      </MenuItem>
      
      <MenuItem icon={<MapPin size={18} />} title="Localização">
        <SubMenuItem title="Endereço do salão" onClick={() => handleMenuAction("Endereço do salão")} />
        <SubMenuItem title="Área de atendimento" onClick={() => handleMenuAction("Área de atendimento")} />
      </MenuItem>
      
      <MenuItem icon={<Calendar size={18} />} title="Agendamentos">
        <SubMenuItem title="Ver agendamentos" onClick={() => handleMenuAction("Ver agendamentos")} />
        <SubMenuItem title="Novo agendamento" isNew onClick={() => handleMenuAction("Novo agendamento")} />
      </MenuItem>
      
      <MenuItem icon={<DollarSign size={18} />} title="Financeiro">
        <SubMenuItem title="Relatório de vendas" onClick={() => handleMenuAction("Relatório de vendas")} />
        <SubMenuItem title="Faturamento" onClick={() => handleMenuAction("Faturamento")} />
      </MenuItem>
    </div>
  );
};

export default SidebarMenu;


import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Scissors, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const mockServices = [
  { id: 1, name: 'Corte Feminino', price: 120, duration: 60, category: 'Cabelo', active: true },
  { id: 2, name: 'Corte Masculino', price: 80, duration: 45, category: 'Cabelo', active: true },
  { id: 3, name: 'Coloração', price: 150, duration: 90, category: 'Cabelo', active: true },
  { id: 4, name: 'Manicure', price: 60, duration: 45, category: 'Unhas', active: true },
  { id: 5, name: 'Pedicure', price: 75, duration: 60, category: 'Unhas', active: false },
  { id: 6, name: 'Hidratação', price: 90, duration: 45, category: 'Cabelo', active: true },
];

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`shadow-sm hover:shadow-md transition-shadow ${!service.active ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {service.name}
              {!service.active && (
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  Inativo
                </span>
              )}
            </CardTitle>
            <CardDescription>{service.category}</CardDescription>
          </div>
          {service.active && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Check className="mr-1 h-3 w-3" />
              Ativo
            </span>
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Preço:</span>
              <p className="font-medium">R$ {service.price.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Duração:</span>
              <p className="font-medium">{service.duration} min</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full" 
            onClick={() => onEdit(service)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground" 
            onClick={() => onDelete(service)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ServiceFormDialog = ({ 
  isOpen, 
  onClose, 
  service = null, 
  onSave 
}) => {
  const isEditing = !!service;
  const [formData, setFormData] = useState(
    service || { 
      name: '', 
      price: '', 
      duration: '', 
      category: '',
      active: true
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' 
        ? value.replace(/[^0-9.]/g, '') 
        : value
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      active: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration, 10),
      id: service?.id || Date.now()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Faça as alterações necessárias e salve.'
              : 'Preencha os campos para adicionar um novo serviço.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do serviço
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Corte Feminino"
              className="border-gray-300 dark:border-gray-700 focus:ring-gray-400 dark:focus:ring-gray-600"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoria
            </label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ex: Cabelo, Unhas, etc."
              className="border-gray-300 dark:border-gray-700 focus:ring-gray-400 dark:focus:ring-gray-600"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Preço (R$)
              </label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 120.00"
                className="border-gray-300 dark:border-gray-700 focus:ring-gray-400 dark:focus:ring-gray-600"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duração (min)
              </label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Ex: 60"
                className="border-gray-300 dark:border-gray-700 focus:ring-gray-400 dark:focus:ring-gray-600"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="active" 
              checked={formData.active} 
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="active"
              className="text-sm font-medium leading-none"
            >
              Serviço ativo
            </label>
          </div>
          
          <Separator className="my-4" />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 dark:border-gray-700">
              Cancelar
            </Button>
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700">
              {isEditing ? 'Salvar alterações' : 'Adicionar serviço'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  service, 
  onConfirm 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o serviço "{service?.name}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="border-gray-300 dark:border-gray-700">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm(service?.id);
              onClose();
            }}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ServicesPage = () => {
  const { toast } = useToast();
  const [services, setServices] = useState(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Filter by active status
      if ((!showActive && service.active) || (!showInactive && !service.active)) {
        return false;
      }
      
      // Filter by search query
      return (
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [services, searchQuery, showActive, showInactive]);
  
  const handleAddEditService = (service) => {
    setShowAddEditDialog(true);
    setSelectedService(service);
  };
  
  const handleDeleteService = (service) => {
    setShowDeleteDialog(true);
    setSelectedService(service);
  };
  
  const saveService = (serviceData) => {
    if (serviceData.id) {
      setServices(prev => 
        prev.map(service => 
          service.id === serviceData.id ? serviceData : service
        )
      );
      toast({
        title: "Serviço atualizado",
        description: `${serviceData.name} foi atualizado com sucesso.`
      });
    } else {
      const newService = {
        ...serviceData,
        id: Date.now()
      };
      setServices(prev => [...prev, newService]);
      toast({
        title: "Serviço adicionado",
        description: `${serviceData.name} foi adicionado com sucesso.`
      });
    }
  };
  
  const confirmDelete = (serviceId) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    toast({
      title: "Serviço excluído",
      description: "O serviço foi excluído com sucesso."
    });
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
        <SidebarMenu />
        <div className="mt-auto mb-4 px-3">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
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
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                  Serviços
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Gerencie todos os serviços oferecidos pelo seu salão
                </p>
              </div>
              
              <Button 
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedService(null);
                  setShowAddEditDialog(true);
                }}
              >
                <Plus className="w-5 h-5" />
                <span>Novo serviço</span>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={itemAnimation}
              className="space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Buscar serviços..."
                  className="pl-9 border-gray-300 dark:border-gray-700 focus:ring-gray-400 dark:focus:ring-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-active" 
                    checked={showActive} 
                    onCheckedChange={setShowActive}
                  />
                  <label
                    htmlFor="show-active"
                    className="text-sm font-medium leading-none"
                  >
                    Serviços ativos
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-inactive" 
                    checked={showInactive} 
                    onCheckedChange={setShowInactive}
                  />
                  <label
                    htmlFor="show-inactive"
                    className="text-sm font-medium leading-none"
                  >
                    Serviços inativos
                  </label>
                </div>
              </div>
              
              <Separator className="my-2" />
            </motion.div>
            
            <motion.div
              variants={itemAnimation}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={handleAddEditService}
                    onDelete={handleDeleteService}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Scissors className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Nenhum serviço encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                    {searchQuery ? 
                      `Não encontramos serviços correspondentes à pesquisa "${searchQuery}".` : 
                      (!showActive && !showInactive) ?
                      "Ajuste os filtros de status para visualizar os serviços." :
                      "Você ainda não cadastrou nenhum serviço. Clique em 'Novo serviço' para começar."}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
      
      <ServiceFormDialog
        isOpen={showAddEditDialog}
        onClose={() => setShowAddEditDialog(false)}
        service={selectedService}
        onSave={saveService}
      />
      
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        service={selectedService}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ServicesPage;

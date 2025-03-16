
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, UserPlus, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for employees
const mockEmployees = [
  { id: 1, name: 'Ana Silva', role: 'Cabeleireira', phone: '(11) 98765-4321', email: 'ana.silva@email.com', avatar: null },
  { id: 2, name: 'Carlos Oliveira', role: 'Barbeiro', phone: '(11) 91234-5678', email: 'carlos.oliveira@email.com', avatar: null },
  { id: 3, name: 'Paula Santos', role: 'Manicure', phone: '(11) 95555-9999', email: 'paula.santos@email.com', avatar: null },
  { id: 4, name: 'Roberto Pereira', role: 'Esteticista', phone: '(11) 97777-8888', email: 'roberto.pereira@email.com', avatar: null },
];

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.role}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="truncate">{employee.email}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => onEdit(employee)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground" 
          onClick={() => onDelete(employee)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmployeeFormDialog = ({ isOpen, onClose, employee = null, onSave }) => {
  const isEditing = !!employee;
  const [formData, setFormData] = useState(
    employee || {
      name: '',
      role: '',
      phone: '',
      email: '',
      avatar: null
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: employee?.id || Date.now()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Faça as alterações necessárias e salve.' : 'Preencha os dados do novo funcionário.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome completo
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Ana Silva"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Função
            </label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Ex: Cabeleireira"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: (11) 98765-4321"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: ana.silva@email.com"
              required
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar alterações' : 'Adicionar funcionário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ isOpen, onClose, employee, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o funcionário "{employee?.name}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm(employee?.id);
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

const EmployeesPage = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog state
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddEditEmployee = (employee) => {
    setShowAddEditDialog(true);
    setSelectedEmployee(employee);
  };
  
  const handleDeleteEmployee = (employee) => {
    setShowDeleteDialog(true);
    setSelectedEmployee(employee);
  };
  
  const saveEmployee = (employeeData) => {
    if (employeeData.id) {
      // Edit existing employee
      setEmployees(prev => 
        prev.map(employee => 
          employee.id === employeeData.id ? employeeData : employee
        )
      );
      toast({
        title: "Funcionário atualizado",
        description: `${employeeData.name} foi atualizado com sucesso.`
      });
    } else {
      // Add new employee
      const newEmployee = {
        ...employeeData,
        id: Date.now()
      };
      setEmployees(prev => [...prev, newEmployee]);
      toast({
        title: "Funcionário adicionado",
        description: `${employeeData.name} foi adicionado com sucesso.`
      });
    }
  };
  
  const confirmDelete = (employeeId) => {
    setEmployees(prev => prev.filter(employee => employee.id !== employeeId));
    toast({
      title: "Funcionário excluído",
      description: "O funcionário foi excluído com sucesso."
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
                  Funcionários
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Gerencie a equipe do seu salão
                </p>
              </div>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedEmployee(null);
                  setShowAddEditDialog(true);
                }}
              >
                <UserPlus className="w-5 h-5" />
                <span>Novo funcionário</span>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={itemAnimation}
              className="relative"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Buscar funcionários..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
            
            <motion.div
              variants={itemAnimation}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleAddEditEmployee}
                    onDelete={handleDeleteEmployee}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Nenhum funcionário encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                    {searchQuery ? 
                      `Não encontramos funcionários correspondentes à pesquisa "${searchQuery}".` : 
                      "Você ainda não cadastrou nenhum funcionário. Clique em 'Novo funcionário' para começar."}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
      
      {/* Employee Form Dialog */}
      <EmployeeFormDialog
        isOpen={showAddEditDialog}
        onClose={() => setShowAddEditDialog(false)}
        employee={selectedEmployee}
        onSave={saveEmployee}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        employee={selectedEmployee}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default EmployeesPage;

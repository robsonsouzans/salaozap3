
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, UserPlus, Phone, Mail, Coffee, Scissors, ChevronRight } from 'lucide-react';
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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock data for employees
const mockEmployees = [
  { 
    id: 1, 
    name: 'Ana Silva', 
    role: 'Cabeleireira', 
    phone: '(11) 98765-4321', 
    email: 'ana.silva@email.com', 
    avatar: null,
    skills: ['Corte feminino', 'Coloração', 'Penteados'],
    isActive: true,
    bio: 'Especialista em cortes modernos com mais de 5 anos de experiência.',
    availability: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    commissionRate: 30
  },
  { 
    id: 2, 
    name: 'Carlos Oliveira', 
    role: 'Barbeiro', 
    phone: '(11) 91234-5678', 
    email: 'carlos.oliveira@email.com', 
    avatar: null,
    skills: ['Barba', 'Corte masculino', 'Progressiva masculina'],
    isActive: true,
    bio: 'Barbeiro tradicional com técnicas modernas.',
    availability: ['Segunda', 'Quarta', 'Sexta', 'Sábado'],
    commissionRate: 25
  },
  { 
    id: 3, 
    name: 'Paula Santos', 
    role: 'Manicure', 
    phone: '(11) 95555-9999', 
    email: 'paula.santos@email.com', 
    avatar: null,
    skills: ['Manicure', 'Pedicure', 'Nail art'],
    isActive: true,
    bio: 'Especialista em unhas artísticas e alongamentos.',
    availability: ['Terça', 'Quinta', 'Sábado'],
    commissionRate: 35
  },
  { 
    id: 4, 
    name: 'Roberto Pereira', 
    role: 'Esteticista', 
    phone: '(11) 97777-8888', 
    email: 'roberto.pereira@email.com', 
    avatar: null,
    skills: ['Limpeza de pele', 'Massagem', 'Tratamentos faciais'],
    isActive: false,
    bio: 'Formado em estética avançada, especialista em rejuvenescimento.',
    availability: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    commissionRate: 40
  },
];

// Available roles for employees
const availableRoles = [
  'Cabeleireiro(a)', 
  'Barbeiro(a)', 
  'Manicure', 
  'Pedicure', 
  'Esteticista', 
  'Maquiador(a)', 
  'Massagista', 
  'Recepcionista',
  'Gerente'
];

// Available skills that can be assigned
const availableSkills = [
  'Corte feminino',
  'Corte masculino',
  'Coloração',
  'Mechas',
  'Alisamento',
  'Penteados',
  'Tratamentos capilares',
  'Barba',
  'Manicure',
  'Pedicure',
  'Nail art',
  'Limpeza de pele',
  'Massagem',
  'Tratamentos faciais',
  'Maquiagem',
  'Depilação',
  'Alongamento de cílios'
];

// Available days for availability
const weekdays = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo'
];

// Form schema for employee creation/editing
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  role: z.string().min(1, { message: "Selecione uma função" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  skills: z.array(z.string()).min(1, { message: "Selecione pelo menos uma habilidade" }),
  isActive: z.boolean().default(true),
  bio: z.string().optional(),
  availability: z.array(z.string()).min(1, { message: "Selecione pelo menos um dia de disponibilidade" }),
  commissionRate: z.number().min(0).max(100)
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// Component for displaying an employee card
const EmployeeCard = ({ employee, onEdit, onDelete, onViewDetails }) => {
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
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{employee.name}</h3>
            <Badge variant={employee.isActive ? "success" : "secondary"}>
              {employee.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
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
          <div className="mt-2 flex flex-wrap gap-1">
            {employee.skills.slice(0, 2).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {employee.skills.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{employee.skills.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onViewDetails(employee)}
        >
          <span className="mr-1">Detalhes</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
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
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for employee form dialog (add/edit)
const EmployeeFormDialog = ({ isOpen, onClose, employee = null, onSave }) => {
  const isEditing = !!employee;
  const { toast } = useToast();
  
  // Default form values
  const defaultValues: Partial<EmployeeFormValues> = {
    name: '',
    role: '',
    phone: '',
    email: '',
    skills: [],
    isActive: true,
    bio: '',
    availability: [],
    commissionRate: 30
  };
  
  // Initialize form with employee data if editing
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: isEditing ? {
      ...defaultValues,
      ...employee,
    } : defaultValues,
  });
  
  // Handle form submission
  const onSubmit = (data: EmployeeFormValues) => {
    onSave({
      ...data,
      id: employee?.id || Date.now()
    });
    toast({
      title: isEditing ? "Funcionário atualizado" : "Funcionário adicionado",
      description: isEditing 
        ? `${data.name} foi atualizado com sucesso.` 
        : `${data.name} foi adicionado com sucesso.`,
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Faça as alterações necessárias e salve.' : 'Preencha os dados do novo funcionário.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4 grid grid-cols-3">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="skills">Habilidades</TabsTrigger>
                <TabsTrigger value="additional">Detalhes Adicionais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Ana Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableRoles.map((role) => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: (11) 98765-4321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Ex: ana.silva@email.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ativo</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Funcionário está atualmente trabalhando
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxa de Comissão (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="Ex: 30" 
                            {...field}
                            value={field.value.toString()}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <FormField
                  control={form.control}
                  name="skills"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Habilidades e Especialidades</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Selecione todas as habilidades que este funcionário possui
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableSkills.map((skill) => (
                          <FormField
                            key={skill}
                            control={form.control}
                            name="skills"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={skill}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, skill])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== skill
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {skill}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="additional" className="space-y-4">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografia / Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte um pouco sobre a experiência e especialidades deste profissional..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Dias de Trabalho</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Selecione os dias em que este funcionário trabalha
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {weekdays.map((day) => (
                          <FormField
                            key={day}
                            control={form.control}
                            name="availability"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={day}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(day)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, day])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== day
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {day}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Salvar alterações' : 'Adicionar funcionário'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Component for employee details dialog
const EmployeeDetailsDialog = ({ isOpen, onClose, employee, onEdit }) => {
  if (!employee) return null;
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
              </Avatar>
              <span>{employee.name}</span>
            </div>
            <Badge variant={employee.isActive ? "success" : "secondary"} className="ml-auto">
              {employee.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium">Função</h3>
              <p className="mt-1">{employee.role}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Taxa de Comissão</h3>
              <p className="mt-1">{employee.commissionRate}%</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Telefone</h3>
              <p className="mt-1">{employee.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Email</h3>
              <p className="mt-1">{employee.email}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Biografia</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {employee.bio || "Nenhuma biografia cadastrada."}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Dias de Trabalho</h3>
            <div className="flex flex-wrap gap-2">
              {employee.availability.map((day, index) => (
                <Badge key={index} variant="secondary">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button 
            variant="default" 
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Component for delete confirmation dialog
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

// Main Employees Page Component
const EmployeesPage = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [filterRole, setFilterRole] = useState('all');
  
  // Dialog state
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Filter and search employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && employee.isActive) || 
      (filterStatus === 'inactive' && !employee.isActive);

    const matchesRole = 
      filterRole === 'all' || 
      employee.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Get unique roles for filtering
  const uniqueRoles = Array.from(new Set(employees.map(employee => employee.role)));
  
  // Handlers for dialogs
  const handleAddEditEmployee = (employee) => {
    setShowAddEditDialog(true);
    setSelectedEmployee(employee);
  };
  
  const handleDeleteEmployee = (employee) => {
    setShowDeleteDialog(true);
    setSelectedEmployee(employee);
  };
  
  const handleViewDetails = (employee) => {
    setShowDetailsDialog(true);
    setSelectedEmployee(employee);
  };
  
  // Save employee (add or edit)
  const saveEmployee = (employeeData) => {
    if (employeeData.id && employees.some(e => e.id === employeeData.id)) {
      // Edit existing employee
      setEmployees(prev => 
        prev.map(employee => 
          employee.id === employeeData.id ? employeeData : employee
        )
      );
    } else {
      // Add new employee
      setEmployees(prev => [...prev, employeeData]);
    }
  };
  
  // Confirm delete employee
  const confirmDelete = (employeeId) => {
    setEmployees(prev => prev.filter(employee => employee.id !== employeeId));
    toast({
      title: "Funcionário excluído",
      description: "O funcionário foi excluído com sucesso."
    });
  };
  
  // Animation variants
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
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Buscar funcionários..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  <Select
                    defaultValue="all"
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    defaultValue="all"
                    onValueChange={setFilterRole}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as funções</SelectItem>
                      {uniqueRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className="rounded-none h-10 px-3"
                      onClick={() => setViewMode('grid')}
                    >
                      <Coffee className="h-4 w-4" />
                      <span className="sr-only">Visualização em grade</span>
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      className="rounded-none h-10 px-3"
                      onClick={() => setViewMode('table')}
                    >
                      <Scissors className="h-4 w-4" />
                      <span className="sr-only">Visualização em tabela</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onEdit={handleAddEditEmployee}
                        onDelete={handleDeleteEmployee}
                        onViewDetails={handleViewDetails}
                      />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Nenhum funcionário encontrado
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                        {searchQuery || filterStatus !== 'all' || filterRole !== 'all' ? 
                          `Não encontramos funcionários correspondentes aos filtros aplicados.` : 
                          "Você ainda não cadastrou nenhum funcionário. Clique em 'Novo funcionário' para começar."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Nome / Função</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Habilidades</TableHead>
                        <TableHead className="w-24 text-center">Status</TableHead>
                        <TableHead className="w-24 text-center">Comissão</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {employee.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{employee.name}</div>
                                  <div className="text-sm text-muted-foreground">{employee.role}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{employee.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{employee.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {employee.skills.slice(0, 2).map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {employee.skills.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{employee.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={employee.isActive ? "success" : "secondary"}>
                                {employee.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-medium">
                              {employee.commissionRate}%
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(employee)}
                                >
                                  Detalhes
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddEditEmployee(employee)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => handleDeleteEmployee(employee)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                              <UserPlus className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Nenhum funcionário encontrado
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
      
      {/* Employee Details Dialog */}
      <EmployeeDetailsDialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        employee={selectedEmployee}
        onEdit={handleAddEditEmployee}
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

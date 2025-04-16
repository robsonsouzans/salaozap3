
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, UserPlus, Grid, List, 
  Edit, Trash2, Mail, Phone,
  Calendar, DollarSign, Star, Clock, ChevronUp, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser } from '@/lib/auth';

// Define proper Employee type
interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  email: string;
  status: "active" | "inactive"; // Fixed type here
  specialties: string[];
  hireDate: string;
  commission: number;
  schedule: {
    monday: { active: boolean; start: string; end: string; };
    tuesday: { active: boolean; start: string; end: string; };
    wednesday: { active: boolean; start: string; end: string; };
    thursday: { active: boolean; start: string; end: string; };
    friday: { active: boolean; start: string; end: string; };
    saturday: { active: boolean; start: string; end: string; };
    sunday: { active: boolean; start: string; end: string; };
  };
  bio: string;
}

const specialtiesList = [
  "Corte Feminino", "Corte Masculino", "Coloração", "Manicure", 
  "Pedicure", "Sobrancelhas", "Maquiagem", "Barba", "Depilação",
  "Massagem", "Penteado", "Tratamento Capilar"
];

const EmployeesPage: React.FC = () => {
  const user = getCurrentUser();
  const isSalon = user?.role === 'salon';
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  
  // Fixed sample data with proper status values
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Ana Silva',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Cabeleireira',
      phone: '(11) 94321-8765',
      email: 'ana.silva@salao.com',
      status: "active", // Fixed value
      specialties: ['Corte Feminino', 'Coloração', 'Penteado'],
      hireDate: '2021-05-12',
      commission: 30,
      schedule: {
        monday: { active: true, start: '09:00', end: '18:00' },
        tuesday: { active: true, start: '09:00', end: '18:00' },
        wednesday: { active: true, start: '09:00', end: '18:00' },
        thursday: { active: true, start: '09:00', end: '18:00' },
        friday: { active: true, start: '09:00', end: '18:00' },
        saturday: { active: true, start: '09:00', end: '14:00' },
        sunday: { active: false, start: '09:00', end: '18:00' }
      },
      bio: 'Ana é especialista em coloração e cortes modernos femininos.'
    },
    {
      id: '2',
      name: 'Pedro Santos',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Barbeiro',
      phone: '(11) 98765-4321',
      email: 'pedro.santos@salao.com',
      status: "active", // Fixed value
      specialties: ['Corte Masculino', 'Barba'],
      hireDate: '2022-01-15',
      commission: 25,
      schedule: {
        monday: { active: true, start: '10:00', end: '19:00' },
        tuesday: { active: true, start: '10:00', end: '19:00' },
        wednesday: { active: true, start: '10:00', end: '19:00' },
        thursday: { active: true, start: '10:00', end: '19:00' },
        friday: { active: true, start: '10:00', end: '19:00' },
        saturday: { active: true, start: '10:00', end: '16:00' },
        sunday: { active: false, start: '10:00', end: '19:00' }
      },
      bio: 'Pedro é especializado em cortes masculinos modernos e barba.'
    },
    {
      id: '3',
      name: 'Carla Oliveira',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Manicure',
      phone: '(11) 91234-5678',
      email: 'carla.oliveira@salao.com',
      status: "inactive", // Fixed value
      specialties: ['Manicure', 'Pedicure'],
      hireDate: '2020-11-03',
      commission: 20,
      schedule: {
        monday: { active: false, start: '09:00', end: '18:00' },
        tuesday: { active: true, start: '09:00', end: '18:00' },
        wednesday: { active: true, start: '09:00', end: '18:00' },
        thursday: { active: true, start: '09:00', end: '18:00' },
        friday: { active: true, start: '09:00', end: '18:00' },
        saturday: { active: true, start: '09:00', end: '14:00' },
        sunday: { active: false, start: '09:00', end: '18:00' }
      },
      bio: 'Carla é especialista em unhas decoradas e nail art.'
    }
  ]);
  
  // New form state for better user experience
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    phone: '',
    email: '',
    status: "active",
    specialties: [],
    bio: '',
    commission: 20,
    schedule: {
      monday: { active: true, start: '09:00', end: '18:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '18:00' },
      saturday: { active: true, start: '09:00', end: '14:00' },
      sunday: { active: false, start: '09:00', end: '18:00' }
    },
  });
  
  // Add form validation step
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = 'Telefone é obrigatório';
    }
    
    if (!formData.role || formData.role.trim() === '') {
      errors.role = 'Função é obrigatória';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  useEffect(() => {
    if (!isSalon) {
      navigate('/dashboard');
      toast({
        title: "Acesso não autorizado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
    }
  }, [isSalon, navigate]);
  
  const filteredEmployees = employees.filter(employee => {
    // Filter by search term
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    // Filter by specialization
    const matchesSpecialization = specializationFilter === 'all' || 
                                  employee.specialties.includes(specializationFilter);
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });
  
  const handleAddEmployee = () => {
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    // Simulate loading
    setTimeout(() => {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name || '',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        role: formData.role || '',
        phone: formData.phone || '',
        email: formData.email || '',
        status: formData.status || "active",
        specialties: formData.specialties || [],
        hireDate: new Date().toISOString().split('T')[0],
        commission: formData.commission || 20,
        schedule: formData.schedule || {
          monday: { active: true, start: '09:00', end: '18:00' },
          tuesday: { active: true, start: '09:00', end: '18:00' },
          wednesday: { active: true, start: '09:00', end: '18:00' },
          thursday: { active: true, start: '09:00', end: '18:00' },
          friday: { active: true, start: '09:00', end: '18:00' },
          saturday: { active: true, start: '09:00', end: '14:00' },
          sunday: { active: false, start: '09:00', end: '18:00' }
        },
        bio: formData.bio || ''
      };
      
      setEmployees([...employees, newEmployee]);
      setShowAddDialog(false);
      resetForm();
      setIsSubmitting(false);
      
      toast({
        title: "Funcionário adicionado",
        description: `${newEmployee.name} foi adicionado com sucesso.`,
        variant: "success",
      });
    }, 600);
  };
  
  const handleEditEmployee = () => {
    setIsSubmitting(true);
    
    if (!currentEmployee || !validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    // Simulate loading
    setTimeout(() => {
      const updatedEmployees = employees.map(emp => 
        emp.id === currentEmployee.id 
          ? {
              ...emp,
              name: formData.name || emp.name,
              role: formData.role || emp.role,
              phone: formData.phone || emp.phone,
              email: formData.email || emp.email,
              status: formData.status || emp.status,
              specialties: formData.specialties || emp.specialties,
              commission: formData.commission || emp.commission,
              schedule: formData.schedule || emp.schedule,
              bio: formData.bio || emp.bio
            }
          : emp
      );
      
      setEmployees(updatedEmployees);
      setShowEditDialog(false);
      resetForm();
      setIsSubmitting(false);
      
      toast({
        title: "Funcionário atualizado",
        description: `As informações de ${formData.name} foram atualizadas com sucesso.`,
        variant: "success",
      });
    }, 600);
  };
  
  const handleDeleteEmployee = () => {
    setIsSubmitting(true);
    
    if (!currentEmployee) {
      setIsSubmitting(false);
      return;
    }
    
    // Simulate loading
    setTimeout(() => {
      const updatedEmployees = employees.filter(emp => emp.id !== currentEmployee.id);
      setEmployees(updatedEmployees);
      setShowDeleteDialog(false);
      setIsSubmitting(false);
      
      toast({
        title: "Funcionário removido",
        description: `${currentEmployee.name} foi removido com sucesso.`,
        variant: "info",
      });
    }, 600);
  };
  
  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
      email: employee.email,
      status: employee.status,
      specialties: employee.specialties,
      commission: employee.commission,
      schedule: employee.schedule,
      bio: employee.bio
    });
    setShowEditDialog(true);
  };
  
  const openDeleteDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowDeleteDialog(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      status: "active",
      specialties: [],
      bio: '',
      commission: 20,
      schedule: {
        monday: { active: true, start: '09:00', end: '18:00' },
        tuesday: { active: true, start: '09:00', end: '18:00' },
        wednesday: { active: true, start: '09:00', end: '18:00' },
        thursday: { active: true, start: '09:00', end: '18:00' },
        friday: { active: true, start: '09:00', end: '18:00' },
        saturday: { active: true, start: '09:00', end: '14:00' },
        sunday: { active: false, start: '09:00', end: '18:00' }
      },
    });
    setFormErrors({});
    setCurrentEmployee(null);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = formData.specialties || [];
    
    if (currentSpecialties.includes(specialty)) {
      setFormData({
        ...formData,
        specialties: currentSpecialties.filter(s => s !== specialty)
      });
    } else {
      setFormData({
        ...formData,
        specialties: [...currentSpecialties, specialty]
      });
    }
  };
  
  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is filled
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  const handleScheduleChange = (day: string, field: 'active' | 'start' | 'end', value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule!,
        [day]: {
          ...prev.schedule![day as keyof typeof prev.schedule],
          [field]: value
        }
      }
    }));
  };
  
  const toggleExpandEmployee = (employeeId: string) => {
    if (expandedEmployeeId === employeeId) {
      setExpandedEmployeeId(null);
    } else {
      setExpandedEmployeeId(employeeId);
    }
  };
  
  return (
    <div className="container mx-auto p-4 py-6 max-w-7xl">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gradient">Funcionários</h1>
        <p className="text-muted-foreground">Gerencie sua equipe, adicione novos profissionais e acompanhe seu desempenho.</p>
      </div>
      
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários por nome, email ou função..."
            className="pl-10 focus-animation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" animation="shine" className="flex items-center gap-2 bg-background/80 backdrop-blur-sm shadow-sm">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Status</p>
                <RadioGroup 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as any)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">Todos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active">Ativos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="inactive" />
                    <Label htmlFor="inactive">Inativos</Label>
                  </div>
                </RadioGroup>
                
                <Separator className="my-3" />
                
                <p className="text-sm font-medium mb-2">Especialidade</p>
                <Select 
                  value={specializationFilter} 
                  onValueChange={setSpecializationFilter}
                >
                  <SelectTrigger className="focus-animation">
                    <SelectValue placeholder="Todas especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas especialidades</SelectItem>
                    {specialtiesList.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md overflow-hidden shadow-sm bg-background/80 backdrop-blur-sm">
            <Button 
              variant="ghost" 
              className={`rounded-none px-3 ${view === 'grid' ? 'bg-muted' : ''}`}
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className={`rounded-none px-3 ${view === 'table' ? 'bg-muted' : ''}`}
              onClick={() => setView('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="salon" 
            className="flex items-center gap-2" 
            animation="shine"
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar Funcionário</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
        </div>
      </div>
      
      {/* Employees List */}
      {filteredEmployees.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="bg-gradient-to-br from-salon-100 to-salon-200 dark:from-salon-800 dark:to-salon-700 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-xl">
            <UserPlus className="h-8 w-8 text-salon-600 dark:text-salon-300" />
          </div>
          <h3 className="text-xl font-medium mb-2">Nenhum funcionário encontrado</h3>
          <p className="text-muted-foreground max-w-md">
            Não encontramos nenhum funcionário com os filtros aplicados. Tente outro termo de busca ou adicione um novo funcionário.
          </p>
          <Button 
            variant="salon"
            animation="shine"
            className="mt-6 shadow-md hover:shadow-lg transition-all" 
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Funcionário
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover-lift"
                >
                  <Card className="overflow-hidden h-full border-0 glass-card hover:shadow-xl dark:hover:shadow-salon-500/5 transition-all duration-500">
                    <CardContent className="p-0">
                      <div className="relative pb-3">
                        <div className="h-24 bg-gradient-to-r from-salon-400/40 to-salon-600/40 dark:from-salon-700/40 dark:to-salon-900/40 backdrop-blur-sm"></div>
                        <Avatar className="absolute bottom-0 left-6 transform translate-y-1/2 w-20 h-20 border-4 border-background shadow-lg">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="text-xl bg-gradient-to-br from-salon-400 to-salon-600 text-white">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="h-3.5 w-3.5 text-salon-600 dark:text-salon-400" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-destructive shadow-sm"
                            onClick={() => openDeleteDialog(employee)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-14 px-6 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{employee.name}</h3>
                            <p className="text-muted-foreground text-sm">{employee.role}</p>
                          </div>
                          <Badge 
                            variant={employee.status === "active" ? "success" : "secondary"}
                            className={`ml-auto ${employee.status === "active" ? "animate-pulse" : ""}`}
                          >
                            {employee.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-salon-500 dark:text-salon-400" />
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-salon-500 dark:text-salon-400" />
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-salon-500 dark:text-salon-400" />
                            <span>Contratado em {formatDate(employee.hireDate)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-2 text-salon-500 dark:text-salon-400" />
                            <span>Comissão de {employee.commission}%</span>
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-salon-100 dark:bg-salon-800/50" />
                        
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center text-salon-600 dark:text-salon-400">
                            <Star className="h-4 w-4 mr-1 inline" /> Especialidades
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {employee.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs bg-salon-50 dark:bg-salon-900/50 border-salon-200 dark:border-salon-700 text-salon-700 dark:text-salon-300 hover:bg-salon-100 dark:hover:bg-salon-800/70 transition-colors">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {employee.bio && (
                          <div className="mt-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-xs flex justify-between items-center p-2 text-salon-600 dark:text-salon-400"
                              onClick={() => toggleExpandEmployee(employee.id)}
                            >
                              {expandedEmployeeId === employee.id ? "Esconder bio" : "Ver bio"}
                              {expandedEmployeeId === employee.id ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />  
                              )}
                            </Button>
                            
                            <AnimatePresence>
                              {expandedEmployeeId === employee.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-sm text-muted-foreground mt-2 bg-salon-50/50 dark:bg-salon-900/20 p-3 rounded-md">
                                    {employee.bio}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border-0 glass-card overflow-hidden shadow-lg"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-salon-100/50 dark:bg-salon-800/30 backdrop-blur-sm">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-salon-700 dark:text-salon-300">Funcionário</th>
                      <th className="py-3 px-4 text-left font-medium text-salon-700 dark:text-salon-300">Contato</th>
                      <th className="py-3 px-4 text-left font-medium text-salon-700 dark:text-salon-300">Especialidades</th>
                      <th className="py-3 px-4 text-left font-medium text-salon-700 dark:text-salon-300">Comissão</th>
                      <th className="py-3 px-4 text-left font-medium text-salon-700 dark:text-salon-300">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-salon-700 dark:text-salon-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee, index) => (
                      <motion.tr 
                        key={employee.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-salon-100/30 dark:border-salon-800/30 hover:bg-salon-50/50 dark:hover:bg-salon-900/20"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-salon-100 dark:border-salon-800">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback className="text-sm bg-gradient-to-br from-salon-400 to-salon-600 text-white">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{employee.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <Mail className="h-3 w-3 mr-1 text-salon-500 dark:text-salon-400" />
                              <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Phone className="h-3 w-3 mr-1 text-salon-500 dark:text-salon-400" />
                              <span>{employee.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {employee.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-[10px] px-1 py-0 bg-salon-50 dark:bg-salon-900/50 border-salon-200 dark:border-salon-700">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-salon-500 dark:text-salon-400" />
                            <span>{employee.commission}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={employee.status === "active" ? "success" : "secondary"}
                            className="text-[10px]"
                          >
                            {employee.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-salon-600 dark:text-salon-400 hover:text-salon-700 hover:bg-salon-100 dark:hover:bg-salon-900/30"
                              onClick={() => openEditDialog(employee)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => openDeleteDialog(employee)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              Insira os dados do novo profissional da sua equipe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={formErrors.name ? "text-destructive" : ""}>
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className={formErrors.role ? "text-destructive" : ""}>
                  Função *
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={formErrors.role ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.role && (
                  <p className="text-xs text-destructive">{formErrors.role}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={formErrors.email ? "text-destructive" : ""}>
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className={formErrors.phone ? "text-destructive" : ""}>
                  Telefone *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission">Comissão (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={(e) => handleInputChange('commission', parseInt(e.target.value, 10))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 border rounded-md p-3 bg-background/50">
                {specialtiesList.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`specialty-${specialty}`}
                      checked={(formData.specialties || []).includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <Label htmlFor={`specialty-${specialty}`} className="text-sm">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Descreva a experiência e especialidade deste profissional..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="salon" 
              onClick={handleAddEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Salvando...
                </>
              ) : (
                'Adicionar Funcionário'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Modifique os dados do profissional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className={formErrors.name ? "text-destructive" : ""}>
                  Nome Completo *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role" className={formErrors.role ? "text-destructive" : ""}>
                  Função *
                </Label>
                <Input
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={formErrors.role ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.role && (
                  <p className="text-xs text-destructive">{formErrors.role}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email" className={formErrors.email ? "text-destructive" : ""}>
                  Email *
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className={formErrors.phone ? "text-destructive" : ""}>
                  Telefone *
                </Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-commission">Comissão (%)</Label>
                <Input
                  id="edit-commission"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={(e) => handleInputChange('commission', parseInt(e.target.value, 10))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 border rounded-md p-3 bg-background/50">
                {specialtiesList.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-specialty-${specialty}`}
                      checked={(formData.specialties || []).includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <Label htmlFor={`edit-specialty-${specialty}`} className="text-sm">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Biografia</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Descreva a experiência e especialidade deste profissional..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="salon" 
              onClick={handleEditEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário{' '}
              <span className="font-medium text-salon-600 dark:text-salon-400">
                {currentEmployee?.name}
              </span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;

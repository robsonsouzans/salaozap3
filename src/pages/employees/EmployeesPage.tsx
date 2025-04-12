
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, UserPlus, Grid, List, 
  Edit, Trash2, X, CheckCircle, Phone, Mail,
  Calendar, DollarSign, Star, Clock
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
    if (!validateForm()) return;
    
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
    
    toast({
      title: "Funcionário adicionado",
      description: `${newEmployee.name} foi adicionado com sucesso.`,
      variant: "success",
    });
  };
  
  const handleEditEmployee = () => {
    if (!currentEmployee || !validateForm()) return;
    
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
    
    toast({
      title: "Funcionário atualizado",
      description: `As informações de ${formData.name} foram atualizadas com sucesso.`,
      variant: "success",
    });
  };
  
  const handleDeleteEmployee = () => {
    if (!currentEmployee) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== currentEmployee.id);
    setEmployees(updatedEmployees);
    setShowDeleteDialog(false);
    
    toast({
      title: "Funcionário removido",
      description: `${currentEmployee.name} foi removido com sucesso.`,
      variant: "info",
    });
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
  
  return (
    <div className="container mx-auto p-4 py-6 max-w-7xl">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-2">Funcionários</h1>
        <p className="text-muted-foreground">Gerencie sua equipe, adicione novos profissionais e acompanhe seu desempenho.</p>
      </div>
      
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários por nome, email ou função..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
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
                  <SelectTrigger>
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
          
          <div className="flex border rounded-md overflow-hidden">
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum funcionário encontrado</h3>
          <p className="text-muted-foreground max-w-md">
            Não encontramos nenhum funcionário com os filtros aplicados. Tente outro termo de busca ou adicione um novo funcionário.
          </p>
          <Button 
            variant="salon"
            className="mt-6" 
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Funcionário
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredEmployees.map(employee => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)' }}
                  className="transition-all duration-300"
                >
                  <Card className="overflow-hidden h-full border-l-4 hover:border-salon-500 transition-colors">
                    <CardContent className="p-0">
                      <div className="relative pb-3">
                        <div className="h-24 bg-gradient-to-r from-salon-100 to-salon-200 dark:from-salon-900 dark:to-salon-800"></div>
                        <Avatar className="absolute bottom-0 left-6 transform translate-y-1/2 w-20 h-20 border-4 border-background">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="text-xl">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive"
                            onClick={() => openDeleteDialog(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                            className="ml-auto"
                          >
                            {employee.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Contratado em {formatDate(employee.hireDate)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Comissão de {employee.commission}%</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2 flex items-center">
                            <Star className="h-4 w-4 mr-1 inline" /> Especialidades
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {employee.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
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
              className="rounded-md border overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Funcionário</th>
                      <th className="py-3 px-4 text-left font-medium">Contato</th>
                      <th className="py-3 px-4 text-left font-medium">Especialidades</th>
                      <th className="py-3 px-4 text-left font-medium">Comissão</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEmployees.map(employee => (
                      <motion.tr 
                        key={employee.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>
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
                            <p className="text-xs flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                              {employee.email}
                            </p>
                            <p className="text-xs flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              {employee.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {employee.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{employee.commission}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={employee.status === "active" ? "success" : "secondary"}
                          >
                            {employee.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(employee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(employee)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar novo funcionário</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para adicionar um novo funcionário à sua equipe.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left column - Basic info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo*</Label>
                <Input 
                  id="name" 
                  value={formData.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função*</Label>
                <Input 
                  id="role" 
                  value={formData.role || ''} 
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={formErrors.role ? 'border-destructive' : ''}
                />
                {formErrors.role && (
                  <p className="text-xs text-destructive">{formErrors.role}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? 'border-destructive' : ''}
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input 
                  id="phone" 
                  value={formData.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={formErrors.phone ? 'border-destructive' : ''}
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission">Comissão (%)</Label>
                <Input 
                  id="commission" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.commission || 20} 
                  onChange={(e) => handleInputChange('commission', Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroup 
                    value={formData.status || "active"} 
                    onValueChange={(value) => handleInputChange('status', value as "active" | "inactive")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="status-active" />
                      <Label htmlFor="status-active">Ativo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="status-inactive" />
                      <Label htmlFor="status-inactive">Inativo</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio || ''} 
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            {/* Right column - Specialties and Schedule */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {specialtiesList.map(specialty => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`specialty-${specialty}`} 
                        className="rounded text-salon-500 focus:ring-salon-500"
                        checked={(formData.specialties || []).includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                      />
                      <Label htmlFor={`specialty-${specialty}`} className="text-sm font-normal">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Horário de trabalho</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Defina os dias e horários que o funcionário estará disponível.
                </p>
                
                <div className="space-y-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day, index) => {
                    const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
                    const schedule = formData.schedule && formData.schedule[day as keyof typeof formData.schedule];
                    
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <div className="w-24 text-sm">{dayNames[index]}</div>
                        <div className="flex items-center gap-2 flex-1">
                          <Switch 
                            checked={schedule?.active || false}
                            onCheckedChange={(checked) => 
                              handleScheduleChange(day, 'active', checked)
                            }
                          />
                          
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <Input 
                              type="time" 
                              value={schedule?.start || '09:00'} 
                              onChange={(e) => 
                                handleScheduleChange(day, 'start', e.target.value)
                              }
                              disabled={!schedule?.active}
                              className="text-sm"
                            />
                            <Input 
                              type="time" 
                              value={schedule?.end || '18:00'} 
                              onChange={(e) => 
                                handleScheduleChange(day, 'end', e.target.value)
                              }
                              disabled={!schedule?.active}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button variant="salon" onClick={handleAddEmployee}>
              Adicionar funcionário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar funcionário</DialogTitle>
            <DialogDescription>
              Edite as informações do funcionário abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left column - Basic info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome completo*</Label>
                <Input 
                  id="edit-name" 
                  value={formData.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Função*</Label>
                <Input 
                  id="edit-role" 
                  value={formData.role || ''} 
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={formErrors.role ? 'border-destructive' : ''}
                />
                {formErrors.role && (
                  <p className="text-xs text-destructive">{formErrors.role}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email*</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? 'border-destructive' : ''}
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone*</Label>
                <Input 
                  id="edit-phone" 
                  value={formData.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={formErrors.phone ? 'border-destructive' : ''}
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-commission">Comissão (%)</Label>
                <Input 
                  id="edit-commission" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.commission || 20} 
                  onChange={(e) => handleInputChange('commission', Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroup 
                    value={formData.status || "active"} 
                    onValueChange={(value) => handleInputChange('status', value as "active" | "inactive")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="edit-status-active" />
                      <Label htmlFor="edit-status-active">Ativo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="edit-status-inactive" />
                      <Label htmlFor="edit-status-inactive">Inativo</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biografia</Label>
                <Textarea 
                  id="edit-bio" 
                  value={formData.bio || ''} 
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            {/* Right column - Specialties and Schedule */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {specialtiesList.map(specialty => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`edit-specialty-${specialty}`} 
                        className="rounded text-salon-500 focus:ring-salon-500"
                        checked={(formData.specialties || []).includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                      />
                      <Label htmlFor={`edit-specialty-${specialty}`} className="text-sm font-normal">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Horário de trabalho</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Defina os dias e horários que o funcionário estará disponível.
                </p>
                
                <div className="space-y-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day, index) => {
                    const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
                    const schedule = formData.schedule && formData.schedule[day as keyof typeof formData.schedule];
                    
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <div className="w-24 text-sm">{dayNames[index]}</div>
                        <div className="flex items-center gap-2 flex-1">
                          <Switch 
                            checked={schedule?.active || false}
                            onCheckedChange={(checked) => 
                              handleScheduleChange(day, 'active', checked)
                            }
                          />
                          
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <Input 
                              type="time" 
                              value={schedule?.start || '09:00'} 
                              onChange={(e) => 
                                handleScheduleChange(day, 'start', e.target.value)
                              }
                              disabled={!schedule?.active}
                              className="text-sm"
                            />
                            <Input 
                              type="time" 
                              value={schedule?.end || '18:00'} 
                              onChange={(e) => 
                                handleScheduleChange(day, 'end', e.target.value)
                              }
                              disabled={!schedule?.active}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button variant="salon" onClick={handleEditEmployee}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Employee Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remover funcionário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {currentEmployee?.name} da sua equipe? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 mt-2 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={currentEmployee?.avatar} alt={currentEmployee?.name} />
              <AvatarFallback>
                {currentEmployee?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentEmployee?.name}</p>
              <p className="text-xs text-muted-foreground">{currentEmployee?.role}</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEmployee}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Confirmar remoção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;

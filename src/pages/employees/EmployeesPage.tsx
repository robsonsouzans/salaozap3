
import React, { useState, useEffect } from 'react';
import { 
  Layout, Eye, Edit, Trash2, Search, Plus, Filter, Grid, List,
  ChevronLeft, ChevronRight, X, Check, ArrowUpDown, User, Calendar, Phone, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";

// Sample employee data
const EMPLOYEES_DATA = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Cabeleireira',
    phone: '(11) 98765-4321',
    email: 'ana.silva@exemplo.com',
    status: 'active',
    specialties: ['Corte Feminino', 'Coloração', 'Penteados'],
    hireDate: '2021-03-15',
    commission: 30,
    schedule: {
      monday: { active: true, start: '09:00', end: '18:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '18:00' },
      saturday: { active: true, start: '09:00', end: '14:00' },
      sunday: { active: false, start: '00:00', end: '00:00' },
    },
    bio: 'Especialista em coloração e cortes modernos, com mais de 10 anos de experiência no mercado.'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'Barbeiro',
    phone: '(11) 97654-3210',
    email: 'carlos.oliveira@exemplo.com',
    status: 'active',
    specialties: ['Barba', 'Corte Masculino', 'Desenho'],
    hireDate: '2022-01-10',
    commission: 25,
    schedule: {
      monday: { active: true, start: '10:00', end: '19:00' },
      tuesday: { active: true, start: '10:00', end: '19:00' },
      wednesday: { active: true, start: '10:00', end: '19:00' },
      thursday: { active: true, start: '10:00', end: '19:00' },
      friday: { active: true, start: '10:00', end: '19:00' },
      saturday: { active: true, start: '10:00', end: '15:00' },
      sunday: { active: false, start: '00:00', end: '00:00' },
    },
    bio: 'Barbeiro especializado em cortes modernos e barbas estilizadas.'
  },
  {
    id: '3',
    name: 'Juliana Costa',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Manicure',
    phone: '(11) 91234-5678',
    email: 'juliana.costa@exemplo.com',
    status: 'inactive',
    specialties: ['Unhas em Gel', 'Nail Art', 'Spa para Mãos'],
    hireDate: '2020-07-20',
    commission: 20,
    schedule: {
      monday: { active: false, start: '00:00', end: '00:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '18:00' },
      saturday: { active: true, start: '09:00', end: '14:00' },
      sunday: { active: false, start: '00:00', end: '00:00' },
    },
    bio: 'Apaixonada por unhas e nail art, sempre atualizada com as últimas tendências do mercado.'
  },
  {
    id: '4',
    name: 'Pedro Santos',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'Esteticista',
    phone: '(11) 98877-6655',
    email: 'pedro.santos@exemplo.com',
    status: 'active',
    specialties: ['Limpeza de Pele', 'Tratamentos Faciais', 'Massagem'],
    hireDate: '2021-11-05',
    commission: 35,
    schedule: {
      monday: { active: true, start: '09:00', end: '18:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '18:00' },
      saturday: { active: false, start: '00:00', end: '00:00' },
      sunday: { active: false, start: '00:00', end: '00:00' },
    },
    bio: 'Especialista em tratamentos faciais e corporais, focado em resultados e bem-estar dos clientes.'
  }
];

const employeeSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone deve ter pelo menos 8 dígitos" }),
  role: z.string().min(2, { message: "Função é obrigatória" }),
  status: z.enum(["active", "inactive"]),
  commission: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0).max(100)
  ),
  specialties: z.string().array().min(1, { message: "Selecione pelo menos uma especialidade" }),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  schedule: z.object({
    monday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    tuesday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    wednesday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    thursday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    friday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    saturday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    sunday: z.object({
      active: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
  }),
});

const specialties = [
  "Corte Feminino",
  "Corte Masculino",
  "Coloração",
  "Penteados",
  "Barba",
  "Desenho",
  "Unhas em Gel",
  "Nail Art",
  "Spa para Mãos",
  "Limpeza de Pele",
  "Tratamentos Faciais",
  "Massagem",
  "Depilação",
  "Maquiagem",
  "Extensão de Cílios",
  "Sobrancelhas",
];

type Employee = z.infer<typeof employeeSchema> & {
  id: string;
  hireDate: string;
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [employeeToView, setEmployeeToView] = useState<Employee | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get unique roles for filter
  const uniqueRoles = Array.from(new Set(employees.map(emp => emp.role)));

  const filteredEmployees = employees.filter(employee => {
    // Search by name, email, or phone
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        employee.phone.includes(searchQuery);
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    // Filter by role
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "active",
      commission: 0,
      specialties: [],
      bio: "",
      avatar: "",
      schedule: {
        monday: { active: true, start: "09:00", end: "18:00" },
        tuesday: { active: true, start: "09:00", end: "18:00" },
        wednesday: { active: true, start: "09:00", end: "18:00" },
        thursday: { active: true, start: "09:00", end: "18:00" },
        friday: { active: true, start: "09:00", end: "18:00" },
        saturday: { active: true, start: "09:00", end: "14:00" },
        sunday: { active: false, start: "00:00", end: "00:00" },
      },
    },
  });

  const onSubmit = (values: z.infer<typeof employeeSchema>) => {
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id ? { ...values, id: emp.id, hireDate: emp.hireDate } : emp
      );
      setEmployees(updatedEmployees);
      toast({
        title: "Funcionário atualizado",
        description: `${values.name} foi atualizado com sucesso.`,
      });
      setIsEditDialogOpen(false);
    } else {
      // Add new employee
      const newEmployee = {
        ...values,
        id: `${employees.length + 1}`,
        hireDate: new Date().toISOString().split('T')[0],
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Funcionário adicionado",
        description: `${values.name} foi adicionado com sucesso.`,
      });
      setIsAddDialogOpen(false);
    }
    form.reset();
  };

  const handleDelete = () => {
    if (employeeToDelete) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete);
      setEmployees(updatedEmployees);
      toast({
        title: "Funcionário removido",
        description: "O funcionário foi removido com sucesso.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    form.reset(employee);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (employee: Employee) => {
    setEmployeeToView(employee);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "active",
      commission: 0,
      specialties: [],
      bio: "",
      avatar: "",
      schedule: {
        monday: { active: true, start: "09:00", end: "18:00" },
        tuesday: { active: true, start: "09:00", end: "18:00" },
        wednesday: { active: true, start: "09:00", end: "18:00" },
        thursday: { active: true, start: "09:00", end: "18:00" },
        friday: { active: true, start: "09:00", end: "18:00" },
        saturday: { active: true, start: "09:00", end: "14:00" },
        sunday: { active: false, start: "00:00", end: "00:00" },
      },
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie a equipe do seu salão.</p>
        </div>
        <Button 
          onClick={handleAddNew} 
          variant="default" 
          size="sm" 
          className="gap-2 transition-all duration-300 hover:shadow-md"
        >
          <Plus size={16} />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar funcionários..."
              className="pl-8 transition-all duration-300 focus:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none border-0"
              aria-label="Visualização em grade"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none border-0"
              aria-label="Visualização em tabela"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredEmployees.map(employee => (
              <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-background">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <CardDescription>{employee.role}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Desde {format(new Date(employee.hireDate), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {employee.specialties.slice(0, 2).map(specialty => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {employee.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{employee.specialties.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleViewClick(employee)}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <Eye size={16} className="mr-1" /> Ver
                  </Button>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(employee)}
                      className="transition-transform duration-200 hover:scale-105"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteClick(employee.id)}
                      className="transition-transform duration-200 hover:scale-105"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            {filteredEmployees.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <User size={48} className="text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Nenhum funcionário encontrado</h3>
                <p className="text-muted-foreground mt-1">
                  Tente ajustar os filtros ou adicionar novos funcionários.
                </p>
                <Button 
                  onClick={handleAddNew} 
                  variant="default" 
                  size="sm" 
                  className="mt-4 gap-2"
                >
                  <Plus size={16} />
                  <span>Adicionar Funcionário</span>
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-md border"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data Admissão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                        {employee.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{employee.phone}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{format(new Date(employee.hireDate), 'dd/MM/yyyy')}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewClick(employee)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye size={15} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(employee)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={15} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(employee.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <User size={36} className="text-muted-foreground mb-2 opacity-20" />
                        <p className="text-muted-foreground pb-2">Nenhum funcionário encontrado</p>
                        <Button 
                          onClick={handleAddNew} 
                          variant="default" 
                          size="sm" 
                          className="gap-2"
                        >
                          <Plus size={16} />
                          <span>Adicionar Funcionário</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              Preencha as informações para adicionar um novo funcionário ao salão.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do funcionário" {...field} />
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
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
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
                        <Input placeholder="(00) 00000-0000" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cabeleireiro">Cabeleireiro(a)</SelectItem>
                          <SelectItem value="Barbeiro">Barbeiro(a)</SelectItem>
                          <SelectItem value="Manicure">Manicure</SelectItem>
                          <SelectItem value="Esteticista">Esteticista</SelectItem>
                          <SelectItem value="Maquiador">Maquiador(a)</SelectItem>
                          <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                          <SelectItem value="Gerente">Gerente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="active" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Ativo
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="inactive" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Inativo
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comissão (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Ex: 30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Porcentagem de comissão sobre os serviços.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialties"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Especialidades</FormLabel>
                      <FormDescription>
                        Selecione as especialidades do funcionário.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specialties.map((specialty) => (
                        <FormField
                          key={specialty}
                          control={form.control}
                          name="specialties"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={specialty}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(specialty)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, specialty])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== specialty
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm cursor-pointer">
                                  {specialty}
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

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição sobre o profissional e suas habilidades..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Essa descrição será exibida no perfil público do profissional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Funcionário</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog - Similar to Add with pre-filled data */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Same form fields as Add Dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do funcionário" {...field} />
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
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
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
                        <Input placeholder="(00) 00000-0000" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cabeleireiro">Cabeleireiro(a)</SelectItem>
                          <SelectItem value="Barbeiro">Barbeiro(a)</SelectItem>
                          <SelectItem value="Manicure">Manicure</SelectItem>
                          <SelectItem value="Esteticista">Esteticista</SelectItem>
                          <SelectItem value="Maquiador">Maquiador(a)</SelectItem>
                          <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                          <SelectItem value="Gerente">Gerente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="active" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Ativo
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="inactive" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Inativo
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comissão (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Ex: 30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Porcentagem de comissão sobre os serviços.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialties"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Especialidades</FormLabel>
                      <FormDescription>
                        Selecione as especialidades do funcionário.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specialties.map((specialty) => (
                        <FormField
                          key={specialty}
                          control={form.control}
                          name="specialties"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={specialty}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(specialty)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, specialty])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== specialty
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm cursor-pointer">
                                  {specialty}
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

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição sobre o profissional e suas habilidades..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Essa descrição será exibida no perfil público do profissional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Atualizar Funcionário</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Funcionário</DialogTitle>
          </DialogHeader>
          
          {employeeToView && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 border-2">
                    <AvatarImage src={employeeToView.avatar} alt={employeeToView.name} />
                    <AvatarFallback className="text-2xl">
                      {employeeToView.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Badge 
                    variant={employeeToView.status === "active" ? "default" : "secondary"}
                    className="mt-3"
                  >
                    {employeeToView.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{employeeToView.name}</h2>
                    <p className="text-muted-foreground">{employeeToView.role}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employeeToView.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employeeToView.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Desde {format(new Date(employeeToView.hireDate), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Comissão:</span>
                      <span>{employeeToView.commission}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {employeeToView.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {employeeToView.bio && (
                <div>
                  <h3 className="font-medium mb-2">Biografia</h3>
                  <p className="text-sm text-muted-foreground">{employeeToView.bio}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-3">Horário de Trabalho</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(employeeToView.schedule).map(([day, schedule]) => (
                    <div key={day} className="flex items-center justify-between p-2 rounded-md border">
                      <span className="capitalize">{day === 'monday' ? 'Segunda' : 
                                               day === 'tuesday' ? 'Terça' : 
                                               day === 'wednesday' ? 'Quarta' : 
                                               day === 'thursday' ? 'Quinta' : 
                                               day === 'friday' ? 'Sexta' : 
                                               day === 'saturday' ? 'Sábado' : 'Domingo'}</span>
                      {schedule.active ? (
                        <span>{schedule.start} - {schedule.end}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Folga</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="default" 
                  onClick={() => handleEditClick(employeeToView)}
                >
                  <Edit size={16} className="mr-2" /> Editar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, UserPlus, Grid, List, 
  Edit, Trash2, Mail, Phone,
  Calendar, DollarSign, Star, Clock, ChevronUp, ChevronDown,
  Upload, ImageIcon, X
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
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
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
  
  // New state for image upload handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Ana Silva',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Cabeleireira',
      phone: '(11) 94321-8765',
      email: 'ana.silva@salao.com',
      status: "active",
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
      status: "active",
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
      status: "inactive",
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
  
  // Fix: Use memo to prevent infinite loops with the filteredEmployees calculation
  const filteredEmployees = React.useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      const matchesSpecialization = specializationFilter === 'all' || 
                                  employee.specialties.includes(specializationFilter);
      
      return matchesSearch && matchesStatus && matchesSpecialization;
    });
  }, [employees, searchTerm, statusFilter, specializationFilter]);
  
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
  
  // Image handling functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };
  
  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageFile(null);
  };
  
  const handleAddEmployee = () => {
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      let avatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
      
      // If we have an image preview, use that instead of the random avatar
      if (imagePreview) {
        // In a real app, we would upload the image to a server here
        // For this demo, we'll just use the preview URL directly
        avatarUrl = imagePreview;
      }
      
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name || '',
        avatar: avatarUrl,
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
              bio: formData.bio || emp.bio,
              // Update avatar if we have a new image
              avatar: imagePreview || emp.avatar
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
    // Set image preview from employee avatar
    setImagePreview(employee.avatar);
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
    setImagePreview(null);
    setImageFile(null);
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
  
  // Add our image upload component to the dialogs
  const imageUploadField = (
    <div className="space-y-2">
      <Label className="text-gray-700 dark:text-gray-300">Foto do Funcionário</Label>
      <div 
        className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 h-[180px] bg-gray-50 dark:bg-gray-800/50 transition-all hover:border-gray-400 dark:hover:border-gray-600"
        onClick={() => document.getElementById(showEditDialog ? 'edit-image-upload' : 'add-image-upload')?.click()}
      >
        {imagePreview ? (
          <div className="relative w-full h-full">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center cursor-pointer space-y-2">
              <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
                <ImageIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Clique para adicionar uma foto</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF até 10MB</p>
              </div>
            </div>
          </>
        )}
        <input 
          type="file" 
          id={showEditDialog ? 'edit-image-upload' : 'add-image-upload'} 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
  
  // Update Add Dialog to include image upload
  const renderAddDialog = () => (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Adicionar Funcionário</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Insira os dados do novo profissional da sua equipe.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {/* Image upload field */}
          {imageUploadField}
          
          <Separator className="my-1" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={formErrors.name ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Nome Completo *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={formErrors.name ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className={formErrors.role ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Função *
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={formErrors.role ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.role && (
                <p className="text-xs text-red-500">{formErrors.role}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={formErrors.email ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={formErrors.email ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className={formErrors.phone ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Telefone *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={formErrors.phone ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger id="status" className="border-gray-200 dark:border-gray-700 focus:ring-gray-400/20">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commission" className="text-gray-700 dark:text-gray-300">Comissão (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                value={formData.commission}
                onChange={(e) => handleInputChange('commission', parseInt(e.target.value, 10))}
                className="border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Especialidades</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 border rounded-md p-3 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              {specialtiesList.map(specialty => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`specialty-${specialty}`}
                    checked={(formData.specialties || []).includes(specialty)}
                    onCheckedChange={() => handleSpecialtyToggle(specialty)}
                  />
                  <Label htmlFor={`specialty-${specialty}`} className="text-sm text-gray-600 dark:text-gray-400">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Descreva a experiência e especialidade deste profissional..."
              className="min-h-[100px] border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowAddDialog(false)}
            disabled={isSubmitting}
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddEmployee}
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 text-white"
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
  );
  
  // Update Edit Dialog to include image upload
  const renderEditDialog = () => (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Editar Funcionário</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Modifique os dados do profissional.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {/* Image upload field */}
          {imageUploadField}
          
          <Separator className="my-1" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className={formErrors.name ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Nome Completo *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={formErrors.name ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role" className={formErrors.role ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Função *
              </Label>
              <Input
                id="edit-role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={formErrors.role ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.role && (
                <p className="text-xs text-red-500">{formErrors.role}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email" className={formErrors.email ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={formErrors.email ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className={formErrors.phone ? "text-red-500" : "text-gray-700 dark:text-gray-300"}>
                Telefone *
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={formErrors.phone ? "border-red-300 focus-visible:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger id="edit-status" className="border-gray-200 dark:border-gray-700 focus:ring-gray-400/20">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-commission" className="text-gray-700 dark:text-gray-300">Comissão (%)</Label>
              <Input
                id="edit-commission"
                type="number"
                min="0"
                max="100"
                value={formData.commission}
                onChange={(e) => handleInputChange('commission', parseInt(e.target.value, 10))}
                className="border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Especialidades</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 border rounded-md p-3 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              {specialtiesList.map(specialty => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`edit-specialty-${specialty}`}
                    checked={(formData.specialties || []).includes(specialty)}
                    onCheckedChange={() => handleSpecialtyToggle(specialty)}
                  />
                  <Label htmlFor={`edit-specialty-${specialty}`} className="text-sm text-gray-600 dark:text-gray-400">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-bio" className="text-gray-700 dark:text-gray-300">Biografia</Label>
            <Textarea
              id="edit-bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Descreva a experiência e especialidade deste profissional..."
              className="min-h-[100px] border-gray-200 dark:border-gray-700 focus-visible:ring-gray-400/20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowEditDialog(false)}
            disabled={isSubmitting}
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleEditEmployee}
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 text-white"
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
  );
  
  return (
    <div className="container mx-auto p-4 py-6 max-w-7xl">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Funcionários</h1>
        <p className="text-gray-600 dark:text-gray-300">Gerencie sua equipe, adicione novos profissionais e acompanhe seu desempenho.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar funcionários por nome, email ou função..."
            className="pl-10 border-gray-200 focus:border-gray-400 focus-visible:ring-gray-400/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <div className="p-2">
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Status</p>
                <RadioGroup 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as any)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-gray-600 dark:text-gray-400">Todos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="text-gray-600 dark:text-gray-400">Ativos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="inactive" />
                    <Label htmlFor="inactive" className="text-gray-600 dark:text-gray-400">Inativos</Label>
                  </div>
                </RadioGroup>
                
                <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
                
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Especialidade</p>
                <Select 
                  value={specializationFilter} 
                  onValueChange={setSpecializationFilter}
                >
                  <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-gray-400/20">
                    <SelectValue placeholder="Todas especialidades" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
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
          
          <div className="flex border rounded-md overflow-hidden shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <Button 
              variant="ghost" 
              className={`rounded-none px-3 ${view === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-500'}`}
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className={`rounded-none px-3 ${view === 'table' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-500'}`}
              onClick={() => setView('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white shadow-sm"
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
      
      {filteredEmployees.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
            <UserPlus className="h-8 w-8 text-gray-600 dark:text-gray-300" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-black dark:text-white">Nenhum funcionário encontrado</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Não encontramos nenhum funcionário com os filtros aplicados. Tente outro termo de busca ou adicione um novo funcionário.
          </p>
          <Button 
            className="mt-6 shadow-sm bg-black hover:bg-gray-800 text-white"
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
                  className="transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg"
                >
                  <Card className="overflow-hidden h-full border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-900">
                    <CardContent className="p-0">
                      <div className="relative pb-3">
                        <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"></div>
                        <Avatar className="absolute bottom-0 left-6 transform translate-y-1/2 w-20 h-20 border-4 border-white dark:border-gray-900 shadow-md">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="text-xl bg-black text-white dark:bg-gray-700">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 shadow-sm border-gray-200 dark:border-gray-700"
                            onClick={() => openDeleteDialog(employee)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-14 px-6 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-black dark:text-white">{employee.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{employee.role}</p>
                          </div>
                          <Badge 
                            variant={employee.status === "active" ? "default" : "secondary"}
                            className={employee.status === "active" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100"}
                          >
                            {employee.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Contratado em {formatDate(employee.hireDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Comissão de {employee.commission}%</span>
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                        
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
                            <Star className="h-4 w-4 mr-1 inline text-gray-400" /> Especialidades
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {employee.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
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
                              className="w-full text-xs flex justify-between items-center p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/70"
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
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
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
              className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-900"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-200 dark:border-gray-700 hover:bg-transparent">
                      <TableHead className="text-gray-700 dark:text-gray-300">Funcionário</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Contato</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Especialidades</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Comissão</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee, index) => (
                      <motion.tr 
                        key={employee.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-200 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback className="text-sm bg-black text-white dark:bg-gray-700">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-black dark:text-white">{employee.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{employee.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                              <Mail className="h-3 w-3 mr-1 text-gray-400" />
                              <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              <span>{employee.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {employee.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-[10px] px-1 py-0 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span>{employee.commission}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={employee.status === "active" ? "default" : "secondary"}
                            className={employee.status === "active" 
                              ? "text-[10px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100" 
                              : "text-[10px] bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100"}
                          >
                            {employee.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800/70"
                              onClick={() => openEditDialog(employee)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => openDeleteDialog(employee)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Dialog Components */}
      {renderAddDialog()}
      {renderEditDialog()}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {currentEmployee?.name}
              </span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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

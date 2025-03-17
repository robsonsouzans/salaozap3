
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Phone, Building, MapPin, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Logo from '@/components/Logo';
import AuthCard from '@/components/AuthCard';
import AnimatedBubbles from '@/components/AnimatedBubbles';
import { register } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Client form state
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  
  // Salon form state
  const [salonForm, setSalonForm] = useState({
    name: '',
    document: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    services: '',
  });
  
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSalonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSalonForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientForm.name || !clientForm.email || !clientForm.password || !clientForm.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        name: clientForm.name,
        email: clientForm.email,
        password: clientForm.password,
        role: 'client',
      });
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para o dashboard",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Verifique os dados e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSalonRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!salonForm.name || !salonForm.email || !salonForm.password || !salonForm.document || !salonForm.phone || !salonForm.address) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        name: salonForm.name,
        email: salonForm.email,
        password: salonForm.password,
        role: 'salon',
      });
      
      toast({
        title: "Cadastro de salão realizado com sucesso!",
        description: "Você será redirecionado para o dashboard",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Verifique os dados e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AnimatedBubbles color="rgba(99, 102, 241, 0.1)" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-10"
      >
        <Logo size="large" />
      </motion.div>
      
      <div className="relative w-full max-w-2xl z-10 mt-8 mb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-2xl font-display font-semibold text-center mb-2 text-gray-900 dark:text-white">
            Cadastre-se no SalãoZap
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
            Crie sua conta e comece a usar
          </p>
        </motion.div>
        
        <AuthCard>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="client">Para Clientes</TabsTrigger>
              <TabsTrigger value="salon">Para Salões</TabsTrigger>
            </TabsList>
            
            <TabsContent value="client">
              <form onSubmit={handleClientRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <User size={16} />
                      </div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Nome completo"
                        value={clientForm.name}
                        onChange={handleClientChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Phone size={16} />
                      </div>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Telefone com DDD"
                        value={clientForm.phone}
                        onChange={handleClientChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Mail size={16} />
                      </div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={clientForm.email}
                        onChange={handleClientChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Lock size={16} />
                      </div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Senha"
                        value={clientForm.password}
                        onChange={handleClientChange}
                        className="pl-10 pr-10 h-12 focus-animation"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-salon-500 hover:bg-salon-600 text-white h-12 transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar conta de cliente'}
                    <UserPlus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="salon">
              <form onSubmit={handleSalonRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Building size={16} />
                      </div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Nome do salão"
                        value={salonForm.name}
                        onChange={handleSalonChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <User size={16} />
                      </div>
                      <Input
                        type="text"
                        name="document"
                        placeholder="CNPJ ou CPF"
                        value={salonForm.document}
                        onChange={handleSalonChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Phone size={16} />
                      </div>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Telefone com DDD"
                        value={salonForm.phone}
                        onChange={handleSalonChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Mail size={16} />
                      </div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={salonForm.email}
                        onChange={handleSalonChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Lock size={16} />
                      </div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Senha"
                        value={salonForm.password}
                        onChange={handleSalonChange}
                        className="pl-10 pr-10 h-12 focus-animation"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <MapPin size={16} />
                      </div>
                      <Input
                        type="text"
                        name="address"
                        placeholder="Endereço completo"
                        value={salonForm.address}
                        onChange={handleSalonChange}
                        className="pl-10 h-12 focus-animation"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Textarea
                        name="services"
                        placeholder="Descreva os serviços oferecidos"
                        value={salonForm.services}
                        onChange={handleSalonChange}
                        className="h-24 focus-animation"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-salon-500 hover:bg-salon-600 text-white h-12 transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Cadastrar meu salão'}
                    <Building className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-salon-600 hover:text-salon-700 slide-underline dark:text-salon-400 dark:hover:text-salon-300"
              >
                Faça login
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default Register;

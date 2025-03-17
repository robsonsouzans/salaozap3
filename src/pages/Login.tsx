
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import AuthCard from '@/components/AuthCard';
import AnimatedBubbles from '@/components/AnimatedBubbles';
import { login, demoLogin } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await login({ email, password });
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para o dashboard",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: `Login com ${provider} em implementação`,
        description: "Esta funcionalidade estará disponível em breve.",
      });
      setLoading(false);
    }, 1000);
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
      
      <div className="absolute top-4 right-4 z-10 flex space-x-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-100 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={() => demoLogin('client')}
        >
          Entrar como Cliente
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-100 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={() => demoLogin('salon')}
        >
          Entrar como Salão
        </Button>
      </div>
      
      <div className="relative w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-2xl font-display font-semibold text-center mb-2 text-gray-900 dark:text-white">
            Bem-vindo ao SalãoZap
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
            Faça login para acessar sua conta
          </p>
        </motion.div>
        
        <AuthCard>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-salon-600 focus:ring-salon-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Lembrar de mim
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-salon-600 hover:text-salon-500 dark:text-salon-400 dark:hover:text-salon-300">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-salon-500 hover:bg-salon-600 text-white h-12 transition-all"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="mt-6 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative px-4 text-sm bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              ou entre com
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('Google')}
              className="h-12"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('Facebook')}
              className="h-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-blue-600" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="font-medium text-salon-600 hover:text-salon-700 slide-underline dark:text-salon-400 dark:hover:text-salon-300"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/salons')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Explorar salões sem cadastro
            </Button>
          </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;

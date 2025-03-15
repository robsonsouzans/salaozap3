
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Star, Calendar, Clock, CreditCard, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/Logo';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 lg:px-24 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-bold text-salon-500">SalãoZap</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-salon-500 dark:text-gray-300 dark:hover:text-salon-400"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-salon-500 hover:bg-salon-600 text-white"
            onClick={() => navigate('/register')}
          >
            Cadastre-se
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6 mb-10 md:mb-0 md:pr-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white">
            Seu salão na palma da mão
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transforme seu negócio com a plataforma de agendamento mais intuitiva do mercado.
            Gerencie seu salão de beleza com facilidade e encante seus clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              className="bg-salon-500 hover:bg-salon-600 text-white h-12 px-8 text-lg"
              onClick={() => navigate('/register')}
            >
              Comece agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="border-salon-500 text-salon-500 hover:bg-salon-50 dark:border-salon-400 dark:text-salon-400 dark:hover:bg-gray-800 h-12 px-8 text-lg"
              onClick={() => navigate('/login')}
            >
              Faça login
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 md:ml-6"
        >
          <div className="relative">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-salon-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 font-medium">
              <Sparkles className="inline-block mr-2 h-4 w-4" />
              Novo
            </div>
            <img 
              src="https://source.unsplash.com/random/?salon,hairstyle" 
              alt="Salon App Demo" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
            />
          </div>
        </motion.div>
      </section>
      
      {/* Features */}
      <section className="w-full px-6 md:px-12 lg:px-24 py-16 bg-white dark:bg-gray-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Recursos exclusivos para seu salão
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Todas as ferramentas que você precisa para gerenciar seu salão e encantar seus clientes.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Calendar className="h-10 w-10 text-salon-500" />}
            title="Agendamento simplificado"
            description="Seus clientes podem agendar serviços 24/7, sem precisar ligar para o salão."
          />
          
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-salon-500" />}
            title="Gestão de funcionários"
            description="Gerencie equipes, horários e comissões de seus profissionais com facilidade."
          />
          
          <FeatureCard 
            icon={<Star className="h-10 w-10 text-salon-500" />}
            title="Avaliações e feedback"
            description="Receba avaliações e melhore a satisfação dos seus clientes continuamente."
          />
          
          <FeatureCard 
            icon={<Clock className="h-10 w-10 text-salon-500" />}
            title="Horários personalizados"
            description="Configure os horários de atendimento para cada profissional do seu salão."
          />
          
          <FeatureCard 
            icon={<CreditCard className="h-10 w-10 text-salon-500" />}
            title="Pagamentos integrados"
            description="Receba pagamentos online e automatize a divisão de comissões."
          />
          
          <FeatureCard 
            icon={<Sparkles className="h-10 w-10 text-salon-500" />}
            title="Notificações automáticas"
            description="Lembretes por WhatsApp para reduzir faltas e aumentar a satisfação."
          />
        </div>
      </section>
      
      {/* Pricing */}
      <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Planos para todos os tamanhos de salão
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio e comece a transformar sua gestão.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <PricingCard 
            title="Básico" 
            price="R$ 79,90" 
            period="/mês"
            description="Ideal para salões que estão começando"
            features={[
              "Até 2 profissionais",
              "Agendamento online",
              "Notificações por WhatsApp",
              "Relatórios básicos",
              "Suporte por e-mail"
            ]}
            buttonText="Comece grátis"
            buttonVariant="outline"
          />
          
          {/* Pro Plan */}
          <PricingCard 
            title="Profissional" 
            price="R$ 139,90" 
            period="/mês"
            description="Para salões em crescimento"
            popular={true}
            features={[
              "Até 6 profissionais",
              "Agendamento online",
              "Notificações por WhatsApp",
              "Relatórios avançados",
              "Gestão de comissões",
              "Personalização da página",
              "Suporte prioritário"
            ]}
            buttonText="Escolher plano"
            buttonVariant="default"
          />
          
          {/* Enterprise Plan */}
          <PricingCard 
            title="Empresarial" 
            price="R$ 249,90" 
            period="/mês"
            description="Para redes de salões"
            features={[
              "Profissionais ilimitados",
              "Múltiplas unidades",
              "Agendamento online",
              "Notificações por WhatsApp",
              "Relatórios completos",
              "Gestão avançada de comissões",
              "API para integrações",
              "Suporte VIP 24/7"
            ]}
            buttonText="Fale conosco"
            buttonVariant="outline"
          />
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Para clientes, o app é 100% gratuito!</p>
          <Button
            variant="link"
            className="text-salon-500 hover:text-salon-600 dark:text-salon-400 dark:hover:text-salon-300"
            onClick={() => navigate('/register')}
          >
            Cadastre-se agora como cliente →
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-12 bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Logo className="h-8 w-8" />
            <span className="font-display text-xl font-bold text-salon-500">SalãoZap</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Sobre nós</Button>
            <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Contato</Button>
            <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Termos de uso</Button>
            <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Privacidade</Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SalãoZap. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

// Pricing Card Component
const PricingCard = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  buttonVariant = "default",
  popular = false 
}: { 
  title: string; 
  price: string; 
  period: string; 
  description: string; 
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  popular?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className={`relative rounded-xl overflow-hidden ${
        popular 
          ? 'bg-salon-500 text-white shadow-xl border-2 border-salon-500 scale-105 z-10' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm'
      }`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-white text-salon-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
          POPULAR
        </div>
      )}
      
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-1 ${popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </h3>
        <p className={`text-sm mb-4 ${popular ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          {description}
        </p>
        
        <div className="mb-6">
          <span className={`text-3xl font-bold ${popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {price}
          </span>
          <span className={popular ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}>
            {period}
          </span>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                popular ? 'text-white' : 'text-salon-500 dark:text-salon-400'
              }`} />
              <span className={popular ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button 
          variant={popular ? "default" : buttonVariant} 
          className={`w-full ${
            popular 
              ? 'bg-white text-salon-500 hover:bg-gray-100' 
              : buttonVariant === "outline" 
                ? 'border-salon-500 text-salon-500 hover:bg-salon-50 dark:border-salon-400 dark:text-salon-400 dark:hover:bg-gray-700' 
                : 'bg-salon-500 text-white hover:bg-salon-600'
          }`}
        >
          {buttonText}
        </Button>
      </div>
    </motion.div>
  );
};

export default Index;

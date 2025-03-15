
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, DollarSign, TrendingUp, 
  Clock, Activity, User, Scissors 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

// Sample data for dashboard charts
const revenueData = [
  { name: 'Jan', value: 2500 },
  { name: 'Fev', value: 3200 },
  { name: 'Mar', value: 2800 },
  { name: 'Abr', value: 3800 },
  { name: 'Mai', value: 4200 },
  { name: 'Jun', value: 3900 },
  { name: 'Jul', value: 4800 },
];

const appointmentsData = [
  { day: 'Seg', cortes: 8, outros: 6 },
  { day: 'Ter', cortes: 12, outros: 8 },
  { day: 'Qua', cortes: 10, outros: 5 },
  { day: 'Qui', cortes: 15, outros: 10 },
  { day: 'Sex', cortes: 18, outros: 12 },
  { day: 'Sáb', cortes: 25, outros: 15 },
  { day: 'Dom', cortes: 0, outros: 0 },
];

const todayAppointments = [
  { time: '09:00', client: 'Maria Silva', service: 'Corte feminino', professional: 'Ana' },
  { time: '10:30', client: 'João Costa', service: 'Barba', professional: 'Carlos' },
  { time: '11:00', client: 'Fernanda Lima', service: 'Coloração', professional: 'Ana' },
  { time: '14:00', client: 'Bruno Santos', service: 'Corte masculino', professional: 'Carlos' },
  { time: '15:30', client: 'Camila Oliveira', service: 'Manicure', professional: 'Patrícia' },
];

const SalonDashboard: React.FC = () => {
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
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Quick stats */}
      <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStatCard 
          icon={<Calendar className="h-6 w-6 text-salon-500" />} 
          title="Hoje" 
          value="12" 
          description="agendamentos" 
        />
        
        <QuickStatCard 
          icon={<Users className="h-6 w-6 text-salon-500" />} 
          title="Clientes" 
          value="156" 
          description="total" 
        />
        
        <QuickStatCard 
          icon={<DollarSign className="h-6 w-6 text-salon-500" />} 
          title="Faturamento" 
          value="R$ 4.850" 
          description="este mês" 
        />
        
        <QuickStatCard 
          icon={<TrendingUp className="h-6 w-6 text-salon-500" />} 
          title="Crescimento" 
          value="18%" 
          description="vs. último mês" 
        />
      </motion.div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemAnimation}>
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
              <CardDescription>
                Receita total por mês em 2023
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, 'Receita']} 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.5rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366f1" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemAnimation}>
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Agendamentos da Semana</CardTitle>
              <CardDescription>
                Agendamentos por dia e por tipo de serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={appointmentsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.5rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="cortes" 
                      name="Cortes" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="outros" 
                      name="Outros serviços" 
                      fill="#a5b4fc" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Today's appointments */}
      <motion.div variants={itemAnimation}>
        <Card className="border-none shadow-md dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-salon-500" />
              Agendamentos de hoje
            </CardTitle>
            <CardDescription>
              Próximos atendimentos programados para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <div 
                  key={index}
                  className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="rounded-full bg-salon-100 p-2 mr-4 text-salon-500 dark:bg-salon-900">
                    {appointment.service.includes('Corte') ? (
                      <Scissors className="h-5 w-5" />
                    ) : (
                      <Activity className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{appointment.service}</h3>
                      <span className="text-sm font-medium bg-salon-100 text-salon-800 px-2 py-0.5 rounded dark:bg-salon-900 dark:text-salon-200">
                        {appointment.time}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:gap-4">
                      <span className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        {appointment.client}
                      </span>
                      <span className="flex items-center">
                        <Scissors className="h-3.5 w-3.5 mr-1" />
                        {appointment.professional}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

interface QuickStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ icon, title, value, description }) => {
  return (
    <Card className="border-none shadow-md dark:bg-gray-800">
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-salon-50 p-3 dark:bg-salon-900">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold">{value}</h3>
              <p className="ml-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalonDashboard;

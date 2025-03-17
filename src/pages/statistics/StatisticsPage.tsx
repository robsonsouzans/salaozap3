
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, 
  PieChart, Pie, Cell
} from 'recharts';

// Sample data
const monthlyData = [
  { month: 'Jan', revenue: 4200, clients: 45 },
  { month: 'Fev', revenue: 3800, clients: 42 },
  { month: 'Mar', revenue: 5100, clients: 60 },
  { month: 'Abr', revenue: 5800, clients: 65 },
  { month: 'Mai', revenue: 6200, clients: 70 },
  { month: 'Jun', revenue: 5900, clients: 68 },
];

const serviceData = [
  { name: 'Corte Feminino', value: 35 },
  { name: 'Corte Masculino', value: 25 },
  { name: 'Coloração', value: 15 },
  { name: 'Manicure', value: 10 },
  { name: 'Pedicure', value: 8 },
  { name: 'Outros', value: 7 },
];

const COLORS = ['#6366f1', '#a5b4fc', '#818cf8', '#c4b5fd', '#d8b4fe', '#f0abfc'];

const StatisticsPage: React.FC = () => {
  const [period, setPeriod] = useState('month');
  
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
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                Estatísticas
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Análise de desempenho e métricas do seu negócio
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <div className="mb-6">
                <Tabs defaultValue={period} onValueChange={setPeriod} className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="week">Semana</TabsTrigger>
                    <TabsTrigger value="month">Mês</TabsTrigger>
                    <TabsTrigger value="quarter">Trimestre</TabsTrigger>
                    <TabsTrigger value="year">Ano</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Faturamento</CardTitle>
                    <CardDescription>
                      Faturamento mensal em 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyData}
                          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `R$ ${value}`}
                            width={80}
                          />
                          <Tooltip 
                            formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                              borderRadius: '0.5rem',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#6366f1" 
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Clientes Atendidos</CardTitle>
                    <CardDescription>
                      Total de clientes por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyData}
                          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value} clientes`, 'Total']}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                              borderRadius: '0.5rem',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="clients" 
                            fill="#6366f1" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Serviços</CardTitle>
                  <CardDescription>
                    Percentual de cada serviço no faturamento total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Participação']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            borderRadius: '0.5rem',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default StatisticsPage;

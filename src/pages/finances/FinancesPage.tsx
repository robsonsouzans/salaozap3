
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';

const FinancesPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const [activeTab, setActiveTab] = useState(section || 'sales');
  
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
                Financeiro
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gerencie suas finanças, pagamentos e comissões
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                  <TabsTrigger value="sales">Vendas</TabsTrigger>
                  <TabsTrigger value="commissions">Comissões</TabsTrigger>
                  <TabsTrigger value="billing">Faturamento</TabsTrigger>
                  <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales">
                  <Card>
                    <CardHeader>
                      <CardTitle>Relatório de Vendas</CardTitle>
                      <CardDescription>
                        Visualize e gerencie todas as suas vendas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">Funcionalidade em desenvolvimento</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Relatórios detalhados de vendas estarão disponíveis em breve.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="commissions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comissões</CardTitle>
                      <CardDescription>
                        Gerencie as comissões dos profissionais
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">Funcionalidade em desenvolvimento</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Gestão de comissões estará disponível em breve.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="billing">
                  <Card>
                    <CardHeader>
                      <CardTitle>Faturamento</CardTitle>
                      <CardDescription>
                        Acompanhe seu faturamento mensal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">Funcionalidade em desenvolvimento</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Relatórios detalhados de faturamento estarão disponíveis em breve.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pagamentos</CardTitle>
                      <CardDescription>
                        Gerencie métodos e histórico de pagamentos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">Funcionalidade em desenvolvimento</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Gestão de pagamentos estará disponível em breve.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default FinancesPage;

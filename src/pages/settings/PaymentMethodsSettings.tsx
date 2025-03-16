
import React, { useState } from 'react';
import { CreditCard, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import SettingsLayout from '@/components/settings/SettingsLayout';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-start">
        <div className="mr-4 mt-0.5 rounded-full bg-salon-50 p-2 dark:bg-gray-800">
          <Icon className="h-5 w-5 text-salon-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

const PaymentMethodsSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [paymentMethods, setPaymentMethods] = useState({
    cash: { enabled: true, discount: 0 },
    credit: { enabled: true, fee: 0 },
    debit: { enabled: true, fee: 0 },
    pix: { enabled: true, discount: 0 },
    installment: { enabled: true, maxInstallments: 3, minValue: 100 },
  });
  
  const handlePaymentMethodToggle = (method) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        enabled: !prev[method].enabled
      }
    }));
  };
  
  const handleValueChange = (method, field, value) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value === '' ? 0 : Number(value)
      }
    }));
  };
  
  const saveSettings = () => {
    toast({
      title: "Métodos de pagamento atualizados",
      description: "Suas configurações de pagamento foram salvas com sucesso"
    });
  };
  
  return (
    <SettingsLayout 
      title="Métodos de Pagamento" 
      description="Configure quais formas de pagamento seu salão aceita"
      currentTab="general"
    >
      <Card className="border-none shadow-md dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>
            Defina quais métodos de pagamento são aceitos e suas configurações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            icon={DollarSign}
            title="Dinheiro"
            description="Pagamentos em espécie"
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={paymentMethods.cash.enabled}
                onCheckedChange={() => handlePaymentMethodToggle('cash')}
              />
              {paymentMethods.cash.enabled && (
                <div className="flex items-center">
                  <span className="text-sm mr-2">Desconto:</span>
                  <div className="relative w-20">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={paymentMethods.cash.discount}
                      onChange={(e) => handleValueChange('cash', 'discount', e.target.value)}
                      className="pl-2 pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                      <Percent className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SettingItem>
          
          <SettingItem
            icon={CreditCard}
            title="Cartão de Crédito"
            description="Pagamentos com cartão de crédito"
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={paymentMethods.credit.enabled}
                onCheckedChange={() => handlePaymentMethodToggle('credit')}
              />
              {paymentMethods.credit.enabled && (
                <div className="flex items-center">
                  <span className="text-sm mr-2">Taxa:</span>
                  <div className="relative w-20">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={paymentMethods.credit.fee}
                      onChange={(e) => handleValueChange('credit', 'fee', e.target.value)}
                      className="pl-2 pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                      <Percent className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SettingItem>
          
          <SettingItem
            icon={CreditCard}
            title="Cartão de Débito"
            description="Pagamentos com cartão de débito"
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={paymentMethods.debit.enabled}
                onCheckedChange={() => handlePaymentMethodToggle('debit')}
              />
              {paymentMethods.debit.enabled && (
                <div className="flex items-center">
                  <span className="text-sm mr-2">Taxa:</span>
                  <div className="relative w-20">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={paymentMethods.debit.fee}
                      onChange={(e) => handleValueChange('debit', 'fee', e.target.value)}
                      className="pl-2 pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                      <Percent className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SettingItem>
          
          <SettingItem
            icon={DollarSign}
            title="PIX"
            description="Pagamentos via PIX"
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={paymentMethods.pix.enabled}
                onCheckedChange={() => handlePaymentMethodToggle('pix')}
              />
              {paymentMethods.pix.enabled && (
                <div className="flex items-center">
                  <span className="text-sm mr-2">Desconto:</span>
                  <div className="relative w-20">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={paymentMethods.pix.discount}
                      onChange={(e) => handleValueChange('pix', 'discount', e.target.value)}
                      className="pl-2 pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                      <Percent className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SettingItem>
          
          <SettingItem
            icon={CreditCard}
            title="Parcelamento"
            description="Permita pagamentos parcelados no cartão de crédito"
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={paymentMethods.installment.enabled}
                onCheckedChange={() => handlePaymentMethodToggle('installment')}
              />
              {paymentMethods.installment.enabled && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Máx. parcelas:</span>
                    <Input
                      type="number"
                      min="2"
                      max="12"
                      value={paymentMethods.installment.maxInstallments}
                      onChange={(e) => handleValueChange('installment', 'maxInstallments', e.target.value)}
                      className="w-16"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Valor mín. R$:</span>
                    <Input
                      type="number"
                      min="0"
                      value={paymentMethods.installment.minValue}
                      onChange={(e) => handleValueChange('installment', 'minValue', e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              )}
            </div>
          </SettingItem>
          
          <div className="pt-4">
            <Button onClick={saveSettings}>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default PaymentMethodsSettings;

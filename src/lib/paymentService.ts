
import { toast } from "@/hooks/use-toast";

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'pix' | 'money' | 'other';
  isDefault?: boolean;
  isActive: boolean;
}

// Mock payment methods data
const paymentMethods: PaymentMethod[] = [
  { 
    id: '1', 
    name: 'Cartão de Crédito', 
    type: 'credit', 
    isDefault: true,
    isActive: true
  },
  { 
    id: '2', 
    name: 'Cartão de Débito', 
    type: 'debit',
    isActive: true
  },
  { 
    id: '3', 
    name: 'PIX', 
    type: 'pix',
    isActive: true
  },
  { 
    id: '4', 
    name: 'Dinheiro', 
    type: 'money',
    isActive: true
  },
  { 
    id: '5', 
    name: 'Boleto Bancário', 
    type: 'other',
    isActive: false
  },
];

// Get all payment methods
export const getAllPaymentMethods = (): PaymentMethod[] => {
  return [...paymentMethods];
};

// Get only active payment methods
export const getActivePaymentMethods = (): PaymentMethod[] => {
  return paymentMethods.filter(method => method.isActive);
};

// Get a payment method by ID
export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return paymentMethods.find(method => method.id === id);
};

// Add new payment method
export const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>): PaymentMethod => {
  const newMethod = {
    ...method,
    id: Math.random().toString(36).substring(2, 9),
  };
  
  paymentMethods.push(newMethod);
  toast({
    title: "Método de pagamento adicionado",
    description: `${newMethod.name} foi adicionado aos seus métodos de pagamento.`,
  });
  
  return newMethod;
};

// Update payment method
export const updatePaymentMethod = (id: string, updatedMethod: Partial<PaymentMethod>): PaymentMethod | null => {
  const index = paymentMethods.findIndex(method => method.id === id);
  
  if (index === -1) {
    return null;
  }
  
  paymentMethods[index] = { ...paymentMethods[index], ...updatedMethod };
  toast({
    title: "Método de pagamento atualizado",
    description: "As informações foram atualizadas com sucesso.",
  });
  
  return paymentMethods[index];
};

// Delete payment method
export const deletePaymentMethod = (id: string): boolean => {
  const index = paymentMethods.findIndex(method => method.id === id);
  
  if (index === -1) {
    return false;
  }
  
  const method = paymentMethods[index];
  paymentMethods.splice(index, 1);
  
  toast({
    title: "Método de pagamento removido",
    description: `${method.name} foi removido dos seus métodos de pagamento.`,
    variant: "destructive",
  });
  
  return true;
};

// Set a payment method as default
export const setDefaultPaymentMethod = (id: string): boolean => {
  const method = paymentMethods.find(method => method.id === id);
  
  if (!method) {
    return false;
  }
  
  // First, remove isDefault from all methods
  paymentMethods.forEach(m => {
    m.isDefault = false;
  });
  
  // Then set the selected method as default
  method.isDefault = true;
  
  toast({
    title: "Método de pagamento padrão alterado",
    description: `${method.name} foi definido como seu método de pagamento padrão.`,
  });
  
  return true;
};

// Toggle payment method active status
export const togglePaymentMethodActive = (id: string): boolean => {
  const method = paymentMethods.find(method => method.id === id);
  
  if (!method) {
    return false;
  }
  
  method.isActive = !method.isActive;
  
  toast({
    title: method.isActive 
      ? "Método de pagamento ativado" 
      : "Método de pagamento desativado",
    description: method.isActive 
      ? `${method.name} foi ativado e está disponível para uso.` 
      : `${method.name} foi desativado e não está disponível para uso.`,
  });
  
  return true;
};

import { UserData, Transaction, Account, Budget, Goal, Product } from './types';

const STORAGE_KEY = 'la-plata-data';

// Dados iniciais para demonstração
const initialData: UserData = {
  user: {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com'
  },
  accounts: [
    {
      id: '1',
      name: 'Conta Corrente',
      type: 'checking',
      balance: 5420.50,
      bank: 'Banco do Brasil'
    },
    {
      id: '2',
      name: 'Poupança',
      type: 'savings',
      balance: 12800.00,
      bank: 'Nubank'
    },
    {
      id: '3',
      name: 'Cartão de Crédito',
      type: 'credit',
      balance: -1250.30,
      bank: 'Itaú'
    }
  ],
  transactions: [
    {
      id: '1',
      description: 'Salário',
      amount: 4500.00,
      category: 'Renda',
      date: '2024-01-15',
      type: 'income',
      account: 'Conta Corrente'
    },
    {
      id: '2',
      description: 'Supermercado',
      amount: -320.50,
      category: 'Alimentação',
      date: '2024-01-14',
      type: 'expense',
      account: 'Cartão de Crédito'
    },
    {
      id: '3',
      description: 'Combustível',
      amount: -180.00,
      category: 'Transporte',
      date: '2024-01-13',
      type: 'expense',
      account: 'Conta Corrente'
    },
    {
      id: '4',
      description: 'Freelance',
      amount: 800.00,
      category: 'Renda Extra',
      date: '2024-01-12',
      type: 'income',
      account: 'Conta Corrente'
    },
    {
      id: '5',
      description: 'Restaurante',
      amount: -95.00,
      category: 'Alimentação',
      date: '2024-01-11',
      type: 'expense',
      account: 'Cartão de Crédito'
    }
  ],
  budgets: [
    {
      id: '1',
      category: 'Alimentação',
      limit: 800.00,
      spent: 415.50,
      month: '2024-01'
    },
    {
      id: '2',
      category: 'Transporte',
      limit: 400.00,
      spent: 180.00,
      month: '2024-01'
    },
    {
      id: '3',
      category: 'Lazer',
      limit: 300.00,
      spent: 95.00,
      month: '2024-01'
    }
  ],
  goals: [
    {
      id: '1',
      name: 'Reserva de Emergência',
      targetAmount: 20000.00,
      currentAmount: 12800.00,
      deadline: '2024-12-31',
      category: 'Emergência'
    },
    {
      id: '2',
      name: 'Viagem Europa',
      targetAmount: 8000.00,
      currentAmount: 2400.00,
      deadline: '2024-07-01',
      category: 'Lazer'
    }
  ],
  products: []
};

export const loadUserData = (): UserData => {
  if (typeof window === 'undefined') return initialData;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Garante que products existe (compatibilidade com dados antigos)
      if (!data.products) {
        data.products = [];
      }
      return data;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }
  
  // Se não há dados salvos, salva os dados iniciais
  saveUserData(initialData);
  return initialData;
};

export const saveUserData = (data: UserData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): string => {
  const data = loadUserData();
  const transactionId = Date.now().toString();
  const newTransaction: Transaction = {
    ...transaction,
    id: transactionId
  };
  
  data.transactions.unshift(newTransaction);
  saveUserData(data);
  return transactionId;
};

export const addProducts = (products: Product[]): void => {
  const data = loadUserData();
  data.products.push(...products);
  saveUserData(data);
};

export const addBudget = (budget: Omit<Budget, 'id' | 'spent'>): void => {
  const data = loadUserData();
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
    spent: 0
  };
  
  data.budgets.push(newBudget);
  saveUserData(data);
};

export const addGoal = (goal: Omit<Goal, 'id'>): void => {
  const data = loadUserData();
  const newGoal: Goal = {
    ...goal,
    id: Date.now().toString()
  };
  
  data.goals.push(newGoal);
  saveUserData(data);
};

export const getProductsByPeriod = (startDate: string, endDate: string): Product[] => {
  const data = loadUserData();
  const transactions = data.transactions.filter(t => 
    t.date >= startDate && t.date <= endDate && t.products
  );
  
  const products: Product[] = [];
  transactions.forEach(transaction => {
    if (transaction.products) {
      products.push(...transaction.products);
    }
  });
  
  return products;
};

export const getProductStats = (startDate: string, endDate: string) => {
  const products = getProductsByPeriod(startDate, endDate);
  
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    categories: {} as Record<string, { count: number; value: number }>,
    topProducts: {} as Record<string, { quantity: number; value: number }>
  };
  
  products.forEach(product => {
    // Stats por categoria
    if (!stats.categories[product.category]) {
      stats.categories[product.category] = { count: 0, value: 0 };
    }
    stats.categories[product.category].count += product.quantity;
    stats.categories[product.category].value += product.price * product.quantity;
    
    // Top produtos
    if (!stats.topProducts[product.name]) {
      stats.topProducts[product.name] = { quantity: 0, value: 0 };
    }
    stats.topProducts[product.name].quantity += product.quantity;
    stats.topProducts[product.name].value += product.price * product.quantity;
  });
  
  return stats;
};
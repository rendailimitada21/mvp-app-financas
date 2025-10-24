// Tipos para o aplicativo La Plata
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  account: string;
  source?: 'manual' | 'photo' | 'audio' | 'file';
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  transactionId: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  bank: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserData {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  products: Product[];
}

export interface ReceiptAnalysis {
  store: string;
  date: string;
  total: number;
  products: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface AudioTranscription {
  text: string;
  confidence: number;
  transactions: {
    description: string;
    amount: number;
    category: string;
  }[];
}
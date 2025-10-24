'use client';

import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart,
  Wallet,
  Calendar,
  Filter,
  Download,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { UserData, Transaction, Account, Budget, Goal } from '@/lib/types';
import { loadUserData, saveUserData, addTransaction, addBudget, addGoal } from '@/lib/storage';

export default function LaPlataApp() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'goals' | 'reports'>('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    setUserData(loadUserData());
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando La Plata...</p>
        </div>
      </div>
    );
  }

  const totalBalance = userData.accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = userData.transactions
    .filter(t => t.type === 'income' && t.date.startsWith('2024-01'))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = userData.transactions
    .filter(t => t.type === 'expense' && t.date.startsWith('2024-01'))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const transaction = {
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as 'income' | 'expense',
      account: formData.get('account') as string,
    };

    addTransaction(transaction);
    setUserData(loadUserData());
    setShowAddTransaction(false);
    e.currentTarget.reset();
  };

  const handleAddBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const budget = {
      category: formData.get('category') as string,
      limit: parseFloat(formData.get('limit') as string),
      month: formData.get('month') as string,
    };

    addBudget(budget);
    setUserData(loadUserData());
    setShowAddBudget(false);
    e.currentTarget.reset();
  };

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const goal = {
      name: formData.get('name') as string,
      targetAmount: parseFloat(formData.get('targetAmount') as string),
      currentAmount: parseFloat(formData.get('currentAmount') as string) || 0,
      deadline: formData.get('deadline') as string,
      category: formData.get('category') as string,
    };

    addGoal(goal);
    setUserData(loadUserData());
    setShowAddGoal(false);
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                La Plata
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'transactions', label: 'Transações', icon: CreditCard },
              { id: 'budgets', label: 'Orçamentos', icon: PieChart },
              { id: 'goals', label: 'Metas', icon: Target },
              { id: 'reports', label: 'Relatórios', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                    <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receitas (Jan)</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Despesas (Jan)</p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <ArrowDownRight className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Accounts */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Contas</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Conectar Conta
                  </button>
                </div>
                <div className="space-y-4">
                  {userData.accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <p className="text-sm text-gray-500">{account.bank}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Transações Recentes</h2>
                  <button 
                    onClick={() => setShowAddTransaction(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {userData.transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Orçamentos de Janeiro</h2>
                <button 
                  onClick={() => setShowAddBudget(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Criar Orçamento
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userData.budgets.map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  return (
                    <div key={budget.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{budget.category}</h3>
                        <span className={`text-sm font-medium ${percentage > 80 ? 'text-red-600' : percentage > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>R$ {budget.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span>R$ {budget.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filtrar</span>
                </button>
                <button 
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Nova Transação</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.type === 'income' ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.account}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
              <button 
                onClick={() => setShowAddBudget(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Novo Orçamento</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const remaining = budget.limit - budget.spent;
                
                return (
                  <div key={budget.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <PieChart className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progresso</span>
                        <span className={`text-sm font-medium ${percentage > 80 ? 'text-red-600' : percentage > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gasto:</span>
                        <span className="text-sm font-medium text-red-600">
                          R$ {budget.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Limite:</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {budget.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Restante:</span>
                        <span className={`text-sm font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900">Metas Financeiras</h1>
              <button 
                onClick={() => setShowAddGoal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Nova Meta</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.goals.map((goal) => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                const remaining = goal.targetAmount - goal.currentAmount;
                const daysUntilDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={goal.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progresso</span>
                        <span className="text-sm font-medium text-green-600">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Atual:</span>
                        <span className="text-sm font-medium text-green-600">
                          R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Meta:</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Faltam:</span>
                        <span className="text-sm font-medium text-blue-600">
                          R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {daysUntilDeadline > 0 ? `${daysUntilDeadline} dias restantes` : 'Prazo vencido'}
                        </span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {goal.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Despesas Totais</p>
                    <p className="text-xl font-bold text-red-600">
                      R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Economia</p>
                    <p className="text-xl font-bold text-blue-600">
                      R$ {(monthlyIncome - monthlyExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transações</p>
                    <p className="text-xl font-bold text-gray-900">{userData.transactions.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gastos por Categoria</h2>
              <div className="space-y-4">
                {Object.entries(
                  userData.transactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
                      return acc;
                    }, {} as Record<string, number>)
                ).map(([category, amount]) => {
                  const percentage = (amount / monthlyExpenses) * 100;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900">{category}</span>
                          <span className="text-sm text-gray-600">
                            R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Transação</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Supermercado"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Casa">Casa</option>
                  <option value="Renda">Renda</option>
                  <option value="Renda Extra">Renda Extra</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conta</label>
                  <select
                    name="account"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma conta</option>
                    {userData.accounts.map((account) => (
                      <option key={account.id} value={account.name}>{account.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Orçamento</h2>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Casa">Casa</option>
                  <option value="Roupas">Roupas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limite Mensal</label>
                <input
                  type="number"
                  name="limit"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                <input
                  type="month"
                  name="month"
                  required
                  defaultValue="2024-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Meta</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Meta</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Viagem para Europa"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Meta</label>
                  <input
                    type="number"
                    name="targetAmount"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Atual</label>
                  <input
                    type="number"
                    name="currentAmount"
                    step="0.01"
                    defaultValue="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="Emergência">Emergência</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Casa">Casa</option>
                    <option value="Educação">Educação</option>
                    <option value="Investimento">Investimento</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
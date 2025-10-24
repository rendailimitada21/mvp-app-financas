import { ReceiptAnalysis, AudioTranscription, Product } from './types';

// Simula análise de imagem de cupom fiscal usando OpenAI Vision API
export const analyzeReceipt = async (imageFile: File): Promise<ReceiptAnalysis> => {
  // Simula processamento da imagem
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Dados simulados de análise de cupom fiscal
  const mockAnalysis: ReceiptAnalysis = {
    store: 'Supermercado Extra',
    date: new Date().toISOString().split('T')[0],
    total: 127.45,
    products: [
      { name: 'Arroz Branco 5kg', price: 18.90, quantity: 1 },
      { name: 'Feijão Preto 1kg', price: 7.50, quantity: 2 },
      { name: 'Óleo de Soja 900ml', price: 4.99, quantity: 1 },
      { name: 'Açúcar Cristal 1kg', price: 3.20, quantity: 1 },
      { name: 'Leite Integral 1L', price: 4.50, quantity: 3 },
      { name: 'Pão de Forma', price: 5.80, quantity: 2 },
      { name: 'Banana Prata kg', price: 4.90, quantity: 2 },
      { name: 'Tomate kg', price: 6.80, quantity: 1.5 },
      { name: 'Cebola kg', price: 3.50, quantity: 1 },
      { name: 'Frango kg', price: 12.90, quantity: 2 },
      { name: 'Detergente', price: 2.99, quantity: 2 },
      { name: 'Papel Higiênico 12un', price: 15.80, quantity: 1 },
      { name: 'Sabão em Pó 1kg', price: 8.90, quantity: 1 },
      { name: 'Refrigerante 2L', price: 6.50, quantity: 2 },
      { name: 'Biscoito Recheado', price: 3.80, quantity: 3 }
    ]
  };
  
  return mockAnalysis;
};

// Simula transcrição de áudio usando Web Speech API ou serviço externo
export const transcribeAudio = async (audioFile: File): Promise<AudioTranscription> => {
  // Simula processamento do áudio
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Dados simulados de transcrição
  const mockTranscription: AudioTranscription = {
    text: 'Gastei cinquenta e dois reais no supermercado hoje, comprei leite, pão e frutas. Também paguei vinte e cinco reais de combustível no posto.',
    confidence: 0.92,
    transactions: [
      {
        description: 'Compras no supermercado',
        amount: 52.00,
        category: 'Alimentação'
      },
      {
        description: 'Combustível',
        amount: 25.00,
        category: 'Transporte'
      }
    ]
  };
  
  return mockTranscription;
};

// Simula análise de arquivo (PDF, Excel, etc.)
export const analyzeFile = async (file: File): Promise<any> => {
  // Simula processamento do arquivo
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const fileType = file.type;
  
  if (fileType.includes('pdf')) {
    // Simula extração de dados de PDF (extrato bancário)
    return {
      type: 'bank_statement',
      transactions: [
        { description: 'PIX Recebido', amount: 500.00, date: '2024-01-15', type: 'income' },
        { description: 'Débito Automático - Energia', amount: -120.50, date: '2024-01-14', type: 'expense' },
        { description: 'Compra Cartão - Farmácia', amount: -45.80, date: '2024-01-13', type: 'expense' },
        { description: 'TED Enviado', amount: -200.00, date: '2024-01-12', type: 'expense' }
      ]
    };
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
    // Simula leitura de planilha
    return {
      type: 'spreadsheet',
      transactions: [
        { description: 'Salário', amount: 4500.00, category: 'Renda', type: 'income' },
        { description: 'Aluguel', amount: -1200.00, category: 'Casa', type: 'expense' },
        { description: 'Internet', amount: -89.90, category: 'Casa', type: 'expense' }
      ]
    };
  }
  
  return { type: 'unknown', data: null };
};

// Categoriza produtos automaticamente
export const categorizeProduct = (productName: string): string => {
  const name = productName.toLowerCase();
  
  if (name.includes('arroz') || name.includes('feijão') || name.includes('açúcar') || 
      name.includes('óleo') || name.includes('leite') || name.includes('pão') ||
      name.includes('banana') || name.includes('tomate') || name.includes('cebola') ||
      name.includes('frango') || name.includes('carne') || name.includes('refrigerante') ||
      name.includes('biscoito')) {
    return 'Alimentação';
  }
  
  if (name.includes('detergente') || name.includes('papel higiênico') || 
      name.includes('sabão') || name.includes('shampoo') || name.includes('pasta de dente')) {
    return 'Casa';
  }
  
  if (name.includes('remédio') || name.includes('vitamina') || name.includes('medicamento')) {
    return 'Saúde';
  }
  
  if (name.includes('roupa') || name.includes('sapato') || name.includes('camisa')) {
    return 'Roupas';
  }
  
  return 'Outros';
};

// Converte análise de cupom em produtos estruturados
export const convertReceiptToProducts = (analysis: ReceiptAnalysis, transactionId: string): Product[] => {
  return analysis.products.map((product, index) => ({
    id: `${transactionId}-product-${index}`,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    category: categorizeProduct(product.name),
    transactionId
  }));
};
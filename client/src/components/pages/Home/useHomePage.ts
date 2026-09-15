import { useState, useEffect } from 'react';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface HomePageData {
  stats: Stat[];
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export function useHomePage() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData: HomePageData = {
          stats: [
            { label: 'Obras Ativas', value: 12, icon: '🏗️', trend: { value: '+2', isPositive: true } },
            { label: 'Compras do Mês', value: 47, icon: '📦', trend: { value: '+5', isPositive: true } },
            { label: 'Gastos Totais', value: 'R$ 245.890', icon: '💰', trend: { value: '+12%', isPositive: false } },
            { label: 'Fornecedores', value: 23, icon: '🚚', trend: { value: '+3', isPositive: true } },
          ],
          recentActivity: [
            { id: '1', type: 'compra', description: 'Compra de cimento - Obra Central', timestamp: '2 horas atrás' },
            { id: '2', type: 'gasto', description: 'Pagamento mão de obra - Obra Norte', timestamp: '5 horas atrás' },
            { id: '3', type: 'obra', description: 'Nova obra cadastrada: Residencial Sul', timestamp: '1 dia atrás' },
            { id: '4', type: 'fornecedor', description: 'Novo fornecedor: Materiais São João', timestamp: '2 dias atrás' },
            { id: '5', type: 'compra', description: 'Compra de tijolos - Obra Leste', timestamp: '3 dias atrás' },
          ],
        };
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados da página inicial');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
import { api } from '@services/api';

export type DashboardMonthlyResponse = {
  greeting: { name: string | null };
  period: { year: number; month: number };
  totals: { currency: 'BRL'; total: string; paid: string; pending: string };
  counts: { paid: number; pending: number };
  categories: Array<{ category: string; total: string }>;
  recent: Array<{
    id: string;
    kind: 'expense' | 'installment';
    description: string;
    category: string;
    amount: string;
    currency: 'BRL';
    isPaid: boolean;
    dueDate: string;
    expenseId?: string;
    installmentNumber?: number;
  }>;
};

export async function getDashboardMonthly(params: {
  year: number;
  month: number;
}): Promise<DashboardMonthlyResponse> {
  const res = await api.get<DashboardMonthlyResponse>('/dashboard/monthly', {
    params,
  });
  return res.data;
}

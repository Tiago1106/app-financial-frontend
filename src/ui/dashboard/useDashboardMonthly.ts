import { useQuery } from '@tanstack/react-query';
import { getDashboardMonthly } from '@services/dashboard';

function currentMonthUtc() {
  const now = new Date();
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
  };
}

export function useDashboardMonthly(params?: { year: number; month: number }) {
  const p = params ?? currentMonthUtc();

  return useQuery({
    queryKey: ['dashboard', 'monthly', p.year, p.month],
    queryFn: () => getDashboardMonthly(p),
  });
}

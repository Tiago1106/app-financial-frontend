export function formatCurrencyBRL(amount: string | number): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(safe);
}

export function formatMonthYearPtBR(year: number, month: number): string {
  const date = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const monthName = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(date);
  return `${monthName} de ${year}`;
}

export function formatShortDateOrTodayPtBR(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) return 'Hoje';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
    .format(d)
    .replace('.', '');
}

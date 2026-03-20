import { ptBR } from './pt-BR';

export type Messages = typeof ptBR;

export const messages = ptBR;

export function t(path: string): string {
  const parts = path.split('.');
  let value: unknown = messages;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in (value as object)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}

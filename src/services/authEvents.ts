export type AuthEvent =
  | { type: 'signedIn' }
  | { type: 'signedOut' };

type Listener = (event: AuthEvent) => void;

const listeners = new Set<Listener>();

export function emitAuthEvent(event: AuthEvent) {
  for (const listener of listeners) {
    listener(event);
  }
}

export function subscribeAuthEvents(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

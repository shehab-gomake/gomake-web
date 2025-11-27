declare module '@rails/actioncable' {
  export interface Subscription {
    unsubscribe(): void;
    perform(action: string, data?: any): void;
    send(data: any): void;
  }

  export interface Consumer {
    subscriptions: {
      create(
        channel: string | { channel: string; [key: string]: any },
        callbacks?: {
          connected?: () => void;
          disconnected?: () => void;
          received?: (data: any) => void;
          rejected?: () => void;
        }
      ): Subscription;
    };
    disconnect(): void;
    send(data: any): void;
  }

  export function createConsumer(url?: string): Consumer;
}


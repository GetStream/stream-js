declare module 'faye' {
  type UR = Record<string, unknown>;

  type Message<T extends UR = UR> = UR & {
    channel: string;
    clientId?: string;
    data?: T;
    subscription?: string;
    successful?: boolean;
  };

  type Subscription = {
    cancel: () => void;
  };

  type Callback<T extends UR = UR> = (message: Message<T>) => unknown;
  type SubscribeCallback<T extends UR = UR> = (data: T) => unknown;

  type Middleware<T extends UR = UR> = {
    incoming: (message: Message<T>, callback: Callback<T>) => unknown;
    outgoing: (message: Message<T>, callback: Callback<T>) => unknown;
  };

  export class Client<T extends UR = UR> {
    constructor(url: string, options: { timeout: number });
    addExtension(extension: Middleware<T>): void;
    subscribe(channel: string, callback: SubscribeCallback<T>): Promise<Subscription>;
    disconnect(): void;
  }
}

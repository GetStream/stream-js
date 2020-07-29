declare module 'faye' {
  type Message = {
    // TODO: generalize
    [key: string]: unknown;
    subscription?: string;
  };

  type Subscription = {
    cancel: () => void;
  };

  type Callback = (message: Message) => unknown;

  interface Middleware {
    incoming: (message: Message, callback: Callback) => unknown;
    outgoing: (message: Message, callback: Callback) => unknown;
  }

  export class Client {
    constructor(url: string, options: { timeout: number });

    addExtension(extension: Middleware): void;

    subscribe(channel: string, callback: Callback): Promise<Subscription>;
  }
}

declare module 'Base64' {
  function atob(input: string): string;
}

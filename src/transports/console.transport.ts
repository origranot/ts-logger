import { Transport, TransportOptions, TransportPayload } from './transport';

export interface ConsoleTransportOptions extends TransportOptions {
  fullFormat?: boolean;
}

export class ConsoleTransport extends Transport {
  constructor(private readonly consoleOptions?: ConsoleTransportOptions) {
    super(consoleOptions);

    this.consoleOptions = consoleOptions || {};
    this.consoleOptions.fullFormat = this.consoleOptions.fullFormat ?? true;
  }

  handle({ message }: TransportPayload): void {
    if (!this.consoleOptions?.fullFormat) {
      message = message.split('\n')[0];
    }
    console.log(message);
  }
}

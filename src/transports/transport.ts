import { SimpleFormatter } from '../formatters';
import { Formatter } from '../interfaces/formatter';

export interface TransportOptions {
  formatter?: Formatter;
}

export interface TransportPayload {
  message: string;
}

export abstract class Transport {
  constructor(options?: TransportOptions) {
    this.options = options || {
      formatter: new SimpleFormatter()
    };
  }
  public options: TransportOptions;
  abstract handle(payload: TransportPayload): void;
}

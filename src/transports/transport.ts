import { LOG_LEVEL } from '../enums';
import { SimpleFormatter } from '../formatters';
import { Formatter } from '../interfaces/formatter';

export interface TransportOptions {
  formatter?: Formatter;
  threshold?: LOG_LEVEL;
}

export interface TransportPayload {
  message: string;
}

export abstract class Transport {
  constructor(options?: TransportOptions) {
    this.options = options || {};
    this.options.formatter = this.options.formatter || new SimpleFormatter();
    this.options.threshold = this.options.threshold || LOG_LEVEL.DEBUG;
  }
  
  public options: TransportOptions;
  abstract handle(payload: TransportPayload): void;
}

import { ConsoleTransport } from './transports/console.transport';
import { LOG_LEVEL } from './enums';
import { Transport } from './transport';

export interface LoggerOptions {
  timeStamps?: boolean;
  threshold?: LOG_LEVEL;
  transports?: Transport[];
}

export interface DecoratorOptions {
  executionTime?: boolean;
}

export interface LogOptions {
  metadata?: {
    [name: string]: any;
  };
}

export class Logger {
  constructor(loggerOptions?: LoggerOptions) {
    this.options = loggerOptions || {
      threshold: LOG_LEVEL.DEBUG
    };

    this.options.transports = this.options.transports || [new ConsoleTransport()];
  }

  private options: LoggerOptions;

  private log(level: LOG_LEVEL, message: string, options?: LogOptions) {
    if (level < this.options.threshold!) {
      return;
    }

    for (const transport of this.options.transports!) {
      transport.handle({
        level,
        message,
        metadata: options?.metadata,
        timestamp: this.options.timeStamps ? new Date() : undefined
      });
    }
  }

  decorate(level: LOG_LEVEL, options: DecoratorOptions = {}) {
    const { executionTime } = options;
    return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
      if (!descriptor) {
        console.log('descriptor is null, not a function?');
        return;
      }

      const originalMethod = descriptor.value;
      descriptor.value = (...args: any[]) => {
        const start = Date.now();
        const metadata: {
          args?: any[];
          returns?: any;
          executionTime?: string;
        } = {};

        metadata.args = args || [];

        const result = originalMethod.apply(this, args);
        if (result !== undefined) {
          metadata.returns = result;
        }

        if (executionTime) {
          const end = Date.now();
          metadata.executionTime = `${end - start}ms`;
        }

        this.log(level, `[${propertyKey}]`, { metadata });
        return result;
      };
    };
  }

  debug(message: string, options?: LogOptions) {
    this.log(LOG_LEVEL.DEBUG, message, options);
  }
  info(message: string, options?: LogOptions) {
    this.log(LOG_LEVEL.INFO, message, options);
  }
  warn(message: string, options?: LogOptions) {
    this.log(LOG_LEVEL.WARN, message, options);
  }
  error(message: string, options?: LogOptions) {
    this.log(LOG_LEVEL.ERROR, message, options);
  }
  fatal(message: string, options?: LogOptions) {
    this.log(LOG_LEVEL.FATAL, message, options);
  }
}

import { ConsoleTransport } from './transports/console.transport';
import { LOG_LEVEL } from './enums';
import { Transport, Formatter } from './interfaces';
import { SimpleFormatter } from './formatters';

export interface LoggerOptions {
  timeStamps?: boolean;
  threshold?: LOG_LEVEL;
  formatter?: Formatter;
  transports?: Transport[];
}

export interface DecoratorOptions {
  executionTime?: boolean;
}

export class Logger {
  constructor(loggerOptions?: LoggerOptions) {
    this.options = loggerOptions || {};

    // Default timestamp to be true if not provided
    this.options.timeStamps = this.options.timeStamps === undefined ? true : this.options.timeStamps;
    this.options.threshold = this.options.threshold || LOG_LEVEL.DEBUG;
    this.options.transports = this.options.transports || [new ConsoleTransport()];
    this.options.formatter = this.options.formatter || new SimpleFormatter();
  }

  private options: LoggerOptions;

  private log(level: LOG_LEVEL, ...args: unknown[]) {
    if (level < this.options.threshold!) {
      return;
    }

    const formattedLog = this.options.formatter!.format({
      level,
      args,
      timestamp: this.options.timeStamps ? new Date() : undefined
    });

    for (const transport of this.options.transports!) {
      transport.handle({ message: formattedLog });
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

        this.log(level, `[${propertyKey}]`, { ...metadata });
        return result;
      };
    };
  }

  debug(...args: unknown[]) {
    this.log(LOG_LEVEL.DEBUG, ...args);
  }
  info(...args: unknown[]) {
    this.log(LOG_LEVEL.INFO, ...args);
  }
  warn(...args: unknown[]) {
    this.log(LOG_LEVEL.WARN, ...args);
  }
  error(...args: unknown[]) {
    this.log(LOG_LEVEL.ERROR, ...args);
  }
  fatal(...args: unknown[]) {
    this.log(LOG_LEVEL.FATAL, ...args);
  }
}

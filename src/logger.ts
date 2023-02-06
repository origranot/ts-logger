import 'reflect-metadata';
import { LOG_LEVEL } from './enums';
import { LogHandler } from './log-handler';
import { ConsoleHandler } from './handlers';

export const OLOG_KEY = Symbol('olog');

export interface LoggerOptions {
  timeStamps?: boolean;
  threshold?: LOG_LEVEL;
  handlers?: LogHandler[];
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

    this.options.handlers = this.options.handlers || [new ConsoleHandler()];
  }

  private options: LoggerOptions;

  private log(level: LOG_LEVEL, message: string, options?: LogOptions) {
    if (level < this.options.threshold!) {
      return;
    }

    for (const handler of this.options.handlers!) {
      handler.handle({
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

      // apply the decorator to a class method
      Reflect.defineMetadata(OLOG_KEY, options, target, propertyKey);
      const originalMethod = descriptor.value;
      descriptor.value = (...args: any[]) => {
        const start = Date.now();
        const metadata: {
          args?: any[];
          returns?: any;
          executionTime?: string;
        } = {};

        if (args.length) {
          metadata.args = args;
        }

        const result = originalMethod.apply(this, args);
        if (result) {
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

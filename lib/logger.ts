import { LOG_LEVEL } from './enums/log-level.enum';
import * as clic from 'cli-color';
import 'reflect-metadata';
import { getTimeStamp } from './utils/timestamps';

export const OLOG_KEY = Symbol('olog');

export interface LoggerOptions {
  timeStamps?: boolean;
  logLevelThreshold?: LOG_LEVEL;
}

export interface DecoratorOptions {
  executionTime?: boolean;
}

export interface LogOptions { }

interface InternalLogOptions extends LogOptions {
  functionName?: string;
}

export class Logger {
  constructor(private options?: LoggerOptions) {
    this.options = options || {
      logLevelThreshold: LOG_LEVEL.DEBUG
    };
  }

  private LOG_LEVEL_COLORS = {
    [LOG_LEVEL.DEBUG]: clic.blue,
    [LOG_LEVEL.INFO]: clic.green,
    [LOG_LEVEL.WARN]: clic.yellow,
    [LOG_LEVEL.ERROR]: clic.red,
    [LOG_LEVEL.FATAL]: clic.white
  };

  private log(level: LOG_LEVEL, message: string, logOptions?: InternalLogOptions) {
    if (level < this.options.logLevelThreshold) {
      return;
    }

    let prefix: string = '';
    prefix += this.options.timeStamps ? `[${getTimeStamp()}] ` : '';
    prefix += `${this.LOG_LEVEL_COLORS[level](level)}`;
    prefix += logOptions?.functionName ? ` [${logOptions.functionName}]` : '';
    console.log(`${prefix} ${message}`);
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
        if (args.length) {
          this.log(level, `Arguments: ${args}`, {
            functionName: propertyKey
          });
        }
        const result = originalMethod.apply(this, args);
        if (result) {
          this.log(level, `Return value: ${JSON.stringify(result)}`, {
            functionName: propertyKey
          });
        }
        if (executionTime) {
          const end = Date.now();
          this.log(level, `Execution time: ${end - start}ms`, {
            functionName: propertyKey
          });
        }
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

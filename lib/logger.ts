import { LOG_LEVEL } from "./enums/log-level.enum";
import * as clic from 'cli-color';
import 'reflect-metadata';

export const OLOG_KEY = Symbol('olog');

export interface LoggerOptions {
    logLevelThreshold?: LOG_LEVEL;
}

export interface DecoratorOptions {
    logLevel: LOG_LEVEL
    executionTime?: boolean;
}

export interface LogOptions {
    functionName?: string;
}

export class Logger {
    constructor(private options?: LoggerOptions) {
        this.options = options || {
            logLevelThreshold: LOG_LEVEL.DEBUG
        }
    }

    private LOG_LEVEL_COLORS = {
        [LOG_LEVEL.DEBUG]: clic.blue,
        [LOG_LEVEL.INFO]: clic.green,
        [LOG_LEVEL.WARN]: clic.yellow,
        [LOG_LEVEL.ERROR]: clic.red,
        [LOG_LEVEL.FATAL]: clic.white
    }

    log(level: LOG_LEVEL, message: string, options?: LogOptions) {
        if (level < this.options.logLevelThreshold) {
            return;
        }

        let prefix = `${this.LOG_LEVEL_COLORS[level](level)}`
        prefix += options.functionName ? ` [${options.functionName}]` : '';
        console.log(`${prefix}: ${message}`);
    }

    decorate(options: DecoratorOptions) {
        const { logLevel, executionTime } = options;
        return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
            if (!descriptor) {
                console.log("descriptor is null, not a function?");
                return;
            }
            // apply the decorator to a class method
            Reflect.defineMetadata(OLOG_KEY, options, target, propertyKey);
            const originalMethod = descriptor.value;
            descriptor.value = (...args: any[]) => {
                const start = Date.now();
                this.log(logLevel, `Incoming args: ${args}`, { functionName: propertyKey });
                const result = originalMethod.apply(this, args);
                this.log(logLevel, `Returned: ${result}`, { functionName: propertyKey });
                if (executionTime) {
                    const end = Date.now();
                    this.log(logLevel, `Execution time: ${end - start}ms`, { functionName: propertyKey });
                }
                return result;
            }
        }
    };
}
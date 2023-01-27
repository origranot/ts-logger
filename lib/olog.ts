import { LOG_LEVEL } from "./enums/log-level.enum";
import * as clic from 'cli-color';
import 'reflect-metadata';
import { DecoratorOptions, LogOptions } from "./interfaces";

export const OLOG_KEY = Symbol('olog');

export class Olog {
    private LOG_LEVEL_COLORS = {
        [LOG_LEVEL.DEBUG]: 'blue',
        [LOG_LEVEL.INFO]: 'green',
        [LOG_LEVEL.WARN]: 'orange',
        [LOG_LEVEL.ERROR]: 'red',
        [LOG_LEVEL.FATAL]: 'white'
    }

    log(level: LOG_LEVEL, message: string, options?: LogOptions) {
        const colorName = this.LOG_LEVEL_COLORS[level];

        let prefix = `${clic[colorName](level)}`;
        if (options.functionName) {
            prefix += ` [${options.functionName}]`;
        }
        console.log(`${prefix}: ${message}`);
    }

    decorate(options: DecoratorOptions) {
        const { level } = options;
        return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
            if (!descriptor) {
                console.log("descriptor is null, not a function?");
                return;
            }
            // apply the decorator to a class method
            Reflect.defineMetadata(OLOG_KEY, options, target, propertyKey);
            const originalMethod = descriptor.value;
            descriptor.value = (...args: any[]) => {
                this.log(level, `Incoming args: ${args}`, { functionName: propertyKey });
                const result = originalMethod.apply(this, args);
                this.log(level, `Returned: ${result}`, { functionName: propertyKey });
                return result;
            }
        }
    };
}
import "reflect-metadata";

const LOG_KEY = Symbol("olog");

export function olog(options: any = {}) {
    return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
        if (descriptor) {
            // apply the decorator to a class method
            Reflect.defineMetadata(LOG_KEY, options, target, propertyKey);
            const originalMethod = descriptor.value;
            descriptor.value = function (...args: any[]) {
                const log = Reflect.getMetadata(LOG_KEY, target, propertyKey);
                console.log(log)
                console.log(`Calling ${propertyKey} with args: ${args}`);
                const result = originalMethod.apply(this, args);
                console.log(`${propertyKey} returned: ${result}`);
                return result;
            }
        } else {
            // apply the decorator to a function
            const originalFunction = target;
            target = function (this: any, ...args: any[]) {
                console.log(`Calling ${propertyKey} with args: ${args}`);
                const result = originalFunction.apply(this, args);
                console.log(`${propertyKey} returned: ${result}`);
                return result;
            }
            Object.defineProperty(target, "name", { value: propertyKey });
            return target;
        }
    }
}
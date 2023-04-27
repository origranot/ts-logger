import { Formatter, FormatterPayload } from '../interfaces';
import { getTimeStamp, isError, stringify } from '../utils';

export class JsonFormatter implements Formatter {
  format({ level, args, options }: FormatterPayload): string {
    const logData = {
      level,
      ...this.parse(args),
      ...(options?.name && { name: options?.name }),
      ...(options?.timestamp && { timestamp: getTimeStamp(options?.timestamp) }),
    };

    return stringify(logData);
  }

  parse(args: unknown[]): object {
    return args.reduce((acc: object, arg: unknown, index: number) => {
      let argString = arg;
      if (typeof arg === 'object') {
        const argObject = arg as Object;

        if (isError(arg)) {
          const error = arg as Error;
          argString = {
            name: error.name,
            message: error.message,
            stack: error.stack
          };
        } else if (Object.keys(argObject).length === 0) {
          // empty object
          return acc;
        }
      }
      return Object.assign(acc, { [index]: argString });
    }, {}) as object;
  }
}

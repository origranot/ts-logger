import { Formatter, FormatterPayload } from '../interfaces';
import { getTimeStamp, stringify } from '../utils';

export class JsonFormatter implements Formatter {
  format({ level, timestamp, args }: FormatterPayload): string {
    const logData = {
      level,
      ...this.parse(args),
      ...(timestamp && { timestamp: getTimeStamp(timestamp) })
    };

    return stringify(logData);
  }

  parse(args: unknown[]): object {
    return args.reduce((acc: object, arg: unknown, index: number) => {
      let argString = arg;
      if (typeof arg === 'object') {
        const argObject = arg as Object;

        // Check if the object is empty
        if (Object.keys(argObject).length === 0) {
          return acc;
        }
      }
      return Object.assign(acc, { [index]: argString });
    }, {}) as object;
  }
}

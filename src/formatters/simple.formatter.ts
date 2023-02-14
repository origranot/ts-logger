import { Formatter, FormatterPayload } from '../interfaces';
import { colorize, getTimeStamp, isError, LOG_LEVEL_COLORS, stringify } from '../utils';
import { formatError } from './utils/error-formatter';

export class SimpleFormatter implements Formatter {
  format({ level, args, timestamp }: FormatterPayload): string {
    let prefix: string = '';
    prefix += timestamp ? `[${getTimeStamp(timestamp)}] ` : '';
    prefix += `${colorize(LOG_LEVEL_COLORS[level], level)}`;

    const message = this.parse(args);

    return `${prefix}${message.length ? ' ' : ''}${message}`;
  }

  parse(args: unknown[]) {
    return args.reduce((acc: string, arg: unknown) => {
      let argString = arg;

      if (typeof arg === 'object') {
        const argObject = arg as Object;

        if (isError(arg)) {
          argString = formatError(arg as Error);
        } else if (Object.keys(argObject).length > 0) {
          // not an empty object
          argString = stringify(argObject, 2);
        } else {
          return acc;
        }
      }
      return (acc += acc.length ? `\n${argString}` : `${argString}`);
    }, '');
  }
}

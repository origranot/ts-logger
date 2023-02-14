import { Formatter, FormatterPayload } from '../interfaces';
import { colorize, getTimeStamp, LOG_LEVEL_COLORS, stringify } from '../utils';

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

        // Check if the object is empty
        if (Object.keys(argObject).length === 0) {
          return acc;
        }

        argString = stringify(argObject, 2);
      }
      return (acc += acc.length ? `\n${argString}` : `${argString}`);
    }, '');
  }
}

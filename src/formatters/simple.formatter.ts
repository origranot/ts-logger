import { Formatter, FormatterPayload } from '../interfaces';
import { colorize, getTimeStamp, LOG_LEVEL_COLORS, stringify } from '../utils';

export class SimpleFormatter implements Formatter {

  format({ level, message, metadata, timestamp }: FormatterPayload): string {
    let prefix: string = '';
    prefix += timestamp ? `[${getTimeStamp(timestamp)}] ` : '';
    prefix += `${colorize(LOG_LEVEL_COLORS[level], level)}`;

    let finalLog = `${prefix} ${message}`;
    if (metadata) {
      finalLog += `\n${stringify(metadata, 2)}`;
    }

    return finalLog;
  }
}

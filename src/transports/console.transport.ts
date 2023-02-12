import { COLOR, LOG_LEVEL } from '../enums';
import { Transport, TransportPayload } from './../transport';
import { colorize, getTimeStamp } from '../utils';

export class ConsoleTransport implements Transport {
  private LOG_LEVEL_COLORS = {
    [LOG_LEVEL.DEBUG]: COLOR.BLUE,
    [LOG_LEVEL.INFO]: COLOR.GREEN,
    [LOG_LEVEL.WARN]: COLOR.YELLOW,
    [LOG_LEVEL.ERROR]: COLOR.RED,
    [LOG_LEVEL.FATAL]: COLOR.WHITE
  };

  handle({ level, message, metadata, timestamp }: TransportPayload): void {
    let prefix: string = '';
    prefix += timestamp ? `[${getTimeStamp(timestamp)}] ` : '';
    prefix += `${colorize(this.LOG_LEVEL_COLORS[level], level)}`;

    const args: any[] = [`${prefix} ${message}`];
    if (metadata) {
      args.push(metadata);
    }
    console.log(...args);
  }
}

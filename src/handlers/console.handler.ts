import { LOG_LEVEL } from '../enums';
import { HandlerPayload, LogHandler } from '../log-handler';
import { getTimeStamp } from '../utils/timestamps';
import clic from 'cli-color';

export class ConsoleHandler extends LogHandler {
  private LOG_LEVEL_COLORS = {
    [LOG_LEVEL.DEBUG]: clic.blue,
    [LOG_LEVEL.INFO]: clic.green,
    [LOG_LEVEL.WARN]: clic.yellow,
    [LOG_LEVEL.ERROR]: clic.red,
    [LOG_LEVEL.FATAL]: clic.white
  };

  handle({ level, message, metadata, timestamp }: HandlerPayload): void {
    let prefix: string = '';
    prefix += timestamp ? `[${getTimeStamp(timestamp)}] ` : '';
    prefix += `${this.LOG_LEVEL_COLORS[level](level)}`;

    const args: any[] = [`${prefix} ${message}`];
    if (metadata) {
      args.push(metadata);
    }
    console.log(...args);
  }
}

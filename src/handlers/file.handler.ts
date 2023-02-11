import { HandlerPayload, LogHandler } from '../log-handler';
import { getTimeStamp, stringify } from '../utils';
import { writeFileSync } from 'fs';
import { join } from 'path';

type LOG_ROTATION = 'daily' | 'weekly' | 'monthly';

export interface FileHandlerOptions {
  path: string;
  logRotation?: LOG_ROTATION;
}

export class FileHandler implements LogHandler {
  constructor(options: FileHandlerOptions) {
    this.options = options;
  }

  private options: FileHandlerOptions;

  handle({ level, message, metadata, timestamp }: HandlerPayload): void {
    let filePath = this.options.path;

    if (this.options.logRotation) {
      const date = new Date();
      switch (this.options.logRotation) {
        case 'daily':
          filePath = join(
            filePath,
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`
          );
          break;
        case 'weekly':
          const weekNumber = Math.ceil(date.getDate() / 7);
          filePath = join(filePath, `${date.getFullYear()}-W${weekNumber}.log`);
          break;
        case 'monthly':
          filePath = join(filePath, `${date.getFullYear()}-${date.getMonth() + 1}.log`);
          break;
      }
    }

    let log = '';
    log += timestamp ? `[${getTimeStamp(timestamp)}] ` : '';
    log += `[${level}] ${message}`;
    log += metadata ? `\n${stringify(metadata, 2)}\n` : '';

    writeFileSync(filePath, log, { flag: 'a' });
  }
}

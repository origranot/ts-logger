import { Transport, TransportPayload } from '../interfaces/transport';
import { writeFileSync } from 'fs';
import { join } from 'path';

type LOG_ROTATION = 'daily' | 'weekly' | 'monthly';

export interface FileTransportOptions {
  path: string;
  logRotation?: LOG_ROTATION;
}

export class FileTransport implements Transport {
  constructor(options: FileTransportOptions) {
    this.options = options;
  }

  private options: FileTransportOptions;

  handle({ message }: TransportPayload): void {
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

    writeFileSync(filePath, `${message}\n`, { flag: 'a' });
  }
}

import { Transport, TransportOptions, TransportPayload } from './transport';
import { writeFileSync } from 'fs';
import { join } from 'path';

type LOG_ROTATION = 'daily' | 'weekly' | 'monthly';

export interface FileTransportOptions extends TransportOptions {
  path: string;
  logRotation?: LOG_ROTATION;
}

export class FileTransport extends Transport {
  constructor(private readonly fileOptions: FileTransportOptions) {
    super(fileOptions);
  }

  handle({ message }: TransportPayload): void {
    let filePath = this.fileOptions.path;

    if (this.fileOptions.logRotation) {
      const date = new Date();
      switch (this.fileOptions.logRotation) {
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

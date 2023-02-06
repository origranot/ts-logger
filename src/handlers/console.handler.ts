import { HandlerPayload, LogHandler } from '../log-handler';

export class ConsoleHandler extends LogHandler {
  handle({ message, metadata }: HandlerPayload): void {
    const args: any[] = [message];
    if (metadata) {
      args.push(metadata);
    }
    console.log(...args);
  }
}

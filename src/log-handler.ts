import { LOG_LEVEL } from './enums';

export interface HandlerPayload {
  level: LOG_LEVEL;
  message: string;
  metadata?: {
    [key: string]: any;
  };
  timestamp?: Date;
}

export abstract class LogHandler {
  abstract handle(payload: HandlerPayload): void;
}

import { LOG_LEVEL } from './enums';

export interface TransportPayload {
  level: LOG_LEVEL;
  message: string;
  metadata?: {
    [key: string]: any;
  };
  timestamp?: Date;
}

export interface Transport {
  handle(payload: TransportPayload): void;
}

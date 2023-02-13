import { LOG_LEVEL } from '../enums';

export interface FormatterPayload {
  level: LOG_LEVEL;
  message: string;
  metadata?: {
    [key: string]: any;
  };
  timestamp?: Date;
}

export interface Formatter {
  format(payload: FormatterPayload): string;
}

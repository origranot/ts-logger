import { LOG_LEVEL } from '../enums';

export interface FormatterPayload {
  level: LOG_LEVEL;
  args: any[];
  options?: {
    name?: string;
    timestamp?: Date;
  };
}

export interface Formatter {
  format(payload: FormatterPayload): string;
}

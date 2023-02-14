import { LOG_LEVEL } from '../enums';

export interface FormatterPayload {
  level: LOG_LEVEL;
  args: unknown[];
  timestamp?: Date;
}

export interface Formatter {
  format(payload: FormatterPayload): string;
  parse(args: unknown[]): string | object;
}

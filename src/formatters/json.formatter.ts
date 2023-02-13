import { Formatter, FormatterPayload } from '../interfaces';
import { getTimeStamp, stringify } from '../utils';

export class JsonFormatter implements Formatter {
  format(payload: FormatterPayload): string {
    const { timestamp } = payload;
    const logData = {
      ...payload,
      ...(timestamp && { timestamp: getTimeStamp(timestamp) })
    };

    return stringify(logData);
  }
}

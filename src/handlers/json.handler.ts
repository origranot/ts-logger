import { HandlerPayload, LogHandler } from '../log-handler';
import { getTimeStamp, stringify } from '../utils';

export class JsonHandler extends LogHandler {
  handle(payload: HandlerPayload): void {
    const { timestamp } = payload;
    const logData = {
      ...payload,
      ...(timestamp && { timestamp: getTimeStamp(timestamp) })
    };
    console.log(stringify(logData));
  }
}

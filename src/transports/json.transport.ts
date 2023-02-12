import { Transport, TransportPayload } from './../transport';
import { getTimeStamp, stringify } from '../utils';

export class JsonTransport implements Transport {
  handle(payload: TransportPayload): void {
    const { timestamp } = payload;
    const logData = {
      ...payload,
      ...(timestamp && { timestamp: getTimeStamp(timestamp) })
    };
    console.log(stringify(logData));
  }
}

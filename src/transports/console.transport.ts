import { Transport, TransportPayload } from '../interfaces/transport';

export class ConsoleTransport implements Transport {
  handle({ message }: TransportPayload): void {
    console.log(message);
  }
}

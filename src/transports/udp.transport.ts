import { Transport, TransportPayload } from '../interfaces/transport';
import { createSocket, Socket } from 'dgram';

export type SocketType = 'udp4' | 'udp6';

export interface UdpTransportOptions {
  host: string;
  port: number;
  socketType?: SocketType;
}

export class UdpTransport implements Transport {
  constructor(private options: UdpTransportOptions) {
    this.socket = createSocket(options.socketType || 'udp4');
    this.socket.unref();
  }

  private socket: Socket;

  handle({ message }: TransportPayload): void {
    this.socket.send(message, this.options.port, this.options.host);
  }
}

import { Transport, TransportOptions, TransportPayload } from './transport';
import { createSocket, Socket } from 'dgram';

export type SocketType = 'udp4' | 'udp6';

export interface UdpTransportOptions extends TransportOptions {
  host: string;
  port: number;
  socketType?: SocketType;
}

export class UdpTransport extends Transport {
  constructor(private readonly udpOptions: UdpTransportOptions) {
    super(udpOptions);

    this.socket = createSocket(udpOptions.socketType || 'udp4');
    this.socket.unref();
  }

  private socket: Socket;

  handle({ message }: TransportPayload): void {
    this.socket.send(message, this.udpOptions.port, this.udpOptions.host);
  }
}

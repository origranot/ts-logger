import { Transport, TransportPayload } from './../transport';
import { createSocket, Socket } from 'dgram';
import { stringify } from '../utils';

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

    handle({ level, message, metadata, timestamp }: TransportPayload): void {
        this.socket.send(stringify({ level, message, metadata, timestamp }), this.options.port, this.options.host);
    }
}

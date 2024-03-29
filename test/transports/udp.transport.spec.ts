import { TransportPayload, UdpTransport, UdpTransportOptions } from '../../src';
import * as dgram from 'dgram';

jest.mock('dgram', () => ({
  createSocket: jest.fn(() => ({
    send: jest.fn(),
    unref: jest.fn()
  }))
}));

describe('UdpTransport', () => {
  let transport: UdpTransport;
  let spy: jest.SpyInstance;
  const options: UdpTransportOptions = {
    host: 'localhost',
    port: 1234
  };

  beforeEach(() => {
    transport = new UdpTransport(options);
    spy = jest.spyOn(dgram, 'createSocket');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a socket with the correct type', () => {
    expect(spy).toHaveBeenCalledWith(options.socketType || 'udp4');
  });

  it('should use the unref method of the socket', () => {
    const spy = jest.spyOn(transport['socket'], 'unref');
    transport = new UdpTransport(options);
    expect(spy).toHaveBeenCalled();
  });

  it('should send log data with the correct format', () => {
    const payload: TransportPayload = {
      message: 'message'
    };

    spy = jest.spyOn(transport['socket'], 'send');
    transport.handle(payload);
    expect(spy).toHaveBeenCalledWith(payload.message, options.port, options.host);
  });
});

import { Transport } from './../../src/transport';
import { JsonTransport, LOG_LEVEL } from '../../src';

describe('JsonTransport', () => {
  let transport: Transport;

  beforeEach(() => {
    transport = new JsonTransport();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should log the message in json format to the console', () => {
      const spy = jest.spyOn(console, 'log');
      transport.handle({
        level: LOG_LEVEL.DEBUG,
        message: 'This is a debug message',
        timestamp: new Date()
      });
      expect(spy).toHaveBeenCalled();
      expect(() => JSON.parse(spy.mock.calls[0][0])).not.toThrow();
    });

    it('should log the message with metadata in json format to the console', () => {
      const spy = jest.spyOn(console, 'log');
      const inputMetadata = { foo: 'bar' };

      transport.handle({
        level: LOG_LEVEL.INFO,
        message: 'This is an info message',
        metadata: inputMetadata,
        timestamp: new Date()
      });

      const loggedJson = JSON.parse(spy.mock.calls[0][0]);
      const metadata = loggedJson.metadata;

      expect(spy).toHaveBeenCalled();
      expect(metadata).toEqual(inputMetadata);
    });

    it('should log the message without metadata and timestamp in json format to the console', () => {
      const spy = jest.spyOn(console, 'log');

      transport.handle({
        level: LOG_LEVEL.INFO,
        message: 'This is an info message'
      });

      const loggedJson = JSON.parse(spy.mock.calls[0][0]);
      const metadata = loggedJson.metadata;
      const timestamp = loggedJson.timestamp;

      expect(spy).toHaveBeenCalled();
      expect(metadata).toEqual(undefined);
      expect(timestamp).toEqual(undefined);
    });

    it('should log the message even if the metadata has circular json', () => {
      const spy = jest.spyOn(console, 'log');

      const inputMetadata = { circular: {} };
      inputMetadata.circular = inputMetadata;

      transport.handle({
        level: LOG_LEVEL.INFO,
        message: 'This is an info message',
        metadata: inputMetadata
      });

      const loggedJson = JSON.parse(spy.mock.calls[0][0]);
      const metadata = loggedJson.metadata;

      expect(spy).toHaveBeenCalled();
      expect(metadata).toEqual({ circular: '[Circular]' });
    });
  });
});

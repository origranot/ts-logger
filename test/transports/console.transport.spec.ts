import { LOG_LEVEL, Transport, ConsoleTransport } from '../../src';

describe('Console Transport', () => {
  let transport: Transport;

  beforeEach(() => {
    transport = new ConsoleTransport();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should log the message to the console', () => {
      const spy = jest.spyOn(console, 'log');
      transport.handle({
        level: LOG_LEVEL.DEBUG,
        message: 'This is a debug message',
        timestamp: new Date()
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should console log the the metadata as second argument', () => {
      const spy = jest.spyOn(console, 'log');
      const inputMetadata = { foo: 'bar' };

      transport.handle({
        level: LOG_LEVEL.INFO,
        message: 'This is an info message',
        metadata: inputMetadata,
        timestamp: new Date()
      });

      const metadata = spy.mock.calls[0][1];

      expect(spy).toHaveBeenCalled();
      expect(metadata).toEqual(inputMetadata);
    });

    it('should not console log the the metadata as second argument', () => {
      const spy = jest.spyOn(console, 'log');

      transport.handle({
        level: LOG_LEVEL.INFO,
        message: 'This is an info message',
        timestamp: new Date()
      });

      const metadata = spy.mock.calls[0][1];

      expect(spy).toHaveBeenCalled();
      expect(metadata).toEqual(undefined);
    });
  });
});

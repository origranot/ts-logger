import { ConsoleHandler, LogHandler, LOG_LEVEL } from '../../src';

describe('Console Handler', () => {
  let handler: LogHandler;

  beforeEach(() => {
    handler = new ConsoleHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should log the message to the console', () => {
      const spy = jest.spyOn(console, 'log');
      handler.handle({
        level: LOG_LEVEL.DEBUG,
        message: 'This is a debug message',
        timestamp: new Date()
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should console log the the metadata as second argument', () => {
      const spy = jest.spyOn(console, 'log');
      const inputMetadata = { foo: 'bar' };

      handler.handle({
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

      handler.handle({
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

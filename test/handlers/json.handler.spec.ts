import { JsonHandler, LOG_LEVEL } from '../../src';

describe('Json Handler', () => {
  let handler: JsonHandler;

  beforeEach(() => {
    handler = new JsonHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should log the message in json format to the console', () => {
      const spy = jest.spyOn(console, 'log');
      handler.handle({
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

      handler.handle({
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

    it('should log the message without metadata in json format to the console', () => {
      const spy = jest.spyOn(console, 'log');

      handler.handle({
        level: LOG_LEVEL.INFO,
        message: 'This is an info message',
        timestamp: new Date()
      });

      const loggedJson = JSON.parse(spy.mock.calls[0][0]);
      const metadata = loggedJson.metadata;

      expect(spy).toHaveBeenCalled();
      expect(metadata).toEqual(undefined);
    });

    it('should log the message without metadata and timestamp in json format to the console', () => {
        const spy = jest.spyOn(console, 'log');
  
        handler.handle({
          level: LOG_LEVEL.INFO,
          message: 'This is an info message',
        });
  
        const loggedJson = JSON.parse(spy.mock.calls[0][0]);
        const metadata = loggedJson.metadata;
  
        expect(spy).toHaveBeenCalled();
        expect(metadata).toEqual(undefined);
      });
  });
});

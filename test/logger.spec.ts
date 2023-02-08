import { ConsoleHandler, Logger, LOG_LEVEL } from '../src';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a logger with default options', () => {
    expect(logger).toBeDefined();
  });

  it('should create a logger with the provided options', () => {
    const threshold = LOG_LEVEL.INFO;
    logger = new Logger({ threshold: threshold });
    expect(logger).toBeDefined();
    expect(logger['options'].threshold).toBe(threshold);
  });

  it('should create a logger with default values', () => {
    logger = new Logger();
    expect(logger).toBeDefined();

    // Default log level threshold should be DEBUG
    expect(logger['options'].threshold).toBe(LOG_LEVEL.DEBUG);

    // Default handlers array should be an array with a ConsoleHandler instance in it
    expect(logger['options'].handlers).toHaveLength(1);
    expect(logger['options'].handlers![0]).toBeInstanceOf(ConsoleHandler);
  });

  describe('log', () => {
    it('should log the message with the correct log level', () => {
      const spy = jest.spyOn(console, 'log');

      logger.debug('This is a debug message');
      const output = stripAnsi(spy.mock.calls[0][0]);
      expect(output).toBe('DEBUG This is a debug message');
    });

    it('should log the message with the correct log level even if options is not provided', () => {
      const spy = jest.spyOn(console, 'log');

      logger.error('This is an error message', {});
      const output = stripAnsi(spy.mock.calls[0][0]);
      expect(output).toBe(`ERROR This is an error message`);
    });

    describe('logLevelThreshold', () => {
      it('should not log the message if the log level is below the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({ threshold: LOG_LEVEL.INFO });
        logger.debug('This is a debug message');
        expect(spy).not.toHaveBeenCalled();
      });

      it('should log the message if the log level is above the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({ threshold: LOG_LEVEL.DEBUG });
        logger.info('This is a info message');
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('timeStamps', () => {
      it('should include the timestamp in the log message when timeStamps option is true', () => {
        const spy = jest.spyOn(console, 'log');

        logger = new Logger({ timeStamps: true });
        logger.debug('This is a debug message');

        const output = stripAnsi(spy.mock.calls[0][0]);
        const timestampRegex = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/;
        expect(output).toMatch(timestampRegex);
      });
    });
  });

  describe('decorate', () => {
    it('should log the function call and log empty args', () => {
      class TestClass {
        @logger.decorate(LOG_LEVEL.INFO)
        testFunction(): number {
          return 5;
        }
      }

      const spy = jest.spyOn(console, 'log');
      const test = new TestClass();
      test.testFunction();

      const messageOutput = stripAnsi(spy.mock.calls[0][0]);
      const metadataOutput = spy.mock.calls[0][1];

      expect(messageOutput).toBe(`INFO [testFunction]`);
      expect(metadataOutput.args).toEqual([]);
      expect(metadataOutput.returns).toEqual(5);
    });

    it('should log the function call and return value', () => {
      class TestClass {
        @logger.decorate(LOG_LEVEL.DEBUG)
        testFunction(a: number, b: number): number {
          return a + b;
        }
      }

      const spy = jest.spyOn(console, 'log');
      const test = new TestClass();
      test.testFunction(1, 2);

      const messageOutput = stripAnsi(spy.mock.calls[0][0]);
      const metadataOutput = spy.mock.calls[0][1];

      expect(messageOutput).toBe(`DEBUG [testFunction]`);
      expect(metadataOutput.args).toEqual([1, 2]);
      expect(metadataOutput.returns).toEqual(3);
    });

    it('should log the function call and return value and execution time', () => {
      class TestClass {
        @logger.decorate(LOG_LEVEL.DEBUG, { executionTime: true })
        testFunction(a: number, b: number): number {
          return a + b;
        }
      }

      const spy = jest.spyOn(console, 'log');
      const test = new TestClass();
      test.testFunction(1, 2);

      const messageOutput = stripAnsi(spy.mock.calls[0][0]);
      const metadataOutput = spy.mock.calls[0][1];

      expect(messageOutput).toBe(`DEBUG [testFunction]`);
      expect(metadataOutput.args).toEqual([1, 2]);
      expect(metadataOutput.returns).toEqual(3);
      expect(metadataOutput.executionTime).toBeDefined()
    });
  });
});

const stripAnsi = (str: string) =>
  str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );

import { Logger, LOG_LEVEL } from '../src/index';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    it('should log the message with the metadata object', () => {
      const spy = jest.spyOn(console, 'log');
      const inputMetadata = { foo: 'bar' };

      logger.info('This is a info log with metadata object', {
        metadata: inputMetadata
      });

      const message = stripAnsi(spy.mock.calls[0][0]);
      const metadata = spy.mock.calls[0][1];

      expect(message).toBe(`INFO This is a info log with metadata object`);
      expect(metadata).toEqual(inputMetadata);
    });

    describe('logLevelThreshold', () => {
      it('should not log the message if the log level is below the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({ logLevelThreshold: LOG_LEVEL.INFO });
        logger.debug('This is a debug message');
        expect(spy).not.toHaveBeenCalled();
      });

      it('should log the message if the log level is above the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({ logLevelThreshold: LOG_LEVEL.DEBUG });
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

      const incomingOutput = stripAnsi(spy.mock.calls[0][0]);
      const returnedOutput = stripAnsi(spy.mock.calls[1][0]);

      expect(incomingOutput).toBe(`DEBUG [testFunction] Arguments: 1,2`);
      expect(returnedOutput).toBe(`DEBUG [testFunction] Return value: 3`);
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

      const incomingOutput = stripAnsi(spy.mock.calls[0][0]);
      const returnedOutput = stripAnsi(spy.mock.calls[1][0]);
      const executionTimeOutput = stripAnsi(spy.mock.calls[2][0]);

      expect(incomingOutput).toBe(`DEBUG [testFunction] Arguments: 1,2`);
      expect(returnedOutput).toBe(`DEBUG [testFunction] Return value: 3`);
      expect(executionTimeOutput).toContain(`DEBUG [testFunction] Execution time`);
    });
  });
});

const stripAnsi = (str: string) =>
  str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );

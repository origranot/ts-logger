import { Logger } from "../lib";
import { LOG_LEVEL } from "../lib/enums/log-level.enum";

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log the message with the correct level color', () => {
      const spy = jest.spyOn(console, 'log');

      logger.log(LOG_LEVEL.DEBUG, 'This is a debug message', { functionName: 'exampleFunction' });
      const output = stripAnsi(spy.mock.calls[0][0])
      expect(output).toBe('DEBUG [exampleFunction]: This is a debug message');  
    });

    it('should log the message with the correct level color even if function name is not provided', () => {
      const spy = jest.spyOn(console, 'log');

      logger.log(LOG_LEVEL.ERROR, 'This is a error message', {});
      const output = stripAnsi(spy.mock.calls[0][0])
      expect(output).toBe(`ERROR: This is a error message`);
    });

    describe('logLevelThreshold', () => {
      it('should not log the message if the log level is below the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({ logLevelThreshold: LOG_LEVEL.INFO });
        logger.log(LOG_LEVEL.DEBUG, 'This is a debug message', { functionName: 'exampleFunction' });
        expect(spy).not.toHaveBeenCalled();
      });

      it('should log the message if the log level is above the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({ logLevelThreshold: LOG_LEVEL.DEBUG });
        logger.log(LOG_LEVEL.INFO, 'This is a info message', { functionName: 'exampleFunction' });
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('decorate', () => {
    it('should log the function call and return value', () => {
      class TestClass {
        @logger.decorate({ logLevel: LOG_LEVEL.DEBUG })
        testFunction(a: number, b: number): number {
          return a + b;
        }
      }

      const spy = jest.spyOn(console, 'log');
      const test = new TestClass();
      test.testFunction(1, 2);

      const incomingOutput = stripAnsi(spy.mock.calls[0][0])
      const returnedOutput = stripAnsi(spy.mock.calls[1][0])

      expect(incomingOutput).toBe(`DEBUG [testFunction]: Incoming args: 1,2`);
      expect(returnedOutput).toBe(`DEBUG [testFunction]: Returned: 3`);
    });

    it('should log the function call and return value and execution time', () => {
      class TestClass {
        @logger.decorate({ logLevel: LOG_LEVEL.DEBUG, executionTime: true })
        testFunction(a: number, b: number): number {
          return a + b;
        }
      }

      const spy = jest.spyOn(console, 'log');
      const test = new TestClass();
      test.testFunction(1, 2);

      const incomingOutput = stripAnsi(spy.mock.calls[0][0])
      const returnedOutput = stripAnsi(spy.mock.calls[1][0])
      const executionTimeOutput = stripAnsi(spy.mock.calls[2][0])


      expect(incomingOutput).toBe(`DEBUG [testFunction]: Incoming args: 1,2`);
      expect(returnedOutput).toBe(`DEBUG [testFunction]: Returned: 3`);
      expect(executionTimeOutput).toContain(`DEBUG [testFunction]: Execution time`);
    });
  });
});

const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
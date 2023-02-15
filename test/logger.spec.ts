import { ConsoleTransport } from './../src/transports/console.transport';
import { FileTransport, JsonFormatter, Logger, LOG_LEVEL, SimpleFormatter, UdpTransport } from '../src';
import { stringify } from '../src/utils';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger({ timeStamps: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a logger with default options', () => {
    expect(logger).toBeDefined();
  });

  it('should create a logger with the provided options', () => {
    logger = new Logger({ timeStamps: false });
    expect(logger).toBeDefined();
    expect(logger['options'].timeStamps).toBe(false);
  });

  it('should create a logger with default values', () => {
    logger = new Logger();
    expect(logger).toBeDefined();

    // Default transports array should be an array with a ConsoleTransport instance in it
    expect(logger['options'].transports).toHaveLength(1);
    expect(logger['options'].transports![0]).toBeInstanceOf(ConsoleTransport);
  });

  it('should create a logger with array of transports', () => {
    logger = new Logger({
      transports: [new FileTransport({ path: 'somePath' }), new ConsoleTransport()]
    });

    expect(logger).toBeDefined();

    expect(logger['options'].transports).toHaveLength(2);
    expect(logger['options'].transports![0]).toBeInstanceOf(FileTransport);
    expect(logger['options'].transports![1]).toBeInstanceOf(ConsoleTransport);
  });

  it('should create a logger with multiple transports and formatters', () => {
    logger = new Logger({
      transports: [
        new ConsoleTransport(),
        new UdpTransport({
          host: 'localhost',
          port: 514,
          formatter: new JsonFormatter()
        })
      ]
    });

    expect(logger).toBeDefined();

    expect(logger['options'].transports).toHaveLength(2);
    expect(logger['options'].transports![0]).toBeInstanceOf(ConsoleTransport);
    expect(logger['options'].transports![0].options.formatter).toBeInstanceOf(SimpleFormatter);
    expect(logger['options'].transports![1]).toBeInstanceOf(UdpTransport);
    expect(logger['options'].transports![1].options.formatter).toBeInstanceOf(JsonFormatter);
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

    it('should log the messages with multiple args provided', () => {
      const spy = jest.spyOn(console, 'log');

      const args = ['This is an error message', 'first arg', 'second arg'];

      logger.error(...args);
      const output = stripAnsi(spy.mock.calls[0][0]);
      expect(output).toBe(`ERROR ${args[0]}\n${args[1]}\n${args[2]}`);
    });

    it('should log the messages with multiple args provided mixed with an object', () => {
      const spy = jest.spyOn(console, 'log');

      const args = [
        'This is an error message',
        {
          foo: 'bar',
          nested: {
            foo: 'bar'
          }
        },
        'third arg'
      ];

      logger.debug(...args);
      const output = stripAnsi(spy.mock.calls[0][0]);
      expect(output).toBe(`DEBUG ${args[0]}\n${stringify(args[1], 2)}\n${args[2]}`);
    });

    describe('logLevelThreshold', () => {
      it('should not log the message if the log level is below the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({
          transports: [
            new ConsoleTransport({
              threshold: LOG_LEVEL.INFO
            })
          ]
        });
        logger.debug('This is a debug message');
        expect(spy).not.toHaveBeenCalled();
      });

      it('should log the message if the log level is above the threshold', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger();
        logger.info('This is a info message');
        expect(spy).toHaveBeenCalled();
      });

      it('should log the message only to the transports where their threshold is above', () => {
        const spy = jest.spyOn(console, 'log');
        logger = new Logger({
          transports: [
            new ConsoleTransport({
              threshold: LOG_LEVEL.DEBUG
            }),
            new ConsoleTransport({
              threshold: LOG_LEVEL.WARN
            }),
          ]
        });
        logger.info('This is a debug message');
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
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

      const output = stripAnsi(spy.mock.calls[0][0]);
      const metadataOutput = JSON.parse(output.substring(output.indexOf('\n')));

      expect(output).toContain(`INFO [testFunction]`);
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

      const output = stripAnsi(spy.mock.calls[0][0]);
      const metadataOutput = JSON.parse(output.substring(output.indexOf('\n')));

      expect(output).toContain(`DEBUG [testFunction]`);
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

      const output = stripAnsi(spy.mock.calls[0][0]);
      const metadataOutput = JSON.parse(output.substring(output.indexOf('\n')));

      expect(output).toContain(`DEBUG [testFunction]`);
      expect(metadataOutput.args).toEqual([1, 2]);
      expect(metadataOutput.returns).toEqual(3);
      expect(metadataOutput.executionTime).toBeDefined();
    });
  });
});

const stripAnsi = (str: string) =>
  str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

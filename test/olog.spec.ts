import { LOG_LEVEL } from "../lib/enums/log-level.enum";
import { Olog } from "../lib/olog";

describe('Olog', () => {
  let olog: Olog;

  beforeEach(() => {
    olog = new Olog();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log the message with the correct level color', () => {
      const spy = jest.spyOn(console, 'log');

      olog.log(LOG_LEVEL.DEBUG, 'This is a debug message', { functionName: 'exampleFunction' });
      const output = stripAnsi(spy.mock.calls[0][0])
      expect(output).toBe('DEBUG [exampleFunction]: This is a debug message');  
    });

    it('should log the message with the correct level color even if function name is not provided', () => {
      const spy = jest.spyOn(console, 'log');

      olog.log(LOG_LEVEL.ERROR, 'This is a error message', {});
      const output = stripAnsi(spy.mock.calls[0][0])
      expect(output).toBe(`ERROR: This is a error message`);
    });
  });

  describe('decorate', () => {
    it('should log the function call and return value', () => {
      class TestClass {
        @olog.decorate({ level: LOG_LEVEL.DEBUG })
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
  });
});

const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
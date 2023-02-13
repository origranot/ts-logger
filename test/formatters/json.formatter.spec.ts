import { FormatterPayload, JsonFormatter, LOG_LEVEL } from "../../src";
import { getTimeStamp, stringify } from "../../src/utils";

describe('JsonFormatter', () => {
  let formatter: JsonFormatter;

  beforeEach(() => {
    formatter = new JsonFormatter();
  });
  

  it('should format the log payload as a JSON string', () => {
    const payload: FormatterPayload = {
      level: LOG_LEVEL.DEBUG,
      message: 'This is a test log',
      metadata: {
        extraData: 'test data'
      },
      timestamp: new Date()
    };

    const expectedOutput = stringify({
      ...payload,
      ...{ timestamp: getTimeStamp(payload.timestamp!) }
    });

    const output = formatter.format(payload);

    expect(output).toEqual(expectedOutput);
  });

  it('should not include the timestamp if it is not present in the payload', () => {
    const payload: FormatterPayload = {
      level: LOG_LEVEL.DEBUG,
      message: 'This is another test log',
      metadata: {
        additionalData: 123
      }
    };

    const expectedOutput = stringify(payload);

    const output = formatter.format(payload);

    expect(output).toEqual(expectedOutput);
  });
});
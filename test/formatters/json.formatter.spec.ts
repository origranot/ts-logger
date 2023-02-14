import { FormatterPayload, JsonFormatter, LOG_LEVEL } from '../../src';
import { getTimeStamp, stringify } from '../../src/utils';

describe('JsonFormatter', () => {
  let formatter: JsonFormatter;

  beforeEach(() => {
    formatter = new JsonFormatter();
  });

  it('should format the log payload as a JSON string', () => {
    const payload: FormatterPayload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is a test log', { extraData: 'test data' }],
      timestamp: new Date()
    };

    const expectedOutput = stringify({
      level: payload.level,
      0: payload.args[0],
      1: payload.args[1],
      ...{ timestamp: getTimeStamp(payload.timestamp!) }
    });

    const output = formatter.format(payload);

    expect(output).toEqual(expectedOutput);
  });

  it('should not include the timestamp if it is not present in the payload', () => {
    const payload: FormatterPayload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is another test log', { additionalData: 123 }]
    };

    const expectedOutput = stringify({
      level: payload.level,
      0: payload.args[0],
      1: payload.args[1],
    });
    const output = formatter.format(payload);

    expect(output).toEqual(expectedOutput);
  });

  it('should format more than one object provided', () => {
    const payload: FormatterPayload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is another test log', { additionalData: 123 }, { foo: 'bar' }]
    };

    const expectedOutput = stringify({
      level: payload.level,
      0: payload.args[0],
      1: payload.args[1],
      2: payload.args[2],
    });
    const output = formatter.format(payload);

    expect(output).toEqual(expectedOutput);
  });

  it('should format if there is no args provided', () => {
    const payload: FormatterPayload = {
      level: LOG_LEVEL.DEBUG,
      args: []
    };

    const expectedOutput = stringify({
      level: payload.level,
    });
    const output = formatter.format(payload);

    expect(output).toEqual(expectedOutput);
  });
});

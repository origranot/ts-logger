import { LOG_LEVEL, SimpleFormatter } from '../../src';
import { formatError } from '../../src/formatters/utils/error-formatter';
import { colorize, getTimeStamp, LOG_LEVEL_COLORS, stringify } from '../../src/utils';

describe('SimpleFormatter', () => {
  let formatter: SimpleFormatter;

  beforeEach(() => {
    formatter = new SimpleFormatter();
  });

  it('should format the log message in the correct format', () => {
    const payload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is a debug message'],
      timestamp: new Date()
    };

    const expectedMessage = `[${getTimeStamp(payload.timestamp)}] ${colorize(
      LOG_LEVEL_COLORS[LOG_LEVEL.DEBUG],
      LOG_LEVEL.DEBUG
    )} ${payload.args[0]}`;

    const result = formatter.format(payload);

    expect(result).toBe(expectedMessage);
  });

  it('should format the log message with objects', () => {
    const payload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is a debug message', { foo: 'bar' }],
      timestamp: new Date()
    };

    const expectedMessage = `[${getTimeStamp(payload.timestamp)}] ${colorize(
      LOG_LEVEL_COLORS[LOG_LEVEL.DEBUG],
      LOG_LEVEL.DEBUG
    )} ${payload.args[0]}\n${stringify(payload.args[1], 2)}`;

    const result = formatter.format(payload);

    expect(result).toBe(expectedMessage);
  });

  it('should format the log message without timestamp if timeStamps option is false', () => {
    formatter = new SimpleFormatter();
    const payload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is a debug message']
    };

    const expectedMessage = `${colorize(LOG_LEVEL_COLORS[LOG_LEVEL.DEBUG], LOG_LEVEL.DEBUG)} ${
      payload.args[0]
    }`;

    const result = formatter.format(payload);

    expect(result).toBe(expectedMessage);
  });

  it('should format the log message if there are no args provided', () => {
    const payload = {
      level: LOG_LEVEL.DEBUG,
      args: [],
      timestamp: new Date()
    };

    const expectedMessage = `[${getTimeStamp(payload.timestamp)}] ${colorize(
      LOG_LEVEL_COLORS[LOG_LEVEL.DEBUG],
      LOG_LEVEL.DEBUG
    )}`;

    const result = formatter.format(payload);

    expect(result).toBe(expectedMessage);
  });

  it('should format the log message if there is an error', () => {
    const payload = {
      level: LOG_LEVEL.DEBUG,
      args: ['This is a debug message', new Error('This is an error')],
      timestamp: new Date()
    };

    const expectedMessage = `[${getTimeStamp(payload.timestamp)}] ${colorize(
      LOG_LEVEL_COLORS[LOG_LEVEL.DEBUG],
      LOG_LEVEL.DEBUG
    )} ${payload.args[0]}\n${formatError(payload.args[1] as Error)}`;

    const result = formatter.format(payload);

    expect(result).toBe(expectedMessage);
  });
});

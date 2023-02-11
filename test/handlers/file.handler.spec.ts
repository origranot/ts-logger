import { FileHandler, HandlerPayload, LOG_LEVEL } from '../../src';
import { unlinkSync, readFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { getTimeStamp } from '../../src/utils';

describe('FileHandler', () => {
  const path = 'test/logs';
  const options = { path };
  let fileHandler = new FileHandler(options);

  afterEach(() => {
    // delete the log files created during each test
    if (existsSync(path)) {
      unlinkSync(path);
    }

    // reset all mocks
    jest.restoreAllMocks();
  });

  it('should write logs to file', () => {
    const payload: HandlerPayload = { level: LOG_LEVEL.INFO, message: 'hello world' };
    fileHandler.handle(payload);
    const log = readFileSync(path, 'utf-8');
    expect(log).toEqual('[INFO] hello world');
  });

  it('should add timestamp to logs if provided', () => {
    const timestamp = new Date();
    const payload: HandlerPayload = {
      level: LOG_LEVEL.INFO,
      message: 'hello world',
      timestamp
    };
    fileHandler.handle(payload);
    const log = readFileSync(path, 'utf-8');
    expect(log).toEqual(`[${getTimeStamp(timestamp)}] [INFO] hello world`);
  });

  it('should add metadata to logs if provided', () => {
    const metadata = { key: 'value' };
    const payload: HandlerPayload = {
      level: LOG_LEVEL.INFO,
      message: 'hello world',
      metadata
    };
    fileHandler.handle(payload);
    const log = readFileSync(path, 'utf-8');
    expect(log).toEqual('[INFO] hello world\n{\n  "key": "value"\n}\n');
  });

  it('should handle daily log rotation', () => {
    fileHandler = new FileHandler({ ...options, logRotation: 'daily' });

    const payload: HandlerPayload = {
      level: LOG_LEVEL.ERROR,
      message: 'error message',
      metadata: { key: 'value' },
      timestamp: new Date("Jan 23, 1999 Z")
    };

    const expectedFilePath = join(options.path, '1999-1-23.log');

    mkdirSync(options.path, { recursive: true });

    jest.useFakeTimers();
    jest.setSystemTime(new Date(1999, 0, 23));
    fileHandler.handle(payload);

    const log = readFileSync(expectedFilePath, 'utf8');
    expect(log).toEqual(
      '[1999-01-23 00:00:00] [ERROR] error message\n{\n  "key": "value"\n}\n'
    );

    rmSync(options.path, { recursive: true, force: true });
  });
});

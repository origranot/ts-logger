import { FileTransport, TransportPayload } from '../../src';
import { unlinkSync, readFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

describe('FileTransport', () => {
  const path = 'test/logs';
  const options = { path };
  let fileTransport = new FileTransport(options);

  afterEach(() => {
    // delete the log files created during each test
    if (existsSync(path)) {
      unlinkSync(path);
    }

    // reset all mocks
    jest.restoreAllMocks();
  });

  it('should write logs to file', () => {
    const payload: TransportPayload = { message: 'hello world' };
    fileTransport.handle(payload);
    const log = readFileSync(path, 'utf-8');
    expect(log).toEqual('hello world\n');
  });

  it('should handle daily log rotation', () => {
    fileTransport = new FileTransport({ ...options, logRotation: 'daily' });

    const payload: TransportPayload = {
      message: 'This is a test message'
    };

    const expectedFilePath = join(options.path, '1999-1-23.log');

    mkdirSync(options.path, { recursive: true });

    jest.useFakeTimers();
    jest.setSystemTime(new Date(1999, 0, 23));
    fileTransport.handle(payload);

    const log = readFileSync(expectedFilePath, 'utf8');
    expect(log).toEqual('This is a test message\n');

    rmSync(options.path, { recursive: true, force: true });
  });
});

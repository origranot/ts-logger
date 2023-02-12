# :zap: ts-logger

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/origranot/ts-logger/release.yml)
![npm bundle size](https://img.shields.io/bundlephobia/min/@origranot/ts-logger)
![GitHub](https://img.shields.io/github/license/origranot/ts-logger)

A logging library designed to simplify the process of logging in your TypeScript
applications. With zero dependencies and features such as five log levels, custom transports, method decoration options, timestamps, and log level thresholding, you'll have
greater control over your log output.

Our library also provides the flexibility to extend its functionality through custom
transports, enabling you to meet the specific needs of your project. Say goodbye to
cluttered and unorganized logs and get started with ts-logger today!💪

## Features :star:

- Supports logging at five different levels (:bug: DEBUG, :information_source: INFO,
  :warning: WARN, :exclamation: ERROR, :fire: FATAL).
- Zero dependencies 🚫
- Support for custom log transports to extend the functionality of the library. 💬
- Support multiple log transports out of the box. 📦 (Console, UDP, File, JSON)
- Ability to decorate class methods to log their arguments, return values, and execution
  time. 📊
- Option to include timestamps in logs. 🕰️
- Option to set log level threshold. 🎛️
- Option to log execution time of decorated functions. ⏱️
- Logs can be color-coded based on the log level. 🎨

## Installation

`npm install @origranot/ts-logger`

## Usage

### Basic logger

```typescript
import { Logger } from '@origranot/ts-logger';

const logger = new Logger();

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warn message');
logger.error('Error message');
logger.fatal('Fatal message');

logger.info('You can also pass variables', {
  metadata: {
    foo: 'baz'
  }
});
```

### Optional parameters

- timeStamps (Boolean): Whether to include timestamps in logs (default: true).
- threshold (LOG_LEVEL): The log level threshold, logs with a lower level than the
  threshold will be ignored (default: 'DEBUG').
- transports: Array of transports to process and log the data. (default: ConsoleTransport)

### Decorated functions example

```typescript
import { Logger, LOG_LEVEL } from '@origranot/ts-logger';

const logger = new Logger();

class ExampleClass {
  @logger.decorate(LOG_LEVEL.INFO, { executionTime: true })
  public exampleMethod(a: number, b: number): number {
    return a + b;
  }
}

const example = new ExampleClass();
example.exampleMethod(1, 2);

/* 
  Output: [2022-01-01 00:00:00] [exampleMethod] {
    args: [1, 2],
    returns: 3,
    executionTime: 3ms
  }
*/
```

### Optional parameters

- executionTime (Boolean): Whether to calculate and print the function execution time.
  (default: false)

### Log transports

This library provides a few built-in log transports that can be used out of the box:

- Console: This transport outputs log messages to the console.
- Udp: this transport sends log messages to a UDP server.
- File: This transport writes log messages to a file on disk.
- JSON: This transport outputs log messages in JSON format, which can be easily
  processed by other systems.

Here's an example of how to use the built-in log transports:

```typescript
import { Logger, ConsoleTransport, FileTransport, JsonTransport } from '@origranot/ts-logger';

// Create an instance of the console logger
const consoleTransport = new ConsoleTransport();

// Create an instance of the JSON logger
const jsonTransport = new JsonTransport();

/*
  Note: The file transport will create the file if it doesn't exist, and append to it if it does.
  We can also provide log rotation options to the file transport, which will automatically
  rotate the log file according to the date.
*/
const fileTransport = new FileTransport({ path: 'logs/app.log'});

const logger = new Logger({
  transports: [consoleTransport, jsonTransport, fileTransport]
});

/*
  Log messages will be handled by all three transports:
  - The console transport will output the log message to the console.
  - The JSON transport will output the log message to the console in JSON format.
  - The file transport will write the log message to the file.
*/
logger.info('Application started');
```
> **Note:** There is an example project in the examples directory that demonstrates how to use
the built-in UDP transport to send log messages to Splunk.

You can add multiple transports to a single logger, so that log messages can be
sent to multiple outputs. You can also create custom log transports by implementing the
```Transport``` interface as shown below:

```typescript
import { Logger, TransportPayload } from '@origranot/ts-logger';

export class CustomTransport implements Transport {
  handle(payload: TransportPayload) {
    console.log(`[${payload.timestamp}] - ${payload.message}`);
  }
}
```

## Contributing

Contributions are welcome! For feature requests and bug reports, please open an issue.

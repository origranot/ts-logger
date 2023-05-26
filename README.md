# :zap: ts-logger

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/origranot/ts-logger/release.yml)
![npm bundle size](https://img.shields.io/bundlephobia/min/@origranot/ts-logger)
![GitHub](https://img.shields.io/github/license/origranot/ts-logger)

A logging library designed to simplify the process of logging in your TypeScript applications. With zero
dependencies and features such as five log levels, custom transports, method decoration options,
timestamps, and log level thresholding, you'll have greater control over your log output.

Our library also provides the flexibility to extend its functionality through custom transports, enabling
you to meet the specific needs of your project. Say goodbye to cluttered and unorganized logs and get
started with ts-logger today!💪

## Features :star:

- Supports logging at five different levels (:bug: DEBUG, :information_source: INFO, :warning: WARN,
  :exclamation: ERROR, :fire: FATAL).
- Zero dependencies 🚫
- Support custom transports and formatters to extend the functionality of the library. 💬
- Support multiple log transports out of the box. 📦 (Console, UDP and File)
- Ability to decorate class methods to log their arguments, return values, and execution time. 📊
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
logger.fatal('Fatal message', new Error('We have a problem here'));

logger.info('You can also log objects', {
  foo: 'baz'
});
```

#### Optional parameters
- name (string): The name of the logger. (optional)
- timestamps (Boolean): Whether to include timestamps in logs (default: true)
- transports: Array of transports to process and log the data. (default: ConsoleTransport)
- suppress (Boolean): Whether to suppress logs (default: false)
- override: Override default options (see below)

#### Override default options

- logLevelColors: override and customize the default log level colors. 

  You can see the default log level colors in the table below:

  | LOG_LEVEL | COLOR     |
  | --------- | --------- |
  | DEBUG     | 🔵 BLUE   |
  | INFO      | 🟢 GREEN  |
  | WARN      | 🟡 YELLOW |
  | ERROR     | 🔴 RED    |
  | FATAL     | ⚪ WHITE  |

  The `logLevelColors` object is a map of the `LOG_LEVEL` enum to the `COLOR` enum.
  > **Note:** You can find the `COLOR` enum in the `src/utils/color.ts` file.

  For example, to override the default color of the `DEBUG` log level to `YELLOW` we can do the following:
  
  ```typescript
  const logger = new Logger({
    override: {
      logLevelColors: {
        [LOG_LEVEL.DEBUG]: COLOR.YELLOW
      }
    }
  });
  ```

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
  Output: [2022-01-01 00:00:00] INFO [exampleMethod]
  {
    args: [1, 2],
    returns: 3,
    executionTime: 3ms
  }
*/
```

#### Optional parameters

- executionTime (Boolean): Whether to calculate and print the function execution time. (default: false)

### Log transports

This library provides a few built-in log transports that can be used out of the box:

- **Console:** This transport outputs log messages to the console.
- **Udp:** this transport sends log messages via UDP protocol.
- **File:** This transport writes log messages to a file on disk.

The built-in transports have a default formatter assigned to them (SimpleFormatter), but you can override
it by passing a custom formatter to the transport constructor. Here's an example of how to use the
built-in log transports:

```typescript
import { Logger, ConsoleTransport, FileTransport } from '@origranot/ts-logger';

// Create an instance of the console logger
const consoleTransport = new ConsoleTransport();

/*
  Note: The file transport will create the file if it doesn't exist, and append to it if it does.
  We can also provide log rotation options to the file transport, which will automatically
  rotate the log file according to the date.
*/
const fileTransport = new FileTransport({ path: 'logs/app.log' });

const logger = new Logger({
  transports: [consoleTransport, fileTransport]
});

/*
  Log messages will be handled by both transports provided:
  - The console transport will output the log message to the console.
  - The file transport will write the log message to the file.
*/
logger.info('Application started');
```

> **Note:** There is a file in the examples directory that demonstrates how to use the built-in UDP
> transport to send log messages to Splunk.

#### Optional parameters

- formatter: An instance of a formatter to format the log message. (default: SimpleFormatter)
- threshold: The log level threshold, logs with a lower level than the threshold will be ignored
  (default: 'DEBUG').

You can add multiple transports to a single logger, so that log messages can be sent to multiple outputs.
You can also create custom log transports by extending the `Transport` class as shown below:

```typescript
import { Logger, TransportPayload } from '@origranot/ts-logger';

export class CustomTransport extends Transport {
  constructor() {
    super();
  }

  handle(payload: TransportPayload) {
    console.log([`[CustomTransport] - ${payload.message}`]);
  }
}
```

> **Note:** You can also create custom log formatters by implementing the `Formatter` interface.

## Contributing

Contributions are welcome! For feature requests and bug reports, please open an issue.

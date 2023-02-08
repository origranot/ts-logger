# :zap: ts-logger

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/origranot/ts-logger/release.yml)
![npm bundle size](https://img.shields.io/bundlephobia/min/@origranot/ts-logger)
![GitHub](https://img.shields.io/github/license/origranot/ts-logger)

A logging library designed to simplify the process of logging in your TypeScript applications. With zero dependencies and features such as five log levels, custom log handlers, method decoration options, timestamps, and log level thresholding, you'll have greater control over your log output.

Our library also provides the flexibility to extend its functionality through custom log handlers, enabling you to meet the specific needs of your project. Say goodbye to cluttered and unorganized logs and get started with ts-logger today!💪


## Features :star:

- Supports logging at five different levels (:bug: DEBUG, :information_source: INFO, :warning: WARN, :exclamation: ERROR, :fire: FATAL).
- Ability to add custom log handlers to extend the functionality of the library. 💬
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

const logger = new Logger({
  timeStamps: true
});

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

- timeStamps (Boolean): Whether to include timestamps in logs (default: false).
- threshold (LOG_LEVEL): The log level threshold, logs with a lower level than the
  threshold will be ignored (default: 'DEBUG').
- handlers: Array of handlers to process and log the data. (default: [ConsoleHandler])


### Decorated functions example

```typescript
import { Logger, LOG_LEVEL } from '@origranot/ts-logger';

const logger = new Logger({ timeStamps: true });

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

## Log handlers

The library allows you to add custom log handlers to extend the functionality of the
library. A log handler is a simple class that implements a handle method that takes in a
HandlerPayload object and outputs the log message in the desired format.

```typescript
import { Logger, HandlerPayload } from '@origranot/ts-logger';

export class CustomHandler extends LogHandler {
  handle(payload: HandlerPayload) {
    console.log(`[${payload.timestamp}] - ${payload.message}`);
  }
}
```

## Contributing

Contributions are welcome! For feature requests and bug reports, please open an issue.

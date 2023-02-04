# ts-logger

A customizable and flexible logging library for TypeScript applications.

## Features

- Supports logging at five different levels (DEBUG, INFO, WARN, ERROR, FATAL).
- Option to include timestamps in logs.
- Option to set log level threshold.
- Option to log execution time of decorated functions.
- Logs can be color-coded based on the log level.
- Ability to decorate class methods to log their arguments, return values, and execution time.

## Installation
```npm install @origranot/ts-logger```

## Usage

### Basic logger

```typescript
import { Logger } from 'ts-logger-decorator';

const logger = new Logger({
  timeStamps: true,
});

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warn message');
logger.error('Error message');
logger.fatal('Fatal message');
```

### Optional parameters

- timeStamps (Boolean): Whether to include timestamps in logs (default: false).
- threshold (LOG_LEVEL): The log level threshold, logs with a lower level than the threshold will be ignored (default: 'DEBUG').

### Decorated functions example

```typescript
import { Logger, LOG_LEVEL } from 'ts-logger-decorator';

const logger = new Logger({ timeStamps: true });

class ExampleClass {
  @logger.decorate(LOG_LEVEL.INFO, { executionTime: true })
  public exampleMethod(a: number, b: number): number {
    return a + b;
  }
}

const example = new ExampleClass();
example.exampleMethod(1, 2);

// Output: [2022-01-01 00:00:00] LOG_LEVEL [ExampleClass.exampleMethod] Arguments: [1,2]
// Output: [2022-01-01 00:00:00] LOG_LEVEL [ExampleClass.exampleMethod] Return value: 3
// Output: [2022-01-01 00:00:00] LOG_LEVEL [ExampleClass.exampleMethod] Execution time: 100ms 
```

### Optional parameters

- executionTime (Boolean): Whether to calculate and print the function execution time. (default: false)

## Contributing

Contributions are welcome! For feature requests and bug reports, please open an issue.





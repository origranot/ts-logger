import { Logger, LOG_LEVEL } from '../src';

const logger = new Logger({ timeStamps: true });

class Calculator {
  @logger.decorate(LOG_LEVEL.INFO, { executionTime: true })
  sum(a: number, b: number) {
    return a + b;
  }

  @logger.decorate(LOG_LEVEL.DEBUG)
  mul(a: number, b: number) {
    return a * b;
  }

  @logger.decorate(LOG_LEVEL.WARN)
  void() {
    logger.warn('This is a warning from the void method!', {
      metadata: {
        foo: 'bar',
        baz: 'qux'
      }
    });
  }
}

const calculator = new Calculator();

calculator.sum(1, 2);
calculator.mul(1, 2);
calculator.void();

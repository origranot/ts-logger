import { Logger, LOG_LEVEL } from '../src';

const logger = new Logger();

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
  divide(a: number, b: number) {
    logger.warn('This is a warning from the divide method!', {
      foo: 'bar',
      baz: 'qux'
    });

    return a / b;
  }
}

const calculator = new Calculator();

calculator.sum(1, 2);
calculator.mul(1, 2);
calculator.divide(10, 5);

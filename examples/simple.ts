import { Logger, LOG_LEVEL } from '../lib';

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
    logger.warn('This is a warning from the void method!');
  }
}

const calculator = new Calculator();

calculator.sum(1, 2);
calculator.mul(1, 2);
calculator.void();

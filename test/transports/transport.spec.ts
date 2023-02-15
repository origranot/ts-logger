import { Transport, ConsoleTransport, SimpleFormatter, LOG_LEVEL } from '../../src';

describe('Transport', () => {
  let transport: Transport;

  beforeEach(() => {
    transport = new ConsoleTransport();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transport', () => {
    it('should have default settings', () => {
      expect(transport.handle).toBeDefined();
      expect(transport.options).toBeDefined();

      // It should have a default LOG_LEVEL of DEBUG
      expect(transport.options.threshold).toBe(LOG_LEVEL.DEBUG);

      // It should have a default formatter of SimpleFormatter
      expect(transport.options.formatter).toBeInstanceOf(SimpleFormatter);
    });
  });
});

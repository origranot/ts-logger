import { ConsoleTransport, SimpleFormatter, Transport } from '../../src';

describe('ConsoleTransport', () => {
  let transport: ConsoleTransport;

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
    });

    it('should have a default formatter of SimpleFormatter', () => {
      expect(transport.options.formatter).toBeInstanceOf(SimpleFormatter);
    });

    it('should have a default full setting of true', () => {
      expect(transport['consoleOptions']?.fullFormat).toBe(true);
    });
  });

  describe('handle', () => {
    it('should log the message to the console', () => {
      const spy = jest.spyOn(console, 'log');
      transport.handle({
        message: 'This is a debug message'
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should log the message to the console with a custom formatter', () => {
      const spy = jest.spyOn(console, 'log');
      const formatter = new SimpleFormatter();
      const message = 'This is a debug message';

      transport = new ConsoleTransport({
        formatter
      });

      transport.handle({
        message
      });

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(message);
      expect(spy['mock'].calls[0][0]).toBe(message);
    });

    it('should log the message to the console with a custom formatter and full setting of false', () => {
      const spy = jest.spyOn(console, 'log');
      const message = 'This is a debug message\nThis is a second line';

      transport = new ConsoleTransport({
        fullFormat: false,
        formatter: new SimpleFormatter()
      });

      transport.handle({
        message
      });

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(message.split('\n')[0]);

      const output = spy['mock'].calls[0][0];
      expect(output).toBe(message.split('\n')[0]);
    });
  });
});

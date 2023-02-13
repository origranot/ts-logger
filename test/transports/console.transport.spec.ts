import { Transport, ConsoleTransport } from '../../src';

describe('ConsoleTransport', () => {
  let transport: Transport;

  beforeEach(() => {
    transport = new ConsoleTransport();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should log the message to the console', () => {
      const spy = jest.spyOn(console, 'log');
      transport.handle({
        message: 'This is a debug message'
      });
      expect(spy).toHaveBeenCalled();
    });
  });
});

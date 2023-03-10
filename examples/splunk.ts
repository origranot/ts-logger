import { UdpTransport } from './../src/transports/udp.transport';
import { JsonFormatter, Logger } from '../src';

const transport = new UdpTransport({
  formatter: new JsonFormatter(),
  host: '127.0.0.1',
  port: 514
});

const logger = new Logger({
  transports: [transport]
});

logger.info('Hello World!');
logger.info('This is an object', { foo: 'bar' });

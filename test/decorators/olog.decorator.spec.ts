import { LOG_LEVEL } from './../../lib/enums/log-level.enum';
import { olog } from '../../lib/decorators/index';

class TestClass {
    @olog({ level: LOG_LEVEL.ERROR })
    sum(a: number, b: number) {
        return a + b;
    }
}

describe('olog decorator', () => {
    it('should log the method call with correct log level', () => {
        const testClass = new TestClass();
        console.log = jest.fn();
        testClass.sum(1, 2);
        const a = Reflect.getMetadata(Symbol("olog"), testClass);
    });
});
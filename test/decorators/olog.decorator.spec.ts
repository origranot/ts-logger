import { OlogOptions } from './../../dist/interfaces/olog-options.interface.d';
import { LOG_LEVEL } from './../../lib/enums/log-level.enum';
import { olog, OLOG_KEY } from '../../lib/decorators/index';

class TestClass {
    @olog({ level: LOG_LEVEL.ERROR })
    public test(a: number, b: number) {
        return a + b;
    }
}

describe('olog decorator', () => {
    it('should log the method call with correct log level', () => {
        const testClass = new TestClass();
        const metadata: OlogOptions = Reflect.getMetadata(OLOG_KEY, testClass, "test");
        expect(metadata.level).toBe(LOG_LEVEL.ERROR);
    });
});
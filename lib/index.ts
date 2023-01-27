import { LOG_LEVEL } from './enums/log-level.enum';
import { Olog } from './olog';


const olog = new Olog();

class TestClass {
    @olog.decorate({ level: LOG_LEVEL.ERROR })
    public test(a: number, b: number) {
        return a + b;
    }
}


TestClass.prototype.test(1, 2);
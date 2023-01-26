import { olog } from './index';

class TestClass {
    @olog({ message: "Test method called" })
    testMethod(arg: string) {
        console.log(arg);
        return arg + "!";
    }
}

describe('olog decorator', () => {
    it('should log the method call and return value', () => {
        const testObj = new TestClass();
        console.log = jest.fn();
        const result = testObj.testMethod("Hello");
        expect(console.log).toHaveBeenCalledWith({ message: "Test method called" });
        expect(console.log).toHaveBeenCalledWith("Calling testMethod with args: [\"Hello\"]");
        expect(console.log).toHaveBeenCalledWith("Hello");
        expect(console.log).toHaveBeenCalledWith("testMethod returned: Hello!");
        expect(result).toBe("Hello!");
    });
});
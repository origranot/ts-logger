"use strict";
exports.__esModule = true;
exports.Logger = exports.OLOG_KEY = void 0;
var clic = require("cli-color");
require("reflect-metadata");
var enums_1 = require("./enums");
var timestamps_1 = require("./utils/timestamps");
exports.OLOG_KEY = Symbol('olog');
var Logger = /** @class */ (function () {
    function Logger(loggerOptions) {
        var _a;
        this.LOG_LEVEL_COLORS = (_a = {},
            _a[enums_1.LOG_LEVEL.DEBUG] = clic.blue,
            _a[enums_1.LOG_LEVEL.INFO] = clic.green,
            _a[enums_1.LOG_LEVEL.WARN] = clic.yellow,
            _a[enums_1.LOG_LEVEL.ERROR] = clic.red,
            _a[enums_1.LOG_LEVEL.FATAL] = clic.white,
            _a);
        this.options = loggerOptions || {
            logLevelThreshold: enums_1.LOG_LEVEL.DEBUG
        };
    }
    Logger.prototype.log = function (level, message, logOptions) {
        if (level < this.options.logLevelThreshold) {
            return;
        }
        var prefix = '';
        prefix += this.options.timeStamps ? "[".concat((0, timestamps_1.getTimeStamp)(), "] ") : '';
        prefix += "".concat(this.LOG_LEVEL_COLORS[level](level));
        prefix += (logOptions === null || logOptions === void 0 ? void 0 : logOptions.functionName) ? " [".concat(logOptions.functionName, "]") : '';
        console.log("".concat(prefix, " ").concat(message));
    };
    Logger.prototype.decorate = function (level, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var executionTime = options.executionTime;
        return function (target, propertyKey, descriptor) {
            if (!descriptor) {
                console.log('descriptor is null, not a function?');
                return;
            }
            // apply the decorator to a class method
            Reflect.defineMetadata(exports.OLOG_KEY, options, target, propertyKey);
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var start = Date.now();
                if (args.length) {
                    _this.log(level, "Arguments: ".concat(args), {
                        functionName: propertyKey
                    });
                }
                var result = originalMethod.apply(_this, args);
                if (result) {
                    _this.log(level, "Return value: ".concat(JSON.stringify(result)), {
                        functionName: propertyKey
                    });
                }
                if (executionTime) {
                    var end = Date.now();
                    _this.log(level, "Execution time: ".concat(end - start, "ms"), {
                        functionName: propertyKey
                    });
                }
                return result;
            };
        };
    };
    Logger.prototype.debug = function (message, options) {
        this.log(enums_1.LOG_LEVEL.DEBUG, message, options);
    };
    Logger.prototype.info = function (message, options) {
        this.log(enums_1.LOG_LEVEL.INFO, message, options);
    };
    Logger.prototype.warn = function (message, options) {
        this.log(enums_1.LOG_LEVEL.WARN, message, options);
    };
    Logger.prototype.error = function (message, options) {
        this.log(enums_1.LOG_LEVEL.ERROR, message, options);
    };
    Logger.prototype.fatal = function (message, options) {
        this.log(enums_1.LOG_LEVEL.FATAL, message, options);
    };
    return Logger;
}());
exports.Logger = Logger;

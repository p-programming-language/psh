"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callable = exports.CallableType = void 0;
const tslib_1 = require("tslib");
const value_1 = tslib_1.__importDefault(require("./value"));
const utility_1 = require("../../utility");
var CallableType;
(function (CallableType) {
    CallableType[CallableType["Function"] = 0] = "Function";
    CallableType[CallableType["IntrinsicFunction"] = 1] = "IntrinsicFunction";
})(CallableType || (exports.CallableType = CallableType = {}));
class Callable extends value_1.default {
    constructor() {
        super(...arguments);
        this.address = (0, utility_1.generateAddress)();
    }
    isIntrinsic() {
        return this.type === 1 /* CallableType.IntrinsicFunction */;
    }
}
exports.Callable = Callable;

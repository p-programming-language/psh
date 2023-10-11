"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const value_1 = tslib_1.__importDefault(require("./value"));
class Range extends value_1.default {
    constructor(minimum, maximum) {
        super();
        this.minimum = minimum;
        this.maximum = maximum;
    }
    doesFit(n) {
        return n >= this.minimum && n <= this.maximum;
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return util_1.default.inspect(this.minimum) + ".." + util_1.default.inspect(this.maximum);
    }
}
exports.Range = Range;

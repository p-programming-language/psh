"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const intrinsic_1 = tslib_1.__importDefault(require("../../values/intrinsic"));
const extensionName = "Range";
class RangeExtension extends intrinsic_1.default.ValueExtension {
    get propertyTypes() {
        return {};
    }
    get members() {
        const value = this.value;
        return {
            minimum: value.minimum,
            maximum: value.maximum
        };
    }
}
exports.default = RangeExtension;

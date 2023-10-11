"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const intrinsic_1 = tslib_1.__importDefault(require("../../../values/intrinsic"));
const io_1 = tslib_1.__importDefault(require("./io"));
const system_1 = tslib_1.__importDefault(require("./system"));
const math_1 = tslib_1.__importDefault(require("./math"));
class StdLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {};
    }
    get members() {
        return {
            io: new io_1.default(this.intrinsics, this.name),
            system: new system_1.default(this.intrinsics, this.name),
            math: new math_1.default(this.intrinsics, this.name)
        };
    }
}
exports.default = StdLib;

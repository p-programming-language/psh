"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constructable = exports.ConstructableType = void 0;
const tslib_1 = require("tslib");
const utility_1 = require("../../utility");
const value_1 = tslib_1.__importDefault(require("./value"));
var ConstructableType;
(function (ConstructableType) {
    ConstructableType[ConstructableType["Class"] = 0] = "Class";
    ConstructableType[ConstructableType["IntrinsicClass"] = 1] = "IntrinsicClass";
})(ConstructableType || (exports.ConstructableType = ConstructableType = {}));
class Constructable extends value_1.default {
    constructor() {
        super(...arguments);
        this.address = (0, utility_1.generateAddress)();
    }
    isIntrinsic() {
        return this.type === 1 /* ConstructableType.IntrinsicClass */;
    }
}
exports.Constructable = Constructable;

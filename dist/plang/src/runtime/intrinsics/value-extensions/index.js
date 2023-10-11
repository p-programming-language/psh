"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const range_1 = require("../../values/range");
const string_1 = tslib_1.__importDefault(require("./string"));
const range_2 = tslib_1.__importDefault(require("./range"));
const array_1 = tslib_1.__importDefault(require("./array"));
var IntrinsicExtension;
(function (IntrinsicExtension) {
    function get(value, ...typeParams) {
        let extension;
        switch (typeof value) {
            case "string": {
                extension = new string_1.default(value);
                break;
            }
            default: {
                if (value instanceof range_1.Range)
                    extension = new range_2.default(value);
                else if (value instanceof Array)
                    extension = new array_1.default(value, typeParams[0]);
                break;
            }
        }
        return extension;
    }
    IntrinsicExtension.get = get;
    function getFake(type, ...typeParams) {
        let extension;
        switch (type) {
            case "string": {
                extension = new string_1.default("");
                break;
            }
            case "Range": {
                extension = new range_2.default(new range_1.Range(0, 0));
                break;
            }
            case "Array": {
                extension = new array_1.default([], typeParams[0]);
                break;
            }
        }
        return extension;
    }
    IntrinsicExtension.getFake = getFake;
})(IntrinsicExtension || (IntrinsicExtension = {}));
exports.default = IntrinsicExtension;

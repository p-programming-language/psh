"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const readline_sync_1 = tslib_1.__importDefault(require("readline-sync"));
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const utility_1 = require("../../../../utility");
const singular_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/singular-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../values/intrinsic"));
class IOLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {};
    }
    get members() {
        const libName = this.name;
        return {
            write: class Write extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("void");
                    this.argumentTypes = { message: new singular_type_1.default("any") };
                }
                call(message) {
                    process.stdout.write(message);
                }
            },
            writeln: class Writeln extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("void");
                    this.argumentTypes = { message: new singular_type_1.default("any") };
                }
                call(message) {
                    console.log(message);
                }
            },
            readln: class Readln extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = (0, utility_1.optional)(new singular_type_1.default("string"));
                    this.argumentTypes = {
                        prompt: new singular_type_1.default("string"),
                        hideEchoBack: (0, utility_1.optional)(new singular_type_1.default("bool"))
                    };
                }
                call(prompt, hideEchoBack = false) {
                    return readline_sync_1.default.question(prompt, { hideEchoBack });
                }
            }
        };
    }
}
exports.default = IOLib;

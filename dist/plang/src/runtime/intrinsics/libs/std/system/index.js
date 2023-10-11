"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = require("os");
const child_process_1 = require("child_process");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../../values/intrinsic"));
const union_type_1 = tslib_1.__importDefault(require("../../../../../code-analysis/type-checker/types/union-type"));
const literal_type_1 = tslib_1.__importDefault(require("../../../../../code-analysis/type-checker/types/literal-type"));
const singular_type_1 = tslib_1.__importDefault(require("../../../../../code-analysis/type-checker/types/singular-type"));
const env_1 = tslib_1.__importDefault(require("./env"));
class SystemLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {
            os: new union_type_1.default([
                new literal_type_1.default("aix"),
                new literal_type_1.default("android"),
                new literal_type_1.default("darwin"),
                new literal_type_1.default("freebsd"),
                new literal_type_1.default("haiku"),
                new literal_type_1.default("linux"),
                new literal_type_1.default("openbsd"),
                new literal_type_1.default("sunos"),
                new literal_type_1.default("win32"),
                new literal_type_1.default("cygwin"),
                new literal_type_1.default("netbsd")
            ])
        };
    }
    get members() {
        const libName = this.name;
        return {
            os: (0, os_1.platform)(),
            env: env_1.default,
            // Time since Unix epoch in seconds
            time: class Time extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("int");
                    this.argumentTypes = {};
                }
                call() {
                    return Date.now() / 1000;
                }
            },
            // Executs a shell command
            exec: class Exec extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("string");
                    this.argumentTypes = { command: new singular_type_1.default("string") };
                }
                call(command) {
                    try {
                        const output = (0, child_process_1.execSync)(command, { encoding: "utf-8" });
                        return output;
                    }
                    catch (error) {
                        return error;
                    }
                }
            }
        };
    }
}
exports.default = SystemLib;

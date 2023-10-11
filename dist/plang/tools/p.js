"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const util_1 = tslib_1.__importDefault(require("util"));
require("colors.ts");
const value_1 = tslib_1.__importDefault(require("../src/runtime/values/value"));
const p_host_1 = tslib_1.__importDefault(require("./p-host"));
const repl_1 = tslib_1.__importDefault(require("./repl"));
class P {
    constructor(fileName) {
        this.fileName = fileName;
        this.hosts = [];
        this.repl = new repl_1.default(this);
        this.version = "vPSH";
        this.executionOptions = {
            outputTokens: false,
            outputAST: false,
            outputBoundAST: false,
            outputResult: false
        };
        this.hosts.push(new p_host_1.default(this, fileName));
    }
    doString(source, args = []) {
        if (!this.host.interpreter.definedArgv)
            this.host.interpreter.defineArgv(args);
        const parser = this.createParser(source);
        if (this.executionOptions.outputTokens)
            console.log(parser.input.toString());
        const { imports, program: ast } = parser.parse();
        if (this.executionOptions.outputAST)
            console.log(imports.concat(...ast).toString());
        this.host.resolver.resolve(imports);
        const boundImports = this.host.binder.bindStatements(imports);
        this.host.typeChecker.check(boundImports);
        this.host.interpreter.evaluate(imports);
        this.host.resolver.resolve(ast);
        const boundAST = this.host.binder.bindStatements(ast);
        if (this.executionOptions.outputBoundAST)
            console.log(boundImports.concat(...boundAST).toString());
        this.host.typeChecker.check(boundAST);
        const result = this.host.interpreter.evaluate(ast);
        if (this.executionOptions.outputResult) {
            const stringified = result instanceof value_1.default ?
                result.toString()
                : util_1.default.inspect(result, { colors: true });
            console.log("↳".gray(8), stringified);
        }
        return result;
    }
    doFile(filePath, args = []) {
        const fileContents = (0, fs_1.readFileSync)(filePath, "utf-8");
        const result = this.doString(fileContents, args);
        this.newHost(filePath);
        return result;
    }
    createParser(source) {
        return this.host.createParser(source);
    }
    newHost(fileName) {
        this.hosts.push(new p_host_1.default(this, fileName !== null && fileName !== void 0 ? fileName : this.fileName));
    }
    get host() {
        return this.hosts.at(-1);
    }
}
exports.default = P;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const readline_sync_1 = tslib_1.__importDefault(require("readline-sync"));
const os_1 = require("os");
const errors_1 = require("../src/errors");
const utility_1 = require("../src/utility");
const os = (0, os_1.platform)();
class REPL {
    constructor(p) {
        this.p = p;
        this.active = false;
        this.indentation = 0;
    }
    start(args) {
        this.outputVersion();
        const enclosingOutputEnabled = this.p.executionOptions.outputResult;
        this.p.executionOptions.outputResult = true;
        this.active = true;
        while (this.active) {
            const line = readline_sync_1.default.question("» ".green);
            if (!line.trim())
                continue;
            if (this.didInputDirectives(line))
                continue;
            if (!this.active)
                break;
            if (line.endsWith("{"))
                this.p.doString(this.readBlock(line), args);
            else
                this.p.doString(line, args);
        }
        this.p.executionOptions.outputResult = enclosingOutputEnabled;
    }
    stop() {
        this.active = false;
    }
    didInputDirectives(code) {
        switch (code.toLowerCase()) {
            case "@clear": {
                (0, utility_1.clearTerminal)();
                this.outputVersion();
                return true;
            }
            case "@tokens": {
                this.p.executionOptions.outputTokens = !this.p.executionOptions.outputTokens;
                console.log(`Tokenization output has been turned ${this.p.executionOptions.outputTokens ? "on".green : "off".red}`.gray(18).gray_bg(6));
                return true;
            }
            case "@ast": {
                this.p.executionOptions.outputAST = !this.p.executionOptions.outputAST;
                console.log(`AST output has been turned ${this.p.executionOptions.outputAST ? "on".green : "off".red}`.gray(18).gray_bg(6));
                return true;
            }
            case "@bound_ast": {
                this.p.executionOptions.outputBoundAST = !this.p.executionOptions.outputBoundAST;
                console.log(`Bound AST output has been turned ${this.p.executionOptions.outputBoundAST ? "on".green : "off".red}`.gray(18).gray_bg(6));
                return true;
            }
            case "@results": {
                this.p.executionOptions.outputResult = !this.p.executionOptions.outputResult;
                console.log(`Interpreter result output has been turned ${this.p.executionOptions.outputResult ? "on".green : "off".red}`.gray(18).gray_bg(6));
                return true;
            }
            case "@show_trace": {
                errors_1.PError.showTrace = !errors_1.PError.showTrace;
                console.log(`Full error traces have been turned ${this.p.executionOptions.outputResult ? "on".green : "off".red}`.gray(18).gray_bg(6));
                return true;
            }
        }
        return false;
    }
    readBlock(firstLine) {
        let code = firstLine;
        this.indentation++;
        while (!code.endsWith("}")) {
            const line = readline_sync_1.default.question("...".repeat(this.indentation).gray(8) + " ");
            if (line.endsWith("{") && !line.startsWith("}"))
                code += this.readBlock(line) + " ";
            else
                code += line;
        }
        this.indentation--;
        return code;
    }
    outputVersion() {
        console.log(`P ${this.p.version} on ${os}`);
    }
}
exports.default = REPL;

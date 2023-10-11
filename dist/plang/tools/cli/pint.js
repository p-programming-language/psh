#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPint = void 0;
const tslib_1 = require("tslib");
const cmd_ts_1 = require("cmd-ts");
const errors_1 = require("../../src/errors");
const p_1 = tslib_1.__importDefault(require("../p"));
const pint = (0, cmd_ts_1.command)({
    name: "pint",
    version: "v" + "PSH",
    args: {
        tokens: (0, cmd_ts_1.flag)({
            long: "tokens",
            description: "Print tokens output"
        }),
        ast: (0, cmd_ts_1.flag)({
            long: "ast",
            description: "Print AST output"
        }),
        boundAST: (0, cmd_ts_1.flag)({
            long: "bound-ast",
            description: "Print bound AST output"
        }),
        results: (0, cmd_ts_1.flag)({
            long: "results",
            description: "Print evaluation result output"
        }),
        trace: (0, cmd_ts_1.flag)({
            long: "trace",
            short: "t",
            description: "Print full PError traces"
        }),
        filePath: (0, cmd_ts_1.positional)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            displayName: "file path",
            description: "Path to the file to execute P on"
        }),
        args: (0, cmd_ts_1.restPositionals)({
            type: cmd_ts_1.string,
            displayName: "args",
            description: "The arguments to pass onto P"
        })
    },
    handler({ tokens, ast, boundAST, results, trace, filePath, args }) {
        const p = new p_1.default(filePath !== null && filePath !== void 0 ? filePath : "repl");
        p.executionOptions.outputTokens = tokens;
        p.executionOptions.outputAST = ast;
        p.executionOptions.outputBoundAST = boundAST;
        p.executionOptions.outputResult = results;
        errors_1.PError.showTrace = trace;
        if (!filePath || !filePath.endsWith(".p"))
            return p.repl.start(filePath ? [filePath].concat(...args) : args);
        p.doFile(filePath, args);
    }
});
const runPint = (argsOverride) => (0, cmd_ts_1.run)(pint, argsOverride !== null && argsOverride !== void 0 ? argsOverride : process.argv.slice(2));
exports.runPint = runPint;

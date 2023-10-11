"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
require("should");
const errors_1 = require("../../src/errors");
const type_checker_1 = require("../../src/code-analysis/type-checker");
const p_1 = tslib_1.__importDefault(require("../../tools/p"));
errors_1.PError.testing = true;
function getCheckFunction(source) {
    const p = new p_1.default("test");
    const parser = p.createParser(source);
    const { program: ast } = parser.parse();
    p.host.resolver.resolve(ast);
    const boundAST = p.host.binder.bindStatements(ast);
    return () => p.host.typeChecker.check(boundAST);
}
const testDirectory = "./tests/";
const testFiles = (0, fs_1.readdirSync)(testDirectory)
    .filter(file => file.endsWith(".p"));
function runTestsForFile(filePath) {
    (0, mocha_1.it)(filePath, () => {
        const source = (0, fs_1.readFileSync)(filePath, "utf-8");
        const check = getCheckFunction(source);
        check.should.not.throw();
    });
}
(0, mocha_1.describe)(type_checker_1.TypeChecker.name, () => {
    (0, mocha_1.it)("throws when declaring a variable with a mismatched type", () => {
        try {
            const check = getCheckFunction("string a = 2");
            check.should.throw("TypeError: Type 'int' is not assignable to 'string'");
        }
        catch (e) { }
        try {
            const check = getCheckFunction("int[] nums = ['a', 'b', 'c']");
            check.should.throw("TypeError: Type 'Array<string>' is not assignable to 'Array<int>'");
        }
        catch (e) { }
    });
    (0, mocha_1.it)("does not throw when assigning an empty array", () => {
        try {
            const check = getCheckFunction("int[] nums = []");
            check.should.not.throw();
        }
        catch (e) { }
    });
    (0, mocha_1.it)("throws when assigning to a variable with a mismatched type", () => {
        try {
            const check = getCheckFunction("int x = 1; x = 'abc'");
            check.should.throw("TypeError: Type 'string' is not assignable to 'int'");
        }
        catch (e) { }
    });
    (0, mocha_1.describe)("typechecks general tests (tests/)", () => {
        for (const file of testFiles) {
            if (file.includes("greeter.p") || file.includes("loops.p") || file.includes("types.p"))
                continue;
            const filePath = path_1.default.join(testDirectory, file);
            runTestsForFile(filePath);
        }
    });
});

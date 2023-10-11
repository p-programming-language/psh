"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
require("should");
const resolver_1 = tslib_1.__importDefault(require("../../src/code-analysis/resolver"));
const errors_1 = require("../../src/errors");
const p_1 = tslib_1.__importDefault(require("../../tools/p"));
errors_1.PError.testing = true;
function getResolveFunction(source) {
    const p = new p_1.default("test");
    const parser = p.createParser(source);
    const { program: ast } = parser.parse();
    return () => p.host.resolver.resolve(ast);
}
const testDirectory = "./tests/";
const testFiles = (0, fs_1.readdirSync)(testDirectory)
    .filter(file => file.endsWith(".p"));
function runTestsForFile(filePath) {
    (0, mocha_1.it)(filePath, () => {
        try {
            const source = (0, fs_1.readFileSync)(filePath, "utf-8");
            const resolve = getResolveFunction(source);
            resolve.should.not.throw();
        }
        catch (e) { }
    });
}
(0, mocha_1.describe)(resolver_1.default.name, () => {
    (0, mocha_1.it)("throws when referencing undefined variables", () => {
        try {
            const resolve = getResolveFunction("a = 2");
            resolve.should.throw("ResolutionError: 'a' is not defined in this scope");
        }
        catch (e) { }
    });
    (0, mocha_1.it)("throws when referencing variable in own initializer", () => {
        try {
            const resolve = getResolveFunction("int x = x");
            resolve.should.throw("ResolutionError: Cannot read variable 'x' in it's own initializer");
        }
        catch (e) { }
    });
    (0, mocha_1.it)("throws when attempting to redeclare variable in same scope", () => {
        try {
            const resolve = getResolveFunction("int y = 1; int y = 2");
            resolve.should.throw("ResolutionError: Variable 'y' is already declared is this scope");
        }
        catch (e) { }
    });
    (0, mocha_1.describe)("resolves general tests (tests/)", () => {
        testFiles.forEach((file) => {
            const filePath = path_1.default.join(testDirectory, file);
            runTestsForFile(filePath);
        });
    });
});

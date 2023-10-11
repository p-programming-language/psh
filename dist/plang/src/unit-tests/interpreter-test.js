"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
require("should");
const errors_1 = require("../../src/errors");
const utility_1 = require("../utility");
const interpreter_1 = tslib_1.__importDefault(require("../../src/runtime/interpreter"));
const p_1 = tslib_1.__importDefault(require("../../tools/p"));
const pkg = require("../../package.json");
errors_1.PError.testing = true;
let p = new p_1.default("test");
function evaluate(source, createNewEnvironment = true, errorsAreOk = false) {
    let result;
    if (errorsAreOk)
        try {
            result = p.doString(source);
        }
        catch (_a) { }
    else
        result = p.doString(source);
    if (createNewEnvironment)
        p.newHost();
    return result;
}
const testDirectory = "./tests/";
const testFiles = (0, fs_1.readdirSync)(testDirectory)
    .filter(file => file.endsWith(".p"));
function runTestsForFile(filePath) {
    (0, mocha_1.it)(filePath, () => {
        const source = (0, fs_1.readFileSync)(filePath, "utf-8");
        (() => evaluate(source)).should.not.throw();
    });
}
(0, mocha_1.describe)(interpreter_1.default.name, () => {
    (0, mocha_1.it)("evaluates literals", () => {
        (0, mocha_1.it)("strings", () => {
            var _a;
            (_a = evaluate("'abc'")) === null || _a === void 0 ? void 0 : _a.should.equal("abc");
        });
        (0, mocha_1.it)("integers", () => {
            var _a;
            (_a = evaluate("420")) === null || _a === void 0 ? void 0 : _a.should.equal(420);
        });
        (0, mocha_1.it)("floats", () => {
            var _a;
            (_a = evaluate("69.420")) === null || _a === void 0 ? void 0 : _a.should.equal(69.42);
        });
        (0, mocha_1.it)("booleans", () => {
            var _a;
            (_a = evaluate("true")) === null || _a === void 0 ? void 0 : _a.should.equal(true);
        });
        (0, mocha_1.it)("arrays", () => {
            var _a;
            (_a = evaluate("[1,'a',true]")) === null || _a === void 0 ? void 0 : _a.should.equal([1, "a", true]);
        });
    });
    (0, mocha_1.it)("evaluates binary expressions", () => {
        var _a, _b, _c, _d, _e;
        (_a = evaluate("5 + 2 * 3")) === null || _a === void 0 ? void 0 : _a.should.equal(11);
        (_b = evaluate("5 ^ 2 * 2")) === null || _b === void 0 ? void 0 : _b.should.equal(50);
        (_c = evaluate("false || true && false")) === null || _c === void 0 ? void 0 : _c.should.be.false();
        (_d = evaluate("false || true && false")) === null || _d === void 0 ? void 0 : _d.should.be.false();
        (_e = evaluate("1.0 == 1")) === null || _e === void 0 ? void 0 : _e.should.be.true();
    });
    (0, mocha_1.it)("evaluates unary expressions", () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_a = evaluate("-(5 + 7)")) === null || _a === void 0 ? void 0 : _a.should.equal(-12);
        (_b = evaluate("+2")) === null || _b === void 0 ? void 0 : _b.should.equal(2);
        (_c = evaluate("!false")) === null || _c === void 0 ? void 0 : _c.should.be.true();
        (_d = evaluate("!0")) === null || _d === void 0 ? void 0 : _d.should.be.false();
        (_e = evaluate("!1")) === null || _e === void 0 ? void 0 : _e.should.be.false();
        (_f = evaluate("!''")) === null || _f === void 0 ? void 0 : _f.should.be.false();
        (_g = evaluate("~5")) === null || _g === void 0 ? void 0 : _g.should.equal(-6);
        (_h = evaluate("#['a','b','c']")) === null || _h === void 0 ? void 0 : _h.should.equal(3);
    });
    (0, mocha_1.it)("evaluates variable declarations & compound assignments", () => {
        var _a, _b, _c, _d;
        (_a = evaluate("mut int x = 2", false)) === null || _a === void 0 ? void 0 : _a.should.be.undefined();
        (_b = evaluate("++x", false)) === null || _b === void 0 ? void 0 : _b.should.equal(3);
        (_c = evaluate("x += 7", false)) === null || _c === void 0 ? void 0 : _c.should.equal(10);
        (_d = evaluate("x := 1")) === null || _d === void 0 ? void 0 : _d.should.equal(1);
    });
    (0, mocha_1.it)("evaluates if statements", () => {
        var _a, _b, _c, _d;
        (_a = evaluate("mut bool cool = true", false)) === null || _a === void 0 ? void 0 : _a.should.be.undefined();
        (_b = evaluate("cool", false)) === null || _b === void 0 ? void 0 : _b.should.equal(true);
        (_c = evaluate("if cool\n\tcool = false", false)) === null || _c === void 0 ? void 0 : _c.should.be.undefined();
        (_d = evaluate("cool")) === null || _d === void 0 ? void 0 : _d.should.equal(false);
    });
    (0, mocha_1.it)("evaluates while statements", () => {
        var _a, _b, _c;
        (_a = evaluate("mut int i = 0", false)) === null || _a === void 0 ? void 0 : _a.should.be.undefined();
        (_b = evaluate("until i == 5\n\t++i", false)) === null || _b === void 0 ? void 0 : _b.should.be.undefined();
        (_c = evaluate("i")) === null || _c === void 0 ? void 0 : _c.should.equal(5);
    });
    (0, mocha_1.it)("evaluates indexing expressions", () => {
        var _a;
        (_a = evaluate("int[] nums = [1,2,3]; nums[1]")) === null || _a === void 0 ? void 0 : _a.should.equal(2);
    });
    (0, mocha_1.it)("evaluates property assignment expressions", () => {
        var _a;
        (_a = evaluate("int[] nums = [1,2,3]; nums[1] = 5; nums[1]")) === null || _a === void 0 ? void 0 : _a.should.equal(5);
    });
    (0, mocha_1.it)("evaluates call expressions", () => {
        var _a;
        evaluate("use eval from @p", false);
        (_a = evaluate("eval('1 + 2')")) === null || _a === void 0 ? void 0 : _a.should.equal(3);
    });
    (0, mocha_1.it)("evaluates function declarations", () => {
        var _a, _b;
        (_a = evaluate("int fn getNum { return 5 }; getNum()")) === null || _a === void 0 ? void 0 : _a.should.equal(5);
        (_b = evaluate("int fn getNum(int add = 0) { return 5 + add }; getNum(6)")) === null || _b === void 0 ? void 0 : _b.should.equal(11);
    });
    if ((0, utility_1.fileExists)(path_1.default.join(__dirname, "..", "runtime", "intrinsics", "libs", "std", "io.js")))
        (0, mocha_1.it)("evaluates intrinsic imports", () => {
            evaluate("use io from @std", undefined, true);
            evaluate("use readln from @std/io", undefined, true);
        });
    (0, mocha_1.it)("evaluates intrinsics", () => {
        var _a, _b;
        evaluate("use version from @p", false);
        (_a = evaluate("version")) === null || _a === void 0 ? void 0 : _a.should.equal("v" + pkg.version);
        (_b = evaluate("filename$")) === null || _b === void 0 ? void 0 : _b.should.equal("test");
    });
    (0, mocha_1.describe)("evaluates general tests (tests/)", () => {
        testFiles.forEach((file) => {
            const filePath = path_1.default.join(testDirectory, file);
            runTestsForFile(filePath);
        });
    });
});

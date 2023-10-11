"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.LocationSpan = exports.Location = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const syntax_type_1 = tslib_1.__importDefault(require("./syntax-type"));
const TAB = " ".repeat(2);
util_1.default.inspect.defaultOptions = {
    colors: true,
    getters: true
};
class Location {
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return `(${util_1.default.inspect(this.line)}:${util_1.default.inspect(this.column)})`;
    }
}
exports.Location = Location;
class LocationSpan {
    constructor(start, finish) {
        this.start = start;
        this.finish = finish;
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return `${this.start.toString()} - ${this.finish.toString()}`;
    }
}
exports.LocationSpan = LocationSpan;
class Token {
    constructor(syntax, lexeme, value, locationSpan) {
        this.syntax = syntax;
        this.lexeme = lexeme;
        this.value = value;
        this.locationSpan = locationSpan;
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return [
            "Token {",
            `${TAB}syntax: ${util_1.default.inspect(syntax_type_1.default[this.syntax])}`,
            `${TAB}lexeme: ${util_1.default.inspect(this.lexeme)}`,
            `${TAB}value: ${util_1.default.inspect(this.value)}`,
            `${TAB}locationSpan: ${this.locationSpan.toString()}`,
            "}"
        ].join("\n");
    }
}
exports.Token = Token;

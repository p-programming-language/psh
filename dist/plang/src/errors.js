"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicRegistrationError = exports.RuntimeError = exports.ResolutionError = exports.ReferenceError = exports.BindingError = exports.TypeError = exports.ParserSyntaxError = exports.LexerSyntaxError = exports.PError = void 0;
class PError {
    constructor(name, message, line, column, hookedException = false) {
        this.name = name;
        this.message = message;
        this.line = line;
        this.column = column;
        if (PError.testing || hookedException)
            return;
        const output = `${name}: ${message}\n  at ${line}:${column}`;
        if (PError.showTrace)
            throw new Error(output);
        else {
            console.log(output);
            process.exit(1);
        }
    }
}
exports.PError = PError;
PError.testing = false;
PError.showTrace = false;
class LexerSyntaxError extends PError {
    constructor(message, line, column) {
        super("SyntaxError", message, line, column);
    }
}
exports.LexerSyntaxError = LexerSyntaxError;
class ParserSyntaxError extends PError {
    constructor(message, token) {
        super("SyntaxError", message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.ParserSyntaxError = ParserSyntaxError;
class TypeError extends PError {
    constructor(message, token) {
        super(TypeError.name, message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.TypeError = TypeError;
class BindingError extends PError {
    constructor(message, token) {
        super(BindingError.name, message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.BindingError = BindingError;
class ReferenceError extends PError {
    constructor(message, token) {
        super(ReferenceError.name, message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.ReferenceError = ReferenceError;
class ResolutionError extends PError {
    constructor(message, token) {
        super(ResolutionError.name, message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.ResolutionError = ResolutionError;
class RuntimeError extends PError {
    constructor(message, token) {
        super(RuntimeError.name, message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.RuntimeError = RuntimeError;
class IntrinsicRegistrationError extends PError {
    constructor(message, token) {
        super(IntrinsicRegistrationError.name, message, token.locationSpan.start.line, token.locationSpan.start.column);
    }
}
exports.IntrinsicRegistrationError = IntrinsicRegistrationError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeContext = void 0;
var ScopeContext;
(function (ScopeContext) {
    ScopeContext[ScopeContext["Global"] = 0] = "Global";
    ScopeContext[ScopeContext["Block"] = 1] = "Block";
    ScopeContext[ScopeContext["Class"] = 2] = "Class";
})(ScopeContext || (exports.ScopeContext = ScopeContext = {}));

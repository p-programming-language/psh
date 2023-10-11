"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
var HookedException;
(function (HookedException_1) {
    class HookedException extends errors_1.PError {
        constructor(token) {
            super("HookedException", "(BUG)", token.locationSpan.start.line, token.locationSpan.start.column, true);
        }
    }
    class Return extends HookedException {
        constructor(token, value) {
            super(token);
            this.value = value;
        }
    }
    HookedException_1.Return = Return;
    class Break extends HookedException {
        constructor(token, loopLevel) {
            super(token);
            this.loopLevel = loopLevel;
        }
    }
    HookedException_1.Break = Break;
    class Next extends HookedException {
        constructor(token, loopLevel) {
            super(token);
            this.loopLevel = loopLevel;
        }
    }
    HookedException_1.Next = Next;
})(HookedException || (HookedException = {}));
exports.default = HookedException;

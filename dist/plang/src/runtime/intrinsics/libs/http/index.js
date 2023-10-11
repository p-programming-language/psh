"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const sync_fetch_1 = tslib_1.__importDefault(require("sync-fetch"));
const express_1 = tslib_1.__importDefault(require("express"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../values/intrinsic"));
const singular_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/singular-type"));
const literal_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/literal-type"));
const union_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/union-type"));
const interface_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/interface-type"));
const function_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/function-type"));
const array_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/array-type"));
const mapToInterfaceSignature = ([name, valueType]) => [new literal_type_1.default(name), {
        valueType,
        mutable: false
    }];
const HTTP_METHOD_TYPE = new union_type_1.default([
    new literal_type_1.default("GET"),
    new literal_type_1.default("POST"),
    new literal_type_1.default("PUT"),
    new literal_type_1.default("PATCH"),
    new literal_type_1.default("DELETE")
]);
const HTTP_REQUEST_TYPE = new interface_type_1.default(new Map([
    ["fresh", new singular_type_1.default("bool")],
    ["xhr", new singular_type_1.default("bool")],
    ["ip", new singular_type_1.default("string")],
    ["protocol", new singular_type_1.default("string")],
    ["path", new singular_type_1.default("string")],
    ["subdomains", new array_type_1.default(new singular_type_1.default("string"))],
    ["hostname", new singular_type_1.default("string")],
    ["url", new singular_type_1.default("string")],
    ["method", HTTP_METHOD_TYPE],
    ["params", new interface_type_1.default(new Map, new Map([
            [new singular_type_1.default("string"), new singular_type_1.default("string")]
        ]), "http.Request")]
].map(mapToInterfaceSignature)), new Map, "http.Request");
const HTTP_RESPONSE_TYPE = new interface_type_1.default(new Map([
    ["append", new function_type_1.default(new Map([
            ["field", new singular_type_1.default("string")],
            ["value", new union_type_1.default([
                    new singular_type_1.default("string"),
                    new array_type_1.default(new singular_type_1.default("string")),
                    new singular_type_1.default("undefined")
                ])]
        ]), new singular_type_1.default("void"))],
    ["send", new function_type_1.default(new Map([
            ["body", new union_type_1.default([
                    new singular_type_1.default("any"),
                    new singular_type_1.default("undefined")
                ])]
        ]), new singular_type_1.default("void"))],
    ["status", new function_type_1.default(new Map([["code", new singular_type_1.default("int")]]), new singular_type_1.default("void"))],
    ["end", new function_type_1.default(new Map, new singular_type_1.default("void"))],
    ["json", new function_type_1.default(new Map, new interface_type_1.default(new Map, new Map([
            [new singular_type_1.default("string"), new singular_type_1.default("any")]
        ])))]
].map(mapToInterfaceSignature)), new Map, "http.Response");
class HttpLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {};
    }
    get members() {
        const libName = this.name;
        const interpreter = this.intrinsics.interpreter;
        return {
            Server: class Server extends intrinsic_1.default.Class {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.constructorArgumentTypes = {};
                    this.memberSignatures = {
                        start: {
                            modifiers: [],
                            valueType: new function_type_1.default(new Map(Object.entries({
                                port: new singular_type_1.default("int"),
                                onRequest: new function_type_1.default(new Map([
                                    ["req", HTTP_REQUEST_TYPE],
                                    ["res", HTTP_RESPONSE_TYPE]
                                ]), new singular_type_1.default("void"))
                            })), new singular_type_1.default("void")),
                            mutable: false
                        }
                    };
                }
                construct() {
                    const httpServer = this;
                    const server = (0, express_1.default)();
                    return {
                        start: new (class Start extends intrinsic_1.default.Function {
                            constructor() {
                                super(...arguments);
                                this.sig = httpServer.memberSignatures.start.valueType;
                                this.name = `${libName}.Server.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                this.returnType = this.sig.returnType;
                                this.argumentTypes = Object.fromEntries(this.sig.parameterTypes);
                            }
                            call(port, onRequest) {
                                const responseSig = new Map(Array.from(HTTP_RESPONSE_TYPE.members.entries())
                                    .map(([nameType, signature]) => [nameType.name.slice(1, -1), signature.valueType]));
                                server.use(({ hostname, url, ip, method, params, fresh, protocol, path, xhr, subdomains }, res, next) => {
                                    onRequest.call(interpreter, {
                                        hostname, url, ip, method, params, fresh, protocol, path, xhr, subdomains
                                    }, {
                                        append: new (class Append extends intrinsic_1.default.Function {
                                            constructor() {
                                                super(...arguments);
                                                this.name = `${libName}.Response.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                                this.sig = responseSig.get(this.name.split(".").at(-1));
                                                this.returnType = this.sig.returnType;
                                                this.argumentTypes = Object.fromEntries(this.sig.parameterTypes);
                                            }
                                            call(field, value) {
                                                res.append(field, value);
                                            }
                                        })(interpreter),
                                        send: new (class Send extends intrinsic_1.default.Function {
                                            constructor() {
                                                super(...arguments);
                                                this.name = `${libName}.Response.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                                this.sig = responseSig.get(this.name.split(".").at(-1));
                                                this.returnType = this.sig.returnType;
                                                this.argumentTypes = Object.fromEntries(this.sig.parameterTypes);
                                            }
                                            call(body) {
                                                res.send(body);
                                            }
                                        })(interpreter),
                                        status: new (class Status extends intrinsic_1.default.Function {
                                            constructor() {
                                                super(...arguments);
                                                this.name = `${libName}.Response.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                                this.sig = responseSig.get(this.name.split(".").at(-1));
                                                this.returnType = this.sig.returnType;
                                                this.argumentTypes = Object.fromEntries(this.sig.parameterTypes);
                                            }
                                            call(code) {
                                                res.status(code);
                                            }
                                        })(interpreter),
                                        end: new (class End extends intrinsic_1.default.Function {
                                            constructor() {
                                                super(...arguments);
                                                this.name = `${libName}.Response.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                                this.sig = responseSig.get(this.name.split(".").at(-1));
                                                this.returnType = this.sig.returnType;
                                                this.argumentTypes = Object.fromEntries(this.sig.parameterTypes);
                                            }
                                            call() {
                                                res.end();
                                            }
                                        })(interpreter),
                                        json: new (class Json extends intrinsic_1.default.Function {
                                            constructor() {
                                                super(...arguments);
                                                this.name = `${libName}.Response.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                                this.sig = responseSig.get(this.name.split(".").at(-1));
                                                this.returnType = this.sig.returnType;
                                                this.argumentTypes = Object.fromEntries(this.sig.parameterTypes);
                                            }
                                            call() {
                                                res.json();
                                            }
                                        })(interpreter)
                                    });
                                    next();
                                });
                                server.listen(port);
                            }
                        })(interpreter)
                    };
                }
            },
            request: class Request extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new interface_type_1.default(new Map([
                        [new literal_type_1.default("json"), {
                                valueType: new function_type_1.default(new Map, new singular_type_1.default("any")),
                                mutable: false
                            }]
                    ]), new Map);
                    this.argumentTypes = {
                        uri: new singular_type_1.default("string"),
                        options: new interface_type_1.default(new Map([
                            [new literal_type_1.default("method"), {
                                    valueType: HTTP_METHOD_TYPE,
                                    mutable: false
                                }]
                        ]), new Map)
                    };
                }
                call(uri, options) {
                    const interpreter = this.interpreter;
                    const res = (0, sync_fetch_1.default)(uri, { method: options.method });
                    return {
                        json: new (class ToJSON extends intrinsic_1.default.Function {
                            constructor() {
                                super(...arguments);
                                this.name = `${libName}.Response.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                                this.returnType = new singular_type_1.default("any");
                                this.argumentTypes = {};
                            }
                            call() {
                                return res.json();
                            }
                        })(interpreter)
                    };
                }
            }
        };
    }
}
exports.default = HttpLib;

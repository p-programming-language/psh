"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const readline_sync_1 = tslib_1.__importDefault(require("readline-sync"));
const bound_node_1 = require("../src/code-analysis/binder/bound-node");
const type_1 = require("../src/code-analysis/type-checker/types/type");
const ast_1 = tslib_1.__importDefault(require("../src/code-analysis/parser/ast"));
var ASTViewer;
(function (ASTViewer) {
    function start(p) {
        let option = undefined;
        while (option !== "bound" && option !== "regular")
            option = readline_sync_1.default.question("Which AST do you want to view (regular/bound)? ").trim().toLowerCase();
        console.log(`Entering ${option === "bound" ? option : ""} AST viewer`.green.gray_bg(6));
        const source = readline_sync_1.default.question("Input the source code you want to view the AST of: ").trim();
        const parser = p.createParser(source);
        const { program: ast } = parser.parse();
        if (option === "bound") {
            const boundAST = p.host.binder.bindStatements(ast);
            viewNodeList(boundAST);
        }
        else
            viewNodeList(ast);
    }
    ASTViewer.start = start;
    function viewNodeList(nodes) {
        while (true) {
            for (const node of nodes) {
                console.log(`${nodes.indexOf(node) + 1}: ${node}`);
                console.log();
            }
            console.log();
            let selectedNumber = undefined;
            while (selectedNumber !== "@back" && selectedNumber !== "@exit"
                && (!parseInt(selectedNumber !== null && selectedNumber !== void 0 ? selectedNumber : "")
                    || !(!!parseInt(selectedNumber)
                        && parseInt(selectedNumber) <= nodes.length
                        && parseInt(selectedNumber) > 0))) {
                selectedNumber = readline_sync_1.default.question(`Which element do you want to inspect (1-${nodes.length})? `, {});
            }
            if (selectedNumber === "@back" || selectedNumber === "@exit")
                break;
            viewObject(nodes[parseInt(selectedNumber) - 1]);
        }
    }
    let lastObject;
    function viewObject(object) {
        console.log(object);
        console.log();
        while (true) {
            let propertyName = undefined;
            while (propertyName !== "@back" && !(propertyName in object))
                propertyName = readline_sync_1.default.question(`Which property of ${object.constructor.name} do you want to inspect? `);
            if (propertyName === "@back") {
                console.log(lastObject);
                console.log();
                break;
            }
            const value = object[propertyName];
            if (value instanceof ast_1.default.Node || value instanceof bound_node_1.BoundNode || value instanceof type_1.Type) {
                lastObject = object;
                viewObject(value);
            }
            else {
                console.log(value);
                console.log();
            }
        }
    }
})(ASTViewer || (ASTViewer = {}));
exports.default = ASTViewer;

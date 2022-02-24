"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxErr = exports.parse = exports.Parser = exports.ASTKinds = void 0;
var ASTKinds;
(function (ASTKinds) {
    ASTKinds["start"] = "start";
    ASTKinds["recursive_1"] = "recursive_1";
    ASTKinds["recursive_2"] = "recursive_2";
    ASTKinds["recursive_3"] = "recursive_3";
    ASTKinds["recursive_4"] = "recursive_4";
    ASTKinds["recursive_5"] = "recursive_5";
    ASTKinds["recursive_6"] = "recursive_6";
    ASTKinds["recursive_7"] = "recursive_7";
    ASTKinds["recursive_8"] = "recursive_8";
    ASTKinds["recursive_9"] = "recursive_9";
    ASTKinds["recursive_10"] = "recursive_10";
    ASTKinds["recursive_11"] = "recursive_11";
    ASTKinds["recursive_12"] = "recursive_12";
    ASTKinds["recursive_13"] = "recursive_13";
    ASTKinds["recursive_14"] = "recursive_14";
    ASTKinds["recursive_15"] = "recursive_15";
    ASTKinds["recursive_16"] = "recursive_16";
    ASTKinds["recursive_17"] = "recursive_17";
    ASTKinds["recursive_18"] = "recursive_18";
    ASTKinds["recursive_19"] = "recursive_19";
    ASTKinds["recursive_20"] = "recursive_20";
    ASTKinds["recursive_21"] = "recursive_21";
    ASTKinds["recursive_22"] = "recursive_22";
    ASTKinds["recursive_23"] = "recursive_23";
    ASTKinds["recursive_24"] = "recursive_24";
    ASTKinds["recursive_25"] = "recursive_25";
    ASTKinds["recursive_26"] = "recursive_26";
    ASTKinds["recursive_27"] = "recursive_27";
    ASTKinds["recursive_28"] = "recursive_28";
    ASTKinds["recursive_29"] = "recursive_29";
    ASTKinds["recursive_30"] = "recursive_30";
    ASTKinds["recursive_31"] = "recursive_31";
    ASTKinds["recursive_32"] = "recursive_32";
    ASTKinds["TkNumber"] = "TkNumber";
    ASTKinds["TkNum"] = "TkNum";
    ASTKinds["TkBool"] = "TkBool";
    ASTKinds["TkFalse"] = "TkFalse";
    ASTKinds["TkTrue"] = "TkTrue";
    ASTKinds["TkId"] = "TkId";
    ASTKinds["TkPlus"] = "TkPlus";
    ASTKinds["TkMult"] = "TkMult";
    ASTKinds["TkOpenPar"] = "TkOpenPar";
    ASTKinds["TkClosePar"] = "TkClosePar";
    ASTKinds["TkOpenBracket"] = "TkOpenBracket";
    ASTKinds["TkCloseBracket"] = "TkCloseBracket";
    ASTKinds["TkOpenBrace"] = "TkOpenBrace";
    ASTKinds["TkCloseBrace"] = "TkCloseBrace";
    ASTKinds["TkNot"] = "TkNot";
    ASTKinds["TkPower"] = "TkPower";
    ASTKinds["TkDiv"] = "TkDiv";
    ASTKinds["TkMod"] = "TkMod";
    ASTKinds["TkMinus"] = "TkMinus";
    ASTKinds["TkLT"] = "TkLT";
    ASTKinds["TkLE"] = "TkLE";
    ASTKinds["TkGE"] = "TkGE";
    ASTKinds["TkGT"] = "TkGT";
    ASTKinds["TkEQ"] = "TkEQ";
    ASTKinds["TkNE"] = "TkNE";
    ASTKinds["TkAnd"] = "TkAnd";
    ASTKinds["TkOr"] = "TkOr";
    ASTKinds["TkQuote"] = "TkQuote";
    ASTKinds["TkComma"] = "TkComma";
    ASTKinds["TkSemicolon"] = "TkSemicolon";
    ASTKinds["TkColon"] = "TkColon";
    ASTKinds["TkAssign"] = "TkAssign";
    ASTKinds["space_1"] = "space_1";
    ASTKinds["space_2"] = "space_2";
    ASTKinds["space_3"] = "space_3";
    ASTKinds["space_4"] = "space_4";
    ASTKinds["space_5"] = "space_5";
    ASTKinds["$EOF"] = "$EOF";
})(ASTKinds = exports.ASTKinds || (exports.ASTKinds = {}));
class Parser {
    constructor(input) {
        this.negating = false;
        this.memoSafe = true;
        this.pos = { overallPos: 0, line: 1, offset: 0 };
        this.input = input;
    }
    reset(pos) {
        this.pos = pos;
    }
    finished() {
        return this.pos.overallPos === this.input.length;
    }
    clearMemos() {
    }
    matchstart($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$start;
            let $$res = null;
            if (true
                && ($scope$start = this.matchrecursive($$dpth + 1, $$cr)) !== null
                && this.match$EOF($$cr) !== null) {
                $$res = { kind: ASTKinds.start, start: $scope$start };
            }
            return $$res;
        });
    }
    matchrecursive($$dpth, $$cr) {
        return this.choice([
            () => this.matchrecursive_1($$dpth + 1, $$cr),
            () => this.matchrecursive_2($$dpth + 1, $$cr),
            () => this.matchrecursive_3($$dpth + 1, $$cr),
            () => this.matchrecursive_4($$dpth + 1, $$cr),
            () => this.matchrecursive_5($$dpth + 1, $$cr),
            () => this.matchrecursive_6($$dpth + 1, $$cr),
            () => this.matchrecursive_7($$dpth + 1, $$cr),
            () => this.matchrecursive_8($$dpth + 1, $$cr),
            () => this.matchrecursive_9($$dpth + 1, $$cr),
            () => this.matchrecursive_10($$dpth + 1, $$cr),
            () => this.matchrecursive_11($$dpth + 1, $$cr),
            () => this.matchrecursive_12($$dpth + 1, $$cr),
            () => this.matchrecursive_13($$dpth + 1, $$cr),
            () => this.matchrecursive_14($$dpth + 1, $$cr),
            () => this.matchrecursive_15($$dpth + 1, $$cr),
            () => this.matchrecursive_16($$dpth + 1, $$cr),
            () => this.matchrecursive_17($$dpth + 1, $$cr),
            () => this.matchrecursive_18($$dpth + 1, $$cr),
            () => this.matchrecursive_19($$dpth + 1, $$cr),
            () => this.matchrecursive_20($$dpth + 1, $$cr),
            () => this.matchrecursive_21($$dpth + 1, $$cr),
            () => this.matchrecursive_22($$dpth + 1, $$cr),
            () => this.matchrecursive_23($$dpth + 1, $$cr),
            () => this.matchrecursive_24($$dpth + 1, $$cr),
            () => this.matchrecursive_25($$dpth + 1, $$cr),
            () => this.matchrecursive_26($$dpth + 1, $$cr),
            () => this.matchrecursive_27($$dpth + 1, $$cr),
            () => this.matchrecursive_28($$dpth + 1, $$cr),
            () => this.matchrecursive_29($$dpth + 1, $$cr),
            () => this.matchrecursive_30($$dpth + 1, $$cr),
            () => this.matchrecursive_31($$dpth + 1, $$cr),
            () => this.matchrecursive_32($$dpth + 1, $$cr),
        ]);
    }
    matchrecursive_1($$dpth, $$cr) {
        return this.matchTkNumber($$dpth + 1, $$cr);
    }
    matchrecursive_2($$dpth, $$cr) {
        return this.matchTkFalse($$dpth + 1, $$cr);
    }
    matchrecursive_3($$dpth, $$cr) {
        return this.matchTkTrue($$dpth + 1, $$cr);
    }
    matchrecursive_4($$dpth, $$cr) {
        return this.matchTkNum($$dpth + 1, $$cr);
    }
    matchrecursive_5($$dpth, $$cr) {
        return this.matchTkBool($$dpth + 1, $$cr);
    }
    matchrecursive_6($$dpth, $$cr) {
        return this.matchTkId($$dpth + 1, $$cr);
    }
    matchrecursive_7($$dpth, $$cr) {
        return this.matchTkAssign($$dpth + 1, $$cr);
    }
    matchrecursive_8($$dpth, $$cr) {
        return this.matchTkColon($$dpth + 1, $$cr);
    }
    matchrecursive_9($$dpth, $$cr) {
        return this.matchTkSemicolon($$dpth + 1, $$cr);
    }
    matchrecursive_10($$dpth, $$cr) {
        return this.matchTkComma($$dpth + 1, $$cr);
    }
    matchrecursive_11($$dpth, $$cr) {
        return this.matchTkQuote($$dpth + 1, $$cr);
    }
    matchrecursive_12($$dpth, $$cr) {
        return this.matchTkNot($$dpth + 1, $$cr);
    }
    matchrecursive_13($$dpth, $$cr) {
        return this.matchTkOpenPar($$dpth + 1, $$cr);
    }
    matchrecursive_14($$dpth, $$cr) {
        return this.matchTkClosePar($$dpth + 1, $$cr);
    }
    matchrecursive_15($$dpth, $$cr) {
        return this.matchTkOpenBracket($$dpth + 1, $$cr);
    }
    matchrecursive_16($$dpth, $$cr) {
        return this.matchTkCloseBracket($$dpth + 1, $$cr);
    }
    matchrecursive_17($$dpth, $$cr) {
        return this.matchTkOpenBrace($$dpth + 1, $$cr);
    }
    matchrecursive_18($$dpth, $$cr) {
        return this.matchTkCloseBrace($$dpth + 1, $$cr);
    }
    matchrecursive_19($$dpth, $$cr) {
        return this.matchTkOr($$dpth + 1, $$cr);
    }
    matchrecursive_20($$dpth, $$cr) {
        return this.matchTkAnd($$dpth + 1, $$cr);
    }
    matchrecursive_21($$dpth, $$cr) {
        return this.matchTkPower($$dpth + 1, $$cr);
    }
    matchrecursive_22($$dpth, $$cr) {
        return this.matchTkDiv($$dpth + 1, $$cr);
    }
    matchrecursive_23($$dpth, $$cr) {
        return this.matchTkPlus($$dpth + 1, $$cr);
    }
    matchrecursive_24($$dpth, $$cr) {
        return this.matchTkMult($$dpth + 1, $$cr);
    }
    matchrecursive_25($$dpth, $$cr) {
        return this.matchTkMod($$dpth + 1, $$cr);
    }
    matchrecursive_26($$dpth, $$cr) {
        return this.matchTkMinus($$dpth + 1, $$cr);
    }
    matchrecursive_27($$dpth, $$cr) {
        return this.matchTkLE($$dpth + 1, $$cr);
    }
    matchrecursive_28($$dpth, $$cr) {
        return this.matchTkLT($$dpth + 1, $$cr);
    }
    matchrecursive_29($$dpth, $$cr) {
        return this.matchTkGE($$dpth + 1, $$cr);
    }
    matchrecursive_30($$dpth, $$cr) {
        return this.matchTkGT($$dpth + 1, $$cr);
    }
    matchrecursive_31($$dpth, $$cr) {
        return this.matchTkEQ($$dpth + 1, $$cr);
    }
    matchrecursive_32($$dpth, $$cr) {
        return this.matchTkNE($$dpth + 1, $$cr);
    }
    matchTkNumber($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:-?[0-9]+(?:\.[0-9]+)?)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkNumber, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkNum($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:num)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkNum, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkBool($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:bool)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkBool, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkFalse($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:false)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkFalse, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkTrue($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:true)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkTrue, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkId($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\b([a-zA-Z_][^\s\W]*))`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkId, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkPlus($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\+)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkPlus, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkMult($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\*)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkMult, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkOpenPar($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkOpenPar, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkClosePar($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkClosePar, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkOpenBracket($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\[)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkOpenBracket, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkCloseBracket($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\])`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkCloseBracket, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkOpenBrace($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\{)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkOpenBrace, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkCloseBrace($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\})`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkCloseBrace, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkNot($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\!)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkNot, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkPower($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\^)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkPower, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkDiv($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\/)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkDiv, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkMod($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\%)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkMod, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkMinus($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\-)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkMinus, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkLT($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\<)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkLT, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkLE($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\<=)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkLE, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkGE($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\>=)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkGE, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkGT($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\>)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkGT, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkEQ($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\=)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkEQ, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkNE($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\<>)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkNE, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkAnd($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\&\&)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkAnd, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkOr($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\|\|)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkOr, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkQuote($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\')`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkQuote, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkComma($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\,)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkComma, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkSemicolon($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\;)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkSemicolon, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkColon($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\:)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkColon, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchTkAssign($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $scope$next;
            let $$res = null;
            if (true
                && this.loop(() => this.matchspace($$dpth + 1, $$cr), true) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:\:=)`, $$dpth + 1, $$cr)) !== null
                && ($scope$next = this.loop(() => this.matchrecursive($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.TkAssign, value: $scope$value, next: $scope$next };
            }
            return $$res;
        });
    }
    matchspace($$dpth, $$cr) {
        return this.choice([
            () => this.matchspace_1($$dpth + 1, $$cr),
            () => this.matchspace_2($$dpth + 1, $$cr),
            () => this.matchspace_3($$dpth + 1, $$cr),
            () => this.matchspace_4($$dpth + 1, $$cr),
            () => this.matchspace_5($$dpth + 1, $$cr),
        ]);
    }
    matchspace_1($$dpth, $$cr) {
        return this.regexAccept(String.raw `(?: )`, $$dpth + 1, $$cr);
    }
    matchspace_2($$dpth, $$cr) {
        return this.regexAccept(String.raw `(?:\\t)`, $$dpth + 1, $$cr);
    }
    matchspace_3($$dpth, $$cr) {
        return this.regexAccept(String.raw `(?:\n)`, $$dpth + 1, $$cr);
    }
    matchspace_4($$dpth, $$cr) {
        return this.regexAccept(String.raw `(?:\r\n)`, $$dpth + 1, $$cr);
    }
    matchspace_5($$dpth, $$cr) {
        return this.regexAccept(String.raw `(?:[" "]+)`, $$dpth + 1, $$cr);
    }
    test() {
        const mrk = this.mark();
        const res = this.matchstart(0);
        const ans = res !== null;
        this.reset(mrk);
        return ans;
    }
    parse() {
        const mrk = this.mark();
        const res = this.matchstart(0);
        if (res)
            return { ast: res, errs: [] };
        this.reset(mrk);
        const rec = new ErrorTracker();
        this.clearMemos();
        this.matchstart(0, rec);
        const err = rec.getErr();
        return { ast: res, errs: err !== null ? [err] : [] };
    }
    mark() {
        return this.pos;
    }
    loop(func, star = false) {
        const mrk = this.mark();
        const res = [];
        for (;;) {
            const t = func();
            if (t === null) {
                break;
            }
            res.push(t);
        }
        if (star || res.length > 0) {
            return res;
        }
        this.reset(mrk);
        return null;
    }
    run($$dpth, fn) {
        const mrk = this.mark();
        const res = fn();
        if (res !== null)
            return res;
        this.reset(mrk);
        return null;
    }
    choice(fns) {
        for (const f of fns) {
            const res = f();
            if (res !== null) {
                return res;
            }
        }
        return null;
    }
    regexAccept(match, dpth, cr) {
        return this.run(dpth, () => {
            const reg = new RegExp(match, "y");
            const mrk = this.mark();
            reg.lastIndex = mrk.overallPos;
            const res = this.tryConsume(reg);
            if (cr) {
                cr.record(mrk, res, {
                    kind: "RegexMatch",
                    // We substring from 3 to len - 1 to strip off the
                    // non-capture group syntax added as a WebKit workaround
                    literal: match.substring(3, match.length - 1),
                    negated: this.negating,
                });
            }
            return res;
        });
    }
    tryConsume(reg) {
        const res = reg.exec(this.input);
        if (res) {
            let lineJmp = 0;
            let lind = -1;
            for (let i = 0; i < res[0].length; ++i) {
                if (res[0][i] === "\n") {
                    ++lineJmp;
                    lind = i;
                }
            }
            this.pos = {
                overallPos: reg.lastIndex,
                line: this.pos.line + lineJmp,
                offset: lind === -1 ? this.pos.offset + res[0].length : (res[0].length - lind - 1)
            };
            return res[0];
        }
        return null;
    }
    noConsume(fn) {
        const mrk = this.mark();
        const res = fn();
        this.reset(mrk);
        return res;
    }
    negate(fn) {
        const mrk = this.mark();
        const oneg = this.negating;
        this.negating = !oneg;
        const res = fn();
        this.negating = oneg;
        this.reset(mrk);
        return res === null ? true : null;
    }
    memoise(rule, memo) {
        const $scope$pos = this.mark();
        const $scope$memoRes = memo.get($scope$pos.overallPos);
        if (this.memoSafe && $scope$memoRes !== undefined) {
            this.reset($scope$memoRes[1]);
            return $scope$memoRes[0];
        }
        const $scope$result = rule();
        if (this.memoSafe)
            memo.set($scope$pos.overallPos, [$scope$result, this.mark()]);
        return $scope$result;
    }
    match$EOF(et) {
        const res = this.finished() ? { kind: ASTKinds.$EOF } : null;
        if (et)
            et.record(this.mark(), res, { kind: "EOF", negated: this.negating });
        return res;
    }
}
exports.Parser = Parser;
function parse(s) {
    const p = new Parser(s);
    return p.parse();
}
exports.parse = parse;
class SyntaxErr {
    constructor(pos, expmatches) {
        this.pos = pos;
        this.expmatches = [...expmatches];
    }
    toString() {
        return `Syntax Error at line ${this.pos.line}:${this.pos.offset}. Expected one of ${this.expmatches.map(x => x.kind === "EOF" ? " EOF" : ` ${x.negated ? 'not ' : ''}'${x.literal}'`)}`;
    }
}
exports.SyntaxErr = SyntaxErr;
class ErrorTracker {
    constructor() {
        this.mxpos = { overallPos: -1, line: -1, offset: -1 };
        this.regexset = new Set();
        this.pmatches = [];
    }
    record(pos, result, att) {
        if ((result === null) === att.negated)
            return;
        if (pos.overallPos > this.mxpos.overallPos) {
            this.mxpos = pos;
            this.pmatches = [];
            this.regexset.clear();
        }
        if (this.mxpos.overallPos === pos.overallPos) {
            if (att.kind === "RegexMatch") {
                if (!this.regexset.has(att.literal))
                    this.pmatches.push(att);
                this.regexset.add(att.literal);
            }
            else {
                this.pmatches.push(att);
            }
        }
    }
    getErr() {
        if (this.mxpos.overallPos !== -1)
            return new SyntaxErr(this.mxpos, this.pmatches);
        return null;
    }
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dialogflow_1 = __importDefault(require("@bottender/dialogflow"));
const bottender_1 = require("bottender");
const router_1 = require("bottender/router");
const SortDemaeFromDialogflow = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    console.log(context, props);
    if (props.intent.displayName === 'demae-order-regist-address') {
        console.log((_c = (_b = props === null || props === void 0 ? void 0 : props.parameters) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c.location[(_f = (_e = (_d = props === null || props === void 0 ? void 0 : props.parameters) === null || _d === void 0 ? void 0 : _d.fields) === null || _e === void 0 ? void 0 : _e.location) === null || _f === void 0 ? void 0 : _f.kind]);
        context.setState({
            params: Object.assign(Object.assign({}, context.state.params), { location: (_h = (_g = props === null || props === void 0 ? void 0 : props.parameters) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h.location[(_l = (_k = (_j = props === null || props === void 0 ? void 0 : props.parameters) === null || _j === void 0 ? void 0 : _j.fields) === null || _k === void 0 ? void 0 : _k.location) === null || _l === void 0 ? void 0 : _l.kind] }),
        });
        return SayAddressAndRequestConfirm(context, props);
    }
    else if (props.intent.displayName === 'demae-order-select-menu') {
        context.setState({
            params: Object.assign(Object.assign({}, context.state.params), { menu: (_o = (_m = props === null || props === void 0 ? void 0 : props.parameters) === null || _m === void 0 ? void 0 : _m.fields) === null || _o === void 0 ? void 0 : _o.menu[(_r = (_q = (_p = props === null || props === void 0 ? void 0 : props.parameters) === null || _p === void 0 ? void 0 : _p.fields) === null || _q === void 0 ? void 0 : _q.menu) === null || _r === void 0 ? void 0 : _r.kind] }),
        });
        return SayDemaeMenuAndRequestAddress(context, props);
    }
    else {
        return SayDemaeReceivedAndRequestMenu(context, props);
    }
});
const SortDemaeFromPlainText = () => __awaiter(void 0, void 0, void 0, function* () { });
const SayDemaeReceivedAndRequestMenu = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText(`あいよ！出前ね！`);
    yield context.sendText(`何にしましょ？`);
});
const SayDemaeMenuAndRequestAddress = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    yield context.sendText(`あいよ！${((_s = context.state) === null || _s === void 0 ? void 0 : _s.params).menu}ね！`);
    yield context.sendText(`どちらにお届けしましょ？`);
});
const SayAddressAndRequestConfirm = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _t;
    yield context.sendText(`あいよ！${((_t = context.state) === null || _t === void 0 ? void 0 : _t.params).location.fields['street-address'].stringValue}ね！`);
    yield context.sendText(`承りました！！`);
});
const Unknown = (context) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText('Sorry.');
});
const moveTo = (mode, action) => {
    return router_1.route((context) => context.state.mode === mode, action);
};
const RuleBased = (context, { next }) => {
    if (!next) {
        return router_1.router([]);
    }
    return router_1.router([router_1.route('*', next)]);
};
const Dialogflow = dialogflow_1.default({
    projectId: (_a = process.env.GOOGLE_APPLICATION_PROJECT_ID) !== null && _a !== void 0 ? _a : '',
    languageCode: 'ja',
    actions: {
        'demae-order': SortDemaeFromDialogflow,
        'demae-order-select-menu': SortDemaeFromDialogflow,
        'demae-order-regist-address': SortDemaeFromDialogflow,
    },
});
function App(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return bottender_1.chain([RuleBased, Dialogflow, Unknown]);
    });
}
exports.default = App;

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
const SayDemaeReceivedAndRequestMenu = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    context.setState({
        params: Object.assign(Object.assign({}, context.state.params), { orders: [] }),
    });
    yield context.sendText(`あいよ！出前ね！`);
    yield context.sendText(`何にしましょ？`);
});
const SayErrorAndRequestMenu = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText(`ごめん！もう一度お願い！`);
    yield context.sendText(`ご注文は？`);
});
const SayDemaeMenuAndRequestQuantity = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g;
    context.setState({
        params: Object.assign(Object.assign({}, context.state.params), { menu: (_c = (_b = props === null || props === void 0 ? void 0 : props.parameters) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c.menu[(_f = (_e = (_d = props === null || props === void 0 ? void 0 : props.parameters) === null || _d === void 0 ? void 0 : _d.fields) === null || _e === void 0 ? void 0 : _e.menu) === null || _f === void 0 ? void 0 : _f.kind] }),
    });
    yield context.sendText(`あいよ！${((_g = context.state) === null || _g === void 0 ? void 0 : _g.params).menu}ね！`);
    yield context.sendText(`何人前お届けしましょ？`);
});
const SayErrorAndRequestQuantity = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText(`ごめん！もう一度お願い！`);
    yield context.sendText(`何人前お届けしましょ？`);
});
const SayDemaeQuantityAndRequestOtherOrder = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m;
    context.setState({
        params: Object.assign(Object.assign({}, context.state.params), { quantity: (_j = (_h = props === null || props === void 0 ? void 0 : props.parameters) === null || _h === void 0 ? void 0 : _h.fields) === null || _j === void 0 ? void 0 : _j.number[(_m = (_l = (_k = props === null || props === void 0 ? void 0 : props.parameters) === null || _k === void 0 ? void 0 : _k.fields) === null || _l === void 0 ? void 0 : _l.number) === null || _m === void 0 ? void 0 : _m.kind] }),
    });
    const currentOrders = context.state.params.orders;
    const orders = [...currentOrders];
    orders.push({
        menu: context.state.params.menu,
        quantity: context.state.params.quantity,
    });
    context.setState({
        params: Object.assign(Object.assign({}, context.state.params), { orders }),
    });
    yield context.sendText(`あいよ！${context.state.params.menu}を${context.state.params.quantity}人前ェ～！`);
    yield context.sendText(`ほかにご注文は？`);
});
const SayErrorAndRequestOtherOrder = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText(`ごめん！もう一度お願い！`);
    yield context.sendText(`ほかにご注文は？`);
});
const SayDemaeOrderAndRequestConfirm = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText(context.state.params.orders
        .map((o) => `${o.menu} ${o.quantity}人前`)
        .join('\n'));
    yield context.sendConfirmTemplate(`注文の確認`, {
        text: `ご注文は以上で？`,
        actions: [
            {
                type: 'message',
                label: 'はい',
                text: 'はい',
            },
            {
                type: 'message',
                label: 'いいえ',
                text: 'いいえ',
            },
        ],
    }, {});
});
const SayAddressAndRequestConfirm = (context, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p, _q, _r, _s, _t;
    context.setState({
        params: Object.assign(Object.assign({}, context.state.params), { location: (_p = (_o = props === null || props === void 0 ? void 0 : props.parameters) === null || _o === void 0 ? void 0 : _o.fields) === null || _p === void 0 ? void 0 : _p.location[(_s = (_r = (_q = props === null || props === void 0 ? void 0 : props.parameters) === null || _q === void 0 ? void 0 : _q.fields) === null || _r === void 0 ? void 0 : _r.location) === null || _s === void 0 ? void 0 : _s.kind] }),
    });
    yield context.sendText(`あいよ！${((_t = context.state) === null || _t === void 0 ? void 0 : _t.params).location.fields['street-address'].stringValue}ね！`);
    yield context.sendText(`承りました！！`);
});
const Unknown = (context) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.sendText('Sorry.');
});
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
        'demae-order': SayDemaeReceivedAndRequestMenu,
        'demae-order-fallback': SayErrorAndRequestMenu,
        'demae-order-with-menu': SayDemaeMenuAndRequestQuantity,
        'demae-order-select-menu': SayDemaeMenuAndRequestQuantity,
        'demae-order-select-menu-fallback': SayErrorAndRequestQuantity,
        'demae-order-select-quantity': SayDemaeQuantityAndRequestOtherOrder,
        'demae-order-select-quantity-fallback': SayErrorAndRequestOtherOrder,
        'demae-order-finish-order': SayDemaeOrderAndRequestConfirm,
        'demae-order-regist-address': SayAddressAndRequestConfirm,
    },
});
function App(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return bottender_1.chain([RuleBased, Dialogflow, Unknown]);
    });
}
exports.default = App;

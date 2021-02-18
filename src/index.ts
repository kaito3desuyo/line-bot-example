import dialogflow from '@bottender/dialogflow';
import { Action, chain, LineContext } from 'bottender';
import { AnyContext, Props } from 'bottender/dist/types';
import { route, router } from 'bottender/router';
import { QueryResult } from 'dialogflow';

const SayDemaeReceivedAndRequestMenu: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    context.setState({
        params: {
            ...context.state.params,
            orders: [],
        },
    });
    await context.sendText(`あいよ！出前ね！`);
    await context.sendText(`何にしましょ？`);
};

const SayErrorAndRequestMenu: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    await context.sendText(`ごめん！もう一度お願い！`);
    await context.sendText(`ご注文は？`);
};

const SayDemaeMenuAndRequestQuantity: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    context.setState({
        params: {
            ...context.state.params,
            menu:
                props?.parameters?.fields?.menu[
                    props?.parameters?.fields?.menu?.kind
                ],
        },
    });
    await context.sendText(
        `あいよ！${(context.state?.params as { menu: string }).menu}ね！`
    );
    await context.sendText(`何人前お届けしましょ？`);
};

const SayErrorAndRequestQuantity: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    await context.sendText(`ごめん！もう一度お願い！`);
    await context.sendText(`何人前お届けしましょ？`);
};

const SayDemaeQuantityAndRequestOtherOrder: Action<
    LineContext,
    QueryResult
> = async (context: LineContext, props?: QueryResult) => {
    context.setState({
        params: {
            ...context.state.params,
            quantity:
                props?.parameters?.fields?.number[
                    props?.parameters?.fields?.number?.kind
                ],
        },
    });

    const currentOrders = context.state.params.orders;
    const orders = [...currentOrders];
    orders.push({
        menu: context.state.params.menu,
        quantity: context.state.params.quantity,
    });

    context.setState({
        params: {
            ...context.state.params,
            orders,
        },
    });

    await context.sendText(
        `あいよ！${context.state.params.menu}を${context.state.params.quantity}人前ェ～！`
    );
    await context.sendText(`ほかにご注文は？`);
};

const SayErrorAndRequestOtherOrder: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    await context.sendText(`ごめん！もう一度お願い！`);
    await context.sendText(`ほかにご注文は？`);
};

const SayDemaeOrderAndRequestConfirm: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    await context.sendText(
        context.state.params.orders
            .map(
                (o: { menu: string; quantity: number }) =>
                    `${o.menu} ${o.quantity}人前`
            )
            .join('\n')
    );
    await context.sendConfirmTemplate(
        `注文の確認`,
        {
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
        },
        {}
    );
};

const SayAddressAndRequestConfirm: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    context.setState({
        params: {
            ...context.state.params,
            location:
                props?.parameters?.fields?.location[
                    props?.parameters?.fields?.location?.kind
                ],
        },
    });
    await context.sendText(
        `あいよ！${
            (context.state?.params as {
                location: {
                    fields: { 'street-address': { stringValue: string } };
                };
            }).location.fields['street-address'].stringValue
        }ね！`
    );
    await context.sendText(`承りました！！`);
};

const Unknown: Action<LineContext> = async (context: LineContext) => {
    await context.sendText('Sorry.');
};

const RuleBased = (context: AnyContext, { next }: Props<AnyContext>) => {
    if (!next) {
        return router([]);
    }
    return router([route('*', next)]);
};

const Dialogflow = dialogflow({
    projectId: process.env.GOOGLE_APPLICATION_PROJECT_ID ?? '',
    languageCode: 'ja',
    actions: {
        'demae-order': SayDemaeReceivedAndRequestMenu as Action<AnyContext>,
        'demae-order-fallback': SayErrorAndRequestMenu as Action<AnyContext>,
        'demae-order-with-menu': SayDemaeMenuAndRequestQuantity as Action<AnyContext>,
        'demae-order-select-menu': SayDemaeMenuAndRequestQuantity as Action<AnyContext>,
        'demae-order-select-menu-fallback': SayErrorAndRequestQuantity as Action<AnyContext>,
        'demae-order-select-quantity': SayDemaeQuantityAndRequestOtherOrder as Action<AnyContext>,
        'demae-order-select-quantity-fallback': SayErrorAndRequestOtherOrder as Action<AnyContext>,
        'demae-order-finish-order': SayDemaeOrderAndRequestConfirm as Action<AnyContext>,
        'demae-order-regist-address': SayAddressAndRequestConfirm as Action<AnyContext>,
    },
});

export default async function App(
    context: LineContext
): Promise<Action<LineContext> | void> {
    return chain([RuleBased, Dialogflow, Unknown]);
}

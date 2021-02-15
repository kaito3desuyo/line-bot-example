import dialogflow from '@bottender/dialogflow';
import { Action, chain, Context, LineContext } from 'bottender';
import { AnyContext, Props } from 'bottender/dist/types';
import { route, router } from 'bottender/router';
import { QueryResult } from 'dialogflow';

const SortDemaeFromDialogflow: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props: QueryResult
) => {
    console.log(context, props);

    if (props.intent.displayName === 'demae-order-regist-address') {
        console.log(
            props?.parameters?.fields?.location[
                props?.parameters?.fields?.location?.kind
            ]
        );
        context.setState({
            params: {
                ...context.state.params,
                location:
                    props?.parameters?.fields?.location[
                        props?.parameters?.fields?.location?.kind
                    ],
            },
        });
        return SayAddressAndRequestConfirm(context, props);
    } else if (props.intent.displayName === 'demae-order-select-menu') {
        context.setState({
            params: {
                ...context.state.params,
                menu:
                    props?.parameters?.fields?.menu[
                        props?.parameters?.fields?.menu?.kind
                    ],
            },
        });
        return SayDemaeMenuAndRequestAddress(context, props);
    } else {
        return SayDemaeReceivedAndRequestMenu(context, props);
    }
};

const SortDemaeFromPlainText: Action<LineContext> = async () => {};

const SayDemaeReceivedAndRequestMenu: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    await context.sendText(`あいよ！出前ね！`);
    await context.sendText(`何にしましょ？`);
};

const SayDemaeMenuAndRequestAddress: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
    await context.sendText(
        `あいよ！${(context.state?.params as { menu: string }).menu}ね！`
    );
    await context.sendText(`どちらにお届けしましょ？`);
};

const SayAddressAndRequestConfirm: Action<LineContext, QueryResult> = async (
    context: LineContext,
    props?: QueryResult
) => {
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

const moveTo = (mode: string, action: Action<AnyContext>) => {
    return route((context) => context.state.mode === mode, action);
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
        'demae-order': SortDemaeFromDialogflow as Action<AnyContext>,
        'demae-order-select-menu': SortDemaeFromDialogflow as Action<AnyContext>,
        'demae-order-regist-address': SortDemaeFromDialogflow as Action<AnyContext>,
    },
});

export default async function App(
    context: LineContext
): Promise<Action<LineContext> | void> {
    return chain([RuleBased, Dialogflow, Unknown]);
}

import { Action, LineContext } from 'bottender';

export default async function App(
    context: LineContext
): Promise<Action<LineContext> | void> {
    console.log(context);
    await context.sendText('Welcome to Bottender');
}

const DynamoDBSessionStore = require('./dynamodb.store');

module.exports = {
    session: {
        driver: process.env.IS_GCP ? 'dynamodb' : 'memory',
        stores: {
            memory: {
                maxSize: 500,
            },
            file: {
                dirname: '.sessions',
            },
            redis: {
                port: 6379,
                host: '127.0.0.1',
                password: 'auth',
                db: 0,
            },
            mongo: {
                url: 'mongodb://localhost:27017',
                collectionName: 'sessions',
            },
            dynamodb: new DynamoDBSessionStore({
                accessToken: process.env.AWS_IAM_ACCESS_TOKEN,
                secretToken: process.env.AWS_IAM_SECRET_TOKEN,
                region: 'ap-northeast-1',
                tableName: 'line-bot-example-session',
            }),
        },
    },
    initialState: {
        count: 0,
        mode: '',
        params: {},
    },
    channels: {
        messenger: {
            enabled: false,
            path: '/webhooks/messenger',
            pageId: process.env.MESSENGER_PAGE_ID,
            accessToken: process.env.MESSENGER_ACCESS_TOKEN,
            appId: process.env.MESSENGER_APP_ID,
            appSecret: process.env.MESSENGER_APP_SECRET,
            verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
        },
        whatsapp: {
            enabled: false,
            path: '/webhooks/whatsapp',
            accountSid: process.env.WHATSAPP_ACCOUNT_SID,
            authToken: process.env.WHATSAPP_AUTH_TOKEN,
            phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
        },
        line: {
            enabled: true,
            path: '/webhooks/line',
            accessToken: process.env.LINE_ACCESS_TOKEN,
            channelSecret: process.env.LINE_CHANNEL_SECRET,
        },
        telegram: {
            enabled: false,
            path: '/webhooks/telegram',
            accessToken: process.env.TELEGRAM_ACCESS_TOKEN,
        },
        slack: {
            enabled: false,
            path: '/webhooks/slack',
            accessToken: process.env.SLACK_ACCESS_TOKEN,
            signingSecret: process.env.SLACK_SIGNING_SECRET,
        },
        viber: {
            enabled: false,
            path: '/webhooks/viber',
            accessToken: process.env.VIBER_ACCESS_TOKEN,
            sender: {
                name: 'xxxx',
            },
        },
    },
};

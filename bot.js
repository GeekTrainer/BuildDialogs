const builder = require('botbuilder');

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector, [
    (session, args, next) => {
        const botName = 'Build Dialogs Bot';
        const description = `A sample bot to demonstrate dialog management`;

        session.send(`Hi there! I'm ${botName}`);
        session.send(`In a nutshell, here's what I can do:\n\n${description}`);

        builder.Prompts.text(session, `What's your name?`);
    },
    (session, results, next) => {
        session.endConversation(`Welcome, ${results.response}`);
    }
]);

bot.dialog('help', (session) => {
    session.endDialog('This is a simple demo bot for a sample conference.');
}).triggerAction({
    matches: /help/i,
    onSelectAction: (session, args) => {
        session.beginDialog(args.action, args);
    }
});

bot.dialog('register', [
    (session, args, next) => {
        session.beginDialog('getAttendeeInfo');
        // pass control to getAttendeeInfo
        // when new dialog completes, returns control to here
    },
    (session, results, next) => {
        session.endConversation(`You said: ${results.response}`);
    },
]).triggerAction({matches: /register/i});

bot.dialog('getAttendeeInfo', [
    (session, args, next) => {
        builder.Prompts.text(session, `Do you have any dietary restrictions?`);
    },
    (session, results, next) => {
        console.log(session.dialogStack());
        const dietary = results.response;
        session.endDialogWithResult({response: dietary});
    },
]);

module.exports = bot;
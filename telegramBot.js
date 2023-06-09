import {Bot, InlineKeyboard} from "grammy";
import dotenv from 'dotenv';
import {ConversationManager} from "./conversationManager.js"; // path to your ConversationManager class

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

const conversationManager = new ConversationManager(process.env.OPENAI_API_KEY);

const designPatternsKeyboard = new InlineKeyboard()
    .text('Abstract Factory', 'Abstract Factory')
    .text('Builder', 'Builder')
    .row()
    .text('Factory Method', 'Factory Method')
    .text('Prototype', 'Prototype')
    .text('Singleton', 'Singleton')
    .row()
    .text('Adapter', 'Adapter')
    .text('Bridge', 'Bridge')
    .text('Composite', 'Composite')
    .row()
    .text('Decorator', 'Decorator')
    .text('Facade', 'Facade')
    .text('Flyweight', 'Flyweight')
    .row()
    .text('Proxy', 'Proxy')
    .text('Chain of Resp.', 'Chain of Resp.')
    .text('Command', 'Command')
    .row()
    .text('Interpreter', 'Interpreter')
    .text('Iterator', 'Iterator')
    .text('Mediator', 'Mediator')
    .row()
    .text('Memento', 'Memento')
    .text('Observer', 'Observer')
    .text('State', 'State')
    .row()
    .text('Strategy', 'Strategy')
    .text('Template Method', 'Template Method')
    .text('VISITOR', 'VISITOR');

const explorePracticeKeyboard = new InlineKeyboard()
    .text('Explore more', 'Explore more')
    .text('Practice', 'Practice');

let currentPattern = '';

const afterExplanationKeyboard = new InlineKeyboard()
    .text('Say more', 'Say more')
    .text('That\'s good', 'That\'s good');

const practiceKeyboard = new InlineKeyboard()
    .text('Code Practice', 'Code Practice')
    .text('Concept Q&A', 'Concept Q&A');

bot.on('callback_query:data', async (ctx) => {
    const userAction = ctx.callbackQuery.data;

    if (userAction === '/patterns') {
        return ctx.reply('Choose a Design Pattern:', {reply_markup: designPatternsKeyboard});
    }

    if (userAction === 'Explore more') {
        const loadingMsg = await ctx.reply('Fetching more information...');
        const moreDetailedPrompt = `Can you provide more details about the ${currentPattern} design pattern?`;
        const response = await conversationManager.sendMessage(moreDetailedPrompt);
        await ctx.api.editMessageText(ctx.chat.id, loadingMsg.message_id, response.response, {reply_markup: afterExplanationKeyboard});
    } else if (userAction === 'Practice') {
        return ctx.reply('Choose a Practice method:', {reply_markup: practiceKeyboard});
    } else if (userAction === 'Code Practice') {
        return ctx.reply('This feature will be implemented soon.');
    } else if (userAction === 'Concept Q&A') {
        const questionPrompt = `Please ask a single, clear question about the ${currentPattern} pattern. We'll do our best to provide a detailed answer. Remember to keep your question specific to the concept of the pattern.`;
        const response = await conversationManager.sendMessage(questionPrompt);
        return ctx.reply(response.response);
    } else if (userAction === 'Say more') {
        const loadingMsg = await ctx.reply('Fetching real world examples...');
        const examplePrompt = `Can you give me some real world examples of the ${currentPattern} design pattern?`;
        const response = await conversationManager.sendMessage(examplePrompt);
        await ctx.api.editMessageText(ctx.chat.id, loadingMsg.message_id, response.response, {reply_markup: afterExplanationKeyboard});
    } else if (userAction === 'That\'s good') {
        return ctx.reply('Choose another Design Pattern:', {reply_markup: designPatternsKeyboard});
    } else {
        currentPattern = userAction;
        const loadingMsg = await ctx.reply('Generating message...');
        const response = await conversationManager.sendMessage(userAction);
        await ctx.api.editMessageText(ctx.chat.id, loadingMsg.message_id, response.response, {reply_markup: explorePracticeKeyboard});
    }
});

bot.on("message", async (ctx) => {
    const userMessage = ctx.message.text;
    if (userMessage === '/patterns') {
        await ctx.reply('Choose a Design Pattern:', {reply_markup: designPatternsKeyboard});
    } else {
        const loadingMsg = await ctx.reply('Generating answer...');
        const response = await conversationManager.sendMessage(userMessage);
        await ctx.api.editMessageText(ctx.chat.id, loadingMsg.message_id, response.response);
    }
});

bot.catch((err) => {
    console.error('An error occurred while handling an update:', err);
});

bot.start((ctx) => {
    console.log("Received /start command");
    const startKeyboard = new InlineKeyboard()
        .text('Patterns', '/patterns');
    return ctx.reply('Welcome to the bot! Use the button below to get started.', {reply_markup: startKeyboard});
});




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

bot.command('patterns', (ctx) => {
    return ctx.reply('Choose a Design Pattern:', {reply_markup: designPatternsKeyboard});
});

bot.on('callback_query:data', async (ctx) => {
    const userMessage = ctx.callbackQuery.data;
    const loadingMsg = await ctx.reply('Generating message...'); // send a temporary message indicating that a response is being generated
    const response = await conversationManager.sendMessage(userMessage);
    await ctx.api.editMessageText(ctx.chat.id, loadingMsg.message_id, response.response);
});

bot.on("message", async (ctx) => {
    const userMessage = ctx.message.text;
    const loadingMsg = await ctx.reply('Generating message...');
    const response = await conversationManager.sendMessage(userMessage);
    await ctx.api.editMessageText(ctx.chat.id, loadingMsg.message_id, response.response);
});

bot.catch((err) => {
    console.error('An error occurred while handling an update:', err);
});

bot.start();

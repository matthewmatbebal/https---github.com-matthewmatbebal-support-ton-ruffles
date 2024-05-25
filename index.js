require('dotenv').config()


const { Telegraf } = require('telegraf')

const chats = {}

const bot = new Telegraf(process.env.BOT_TOKEN)
//save session by chatId
bot.start((ctx) => {
    const chatId = ctx.chat.id.toString(); // Convert chat id to string
    if (!chats[chatId]) {
        chats[chatId] = {
            // Define initial properties if needed
        };
        console.log(`New chat session started for chat id: ${chatId}`);
    } else {
        console.log(`Session already exists for chat id: ${chatId}`);
    }
    console.log(ctx.message.from)
    console.log(chats)
    ctx.reply('Welcome')
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
        console.log(ctx.message.from)
        ctx.reply('Welcome')
})
bot.launch()
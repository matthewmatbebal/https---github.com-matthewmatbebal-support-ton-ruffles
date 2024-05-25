require('dotenv').config()


const { Telegraf } = require('telegraf')

const chats = {}

const bot = new Telegraf(process.env.BOT_TOKEN)
//save session by chatId
bot.start((ctx) => {
    if(chats[ctx.chat.id]){

    } 
    console.log(ctx.message.from)
    ctx.reply('Welcome')
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
        console.log(ctx.message.from)
        ctx.reply('Welcome')
})
bot.launch()
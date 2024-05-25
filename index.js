require('dotenv').config()


const { Telegraf } = require('telegraf')



const bot = new Telegraf(process.env.BOT_TOKEN)
//save session by chatId
bot.start((ctx) => {
    const userId = ctx.message.from.id;
    if(chats[userId]){
        ctx.reply('Already Exist')
    } else {
        ctx.reply('New comer')
    }
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
        console.log(ctx.message.from)
        ctx.reply('Welcome')
})
bot.launch()
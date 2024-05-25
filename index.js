require("dotenv").config();
const chat = require("./chat");

const { Telegraf } = require("telegraf");

const chats = {};

const bot = new Telegraf(process.env.BOT_TOKEN);
//save session by chatId
bot.start((ctx) => {
  if (chats[ctx.chat.id]) {
  }
  console.log(ctx.message.from); 
  ctx.reply("Welcome");
});
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => {
  ctx.reply("Welcome");
});
bot.on("message", async (ctx) => {
  const result = await chat.send(ctx.update.message.text);
  ctx.reply(result.choices[0].message.content);
});
bot.launch();

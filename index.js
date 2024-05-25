require("dotenv").config();
const chat = require("./chat");

const { Telegraf } = require("telegraf");

const chats = {};

const bot = new Telegraf(process.env.BOT_TOKEN);
//save session by chatId
bot.start((ctx) => {
  if (!chats[ctx.chat.id]) {
    chats[ctx.chat.id] = {
      messages: [
        {
          role: "system",
          content:
            "Давай общаться на русском языке. Используй для информации доку по ссылке https://gitbook.tonraffles.org/ton-raffles/modules/jetton-launchpad/fairlaunch",
        },
      ],
    };
  }
  console.log(ctx.message.from); 
  ctx.reply("Welcome");
});
bot.help((ctx) => ctx.reply("Send me a sticker"));
// bot.on("sticker", (ctx) => ctx.reply("👍"));
// bot.hears("hi", (ctx) => {
//   ctx.reply("Welcome");
// });
bot.on("message", async (ctx) => {
  if (!chats[ctx.chat.id]) {
    chats[ctx.chat.id] = {
      messages: [
        {
          role: "system",
          content: "Давай общаться на русском языке. Об nft ton",
        },
      ],
    };
  }
  chats[ctx.chat.id].messages.push({
    role: "user",
    content: ctx.update.message.text,
  });
  const result = await chat.send(chats[ctx.chat.id].messages);
  chats[ctx.chat.id].messages.push({
    role: "assistant",
    content: result.choices[0].message.content,
  });
  console.log(result);
  ctx.reply(result.choices[0].message.content);
});


bot.launch();

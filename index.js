require("dotenv").config();
const chat = require("./chat");

const { Telegraf, Markup } = require("telegraf");

const links = require("./links.json").map(
  (link) => `https://gitbook.tonraffles.org${link}`
);

const chats = {};

const bot = new Telegraf(process.env.BOT_TOKEN);
//save session by chatId
bot.start((ctx) => {
  if (!chats[ctx.chat.id]) {
    chats[ctx.chat.id] = {
      messages: [
        {
          role: "system",
          content: `Давай общаться на русском языке. Используй для информации доку по ссылкам ${links.join(
            ","
          )}`,
        },
      ],
    };
  }
  console.log(ctx.message.from);
  ctx.reply("Welcome");
});

bot.help((ctx) => {
  const helpMessage = `
  Привет! Я бот. Вот мои команды:
  /help - Помощь
  /menu - Меню
  `;
  ctx.reply(helpMessage);
});

// Команда /menu
bot.command('menu', (ctx) => {
  const menuMessage = `
  Вот мое меню:
  1. /about - Информация о боте
  2. /contact - Контактные данные
  `;
  ctx.reply(menuMessage);
});

// Команда /about
bot.command('about', (ctx) => {
  const aboutMessage = `
  Привет! Я бот. Я помогаю пользователям в общении и отвечаю на вопросы.
  `;
  ctx.reply(aboutMessage);
});

// Команда /contact
bot.command('contact', (ctx) => {
  const contactMessage = `
  Мои контактные данные:
  Email: example@example.com
  Телефон: +1234567890
  `;
  ctx.reply(contactMessage);
});

// Обработка всех сообщений
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
  

  ctx.reply(result.choices[0].message.content, Markup.inlineKeyboard([
    Markup.button.callback('Верно', 'rigth_answer'),
    Markup.button.callback('Неверно', 'wrong_answer'),

  ]));
});

const db = {
  unswers: [],
  prompt: [],
}

async function saveAnswer(question, answer, isRigth) {
  console.log('saved to DB', question, answer, isRigth)
  db.unswers.push({question, answer, isRigth})
  console.log(db.unswers)
}

async function loadAnswers() {
  return db;
}

// Обработка нажатия на кнопку "Получить ответ"
bot.action('rigth_answer', async (ctx) => {
  const messages = chats[ctx.chat.id].messages;
  const question = messages[messages-2];
  const unswer = messages[messages-1];
  await saveAnswer(question, unswer, true);
  ctx.reply("Следующий вопрос");
  //answer to database (right answers)
});
bot.action('wrong_answer', async (ctx) => {
  const messages = chats[ctx.chat.id].messages;

  const question = messages[messages-2];
  const unswer = messages[messages-1];
  await saveAnswer(question, unswer, false);

  chats[ctx.chat.id].messages.push({
    role: "user",
    content: ctx.update.message.text,
  });
  const result = await chat.send(chats[ctx.chat.id].messages);
  chats[ctx.chat.id].messages.push({
    role: "assistant",
    content: result.choices[0].message.content,
  });
  ctx.reply(result.choices[0].message.content);
  //answer to database (wrong answers)
});

bot.launch();

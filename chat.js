const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

async function send(messages) {
  console.log(messages);
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
  });

  return chatCompletion;
}

module.exports = {
  send,
};

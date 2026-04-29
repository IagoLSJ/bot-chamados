const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;

// webhook (sem polling)
const bot = new TelegramBot(token);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    bot.processUpdate(req.body);

    res.status(200).send('ok');
  } else {
    res.status(200).send('Bot ativo 🚀');
  }
};

// lógica do bot
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Bot rodando na Vercel 🚀');
});

bot.on('message', (msg) => {
  if (msg.text === 'oi') {
    bot.sendMessage(msg.chat.id, 'Fala aí 😄');
  }
});
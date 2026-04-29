const TelegramBot = require('node-telegram-bot-api');

// coloque seu token aqui
const token = '8786280171:AAHq54VtV5rX6lGxrc1TA6smGGxlsw2rlqg';

// cria o bot
const bot = new TelegramBot(token, { polling: true });

// comando /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Olá! Seu bot está funcionando 🚀');
});
bot.onText(/\/Iago/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Meu nome é Iago, sou um bot criado para responder mensagens e comandos! 🤖');
});
// responder qualquer mensagem
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (texto === 'oi') {
    bot.sendMessage(chatId, 'Oi! Tudo bem? 😄');
  }
});
import TelegramBot from 'node-telegram-bot-api';
import { setupBot } from '../src/bot';

const token = process.env.TELEGRAM_TOKEN as string;

let bot: TelegramBot;

if (!(global as any).bot) {
  bot = new TelegramBot(token);
  setupBot(bot);
  (global as any).bot = bot;
} else {
  bot = (global as any).bot;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      bot.processUpdate(req.body);
      return res.status(200).send('ok');
    }

    return res.status(200).send('Bot ativo 🚀');
  } catch (err) {
    console.error(err);
    return res.status(500).send('erro');
  }
}
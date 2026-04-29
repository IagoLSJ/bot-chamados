import TelegramBot from 'node-telegram-bot-api';
import { StrategyFactory } from '../src/StrategyFactory';

const token = process.env.TELEGRAM_TOKEN!;

const bot = new TelegramBot(token);

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const update = req.body;

      if (update.message) {
        const msg = update.message;
        const text = msg.text || '';

        const strategy = StrategyFactory.getStrategy(text, msg.chat.id);

        if (strategy) {
          await strategy.execute(bot, msg);
        } else {
          await bot.sendMessage(
            msg.chat.id,
            'Comando não reconhecido. Use /menu'
          );
        }
      }

      if (update.callback_query) {
        const msg = update.callback_query.message;
        const data = update.callback_query.data;

        if (msg && data) {
          const strategy = StrategyFactory.getStrategy(data, msg.chat.id);

          if (strategy) {
            await strategy.execute(bot, msg);
          }
        }
      }

      return res.status(200).send('ok');
    }

    if (req.method === 'GET') {
      return res.status(200).send('Bot ativo 🚀');
    }

    return res.status(405).send('Method Not Allowed');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro interno');
  }
}
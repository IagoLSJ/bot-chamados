import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_TOKEN!;

const bot = new TelegramBot(token);

export default async function handler(req: any, res: any) {
  try {
    // ✅ aceitar POST (Telegram usa POST)
    if (req.method === 'POST') {
      const update = req.body;

      if (update) {
        bot.processUpdate(update);
      }

      return res.status(200).send('ok');
    }

    // ✅ aceitar GET só pra teste no navegador
    if (req.method === 'GET') {
      return res.status(200).send('Bot ativo 🚀');
    }

    // ❌ qualquer outro método → erro
    return res.status(405).send('Method Not Allowed');

  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro interno');
  }
}
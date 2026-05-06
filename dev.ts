import http from 'node:http';
import TelegramBot from 'node-telegram-bot-api';
import { setupBot } from './src/bot';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

if (!token) {
  throw new Error('A variavel TELEGRAM_TOKEN precisa estar configurada.');
}

const bot = new TelegramBot(token, { polling: true });

setupBot(bot);

if (process.env.PORT) {
  const port = Number(process.env.PORT);

  http
    .createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bot ativo');
    })
    .listen(port, '0.0.0.0', () => {
      console.log(`Bot rodando com health check na porta ${port}`);
    });
} else {
  console.log('Bot rodando LOCAL');
}

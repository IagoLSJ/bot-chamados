import http from 'node:http';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { setupBot } from './src/bot';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const port = Number(process.env.PORT || 3000);

if (!token) {
  throw new Error('A variavel TELEGRAM_TOKEN precisa estar configurada.');
}

const bot = new TelegramBot(token, { polling: true });

setupBot(bot);

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Bot ativo');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Bot rodando no Render na porta ${port}`);
});

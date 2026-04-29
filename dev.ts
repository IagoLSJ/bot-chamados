import TelegramBot from 'node-telegram-bot-api';
import { setupBot } from './src/bot';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN as string;

const bot = new TelegramBot(token, { polling: true });

setupBot(bot);

console.log('Bot rodando LOCAL 🚀');
import TelegramBot from 'node-telegram-bot-api';

export interface Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message): void;
}
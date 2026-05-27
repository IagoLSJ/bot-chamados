import { Strategy } from './Strategy';
import TelegramBot from 'node-telegram-bot-api';

export class ExceptionStrategy implements Strategy {
  async execute(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
    await bot.sendMessage(msg.chat.id, 'Opcao invalida. Use /menu para ver as opcoes disponiveis.');
  }
}

import { Strategy } from './Strategy';
import TelegramBot from 'node-telegram-bot-api';

export class HelpStrategy implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    bot.sendMessage(
      msg.chat.id,
      'Use /menu e escolha: cadastrar, alterar, buscar por ID, listar pendentes, gerar relatorio geral ou exportar relatorio com graficos.',
    );
  }
}

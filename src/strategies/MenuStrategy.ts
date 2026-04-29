import { Strategy } from './Strategy';
import TelegramBot from 'node-telegram-bot-api';

export class MenuStrategy implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    bot.sendMessage(msg.chat.id, 'Escolha uma opcao:', {
      reply_markup: {
        keyboard: [
          [{ text: 'Cadastrar Ocorrencia' }],
          [{ text: 'Alterar Ocorrencia' }],
          [{ text: 'Buscar Ocorrencia por ID' }],
          [{ text: 'Listar Ocorrencias Pendentes' }],
          [{ text: 'Relatorio Geral' }],
          [{ text: 'Exportar Relatorio com Graficos' }],
          [{ text: 'Ajuda' }],
        ],
        resize_keyboard: true,
      },
    });
  }
}

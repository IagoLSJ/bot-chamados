import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { formatOccurrence } from './OccurrenceFormatter';
import { OccurrenceStore } from './OccurrenceStore';

export class ListOccurrences implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    const pendingOccurrences = OccurrenceStore.listPending();

    if (pendingOccurrences.length === 0) {
      bot.sendMessage(msg.chat.id, 'Nao existem ocorrencias pendentes no momento.');
      return;
    }

    const message = `Ocorrencias pendentes:\n\n${pendingOccurrences.map(formatOccurrence).join('\n\n')}`;
    bot.sendMessage(msg.chat.id, message);
  }
}

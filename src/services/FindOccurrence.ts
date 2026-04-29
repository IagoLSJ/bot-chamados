import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationStore } from './ConversationStore';
import { formatOccurrence } from './OccurrenceFormatter';
import { OccurrenceStore } from './OccurrenceStore';

export class FindOccurrence implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const session = ConversationStore.get(chatId);

    if (text === 'Cancelar') {
      ConversationStore.clear(chatId);
      bot.sendMessage(chatId, 'Busca cancelada.', { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (!session || session.flow !== 'find') {
      ConversationStore.set(chatId, { flow: 'find', step: 'id' });
      bot.sendMessage(chatId, 'Informe o ID da ocorrencia que deseja buscar:', {
        reply_markup: { keyboard: [[{ text: 'Cancelar' }]], resize_keyboard: true },
      });
      return;
    }

    const occurrenceId = Number(text);

    if (!Number.isInteger(occurrenceId)) {
      bot.sendMessage(chatId, 'Informe um ID valido usando apenas numeros.');
      return;
    }

    const occurrence = OccurrenceStore.findById(occurrenceId);
    ConversationStore.clear(chatId);

    if (!occurrence) {
      bot.sendMessage(chatId, 'Ocorrencia nao encontrada.', { reply_markup: { remove_keyboard: true } });
      return;
    }

    bot.sendMessage(chatId, `Ocorrencia encontrada:\n\n${formatOccurrence(occurrence)}`, {
      reply_markup: { remove_keyboard: true },
    });
  }
}

import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationStore } from './ConversationStore';
import {
  getMunicipalityKeyboard,
  isValidMunicipalityFilter,
  normalizeMunicipalityFilter,
} from './Municipalities';
import { formatOccurrence } from './OccurrenceFormatter';
import { OccurrenceStore } from './OccurrenceStore';

export class ListOccurrences implements Strategy {
  async execute(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const session = ConversationStore.get(chatId);

    if (text === 'Cancelar') {
      ConversationStore.clear(chatId);
      await bot.sendMessage(chatId, 'Listagem cancelada.', { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (!session || session.flow !== 'list') {
      ConversationStore.set(chatId, { flow: 'list', step: 'municipio' });
      await bot.sendMessage(chatId, 'Escolha a cidade para listar as ocorrencias pendentes:', {
        reply_markup: { keyboard: getMunicipalityKeyboard(true), resize_keyboard: true },
      });
      return;
    }

    if (!isValidMunicipalityFilter(text)) {
      await bot.sendMessage(chatId, 'Escolha uma cidade valida.', {
        reply_markup: { keyboard: getMunicipalityKeyboard(true), resize_keyboard: true },
      });
      return;
    }

    const municipio = normalizeMunicipalityFilter(text);
    const pendingOccurrences = municipio
      ? await OccurrenceStore.listPendingByMunicipio(municipio)
      : await OccurrenceStore.listPending();

    if (pendingOccurrences.length === 0) {
      ConversationStore.clear(chatId);
      await bot.sendMessage(chatId, 'Nao existem ocorrencias pendentes para esse filtro.', {
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    ConversationStore.clear(chatId);
    const title = municipio ? `Ocorrencias pendentes em ${municipio}` : 'Ocorrencias pendentes';
    const message = `${title}:\n\n${pendingOccurrences.map(formatOccurrence).join('\n\n')}`;
    await bot.sendMessage(chatId, message, { reply_markup: { remove_keyboard: true } });
  }
}

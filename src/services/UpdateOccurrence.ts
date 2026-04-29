import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationStore } from './ConversationStore';
import { OccurrenceStore } from './OccurrenceStore';

export class UpdateOccurrence implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const session = ConversationStore.get(chatId);

    if (text === 'Cancelar') {
      ConversationStore.clear(chatId);
      bot.sendMessage(chatId, 'Alteracao cancelada.', { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (!session || session.flow !== 'update') {
      ConversationStore.set(chatId, { flow: 'update', step: 'id' });
      bot.sendMessage(chatId, 'Informe o ID da ocorrencia que deseja alterar:', {
        reply_markup: { keyboard: [[{ text: 'Cancelar' }]], resize_keyboard: true },
      });
      return;
    }

    if (session.step === 'id') {
      const occurrenceId = Number(text);
      const occurrence = OccurrenceStore.findById(occurrenceId);

      if (!Number.isInteger(occurrenceId) || !occurrence) {
        bot.sendMessage(chatId, 'ID nao encontrado. Informe um ID valido ou toque em Cancelar.');
        return;
      }

      ConversationStore.set(chatId, { flow: 'update', step: 'field', occurrenceId });
      bot.sendMessage(chatId, `Ocorrencia ${occurrence.id} selecionada. Qual campo deseja alterar?`, {
        reply_markup: {
          keyboard: [...OccurrenceStore.editableFieldLabels().map((label) => [{ text: label }]), [{ text: 'Cancelar' }]],
          resize_keyboard: true,
        },
      });
      return;
    }

    if (session.step === 'field') {
      const field = OccurrenceStore.getEditableField(text);

      if (!field) {
        bot.sendMessage(chatId, 'Escolha um campo da lista ou toque em Cancelar.');
        return;
      }

      ConversationStore.set(chatId, { ...session, step: 'value', field });
      bot.sendMessage(chatId, 'Informe o novo valor:', {
        reply_markup: this.getValueKeyboard(field),
      });
      return;
    }

    if (!session.occurrenceId || !session.field) {
      ConversationStore.clear(chatId);
      bot.sendMessage(chatId, 'Nao consegui continuar a alteracao. Tente novamente pelo menu.');
      return;
    }

    if (session.field === 'equipeNecessaria' && !this.isPositiveInteger(text)) {
      bot.sendMessage(chatId, 'Informe a quantidade de equipes usando apenas numeros.');
      return;
    }

    if (session.field === 'tipoRede' && !['BT', 'MT'].includes(text.toUpperCase())) {
      bot.sendMessage(chatId, 'Escolha BT ou MT.');
      return;
    }

    if (session.field === 'status' && !['Pendente', 'Resolvida'].includes(text)) {
      bot.sendMessage(chatId, 'Escolha Pendente ou Resolvida.');
      return;
    }
    const occurrence = OccurrenceStore.update(session.occurrenceId, session.field, text);
    ConversationStore.clear(chatId);

    bot.sendMessage(
      chatId,
      `Ocorrencia atualizada com sucesso!\n\nID: ${occurrence?.id}\nCSI: ${occurrence?.csi}\nEquipes necessarias: ${occurrence?.equipeNecessaria}`,
      { reply_markup: { remove_keyboard: true } },
    );
  }

  private isPositiveInteger(value: string): boolean {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0;
  }

  private getValueKeyboard(field: string) {
    if (field === 'tipoRede') {
      return { keyboard: [[{ text: 'BT' }, { text: 'MT' }], [{ text: 'Cancelar' }]], resize_keyboard: true };
    }

    if (field === 'status') {
      return { keyboard: [[{ text: 'Pendente' }, { text: 'Resolvida' }], [{ text: 'Cancelar' }]], resize_keyboard: true };
    }

    return { keyboard: [[{ text: 'Cancelar' }]], resize_keyboard: true };
  }
}

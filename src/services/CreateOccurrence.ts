import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationStore, CreateStep } from './ConversationStore';
import { OccurrenceStore } from './OccurrenceStore';

export class CreateOccurrence implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const session = ConversationStore.get(chatId);

    if (text === 'Cancelar') {
      ConversationStore.clear(chatId);
      bot.sendMessage(chatId, 'Cadastro cancelado.', { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (!session || session.flow !== 'create') {
      ConversationStore.set(chatId, { flow: 'create', step: 'csi', data: {} });
      bot.sendMessage(chatId, 'Informe o CSI da ocorrencia:', {
        reply_markup: { keyboard: [[{ text: 'Cancelar' }]], resize_keyboard: true },
      });
      return;
    }

    if (!text) {
      bot.sendMessage(chatId, 'Envie um valor valido ou toque em Cancelar.');
      return;
    }

    if (session.step === 'equipeNecessaria' && !this.isPositiveInteger(text)) {
      bot.sendMessage(chatId, 'Informe a quantidade de equipes usando apenas numeros.');
      return;
    }

    if (session.step === 'tipoRede' && !['BT', 'MT'].includes(text.toUpperCase())) {
      bot.sendMessage(chatId, 'Escolha BT ou MT.', {
        reply_markup: { keyboard: [[{ text: 'BT' }, { text: 'MT' }], [{ text: 'Cancelar' }]], resize_keyboard: true },
      });
      return;
    }

    const nextData = {
      ...session.data,
      [session.step]: session.step === 'equipeNecessaria' ? Number(text) : text,
    };

    if (session.step === 'observacoes') {
      const occurrence = OccurrenceStore.create({
        csi: nextData.csi || '',
        municipio: nextData.municipio || '',
        tipoRede: nextData.tipoRede === 'MT' ? 'MT' : 'BT',
        referenciaLocal: nextData.referenciaLocal || '',
        equipeNecessaria: Number(nextData.equipeNecessaria || 0),
        observacoes: text.toLowerCase() === 'sem observacoes' ? undefined : text,
        status: 'Pendente',
      });

      ConversationStore.clear(chatId);
      bot.sendMessage(chatId, `Ocorrencia cadastrada com sucesso!\n\nID: ${occurrence.id}\nCSI: ${occurrence.csi}`, {
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    const nextStep = this.getNextStep(session.step);
    ConversationStore.set(chatId, { flow: 'create', step: nextStep, data: nextData });
    this.askNextQuestion(bot, chatId, nextStep);
  }

  private getNextStep(step: CreateStep): CreateStep {
    const steps: CreateStep[] = ['csi', 'municipio', 'tipoRede', 'referenciaLocal', 'equipeNecessaria', 'observacoes'];
    return steps[steps.indexOf(step) + 1];
  }

  private askNextQuestion(bot: TelegramBot, chatId: number, step: CreateStep): void {
    const questions: Record<CreateStep, string> = {
      csi: 'Informe o CSI da ocorrencia:',
      municipio: 'Informe o municipio:',
      tipoRede: 'Informe o tipo de rede:',
      referenciaLocal: 'Informe a referencia do local:',
      equipeNecessaria: 'Informe quantas equipes sao necessarias:',
      observacoes: 'Informe observacoes ou toque em "Sem observacoes":'
    };

    const keyboard =
      step === 'tipoRede'
        ? [[{ text: 'BT' }, { text: 'MT' }], [{ text: 'Cancelar' }]]
        : step === 'observacoes'
          ? [[{ text: 'Sem observacoes' }], [{ text: 'Cancelar' }]]
          : [[{ text: 'Cancelar' }]];

    bot.sendMessage(chatId, questions[step], {
      reply_markup: { keyboard, resize_keyboard: true },
    });
  }

  private isPositiveInteger(value: string): boolean {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0;
  }
}

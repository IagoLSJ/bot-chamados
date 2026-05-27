import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationStore } from './ConversationStore';
import {
  getMunicipalityKeyboard,
  isValidMunicipalityFilter,
  normalizeMunicipalityFilter,
} from './Municipalities';
import { CountMap, buildOccurrenceReportData } from './OccurrenceReportData';

function formatCountMap(title: string, data: CountMap): string {
  const rows = Object.entries(data).map(([key, value]) => `- ${key}: ${value}`);
  return `${title}\n${rows.length ? rows.join('\n') : '- Nenhum dado'}`;
}

export class ReportOccurrences implements Strategy {
  async execute(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const session = ConversationStore.get(chatId);

    if (text === 'Cancelar') {
      ConversationStore.clear(chatId);
      await bot.sendMessage(chatId, 'Relatorio cancelado.', { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (!session || session.flow !== 'report') {
      ConversationStore.set(chatId, { flow: 'report', step: 'municipio' });
      await bot.sendMessage(chatId, 'Escolha a cidade para gerar o relatorio:', {
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

    ConversationStore.clear(chatId);
    const municipio = normalizeMunicipalityFilter(text);
    const data = await buildOccurrenceReportData(municipio);

    const report = [
      municipio ? `Relatorio de ocorrencias - ${municipio}` : 'Relatorio geral de ocorrencias',
      '',
      `Total de ocorrencias: ${data.allOccurrences.length}`,
      `Pendentes: ${data.pendingOccurrences.length}`,
      `Resolvidas: ${data.resolvedOccurrences.length}`,
      `Equipes necessarias em pendentes: ${data.totalTeams}`,
      '',
      formatCountMap('Por status:', data.byStatus),
      '',
      formatCountMap('Por tipo de rede:', data.byNetworkType),
      '',
      formatCountMap('Por municipio:', data.byCity),
    ].join('\n');

    await bot.sendMessage(chatId, report, { reply_markup: { remove_keyboard: true } });
  }
}

import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { CountMap, buildOccurrenceReportData } from './OccurrenceReportData';

function formatCountMap(title: string, data: CountMap): string {
  const rows = Object.entries(data).map(([key, value]) => `- ${key}: ${value}`);
  return `${title}\n${rows.length ? rows.join('\n') : '- Nenhum dado'}`;
}

export class ReportOccurrences implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    const data = buildOccurrenceReportData();

    const report = [
      'Relatorio geral de ocorrencias',
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

    bot.sendMessage(msg.chat.id, report, { reply_markup: { remove_keyboard: true } });
  }
}

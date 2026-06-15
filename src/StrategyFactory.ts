import { Strategy } from './strategies/Strategy';
import { StartStrategy } from './strategies/StartStrategy';
import { MenuStrategy } from './strategies/MenuStrategy';
import { HelpStrategy } from './strategies/HelpStrategy';
import { ExceptionStrategy } from './strategies/ExceptionStrategy';
import { CreateOccurrence } from './services/CreateOccurrence';
import { FindOccurrence } from './services/FindOccurrence';
import { UpdateOccurrence } from './services/UpdateOccurrence';
import { ListOccurrences } from './services/ListOccurrences';
import { ReportOccurrences } from './services/ReportOccurrences';
import { ExportReportHtml } from './services/ExportReportHtml';
import { ConversationStore } from './services/ConversationStore';

type StrategyConstructor = new () => Strategy;

const strategyMap: Record<string, StrategyConstructor> = {
  create:                         CreateOccurrence,
  update:                         UpdateOccurrence,
  find:                           FindOccurrence,
  list:                           ListOccurrences,
  report:                         ReportOccurrences,
  exportReport:                   ExportReportHtml,
  'Cadastrar Ocorrencia':         CreateOccurrence,
  'Alterar Ocorrencia':           UpdateOccurrence,
  'Buscar Ocorrencia por ID':     FindOccurrence,
  'Listar Ocorrencias Pendentes': ListOccurrences,
  'Relatorio Geral':              ReportOccurrences,
  'Exportar Relatorio com Graficos': ExportReportHtml,
  'Ajuda':                        HelpStrategy,
};

export class StrategyFactory {
  static getStrategy(text?: string, chatId?: number): Strategy {
    if (text === '/start' || text === '/menu') {
      if (chatId) ConversationStore.clear(chatId);
      return text === '/start' ? new StartStrategy() : new MenuStrategy();
    }

    if (chatId) {
      const session = ConversationStore.get(chatId);
      if (session?.flow) {
        const SessionStrategy = strategyMap[session.flow];
        if (SessionStrategy) return new SessionStrategy();
      }
    }

    const TextStrategy = strategyMap[text ?? ''];
    return TextStrategy ? new TextStrategy() : new ExceptionStrategy();
  }
}
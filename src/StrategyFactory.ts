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

export class StrategyFactory {
  static getStrategy(text?: string, chatId?: number): Strategy | null {
    if (chatId && text !== '/start' && text !== '/menu') {
      const session = ConversationStore.get(chatId);

      if (session?.flow === 'create') {
        return new CreateOccurrence();
      }

      if (session?.flow === 'update') {
        return new UpdateOccurrence();
      }

      if (session?.flow === 'find') {
        return new FindOccurrence();
      }
    }

    switch (text) {
      case '/start':
        if (chatId) ConversationStore.clear(chatId);
        return new StartStrategy();

      case '/menu':
        if (chatId) ConversationStore.clear(chatId);
        return new MenuStrategy();

      case 'Ajuda':
        return new HelpStrategy();

      case 'Cadastrar Ocorrencia':
        return new CreateOccurrence();

      case 'Alterar Ocorrencia':
        return new UpdateOccurrence();

      case 'Buscar Ocorrencia por ID':
        return new FindOccurrence();

      case 'Listar Ocorrencias Pendentes':
        return new ListOccurrences();

      case 'Relatorio Geral':
        return new ReportOccurrences();

      case 'Exportar Relatorio com Graficos':
        return new ExportReportHtml();

      default:
        return new ExceptionStrategy();
    }
  }
}

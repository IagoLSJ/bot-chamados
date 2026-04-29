import { CreateOccurrenceDTO } from '../dto/create-occurrence';
import { OccurrenceField } from './OccurrenceStore';

export type CreateStep =
  | 'csi'
  | 'municipio'
  | 'tipoRede'
  | 'referenciaLocal'
  | 'equipeNecessaria'
  | 'observacoes';

export type ConversationSession =
  | {
      flow: 'create';
      step: CreateStep;
      data: Partial<CreateOccurrenceDTO>;
    }
  | {
      flow: 'update';
      step: 'id' | 'field' | 'value';
      occurrenceId?: number;
      field?: OccurrenceField;
    }
  | {
      flow: 'find';
      step: 'id';
    };

const sessions = new Map<number, ConversationSession>();

export class ConversationStore {
  static get(chatId: number): ConversationSession | undefined {
    return sessions.get(chatId);
  }

  static set(chatId: number, session: ConversationSession): void {
    sessions.set(chatId, session);
  }

  static clear(chatId: number): void {
    sessions.delete(chatId);
  }
}

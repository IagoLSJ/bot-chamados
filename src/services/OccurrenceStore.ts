import { CreateOccurrenceDTO } from '../dto/create-occurrence';
import { Occurrence, occurrences } from '../mock/DATA';

export type OccurrenceField = keyof CreateOccurrenceDTO;

const editableFields: Record<string, OccurrenceField> = {
  CSI: 'csi',
  Municipio: 'municipio',
  'Tipo de Rede': 'tipoRede',
  Referencia: 'referenciaLocal',
  'Equipe Necessaria': 'equipeNecessaria',
  Observacoes: 'observacoes',
  Status: 'status',
};

export class OccurrenceStore {
  static listAll(): Occurrence[] {
    return occurrences;
  }

  static listPending(): Occurrence[] {
    return occurrences.filter((occurrence) => occurrence.status !== 'Resolvida');
  }

  static listResolved(): Occurrence[] {
    return occurrences.filter((occurrence) => occurrence.status === 'Resolvida');
  }

  static findById(id: number): Occurrence | undefined {
    return occurrences.find((occurrence) => occurrence.id === id);
  }

  static create(data: CreateOccurrenceDTO): Occurrence {
    const nextId = occurrences.reduce((maxId, occurrence) => Math.max(maxId, occurrence.id), 0) + 1;
    const occurrence = { id: nextId, status: 'Pendente' as const, ...data };

    occurrences.push(occurrence);
    return occurrence;
  }

  static update(id: number, field: OccurrenceField, value: string): Occurrence | undefined {
    const occurrence = this.findById(id);

    if (!occurrence) {
      return undefined;
    }

    if (field === 'equipeNecessaria') {
      occurrence[field] = Number(value);
      return occurrence;
    }

    if (field === 'tipoRede') {
      occurrence[field] = value.toUpperCase() === 'MT' ? 'MT' : 'BT';
      return occurrence;
    }

    if (field === 'status') {
      if (value !== 'Pendente' && value !== 'Resolvida') {
        return undefined;
      }
      occurrence[field] = value as 'Pendente' | 'Resolvida';
      return occurrence;
    }

    occurrence[field] = value;
    return occurrence;
  }

  static getEditableField(label: string): OccurrenceField | undefined {
    return editableFields[label];
  }

  static editableFieldLabels(): string[] {
    return Object.keys(editableFields);
  }
}

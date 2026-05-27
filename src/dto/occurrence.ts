import { CreateOccurrenceDTO } from './create-occurrence';

export interface Occurrence extends CreateOccurrenceDTO {
  id: number;
  status: 'Pendente' | 'Resolvida';
}

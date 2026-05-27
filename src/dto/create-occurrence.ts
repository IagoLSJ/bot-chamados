import { Municipality } from '../services/Municipalities';

export interface CreateOccurrenceDTO {
  csi: string;
  municipio: Municipality;
  tipoRede: 'BT' | 'MT';
  referenciaLocal: string;
  equipeNecessaria: number;
  observacoes?: string;
  status?: 'Pendente' | 'Resolvida';
}

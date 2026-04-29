export interface CreateOccurrenceDTO {
  csi: string;
  municipio: string;
  tipoRede: 'BT' | 'MT';
  referenciaLocal: string;
  equipeNecessaria: number;
  observacoes?: string;
  status?: 'Pendente' | 'Resolvida';
}
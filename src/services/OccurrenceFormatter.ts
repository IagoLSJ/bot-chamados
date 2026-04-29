import { Occurrence } from '../mock/DATA';

export function formatOccurrence(occurrence: Occurrence): string {
  return [
    `ID: ${occurrence.id}`,
    `CSI: ${occurrence.csi}`,
    `Municipio: ${occurrence.municipio}`,
    `Tipo de rede: ${occurrence.tipoRede}`,
    `Referencia: ${occurrence.referenciaLocal}`,
    `Equipes necessarias: ${occurrence.equipeNecessaria}`,
    `Status: ${occurrence.status || 'Pendente'}`,
    `Observacoes: ${occurrence.observacoes || 'Nenhuma'}`,
  ].join('\n');
}

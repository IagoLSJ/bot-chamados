import { Occurrence } from '../dto/occurrence';
import { OccurrenceStore } from './OccurrenceStore';

export type CountMap = Record<string, number>;

export interface OccurrenceReportData {
  allOccurrences: Occurrence[];
  pendingOccurrences: Occurrence[];
  resolvedOccurrences: Occurrence[];
  totalTeams: number;
  byStatus: CountMap;
  byNetworkType: CountMap;
  byCity: CountMap;
}

function countBy(occurrences: Occurrence[], getKey: (occurrence: Occurrence) => string): CountMap {
  return occurrences.reduce<CountMap>((acc, occurrence) => {
    const key = getKey(occurrence);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export async function buildOccurrenceReportData(municipio?: string): Promise<OccurrenceReportData> {
  const allOccurrences = municipio ? await OccurrenceStore.findByMunicipio(municipio) : await OccurrenceStore.listAll();
  const pendingOccurrences = allOccurrences.filter((occurrence) => occurrence.status !== 'Resolvida');
  const resolvedOccurrences = allOccurrences.filter((occurrence) => occurrence.status === 'Resolvida');

  return {
    allOccurrences,
    pendingOccurrences,
    resolvedOccurrences,
    totalTeams: pendingOccurrences.reduce((total, occurrence) => total + occurrence.equipeNecessaria, 0),
    byStatus: countBy(allOccurrences, (occurrence) => occurrence.status || 'Pendente'),
    byNetworkType: countBy(allOccurrences, (occurrence) => occurrence.tipoRede),
    byCity: countBy(allOccurrences, (occurrence) => occurrence.municipio),
  };
}

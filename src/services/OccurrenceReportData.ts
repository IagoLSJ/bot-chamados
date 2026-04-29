import { Occurrence } from '../mock/DATA';
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

export function buildOccurrenceReportData(): OccurrenceReportData {
  const allOccurrences = OccurrenceStore.listAll();
  const pendingOccurrences = OccurrenceStore.listPending();
  const resolvedOccurrences = OccurrenceStore.listResolved();

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

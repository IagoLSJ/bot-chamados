import { Occurrence } from '../dto/occurrence';

export const occurrences: Occurrence[] = [
  {
    id: 1,
    csi: '123456',
    municipio: 'Icó',
    tipoRede: 'BT',
    referenciaLocal: 'Rua A, 123',
    equipeNecessaria: 3,
    observacoes: 'Poste inclinado perto da praca',
    status: 'Pendente',
  },
  {
    id: 2,
    csi: '789012',
    municipio: 'Icó',
    tipoRede: 'MT',
    referenciaLocal: 'Rua B, 456',
    equipeNecessaria: 2,
    observacoes: 'Cabo baixo em via movimentada',
    status: 'Pendente',
  },
  {
    id: 3,
    csi: '345678',
    municipio: 'Icó',
    tipoRede: 'BT',
    referenciaLocal: 'Rua C, 789',
    equipeNecessaria: 1,
    status: 'Pendente',
  },
  {
    id: 4,
    csi: '901234',
    municipio: 'Icó',
    tipoRede: 'MT',
    referenciaLocal: 'Rua D, 101',
    equipeNecessaria: 0,
    observacoes: 'Resolvida, mantida no mock para testar filtro de pendentes',
    status: 'Resolvida',
  },
];

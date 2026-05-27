import { CreateOccurrenceDTO } from '../dto/create-occurrence';
import { Occurrence } from '../dto/occurrence';
import { Municipality, normalizeMunicipality } from './Municipalities';
import { supabase } from './SupabaseClient';

export type OccurrenceField = keyof CreateOccurrenceDTO;

type OccurrenceRow = {
  id: number;
  csi: string;
  municipio: string;
  tipo_rede: 'BT' | 'MT';
  referencia_local: string;
  equipe_necessaria: number;
  observacoes: string | null;
  status: 'Pendente' | 'Resolvida';
};

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
  static async listAll(): Promise<Occurrence[]> {
    const { data, error } = await supabase.from('occurrences').select('*').order('id', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar ocorrencias: ${error.message}`);
    }

    return (data || []).map(mapRowToOccurrence);
  }

  static async listPending(): Promise<Occurrence[]> {
    const { data, error } = await supabase
      .from('occurrences')
      .select('*')
      .neq('status', 'Resolvida')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar pendentes: ${error.message}`);
    }

    return (data || []).map(mapRowToOccurrence);
  }

  static async listPendingByMunicipio(municipio: string): Promise<Occurrence[]> {
    const normalizedMunicipio = requireMunicipality(municipio);
    const { data, error } = await supabase
      .from('occurrences')
      .select('*')
      .eq('municipio', normalizedMunicipio)
      .neq('status', 'Resolvida')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar pendentes por municipio: ${error.message}`);
    }

    return (data || []).map(mapRowToOccurrence);
  }

  static async listResolved(): Promise<Occurrence[]> {
    const { data, error } = await supabase
      .from('occurrences')
      .select('*')
      .eq('status', 'Resolvida')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar resolvidas: ${error.message}`);
    }

    return (data || []).map(mapRowToOccurrence);
  }

  static async findById(id: number): Promise<Occurrence | undefined> {
    const { data, error } = await supabase.from('occurrences').select('*').eq('id', id).maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar ocorrencia: ${error.message}`);
    }

    return data ? mapRowToOccurrence(data) : undefined;
  }

  static async findByMunicipio(municipio: string): Promise<Occurrence[]> {
    const normalizedMunicipio = requireMunicipality(municipio);
    const { data, error } = await supabase
      .from('occurrences')
      .select('*')
      .eq('municipio', normalizedMunicipio)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar ocorrencias por municipio: ${error.message}`);
    }

    return (data || []).map(mapRowToOccurrence);
  }

  static async create(data: CreateOccurrenceDTO): Promise<Occurrence> {
    const payload = mapOccurrenceToInsert(data);
    const { data: occurrence, error } = await supabase.from('occurrences').insert(payload).select('*').single();

    if (error) {
      throw new Error(`Erro ao criar ocorrencia: ${error.message}`);
    }

    return mapRowToOccurrence(occurrence);
  }

  static async update(id: number, field: OccurrenceField, value: string): Promise<Occurrence | undefined> {
    const payload = mapUpdatePayload(field, value);

    if (!payload) {
      return undefined;
    }

    const { data, error } = await supabase.from('occurrences').update(payload).eq('id', id).select('*').maybeSingle();

    if (error) {
      throw new Error(`Erro ao atualizar ocorrencia: ${error.message}`);
    }

    return data ? mapRowToOccurrence(data) : undefined;
  }

  static getEditableField(label: string): OccurrenceField | undefined {
    return editableFields[label];
  }

  static editableFieldLabels(): string[] {
    return Object.keys(editableFields);
  }
}

function mapRowToOccurrence(row: OccurrenceRow): Occurrence {
  return {
    id: row.id,
    csi: row.csi,
    municipio: requireMunicipality(row.municipio),
    tipoRede: row.tipo_rede,
    referenciaLocal: row.referencia_local,
    equipeNecessaria: row.equipe_necessaria,
    observacoes: row.observacoes || undefined,
    status: row.status,
  };
}

function mapOccurrenceToInsert(data: CreateOccurrenceDTO) {
  return {
    csi: data.csi,
    municipio: requireMunicipality(data.municipio),
    tipo_rede: data.tipoRede,
    referencia_local: data.referenciaLocal,
    equipe_necessaria: data.equipeNecessaria,
    observacoes: data.observacoes || null,
    status: data.status || 'Pendente',
  };
}

function mapUpdatePayload(field: OccurrenceField, value: string) {
  if (field === 'csi') return { csi: value };
  if (field === 'municipio') return { municipio: requireMunicipality(value) };
  if (field === 'tipoRede') return { tipo_rede: value.toUpperCase() === 'MT' ? 'MT' : 'BT' };
  if (field === 'referenciaLocal') return { referencia_local: value };
  if (field === 'equipeNecessaria') return { equipe_necessaria: Number(value) };
  if (field === 'observacoes') return { observacoes: value || null };
  if (field === 'status' && (value === 'Pendente' || value === 'Resolvida')) return { status: value };
  return undefined;
}

function requireMunicipality(value: string): Municipality {
  const municipality = normalizeMunicipality(value);

  if (!municipality) {
    throw new Error('Municipio fora do escopo permitido.');
  }

  return municipality;
}

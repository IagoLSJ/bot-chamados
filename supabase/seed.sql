insert into public.occurrences (
  csi,
  municipio,
  tipo_rede,
  referencia_local,
  equipe_necessaria,
  observacoes,
  status
) values
  ('123456', 'Icó', 'BT', 'Rua A, 123', 3, 'Poste inclinado perto da praca', 'Pendente'),
  ('789012', 'Icó', 'MT', 'Rua B, 456', 2, 'Cabo baixo em via movimentada', 'Pendente'),
  ('345678', 'Icó', 'BT', 'Rua C, 789', 1, null, 'Pendente'),
  ('901234', 'Icó', 'MT', 'Rua D, 101', 0, 'Resolvida, mantida para testar filtro de pendentes', 'Resolvida');

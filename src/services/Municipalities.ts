import TelegramBot from 'node-telegram-bot-api';

export const MUNICIPALITIES = ['Icó', 'Orós', 'Umari', 'Lavras da Mangabeira', 'Cedro', 'Várzea Alegre'];
export const ALL_MUNICIPALITIES_OPTION = 'Todas';
export type Municipality = (typeof MUNICIPALITIES)[number];

export function getMunicipalityKeyboard(includeAll = false): TelegramBot.KeyboardButton[][] {
  const options = includeAll ? [ALL_MUNICIPALITIES_OPTION, ...MUNICIPALITIES] : MUNICIPALITIES;
  return [...options.map((text) => [{ text }]), [{ text: 'Cancelar' }]];
}

export function isValidMunicipalityFilter(text: string): boolean {
  return text === ALL_MUNICIPALITIES_OPTION || Boolean(normalizeMunicipality(text));
}

export function normalizeMunicipalityFilter(text: string): string | undefined {
  return text === ALL_MUNICIPALITIES_OPTION ? undefined : normalizeMunicipality(text);
}

export function normalizeMunicipality(text: string): Municipality | undefined {
  const normalizedText = normalizeText(text);
  return MUNICIPALITIES.find((municipality) => normalizeText(municipality) === normalizedText);
}

function normalizeText(text: string): string {
  return text
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

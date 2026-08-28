export type ClaimStatus = 'untested' | 'explain' | 'recognize' | 'blocked';

export interface Rehearsal {
  at: string;
  status: ClaimStatus;
  teachBack: string;
  counterexample: string;
  nextProbe: string;
}

export interface Claim {
  id: string;
  title: string;
  context: string;
  prerequisiteIds: string[];
  status: ClaimStatus;
  teachBack: string;
  counterexample: string;
  nextProbe: string;
  createdAt: string;
  updatedAt: string;
  rehearsals: Rehearsal[];
}

export interface MapData {
  version: 1;
  topic: string;
  claims: Claim[];
}

export const EMPTY_MAP: MapData = { version: 1, topic: '', claims: [] };
export const FREE_CLAIM_LIMIT = 12;

export function makeClaim(title: string, context = '', prerequisiteIds: string[] = []): Claim {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    context: context.trim(),
    prerequisiteIds: [...new Set(prerequisiteIds)],
    status: 'untested',
    teachBack: '',
    counterexample: '',
    nextProbe: '',
    createdAt: now,
    updatedAt: now,
    rehearsals: [],
  };
}

export function validateRehearsal(status: ClaimStatus, teachBack: string, counterexample: string, nextProbe: string): string[] {
  const errors: string[] = [];
  if (!teachBack.trim()) errors.push('Write the explanation you could produce without looking it up.');
  if (status === 'explain' && !counterexample.trim()) errors.push('Add a counterexample or boundary before marking this “can explain.”');
  if (status !== 'untested' && !nextProbe.trim()) errors.push('Choose a next probe so this result leads somewhere.');
  return errors;
}

export function recordRehearsal(claim: Claim, status: ClaimStatus, teachBack: string, counterexample: string, nextProbe: string): Claim {
  const now = new Date().toISOString();
  const rehearsal = { at: now, status, teachBack: teachBack.trim(), counterexample: counterexample.trim(), nextProbe: nextProbe.trim() };
  return { ...claim, ...rehearsal, updatedAt: now, rehearsals: [...claim.rehearsals, rehearsal] };
}

export function sanitizeMap(value: unknown): MapData {
  if (!value || typeof value !== 'object') throw new Error('That file does not contain a boundary map.');
  const source = value as Partial<MapData>;
  if (source.version !== 1 || !Array.isArray(source.claims)) throw new Error('This map format is not supported.');
  const claims = source.claims.map((item, claimIndex) => {
    if (!item || typeof item !== 'object') throw new Error('One claim in the file is invalid.');
    const claim = item as Partial<Claim>;
    if (typeof claim.id !== 'string' || typeof claim.title !== 'string' || !claim.title.trim()) throw new Error('One claim is missing its title.');
    const status: ClaimStatus = ['untested', 'explain', 'recognize', 'blocked'].includes(claim.status ?? '') ? claim.status as ClaimStatus : 'untested';
    const title = claim.title.trim().slice(0, 160);
    const rehearsals = Array.isArray(claim.rehearsals) ? claim.rehearsals.map((item, rehearsalIndex): Rehearsal => {
      const rehearsal = item as Partial<Rehearsal> | null;
      const validStatus = rehearsal && ['untested', 'explain', 'recognize', 'blocked'].includes(rehearsal.status ?? '');
      const validDate = rehearsal && typeof rehearsal.at === 'string' && !Number.isNaN(Date.parse(rehearsal.at));
      const validText = rehearsal
        && typeof rehearsal.teachBack === 'string'
        && typeof rehearsal.counterexample === 'string'
        && typeof rehearsal.nextProbe === 'string';
      if (!rehearsal || typeof rehearsal !== 'object' || !validStatus || !validDate || !validText) {
        throw new Error(`Rehearsal ${rehearsalIndex + 1} for “${title || `claim ${claimIndex + 1}`}” is damaged. Choose an unedited Knowledge Boundary Map JSON export and try again.`);
      }
      return {
        at: rehearsal.at!,
        status: rehearsal.status as ClaimStatus,
        teachBack: rehearsal.teachBack!.slice(0, 5000),
        counterexample: rehearsal.counterexample!.slice(0, 2000),
        nextProbe: rehearsal.nextProbe!.slice(0, 1000),
      };
    }) : [];
    return {
      id: claim.id,
      title,
      context: typeof claim.context === 'string' ? claim.context.slice(0, 600) : '',
      prerequisiteIds: Array.isArray(claim.prerequisiteIds) ? claim.prerequisiteIds.filter((id): id is string => typeof id === 'string') : [],
      status,
      teachBack: typeof claim.teachBack === 'string' ? claim.teachBack.slice(0, 5000) : '',
      counterexample: typeof claim.counterexample === 'string' ? claim.counterexample.slice(0, 2000) : '',
      nextProbe: typeof claim.nextProbe === 'string' ? claim.nextProbe.slice(0, 1000) : '',
      createdAt: typeof claim.createdAt === 'string' ? claim.createdAt : new Date().toISOString(),
      updatedAt: typeof claim.updatedAt === 'string' ? claim.updatedAt : new Date().toISOString(),
      rehearsals,
    };
  });
  const ids = new Set(claims.map((claim) => claim.id));
  claims.forEach((claim) => claim.prerequisiteIds = claim.prerequisiteIds.filter((id) => ids.has(id) && id !== claim.id));
  return { version: 1, topic: typeof source.topic === 'string' ? source.topic.slice(0, 120) : '', claims };
}

export function asCsv(data: MapData): string {
  const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = [['Claim', 'Status', 'Prerequisites', 'Teach-back', 'Counterexample', 'Next probe', 'Last rehearsed']];
  const byId = new Map(data.claims.map((claim) => [claim.id, claim.title]));
  data.claims.forEach((claim) => rows.push([
    claim.title,
    claim.status,
    claim.prerequisiteIds.map((id) => byId.get(id) ?? '').filter(Boolean).join('; '),
    claim.teachBack,
    claim.counterexample,
    claim.nextProbe,
    claim.rehearsals.at(-1)?.at ?? '',
  ]));
  return rows.map((row) => row.map(cell).join(',')).join('\n');
}

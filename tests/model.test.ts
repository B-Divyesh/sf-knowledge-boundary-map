import { describe, expect, it } from 'vitest';
import { asCsv, makeClaim, recordRehearsal, sanitizeMap, validateRehearsal } from '../src/model';

describe('claim rehearsal', () => {
  it('requires a produced explanation and next probe', () => {
    expect(validateRehearsal('recognize', '', '', '')).toEqual([
      'Write the explanation you could produce without looking it up.',
      'Choose a next probe so this result leads somewhere.',
    ]);
  });

  it('requires a boundary before “can explain”', () => {
    expect(validateRehearsal('explain', 'A clear explanation', '', 'Try a novel example')).toEqual([
      'Add a counterexample or boundary before marking this “can explain.”',
    ]);
  });

  it('records a timestamped rehearsal without mutating the claim', () => {
    const claim = makeClaim('An example claim');
    const next = recordRehearsal(claim, 'blocked', 'I stalled at the mechanism.', '', 'Explain the prerequisite first.');
    expect(claim.rehearsals).toHaveLength(0);
    expect(next.rehearsals).toHaveLength(1);
    expect(next.status).toBe('blocked');
  });
});

describe('portable map data', () => {
  it('rejects unsupported input and dangling prerequisite ids', () => {
    expect(() => sanitizeMap({ version: 2, claims: [] })).toThrow('not supported');
    const map = sanitizeMap({ version: 1, topic: 'Test', claims: [{ id: 'one', title: 'Claim', prerequisiteIds: ['missing', 'one'] }] });
    expect(map.claims[0].prerequisiteIds).toEqual([]);
  });

  it('escapes CSV fields', () => {
    const claim = makeClaim('A “quoted”, claim');
    expect(asCsv({ version: 1, topic: '', claims: [claim] })).toContain('"A “quoted”, claim"');
  });
});

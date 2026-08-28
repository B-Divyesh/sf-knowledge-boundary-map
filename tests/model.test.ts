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

  it('rejects wrong-typed imported rehearsal fields with recovery guidance', () => {
    expect(() => sanitizeMap({
      version: 1,
      topic: 'Damaged import',
      claims: [{
        id: 'one',
        title: 'A valid claim',
        rehearsals: [{
          at: new Date().toISOString(),
          status: 'explain',
          teachBack: 7,
          counterexample: {},
          nextProbe: [],
        }],
      }],
    })).toThrow('Rehearsal 1 for “A valid claim” is damaged. Choose an unedited Knowledge Boundary Map JSON export and try again.');
  });

  it('preserves and bounds every field in valid imported rehearsals', () => {
    const at = new Date().toISOString();
    const map = sanitizeMap({
      version: 1,
      claims: [{
        id: 'one',
        title: 'A valid claim',
        rehearsals: [{ at, status: 'blocked', teachBack: 't'.repeat(5001), counterexample: 'c'.repeat(2001), nextProbe: 'n'.repeat(1001) }],
      }],
    });
    expect(map.claims[0].rehearsals[0]).toMatchObject({ at, status: 'blocked' });
    expect(map.claims[0].rehearsals[0].teachBack).toHaveLength(5000);
    expect(map.claims[0].rehearsals[0].counterexample).toHaveLength(2000);
    expect(map.claims[0].rehearsals[0].nextProbe).toHaveLength(1000);
  });

  it('escapes CSV fields', () => {
    const claim = makeClaim('A “quoted”, claim');
    expect(asCsv({ version: 1, topic: '', claims: [claim] })).toContain('"A “quoted”, claim"');
  });
});

export const SCHEMA_VERSION = 1;

export const RELATION_TYPES = ['contradicts', 'supports', 'same_event'] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

export type Id = string;

/** Order-insensitive key for a pair of fact IDs, so (a, b) and (b, a) match the same relationship. */
export function factPairKey(a: Id, b: Id): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export type EntryID = Lowercase<string>;

export type NamedRecord<ACCEPTED_KEYS extends PropertyKey, DATA, DISCRIMINANT_NAME extends PropertyKey> = {
  [ROW_KEY in ACCEPTED_KEYS]: DATA & { [K in DISCRIMINANT_NAME]: ROW_KEY };
};
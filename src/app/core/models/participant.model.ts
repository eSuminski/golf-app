export interface Participant {
  id: string;
  firstName: string;
  lastName?: string;
  sourceLine?: string;
  teamId?: string;
  isVerified: boolean;
}

/** A named group that participants can optionally be assigned to. */
export interface Team {
  id: string;
  name: string;
}

/**
 * A single word selected from the document while building a participant.
 * `role` marks whether it currently counts as the first name or part of the
 * last name. The entry array is kept in click order; role assignment and
 * first-name promotion on deselection are managed by the store.
 */
export interface SelectionEntry {
  tokenId: string;
  text: string;
  role: 'first' | 'last';
}

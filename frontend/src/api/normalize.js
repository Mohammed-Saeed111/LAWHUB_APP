/** MongoDB returns `_id`; the UI expects `id`. Normalize documents here. */
export const withId = (doc) => (doc ? { ...doc, id: doc._id ?? doc.id } : doc);
export const withIds = (arr = []) => arr.map(withId);

/** Reviews reference a lawyer via `lawyer`; the UI reads `lawyerId`. */
export const normalizeReview = (r) => ({ ...withId(r), lawyerId: r.lawyer });

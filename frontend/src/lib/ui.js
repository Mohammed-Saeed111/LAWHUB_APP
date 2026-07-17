/** Pure UI helpers (no backend dependency). */

/** Deterministic avatar URL (DiceBear) so profiles always have an image. */
export const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || 'lawhub')}&backgroundColor=111726&textColor=C9A24B`;

/** Case status → label + colors (Screen 8). */
export const STATUS_META = {
  in_progress: { label: 'قيد التنفيذ', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  waiting: { label: 'في انتظار الرد', color: 'text-amber-400', dot: 'bg-amber-400' },
  completed: { label: 'مكتملة', color: 'text-gold', dot: 'bg-gold' },
};

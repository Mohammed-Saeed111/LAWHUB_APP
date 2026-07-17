import { motion } from 'framer-motion';
/** Reusable empty-state block with a luxury gold illustration slot. */
const EmptyState = ({ icon: Icon, title, description, children }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center">
    <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-gold/10 blur-2xl animate-spotlight" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-gold/30 bg-navy-700 shadow-gold">
        {Icon && <Icon size={44} className="text-gold" />}
      </div>
    </div>
    <h3 className="text-lg font-bold text-ink">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>}
    {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
  </motion.div>
);
export default EmptyState;

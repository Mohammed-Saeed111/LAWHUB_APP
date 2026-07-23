import { motion } from 'framer-motion';
/** Central pulsing 3D-ish gold sphere representing "Legal Intelligence" at work. */
const ProcessingSphere = ({ size = 180 }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    {[0, 1, 2].map((i) => (<span key={i} className="absolute rounded-full border border-gold/40 animate-ring-pulse" style={{ width: size * 0.6, height: size * 0.6, animationDelay: `${i * 0.7}s` }} />))}
    <span className="absolute rounded-full bg-gold/15 blur-2xl" style={{ width: size, height: size }} />
    <motion.div className="relative rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-ai-glow animate-pulse-ai" style={{ width: size * 0.5, height: size * 0.5 }}>
      <span className="absolute inset-2 rounded-full border border-white/20" />
      <span className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/10" />
      <span className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white/10" />
    </motion.div>
    <span className="absolute rounded-full border border-dashed border-gold/25 animate-spin-slow" style={{ width: size * 0.85, height: size * 0.85 }} />
  </div>
);
export default ProcessingSphere;

/**
 * Brand logo: justice-scale + shield crest in warm gold.
 * Pure inline SVG so it scales crisply and needs no asset files.
 */
const Logo = ({ size = 72, glow = true, className = '' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <span
          className="absolute inset-0 rounded-full bg-gold/25 blur-2xl animate-spotlight"
          aria-hidden="true"
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
        role="img"
        aria-label="Egypt LawHub logo"
      >
        {/* Shield crest */}
        <path
          d="M32 3 54 11V29C54 44 44 55 32 61 20 55 10 44 10 29V11L32 3Z"
          stroke="#C9A24B"
          strokeWidth="2"
          fill="#0E1421"
        />
        {/* Central beam */}
        <line x1="32" y1="16" x2="32" y2="46" stroke="#C9A24B" strokeWidth="2" />
        {/* Balance bar */}
        <line x1="18" y1="22" x2="46" y2="22" stroke="#C9A24B" strokeWidth="2" />
        {/* Left pan */}
        <path d="M18 22 14 32H22L18 22Z" stroke="#E3C57E" strokeWidth="1.5" fill="none" />
        {/* Right pan */}
        <path d="M46 22 42 32H50L46 22Z" stroke="#E3C57E" strokeWidth="1.5" fill="none" />
        {/* Base */}
        <line x1="24" y1="46" x2="40" y2="46" stroke="#C9A24B" strokeWidth="2" />
        <circle cx="32" cy="14" r="2.5" fill="#C9A24B" />
      </svg>
    </div>
  );
};

export default Logo;

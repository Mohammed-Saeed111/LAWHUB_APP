import { MdVerified } from 'react-icons/md';
/** Gold "verified lawyer" badge. */
const VerifiedBadge = ({ label = 'موثّق', size = 16 }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
    <MdVerified size={size} /> {label}
  </span>
);
export default VerifiedBadge;

import { FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Compact language toggle (AR ⇄ EN) usable in headers/corners.
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-gold/30 px-3 py-1.5
                  text-sm text-gold transition hover:bg-gold/10 ${className}`}
      aria-label="Switch language"
    >
      <FiGlobe size={15} />
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  );
};

export default LanguageSwitcher;

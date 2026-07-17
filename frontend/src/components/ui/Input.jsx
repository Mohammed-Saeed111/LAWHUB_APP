import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Labeled input with error display and optional password toggle.
 * Icon side + password-toggle side adapt to the active text direction.
 */
const Input = ({ label, name, type = 'text', icon: Icon, error, className = '', ...props }) => {
  const { isRTL } = useLanguage();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  // In RTL the leading icon sits on the right; toggle on the left (and vice-versa).
  const iconSide = isRTL ? 'right-3' : 'left-3';
  const toggleSide = isRTL ? 'left-3' : 'right-3';
  const iconPad = Icon ? (isRTL ? 'pr-10' : 'pl-10') : '';
  const togglePad = isPassword ? (isRTL ? 'pl-10' : 'pr-10') : '';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute ${iconSide} top-1/2 -translate-y-1/2 text-ink-faint`}
            size={18}
          />
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          className={`input-luxury ${iconPad} ${togglePad} ${
            error ? 'border-red-500/70 focus:ring-red-500/20' : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className={`absolute ${toggleSide} top-1/2 -translate-y-1/2 text-ink-faint hover:text-gold`}
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;

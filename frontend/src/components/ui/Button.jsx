import Spinner from './Spinner.jsx';

/**
 * Reusable button with variants + loading state.
 * variant: 'gold' | 'outline' | 'ghost'
 */
const Button = ({
  children,
  variant = 'gold',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const base =
    'w-full rounded-xl py-3 font-semibold transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    gold: 'bg-gold text-navy hover:bg-gold-light',
    outline: 'border border-gold/40 text-gold hover:bg-gold/10',
    ghost: 'text-ink-muted hover:text-ink',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size={18} />}
      {children}
    </button>
  );
};

export default Button;

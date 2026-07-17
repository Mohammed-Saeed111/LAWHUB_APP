import { useRef } from 'react';

/**
 * 6-box OTP input. Handles typing, backspace navigation, and paste.
 * `value` is the full string; `onChange(newValue)` bubbles changes up.
 * Always rendered LTR so digits read left-to-right regardless of page dir.
 */
const OtpInput = ({ length = 6, value = '', onChange }) => {
  const refs = useRef([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const setDigit = (index, digit) => {
    const arr = value.padEnd(length, ' ').split('');
    arr[index] = digit || ' ';
    onChange(arr.join('').replace(/\s/g, ''));
  };

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    setDigit(index, digit);
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index].trim()) {
        setDigit(index, '');
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        setDigit(index - 1, '');
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-14 w-12 rounded-xl bg-navy-800 border border-white/10 text-center
                     text-2xl font-bold text-gold outline-none transition
                     focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
        />
      ))}
    </div>
  );
};

export default OtpInput;

import { useRef, useState } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

/**
 * Drag & drop file uploader with instant preview (Screen 7 - bar card upload).
 * Calls onFile(file) whenever a valid file is selected.
 */
const FileDropzone = ({ onFile, accept = 'image/*,.pdf', maxSizeMB = 5 }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > maxSizeMB * 1024 * 1024) { setError(`الحد الأقصى ${maxSizeMB} ميجابايت.`); return; }
    setError('');
    setFile(f);
    onFile?.(f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => { setFile(null); setPreview(null); onFile?.(null); if (inputRef.current) inputRef.current.value = ''; };

  return (
    <div className="space-y-2">
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragging ? 'border-gold bg-gold/10' : 'border-gold/30 bg-navy-800 hover:border-gold/60'
          }`}
        >
          <FiUploadCloud size={40} className="text-gold" />
          <p className="text-ink">اسحب صورة كارنيه النقابة هنا أو اضغط للاختيار</p>
          <p className="text-xs text-ink-faint">JPG · PNG · PDF — حتى {maxSizeMB}MB</p>
          <input ref={inputRef} type="file" accept={accept} className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-navy-800 p-4">
          {preview ? (
            <img src={preview} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-navy-600 text-gold"><FiFile size={28} /></div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm text-ink">{file.name}</p>
            <p className="text-xs text-ink-faint">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button type="button" onClick={clear} className="text-ink-faint hover:text-red-400"><FiX size={20} /></button>
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
export default FileDropzone;

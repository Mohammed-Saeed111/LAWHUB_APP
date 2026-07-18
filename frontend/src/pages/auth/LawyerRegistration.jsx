import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHash, FiAward, FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import authApi from '../../api/authApi.js';
import useAuth from '../../hooks/useAuth.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 7 — Lawyer Registration (credentials).
 * Formal form for bar number + specialization, plus a drag & drop zone to
 * upload the bar card with an instant preview. On submit → account under review.
 */
const LawyerRegistration = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const inputRef = useRef(null);

  const [form, setForm] = useState({ barNumber: '', specialization: '', firmName: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFirm = user?.role === 'office';
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const acceptFile = (f) => {
    if (!f) return;
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!ok.includes(f.type)) return toast.error('JPG / PNG / PDF only.');
    if (f.size > 5 * 1024 * 1024) return toast.error('Max 5MB.');
    setFile(f);
    setPreview(f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error(t('lawyer.upload'));
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('barNumber', form.barNumber);
      fd.append('specialization', form.specialization);
      if (isFirm) fd.append('firmName', form.firmName);
      fd.append('barCard', file);

      const res = await authApi.submitLawyerCredentials(fd);
      updateUser(res.data.user);
      toast.success('📄');
      navigate('/under-review', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('lawyer.title')} subtitle={t('lawyer.subtitle')}>
      <form onSubmit={submit} className="space-y-4">
        {isFirm && (
          <Input
            label={t('lawyer.firmName')}
            name="firmName"
            icon={HiOutlineOfficeBuilding}
            value={form.firmName}
            onChange={onChange}
          />
        )}
        <Input
          label={t('lawyer.barNumber')}
          name="barNumber"
          icon={FiHash}
          value={form.barNumber}
          onChange={onChange}
          placeholder="123456"
          dir="ltr"
          required
        />
        <Input
          label={t('lawyer.specialization')}
          name="specialization"
          icon={FiAward}
          value={form.specialization}
          onChange={onChange}
          required
        />

        {/* Drag & drop upload zone */}
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragging ? 'border-gold bg-gold/10' : 'border-gold/30 bg-navy-800 hover:border-gold/60'
            }`}
          >
            <FiUploadCloud size={36} className="text-gold" />
            <p className="mt-3 font-medium text-ink">{t('lawyer.upload')}</p>
            <p className="mt-1 text-xs text-ink-muted">{t('lawyer.uploadHint')}</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-navy-800 p-3">
            {preview ? (
              <img src={preview} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-navy-600 text-gold">
                <FiFile size={26} />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button type="button" onClick={clearFile} className="text-ink-faint hover:text-red-400">
              <FiX size={20} />
            </button>
          </div>
        )}

        <Button type="submit" loading={loading}>
          {t('lawyer.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LawyerRegistration;

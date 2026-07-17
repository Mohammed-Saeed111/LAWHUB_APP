import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiCheck } from 'react-icons/fi';
import { GiGavel } from 'react-icons/gi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * SCREEN 4 — Register: Account Type Selection.
 * Three large interactive cards: Client (individual), Lawyer (professional),
 * Law Firm (corporate). Each has a distinctive gold icon for quick recognition.
 * The chosen role is passed on to the registration details step.
 */
const AccountTypeSelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [role, setRole] = useState('client');

  const TYPES = [
    { key: 'client', icon: FiUser, title: t('accountType.client'), desc: t('accountType.clientDesc') },
    { key: 'lawyer', icon: GiGavel, title: t('accountType.lawyer'), desc: t('accountType.lawyerDesc') },
    {
      key: 'lawfirm',
      icon: HiOutlineOfficeBuilding,
      title: t('accountType.lawfirm'),
      desc: t('accountType.lawfirmDesc'),
    },
  ];

  return (
    <AuthLayout title={t('accountType.title')} subtitle={t('accountType.subtitle')}>
      <div className="space-y-4">
        {TYPES.map(({ key, icon: Icon, title, desc }) => {
          const active = role === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setRole(key)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-start transition ${
                active
                  ? 'border-gold bg-gold/10 shadow-gold'
                  : 'border-white/10 bg-navy-800 hover:border-gold/40'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  active ? 'bg-gold text-navy' : 'bg-navy-600 text-gold'
                }`}
              >
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink-muted">{desc}</p>
              </div>
              {active && <FiCheck className="text-gold" size={22} />}
            </button>
          );
        })}

        <Button onClick={() => navigate('/register/details', { state: { role } })}>
          {t('common.continue')}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          {t('login.noAccount').replace('?', '')}{' '}
          <button onClick={() => navigate('/login')} className="link-gold">
            {t('login.title')}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default AccountTypeSelection;

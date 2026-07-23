import * as Fi from 'react-icons/fi';

const AdminStatCard = ({ icon, label, value, delta }) => {
  const Icon = Fi[icon] || Fi.FiActivity;
  const pos = delta?.startsWith('+');
  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <Icon size={22} />
        </span>
        {delta && (
          <span className={`text-xs font-semibold ${pos ? 'text-emerald-400' : 'text-admin-ink-faint'}`}>
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-sans text-2xl font-bold text-admin-ink">{value}</p>
      <p className="mt-1 text-sm text-admin-ink-muted">{label}</p>
    </div>
  );
};

export default AdminStatCard;

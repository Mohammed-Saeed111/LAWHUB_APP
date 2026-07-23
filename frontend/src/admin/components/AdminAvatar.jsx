const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || 'admin')}&backgroundColor=1B1F1F&textColor=C9A24B`;

const AdminAvatar = ({ seed, size = 40, online }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <img
      src={avatarUrl(seed)}
      alt=""
      width={size}
      height={size}
      className="rounded-lg border border-gold/20 bg-surface-700 object-cover"
    />
    {online !== undefined && (
      <span
        className={`absolute -bottom-0.5 ltr:-right-0.5 rtl:-left-0.5 h-3 w-3 rounded-full border-2 border-surface-800 ${
          online ? 'bg-ok' : 'bg-ink-faint'
        }`}
      />
    )}
  </div>
);

export default AdminAvatar;

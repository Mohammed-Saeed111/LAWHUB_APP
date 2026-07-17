/** Title + optional "see all" action. */
const SectionHeader = ({ title, action, onAction }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="section-title flex items-center gap-2">
      <span className="h-5 w-1 rounded-full bg-gold" />
      {title}
    </h2>
    {action && <button onClick={onAction} className="link-gold text-sm">{action}</button>}
  </div>
);
export default SectionHeader;

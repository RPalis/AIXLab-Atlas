export const Card = () => (
  <a href="#main" className="bg-surface text-primary border border-surface-border shadow-card transition-colors">
    <span className="bg-status-success/15 text-status-success-text">ok</span>
    {/* design-check-ignore palette: chart series colors come from the data viz palette */}
    <i className="bg-emerald-600" />
  </a>
);

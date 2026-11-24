
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, subtitle, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{label}</span>
        <div className="stat-icon">
          <Icon size={19} strokeWidth={1.7} />
        </div>
      </div>

      <h3>{value}</h3>

      <div className="stat-subtitle">
        <span>{subtitle}</span>
        <ArrowUpRight size={15} />
      </div>
    </div>
  );
}

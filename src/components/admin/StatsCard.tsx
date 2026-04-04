import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  increasing?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconBg, trend, increasing }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ backgroundColor: `${iconBg}15`, color: iconBg }}>
        {icon}
      </div>
      <div className="stats-info">
        <h4>{title}</h4>
        <div className="stats-value">
          {value}
          {trend && (
            <span className={`stats-trend ${increasing ? 'trend-up' : 'trend-down'}`}>
              {increasing ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

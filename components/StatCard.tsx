import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactElement<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="glass-pane border border-slate-700/50 p-4 rounded-xl flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 hover:border-indigo-500/30 cursor-pointer group">
      <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
        <p className="text-2xl font-bold text-slate-100 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default React.memo(StatCard);
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#2dd4bf', '#7c3aed', '#fbbf24', '#3b82f6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 rounded-2xl shadow-2xl border border-white/10 text-right backdrop-blur-3xl">
        <p className="text-xs font-black text-white mb-2 uppercase tracking-widest">{label || payload[0].name}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-8">
               <span className="text-[10px] font-bold text-slate-500 uppercase">{p.name}</span>
               <span className="text-sm font-black" style={{ color: p.color || p.fill }}>
                {p.value.toLocaleString('ar-SA')}{p.name.includes('نمو') || p.name.includes('طلب') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const SkillsChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ right: 20, left: 20 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar 
          dataKey="demand" 
          fill="url(#neon-teal)" 
          radius={[0, 10, 10, 0]} 
          name="نسبة الطلب" 
          barSize={12} 
        >
          <defs>
            <linearGradient id="neon-teal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const SalariesChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, bottom: 20 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="min" fill="rgba(255,255,255,0.05)" name="الحد الأدنى" radius={[4, 4, 0, 0]} />
        <Bar dataKey="max" fill="#7c3aed" name="الحد الأعلى" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const GrowthChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="growth" 
          stroke="#2dd4bf" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorGrowth)" 
          name="معدل النمو (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const GeoChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={95}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
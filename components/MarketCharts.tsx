
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#2dd4bf', '#7c3aed', '#fbbf24', '#3b82f6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-6 rounded-[2rem] shadow-3xl border border-white/10 text-right backdrop-blur-3xl animate-in zoom-in-95 duration-200 min-w-[200px]">
        <p className="text-[10px] font-black text-teal-400 mb-3 uppercase tracking-[0.2em]">{label || payload[0].name}</p>
        <div className="space-y-3">
          {payload.map((p: any) => (
            <div key={p.name} className="flex flex-row-reverse items-center justify-between gap-4">
               <div className="flex flex-row-reverse items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }}></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">{p.name}</span>
               </div>
               <span className="text-sm font-black text-white">
                {p.value.toLocaleString('ar-SA')}
                {p.name.includes('نمو') || p.name.includes('طلب') ? '%' : ' ر.س'}
              </span>
            </div>
          ))}
        </div>
        {payload[0].payload.description && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] text-slate-500 italic leading-relaxed">{payload[0].payload.description}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const SkillsChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ right: 40, left: 40 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar 
          dataKey="demand" 
          fill="url(#neon-teal)" 
          radius={[0, 10, 10, 0]} 
          name="نسبة الطلب" 
          barSize={14}
          animationDuration={1500}
          animationEasing="ease-out"
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar 
          dataKey="min" 
          fill="rgba(255,255,255,0.05)" 
          name="الحد الأدنى" 
          radius={[6, 6, 0, 0]} 
          animationDuration={1200}
        />
        <Bar 
          dataKey="max" 
          fill="#7c3aed" 
          name="الحد الأعلى" 
          radius={[6, 6, 0, 0]} 
          animationDuration={1800}
        />
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
          strokeWidth={4} 
          fillOpacity={1} 
          fill="url(#colorGrowth)" 
          name="معدل النمو (%)"
          animationDuration={2000}
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
          innerRadius={75}
          outerRadius={100}
          paddingAngle={8}
          dataKey="value"
          stroke="none"
          animationDuration={1500}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.9} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

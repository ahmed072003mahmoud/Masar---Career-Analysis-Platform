
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#64FFDA', '#3A7CA5', '#10B981', '#A8B2D1', '#CCD6F6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#112240] p-4 rounded-2xl shadow-xl border border-[#233554] text-right">
        <p className="text-xs font-bold text-[#64FFDA] mb-2">{label || payload[0].name}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">{p.name}:</span>
              <span className="text-sm font-bold" style={{ color: p.color || p.fill }}>
                {p.value}{p.name.includes('نمو') ? '%' : ''}
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
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#233554" />
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: '#A8B2D1', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#233554', opacity: 0.4 }} />
        <Bar 
          dataKey="demand" 
          fill="#64FFDA" 
          radius={[0, 8, 8, 0]} 
          name="نسبة الطلب" 
          animationBegin={200} 
          animationDuration={1500} 
          barSize={24} 
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const SalariesChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#233554" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A8B2D1', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#A8B2D1' }} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#233554', opacity: 0.4 }} />
        <Legend verticalAlign="top" align="right" iconType="circle" />
        <Bar 
          dataKey="min" 
          fill="#233554" 
          name="الحد الأدنى" 
          radius={[4, 4, 0, 0]} 
          animationDuration={1000} 
        />
        <Bar 
          dataKey="max" 
          fill="#64FFDA" 
          name="الحد الأعلى" 
          radius={[4, 4, 0, 0]} 
          animationDuration={1500} 
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const GrowthChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#233554" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A8B2D1', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#A8B2D1' }} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="growth" 
          stroke="#64FFDA" 
          strokeWidth={4} 
          dot={{ r: 6, fill: '#64FFDA', strokeWidth: 4, stroke: '#112240' }} 
          name="معدل النمو (%)" 
          animationDuration={2000} 
        />
      </LineChart>
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
          outerRadius={90}
          paddingAngle={8}
          dataKey="value"
          animationBegin={0}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  </div>
);


import React, { useState, useMemo } from 'react';
import { TimelineEvent } from '../types';
import { 
  ClipboardList, 
  Award, 
  FolderKanban, 
  BookOpen, 
  Zap, 
  Settings,
  Clock,
  Filter
} from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'assessment': return <ClipboardList size={18} />;
    case 'badge': return <Award size={18} />;
    case 'project': return <FolderKanban size={18} />;
    case 'course': return <BookOpen size={18} />;
    case 'level': return <Zap size={18} />;
    case 'skill': return <Settings size={18} />;
    default: return <Clock size={18} />;
  }
};

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'assessment': return 'bg-blue-100 text-blue-600';
    case 'badge': return 'bg-yellow-100 text-yellow-600';
    case 'project': return 'bg-purple-100 text-purple-600';
    case 'course': return 'bg-green-100 text-green-600';
    case 'level': return 'bg-orange-100 text-orange-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
};

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const [filter, setFilter] = useState<'all' | TimelineEvent['type']>('all');

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.type === filter);
  }, [events, filter]);

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-gray-400">
        لا توجد أحداث مسجلة في خطك الزمني حتى الآن.
      </div>
    );
  }

  const filterOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'skill', label: 'مهارات' },
    { value: 'project', label: 'مشاريع' },
    { value: 'badge', label: 'أوسمة' },
    { value: 'course', label: 'دورات' },
    { value: 'level', label: 'مستويات' },
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Filters */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mr-2 text-gray-400">
          <Filter size={14} />
          <span className="text-xs font-bold uppercase tracking-tight">تصفية السجل:</span>
        </div>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === opt.value 
                ? 'bg-brand-dark text-white shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="relative before:absolute before:top-0 before:right-4 before:h-full before:w-0.5 before:bg-gray-200">
        <div className="space-y-10">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative pr-12 group animate-in slide-in-from-right-4 fade-in duration-300">
              <div className={`absolute top-0 right-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white transition-transform group-hover:scale-110 shadow-sm ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all group-hover:border-brand-light/30 group-hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{event.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {formatRelativeTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm">
              لا توجد أحداث مطابقة لهذا النوع من التصفية.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;


import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { UserAssessment, TimelineEvent } from '../types';
import { checkBadgeEligibility, calculateLevel } from '../utils/pointsCalculator';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
  isRemoving?: boolean;
}

interface User {
  email: string;
  token: string;
}

interface LearningStep {
  title: string;
  description: string;
  resourceHint: string;
}

interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  answers: Record<string, string>;
  profile: UserAssessment;
  savedReport: any | null;
  aiInsights: string | null;
  aiSummary: string | null;
  badges: string[];
  points: number;
  events: TimelineEvent[];
  marketVisits: number;
  personalizedLearningPath: LearningStep[];
  toasts: Toast[];
  aiInteractions: number;
}

type Action = 
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_ANSWER'; questionId: string; value: string }
  | { type: 'UPDATE_PROFILE'; profile: Partial<UserAssessment> }
  | { type: 'SAVE_REPORT'; report: any }
  | { type: 'SET_AI_INSIGHTS'; insights: string }
  | { type: 'SET_AI_SUMMARY'; summary: string }
  | { type: 'ADD_BADGE'; badge: string }
  | { type: 'ADD_POINTS'; amount: number }
  | { type: 'INCREMENT_MARKET_VISITS' }
  | { type: 'INCREMENT_AI_INTERACTION' }
  | { type: 'LOG_EVENT'; event: Omit<TimelineEvent, 'id' | 'timestamp'> }
  | { type: 'SET_LEARNING_PATH'; path: LearningStep[] }
  | { type: 'ADD_TOAST'; message: string; toastType?: 'success' | 'info' }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'START_REMOVE_TOAST'; id: string }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  user: null,
  theme: 'dark',
  answers: {},
  profile: {
    fullName: 'زائر مسار',
    email: '',
    summary: 'متحمس لتطوير مساري المهني.',
    education: '',
    skills: [],
    interests: [],
    experienceLevel: 'junior',
    projects: [],
    courses: []
  },
  savedReport: null,
  aiInsights: null,
  aiSummary: null,
  badges: [],
  points: 0,
  events: [{
    id: 'init',
    type: 'level',
    title: 'نقطة الانطلاق',
    description: 'بدأت رحلتك الاستكشافية في مسار.',
    timestamp: Date.now()
  }],
  marketVisits: 0,
  personalizedLearningPath: [],
  toasts: [],
  aiInteractions: 0
};

const UserContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Renamed to generatePersonalizedLearningPath to match the import in Recommendations.tsx
export const generatePersonalizedLearningPath = (state: AppState): LearningStep[] => {
  const { profile, savedReport, level } = { ...state, level: calculateLevel(state.points) };
  const steps: LearningStep[] = [];

  if (savedReport?.primary) {
    steps.push({
      title: `إتقان أساسيات ${savedReport.primary.title}`,
      description: "تحليل متعمق للمتطلبات التقنية لهذا المسار.",
      resourceHint: "ابحث عن دورات متخصصة في منصة Coursera"
    });
  }

  if (profile.skills.length < 3) {
    steps.push({
      title: "توسيع ترسانة المهارات",
      description: "تحتاج لإضافة 3 مهارات تقنية لرفع فرصك الوظيفية.",
      resourceHint: "استخدم قسم 'مُرشد' لطلب قائمة مهارات"
    });
  }

  if (level < 3) {
    steps.push({
      title: "بناء الهوية المهنية",
      description: "أكمل تقييمك المهني لتحصل على تحليل Gemini العميق.",
      resourceHint: "انتقل إلى صفحة التقييم"
    });
  }

  return steps;
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN': return { ...state, user: action.user };
    case 'LOGOUT': return { ...state, user: null };
    case 'SET_ANSWER': return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    case 'UPDATE_PROFILE': return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'SAVE_REPORT': return { ...state, savedReport: action.report };
    case 'SET_AI_INSIGHTS': return { ...state, aiInsights: action.insights };
    case 'SET_AI_SUMMARY': return { ...state, aiSummary: action.summary };
    case 'ADD_BADGE': 
      if (state.badges.includes(action.badge)) return state;
      return { ...state, badges: [...state.badges, action.badge] };
    case 'ADD_POINTS': return { ...state, points: state.points + action.amount };
    case 'INCREMENT_MARKET_VISITS': return { ...state, marketVisits: (state.marketVisits || 0) + 1 };
    case 'INCREMENT_AI_INTERACTION': return { ...state, aiInteractions: (state.aiInteractions || 0) + 1 };
    case 'LOG_EVENT':
      return { ...state, events: [{ ...action.event, id: Math.random().toString(), timestamp: Date.now() }, ...state.events] };
    case 'SET_LEARNING_PATH': return { ...state, personalizedLearningPath: action.path };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Math.random().toString(), message: action.message, type: action.toastType || 'success' }] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'RESET_STATE': return initialState;
    default: return state;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Updated to use the renamed function generatePersonalizedLearningPath
    const path = generatePersonalizedLearningPath(state);
    dispatch({ type: 'SET_LEARNING_PATH', path });
  }, [state.points, state.profile.skills.length]);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

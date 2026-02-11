
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { UserAssessment, TimelineEvent } from '../types';
import { checkBadgeEligibility } from '../utils/pointsCalculator';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

interface User {
  email: string;
  token: string;
}

type ThemeType = 'dark' | 'light' | 'glass' | 'bento';

interface AppState {
  user: User | null;
  theme: ThemeType;
  answers: Record<string, string>;
  profile: UserAssessment;
  savedReport: any | null;
  aiInsights: string | null;
  aiSummary: string | null;
  badges: string[];
  points: number;
  events: TimelineEvent[];
  marketVisits: number;
  marketVisitsDaily: Record<string, boolean>;
  personalizedLearningPath: string[];
  toasts: Toast[];
  notes: Record<string, string>;
  aiInteractions: number;
}

type Action = 
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; theme: ThemeType }
  | { type: 'SET_ANSWER'; questionId: string; value: string }
  | { type: 'UPDATE_PROFILE'; profile: Partial<UserAssessment> }
  | { type: 'SAVE_REPORT'; report: any }
  | { type: 'SET_AI_INSIGHTS'; insights: string }
  | { type: 'SET_AI_SUMMARY'; summary: string }
  | { type: 'ADD_PROJECT'; project: any }
  | { type: 'REMOVE_PROJECT'; id: string }
  | { type: 'ADD_COURSE'; course: any }
  | { type: 'REMOVE_COURSE'; id: string }
  | { type: 'ADD_BADGE'; badge: string }
  | { type: 'ADD_POINTS'; amount: number }
  | { type: 'INCREMENT_MARKET_VISITS' }
  | { type: 'INCREMENT_AI_INTERACTION' }
  | { type: 'LOG_EVENT'; event: Omit<TimelineEvent, 'id' | 'timestamp'> }
  | { type: 'SET_LEARNING_PATH'; path: string[] }
  | { type: 'ADD_TOAST'; message: string; toastType?: 'success' | 'info' }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'SET_NOTE'; careerId: string; note: string }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  user: null,
  theme: 'dark',
  answers: {},
  profile: {
    fullName: 'زائر مسار',
    email: '',
    summary: 'متحمس لتطوير مساري المهني باستخدام أحدث التقنيات.',
    education: '',
    skills: [],
    interests: [],
    experienceLevel: 'junior',
    currentRole: '',
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
    title: 'بداية الرحلة',
    description: 'انضممت إلى منصة مسار وبدأت التخطيط لمستقبلك المهني.',
    timestamp: Date.now()
  }],
  marketVisits: 0,
  marketVisitsDaily: {},
  personalizedLearningPath: [],
  toasts: [],
  notes: {},
  aiInteractions: 0
};

const UserContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'SAVE_REPORT':
      return { ...state, savedReport: action.report };
    case 'SET_AI_INSIGHTS':
      return { ...state, aiInsights: action.insights };
    case 'SET_AI_SUMMARY':
      return { ...state, aiSummary: action.summary };
    case 'ADD_PROJECT':
      return { ...state, profile: { ...state.profile, projects: [...state.profile.projects, action.project] } };
    case 'REMOVE_PROJECT':
      return { ...state, profile: { ...state.profile, projects: state.profile.projects.filter(p => p.id !== action.id) } };
    case 'ADD_COURSE':
      return { ...state, profile: { ...state.profile, courses: [...state.profile.courses, action.course] } };
    case 'REMOVE_COURSE':
      return { ...state, profile: { ...state.profile, courses: state.profile.courses.filter(c => c.id !== action.id) } };
    case 'ADD_BADGE':
      if (state.badges.includes(action.badge)) return state;
      return { ...state, badges: [...state.badges, action.badge] };
    case 'ADD_POINTS':
      return { ...state, points: state.points + action.amount };
    case 'INCREMENT_MARKET_VISITS':
      return { ...state, marketVisits: state.marketVisits + 1 };
    case 'INCREMENT_AI_INTERACTION':
      return { ...state, aiInteractions: state.aiInteractions + 1 };
    case 'LOG_EVENT':
      const newEvent: TimelineEvent = { ...action.event, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() };
      return { ...state, events: [newEvent, ...state.events].slice(0, 50) };
    case 'SET_LEARNING_PATH':
      return { ...state, personalizedLearningPath: action.path };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Math.random().toString(36).substr(2, 9), message: action.message, type: action.toastType || 'success' }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'SET_NOTE':
      return { ...state, notes: { ...state.notes, [action.careerId]: action.note } };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const saved = localStorage.getItem('masar_app_state');
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem('masar_app_state', JSON.stringify(state));
    const eligible = checkBadgeEligibility(state);
    eligible.forEach(badgeId => {
      if (!state.badges.includes(badgeId)) {
        dispatch({ type: 'ADD_BADGE', badge: badgeId });
        dispatch({ type: 'ADD_TOAST', message: `مبروك! حصلت على وسام جديد` });
      }
    });
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

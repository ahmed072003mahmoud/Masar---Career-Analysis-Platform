
import badgesData from '../data/badges';

export const POINTS_PER_LEVEL = 100;

export const calculateLevel = (totalPoints: number) => {
  return Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
};

export const calculateProgressToNextLevel = (totalPoints: number) => {
  return totalPoints % POINTS_PER_LEVEL;
};

export const getActionPoints = (actionType: string): number => {
  const pointsMap: Record<string, number> = {
    'complete_questionnaire': 50,
    'add_project': 20,
    'add_course': 15,
    'daily_visit': 10,
    'visit_market': 5,
    'share_report': 15,
    'ai_usage': 10
  };
  return pointsMap[actionType] || 0;
};

export const checkBadgeEligibility = (state: any) => {
  const eligibleBadges: string[] = [];
  
  // Logic for Analyzer
  if (Object.keys(state.answers).length >= 10) {
    eligibleBadges.push('analyzer');
  }
  
  // Logic for Skill Builder
  if (state.profile.courses.length > 0 || state.profile.skills.length >= 5) {
    eligibleBadges.push('skill-builder');
  }
  
  // Logic for Project Maker
  if (state.profile.projects.length > 0) {
    eligibleBadges.push('project-maker');
  }

  // Logic for Market Explorer
  if (state.marketVisits >= 3) {
    eligibleBadges.push('market-explorer');
  }
  
  // Logic for Persistent
  if (state.points >= 500) {
    eligibleBadges.push('persistent');
  }

  // Logic for AI Enthusiast - awarded after 5 interactions
  if (state.aiInteractions >= 5) {
    eligibleBadges.push('ai-enthusiast');
  }
  
  return eligibleBadges;
};

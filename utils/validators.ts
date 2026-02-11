import { UserAssessment } from '../types';

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateFullName = (name: string): boolean => {
  return name.length >= 3 && !/\d/.test(name);
};

export const isProfileComplete = (profile: UserAssessment): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  if (!profile.fullName || profile.fullName === 'زائر مسار') missingFields.push('الاسم الكامل');
  if (!profile.email || !validateEmail(profile.email)) missingFields.push('البريد الإلكتروني');
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

export const isAssessmentComplete = (answers: Record<string, string>): boolean => {
  /**
   * We consider the assessment complete if the final question is answered 
   * OR if there are at least 8 answers (allowing some dynamic path variations).
   */
  const answerCount = Object.keys(answers).length;
  const hasFinalAnswer = !!answers['final_5'];
  
  return hasFinalAnswer || answerCount >= 8;
};

import { UserAssessment } from '../types';

/**
 * Sanitizes input string by removing common HTML tags to prevent basic XSS.
 */
const sanitize = (val: string): string => {
  return val.replace(/<[^>]*>?/gm, '').trim();
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateFullName = (name: string): boolean => {
  const sanitized = sanitize(name);
  // Allow Arabic and Latin characters, spaces, dots
  const re = /^[a-zA-Z\s\u0600-\u06FF.]+$/;
  return sanitized.length >= 3 && sanitized.length <= 50 && re.test(sanitized);
};

export const isNotEmpty = (val: string): boolean => {
  return sanitize(val).length > 0;
};

export const isProfileComplete = (profile: UserAssessment): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  if (!validateFullName(profile.fullName)) missingFields.push('الاسم الكامل (3 أحرف على الأقل، أحرف فقط)');
  if (!validateEmail(profile.email)) missingFields.push('البريد الإلكتروني (صيغة غير صحيحة)');
  if (!isNotEmpty(profile.education)) missingFields.push('المؤهل التعليمي');
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

export const isAssessmentComplete = (answers: Record<string, string>): boolean => {
  const hasFinalAnswer = !!answers['final_5'];
  return hasFinalAnswer;
};

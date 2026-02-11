
export const formatCurrency = (amount: string) => {
  return amount.replace('ريال', 'ر.س');
};

export const getCompatibilityColor = (score: number) => {
  if (score >= 85) return 'text-green-600';
  if (score >= 65) return 'text-brand-light';
  return 'text-gray-500';
};

export const getBadgeLabel = (score: number) => {
  if (score >= 90) return 'مطابق تماماً';
  if (score >= 75) return 'مناسب جداً';
  return 'مسار بديل';
};

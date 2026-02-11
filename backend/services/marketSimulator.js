
const SKILLS_POOL = [
  'الذكاء الاصطناعي', 'تطوير الويب', 'الأمن السيبراني', 'تحليل البيانات', 
  'الحوسبة السحابية', 'إدارة المشاريع', 'التسويق الرقمي', 'تصميم واجهة المستخدم',
  'البرمجة بلغة بايثون', 'هندسة النظم'
];

const JOB_TITLES = [
  'مطور برمجيات', 'محلل بيانات', 'مهندس أمن', 'مدير مشاريع تقنية', 
  'مصمم واجهات', 'مهندس سحابة', 'أخصائي ذكاء اصطناعي'
];

const REGIONS = ['الرياض', 'جدة', 'الدمام', 'نيوم'];

const GROWTH_AREAS = [
  'الطاقة المتجددة', 'التقنية المالية', 'الرعاية الصحية الرقمية', 
  'اللوجستيات الذكية', 'السياحة والضيافة', 'التصنيع المتقدم'
];

export const getTopSkills = () => {
  return [...SKILLS_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map(skill => ({
      name: skill,
      demand: Math.floor(Math.random() * 40) + 60 // 60-100
    }));
};

export const getGrowthAreas = () => {
  return [...GROWTH_AREAS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(area => ({
      name: area,
      growth: Math.floor(Math.random() * 20) + 5 // 5-25%
    }));
};

export const getSalaryData = () => {
  return [...JOB_TITLES]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map(title => ({
      name: title,
      min: Math.floor(Math.random() * 5000) + 8000,
      max: Math.floor(Math.random() * 7000) + 15000
    }));
};

export const getGeographicDistribution = () => {
  return REGIONS.map(region => ({
    name: region,
    value: Math.floor(Math.random() * 50) + 10
  }));
};

export const generateFullMarketReport = () => {
  return {
    timestamp: Date.now(),
    skills: getTopSkills(),
    growth: getGrowthAreas(),
    salaries: getSalaryData(),
    distribution: getGeographicDistribution()
  };
};

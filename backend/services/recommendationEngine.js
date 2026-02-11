
/**
 * Professional Career Paths Database
 */
const CAREER_PATHS = {
  software_dev: {
    title: 'مطور برمجيات متكامل',
    description: 'بناء وصيانة تطبيقات الويب والموبايل باستخدام لغات برمجية حديثة.',
    skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Git', 'حل المشكلات'],
    certs: ['AWS Certified Developer', 'Meta Full Stack Certificate'],
    salary: '12,000 - 25,000 ريال',
    growth: 'مرتفع جداً'
  },
  ai_data: {
    title: 'أخصائي ذكاء اصطناعي وبيانات',
    description: 'تحليل البيانات الضخمة وبناء نماذج تعلم آلي للتنبؤ وحل المشكلات المعقدة.',
    skills: ['Python', 'SQL', 'TensorFlow', 'الإحصاء', 'تصوير البيانات'],
    certs: ['Google Data Analytics', 'IBM AI Engineering'],
    salary: '15,000 - 30,000 ريال',
    growth: 'نمو متسارع'
  },
  cybersecurity: {
    title: 'مهندس أمن سيبراني',
    description: 'حماية الأنظمة والشبكات من الاختراقات الأمنية والتهديدات الرقمية.',
    skills: ['أمن الشبكات', 'التشفير', 'لينكس', 'اختبار الاختراق', 'إدارة المخاطر'],
    certs: ['CompTIA Security+', 'CISSP', 'CEH'],
    salary: '14,000 - 28,000 ريال',
    growth: 'مستقر ومرتفع'
  },
  uiux_design: {
    title: 'مصمم تجربة وواجهة مستخدم',
    description: 'تصميم رحلات مستخدم سلسة وواجهات بصرية جذابة للمنتجات الرقمية.',
    skills: ['Figma', 'علم نفس المستخدم', 'التفكير التصميمي', 'النماذج الأولية'],
    certs: ['Google UX Design Professional', 'Interaction Design Foundation'],
    salary: '10,000 - 20,000 ريال',
    growth: 'مرتفع'
  },
  digital_marketing: {
    title: 'خبير تسويق رقمي',
    description: 'إدارة الحملات الإعلانية وتحليل سلوك المستهلك عبر المنصات الرقمية.',
    skills: ['SEO', 'Google Ads', 'تحليل البيانات', 'كتابة المحتوى', 'إدارة المنصات'],
    certs: ['Google Ads Search', 'HubSpot Inbound Marketing'],
    salary: '9,000 - 18,000 ريال',
    growth: 'مستقر'
  },
  project_management: {
    title: 'مدير مشاريع تقنية',
    description: 'تخطيط وتنفيذ المشاريع البرمجية وضمان تسليمها في الوقت المحدد والجودة المطلوبة.',
    skills: ['Agile', 'Scrum', 'إدارة الفريق', 'حل النزاعات', 'التخطيط الاستراتيجي'],
    certs: ['PMP', 'Certified Scrum Master (CSM)'],
    salary: '13,000 - 25,000 ريال',
    growth: 'مرتفع'
  },
  finance_analyst: {
    title: 'محلل مالي رقمي',
    description: 'استخدام التقنية والبيانات لتحليل الأداء المالي وتقديم استشارات استثمارية.',
    skills: ['التخطيط المالي', 'Excel المتقدم', 'Power BI', 'إدارة الأصول'],
    certs: ['CFA Level 1', 'FMVA'],
    salary: '11,000 - 22,000 ريال',
    growth: 'مستقر'
  },
  cloud_architect: {
    title: 'معماري سحابة',
    description: 'تصميم وإدارة البنى التحتية السحابية لضمان كفاءة وتوفر الأنظمة.',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'أمن السحابة'],
    certs: ['AWS Solutions Architect', 'Google Cloud Architect'],
    salary: '16,000 - 32,000 ريال',
    growth: 'مرتفع جداً'
  }
};

/**
 * Calculates career matches based on user profile
 */
export const generateRecommendations = async (profile) => {
  const scores = {
    software_dev: 0,
    ai_data: 0,
    cybersecurity: 0,
    uiux_design: 0,
    digital_marketing: 0,
    project_management: 0,
    finance_analyst: 0,
    cloud_architect: 0
  };

  const answers = profile.answers || {};

  // Question 1: Basic Field
  if (answers.basics_1 === 'eng') {
    scores.software_dev += 20;
    scores.cloud_architect += 20;
    scores.cybersecurity += 15;
    scores.ai_data += 15;
  } else if (answers.basics_1 === 'bus') {
    scores.project_management += 20;
    scores.finance_analyst += 20;
    scores.digital_marketing += 15;
  } else if (answers.basics_1 === 'art') {
    scores.uiux_design += 25;
    scores.digital_marketing += 15;
  }

  // Question 2-4: Specific Tools
  if (answers.tech_1 === 'js') scores.software_dev += 25;
  if (answers.tech_1 === 'py') scores.ai_data += 25;
  if (answers.tech_1 === 'cloud') scores.cloud_architect += 25;
  
  if (answers.art_1 === 'uiux') scores.uiux_design += 25;
  if (answers.bus_1 === 'fin') scores.finance_analyst += 25;
  if (answers.bus_1 === 'mkt') scores.digital_marketing += 25;

  // Question 6: Soft Skills
  if (answers.soft_1 === 'analysis') {
    scores.ai_data += 10;
    scores.cybersecurity += 10;
    scores.finance_analyst += 10;
  } else if (answers.soft_1 === 'collab') {
    scores.project_management += 15;
    scores.uiux_design += 10;
  }

  // Question 9: Goals
  if (answers.goal_1 === 'expert') {
    scores.software_dev += 10;
    scores.ai_data += 10;
    scores.cloud_architect += 10;
  } else if (answers.goal_1 === 'manager') {
    scores.project_management += 20;
  }

  // Question 15: AI Sentiment
  if (answers.final_5 === 'excited') {
    scores.ai_data += 15;
    scores.software_dev += 10;
  }

  // Sort and Map results
  const sortedPaths = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([key, score]) => ({
      id: key,
      ...CAREER_PATHS[key],
      compatibility: Math.min(100, Math.max(30, score + 40)) // Base + logic
    }));

  return {
    primary: sortedPaths[0],
    alternatives: sortedPaths.slice(1, 3),
    insights: {
      marketDemand: 85,
      totalQuestions: 15,
      analysisTimestamp: Date.now()
    }
  };
};


export interface Badge {
  id: string;
  name: string;
  description: string;
  points: number;
  requirement: string;
}

const badgesData: Badge[] = [
  {
    "id": "analyzer",
    "name": "محلل المسارات",
    "description": "منح هذا الوسام لإتمام التقييم المهني العميق لأول مرة.",
    "points": 50,
    "requirement": "complete_questionnaire"
  },
  {
    "id": "skill-builder",
    "name": "باني المهارات",
    "description": "يمنح عند إضافة أول دورة تدريبية أو 5 مهارات جديدة.",
    "points": 30,
    "requirement": "add_course_or_skills"
  },
  {
    "id": "project-maker",
    "name": "صانع المشاريع",
    "description": "يمنح عند توثيق أول مشروع عملي في الملف الشخصي.",
    "points": 40,
    "requirement": "add_project"
  },
  {
    "id": "market-explorer",
    "name": "مستكشف السوق",
    "description": "يمنح عند زيارة صفحة اتجاهات السوق وتحديث البيانات.",
    "points": 20,
    "requirement": "visit_market"
  },
  {
    "id": "persistent",
    "name": "المثابر المهني",
    "description": "يمنح للوصول إلى 500 نقطة خبرة إجمالية.",
    "points": 100,
    "requirement": "reach_500_points"
  },
  {
    "id": "ai-enthusiast",
    "name": "محب الذكاء الاصطناعي",
    "description": "يمنح لاستخدام أدوات الذكاء الاصطناعي (البوت أو توليد الصور) 5 مرات.",
    "points": 60,
    "requirement": "use_ai_features_5_times"
  }
];

export default badgesData;

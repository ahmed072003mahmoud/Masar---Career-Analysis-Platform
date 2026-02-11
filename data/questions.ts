
export interface QuestionOption {
  value: string;
  label: string;
  nextId?: string;
}

export interface Question {
  id: string;
  text: string;
  description: string;
  tooltip?: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: "basics_1",
    text: "ما هو مجالك الدراسي الأساسي؟",
    description: "نحتاج لمعرفة تخصصك الأكاديمي لتحديد نقطة الانطلاق الصحيحة لمسارك.",
    tooltip: "التخصص الأكاديمي هو حجر الزاوية، لكنه ليس العائق الوحيد. سنقوم بمطابقته مع اهتماماتك التقنية لاحقاً.",
    options: [
      { value: "eng", label: "الهندسة والعلوم التقنية", nextId: "tech_1" },
      { value: "bus", label: "الإدارة والاقتصاد", nextId: "bus_1" },
      { value: "art", label: "الفنون والتصميم", nextId: "art_1" },
      { value: "other", label: "مجال آخر", nextId: "basics_2" }
    ]
  },
  {
    id: "tech_1",
    text: "ما هي لغة البرمجة أو الأداة التقنية التي تتقنها أكثر؟",
    description: "المهارات التقنية الصلبة هي الركيزة الأساسية في العصر الرقمي.",
    tooltip: "اختيارك هنا يحدد مدى توافقك مع مسارات التطوير البرمجي مقابل مسارات هندسة النظم أو البيانات.",
    options: [
      { value: "js", label: "JavaScript / TypeScript", nextId: "soft_1" },
      { value: "py", label: "Python / AI Tools", nextId: "soft_1" },
      { value: "cloud", label: "Cloud Services (AWS/Azure)", nextId: "soft_1" },
      { value: "none", label: "أدوات برمجية بسيطة", nextId: "soft_1" }
    ]
  },
  {
    id: "bus_1",
    text: "ما هو الجانب المفضل لديك في إدارة الأعمال؟",
    description: "تحديد الاهتمامات الإدارية يساعد في توجيهك نحو القيادة أو العمليات.",
    tooltip: "إدارة الأعمال مجال واسع؛ هل تفضل لغة الأرقام (المالية) أم لغة الإقناع (التسويق)؟",
    options: [
      { value: "fin", label: "المالية والمحاسبة", nextId: "soft_1" },
      { value: "mkt", label: "التسويق والإبداع الرقمي", nextId: "soft_1" },
      { value: "ops", label: "إدارة العمليات واللوجستيات", nextId: "soft_1" }
    ]
  },
  {
    id: "art_1",
    text: "ما هي المنصة الإبداعية المفضلة لديك؟",
    description: "الفنون البصرية تتطلب مهارات متنوعة، اختر ما يمثلك.",
    tooltip: "التصميم الرقمي يجمع بين الجمالية والوظيفة. اختيارك سيحدد إن كنت ستميل لتصميم الواجهات أو الموشن جرافيك.",
    options: [
      { value: "uiux", label: "تصميم واجهة وتجربة المستخدم", nextId: "soft_1" },
      { value: "motion", label: "الموشن جرافيك والفيديو", nextId: "soft_1" },
      { value: "3d", label: "النمذجة ثلاثية الأبعاد", nextId: "soft_1" }
    ]
  },
  {
    id: "basics_2",
    text: "هل تفضل العمل مع الأرقام والبيانات أم مع الناس والتواصل؟",
    description: "توازن الشخصية بين التحليل والتواصل يحدد طبيعة الوظائف المثالية.",
    tooltip: "الميول التحليلية توجهك نحو هندسة البيانات، بينما الميول التواصلية توجهك نحو إدارة المنتجات أو المبيعات التقنية.",
    options: [
      { value: "data", label: "البيانات والتحليل المنطقي", nextId: "soft_1" },
      { value: "people", label: "التواصل وإدارة العلاقات", nextId: "soft_1" }
    ]
  },
  {
    id: "soft_1",
    text: "كيف تتعامل مع المشكلات المفاجئة في العمل؟",
    description: "القدرة على حل المشكلات هي من أهم مهارات القرن الحادي والعشرين.",
    tooltip: "هذا السؤال يكشف عن نمطك السلوكي (Agile mindset) ومدى قدرتك على التحمل تحت الضغط.",
    options: [
      { value: "analysis", label: "أحللها بعمق قبل اتخاذ أي قرار", nextId: "env_1" },
      { value: "action", label: "أتحرك بسرعة لإيجاد حل فوري", nextId: "env_1" },
      { value: "collab", label: "أطلب المساعدة وأعمل مع الفريق", nextId: "env_1" }
    ]
  },
  {
    id: "env_1",
    text: "ما هي بيئة العمل التي تمنحك أكبر قدر من الإنتاجية؟",
    description: "البيئة المحيطة تؤثر بشكل مباشر على جودة مخرجاتك.",
    tooltip: "ثقافة العمل تتراوح بين الحرية المطلقة (عن بعد) والانضباط الهيكلي (المكتب). اختر ما يناسب شخصيتك.",
    options: [
      { value: "remote", label: "العمل عن بُعد بالكامل", nextId: "env_2" },
      { value: "office", label: "المكتب التقليدي والتفاعل المباشر", nextId: "env_2" },
      { value: "hybrid", label: "النظام الهجين (مرونة في المكان)", nextId: "env_2" }
    ]
  },
  {
    id: "env_2",
    text: "هل تفضل العمل في شركة ناشئة أم مؤسسة كبرى؟",
    description: "الشركات الناشئة تمنح سرعة، والمؤسسات الكبرى تمنح استقراراً.",
    tooltip: "الشركات الناشئة تتطلب 'ارتداء عدة قبعات'، بينما المؤسسات الكبرى توفر مساراً وظيفياً واضحاً ومتخصصاً.",
    options: [
      { value: "startup", label: "شركة ناشئة متغيرة وسريعة", nextId: "goal_1" },
      { value: "enterprise", label: "مؤسسة حكومية أو شركة كبرى", nextId: "goal_1" }
    ]
  },
  {
    id: "goal_1",
    text: "ما هو هدفك المهني الرئيسي خلال السنوات الخمس القادمة؟",
    description: "طموحك هو المحرك الأساسي لخارطة الطريق التي سنرسمها.",
    tooltip: "هل تبحث عن العمق التقني (خبير) أم عن التأثير التنظيمي (مدير) أم عن الاستقلالية (رائد أعمال)؟",
    options: [
      { value: "expert", label: "أن أكون خبيراً تقنياً يشار إليه بالبنان", nextId: "goal_2" },
      { value: "manager", label: "الوصول لمنصب إداري أو قيادي", nextId: "goal_2" },
      { value: "entrepreneur", label: "تأسيس مشروعي الخاص", nextId: "goal_2" }
    ]
  },
  {
    id: "goal_2",
    text: "كم عدد الساعات التي تخصصها أسبوعياً لتعلم مهارات جديدة؟",
    description: "التعلم المستمر هو سر البقاء في سوق عمل متطور.",
    tooltip: "معدل التعلم يحدد مدى سرعة تقدمك في سلم الرواتب ومرونتك في تغيير التخصصات عند الحاجة.",
    options: [
      { value: "high", label: "أكثر من 10 ساعات", nextId: "final_1" },
      { value: "mid", label: "من 3 إلى 5 ساعات", nextId: "final_1" },
      { value: "low", label: "ساعة واحدة أو أقل", nextId: "final_1" }
    ]
  },
  {
    id: "final_1",
    text: "ما الذي يحفزك أكثر في العمل؟",
    description: "المحفزات النفسية تحدد مدى استمرارك في شغفك المهني.",
    tooltip: "فهم محركاتك الذاتية يساعدنا في اقتراح بيئات عمل تضمن لك الرضا الوظيفي طويل الأمد.",
    options: [
      { value: "money", label: "العائد المادي والمكافآت", nextId: "final_2" },
      { value: "impact", label: "الأثر الاجتماعي وتغيير حياة الناس", nextId: "final_2" },
      { value: "freedom", label: "الحرية والاستقلالية في القرار", nextId: "final_2" }
    ]
  },
  {
    id: "final_2",
    text: "هل تتقن اللغة الإنجليزية بشكل كافٍ للعمل في بيئات عالمية؟",
    description: "اللغة تفتح آفاقاً واسعة للفرص الوظيفية الدولية.",
    tooltip: "اللغة الإنجليزية هي لغة التقنية والأعمال العالمية. إتقانها يضاعف فرصك في الحصول على وظائف عابرة للحدود.",
    options: [
      { value: "fluent", label: "نعم، أتقنها بطلاقة", nextId: "final_3" },
      { value: "basic", label: "لدي المعرفة الأساسية فقط", nextId: "final_3" },
      { value: "none", label: "لا أجيدها حالياً", nextId: "final_3" }
    ]
  },
  {
    id: "final_3",
    text: "كيف تقيم مستوى رضاك عن مسارك المهني الحالي؟",
    description: "تقييمك الحالي يساعدنا في تحديد حجم التغيير المطلوب.",
    tooltip: "هذا السؤال يحدد ما إذا كنت بحاجة إلى 'تحسين' مسارك الحالي أو 'تغيير جذري' (Pivot) لمسار جديد كلياً.",
    options: [
      { value: "happy", label: "راضٍ جداً وأبحث عن التطوير", nextId: "final_4" },
      { value: "neutral", label: "محايد وأفكر في فرص بديلة", nextId: "final_4" },
      { value: "unhappy", label: "غير راضٍ وأرغب في تغيير جذري", nextId: "final_4" }
    ]
  },
  {
    id: "final_4",
    text: "هل تمتلك شهادات مهنية معتمدة في مجالك؟",
    description: "الشهادات تعزز من مصداقيتك في سوق العمل.",
    tooltip: "الشهادات المهنية (PMP, AWS, Google) تعطي إشارة قوية للموظفين بمدى جديتك واحترافيتك.",
    options: [
      { value: "yes", label: "نعم، لدي عدة شهادات", nextId: "final_5" },
      { value: "no", label: "لا، لكني أخطط للحصول عليها", nextId: "final_5" }
    ]
  },
  {
    id: "final_5",
    text: "ما هو شعورك تجاه الذكاء الاصطناعي في مجالك؟",
    description: "نظرتك للتقنيات الحديثة تحدد مدى استعدادك للمستقبل.",
    tooltip: "الذكاء الاصطناعي ليس تهديداً بل هو أداة تعزيز. مدى انفتاحك عليه سيحدد مدى صمود مهاراتك في المستقبل.",
    options: [
      { value: "excited", label: "متحمس وأستخدمه في مهامي اليومية", nextId: "END" },
      { value: "worried", label: "قلق من استبدال البشر بالآلة", nextId: "END" },
      { value: "skeptical", label: "أرى أنه مجرد صيحة عابرة", nextId: "END" }
    ]
  }
];

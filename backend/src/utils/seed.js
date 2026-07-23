/**
 * Seed the unified database with demo content and a demo client account.
 * Run:  npm run seed
 *
 * Demo login →  email: client@lawhub.eg   password: Client@123
 * (Cases/favorites are attached to this user, so logging in shows real data.
 *  Registering a brand-new account instead shows the empty-state screen.)
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Lawyer from '../models/lawyer.model.js';
import Review from '../models/review.model.js';
import Article from '../models/article.model.js';
import Category from '../models/category.model.js';
import Case from '../models/case.model.js';
import Consultation from '../models/consultation.model.js';
import Favorite from '../models/favorite.model.js';
// Phase C models
import Appointment  from '../models/appointment.model.js';
import Member       from '../models/member.model.js';
import LawyerReview from '../models/lawyerReview.model.js';
import Plan         from '../models/plan.model.js';
import Profile      from '../models/profile.model.js';
// Phase D models
import ContractTemplate from '../models/template.model.js';
import Transaction      from '../models/transaction.model.js';
import AnalysisReport   from '../models/analysis.model.js';
import CaseAdvice       from '../models/advice.model.js';


const CATEGORIES = [
  { key: 'criminal', label: 'جنائي', icon: 'FiShield', count: 128 },
  { key: 'civil', label: 'مدني', icon: 'FiBookOpen', count: 214 },
  { key: 'corporate', label: 'شركات', icon: 'FiBriefcase', count: 96 },
  { key: 'family', label: 'أحوال شخصية', icon: 'FiUsers', count: 173 },
  { key: 'labor', label: 'عمالي', icon: 'FiTool', count: 87 },
  { key: 'realestate', label: 'عقاري', icon: 'FiHome', count: 142 },
  { key: 'tax', label: 'ضرائب', icon: 'FiPercent', count: 64 },
  { key: 'ip', label: 'ملكية فكرية', icon: 'FiAward', count: 39 },
];

const LAWYERS = [
  { name: 'المستشار أحمد الجندي', title: 'محامٍ بالنقض والدستورية العليا', specialties: ['جنائي', 'دستوري'], city: 'القاهرة', area: 'وسط البلد', rating: 4.9, reviews: 214, experience: 18, hourlyRate: 800, verified: true, lat: 30.0444, lng: 31.2357, avatarSeed: 'ahmed', online: true, bio: 'محامٍ متخصص في القضايا الجنائية والدستورية مع خبرة تمتد لـ 18 عامًا أمام محكمة النقض والمحكمة الدستورية العليا. مثّلت أكثر من 600 قضية بنسبة نجاح عالية.', wins: 540, languages: ['العربية', 'الإنجليزية'] },
  { name: 'المستشارة منى شعبان', title: 'خبيرة قانون الأحوال الشخصية', specialties: ['أحوال شخصية', 'مدني'], city: 'الجيزة', area: 'المهندسين', rating: 4.8, reviews: 176, experience: 14, hourlyRate: 600, verified: true, lat: 30.0561, lng: 31.2001, avatarSeed: 'mona', online: false, bio: 'متخصصة في قضايا الأسرة والحضانة والنفقة والطلاق، بخبرة 14 عامًا وأسلوب يركّز على الحلول الودّية أولًا قبل التقاضي.', wins: 410, languages: ['العربية'] },
  { name: 'المستشار كريم عبد الحليم', title: 'مستشار قانوني للشركات', specialties: ['شركات', 'ضرائب'], city: 'القاهرة', area: 'التجمع الخامس', rating: 5.0, reviews: 98, experience: 11, hourlyRate: 950, verified: true, lat: 30.0271, lng: 31.4914, avatarSeed: 'kareem', online: true, bio: 'مستشار قانوني للشركات والاستثمار، متخصص في العقود التجارية والامتثال الضريبي وتأسيس الكيانات. عملت مع شركات متعددة الجنسيات.', wins: 260, languages: ['العربية', 'الإنجليزية'] },
  { name: 'المستشار طارق منصور', title: 'محامٍ عقاري ومدني', specialties: ['عقاري', 'مدني'], city: 'الإسكندرية', area: 'سموحة', rating: 4.7, reviews: 143, experience: 16, hourlyRate: 550, verified: true, lat: 31.2156, lng: 29.9553, avatarSeed: 'tarek', online: false, bio: 'خبير في المنازعات العقارية وعقود البيع والإيجار وتقنين الأوضاع، بخبرة 16 عامًا في محاكم الإسكندرية.', wins: 380, languages: ['العربية'] },
  { name: 'المستشارة سارة فؤاد', title: 'محامية عمالية وحقوق إنسان', specialties: ['عمالي', 'مدني'], city: 'القاهرة', area: 'مدينة نصر', rating: 4.6, reviews: 87, experience: 9, hourlyRate: 450, verified: true, lat: 30.0511, lng: 31.3656, avatarSeed: 'sara', online: true, bio: 'متخصصة في نزاعات العمل والفصل التعسفي ومستحقات نهاية الخدمة، مع اهتمام خاص بقضايا حقوق الإنسان.', wins: 190, languages: ['العربية', 'الفرنسية'] },
  { name: 'المستشار خالد الأحمدي', title: 'محامٍ للملكية الفكرية', specialties: ['ملكية فكرية', 'شركات'], city: 'الجيزة', area: 'الشيخ زايد', rating: 4.9, reviews: 62, experience: 12, hourlyRate: 700, verified: true, lat: 30.0754, lng: 30.9755, avatarSeed: 'khaled', online: false, bio: 'متخصص في تسجيل العلامات التجارية وبراءات الاختراع وحماية حقوق المؤلف والنزاعات الرقمية.', wins: 150, languages: ['العربية', 'الإنجليزية'] },
];

const ARTICLES = [
  { title: 'حقوقك عند الفصل التعسفي من العمل', category: 'عمالي', readMins: 6 },
  { title: 'خطوات تسجيل علامة تجارية في مصر', category: 'ملكية فكرية', readMins: 8 },
  { title: 'دليل عقود الإيجار الجديدة 2026', category: 'عقاري', readMins: 5 },
];

const run = async () => {
  await connectDB();
  console.log('🧹 Clearing collections…');
  await Promise.all([
    User.deleteMany({ email: 'client@lawhub.eg' }),
    Lawyer.deleteMany({}), Review.deleteMany({}), Article.deleteMany({}),
    Category.deleteMany({}), Case.deleteMany({}), Consultation.deleteMany({}), Favorite.deleteMany({}),
    // Phase D
    ContractTemplate.deleteMany({}), Transaction.deleteMany({}),
    AnalysisReport.deleteMany({}), CaseAdvice.deleteMany({}),
  ]);

  // Demo client account (password hashed by the pre-save hook).
  const demo = new User({
    fullName: 'كريم العميل', email: 'client@lawhub.eg', phone: '01000000001',
    password: 'Client@123', role: 'client', city: 'القاهرة',
    isEmailVerified: true, isPhoneVerified: true, preferredLanguage: 'ar',
  });
  await demo.save();

  await Category.insertMany(CATEGORIES);
  await Article.insertMany(ARTICLES);
  const lawyers = await Lawyer.insertMany(LAWYERS);
  console.log(`✅ ${lawyers.length} lawyers, ${CATEGORIES.length} categories, ${ARTICLES.length} articles.`);

  const byName = (n) => lawyers.find((l) => l.name === n);
  const ahmed = byName('المستشار أحمد الجندي');
  await Review.insertMany([
    { lawyer: ahmed._id, author: 'محمد ع.', rating: 5, text: 'احترافية عالية ومتابعة دقيقة للقضية. أنصح به بشدة.' },
    { lawyer: ahmed._id, author: 'هبة م.', rating: 5, text: 'شرح لي كل خطوة بوضوح وكسبنا القضية. شكرًا جزيلًا.' },
    { lawyer: ahmed._id, author: 'أيمن س.', rating: 4, text: 'خبرة واضحة، التواصل ممكن يكون أسرع شوية لكن النتيجة ممتازة.' },
  ]);

  // Favorite + cases attached to the demo user.
  const tarek = byName('المستشار طارق منصور');
  const kareem = byName('المستشار كريم عبد الحليم');
  await Favorite.create({ user: demo._id, lawyer: ahmed._id });
  await Case.insertMany([
    { user: demo._id, title: 'نزاع عقد إيجار — محل تجاري', ref: 'CASE-2026-0142', lawyer: tarek._id, lawyerName: tarek.name, category: 'عقاري', status: 'in_progress', nextHearing: '2026-08-03',
      timeline: [
        { date: '2026-07-01', title: 'تم فتح القضية', done: true },
        { date: '2026-07-05', title: 'رفع صحيفة الدعوى', done: true },
        { date: '2026-07-14', title: 'جلسة أولى — تأجيل للمذكرات', done: true },
        { date: '2026-08-03', title: 'جلسة المرافعة', done: false },
      ] },
    { user: demo._id, title: 'استشارة تأسيس شركة', ref: 'CASE-2026-0138', lawyer: kareem._id, lawyerName: kareem.name, category: 'شركات', status: 'waiting', nextHearing: null,
      timeline: [
        { date: '2026-07-10', title: 'تم فتح الاستشارة', done: true },
        { date: '2026-07-12', title: 'مراجعة المستندات', done: true },
        { date: '2026-07-16', title: 'في انتظار رد العميل', done: false },
      ] },
  ]);

  // ── Phase C: Lawyer Workspace seed ──────────────────────────────
  await Promise.all([
    Appointment.deleteMany({}), Member.deleteMany({}),
    LawyerReview.deleteMany({}), Plan.deleteMany({}), Profile.deleteMany({}),
    User.deleteMany({ email: 'lawyer@lawhub.eg' }),
  ]);

  const lawyerUser = new User({
    fullName: 'المستشار أحمد الجندي', email: 'lawyer@lawhub.eg',
    phone: '01000000099', password: 'Lawyer@123',
    role: 'lawyer', city: 'القاهرة',
    isEmailVerified: true, isPhoneVerified: true, preferredLanguage: 'ar',
  });
  await lawyerUser.save();

  await Appointment.insertMany([
    { time: '10:00', client: 'محمد عبد الله', type: 'فيديو',    topic: 'نزاع عقاري',    status: 'confirmed' },
    { time: '11:30', client: 'شركة النور',    type: 'بالمكتب', topic: 'عقد شراكة',     status: 'confirmed' },
    { time: '13:00', client: 'سارة إبراهيم', type: 'هاتف',     topic: 'أحوال شخصية',  status: 'pending'   },
    { time: '15:30', client: 'أحمد فؤاد',    type: 'فيديو',    topic: 'قضية عمالية',  status: 'confirmed' },
    { day: 0, hour: '10:00', client: 'محمد عبد الله', type: 'فيديو'    },
    { day: 2, hour: '11:00', client: 'سارة إبراهيم', type: 'هاتف'     },
    { day: 3, hour: '15:00', client: 'أحمد فؤاد',    type: 'فيديو'    },
  ]);

  await Member.insertMany([
    { name: 'المستشار أحمد الجندي', role: 'شريك',          seed: 'ahmed',  cases: 12, permission: 'admin',  online: true  },
    { name: 'المستشارة منى شعبان', role: 'محامٍ أول',      seed: 'mona',   cases: 8,  permission: 'editor', online: false },
    { name: 'المستشار خالد سمير',  role: 'محامٍ',          seed: 'khaled', cases: 6,  permission: 'editor', online: true  },
    { name: 'نورا حسن',            role: 'مساعد قانوني',   seed: 'noura',  cases: 0,  permission: 'viewer', online: true  },
  ]);

  await LawyerReview.insertMany([
    { author: 'محمد ع.', rating: 5, date: 'منذ أسبوع',   text: 'احترافية عالية ومتابعة دقيقة للقضية. أنصح به بشدة.', status: 'published' },
    { author: 'هبة م.', rating: 5, date: 'منذ أسبوعين', text: 'شرح لي كل خطوة بوضوح وكسبنا القضية.',                status: 'published' },
    { author: 'أيمن س.',rating: 2, date: 'منذ شهر',     text: 'التواصل كان أبطأ من المتوقع.',                        status: 'disputed'  },
  ]);

  await Plan.insertMany([
    { key: 'pro',   name: 'Pro',   price: 499,  highlight: false, features: ['ظهور أعلى في نتائج البحث', 'حتى 30 قضية نشطة', 'تقارير أداء شهرية', 'دعم فني خلال 24 ساعة'] },
    { key: 'elite', name: 'Elite', price: 999,  highlight: true,  features: ['شارة محامٍ مميّز الذهبية', 'قضايا غير محدودة', 'أولوية في التوصيات', 'تحليلات متقدمة', 'دعم فوري مخصّص'] },
    { key: 'firm',  name: 'Firm',  price: 2499, highlight: false, features: ['كل مزايا Elite', 'إدارة فريق حتى 20 عضو', 'توزيع ذكي للقضايا', 'صفحة مكتب مخصّصة', 'مدير حساب مخصّص'] },
  ]);

  await Profile.create({
    specializations: ['جنائي', 'دستوري'], cities: ['القاهرة', 'الجيزة'],
    services: [
      { key: 'c30',      label: 'استشارة سريعة (30 دقيقة)', price: 300  },
      { key: 'c60',      label: 'استشارة موسّعة (60 دقيقة)', price: 550  },
      { key: 'contract', label: 'مراجعة/صياغة عقد',          price: 1200 },
      { key: 'rep',      label: 'تمثيل قضائي (جلسة)',         price: 2500 },
    ],
    membership: { barNumber: '123456', association: 'نقابة المحامين — القاهرة', issueDate: '2020-01-15', expiryDate: '2026-12-31', daysLeft: 167 },
    currentPlan: 'pro',
  });

  console.log('⚖️  Phase C seed complete.');
  console.log('   Lawyer login → lawyer@lawhub.eg / Lawyer@123');

  // ── Phase D: Contract Templates ─────────────────────────────────
  const F = (key, label, placeholder) => ({ key, label, type: 'text', placeholder });
  const TEMPLATES = [
    { title: 'عقد إيجار سكني', category: 'عقاري', description: 'عقد إيجار وحدة سكنية متوافق مع القانون المصري.', price: 150, aiVerified: true, rating: 4.9, downloads: 320, pages: 4, icon: 'FiHome',
      fields: [F('lessor', 'المؤجِّر'), F('lessee', 'المستأجِر'), F('unit', 'وصف الوحدة'), F('rent', 'قيمة الإيجار الشهري'), F('date', 'تاريخ السريان')],
      body: 'عقد إيجار مبرم بين {{lessor}} (المؤجِّر) و {{lessee}} (المستأجِر) بشأن {{unit}}، بقيمة إيجار شهري {{rent}} جنيهًا، يبدأ من {{date}}.' },
    { title: 'عقد بيع سيارة', category: 'مدني', description: 'عقد بيع مركبة مع إقرار استلام.', price: 100, aiVerified: true, rating: 4.7, downloads: 210, pages: 2, icon: 'FiTruck',
      fields: [F('seller', 'البائع'), F('buyer', 'المشتري'), F('car', 'بيانات السيارة'), F('price', 'الثمن'), F('date', 'تاريخ البيع')],
      body: 'أقر أنا {{seller}} ببيع السيارة {{car}} إلى {{buyer}} بمبلغ {{price}} جنيهًا بتاريخ {{date}}.' },
    { title: 'عقد تأسيس شركة ذات مسؤولية محدودة', category: 'شركات', description: 'عقد تأسيس ش.ذ.م.م مع توزيع الحصص.', price: 500, aiVerified: true, rating: 5.0, downloads: 95, pages: 8, icon: 'FiBriefcase',
      fields: [F('company', 'اسم الشركة'), F('partners', 'الشركاء'), F('capital', 'رأس المال'), F('activity', 'غرض الشركة'), F('date', 'تاريخ التأسيس')],
      body: 'تأسّست شركة {{company}} ذات المسؤولية المحدودة بين {{partners}} برأس مال {{capital}} جنيهًا لممارسة نشاط {{activity}}، اعتبارًا من {{date}}.' },
    { title: 'عقد عمل محدد المدة', category: 'عمالي', description: 'عقد عمل متوافق مع قانون العمل المصري.', price: 120, aiVerified: true, rating: 4.8, downloads: 178, pages: 3, icon: 'FiUser',
      fields: [F('employer', 'صاحب العمل'), F('employee', 'العامل'), F('job', 'المسمى الوظيفي'), F('salary', 'الأجر الشهري'), F('duration', 'مدة العقد')],
      body: 'عقد عمل بين {{employer}} و {{employee}} للعمل بوظيفة {{job}} بأجر شهري {{salary}} جنيهًا لمدة {{duration}}.' },
    { title: 'اتفاقية عدم إفصاح (NDA)', category: 'شركات', description: 'اتفاقية حماية معلومات سرية بين طرفين.', price: 200, aiVerified: true, rating: 4.9, downloads: 142, pages: 3, icon: 'FiLock',
      fields: [F('party1', 'الطرف الأول'), F('party2', 'الطرف الثاني'), F('purpose', 'غرض الإفصاح'), F('duration', 'مدة السرية'), F('date', 'تاريخ التوقيع')],
      body: 'اتفاقية عدم إفصاح بين {{party1}} و {{party2}} بخصوص {{purpose}}، تسري التزامات السرية لمدة {{duration}} من {{date}}.' },
    { title: 'توكيل رسمي عام', category: 'مدني', description: 'صيغة توكيل عام للتصرفات القانونية.', price: 90, aiVerified: true, rating: 4.6, downloads: 260, pages: 2, icon: 'FiFileText',
      fields: [F('principal', 'الموكِّل'), F('agent', 'الوكيل'), F('scope', 'نطاق التوكيل'), F('date', 'التاريخ')],
      body: 'أنا {{principal}} أوكّل {{agent}} في {{scope}}، وذلك اعتبارًا من {{date}}.' },
  ];
  await ContractTemplate.insertMany(TEMPLATES);
  console.log(`🏛️  Phase D seed complete — ${TEMPLATES.length} contract templates.`);

  console.log('🌱 Seed complete.');
  console.log('   Demo login →  client@lawhub.eg  /  Client@123');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });

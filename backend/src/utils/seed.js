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

  console.log('🌱 Seed complete.');
  console.log('   Demo login →  client@lawhub.eg  /  Client@123');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });

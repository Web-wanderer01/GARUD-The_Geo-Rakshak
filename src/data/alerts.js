/**
 * MOCK DATA: Active alerts and warnings for NER landslide monitoring.
 * Timestamps updated to reflect September 2026 (current month).
 */

export const alerts = [
  {
    id: 'ALT-001',
    severity: 'critical',
    zoneId: 'MEG-001',
    location: 'East Khasi Hills, Cherrapunji Area',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    timestamp: '2026-09-14T06:30:00+05:30',
    message: 'CRITICAL: Extreme landslide risk. 185mm rainfall in 24h with saturated soil (95%). Evacuate low-lying settlements near NH-6 immediately.',
    recommendedAction: 'Evacuate immediately. Move to designated relief camp at Shillong Community Hall. Avoid NH-6 between km 42-58.',
    translations: {
      hi: 'गंभीर: अत्यधिक भूस्खलन का खतरा। 24 घंटे में 185 मिमी बारिश। एनएच-6 के पास की बस्तियों से तुरंत निकासी करें।',
      as: 'সংকটজনক: অত্যন্ত ভূমিস্খলনৰ বিপদ। ২৪ ঘণ্টাত ১৮৫ মিমি বৰষুণ। NH-6ৰ ওচৰৰ বসতিৰ পৰা তৎক্ষণাৎ স্থানান্তৰ কৰক।',
      bn: 'জরুরি: চরম ভূমিধসের ঝুঁকি। ২৪ ঘণ্টায় ১৮৫ মিমি বৃষ্টি। NH-6 এর কাছে বসতি থেকে অবিলম্বে সরে যান।',
      mni: 'অসিবা: ময়োক্তা চানবীগী ৱাখল। পুং ২৪দা মিমি ১৮৫ নোং নাবা। NH-6 মথং মনুং তাবা থুংনদুনা লাক্তুনু।',
    },
  },
  {
    id: 'ALT-002',
    severity: 'critical',
    zoneId: 'ASM-002',
    location: 'Dima Hasao, Haflong-Silchar Rail Line',
    district: 'Dima Hasao',
    state: 'Assam',
    timestamp: '2026-09-13T14:15:00+05:30',
    message: 'CRITICAL: Major slope failure detected along Haflong-Silchar rail corridor. Track and road fully blocked. Rescue operations underway.',
    recommendedAction: 'Avoid all travel on NH-54 and Lumding-Sabroom rail line. Report to nearest NDRF camp if stranded.',
    translations: {
      hi: 'गंभीर: हाफलौंग-सिलचर रेल कॉरिडोर में बड़ी ढलान विफलता। ट्रैक और सड़क पूरी तरह अवरुद्ध। बचाव कार्य जारी।',
      as: 'সংকটজনক: হাফলং-শিলচৰ ৰেল পথত ডাঙৰ ভূমিস্খলন। ট্ৰেক আৰু পথ সম্পূৰ্ণ বন্ধ। উদ্ধাৰ কাৰ্য চলি আছে।',
      bn: 'জরুরি: হাফলং-সিলচর রেল করিডরে বড় ভূমিধস। ট্র্যাক ও রাস্তা সম্পূর্ণ বন্ধ। উদ্ধার অভিযান চলছে।',
      mni: 'অসিবা: হাফলং-সিলচর রেল লম্বীদা ময়োক্তা চানবী। লম্বী অমসুং লম্পাক খুদিংমাক থীংবা। কনবা থবক পায়খৎলি।',
    },
  },
  {
    id: 'ALT-003',
    severity: 'critical',
    zoneId: 'MNP-003',
    location: 'Noney District, Tupul Area',
    district: 'Noney',
    state: 'Manipur',
    timestamp: '2026-09-13T09:45:00+05:30',
    message: 'CRITICAL: Massive debris flow at Tupul. Multiple roads impassable. NDRF and Army rescue teams deployed.',
    recommendedAction: 'Do not enter Tupul area. NDRF and Army rescue teams deployed. Contact emergency helpline 1078.',
    translations: {
      hi: 'गंभीर: तुपुल में भारी मलबे का प्रवाह। कई सड़कें अगम्य। एनडीआरएफ और सेना बचाव दल तैनात।',
      as: 'সংকটজনক: টুপুলত ডাঙৰ বোকাৰ সোঁত। একাধিক পথ অচল। এনডিআৰএফ আৰু সেনা উদ্ধাৰ দল মোতায়েন।',
      bn: 'জরুরি: তুপুলে ভারী মলবার প্রবাহ। একাধিক রাস্তা অচল। NDRF ও সেনা উদ্ধারকারী দল মোতায়েন।',
      mni: 'অসিবা: তুপুলদা ময়োক্তা লান্মী ফারে। লম্বাক অমায়া তারিবা। এনডিআরএফ অমসুং সেনা নাও কনবা তাবা থবকশিং পায়খৎলে।',
    },
  },
  {
    id: 'ALT-004',
    severity: 'high',
    zoneId: 'ARU-001',
    location: 'Papum Pare, Itanagar Periphery',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    timestamp: '2026-09-14T11:00:00+05:30',
    message: 'HIGH RISK: Continuous rainfall for 72 hours. Multiple minor slope failures reported. Risk of escalation to critical.',
    recommendedAction: 'Residents of hilly areas must move to ground floors. Avoid hiking or outdoor activities. Stay tuned to GARUD alerts.',
    translations: {
      hi: 'उच्च जोखिम: 72 घंटे की लगातार बारिश। कई छोटे ढलान विफलताएं। गंभीर स्तर तक बढ़ने का खतरा।',
      as: 'উচ্চ বিপদ: ৭২ ঘণ্টা ধৰি বিৰামহীন বৰষুণ। একাধিক সৰু ভূমিস্খলন। গুৰুতৰ পৰ্যায়লৈ বৃদ্ধিৰ বিপদ।',
      bn: 'উচ্চ ঝুঁকি: ৭২ ঘণ্টা ধরে অবিরাম বৃষ্টি। একাধিক ছোট ভূমিধস রিপোর্ট। জরুরি অবস্থায় পরিণত হওয়ার আশংকা।',
      mni: 'শরুক্না ৱাখল: পুং ৭২দা থায়বা নোং নাবা। অমায়া অপুনবা চানবীশিং পীদ্রে। অসিবা মমিং তানা নুংশিরে।',
    },
  },
  {
    id: 'ALT-005',
    severity: 'high',
    zoneId: 'SKM-001',
    location: 'Singtam, East Sikkim',
    district: 'Gangtok',
    state: 'Sikkim',
    timestamp: '2026-09-12T16:00:00+05:30',
    message: 'HIGH: Teesta River flooding affecting NH-10 access. Singtam bridge under threat. Pre-emptive closures in effect.',
    recommendedAction: 'Do not cross the Singtam bridge. Use alternate route via Rangpo. Livestock and vehicles to be moved to higher ground.',
    translations: {
      hi: 'उच्च: तीस्ता नदी में बाढ़ NH-10 को प्रभावित कर रही है। सिंगताम पुल खतरे में। एहतियाती बंदी जारी।',
      as: 'উচ্চ: তিস্তা নদীৰ বানপানীয়ে NH-10 প্ৰভাৱিত কৰিছে। চিঙতাম দলং বিপদত। প্ৰতিৰোধমূলক বন্ধ বলবৎ।',
      bn: 'উচ্চ: তিস্তা নদীর বন্যা NH-10 প্রভাবিত করছে। সিংতাম সেতু হুমকিতে। সতর্কতামূলক বন্ধ কার্যকর।',
      mni: 'শরুক্না: তিস্তা ইরাবোল NH-10 থীংলক্লে। সিংতাম মরু খোনবগীদমক ওইনমক থীংদোক্লে।',
    },
  },
  {
    id: 'ALT-006',
    severity: 'moderate',
    zoneId: 'MIZ-001',
    location: 'Lunglei District, Tlabung Area',
    district: 'Lunglei',
    state: 'Mizoram',
    timestamp: '2026-09-11T08:30:00+05:30',
    message: 'MODERATE RISK: Localised slope movements near Tlabung. Soil saturation at 78%. Monitoring intensified.',
    recommendedAction: 'Residents near steep slopes should remain alert. Avoid cutting into slopes. Report any unusual ground movement to local authorities.',
    translations: {
      hi: 'मध्यम जोखिम: टलाबुंग के पास स्थानीय ढलान हलचल। मिट्टी संतृप्ति 78%। निगरानी तेज की गई।',
      as: 'মধ্যম বিপদ: টলাবুংৰ ওচৰত স্থানীয় ঢালৰ গতিবিধি। মাটিৰ সংতৃপ্তি ৭৮%। নিৰীক্ষণ তীব্র কৰা হৈছে।',
      bn: 'মধ্যম ঝুঁকি: টলাবুং এর কাছে স্থানীয় ঢাল আন্দোলন। মাটির স্যাচুরেশন ৭৮%। পর্যবেক্ষণ জোরদার।',
      mni: 'মথৌ ৱাখল: টলাবুং চানবী মখাদা মরু নাইরবশিং পীদ্রে। লুপা ৭৮% শংনা থেংদোক্লে। নুংশিথোংনা লৈবাক থোকচি।',
    },
  },
];

export const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-red-700', bgClass: 'bg-red-100 text-red-800 border-red-200', icon: '🔴', border: 'border-red-500' },
  high:     { label: 'High',     color: 'text-orange-700', bgClass: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🟠', border: 'border-orange-500' },
  moderate: { label: 'Moderate', color: 'text-yellow-700', bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🟡', border: 'border-yellow-500' },
  low:      { label: 'Low',      color: 'text-green-700',  bgClass: 'bg-green-100 text-green-800 border-green-200',  icon: '🟢', border: 'border-green-500' },
};

export const SEVERITY_ORDER = { critical: 0, high: 1, moderate: 2, low: 3 };

export const LANGUAGES = [
  { code: 'en',  name: 'English',  native: 'English' },
  { code: 'hi',  name: 'Hindi',    native: 'हिन्दी' },
  { code: 'as',  name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn',  name: 'Bengali',  native: 'বাংলা' },
  { code: 'mni', name: 'Meitei',   native: 'মেইতেই' },
];

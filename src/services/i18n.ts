export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App Header & Branding
    appName: 'إيكو كوليكت',
    appTagline: 'اجمع البلاستيك. اكسب النقاط. احمِ البيئة.',
    taglineSubtitle: 'المنصة الوطنية لجمع وفرز ووزن المخلفات البلاستيكية يدوياً بدون ذكاء اصطناعي',

    // Role Switcher / Personas
    personaTitle: 'تبديل الواجهة:',
    citizenRole: 'المواطن',
    companyRole: 'الشركات',
    workerRole: 'مندوب الجمع',
    adminRole: 'لوحة الإدارة',

    // First Screen / Account Types
    welcomeTitle: 'مرحباً بك في إيكو كوليكت',
    welcomeSubtitle: 'اختر نوع الحساب للبدء في جمع وتدوير البلاستيك وتحويله إلى مكافآت قيمة',
    cardCitizenTitle: 'مواطن',
    cardCitizenDesc: 'اطلب جمع النفايات البلاستيكية المنزلية واكسب نقاط مكافآت فورية.',
    cardCitizenAction: 'تسجيل حساب مواطن',
    cardCompanyTitle: 'منشأة تجارية / شركة',
    cardCompanyDesc: 'نظّم تجميع المخلفات البلاستيكية لمؤسستك بكميات كبيرة مع سجل رسمي وشهادات بيئية.',
    cardCompanyAction: 'تسجيل حساب شركة',
    cardWorkerTitle: 'مندوب توصيل وجمع',
    cardWorkerDesc: 'استلم طلبات الجمع في منطقتك، قم بوزن البلاستيك فعلياً بالميزان، وانقله لمراكز التدوير.',
    cardWorkerAction: 'الانضمام كفريق جمع',

    // Auth & SMS OTP
    loginTitle: 'تسجيل الدخول / إنشاء حساب',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    companyName: 'اسم الشركة أو المؤسسة',
    commercialRegNo: 'رقم السجل التجاري (CR)',
    mobileNumber: 'رقم الجوال',
    mobilePlaceholder: '05XXXXXXXX',
    sendOtpBtn: 'إرسال رمز التحقق SMS',
    verifyOtpTitle: 'تأكيد رقم الجوال عبر SMS',
    otpSentTo: 'أدخل رمز التحقق المكون من 4 أرقام المرسل إلى',
    demoCodeHint: 'رمز التحقق التجريبي هو:',
    verifyBtn: 'تحقق والدخول للحساب',
    resendOtp: 'إعادة إرسال الرمز',
    driverLicenseUpload: 'صورة رخصة القيادة السارية',
    vehiclePhotoUpload: 'صورة مركبة الجمع المجهزة',
    vehicleType: 'نوع المركبة',
    plateNumber: 'رقم اللوحة',
    submitWorkerApp: 'إرسال طلب الانضمام للاعتماد',
    workerPendingNotice: 'طلبك قيد مراجعة الإدارة. ستتمكن من قبول الطلبات فور اعتماد الوثائق.',

    // Citizen Dashboard
    citizenWelcome: 'أهلاً بك يا',
    pointsBalance: 'رصيد النقاط الحالي',
    pointsUnit: 'نقطة',
    totalRecycled: 'إجمالي البلاستيك المعاد تدويره',
    kgUnit: 'كجم',
    co2Saved: 'وفّر',
    co2Unit: 'كجم من انبعاثات الكربون',
    treesEquivalent: 'ما يعادل غرس',
    treesUnit: 'أشجار',
    requestCollectionBtn: 'طلب جمع البلاستيك الآن',
    myRequests: 'طلباتي النشطة',
    recentHistory: 'سجل الجمع الأخير',
    rewardsCatalog: 'استبدال النقاط بالمكافآت',
    viewAll: 'عرض الكل',

    // Company Dashboard
    companyWelcome: 'لوحة تحكم المنشأة',
    commercialIdLabel: 'السجل التجاري:',
    bulkRequestBtn: 'طلب جمع تجاري بكميات كبيرة',
    esgCertificateTitle: 'التقرير البيئي لشهادة ESG',
    commercialVolume: 'حجم البلاستيك المسترد',

    // Plastic Categories
    plasticCategoriesTitle: 'أنواع البلاستيك الـ 7 المعتمدة',
    plasticNoticeManual: 'تنبيه: الفرز والتصنيف يتم يدوياً بنسبة 100% بدون أي ذكاء اصطناعي أو خوارزميات آلية.',
    petTitle: 'PET - كود 1',
    hdpeTitle: 'HDPE - كود 2',
    pvcTitle: 'PVC - كود 3',
    ldpeTitle: 'LDPE - كود 4',
    ppTitle: 'PP - كود 5',
    psTitle: 'PS - كود 6',
    otherTitle: 'OTHER - كود 7',
    rateLabel: 'معدل المكافأة:',
    kgPerPoint: 'كجم = 1 نقطة',

    // Collection Request Flow
    newRequestTitle: 'إنشاء طلب جمع بلاستيك جديد',
    selectCategoriesHint: 'حدد أصناف البلاستيك المفرزة لديك وأدخل الوزن التقديري:',
    addCategoryBtn: 'إضافة صنف بلاستيك آخر',
    estimatedWeight: 'الوزن التقديري (كجم)',
    materialPhotoLabel: 'صورة البلاستيك المفرز (اختياري)',
    pickupLocation: 'موقع الاستلام الجغرافي',
    detectLocationBtn: 'تحديد موقعي الحالي GPS',
    addressPlaceholder: 'الحي، الشارع، رقم المبنى أو المعلم القريب',
    instructionsLabel: 'تعليمات إضافية للمندوب',
    instructionsPlaceholder: 'مثال: الأكياس موجودة عند الباب الجانبي، يرجى الاتصال قبل الوصول بـ 10 دقائق.',
    preferredTimeLabel: 'وقت الاستلام المفضل',
    confirmRequestBtn: 'مراجعة وتأكيد الطلب',
    submitSuccessTitle: 'تم إرسال طلب الجمع بنجاح!',
    submitSuccessDesc: 'تم إدراج طلبك في خريطة المناديب المعتمدين وسيقوم أقرب مندوب بقبوله والتوجه لموقعك.',

    // Delivery Worker Dashboard
    workerDashboardTitle: 'لوحة مندوب التوصيل والجمع',
    workerStatusOnline: 'متاح للجمع (متصل)',
    workerStatusOffline: 'غير متاح (غير متصل)',
    pendingApprovalBadge: 'بانتظار موافقة الإدارة',
    approvedBadge: 'حساب مندوب معتمد وموثق',
    availableRequestsCount: 'الطلبات المتاحة',
    acceptedRequestsCount: 'الطلبات المقبولة',
    completedCount: 'عمليات تم إنجازها',
    totalKgCollected: 'إجمالي الأوزان المجمعة',
    interactiveMapTitle: 'خريطة الطلبات الحية في منطقتك',
    citizenMarkerLegend: 'مواطن (أصفر)',
    companyMarkerLegend: 'شركة (أزرق)',
    availableRequestsList: 'قائمة الطلبات القريبة منك',
    distanceLabel: 'المسافة التقريبية:',
    acceptRequestBtn: 'قبول هذا الطلب',
    rejectRequestBtn: 'تجاهل',
    startNavigationBtn: 'بدء التوجيه والملاحة',
    markArrivedBtn: 'وصلت إلى موقع العميل',
    startWeighingProcessBtn: 'بدء الفحص والوزن الفعلي بالميزان',

    // Physical Weighing Process
    weighingTitle: 'إجراءات الفحص والوزن الفعلي بالميزان',
    weighingNotice: 'المندوب مسؤول بالكامل عن فحص البلاستيك يدوياً ووزنه بميزانه الإلكتروني المعتمد واستبعاد أي شوائب أو أوزان التغليف (Tare).',
    stepInspect: 'الخطوة 1: الفحص اليدوي وتأكيد صنف البلاستيك',
    stepWeigh: 'الخطوة 2: قياس الوزن الصافي الفعلي (Net Weight)',
    stepScalePhoto: 'الخطوة 3: التقاط صورة واضحة لشاشة الميزان الرقمي',
    netWeightLabel: 'الوزن الصافي الفعلي (كجم):',
    netWeightPlaceholder: 'مثال: 15.25',
    calculatedPointsLive: 'النقاط المستحقة للعميل تلقائياً:',
    scalePhotoRequired: 'صورة الميزان كدليل إثبات إلزامي',
    submitWeighingBtn: 'تأكيد الوزن واحتساب النقاط تلقائياً',
    weighingSuccessCelebration: 'تم توثيق الوزن بنجاح!',

    // Request Statuses
    statusPending: 'قيد الانتظار',
    statusAccepted: 'تم القبول',
    statusOnTheWay: 'في الطريق إليك',
    statusArrived: 'وصل المندوب للموقع',
    statusCollected: 'تم استلام البلاستيك',
    statusAwaitingVerification: 'بانتظار التحقق',
    statusCompleted: 'مكتمل ومضاف النقاط',
    statusCancelled: 'ملغي',

    // Admin Dashboard
    adminDashboardTitle: 'لوحة الإدارة المركزية والرقابة البيئية',
    tabOverview: 'نظرة عامة ومؤشرات',
    tabUsers: 'إدارة المستخدمين والمناديب',
    tabCollections: 'إدارة الطلبات والأوزان',
    tabCategories: 'أصناف البلاستيك ومعدلات النقاط',
    tabRewards: 'إدارة المكافآت والتحويل',
    tabReports: 'التقارير والإحصائيات',
    tabSchema: 'قاعدة بيانات Supabase / SQL',
    tabSettings: 'إعدادات النظام',
    totalCitizens: 'إجمالي المواطنين',
    totalCompanies: 'إجمالي الشركات',
    registeredWorkers: 'المناديب المسجلين',
    approvedWorkersCount: 'المناديب المعتمدين',
    totalRequestsCount: 'إجمالي الطلبات',
    completedRequestsCount: 'الطلبات المكتملة',
    totalWeightKg: 'إجمالي البلاستيك (كجم)',
    totalPointsDistributed: 'إجمالي النقاط الممنوحة',
    workerApprovalAction: 'اعتماد المندوب',
    workerRejectAction: 'رفض الطلب',
    workerSuspendAction: 'إيقاف الحساب',
    inspectEvidenceBtn: 'فحص صورة الميزان',
    approveWeightBtn: 'اعتماد الوزن',
    reassignWorkerBtn: 'إعادة تعيين مندوب',
    exportSqlBtn: 'نسخ كود SQL كامل',
    downloadSqlBtn: 'تحميل ملف DDL .sql',

  },
  en: {
    // App Header & Branding
    appName: 'EcoCollect',
    appTagline: 'Collect Plastic. Earn Points. Protect the Environment.',
    taglineSubtitle: 'National platform for collecting, classifying, manually weighing, and recycling plastic waste without AI',

    // Role Switcher / Personas
    personaTitle: 'Switch Role:',
    citizenRole: 'Citizen',
    companyRole: 'Company',
    workerRole: 'Delivery Worker',
    adminRole: 'Admin Dashboard',

    // First Screen / Account Types
    welcomeTitle: 'Welcome to EcoCollect',
    welcomeSubtitle: 'Choose your account type to start recycling plastic and earning valuable reward points',
    cardCitizenTitle: 'Citizen',
    cardCitizenDesc: 'Request plastic waste collection from home and earn instant reward points.',
    cardCitizenAction: 'Register as Citizen',
    cardCompanyTitle: 'Company / Business',
    cardCompanyDesc: 'Organize bulk commercial plastic waste pickups with audit trails & ESG recycling certificates.',
    cardCompanyAction: 'Register as Company',
    cardWorkerTitle: 'Delivery Worker',
    cardWorkerDesc: 'Receive pickup requests, physically inspect & weigh plastic with scales, and earn income.',
    cardWorkerAction: 'Join as Delivery Worker',

    // Auth & SMS OTP
    loginTitle: 'Sign In / Register',
    firstName: 'First Name',
    lastName: 'Last Name',
    companyName: 'Company Name',
    commercialRegNo: 'Commercial Registration (CR)',
    mobileNumber: 'Mobile Phone Number',
    mobilePlaceholder: '05XXXXXXXX',
    sendOtpBtn: 'Send SMS Verification Code',
    verifyOtpTitle: 'Verify Mobile Number via SMS',
    otpSentTo: 'Enter the 4-digit code sent to',
    demoCodeHint: 'Demo verification code is:',
    verifyBtn: 'Verify & Sign In',
    resendOtp: 'Resend Code',
    driverLicenseUpload: 'Driver License Photo',
    vehiclePhotoUpload: 'Transport Vehicle Photo',
    vehicleType: 'Vehicle Type',
    plateNumber: 'Plate Number',
    submitWorkerApp: 'Submit for Administrator Approval',
    workerPendingNotice: 'Your application is under administrative review. You will be able to accept requests once approved.',

    // Citizen Dashboard
    citizenWelcome: 'Welcome,',
    pointsBalance: 'Current Points Balance',
    pointsUnit: 'PTS',
    totalRecycled: 'Total Plastic Recycled',
    kgUnit: 'KG',
    co2Saved: 'Saved',
    co2Unit: 'KG of CO2 emissions',
    treesEquivalent: 'Equivalent to planting',
    treesUnit: 'trees',
    requestCollectionBtn: 'Request Plastic Collection Now',
    myRequests: 'My Active Requests',
    recentHistory: 'Recent Collection History',
    rewardsCatalog: 'Redeem Points for Rewards',
    viewAll: 'View All',

    // Company Dashboard
    companyWelcome: 'Company Facility Dashboard',
    commercialIdLabel: 'Commercial Reg #:',
    bulkRequestBtn: 'Request Bulk Commercial Pickup',
    esgCertificateTitle: 'ESG Recycling Statement',
    commercialVolume: 'Total Commercial Diverted',

    // Plastic Categories
    plasticCategoriesTitle: 'The 7 Official Plastic Categories',
    plasticNoticeManual: 'Notice: Classification is 100% manual. No Artificial Intelligence or auto-detection is used.',
    petTitle: 'PET - Code 1',
    hdpeTitle: 'HDPE - Code 2',
    pvcTitle: 'PVC - Code 3',
    ldpeTitle: 'LDPE - Code 4',
    ppTitle: 'PP - Code 5',
    psTitle: 'PS - Code 6',
    otherTitle: 'OTHER - Code 7',
    rateLabel: 'Reward Rate:',
    kgPerPoint: 'KG = 1 Point',

    // Collection Request Flow
    newRequestTitle: 'Create New Plastic Collection Request',
    selectCategoriesHint: 'Select sorted plastic categories and enter estimated weight in KG:',
    addCategoryBtn: 'Add Another Plastic Category',
    estimatedWeight: 'Estimated Weight (KG)',
    materialPhotoLabel: 'Sorted Plastic Photo (Optional)',
    pickupLocation: 'Collection Location & GPS',
    detectLocationBtn: 'Use Current GPS Location',
    addressPlaceholder: 'District, street, building number or landmark',
    instructionsLabel: 'Additional Instructions for Delivery Worker',
    instructionsPlaceholder: 'e.g., Bags are placed by the side gate, please call 10 mins before arrival.',
    preferredTimeLabel: 'Preferred Collection Time',
    confirmRequestBtn: 'Review & Confirm Request',
    submitSuccessTitle: 'Collection Request Submitted Successfully!',
    submitSuccessDesc: 'Your request has been broadcasted to verified workers and will be accepted shortly.',

    // Delivery Worker Dashboard
    workerDashboardTitle: 'Delivery Worker Dashboard',
    workerStatusOnline: 'Online (Available for pickups)',
    workerStatusOffline: 'Offline',
    pendingApprovalBadge: 'Pending Administrator Approval',
    approvedBadge: 'Verified & Approved Worker',
    availableRequestsCount: 'Available Requests',
    acceptedRequestsCount: 'Accepted Requests',
    completedCount: 'Collections Completed',
    totalKgCollected: 'Total Collected Weight',
    interactiveMapTitle: 'Live Request Map in Your Area',
    citizenMarkerLegend: 'Citizen (Yellow)',
    companyMarkerLegend: 'Company (Blue)',
    availableRequestsList: 'Available Requests Near You',
    distanceLabel: 'Estimated Distance:',
    acceptRequestBtn: 'Accept This Request',
    rejectRequestBtn: 'Dismiss',
    startNavigationBtn: 'Start Navigation',
    markArrivedBtn: 'Mark Arrived at Location',
    startWeighingProcessBtn: 'Start Physical Scale Weighing',

    // Physical Weighing Process
    weighingTitle: 'Physical Inspection & Scale Weighing Process',
    weighingNotice: 'The worker is solely responsible for manually verifying the plastic category and physically weighing with a calibrated scale, deducting any tare container weight.',
    stepInspect: 'Step 1: Visual Inspection & Category Confirmation',
    stepWeigh: 'Step 2: Measure Actual Net Weight (KG)',
    stepScalePhoto: 'Step 3: Upload Scale Readout Photo',
    netWeightLabel: 'Actual Net Weight (KG):',
    netWeightPlaceholder: 'e.g. 15.25',
    calculatedPointsLive: 'Customer Reward Points (Calculated):',
    scalePhotoRequired: 'Scale readout photo is mandatory proof',
    submitWeighingBtn: 'Submit Weights & Award Points Automatically',
    weighingSuccessCelebration: 'Weighing Verified & Points Awarded!',

    // Request Statuses
    statusPending: 'Pending',
    statusAccepted: 'Accepted',
    statusOnTheWay: 'On The Way',
    statusArrived: 'Arrived at Location',
    statusCollected: 'Collected',
    statusAwaitingVerification: 'Awaiting Verification',
    statusCompleted: 'Completed & Points Awarded',
    statusCancelled: 'Cancelled',

    // Admin Dashboard
    adminDashboardTitle: 'Central Administration & Environmental Audit',
    tabOverview: 'Overview & KPIs',
    tabUsers: 'Users & Workers Review',
    tabCollections: 'Requests & Scale Verifications',
    tabCategories: 'Plastic Types & Reward Rates',
    tabRewards: 'Reward Catalog & Redemptions',
    tabReports: 'Reports & Analytics',
    tabSchema: 'Supabase / SQL Schema',
    tabSettings: 'System Settings',
    totalCitizens: 'Total Citizens',
    totalCompanies: 'Total Companies',
    registeredWorkers: 'Registered Workers',
    approvedWorkersCount: 'Approved Workers',
    totalRequestsCount: 'Total Collection Requests',
    completedRequestsCount: 'Completed Requests',
    totalWeightKg: 'Total Plastic Collected (KG)',
    totalPointsDistributed: 'Total Points Awarded',
    workerApprovalAction: 'Approve Worker Account',
    workerRejectAction: 'Reject Application',
    workerSuspendAction: 'Suspend Account',
    inspectEvidenceBtn: 'Inspect Scale Evidence',
    approveWeightBtn: 'Approve Submitted Weight',
    reassignWorkerBtn: 'Reassign Worker',
    exportSqlBtn: 'Copy Full SQL DDL',
    downloadSqlBtn: 'Download .sql Schema File',

  },
};

export class I18nManager {
  private currentLang: Language = 'ar';
  private listeners: Array<(lang: Language) => void> = [];

  constructor() {
    const saved = localStorage.getItem('ecocollect_lang') as Language;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang = saved;
    } else {
      this.currentLang = 'ar'; // Default Arabic as requested
    }
    this.updateDocumentAttributes();
  }

  get language(): Language {
    return this.currentLang;
  }

  set language(lang: Language) {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    localStorage.setItem('ecocollect_lang', lang);
    this.updateDocumentAttributes();
    this.listeners.forEach((cb) => cb(lang));
  }

  toggleLanguage() {
    this.language = this.currentLang === 'ar' ? 'en' : 'ar';
  }

  t(key: keyof (typeof translations)['ar']): string {
    const dict = translations[this.currentLang] || translations.ar;
    return dict[key] || translations.ar[key] || (key as string);
  }

  subscribe(callback: (lang: Language) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private updateDocumentAttributes() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}

export const i18n = new I18nManager();

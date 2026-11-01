import {
  PlasticCategory,
  UserProfile,
  CollectionRequest,
  PointsTransaction,
  NotificationItem,
  RewardCatalogItem,
  AppSettings,
} from '../types';

export const INITIAL_PLASTIC_CATEGORIES: PlasticCategory[] = [
  {
    id: 'cat-pet-1',
    recyclingCode: 1,
    shortCode: 'PET',
    nameAr: 'بولي إيثيلين تريفثاليت (PET)',
    nameEn: 'Polyethylene Terephthalate (PET)',
    descriptionAr: 'بلاستيك شفاف خفيف الوزن وقابل لإعادة التدوير بدرجة عالية.',
    descriptionEn: 'Clear, strong, and lightweight plastic that is fully recyclable.',
    examplesAr: 'قوارير مياه الشرب، عبوات المشروبات الغازية، علب الزيوت النباتية.',
    examplesEn: 'Water bottles, soft drink bottles, salad dressing containers.',
    kilogramsPerPoint: 2, // 2 KG = 1 POINT
    color: '#3288D8',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
  {
    id: 'cat-hdpe-2',
    recyclingCode: 2,
    shortCode: 'HDPE',
    nameAr: 'بولي إيثيلين عالي الكثافة (HDPE)',
    nameEn: 'High-Density Polyethylene (HDPE)',
    descriptionAr: 'بلاستيك صلب معتم ذو مقاومة عالية للمواد الكيميائية.',
    descriptionEn: 'Stiff and impact-resistant plastic with strong chemical resistance.',
    examplesAr: 'عبوات المنظفات، جالونات الحليب والعصائر، علب الشامبو، أغطية الزجاجات.',
    examplesEn: 'Detergent bottles, milk jugs, shampoo bottles, bleach containers.',
    kilogramsPerPoint: 1, // 1 KG = 1 POINT
    color: '#43B96B',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
  {
    id: 'cat-pvc-3',
    recyclingCode: 3,
    shortCode: 'PVC',
    nameAr: 'كلوريد متعدد الفاينيل (PVC)',
    nameEn: 'Polyvinyl Chloride (PVC)',
    descriptionAr: 'بلاستيك متين ومرن يُستخدم في الأنابيب والمنتجات الإنشائية.',
    descriptionEn: 'Tough and durable plastic commonly used in plumbing and construction.',
    examplesAr: 'أنابيب الصرف الصحي، خراطيم المياه، إطارات النوافذ البلاستيكية.',
    examplesEn: 'Plumbing pipes, conduit, vinyl siding, garden hoses.',
    kilogramsPerPoint: 1, // 1 KG = 1 POINT
    color: '#E53E3E',
    imageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
  {
    id: 'cat-ldpe-4',
    recyclingCode: 4,
    shortCode: 'LDPE',
    nameAr: 'بولي إيثيلين منخفض الكثافة (LDPE)',
    nameEn: 'Low-Density Polyethylene (LDPE)',
    descriptionAr: 'بلاستيك مرن وشفاف أو شبه شفاف يُستخدم في الأكياس والتغليف.',
    descriptionEn: 'Flexible, tough plastic film commonly used for bags and wrapping.',
    examplesAr: 'أكياس التسوق، أكياس القمامة، أغلفة التغليف المرنة، الأكياس القابلة لإعادة الغلق.',
    examplesEn: 'Grocery shopping bags, shrink wraps, squeeze bottles, trash liners.',
    kilogramsPerPoint: 1, // 1 KG = 1 POINT
    color: '#F9D342',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
  {
    id: 'cat-pp-5',
    recyclingCode: 5,
    shortCode: 'PP',
    nameAr: 'بولي بروبيلين (PP)',
    nameEn: 'Polypropylene (PP)',
    descriptionAr: 'بلاستيك صلب مقاوم للحرارة يُستخدم للأطعمة والعبوات الدوائية.',
    descriptionEn: 'High melting point plastic ideal for hot liquids and food storage.',
    examplesAr: 'أغطية الزجاجات، علب الزبادي والألبان، حاويات حفظ الأطعمة، قشات العصير.',
    examplesEn: 'Bottle caps, yogurt cups, food containers, medicine bottles.',
    kilogramsPerPoint: 1, // 1 KG = 1 POINT
    color: '#319795',
    imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
  {
    id: 'cat-ps-6',
    recyclingCode: 6,
    shortCode: 'PS',
    nameAr: 'بوليسترين (PS)',
    nameEn: 'Polystyrene (PS)',
    descriptionAr: 'بلاستيك صلب أو رغوي عازل للحرارة وخفيف الوزن.',
    descriptionEn: 'Rigid or foam plastic known for thermal insulation.',
    examplesAr: 'أكواب القهوة الرغوية (الفلين)، صحون التغليف، أدوات المائدة البلاستيكية ذات الاستخدام الواحد.',
    examplesEn: 'Foam coffee cups, styrofoam trays, disposable cutlery, egg cartons.',
    kilogramsPerPoint: 1, // 1 KG = 1 POINT
    color: '#805AD5',
    imageUrl: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
  {
    id: 'cat-other-7',
    recyclingCode: 7,
    shortCode: 'OTHER',
    nameAr: 'بلاستيك متنوع أخرى (OTHER)',
    nameEn: 'Other Plastics & Composites (OTHER)',
    descriptionAr: 'أي منتجات بلاستيكية مركبة أو أنواع أخرى غير مصنفة أعلاه.',
    descriptionEn: 'Mixed resins, polycarbonate, bioplastics, and composite plastics.',
    examplesAr: 'قوارير المياه الكبيرة (5 جالون)، نظارات السلامة، عبوات النايلون المركبة.',
    examplesEn: 'Large 5-gallon water jugs, safety goggles, composite nylon containers.',
    kilogramsPerPoint: 3, // Admin-configurable: 3 KG = 1 POINT
    color: '#718096',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=300&q=80',
    enabled: true,
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-citizen-1',
    accountType: 'citizen',
    firstName: 'سارة',
    lastName: 'أحمد السبيعي',
    phoneNumber: '+966501234567',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    address: 'حي النرجس، شارع أنس بن مالك',
    city: 'الرياض',
    pointsBalance: 1250,
    totalPlasticRecycledKg: 184.5,
    accountStatus: 'active',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'usr-company-1',
    accountType: 'company',
    firstName: 'عبدالله',
    lastName: 'الغامدي',
    companyName: 'شركة الواحة الخضراء للضيافة والتموين',
    commercialRegistrationNumber: '1010894523',
    phoneNumber: '+966558889900',
    avatarUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    address: 'المدينة الصناعية الثانية، مخرج 14',
    city: 'الرياض',
    pointsBalance: 6840,
    totalPlasticRecycledKg: 5420.0,
    accountStatus: 'active',
    createdAt: '2026-06-10T08:30:00Z',
  },
  {
    id: 'usr-worker-1',
    accountType: 'worker',
    firstName: 'خالد',
    lastName: 'المنصور',
    phoneNumber: '+966543219876',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    address: 'حي اليرموك',
    city: 'الرياض',
    pointsBalance: 450,
    totalPlasticRecycledKg: 1280.0,
    accountStatus: 'active',
    createdAt: '2026-07-01T12:00:00Z',
    workerDetails: {
      driverLicenseImage: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=400&q=80',
      vehicleImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=80',
      vehicleType: 'شاحنة صغيرة مجهزة بميزان إلكتروني',
      vehiclePlateNumber: 'أ ب ج 4 5 6 7',
      approvalStatus: 'approved',
      availabilityStatus: 'online',
      totalCollectionsCompleted: 48,
      rating: 4.9,
    },
  },
  {
    id: 'usr-worker-2',
    accountType: 'worker',
    firstName: 'فيصل',
    lastName: 'العتيبي',
    phoneNumber: '+966567771234',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    address: 'حي الملقا',
    city: 'الرياض',
    pointsBalance: 0,
    totalPlasticRecycledKg: 0,
    accountStatus: 'active',
    createdAt: '2026-10-28T14:20:00Z',
    workerDetails: {
      driverLicenseImage: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=400&q=80',
      vehicleImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=80',
      vehicleType: 'سيارة نقل بيك آب دينا',
      vehiclePlateNumber: 'د هـ و 9 8 1 2',
      approvalStatus: 'pending', // Pending Admin Approval
      availabilityStatus: 'offline',
      totalCollectionsCompleted: 0,
      rating: 5.0,
    },
  },
  {
    id: 'usr-admin-1',
    accountType: 'admin',
    firstName: 'المشرف',
    lastName: 'العام',
    phoneNumber: '+966500000001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    address: 'المقر الرئيسي لمنصة إيكو كوليكت',
    city: 'الرياض',
    pointsBalance: 0,
    totalPlasticRecycledKg: 0,
    accountStatus: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_COLLECTION_REQUESTS: CollectionRequest[] = [
  {
    id: 'req-1001',
    requestNumber: '#1001',
    customerId: 'usr-citizen-1',
    customerName: 'سارة أحمد السبيعي',
    customerPhone: '+966501234567',
    customerType: 'citizen',
    latitude: 24.8142,
    longitude: 46.6385,
    address: 'حي النرجس، فيلا 24، الرياض',
    city: 'الرياض',
    instructions: 'الأكياس موجودة بجوار الباب الخارجي للكراج. الرجاء الاتصال عند الوصول.',
    preferredTime: 'اليوم، بين الساعة 4:00 إلى 6:00 مساءً',
    status: 'pending', // Waiting for a worker to accept!
    items: [
      {
        id: 'item-1',
        plasticCategoryId: 'cat-pet-1',
        estimatedWeight: 15,
      },
      {
        id: 'item-2',
        plasticCategoryId: 'cat-hdpe-2',
        estimatedWeight: 10,
      },
      {
        id: 'item-3',
        plasticCategoryId: 'cat-pp-5',
        estimatedWeight: 5,
      },
    ],
    materialPhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2026-11-01T08:30:00Z',
        noteAr: 'تم تقديم طلب الجمع بنجاح من المواطن، بانتظار قبول مندوب التوصيل.',
        noteEn: 'Collection request submitted by citizen, awaiting worker acceptance.',
      },
    ],
    createdAt: '2026-11-01T08:30:00Z',
    updatedAt: '2026-11-01T08:30:00Z',
    totalEstimatedWeight: 30,
  },
  {
    id: 'req-1002',
    requestNumber: '#1002',
    customerId: 'usr-company-1',
    customerName: 'شركة الواحة الخضراء للضيافة والتموين',
    customerPhone: '+966558889900',
    customerType: 'company',
    latitude: 24.6012,
    longitude: 46.7845,
    address: 'المدينة الصناعية الثانية، مستودع رقم 12، الرياض',
    city: 'الرياض',
    instructions: 'الكمية مفروزة في باليتات خشبية عند بوابة التحميل رقم 3. نطلب ميزان معتمد.',
    preferredTime: 'صباح الغد الساعة 9:00 صباحاً',
    status: 'pending',
    items: [
      {
        id: 'item-4',
        plasticCategoryId: 'cat-pet-1',
        estimatedWeight: 120,
      },
      {
        id: 'item-5',
        plasticCategoryId: 'cat-ldpe-4',
        estimatedWeight: 80,
      },
      {
        id: 'item-6',
        plasticCategoryId: 'cat-hdpe-2',
        estimatedWeight: 60,
      },
    ],
    materialPhotoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2026-11-01T09:15:00Z',
        noteAr: 'تم إنشاء طلب جمع تجاري للشركات.',
        noteEn: 'Commercial collection request created for company.',
      },
    ],
    createdAt: '2026-11-01T09:15:00Z',
    updatedAt: '2026-11-01T09:15:00Z',
    totalEstimatedWeight: 260,
  },
  {
    id: 'req-1003',
    requestNumber: '#1003',
    customerId: 'usr-citizen-1',
    customerName: 'سارة أحمد السبيعي',
    customerPhone: '+966501234567',
    customerType: 'citizen',
    workerId: 'usr-worker-1',
    workerName: 'خالد المنصور',
    workerPhone: '+966543219876',
    latitude: 24.7891,
    longitude: 46.6621,
    address: 'حي الياسمين، شارع الخيالة',
    city: 'الرياض',
    instructions: 'المواد مفروزة في 3 أكياس كبيرة.',
    preferredTime: 'عاجل خلال ساعتين',
    status: 'arrived', // Worker has arrived and ready to physically weigh!
    items: [
      {
        id: 'item-7',
        plasticCategoryId: 'cat-pet-1',
        estimatedWeight: 20,
      },
      {
        id: 'item-8',
        plasticCategoryId: 'cat-hdpe-2',
        estimatedWeight: 12,
      },
    ],
    materialPhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2026-10-31T14:00:00Z',
        noteAr: 'تم إنشاء الطلب.',
      },
      {
        status: 'accepted',
        timestamp: '2026-10-31T14:15:00Z',
        noteAr: 'قبل المندوب خالد المنصور الطلب.',
      },
      {
        status: 'on_the_way',
        timestamp: '2026-10-31T14:45:00Z',
        noteAr: 'المندوب في الطريق إلى موقع العميل.',
      },
      {
        status: 'arrived',
        timestamp: '2026-10-31T15:10:00Z',
        noteAr: 'وصل المندوب إلى الموقع وبدأ الفحص البصري والوزن الفعلي.',
      },
    ],
    createdAt: '2026-10-31T14:00:00Z',
    updatedAt: '2026-10-31T15:10:00Z',
    totalEstimatedWeight: 32,
  },
  {
    id: 'req-0995',
    requestNumber: '#0995',
    customerId: 'usr-citizen-1',
    customerName: 'سارة أحمد السبيعي',
    customerPhone: '+966501234567',
    customerType: 'citizen',
    workerId: 'usr-worker-1',
    workerName: 'خالد المنصور',
    workerPhone: '+966543219876',
    latitude: 24.8142,
    longitude: 46.6385,
    address: 'حي النرجس، فيلا 24، الرياض',
    city: 'الرياض',
    instructions: 'قوارير مياه وعبوات منظفات.',
    preferredTime: 'أمس الساعة 5:00 مساءً',
    status: 'completed',
    items: [
      {
        id: 'item-9',
        plasticCategoryId: 'cat-pet-1',
        estimatedWeight: 20,
        actualNetWeight: 22.5,
        pointsAwarded: 11.25, // 22.5 / 2 = 11.25
        appliedRewardRate: 2,
      },
      {
        id: 'item-10',
        plasticCategoryId: 'cat-hdpe-2',
        estimatedWeight: 15,
        actualNetWeight: 14.2,
        pointsAwarded: 14.2, // 14.2 / 1 = 14.2
        appliedRewardRate: 1,
      },
    ],
    materialPhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    scalePhotoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-29T10:00:00Z' },
      { status: 'accepted', timestamp: '2026-10-29T10:10:00Z' },
      { status: 'on_the_way', timestamp: '2026-10-29T10:30:00Z' },
      { status: 'arrived', timestamp: '2026-10-29T11:00:00Z' },
      { status: 'collected', timestamp: '2026-10-29T11:25:00Z' },
      { status: 'completed', timestamp: '2026-10-29T11:30:00Z', noteAr: 'تم وزن البلاستيك وإضافة 25.45 نقطة تلقائياً.' },
    ],
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-10-29T11:30:00Z',
    totalEstimatedWeight: 35,
    totalActualWeight: 36.7,
    totalPointsAwarded: 25.45,
  },
];

export const INITIAL_TRANSACTIONS: PointsTransaction[] = [
  {
    id: 'tx-501',
    transactionNumber: 'TX-2026-501',
    customerId: 'usr-citizen-1',
    customerName: 'سارة أحمد السبيعي',
    customerType: 'citizen',
    collectionRequestId: 'req-0995',
    plasticCategoryId: 'cat-pet-1',
    plasticCategoryCode: 'PET',
    acceptedWeight: 22.5,
    appliedRewardRate: 2, // 2 KG = 1 POINT
    points: 11.25,
    transactionType: 'credit',
    descriptionAr: 'مكافأة إعادة تدوير 22.5 كجم من بلاستيك PET (الطلب #0995)',
    descriptionEn: 'Recycling reward for 22.5 KG of PET plastic (Request #0995)',
    createdAt: '2026-10-29T11:30:00Z',
    verificationStatus: 'verified',
  },
  {
    id: 'tx-502',
    transactionNumber: 'TX-2026-502',
    customerId: 'usr-citizen-1',
    customerName: 'سارة أحمد السبيعي',
    customerType: 'citizen',
    collectionRequestId: 'req-0995',
    plasticCategoryId: 'cat-hdpe-2',
    plasticCategoryCode: 'HDPE',
    acceptedWeight: 14.2,
    appliedRewardRate: 1, // 1 KG = 1 POINT
    points: 14.2,
    transactionType: 'credit',
    descriptionAr: 'مكافأة إعادة تدوير 14.2 كجم من بلاستيك HDPE (الطلب #0995)',
    descriptionEn: 'Recycling reward for 14.2 KG of HDPE plastic (Request #0995)',
    createdAt: '2026-10-29T11:30:00Z',
    verificationStatus: 'verified',
  },
  {
    id: 'tx-500',
    transactionNumber: 'TX-2026-500',
    customerId: 'usr-citizen-1',
    customerName: 'سارة أحمد السبيعي',
    customerType: 'citizen',
    collectionRequestId: 'req-0980',
    plasticCategoryId: 'cat-ldpe-4',
    plasticCategoryCode: 'LDPE',
    acceptedWeight: 30.0,
    appliedRewardRate: 1,
    points: 30.0,
    transactionType: 'credit',
    descriptionAr: 'مكافأة إعادة تدوير 30 كجم من بلاستيك LDPE (الطلب #0980)',
    descriptionEn: 'Recycling reward for 30 KG of LDPE plastic (Request #0980)',
    createdAt: '2026-10-25T16:00:00Z',
    verificationStatus: 'verified',
  },
  {
    id: 'tx-480',
    transactionNumber: 'TX-2026-480',
    customerId: 'usr-company-1',
    customerName: 'شركة الواحة الخضراء للضيافة والتموين',
    customerType: 'company',
    collectionRequestId: 'req-0950',
    plasticCategoryId: 'cat-pet-1',
    plasticCategoryCode: 'PET',
    acceptedWeight: 500.0,
    appliedRewardRate: 2,
    points: 250.0,
    transactionType: 'credit',
    descriptionAr: 'مكافأة توريد 500 كجم PET عبوات مشروبات للمنشآت (الطلب #0950)',
    descriptionEn: 'Commercial reward for 500 KG PET beverage containers (Request #0950)',
    createdAt: '2026-10-20T14:10:00Z',
    verificationStatus: 'verified',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-citizen-1',
    targetRole: 'citizen',
    titleAr: 'تم إضافة نقاط جديدة لحسابك! 🎉',
    titleEn: 'New points added to your balance! 🎉',
    messageAr: 'قام المندوب بوزن البلاستيك (36.7 كجم) وتم إضافة 25.45 نقطة بنجاح.',
    messageEn: 'The worker weighed your plastic (36.7 KG) and awarded 25.45 points successfully.',
    isRead: false,
    createdAt: '2026-10-29T11:30:00Z',
    type: 'success',
    relatedRequestId: 'req-0995',
  },
  {
    id: 'notif-2',
    userId: 'usr-citizen-1',
    targetRole: 'citizen',
    titleAr: 'المندوب وصل إلى موقعك 📍',
    titleEn: 'Delivery worker arrived at your location 📍',
    messageAr: 'وصل المندوب خالد المنصور لفحص ووزن البلاستيك للطلب #1003.',
    messageEn: 'Worker Khalid Al-Mansoor has arrived to inspect and physically weigh plastic for #1003.',
    isRead: false,
    createdAt: '2026-10-31T15:10:00Z',
    type: 'info',
    relatedRequestId: 'req-1003',
  },
  {
    id: 'notif-3',
    userId: 'usr-worker-1',
    targetRole: 'worker',
    titleAr: 'طلب جمع جديد متاح بالقرب منك 🚛',
    titleEn: 'New collection request available near you 🚛',
    messageAr: 'طلب جديد (#1001) من المواطنة سارة أحمد بحي النرجس، الكمية التقديرية: 30 كجم.',
    messageEn: 'New request (#1001) from Sarah Ahmed in Al-Narjis, estimated 30 KG.',
    isRead: false,
    createdAt: '2026-11-01T08:30:00Z',
    type: 'info',
    relatedRequestId: 'req-1001',
  },
  {
    id: 'notif-4',
    userId: 'usr-admin-1',
    targetRole: 'admin',
    titleAr: 'طلب تسجيل مندوب جديد بانتظار الاعتماد ⚠️',
    titleEn: 'New delivery worker application pending review ⚠️',
    messageAr: 'سجّل المندوب فيصل العتيبي وقام برفع رخصة القيادة وصورة المركبة.',
    messageEn: 'Worker Faisal Al-Otaibi registered and uploaded license & vehicle photos.',
    isRead: false,
    createdAt: '2026-10-28T14:20:00Z',
    type: 'warning',
  },
];

export const INITIAL_REWARDS: RewardCatalogItem[] = [
  {
    id: 'rew-1',
    titleAr: 'قسيمة مشتريات أسواق العثيم (50 ريال)',
    titleEn: 'Al-Othaim Supermarket Voucher (50 SAR)',
    descriptionAr: 'قسيمة شرائية صالحة في جميع فروع أسواق العثيم بالمملكة.',
    descriptionEn: 'Shopping coupon redeemable at all branches across the Kingdom.',
    pointsRequired: 250,
    icon: 'shopping-bag',
    partner: 'أسواق العثيم',
    category: 'voucher',
    active: true,
  },
  {
    id: 'rew-2',
    titleAr: 'شحن رصيد جوال (30 ريال)',
    titleEn: 'Mobile Credit Recharge (30 SAR)',
    descriptionAr: 'شحن رصيد فوري لأي رقم (stc، موبايلي، زين).',
    descriptionEn: 'Instant mobile balance recharge for stc, Mobily, or Zain.',
    pointsRequired: 150,
    icon: 'smartphone',
    partner: 'سداد الاتصالات',
    category: 'service',
    active: true,
  },
  {
    id: 'rew-3',
    titleAr: 'غرس شجرة محلية باسمك في الرياض',
    titleEn: 'Plant a Native Tree in Your Name',
    descriptionAr: 'مبادرة بالتعاون مع المركز الوطني لتنمية الغطاء النباتي مع شهادة شكر بيئية.',
    descriptionEn: 'In partnership with the National Vegetation Cover Initiative with certificate.',
    pointsRequired: 200,
    icon: 'tree',
    partner: 'مبادرة السعودية الخضراء',
    category: 'donation',
    active: true,
  },
  {
    id: 'rew-4',
    titleAr: 'خصم وقود بترومين إكسبرس (100 ريال)',
    titleEn: 'Petromin Express Fuel Discount (100 SAR)',
    descriptionAr: 'قسيمة لخدمات الزيوت والوقود في محطات بترومين.',
    descriptionEn: 'Voucher for oil and fuel services at Petromin stations.',
    pointsRequired: 450,
    icon: 'truck',
    partner: 'بترومين',
    category: 'voucher',
    active: true,
  },
];

export const INITIAL_APP_SETTINGS: AppSettings = {
  appName: 'EcoCollect',
  taglineAr: 'اجمع البلاستيك. اكسب النقاط. احمِ البيئة.',
  taglineEn: 'Collect Plastic. Earn Points. Protect the Environment.',
  unusualWeightThresholdKg: 100, // weights > 100 kg for citizens trigger admin verification
  defaultLanguage: 'ar',
  autoApproveWorkers: false,
  currencyPerPointEstimated: 0.20,
};

export const POSTGRESQL_SUPABASE_SCHEMA_SQL = `-- ====================================================================
-- ECOCOLLECT: COMPLETE PRODUCTION POSTGRESQL & SUPABASE DDL SCHEMA
-- Exclusively designed for plastic waste collection, manual classification,
-- physical scale weighing by delivery workers, and automatic reward points.
-- NO ARTIFICIAL INTELLIGENCE / NO MACHINE LEARNING
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE account_type_enum AS ENUM ('citizen', 'company', 'worker', 'admin');
CREATE TYPE account_status_enum AS ENUM ('active', 'suspended', 'deactivated');
CREATE TYPE worker_approval_enum AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE worker_availability_enum AS ENUM ('online', 'offline');
CREATE TYPE request_status_enum AS ENUM (
  'pending',
  'accepted',
  'on_the_way',
  'arrived',
  'collected',
  'awaiting_verification',
  'completed',
  'cancelled'
);
CREATE TYPE transaction_type_enum AS ENUM ('credit', 'debit', 'adjustment');
CREATE TYPE verification_status_enum AS ENUM ('verified', 'pending_admin', 'rejected');

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(30) UNIQUE NOT NULL,
  account_type account_type_enum NOT NULL,
  account_status account_status_enum DEFAULT 'active',
  avatar_url TEXT,
  address TEXT,
  city VARCHAR(100) DEFAULT 'Riyadh',
  points_balance NUMERIC(12, 3) DEFAULT 0.000 CHECK (points_balance >= 0),
  total_plastic_recycled_kg NUMERIC(12, 3) DEFAULT 0.000,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  commercial_registration_number VARCHAR(50) UNIQUE NOT NULL,
  contact_person VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. WORKERS TABLE
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_license_image TEXT NOT NULL,
  vehicle_image TEXT NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  vehicle_plate_number VARCHAR(50) NOT NULL,
  approval_status worker_approval_enum DEFAULT 'pending',
  availability_status worker_availability_enum DEFAULT 'offline',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  total_collections_completed INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. PLASTIC CATEGORIES (Exclusively 7 official categories)
CREATE TABLE IF NOT EXISTS plastic_categories (
  id VARCHAR(50) PRIMARY KEY,
  recycling_code INT NOT NULL CHECK (recycling_code BETWEEN 1 AND 7),
  short_code VARCHAR(20) NOT NULL UNIQUE,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  examples_ar TEXT,
  examples_en TEXT,
  kilograms_per_point NUMERIC(8, 3) NOT NULL CHECK (kilograms_per_point > 0),
  image_url TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. COLLECTION REQUESTS
CREATE TABLE IF NOT EXISTS collection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id),
  customer_type account_type_enum NOT NULL CHECK (customer_type IN ('citizen', 'company')),
  worker_id UUID REFERENCES users(id),
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) DEFAULT 'Riyadh',
  instructions TEXT,
  preferred_time VARCHAR(100),
  status request_status_enum DEFAULT 'pending',
  material_photo_url TEXT,
  scale_photo_url TEXT,
  total_estimated_weight NUMERIC(10, 3) DEFAULT 0,
  total_actual_weight NUMERIC(10, 3),
  total_points_awarded NUMERIC(10, 3),
  is_unusual_weight BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. COLLECTION ITEMS
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES collection_requests(id) ON DELETE CASCADE,
  plastic_category_id VARCHAR(50) NOT NULL REFERENCES plastic_categories(id),
  estimated_weight NUMERIC(8, 3) NOT NULL CHECK (estimated_weight > 0),
  actual_net_weight NUMERIC(8, 3) CHECK (actual_net_weight >= 0),
  applied_reward_rate NUMERIC(8, 3),
  points_awarded NUMERIC(10, 3) DEFAULT 0.000,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. COLLECTION EVIDENCE (Photos of materials & physical scale readout)
CREATE TABLE IF NOT EXISTS collection_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES collection_requests(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES users(id),
  material_photo_url TEXT NOT NULL,
  scale_photo_url TEXT NOT NULL,
  scale_reading_kg NUMERIC(8, 3) NOT NULL,
  tare_deducted_kg NUMERIC(8, 3) DEFAULT 0.000,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. COLLECTION STATUS HISTORY
CREATE TABLE IF NOT EXISTS collection_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES collection_requests(id) ON DELETE CASCADE,
  status request_status_enum NOT NULL,
  note_ar TEXT,
  note_en TEXT,
  actor_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. POINTS TRANSACTIONS LEDGER
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number VARCHAR(30) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id),
  collection_request_id UUID REFERENCES collection_requests(id),
  plastic_category_id VARCHAR(50) REFERENCES plastic_categories(id),
  accepted_weight NUMERIC(10, 3) NOT NULL,
  applied_reward_rate NUMERIC(8, 3) NOT NULL,
  points NUMERIC(10, 3) NOT NULL,
  transaction_type transaction_type_enum NOT NULL DEFAULT 'credit',
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  verification_status verification_status_enum DEFAULT 'verified',
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_ar VARCHAR(200) NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  message_ar TEXT NOT NULL,
  message_en TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  type VARCHAR(50) DEFAULT 'info',
  related_request_id UUID REFERENCES collection_requests(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. REWARDS CATALOG & REDEMPTIONS
CREATE TABLE IF NOT EXISTS rewards_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar VARCHAR(200) NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  points_required INT NOT NULL CHECK (points_required > 0),
  partner VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id),
  reward_id UUID NOT NULL REFERENCES rewards_catalog(id),
  points_spent NUMERIC(10, 3) NOT NULL,
  voucher_code VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'completed',
  redeemed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. AUTOMATIC POINTS CALCULATION FUNCTION (SERVER-SIDE)
CREATE OR REPLACE FUNCTION calculate_and_award_points(p_request_id UUID, p_worker_id UUID)
RETURNS VOID AS $$
DECLARE
  v_customer_id UUID;
  v_item RECORD;
  v_points_for_item NUMERIC(10, 3);
  v_total_points NUMERIC(10, 3) := 0;
  v_total_weight NUMERIC(10, 3) := 0;
  v_rate NUMERIC(8, 3);
  v_tx_num VARCHAR(30);
BEGIN
  SELECT customer_id INTO v_customer_id FROM collection_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request % not found', p_request_id;
  END IF;

  FOR v_item IN
    SELECT ci.id, ci.plastic_category_id, ci.actual_net_weight, pc.kilograms_per_point, pc.short_code
    FROM collection_items ci
    JOIN plastic_categories pc ON ci.plastic_category_id = pc.id
    WHERE ci.request_id = p_request_id
  LOOP
    IF v_item.actual_net_weight IS NOT NULL AND v_item.actual_net_weight > 0 THEN
      v_rate := v_item.kilograms_per_point;
      v_points_for_item := ROUND(v_item.actual_net_weight / v_rate, 3);
      v_total_points := v_total_points + v_points_for_item;
      v_total_weight := v_total_weight + v_item.actual_net_weight;

      -- Update item with awarded points and frozen rate
      UPDATE collection_items
      SET points_awarded = v_points_for_item,
          applied_reward_rate = v_rate
      WHERE id = v_item.id;

      -- Insert into transaction ledger
      v_tx_num := 'TX-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || SUBSTRING(v_item.id::text, 1, 6);
      INSERT INTO points_transactions (
        transaction_number, customer_id, collection_request_id, plastic_category_id,
        accepted_weight, applied_reward_rate, points, transaction_type,
        description_ar, description_en, verification_status
      ) VALUES (
        v_tx_num, v_customer_id, p_request_id, v_item.plastic_category_id,
        v_item.actual_net_weight, v_rate, v_points_for_item, 'credit',
        'مكافأة إعادة تدوير ' || v_item.actual_net_weight || ' كجم ' || v_item.short_code,
        'Recycling reward for ' || v_item.actual_net_weight || ' KG of ' || v_item.short_code,
        'verified'
      );
    END IF;
  END LOOP;

  -- Update Customer Points Balance and Recycled Weight
  UPDATE users
  SET points_balance = points_balance + v_total_points,
      total_plastic_recycled_kg = total_plastic_recycled_kg + v_total_weight,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = v_customer_id;

  -- Update Collection Request status to completed
  UPDATE collection_requests
  SET total_actual_weight = v_total_weight,
      total_points_awarded = v_total_points,
      status = 'completed',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Citizens / Companies view their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers view own collection requests" ON collection_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Approved workers view available and assigned requests" ON collection_requests
  FOR SELECT USING (
    status = 'pending' OR worker_id = auth.uid()
  );

-- Admins have full access
CREATE POLICY "Admins full access to requests" ON collection_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
  );
`;

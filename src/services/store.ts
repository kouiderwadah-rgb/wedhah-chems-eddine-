import {
  AccountType,
  CollectionRequest,
  PlasticCategory,
  PointsTransaction,
  UserProfile,
  NotificationItem,
  RewardCatalogItem,
  AppSettings,
  RequestStatus,
  WorkerApprovalStatus,
} from '../types';
import {
  INITIAL_PLASTIC_CATEGORIES,
  INITIAL_USERS,
  INITIAL_COLLECTION_REQUESTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REWARDS,
  INITIAL_APP_SETTINGS,
} from '../data/initialData';

export type AppView =
  | 'selection'
  | 'citizen'
  | 'company'
  | 'worker'
  | 'admin'
  | 'new_request'
  | 'weighing_screen'
  | 'registration';

interface AppState {
  currentView: AppView;
  currentUser: UserProfile;
  users: UserProfile[];
  categories: PlasticCategory[];
  requests: CollectionRequest[];
  transactions: PointsTransaction[];
  notifications: NotificationItem[];
  rewards: RewardCatalogItem[];
  settings: AppSettings;
  activeRequestIdForWeighing: string | null;
  registrationAccountType: AccountType | null;
  deviceFrame: boolean;
  isAdminAuthenticated: boolean;
}

const STORAGE_KEY = 'ecocollect_app_state_v1';

class Store {
  private state: AppState;
  private listeners: Array<() => void> = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          currentView: parsed.currentView || 'selection',
          activeRequestIdForWeighing: parsed.activeRequestIdForWeighing || null,
          deviceFrame: parsed.deviceFrame !== undefined ? parsed.deviceFrame : false,
          isAdminAuthenticated: Boolean(parsed.isAdminAuthenticated),
        };
      } catch (err) {
        console.warn('Failed to parse saved state, resetting to initial data:', err);
      }
    }

    return {
      currentView: 'selection',
      currentUser: INITIAL_USERS[0], // Citizen Sarah
      users: [...INITIAL_USERS],
      categories: [...INITIAL_PLASTIC_CATEGORIES],
      requests: [...INITIAL_COLLECTION_REQUESTS],
      transactions: [...INITIAL_TRANSACTIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
      rewards: [...INITIAL_REWARDS],
      settings: { ...INITIAL_APP_SETTINGS },
      activeRequestIdForWeighing: null,
      registrationAccountType: null,
      deviceFrame: false,
      isAdminAuthenticated: false,
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Getters
  getState(): AppState {
    return this.state;
  }

  getCurrentUser(): UserProfile {
    return this.state.currentUser;
  }

  getCurrentView(): AppView {
    return this.state.currentView;
  }

  getCategories(): PlasticCategory[] {
    return this.state.categories;
  }

  getRequests(): CollectionRequest[] {
    return this.state.requests;
  }

  getTransactions(): PointsTransaction[] {
    return this.state.transactions;
  }

  getNotifications(): NotificationItem[] {
    return this.state.notifications;
  }

  getUnreadNotificationsCount(userId?: string): number {
    const uid = userId || this.state.currentUser.id;
    return this.state.notifications.filter((n) => n.userId === uid && !n.isRead).length;
  }

  // Navigation & View Actions
  setView(view: AppView) {
    this.state.currentView = view;
    this.saveState();
  }

  setDeviceFrame(enabled: boolean) {
    this.state.deviceFrame = enabled;
    this.saveState();
  }

  toggleDeviceFrame() {
    this.state.deviceFrame = !this.state.deviceFrame;
    this.saveState();
  }

  isAdminLoggedIn(): boolean {
    return Boolean(this.state.isAdminAuthenticated);
  }

  adminLogin(username: string, password: string): boolean {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Required by user prompt: username 'admin' and password 'admin'
    if (cleanUser === 'admin' && cleanPass === 'admin') {
      this.state.isAdminAuthenticated = true;
      const adminUser = this.state.users.find((u) => u.accountType === 'admin');
      if (adminUser) {
        this.state.currentUser = adminUser;
      }
      this.state.currentView = 'admin';
      this.saveState();
      return true;
    }
    return false;
  }

  adminLogout() {
    this.state.isAdminAuthenticated = false;
    // Reset current user back to citizen or default
    const citizenUser = this.state.users.find((u) => u.accountType === 'citizen') || this.state.users[0];
    if (citizenUser) {
      this.state.currentUser = citizenUser;
    }
    this.state.currentView = 'selection';
    this.saveState();
  }

  switchRole(role: AccountType | 'selection') {
    if (role === 'selection') {
      this.state.currentView = 'selection';
      this.saveState();
      return;
    }

    if (role === 'admin') {
      // Switch view to admin (if not logged in, AdminDashboardView will display the login screen)
      this.state.currentView = 'admin';
      if (this.state.isAdminAuthenticated) {
        const found = this.state.users.find((u) => u.accountType === 'admin');
        if (found) this.state.currentUser = found;
      }
      this.saveState();
      return;
    }

    const found = this.state.users.find((u) => u.accountType === role);
    if (found) {
      this.state.currentUser = found;
      this.state.currentView = role as AppView;
    } else {
      this.state.currentView = role as AppView;
    }
    this.saveState();
  }

  startRegistration(accountType: AccountType) {
    this.state.registrationAccountType = accountType;
    this.state.currentView = 'registration';
    this.saveState();
  }

  // User & Worker Management
  registerUser(
    accountType: AccountType,
    data: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      companyName?: string;
      commercialRegistrationNumber?: string;
      driverLicenseImage?: string;
      vehicleImage?: string;
      vehicleType?: string;
      vehiclePlateNumber?: string;
    }
  ): UserProfile {
    const newId = `usr-${accountType}-${Date.now().toString(36)}`;
    const isWorker = accountType === 'worker';

    const newUser: UserProfile = {
      id: newId,
      accountType,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      commercialRegistrationNumber: data.commercialRegistrationNumber,
      phoneNumber: data.phoneNumber,
      avatarUrl:
        accountType === 'company'
          ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      address: 'حي الملك فهد',
      city: 'الرياض',
      pointsBalance: 0,
      totalPlasticRecycledKg: 0,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      workerDetails: isWorker
        ? {
            driverLicenseImage:
              data.driverLicenseImage ||
              'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=400&q=80',
            vehicleImage:
              data.vehicleImage ||
              'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=80',
            vehicleType: data.vehicleType || 'مركبة نقل خفيفة',
            vehiclePlateNumber: data.vehiclePlateNumber || 'أ ب ج 1 2 3 4',
            approvalStatus: 'pending', // Pending Admin Approval
            availabilityStatus: 'offline',
            totalCollectionsCompleted: 0,
            rating: 5.0,
          }
        : undefined,
    };

    this.state.users.push(newUser);
    this.state.currentUser = newUser;

    // Send Admin Notification about new registration
    this.addNotification({
      userId: 'usr-admin-1',
      targetRole: 'admin',
      titleAr: isWorker ? 'طلب تسجيل مندوب جديد بانتظار الاعتماد ⚠️' : 'تسجيل مستخدم جديد 👤',
      titleEn: isWorker ? 'New delivery worker application pending review ⚠️' : 'New user registered 👤',
      messageAr: isWorker
        ? `سجّل المندوب ${newUser.firstName} ${newUser.lastName} برقم ${newUser.phoneNumber} بانتظار فحص رخصته ومركبته.`
        : `انضم ${newUser.firstName} ${newUser.lastName} إلى منصة إيكو كوليكت (${accountType}).`,
      messageEn: isWorker
        ? `Worker ${newUser.firstName} ${newUser.lastName} registered (${newUser.phoneNumber}) awaiting review.`
        : `User ${newUser.firstName} ${newUser.lastName} joined EcoCollect (${accountType}).`,
      type: isWorker ? 'warning' : 'info',
    });

    if (accountType === 'citizen') {
      this.state.currentView = 'citizen';
    } else if (accountType === 'company') {
      this.state.currentView = 'company';
    } else if (accountType === 'worker') {
      this.state.currentView = 'worker';
    }

    this.saveState();
    return newUser;
  }

  updateWorkerApproval(workerId: string, status: WorkerApprovalStatus) {
    const worker = this.state.users.find((u) => u.id === workerId);
    if (worker && worker.workerDetails) {
      worker.workerDetails.approvalStatus = status;
      this.addNotification({
        userId: worker.id,
        targetRole: 'worker',
        titleAr: status === 'approved' ? 'تهانينا! تم اعتماد حسابك كمندوب رسمي 🎉' : 'تحديث على حالة حساب المندوب',
        titleEn: status === 'approved' ? 'Congratulations! Your worker account has been approved 🎉' : 'Worker account status updated',
        messageAr:
          status === 'approved'
            ? 'تمت مراجعة رخصة القيادة وصورة المركبة بنجاح، يمكنك الآن الاتصال واستقبال طلبات الجمع.'
            : `تم تغيير حالة حسابك إلى: ${status}`,
        messageEn:
          status === 'approved'
            ? 'Your driver license and vehicle documents were verified. You can now accept requests.'
            : `Your account status changed to: ${status}`,
        type: status === 'approved' ? 'success' : 'warning',
      });
      this.saveState();
    }
  }

  toggleWorkerAvailability(workerId: string): boolean {
    const worker = this.state.users.find((u) => u.id === workerId);
    if (worker && worker.workerDetails) {
      if (worker.workerDetails.approvalStatus !== 'approved') {
        return false;
      }
      worker.workerDetails.availabilityStatus =
        worker.workerDetails.availabilityStatus === 'online' ? 'offline' : 'online';
      this.saveState();
      return true;
    }
    return false;
  }

  // Collection Requests
  createCollectionRequest(params: {
    items: Array<{ plasticCategoryId: string; estimatedWeight: number }>;
    address: string;
    instructions: string;
    preferredTime: string;
    latitude?: number;
    longitude?: number;
    materialPhotoUrl?: string;
  }): CollectionRequest {
    const user = this.state.currentUser;
    const reqNum = `#${1000 + this.state.requests.length + 1}`;
    const totalEst = params.items.reduce((sum, item) => sum + item.estimatedWeight, 0);

    const newReq: CollectionRequest = {
      id: `req-${Date.now().toString(36)}`,
      requestNumber: reqNum,
      customerId: user.id,
      customerName: user.companyName ? `${user.companyName} (${user.firstName})` : `${user.firstName} ${user.lastName}`,
      customerPhone: user.phoneNumber,
      customerType: user.accountType === 'company' ? 'company' : 'citizen',
      latitude: params.latitude || 24.7136 + (Math.random() - 0.5) * 0.1,
      longitude: params.longitude || 46.6753 + (Math.random() - 0.5) * 0.1,
      address: params.address,
      city: user.city || 'الرياض',
      instructions: params.instructions || 'الرجاء الاتصال عند الوصول.',
      preferredTime: params.preferredTime || 'خلال ساعات العمل اليوم',
      status: 'pending',
      items: params.items.map((i, index) => ({
        id: `item-${Date.now()}-${index}`,
        plasticCategoryId: i.plasticCategoryId,
        estimatedWeight: i.estimatedWeight,
      })),
      materialPhotoUrl:
        params.materialPhotoUrl ||
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          noteAr: 'تم تقديم طلب جمع البلاستيك بنجاح، بانتظار قبول أقرب مندوب متاح.',
          noteEn: 'Collection request submitted, waiting for worker acceptance.',
          actor: user.firstName,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalEstimatedWeight: totalEst,
    };

    this.state.requests.unshift(newReq);

    // Notify all online approved workers
    const approvedWorkers = this.state.users.filter(
      (u) => u.accountType === 'worker' && u.workerDetails?.approvalStatus === 'approved'
    );
    approvedWorkers.forEach((w) => {
      this.addNotification({
        userId: w.id,
        targetRole: 'worker',
        titleAr: 'طلب جمع بلاستيك جديد متاح بالقرب منك 🚛',
        titleEn: 'New plastic collection request near you 🚛',
        messageAr: `طلب ${newReq.requestNumber} من ${newReq.customerName}، الكمية المقدرة: ${totalEst} كجم.`,
        messageEn: `Request ${newReq.requestNumber} from ${newReq.customerName}, est. ${totalEst} KG.`,
        type: 'info',
        relatedRequestId: newReq.id,
      });
    });

    // Notify Customer
    this.addNotification({
      userId: user.id,
      targetRole: user.accountType,
      titleAr: 'تم تسجيل طلب الجمع بنجاح 📋',
      titleEn: 'Collection request registered 📋',
      messageAr: `طلبك رقم ${newReq.requestNumber} مسجل الآن وفي انتظار قبول مندوب الجمع المعتمد.`,
      messageEn: `Your request ${newReq.requestNumber} is live and awaiting worker pickup.`,
      type: 'success',
      relatedRequestId: newReq.id,
    });

    this.saveState();
    return newReq;
  }

  acceptRequest(requestId: string, workerId: string): boolean {
    const req = this.state.requests.find((r) => r.id === requestId);
    const worker = this.state.users.find((u) => u.id === workerId);
    if (!req || !worker || req.status !== 'pending') return false;

    req.workerId = worker.id;
    req.workerName = `${worker.firstName} ${worker.lastName}`;
    req.workerPhone = worker.phoneNumber;
    req.status = 'accepted';
    req.updatedAt = new Date().toISOString();
    req.statusHistory.push({
      status: 'accepted',
      timestamp: new Date().toISOString(),
      noteAr: `قبل المندوب ${req.workerName} طلب الجمع.`,
      noteEn: `Worker ${req.workerName} accepted the collection request.`,
      actor: req.workerName,
    });

    // Notify Customer
    this.addNotification({
      userId: req.customerId,
      targetRole: req.customerType,
      titleAr: 'تم قبول طلب الجمع الخاص بك! 🚚',
      titleEn: 'Your collection request has been accepted! 🚚',
      messageAr: `المندوب ${req.workerName} قبل طلبك وسيتوجه لموقعك قريباً.`,
      messageEn: `Worker ${req.workerName} accepted your request and will head to your location.`,
      type: 'info',
      relatedRequestId: req.id,
    });

    this.saveState();
    return true;
  }

  updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    noteAr?: string,
    noteEn?: string
  ): boolean {
    const req = this.state.requests.find((r) => r.id === requestId);
    if (!req) return false;

    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    req.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      noteAr,
      noteEn,
    });

    // Customer notifications based on status
    if (newStatus === 'on_the_way') {
      this.addNotification({
        userId: req.customerId,
        targetRole: req.customerType,
        titleAr: 'المندوب في الطريق إليك 🚀',
        titleEn: 'Delivery worker is on the way 🚀',
        messageAr: `المندوب ${req.workerName || ''} في الطريق إلى موقعك لاستلام البلاستيك.`,
        messageEn: `Worker ${req.workerName || ''} is currently driving to your location.`,
        type: 'info',
        relatedRequestId: req.id,
      });
    } else if (newStatus === 'arrived') {
      this.addNotification({
        userId: req.customerId,
        targetRole: req.customerType,
        titleAr: 'المندوب وصل إلى موقعك! 📍',
        titleEn: 'Delivery worker arrived! 📍',
        messageAr: `المندوب ${req.workerName || ''} وصل إلى الموقع وبدأ الفحص والوزن الفعلي بالميزان.`,
        messageEn: `Worker ${req.workerName || ''} arrived to inspect and physically weigh plastic.`,
        type: 'info',
        relatedRequestId: req.id,
      });
    }

    this.saveState();
    return true;
  }

  startWeighingForRequest(requestId: string) {
    this.state.activeRequestIdForWeighing = requestId;
    this.state.currentView = 'weighing_screen';
    this.saveState();
  }

  // PHYSICAL SCALE WEIGHING & AUTOMATIC POINTS CALCULATION (CRITICAL PROCESS)
  submitPhysicalWeighing(
    requestId: string,
    workerId: string,
    weighedItems: Array<{
      itemId: string;
      plasticCategoryId: string;
      actualNetWeight: number; // in KG
    }>,
    scalePhotoUrl: string
  ): { totalPoints: number; totalWeight: number; isUnusual: boolean } {
    const req = this.state.requests.find((r) => r.id === requestId);
    const worker = this.state.users.find((u) => u.id === workerId);
    if (!req || !worker) {
      throw new Error('Request or Worker not found');
    }

    const customer = this.state.users.find((u) => u.id === req.customerId);
    if (!customer) {
      throw new Error('Customer account not found');
    }

    let calculatedTotalPoints = 0;
    let calculatedTotalWeight = 0;

    weighedItems.forEach((w) => {
      const item = req.items.find((i) => i.id === w.itemId);
      const category = this.state.categories.find((c) => c.id === w.plasticCategoryId);
      if (!category) return;

      const rate = category.kilogramsPerPoint; // e.g. 2 for PET, 1 for others
      const netWeight = Math.max(0, Number(w.actualNetWeight.toFixed(3)));
      // EXACT FORMULA: Points = Net Weight / Kilograms Required Per Point
      const pointsAwarded = Math.round((netWeight / rate) * 1000) / 1000;

      calculatedTotalWeight += netWeight;
      calculatedTotalPoints += pointsAwarded;

      if (item) {
        item.plasticCategoryId = w.plasticCategoryId; // worker manual confirmation or correction
        item.actualNetWeight = netWeight;
        item.appliedRewardRate = rate;
        item.pointsAwarded = pointsAwarded;
      }

      // Record immutable ledger entry in points_transactions
      const txNum = `TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
      const newTx: PointsTransaction = {
        id: `tx-${Date.now()}-${w.itemId}`,
        transactionNumber: txNum,
        customerId: customer.id,
        customerName: req.customerName,
        customerType: req.customerType,
        collectionRequestId: req.id,
        plasticCategoryId: category.id,
        plasticCategoryCode: category.shortCode,
        acceptedWeight: netWeight,
        appliedRewardRate: rate,
        points: pointsAwarded,
        transactionType: 'credit',
        descriptionAr: `مكافأة إعادة تدوير ${netWeight} كجم من صنف ${category.shortCode} (الطلب ${req.requestNumber})`,
        descriptionEn: `Recycling reward for ${netWeight} KG of ${category.shortCode} (Request ${req.requestNumber})`,
        createdAt: new Date().toISOString(),
        verificationStatus: 'verified',
      };
      this.state.transactions.unshift(newTx);
    });

    calculatedTotalWeight = Math.round(calculatedTotalWeight * 1000) / 1000;
    calculatedTotalPoints = Math.round(calculatedTotalPoints * 1000) / 1000;

    // Check if weight is unusually large
    const threshold =
      req.customerType === 'company'
        ? this.state.settings.unusualWeightThresholdKg * 10
        : this.state.settings.unusualWeightThresholdKg;
    const isUnusual = calculatedTotalWeight > threshold;

    req.scalePhotoUrl =
      scalePhotoUrl ||
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';
    req.totalActualWeight = calculatedTotalWeight;
    req.totalPointsAwarded = calculatedTotalPoints;
    req.isUnusualWeight = isUnusual;
    req.status = isUnusual ? 'awaiting_verification' : 'completed';
    req.updatedAt = new Date().toISOString();

    req.statusHistory.push({
      status: req.status,
      timestamp: new Date().toISOString(),
      noteAr: `تم وزن البلاستيك فعلياً (${calculatedTotalWeight} كجم) واحتساب ${calculatedTotalPoints} نقطة.`,
      noteEn: `Physically weighed (${calculatedTotalWeight} KG) with ${calculatedTotalPoints} points awarded.`,
      actor: worker.firstName,
    });

    // Update customer balances
    customer.pointsBalance = Math.round((customer.pointsBalance + calculatedTotalPoints) * 1000) / 1000;
    customer.totalPlasticRecycledKg =
      Math.round((customer.totalPlasticRecycledKg + calculatedTotalWeight) * 1000) / 1000;

    // Update worker stats
    if (worker.workerDetails) {
      worker.workerDetails.totalCollectionsCompleted += 1;
    }

    // Customer Notification
    this.addNotification({
      userId: customer.id,
      targetRole: req.customerType,
      titleAr: 'تم إضافة نقاط المكافأة لحسابك! 🎉',
      titleEn: 'Reward points added to your account! 🎉',
      messageAr: `قام المندوب بوزن البلاستيك فعلياً (${calculatedTotalWeight} كجم) وتم احتساب ${calculatedTotalPoints} نقطة فورية لرصيدك.`,
      messageEn: `The worker physically weighed ${calculatedTotalWeight} KG and credited ${calculatedTotalPoints} points to your balance.`,
      type: 'success',
      relatedRequestId: req.id,
    });

    // If unusual, send alert to Admin
    if (isUnusual) {
      this.addNotification({
        userId: 'usr-admin-1',
        targetRole: 'admin',
        titleAr: 'تنبيه: تم تسجيل وزن استثنائي يتطلب التحقق ⚠️',
        titleEn: 'Alert: Unusual high weight submitted ⚠️',
        messageAr: `الطلب ${req.requestNumber} سجل وزناً مرتفعاً قدره ${calculatedTotalWeight} كجم بواسطة المندوب ${worker.firstName}.`,
        messageEn: `Request ${req.requestNumber} recorded high weight of ${calculatedTotalWeight} KG by worker ${worker.firstName}.`,
        type: 'warning',
        relatedRequestId: req.id,
      });
    }

    this.state.activeRequestIdForWeighing = null;
    this.state.currentView = 'worker';
    this.saveState();

    return { totalPoints: calculatedTotalPoints, totalWeight: calculatedTotalWeight, isUnusual };
  }

  // Category & Rate Configuration (Admin)
  updateCategoryRate(categoryId: string, newKilogramsPerPoint: number) {
    const cat = this.state.categories.find((c) => c.id === categoryId);
    if (cat && newKilogramsPerPoint > 0) {
      cat.kilogramsPerPoint = newKilogramsPerPoint;
      this.saveState();
    }
  }

  toggleCategoryEnabled(categoryId: string) {
    const cat = this.state.categories.find((c) => c.id === categoryId);
    if (cat) {
      cat.enabled = !cat.enabled;
      this.saveState();
    }
  }

  // Rewards Redemption
  redeemReward(rewardId: string, customerId: string): boolean {
    const customer = this.state.users.find((u) => u.id === customerId);
    const reward = this.state.rewards.find((r) => r.id === rewardId);
    if (!customer || !reward || customer.pointsBalance < reward.pointsRequired) {
      return false;
    }

    customer.pointsBalance -= reward.pointsRequired;

    const txNum = `RED-${Date.now().toString(36).toUpperCase()}`;
    const redemptionTx: PointsTransaction = {
      id: `tx-red-${Date.now()}`,
      transactionNumber: txNum,
      customerId: customer.id,
      customerName: customer.firstName + ' ' + customer.lastName,
      customerType: customer.accountType === 'company' ? 'company' : 'citizen',
      collectionRequestId: '',
      plasticCategoryId: '',
      plasticCategoryCode: 'REWARD',
      acceptedWeight: 0,
      appliedRewardRate: 0,
      points: -reward.pointsRequired,
      transactionType: 'debit',
      descriptionAr: `استبدال مكافأة: ${reward.titleAr}`,
      descriptionEn: `Reward redemption: ${reward.titleEn}`,
      createdAt: new Date().toISOString(),
      verificationStatus: 'verified',
    };
    this.state.transactions.unshift(redemptionTx);

    this.addNotification({
      userId: customer.id,
      targetRole: customer.accountType,
      titleAr: 'تم استبدال المكافأة بنجاح 🎁',
      titleEn: 'Reward redeemed successfully 🎁',
      messageAr: `تم خصم ${reward.pointsRequired} نقطة مقابل: ${reward.titleAr}. كود القسيمة: ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      messageEn: `Deducted ${reward.pointsRequired} points for: ${reward.titleEn}. Voucher code: ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      type: 'success',
    });

    this.saveState();
    return true;
  }

  // Notifications
  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notif,
    };
    this.state.notifications.unshift(newNotif);
    this.saveState();
  }

  markNotificationAsRead(notifId: string) {
    const n = this.state.notifications.find((not) => not.id === notifId);
    if (n) {
      n.isRead = true;
      this.saveState();
    }
  }

  markAllNotificationsAsRead(userId: string) {
    this.state.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    this.saveState();
  }
}

export const store = new Store();

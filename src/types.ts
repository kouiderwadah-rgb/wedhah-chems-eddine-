export type AccountType = 'citizen' | 'company' | 'worker' | 'admin';

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'collected'
  | 'awaiting_verification'
  | 'completed'
  | 'cancelled';

export type WorkerApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type WorkerAvailabilityStatus = 'online' | 'offline';

export interface PlasticCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  recyclingCode: number; // 1 to 7
  shortCode: string; // PET, HDPE, PVC, LDPE, PP, PS, OTHER
  descriptionAr: string;
  descriptionEn: string;
  examplesAr: string;
  examplesEn: string;
  kilogramsPerPoint: number; // e.g., 2 kg for PET, 1 kg for others, admin-configurable
  imageUrl: string;
  color: string;
  enabled: boolean;
}

export interface CollectionItem {
  id: string;
  plasticCategoryId: string;
  estimatedWeight: number; // in KG
  actualNetWeight?: number; // entered by delivery worker in KG
  pointsAwarded?: number; // automatically calculated
  appliedRewardRate?: number; // kilogramsPerPoint at time of calculation
}

export interface StatusHistoryEntry {
  status: RequestStatus;
  timestamp: string;
  noteAr?: string;
  noteEn?: string;
  actor?: string;
}

export interface CollectionRequest {
  id: string;
  requestNumber: string; // e.g., #1001
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerType: 'citizen' | 'company';
  workerId?: string;
  workerName?: string;
  workerPhone?: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  instructions: string;
  preferredTime: string;
  items: CollectionItem[];
  materialPhotoUrl?: string;
  scalePhotoUrl?: string;
  status: RequestStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  totalEstimatedWeight: number;
  totalActualWeight?: number;
  totalPointsAwarded?: number;
  isUnusualWeight?: boolean; // Flagged for admin verification if weight exceeds threshold
}

export interface PointsTransaction {
  id: string;
  transactionNumber: string;
  customerId: string;
  customerName: string;
  customerType: 'citizen' | 'company';
  collectionRequestId: string;
  plasticCategoryId: string;
  plasticCategoryCode: string;
  acceptedWeight: number; // KG
  appliedRewardRate: number; // KG required per point
  points: number;
  transactionType: 'credit' | 'debit' | 'adjustment';
  descriptionAr: string;
  descriptionEn: string;
  createdAt: string;
  verificationStatus: 'verified' | 'pending_admin' | 'rejected';
}

export interface UserProfile {
  id: string;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  companyName?: string;
  commercialRegistrationNumber?: string;
  phoneNumber: string;
  avatarUrl: string;
  address: string;
  city: string;
  pointsBalance: number;
  totalPlasticRecycledKg: number;
  accountStatus: 'active' | 'suspended';
  createdAt: string;

  // Delivery Worker specific fields
  workerDetails?: {
    driverLicenseImage: string;
    vehicleImage: string;
    vehicleType: string;
    vehiclePlateNumber: string;
    approvalStatus: WorkerApprovalStatus;
    availabilityStatus: WorkerAvailabilityStatus;
    totalCollectionsCompleted: number;
    rating: number;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  targetRole?: AccountType | 'all';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  isRead: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  relatedRequestId?: string;
}

export interface RewardCatalogItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pointsRequired: number;
  icon: string;
  partner: string;
  category: 'voucher' | 'service' | 'donation' | 'gift';
  active: boolean;
}

export interface AppSettings {
  appName: string;
  taglineAr: string;
  taglineEn: string;
  unusualWeightThresholdKg: number; // e.g. 50 kg for citizen, 1000 kg for company
  defaultLanguage: 'ar' | 'en';
  autoApproveWorkers: boolean;
  currencyPerPointEstimated: number; // 0.20 SAR
}

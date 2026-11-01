import { store } from '../services/store';
import { i18n } from '../services/i18n';
import { UserProfile, PointsTransaction, RewardCatalogItem } from '../types';
import confetti from 'canvas-confetti';

export interface RewardTier {
  id: string;
  level: number;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  color: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  minPoints: number;
  maxPoints: number;
  multiplier: string;
  perksAr: string[];
  perksEn: string[];
}

export const REWARD_TIERS: RewardTier[] = [
  {
    id: 'bronze',
    level: 1,
    nameAr: 'المستوى البرونزي',
    nameEn: 'Bronze Tier',
    titleAr: 'صديق البيئة المبتدئ',
    titleEn: 'Eco Explorer',
    icon: '🥉',
    color: '#D97706',
    bgGradient: 'from-amber-700 via-amber-600 to-amber-800',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    minPoints: 0,
    maxPoints: 500,
    multiplier: '1.0x',
    perksAr: [
      'معدل احتساب النقاط القياسي (1.0x)',
      'شهادة مساهمة بيئية رقمية معتمدة',
      'أهلية استبدال قسائم المشتريات الأساسية',
    ],
    perksEn: [
      'Standard 1.0x reward points calculation',
      'Verified digital eco-contribution certificate',
      'Eligibility for basic grocery vouchers',
    ],
  },
  {
    id: 'silver',
    level: 2,
    nameAr: 'المستوى الفضي',
    nameEn: 'Silver Tier',
    titleAr: 'حامي الطبيعة',
    titleEn: 'Nature Protector',
    icon: '🥈',
    color: '#64748B',
    bgGradient: 'from-slate-600 via-slate-500 to-slate-700',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-900',
    minPoints: 500,
    maxPoints: 1500,
    multiplier: '1.1x',
    perksAr: [
      'بونص نقاط إضافي +10% على كل عملية وزن',
      'أولوية في توجيه مناديب الجمع لموقعك',
      'خصم 5% لدى المتاجر الخضراء والشركاء',
      'شارة الفضي اللامعة في الملف الشخصي',
    ],
    perksEn: [
      'Bonus +10% reward points on every weigh-in',
      'Priority delivery worker dispatch to your address',
      '5% exclusive discount at green partner stores',
      'Silver certified badge on user profile',
    ],
  },
  {
    id: 'gold',
    level: 3,
    nameAr: 'المستوى الذهبي',
    nameEn: 'Gold Tier',
    titleAr: 'بطل إعادة التدوير',
    titleEn: 'Recycling Champion',
    icon: '🥇',
    color: '#EAB308',
    bgGradient: 'from-amber-500 via-yellow-400 to-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    minPoints: 1500,
    maxPoints: 3500,
    multiplier: '1.25x',
    perksAr: [
      'بونص نقاط إضافي +25% على كل عملية جمع',
      'أكياس فرز بلاستيك ملونة مجانية شهرياً عند باب منزلك',
      'استلام VIP سريع ومجدول خلال ساعتين',
      'قسائم وقود وشحن رصيد بأسعار نقاط مخفضة',
    ],
    perksEn: [
      'Bonus +25% points on all collection requests',
      'Free monthly pack of color-coded plastic sorting bags',
      'VIP scheduled pickup within 2 hours of request',
      'Discounted points on fuel & telecom gift cards',
    ],
  },
  {
    id: 'diamond',
    level: 4,
    nameAr: 'المستوى الماسي',
    nameEn: 'Diamond Ambassador',
    titleAr: 'سفير الاستدامة الفخري',
    titleEn: 'Sustainability Ambassador',
    icon: '💎',
    color: '#06B6D4',
    bgGradient: 'from-cyan-600 via-teal-500 to-emerald-600',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-900',
    minPoints: 3500,
    maxPoints: 10000,
    multiplier: '1.5x',
    perksAr: [
      'بونص نقاط مضاعف +50% على جميع تصنيفات البلاستيك',
      'غرس شجرة حقيقية باسمك رسمياً مع تزويدك بإحداثيات GPS',
      'إمكانية تحويل النقاط إلى استرداد نقدي مباشر (Cashback)',
      'درع تكريم سنوي للمساهمين الأكثر تأثيراً في حماية البيئة',
    ],
    perksEn: [
      'Super bonus +50% points on all 7 plastic codes',
      'Real tree planted in your name with GPS location tag',
      'Eligible for direct cash transfer (Cashback)',
      'Annual honorary crystal eco-champion shield',
    ],
  },
];

export class MyRewardsDashboard {
  private activeCategoryFilter: 'all' | 'voucher' | 'service' | 'donation' | 'gift' = 'all';
  private selectedRewardForModal: RewardCatalogItem | null = null;
  private activeSubTab: 'tiers_and_catalog' | 'ledger' | 'perks' = 'tiers_and_catalog';
  private latestRedeemedVoucherCode: string | null = null;

  static getCurrentTier(points: number): RewardTier {
    for (let i = REWARD_TIERS.length - 1; i >= 0; i--) {
      if (points >= REWARD_TIERS[i].minPoints) {
        return REWARD_TIERS[i];
      }
    }
    return REWARD_TIERS[0];
  }

  static getNextTier(points: number): RewardTier | null {
    const current = MyRewardsDashboard.getCurrentTier(points);
    const nextIndex = REWARD_TIERS.findIndex((t) => t.id === current.id) + 1;
    return nextIndex < REWARD_TIERS.length ? REWARD_TIERS[nextIndex] : null;
  }

  static getTierProgress(points: number): {
    percent: number;
    pointsToNext: number;
    currentTier: RewardTier;
    nextTier: RewardTier | null;
  } {
    const currentTier = MyRewardsDashboard.getCurrentTier(points);
    const nextTier = MyRewardsDashboard.getNextTier(points);

    if (!nextTier) {
      return {
        percent: 100,
        pointsToNext: 0,
        currentTier,
        nextTier: null,
      };
    }

    const range = nextTier.minPoints - currentTier.minPoints;
    const gainedInTier = Math.max(0, points - currentTier.minPoints);
    const percent = Math.min(100, Math.max(0, Math.round((gainedInTier / range) * 100)));
    const pointsToNext = Math.max(0, nextTier.minPoints - points);

    return {
      percent,
      pointsToNext,
      currentTier,
      nextTier,
    };
  }

  render(userOverride?: UserProfile): string {
    const user = userOverride || store.getCurrentUser();
    const lang = i18n.language;
    const isAr = lang === 'ar';

    // Metrics
    const totalWeightKg = user.totalPlasticRecycledKg || 0;
    const currentPoints = user.pointsBalance || 0;
    const userTransactions = store
      .getTransactions()
      .filter((t) => t.customerId === user.id);

    const lifetimeEarnedPoints = userTransactions
      .filter((t) => t.transactionType === 'credit')
      .reduce((sum, t) => sum + t.points, 0) || currentPoints;

    const lifetimeSpentPoints = userTransactions
      .filter((t) => t.transactionType === 'debit')
      .reduce((sum, t) => sum + Math.abs(t.points), 0);

    // Tier Progress Calculations
    const progress = MyRewardsDashboard.getTierProgress(currentPoints);
    const currentTier = progress.currentTier;
    const nextTier = progress.nextTier;

    // Environmental Equivalencies
    const co2OffsetKg = Math.round(totalWeightKg * 1.5 * 10) / 10;
    const treesEquivalent = Math.floor(totalWeightKg / 20);

    // Rewards Catalog
    const rewards = store.getState().rewards;
    const filteredRewards = this.activeCategoryFilter === 'all'
      ? rewards
      : rewards.filter((r) => r.category === this.activeCategoryFilter);

    return `
      <div class="my-rewards-component space-y-5 animate-fade-in font-cairo">
        <!-- 1. Header Banner: Title & Points Overview -->
        <div class="relative overflow-hidden rounded-3xl p-5 shadow-lg border border-amber-300 text-slate-900 bg-gradient-to-br from-[#F9D342] via-[#F6C928] to-[#E8B917]">
          <div class="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/25 blur-2xl pointer-events-none"></div>
          <div class="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-amber-400/30 blur-xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/10 text-amber-950 text-xs font-black tracking-wide mb-1.5">
                <span>🎁</span>
                <span>${isAr ? 'لوحة مكافآتي وإنجازاتي البيئية' : 'My Rewards & Eco Achievements'}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                ${isAr ? 'نقاط المكافآت والمستوى' : 'Reward Points & Tier'}
              </h2>
              <p class="text-xs text-amber-950 font-medium mt-0.5">
                ${isAr
                  ? 'اجمع البلاستيك، احصل على أوزان معتمدة بميزان المندوب، وارتقِ بمستواك لكسب مزايا حصرية!'
                  : 'Collect plastic, get physically verified weights, and level up to unlock VIP perks!'}
              </p>
            </div>

            <!-- Current Tier Badge Box -->
            <div class="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentTier.bgGradient} text-white flex items-center justify-center text-2xl shadow-md">
                ${currentTier.icon}
              </div>
              <div>
                <div class="text-[10px] font-bold text-slate-500 uppercase">
                  ${isAr ? 'المستوى الحالي' : 'Current Tier'}
                </div>
                <div class="text-sm font-black text-slate-900">
                  ${isAr ? currentTier.nameAr : currentTier.nameEn}
                </div>
                <div class="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <span>⚡</span>
                  <span>${isAr ? `مضاعف ${currentTier.multiplier}` : `${currentTier.multiplier} multiplier`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. The Three Core Metric Cards: Weight, Earned Points, Environmental Impact -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Card 1: Total Collected Plastic Weight -->
          <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">${isAr ? 'إجمالي البلاستيك الموزون' : 'Total Collected Weight'}</span>
              <span class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">⚖️</span>
            </div>
            <div class="my-3">
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-purple-700 font-mono tracking-tight">${totalWeightKg.toLocaleString()}</span>
                <span class="text-sm font-bold text-slate-600">${isAr ? 'كجم' : 'KG'}</span>
              </div>
              <div class="text-[11px] text-slate-400 mt-1">
                ${isAr ? 'تم وزنها فيزيائياً بميزان المندوب' : 'Physically measured via digital scale'}
              </div>
            </div>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>${isAr ? 'وفرت CO2:' : 'CO2 Saved:'}</span>
              <strong class="text-emerald-600 font-bold font-mono">${co2OffsetKg} ${isAr ? 'كجم' : 'KG'}</strong>
            </div>
          </div>

          <!-- Card 2: Current Earned Points Balance -->
          <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">${isAr ? 'رصيد النقاط الحالي' : 'Available Points Balance'}</span>
              <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">⭐</span>
            </div>
            <div class="my-3">
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-amber-600 font-mono tracking-tight">${currentPoints.toLocaleString()}</span>
                <span class="text-sm font-bold text-slate-600">${isAr ? 'نقطة' : 'Pts'}</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-1 font-medium">
                ${isAr
                  ? `تساوي تقريباً <strong class="text-slate-900">${(currentPoints * 0.2).toFixed(1)} ر.س</strong> قسائم`
                  : `Approx. value <strong class="text-slate-900">${(currentPoints * 0.2).toFixed(1)} SAR</strong>`}
              </div>
            </div>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>${isAr ? 'إجمالي النقاط المكتسبة:' : 'Lifetime Earned:'}</span>
              <strong class="text-slate-800 font-bold font-mono">${lifetimeEarnedPoints.toLocaleString()}</strong>
            </div>
          </div>

          <!-- Card 3: Environmental Eco-Score -->
          <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">${isAr ? 'الأثر البيئي المباشر' : 'Direct Environmental Impact'}</span>
              <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">🌱</span>
            </div>
            <div class="my-3">
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-emerald-600 font-mono tracking-tight">${treesEquivalent}</span>
                <span class="text-sm font-bold text-slate-600">${isAr ? 'أشجار مكافئة' : 'Trees Equiv.'}</span>
              </div>
              <div class="text-[11px] text-slate-400 mt-1">
                ${isAr ? 'مساهمة معتمدة في تقليل النفايات' : 'Verified circular economy contribution'}
              </div>
            </div>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>${isAr ? 'نقاط مستبدلة:' : 'Points Spent:'}</span>
              <strong class="text-slate-700 font-bold font-mono">${lifetimeSpentPoints.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <!-- 3. Progress Bar Toward the Next Reward Tier (Prominent & Gamified) -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏆</span>
              <div>
                <h3 class="font-extrabold text-slate-900 text-base">
                  ${isAr ? 'مسار الترقية إلى المستوى التالي' : 'Progress Toward Next Tier'}
                </h3>
                <p class="text-[11px] text-slate-500">
                  ${nextTier
                    ? isAr
                      ? `تبقى لك <strong>${progress.pointsToNext.toLocaleString()} نقطة</strong> للوصول إلى ${nextTier.nameAr} ${nextTier.icon}`
                      : `You need <strong>${progress.pointsToNext.toLocaleString()} points</strong> to unlock ${nextTier.nameEn} ${nextTier.icon}`
                    : isAr
                    ? 'تهانينا! لقد حققت أعلى مستوى استدامة متاح على المنصة 💎'
                    : 'Congratulations! You reached the highest tier on EcoCollect 💎'}
                </p>
              </div>
            </div>

            <!-- Percentage Pill -->
            <div class="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs font-mono">
              ${progress.percent}% ${isAr ? 'مكتمل' : 'Complete'}
            </div>
          </div>

          <!-- Progress Bar Container -->
          <div class="relative pt-2 pb-1">
            <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
              <div
                class="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-amber-400 via-emerald-400 to-[#3288D8] shadow-sm relative"
                style="width: ${progress.percent}%"
              >
                <!-- Animated shine glow -->
                <div class="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>

            <!-- Milestone Indicators along the Track -->
            <div class="flex justify-between items-center text-[11px] font-bold mt-2 text-slate-500">
              ${REWARD_TIERS.map((tier) => {
                const isReached = currentPoints >= tier.minPoints;
                const isCurrent = currentTier.id === tier.id;
                return `
                  <div class="flex flex-col items-center ${isCurrent ? 'text-slate-900 font-black scale-105' : isReached ? 'text-emerald-700' : 'text-slate-400'}">
                    <span class="text-sm mb-0.5">${tier.icon}</span>
                    <span class="text-[10px]">${isAr ? tier.nameAr.replace('المستوى ', '') : tier.nameEn.replace(' Tier', '')}</span>
                    <span class="text-[9px] font-mono text-slate-400 font-normal">${tier.minPoints} ${isAr ? 'ن' : 'pts'}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Upcoming Tier Benefits Teaser Banner -->
          ${
            nextTier
              ? `
            <div class="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/40 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
                  ${nextTier.icon}
                </div>
                <div>
                  <div class="font-bold text-slate-800">
                    ${isAr ? `مزايا ${nextTier.nameAr} القادمة:` : `Upcoming ${nextTier.nameEn} perks:`}
                  </div>
                  <div class="text-[11px] text-slate-600 mt-0.5 flex flex-wrap gap-2">
                    <span>✨ ${isAr ? `مضاعف نقاط ${nextTier.multiplier}` : `${nextTier.multiplier} points multiplier`}</span>
                    <span>•</span>
                    <span>${isAr ? nextTier.perksAr[1] : nextTier.perksEn[1]}</span>
                  </div>
                </div>
              </div>

              <button
                id="btn-view-all-tiers"
                class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold border border-slate-200 shadow-2xs transition-colors text-xs whitespace-nowrap self-end sm:self-auto"
              >
                ${isAr ? 'معاينة جميع المزايا 🔍' : 'View All Perks 🔍'}
              </button>
            </div>
          `
              : `
            <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <span>🌟</span>
              <span>${isAr ? 'أنت في أعلى رتبة! استمتع بمضاعف 1.5x وشجرة سنوية باسمك.' : 'You are at the pinnacle tier! Enjoy 1.5x points and yearly eco-honors.'}</span>
            </div>
          `
          }
        </div>

        <!-- 4. Sub-Navigation Tabs: Catalog vs. History vs. Tier Perks -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            class="tab-rewards-sub px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              this.activeSubTab === 'tiers_and_catalog'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }"
            data-subtab="tiers_and_catalog"
          >
            <span>🎁</span>
            <span>${isAr ? 'كتالوج المكافآت والقسائم' : 'Rewards Catalog'}</span>
          </button>

          <button
            class="tab-rewards-sub px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              this.activeSubTab === 'perks'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }"
            data-subtab="perks"
          >
            <span>⭐</span>
            <span>${isAr ? 'مستويات ورتب الاستدامة (4)' : 'Sustainability Tiers (4)'}</span>
          </button>

          <button
            class="tab-rewards-sub px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              this.activeSubTab === 'ledger'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }"
            data-subtab="ledger"
          >
            <span>📜</span>
            <span>${isAr ? 'سجل النقاط والحركات' : 'Points History Ledger'}</span>
          </button>
        </div>

        <!-- 5. Dynamic Sub-tab Views -->
        ${
          this.activeSubTab === 'perks'
            ? this.renderAllTiersView(currentPoints, isAr)
            : this.activeSubTab === 'ledger'
            ? this.renderLedgerView(userTransactions, isAr)
            : this.renderCatalogView(filteredRewards, currentPoints, isAr)
        }

        <!-- 6. Redemption Confirmation Modal (if active) -->
        ${this.renderRedemptionModal(user, isAr)}
      </div>
    `;
  }

  private renderCatalogView(rewards: RewardCatalogItem[], currentPoints: number, isAr: boolean): string {
    const categoriesList: Array<{ id: 'all' | 'voucher' | 'service' | 'donation' | 'gift'; labelAr: string; labelEn: string; icon: string }> = [
      { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: '✨' },
      { id: 'voucher', labelAr: 'قسائم تسوق', labelEn: 'Shopping Vouchers', icon: '🛒' },
      { id: 'service', labelAr: 'شحن رصيد وإنترنت', labelEn: 'Telecom & Data', icon: '📱' },
      { id: 'donation', labelAr: 'غرس أشجار وتبرع', labelEn: 'Eco Donations', icon: '🌳' },
      { id: 'gift', labelAr: 'وقود وخدمات', labelEn: 'Fuel & Services', icon: '⛽' },
    ];

    return `
      <div class="space-y-4">
        <!-- Category Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          ${categoriesList
            .map(
              (cat) => `
            <button
              class="btn-reward-cat-filter px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                this.activeCategoryFilter === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }"
              data-cat="${cat.id}"
            >
              <span>${cat.icon}</span>
              <span>${isAr ? cat.labelAr : cat.labelEn}</span>
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Rewards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${rewards
            .map((rew) => {
              const canAfford = currentPoints >= rew.pointsRequired;
              const pointsShort = rew.pointsRequired - currentPoints;

              return `
              <div class="bg-white rounded-3xl p-4 border ${
                canAfford ? 'border-amber-300 shadow-sm hover:border-amber-400 hover:shadow-md' : 'border-slate-200 opacity-90'
              } flex flex-col justify-between transition-all">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-xs">
                        ${rew.icon}
                      </div>
                      <div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                          ${rew.partner}
                        </span>
                        <h4 class="font-bold text-slate-900 text-sm mt-0.5 font-cairo">
                          ${isAr ? rew.titleAr : rew.titleEn}
                        </h4>
                      </div>
                    </div>

                    <!-- Points Required Badge -->
                    <span class="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-950 font-mono whitespace-nowrap border border-amber-200">
                      ${rew.pointsRequired} ${isAr ? 'نقطة' : 'Pts'}
                    </span>
                  </div>

                  <p class="text-xs text-slate-500 mt-2.5 leading-relaxed">
                    ${isAr ? rew.descriptionAr : rew.descriptionEn}
                  </p>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div class="text-[11px] text-slate-500">
                    ${
                      canAfford
                        ? `<span class="text-emerald-700 font-bold flex items-center gap-1"><span>✓</span><span>${isAr ? 'جاهز للاستبدال الفوري' : 'Eligible to redeem'}</span></span>`
                        : `<span class="text-slate-400 font-mono">${isAr ? `ينقصك ${pointsShort} نقطة` : `${pointsShort} pts needed`}</span>`
                    }
                  </div>

                  <button
                    class="btn-trigger-redeem px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-[#F9D342] hover:bg-amber-400 active:scale-95 text-slate-950 cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }"
                    data-id="${rew.id}"
                    ${!canAfford ? 'disabled' : ''}
                  >
                    <span>🎁</span>
                    <span>${canAfford ? (isAr ? 'استبدال الآن' : 'Redeem Now') : (isAr ? 'غير كافٍ' : 'Locked')}</span>
                  </button>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  private renderAllTiersView(currentPoints: number, isAr: boolean): string {
    return `
      <div class="space-y-4">
        <div class="text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200">
          <strong class="text-slate-900 block mb-1">
            ${isAr ? 'كيف تعمل مستويات المكافآت في EcoCollect؟' : 'How EcoCollect Tiers Work?'}
          </strong>
          ${isAr
            ? 'كلما زادت كميات البلاستيك التي تسلّمها وتوزن بميزان المندوب الإلكتروني، كلما كسبت نقاطاً أعلى وارتفعت رتبتك لتحصل على بونص إضافي على كل وزنة ومزايا حصرية.'
            : 'Every kilogram of plastic collected and weighed unlocks higher points multipliers and exclusive benefits.'}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${REWARD_TIERS.map((tier) => {
            const isReached = currentPoints >= tier.minPoints;
            const isCurrent = MyRewardsDashboard.getCurrentTier(currentPoints).id === tier.id;

            return `
              <div class="bg-white rounded-3xl p-5 border-2 ${
                isCurrent
                  ? 'border-amber-400 shadow-lg ring-2 ring-amber-200/50'
                  : isReached
                  ? 'border-emerald-200 shadow-xs'
                  : 'border-slate-200 opacity-80'
              } flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${tier.bgGradient} text-white flex items-center justify-center text-2xl shadow-md">
                        ${tier.icon}
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <h4 class="font-black text-slate-900 text-base font-cairo">
                            ${isAr ? tier.nameAr : tier.nameEn}
                          </h4>
                          ${
                            isCurrent
                              ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">${isAr ? 'مستواك الحالي' : 'Active'}</span>`
                              : isReached
                              ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${isAr ? 'مُنجز ✓' : 'Unlocked'}</span>`
                              : ''
                          }
                        </div>
                        <div class="text-xs text-slate-500 font-medium">${isAr ? tier.titleAr : tier.titleEn}</div>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-[10px] text-slate-400 font-bold uppercase">${isAr ? 'الحد الأدنى' : 'Min Points'}</div>
                      <div class="text-sm font-black font-mono text-slate-900">${tier.minPoints.toLocaleString()} ${isAr ? 'نقطة' : 'pts'}</div>
                    </div>
                  </div>

                  <!-- Perks List -->
                  <div class="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div class="font-bold text-slate-800 text-[11px] mb-1">${isAr ? 'المزايا الحصرية:' : 'Exclusive Perks:'}</div>
                    ${(isAr ? tier.perksAr : tier.perksEn)
                      .map(
                        (perk) => `
                      <div class="flex items-start gap-1.5">
                        <span class="text-emerald-600 font-bold">✓</span>
                        <span class="leading-relaxed">${perk}</span>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="font-bold text-amber-700">${isAr ? 'معدل النقاط:' : 'Point multiplier:'} <strong>${tier.multiplier}</strong></span>
                  <span class="text-slate-400 text-[11px]">${tier.maxPoints < 10000 ? (isAr ? `حتى ${tier.maxPoints} نقطة` : `Up to ${tier.maxPoints} pts`) : (isAr ? 'فما فوق' : 'and above')}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  private renderLedgerView(transactions: PointsTransaction[], isAr: boolean): string {
    return `
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">
              ${isAr ? 'سجل حركات النقاط الرسمي' : 'Official Points Ledger'}
            </h4>
            <p class="text-[11px] text-slate-400">
              ${isAr ? 'سجل محاسبي غير قابل للتعديل يوثق النقاط المكتسبة من الوزن والمستبدلة' : 'Immutable transaction ledger of earned & redeemed points'}
            </p>
          </div>
          <span class="text-xs font-mono text-slate-400 font-bold">${transactions.length} ${isAr ? 'حركة' : 'entries'}</span>
        </div>

        <div class="space-y-2 mt-2">
          ${
            transactions.length === 0
              ? `<div class="text-center py-8 text-slate-400 text-xs">${isAr ? 'لا توجد حركات نقاط سابقة حتى الآن' : 'No transactions recorded yet'}</div>`
              : transactions
                  .map((tx) => {
                    const isCredit = tx.transactionType === 'credit';
                    return `
                    <div class="p-3 rounded-2xl ${isCredit ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/40 border-amber-200'} border flex items-center justify-between text-xs">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl ${isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} flex items-center justify-center font-bold text-sm">
                          ${isCredit ? '⚖️' : '🎁'}
                        </div>
                        <div>
                          <div class="font-bold text-slate-900">${isAr ? tx.descriptionAr : tx.descriptionEn}</div>
                          <div class="text-[10px] text-slate-400 font-mono mt-0.5">
                            ${tx.transactionNumber} • ${new Date(tx.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>

                      <div class="font-mono font-black text-sm ${isCredit ? 'text-emerald-700' : 'text-amber-800'}">
                        ${isCredit ? `+${tx.points}` : tx.points} ${isAr ? 'نقطة' : 'pts'}
                      </div>
                    </div>
                  `;
                  })
                  .join('')
          }
        </div>
      </div>
    `;
  }

  private renderRedemptionModal(user: UserProfile, isAr: boolean): string {
    if (!this.selectedRewardForModal) return '';
    const rew = this.selectedRewardForModal;
    const canAfford = user.pointsBalance >= rew.pointsRequired;
    const remainingBalance = user.pointsBalance - rew.pointsRequired;

    return `
      <div id="rewards-redeem-modal-backdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${rew.icon}</span>
              <h3 class="font-black text-slate-900 text-base font-cairo">
                ${isAr ? 'تأكيد استبدال المكافأة' : 'Confirm Redemption'}
              </h3>
            </div>
            <button id="btn-close-rewards-modal" class="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold">✕</button>
          </div>

          <div class="text-center py-2">
            <div class="text-lg font-black text-slate-900 font-cairo">${isAr ? rew.titleAr : rew.titleEn}</div>
            <p class="text-xs text-slate-500 mt-1">${isAr ? rew.descriptionAr : rew.descriptionEn}</p>
            <div class="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-950 font-black rounded-xl text-xs font-mono">
              ${rew.pointsRequired} ${isAr ? 'نقطة مستحقة' : 'Points required'}
            </div>
          </div>

          <!-- Points summary box -->
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
            <div class="flex justify-between text-slate-500">
              <span>${isAr ? 'رصيدك الحالي:' : 'Current balance:'}</span>
              <strong class="text-slate-800">${user.pointsBalance}</strong>
            </div>
            <div class="flex justify-between text-red-600">
              <span>${isAr ? 'خصم المكافأة:' : 'Cost:'}</span>
              <strong>-${rew.pointsRequired}</strong>
            </div>
            <div class="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
              <span>${isAr ? 'الرصيد المتبقي:' : 'Remaining balance:'}</span>
              <strong>${remainingBalance}</strong>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <button
              id="btn-confirm-redeem"
              class="flex-1 py-3 bg-[#F9D342] hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              data-id="${rew.id}"
            >
              <span>🎉</span>
              <span>${isAr ? 'تأكيد الخصم والاستبدال' : 'Confirm & Deduct'}</span>
            </button>
            <button
              id="btn-cancel-redeem"
              class="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
            >
              ${isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(userOverride?: UserProfile, onStateChange?: () => void) {
    const user = userOverride || store.getCurrentUser();

    // Sub-tab switcher (catalog, perks, ledger)
    document.querySelectorAll('.tab-rewards-sub').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const sub = (e.currentTarget as HTMLElement).dataset.subtab as any;
        if (sub) {
          this.activeSubTab = sub;
          onStateChange?.();
        }
      });
    });

    // Category filter pills
    document.querySelectorAll('.btn-reward-cat-filter').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).dataset.cat as any;
        if (cat) {
          this.activeCategoryFilter = cat;
          onStateChange?.();
        }
      });
    });

    // View All Tiers button from teaser
    const btnAllTiers = document.getElementById('btn-view-all-tiers');
    if (btnAllTiers) {
      btnAllTiers.addEventListener('click', () => {
        this.activeSubTab = 'perks';
        onStateChange?.();
      });
    }

    // Trigger redemption modal
    document.querySelectorAll('.btn-trigger-redeem').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rewardId = (e.currentTarget as HTMLElement).dataset.id;
        const rew = store.getState().rewards.find((r) => r.id === rewardId);
        if (rew) {
          this.selectedRewardForModal = rew;
          onStateChange?.();
        }
      });
    });

    // Close redemption modal
    const btnCloseModal = document.getElementById('btn-close-rewards-modal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        this.selectedRewardForModal = null;
        onStateChange?.();
      });
    }
    const btnCancelModal = document.getElementById('btn-cancel-redeem');
    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', () => {
        this.selectedRewardForModal = null;
        onStateChange?.();
      });
    }

    // Confirm redemption
    const btnConfirmRedeem = document.getElementById('btn-confirm-redeem');
    if (btnConfirmRedeem) {
      btnConfirmRedeem.addEventListener('click', (e) => {
        const rewardId = (e.currentTarget as HTMLElement).dataset.id;
        if (rewardId) {
          const success = store.redeemReward(rewardId, user.id);
          if (success) {
            // Confetti effect
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F9D342', '#3288D8', '#43B96B', '#E8B917'],
              });
            } catch (err) {
              console.warn('Confetti error:', err);
            }
          }
          this.selectedRewardForModal = null;
          onStateChange?.();
        }
      });
    }
  }
}

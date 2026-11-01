import { store } from '../services/store';
import { i18n } from '../services/i18n';
import { EcoMap } from '../services/mapService';
import { CollectionRequest } from '../types';
import { MyRewardsDashboard } from '../components/MyRewardsDashboard';

export class CitizenDashboardView {
  private mapInstance: EcoMap | null = null;
  private myRewardsDashboard = new MyRewardsDashboard();
  private activeTab: 'home' | 'requests' | 'points' | 'new_request' = 'home';
  private selectedCategoriesInForm: Array<{ plasticCategoryId: string; estimatedWeight: number }> = [
    { plasticCategoryId: 'cat-pet-1', estimatedWeight: 15 },
  ];
  private pickedLat = 24.8142;
  private pickedLng = 46.6385;

  render(): string {
    const user = store.getCurrentUser();
    const categories = store.getCategories();
    const myRequests = store.getRequests().filter((r) => r.customerId === user.id);
    const myTransactions = store.getTransactions().filter((t) => t.customerId === user.id);
    const unreadNotifs = store.getUnreadNotificationsCount(user.id);

    // Calculated environmental metrics
    const totalKg = user.totalPlasticRecycledKg || 184.5;
    const co2Saved = Math.round(totalKg * 1.5 * 10) / 10; // ~1.5 kg CO2 per kg plastic recycled
    const trees = Math.max(1, Math.round(totalKg / 20));

    return `
      <div class="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
        <!-- A. Welcome Section & Avatar -->
        <div class="flex items-center justify-between bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div class="flex items-center gap-3.5">
            <div class="relative">
              <img
                src="${user.avatarUrl}"
                alt="${user.firstName}"
                class="w-14 h-14 rounded-2xl object-cover border-2 border-[#F9D342] shadow-sm"
              />
              <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div class="text-xs text-slate-500 font-medium">${i18n.t('citizenWelcome')}</div>
              <h2 class="text-xl font-extrabold text-slate-800 font-cairo">
                ${user.firstName} ${user.lastName}
              </h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  🌱 مواطن بيئي مميز
                </span>
                <span class="text-xs text-slate-400">📍 ${user.city}</span>
              </div>
            </div>
          </div>

          <!-- Notification Bell & Quick Actions -->
          <div class="flex items-center gap-2">
            <button id="btn-citizen-notifs" class="relative p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
              <span class="text-xl">🔔</span>
              ${
                unreadNotifs > 0
                  ? `<span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow">${unreadNotifs}</span>`
                  : ''
              }
            </button>
          </div>
        </div>

        <!-- Sub Tabs / Navigation Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button id="tab-home" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'home'
              ? 'bg-[#F9D342] text-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>🏠</span>
            <span>الرئيسية والميزان</span>
          </button>

          <button id="tab-requests" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'requests'
              ? 'bg-[#F9D342] text-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>📦</span>
            <span>طلبات الجمع النشطة (${myRequests.length})</span>
          </button>

          <button id="tab-points" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'points'
              ? 'bg-[#F9D342] text-slate-900 shadow-md scale-102 font-black'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>🎁</span>
            <span>مكافآتي والمستوى (My Rewards)</span>
          </button>
        </div>

        ${
          this.activeTab === 'new_request'
            ? this.renderNewRequestForm(categories)
            : this.activeTab === 'requests'
            ? this.renderMyRequestsList(myRequests)
            : this.activeTab === 'points'
            ? this.myRewardsDashboard.render(user)
            : this.renderHomeTab(user, totalKg, co2Saved, trees, myRequests)
        }
      </div>
    `;
  }

  private renderHomeTab(
    user: any,
    totalKg: number,
    co2Saved: number,
    trees: number,
    myRequests: CollectionRequest[]
  ): string {
    const tierProgress = MyRewardsDashboard.getTierProgress(user.pointsBalance);
    const currentTier = tierProgress.currentTier;
    const nextTier = tierProgress.nextTier;

    return `
      <!-- B. Points Balance Card (Prominently Displayed) -->
      <div class="relative overflow-hidden rounded-3xl p-6 shadow-xl text-slate-900 border border-amber-300" style="background: linear-gradient(135deg, #F9D342 0%, #F6C928 60%, #E8B917 100%);">
        <div class="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/20 blur-xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900/80">
              <span>⭐</span>
              <span>${i18n.t('pointsBalance')}</span>
            </div>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-4xl sm:text-5xl font-black font-cairo text-slate-900">
                ${user.pointsBalance.toLocaleString()}
              </span>
              <span class="text-lg font-bold text-amber-900">${i18n.t('pointsUnit')}</span>
            </div>
            <p class="text-xs text-amber-950 font-medium mt-1">
              تساوي تقريباً <strong>${(user.pointsBalance * 0.2).toFixed(1)} ر.س</strong> قابلة للاستبدال بقسائم مشتريات فورية
            </p>
          </div>

          <!-- Environmental Impact Badges -->
          <div class="grid grid-cols-3 gap-2 bg-white/35 backdrop-blur-md p-3 rounded-2xl border border-white/50 text-center">
            <div class="p-1">
              <div class="text-lg">♻️</div>
              <div class="text-xs font-black text-slate-900">${totalKg} كجم</div>
              <div class="text-[10px] text-slate-800">بلاستيك مُعاد تدويره</div>
            </div>
            <div class="p-1 border-x border-amber-900/15">
              <div class="text-lg">🌍</div>
              <div class="text-xs font-black text-slate-900">${co2Saved} كجم</div>
              <div class="text-[10px] text-slate-800">وفّر انبعاثات CO2</div>
            </div>
            <div class="p-1">
              <div class="text-lg">🌳</div>
              <div class="text-xs font-black text-slate-900">${trees}</div>
              <div class="text-[10px] text-slate-800">أشجار مكافئة</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 'My Rewards' Dashboard Widget: Total Weight, Points & Next Tier Progress -->
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentTier.bgGradient} text-white flex items-center justify-center text-xl shadow-sm">
              ${currentTier.icon}
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs text-slate-400 font-bold uppercase">المستوى الحالي:</span>
                <span class="text-sm font-black text-slate-900 font-cairo">${currentTier.nameAr}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                  ⚡ مضاعف ${currentTier.multiplier}
                </span>
              </div>
              <div class="text-[11px] text-slate-500 mt-0.5">
                ${
                  nextTier
                    ? `تبقى <strong class="text-amber-600 font-mono">${tierProgress.pointsToNext.toLocaleString()} نقطة</strong> للترقية إلى ${nextTier.nameAr} ${nextTier.icon}`
                    : 'أنت في أعلى رتبة استدامة على المنصة 💎'
                }
              </div>
            </div>
          </div>

          <button
            id="btn-quick-open-rewards"
            class="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
          >
            <span>🎁</span>
            <span>لوحة المكافآت</span>
            <span>←</span>
          </button>
        </div>

        <!-- Progress Bar toward Next Tier -->
        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between items-center text-[11px]">
            <span class="font-bold text-slate-600 flex items-center gap-1">
              <span>🚀</span>
              <span>التقدم نحو ${nextTier ? nextTier.nameAr : 'المستوى الأقصى'}:</span>
            </span>
            <span class="font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ${tierProgress.percent}%
            </span>
          </div>
          <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
            <div
              class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-500 shadow-xs relative"
              style="width: ${tierProgress.percent}%"
            >
              <div class="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- Metric highlights inside widget -->
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div class="p-2 rounded-xl bg-slate-50 flex items-center justify-between">
            <span class="text-slate-500 text-[11px]">إجمالي وزن البلاستيك:</span>
            <strong class="font-mono font-bold text-purple-700">${totalKg} كجم</strong>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 flex items-center justify-between">
            <span class="text-slate-500 text-[11px]">رصيد النقاط المحسوبة:</span>
            <strong class="font-mono font-bold text-amber-600">${user.pointsBalance} نقطة</strong>
          </div>
        </div>
      </div>

      <!-- D. Main Action: Request Plastic Collection -->
      <div>
        <button
          id="btn-open-request-form"
          class="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-extrabold text-base sm:text-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 transform"
        >
          <span class="text-2xl animate-bounce">🚚</span>
          <span>${i18n.t('requestCollectionBtn')}</span>
          <span class="text-xs bg-white/20 px-3 py-1 rounded-full font-normal">استلام ووزن من منزلك</span>
        </button>
      </div>

      <!-- C. Interactive Map: Display available plastic collection requests and relevant collection locations -->
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">📍</span>
            <h3 class="font-bold text-slate-800 font-cairo">
              خريطة طلبات الجمع ومواقع الاستلام القريبة
            </h3>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="inline-flex items-center gap-1 font-semibold text-amber-600">
              <span class="w-2.5 h-2.5 rounded-full bg-[#F9D342]"></span>
              طلب مواطن
            </span>
            <span class="inline-flex items-center gap-1 font-semibold text-blue-600">
              <span class="w-2.5 h-2.5 rounded-full bg-[#3288D8]"></span>
              طلب شركة
            </span>
          </div>
        </div>

        <div id="citizen-interactive-map" class="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-bold">
            جاري تحميل خريطة المواقع التفاعلية...
          </div>
        </div>
      </div>

      <!-- 7 Plastic Categories Quick Manual Guide -->
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-800 font-cairo">
              ${i18n.t('plasticCategoriesTitle')}
            </h3>
            <p class="text-xs text-emerald-700 font-semibold mt-0.5">
              ${i18n.t('plasticNoticeManual')}
            </p>
          </div>
          <span class="text-xs text-slate-400">رموز 1 إلى 7</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          ${store
            .getCategories()
            .slice(0, 4)
            .map(
              (c) => `
            <div class="p-3 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition-colors flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-sm" style="background: ${c.color}">
                  ${c.recyclingCode}
                </span>
                <span class="text-[11px] font-bold text-slate-500">${c.shortCode}</span>
              </div>
              <div class="mt-2 text-xs font-bold text-slate-800 line-clamp-1">${c.nameAr}</div>
              <div class="text-[11px] text-emerald-700 font-bold mt-1">
                ${c.kilogramsPerPoint} كجم = 1 نقطة
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Recent Active Requests Preview -->
      ${
        myRequests.length > 0
          ? `
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-800 font-cairo">
              أحدث طلب جمع نشط
            </h3>
            <button id="btn-view-all-requests" class="text-xs text-emerald-700 font-bold hover:underline">
              عرض جميع الطلبات (${myRequests.length}) ←
            </button>
          </div>

          ${this.renderRequestCard(myRequests[0])}
        </div>
      `
          : ''
      }
    `;
  }

  private renderNewRequestForm(categories: any[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-5 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 font-cairo">
              ${i18n.t('newRequestTitle')}
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              اختر أصناف البلاستيك المفرزة وضع وزناً تقديرياً (سيقوم المندوب بالوزن الفعلي الدقيق بالميزان عند الاستلام).
            </p>
          </div>
          <button id="btn-cancel-request-form" class="text-xs text-slate-500 hover:text-slate-800 p-2">
            ✕ إلغاء
          </button>
        </div>

        <form id="form-create-collection-req" class="space-y-4">
          <!-- Plastic Category Items Selection -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-700">
                ${i18n.t('selectCategoriesHint')}
              </label>
              <button
                type="button"
                id="btn-add-form-item"
                class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <span>+</span>
                <span>${i18n.t('addCategoryBtn')}</span>
              </button>
            </div>

            <div id="form-items-container" class="space-y-2.5">
              ${this.selectedCategoriesInForm
                .map(
                  (item, idx) => `
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <div class="w-full sm:flex-1">
                    <label class="block text-[10px] text-slate-500 font-bold mb-1">صنف البلاستيك (فرز يدوي):</label>
                    <select class="form-cat-select w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white" data-index="${idx}">
                      ${categories
                        .map(
                          (c) => `
                        <option value="${c.id}" ${c.id === item.plasticCategoryId ? 'selected' : ''}>
                          كود ${c.recyclingCode} (${c.shortCode}) - ${c.nameAr} [${c.kilogramsPerPoint} كجم = 1 نقطة]
                        </option>
                      `
                        )
                        .join('')}
                    </select>
                  </div>

                  <div class="w-full sm:w-40">
                    <label class="block text-[10px] text-slate-500 font-bold mb-1">${i18n.t('estimatedWeight')}:</label>
                    <div class="relative">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        step="0.5"
                        required
                        value="${item.estimatedWeight}"
                        class="form-weight-input w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                        data-index="${idx}"
                      />
                      <span class="absolute left-3 top-2 text-[11px] text-slate-400 font-bold">كجم</span>
                    </div>
                  </div>

                  ${
                    this.selectedCategoriesInForm.length > 1
                      ? `
                    <button type="button" class="btn-remove-item text-red-500 hover:text-red-700 p-2 text-sm" data-index="${idx}">
                      🗑️
                    </button>
                  `
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Pickup Address & GPS Location Picker -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-700">
                ${i18n.t('pickupLocation')} <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                id="btn-detect-gps"
                class="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>🎯</span>
                <span>${i18n.t('detectLocationBtn')}</span>
              </button>
            </div>

            <input
              type="text"
              id="input-req-address"
              required
              placeholder="${i18n.t('addressPlaceholder')}"
              value="حي النرجس، شارع أنس بن مالك، فيلا 24، الرياض"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <!-- Additional Instructions -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${i18n.t('instructionsLabel')}
            </label>
            <textarea
              id="input-req-instructions"
              rows="2"
              placeholder="${i18n.t('instructionsPlaceholder')}"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >الأكياس موجودة عند الباب الجانبي للكراج، يرجى الاتصال عند الوصول.</textarea>
          </div>

          <!-- Preferred Collection Time -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${i18n.t('preferredTimeLabel')}
            </label>
            <select id="input-req-time" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white">
              <option value="اليوم: خلال ساعتين (عاجل)">اليوم: خلال ساعتين (عاجل)</option>
              <option value="اليوم: بين 4:00 إلى 6:00 مساءً" selected>اليوم: بين 4:00 إلى 6:00 مساءً</option>
              <option value="صباح الغد: بين 9:00 إلى 12:00 ظهراً">صباح الغد: بين 9:00 إلى 12:00 ظهراً</option>
            </select>
          </div>

          <!-- Notice about zero AI and physical scale weighing -->
          <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
            <span class="text-base">⚖️</span>
            <div>
              <strong>تأكيد الوزن الفيزيائي:</strong> سيحضر مندوب معتمد ومعه ميزان إلكتروني دقيق، وسيقوم بوزن كل صنف بلاستيكي واستبعاد أي شوائب واحتساب نقاطك فوراً وفق المعادلة المعتمدة!
            </div>
          </div>

          <!-- Submit Request CTA -->
          <div class="flex items-center gap-3 pt-3">
            <button
              type="submit"
              id="btn-submit-collection-req"
              class="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>${i18n.t('confirmRequestBtn')}</span>
            </button>
            <button
              type="button"
              id="btn-cancel-request-bottom"
              class="py-4 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    `;
  }

  private renderMyRequestsList(requests: CollectionRequest[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-bold text-slate-800 font-cairo text-lg">
              ${i18n.t('myRequests')} (${requests.length})
            </h3>
            <p class="text-xs text-slate-500">متابعة مسار المندوب وحالة الفحص والوزن الفعلي لحظة بلحظة</p>
          </div>
          <button id="btn-create-another-req" class="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl shadow hover:bg-emerald-500">
            + طلب جديد
          </button>
        </div>

        ${
          requests.length === 0
            ? `
          <div class="text-center py-12 text-slate-400 space-y-2">
            <div class="text-4xl">📭</div>
            <div class="font-bold text-sm">لا توجد طلبات جمع مسجلة حالياً</div>
            <div class="text-xs">ابدأ الآن بطلب جمع أول كمية بلاستيك من منزلك واكسب النقاط!</div>
          </div>
        `
            : `
          <div class="space-y-4">
            ${requests.map((r) => this.renderRequestCard(r)).join('')}
          </div>
        `
        }
      </div>
    `;
  }

  private renderRequestCard(req: CollectionRequest): string {
    const isCompleted = req.status === 'completed';
    const isArrived = req.status === 'arrived';
    const isOnTheWay = req.status === 'on_the_way';
    const isPending = req.status === 'pending';

    const statusBadgeColors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 border-amber-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      on_the_way: 'bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse',
      arrived: 'bg-purple-100 text-purple-800 border-purple-300',
      collected: 'bg-teal-100 text-teal-800 border-teal-300',
      awaiting_verification: 'bg-orange-100 text-orange-800 border-orange-300',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
    };

    const statusLabels: Record<string, string> = {
      pending: 'قيد الانتظار',
      accepted: 'تم قبول الطلب',
      on_the_way: 'المندوب في الطريق إليك 🚀',
      arrived: 'وصل المندوب للموقع ويقوم بالوزن ⚖️',
      collected: 'تم استلام البلاستيك',
      awaiting_verification: 'بانتظار التحقق من الوزن',
      completed: 'مكتمل ومضاف النقاط ✓',
      cancelled: 'ملغي',
    };

    return `
      <div class="p-4 rounded-2xl border ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'} shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-slate-800 text-sm">${req.requestNumber}</span>
            <span class="text-xs text-slate-400">• ${new Date(req.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadgeColors[req.status] || 'bg-slate-100 text-slate-800'}">
            ${statusLabels[req.status] || req.status}
          </span>
        </div>

        <!-- Items details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div class="text-[10px] text-slate-500 font-bold mb-1">أصناف البلاستيك المطلوبة:</div>
            <div class="space-y-1">
              ${req.items
                .map((i) => {
                  const cat = store.getCategories().find((c) => c.id === i.plasticCategoryId);
                  return `
                  <div class="flex items-center justify-between">
                    <span class="font-semibold text-slate-700">${cat?.shortCode || 'بلاستيك'}:</span>
                    <span class="font-mono font-bold text-slate-900">
                      ${i.actualNetWeight ? `${i.actualNetWeight} كجم (فعلي)` : `${i.estimatedWeight} كجم (تقديري)`}
                    </span>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div class="text-[10px] text-slate-500 font-bold mb-1">المندوب المخصص:</div>
              <div class="font-bold text-slate-800 text-xs">
                ${req.workerName ? `🚛 ${req.workerName} (${req.workerPhone})` : 'بانتظار قبول أقرب مندوب متاح'}
              </div>
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              📍 ${req.address}
            </div>
          </div>
        </div>

        ${
          isCompleted && req.totalPointsAwarded
            ? `
          <div class="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 text-emerald-900 font-bold">
              <span>🎉</span>
              <span>الوزن الصافي المعتمد: <strong>${req.totalActualWeight} كجم</strong></span>
            </div>
            <div class="font-bold text-emerald-800 text-sm">
              +${req.totalPointsAwarded} نقطة مكتسبة!
            </div>
          </div>
        `
            : ''
        }

        ${
          isOnTheWay || isArrived
            ? `
          <div class="flex items-center gap-2 pt-1">
            <span class="text-xs text-purple-700 font-bold animate-pulse">
              ● المندوب بالقرب منك، يرجى تجهيز الأكياس للفحص والوزن
            </span>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  private renderPointsAndRewards(user: any, transactions: any[]): string {
    const rewards = store.getState().rewards;

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Rewards Catalog -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-slate-800 font-cairo text-lg">
                ${i18n.t('rewardsCatalog')}
              </h3>
              <p class="text-xs text-slate-500">استبدل نقاطك بقسائم مشتريات وشحن رصيد وغرس أشجار</p>
            </div>
            <div class="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-xl">
              رصيدك: ${user.pointsBalance} نقطة
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${rewards
              .map((rew) => {
                const canAfford = user.pointsBalance >= rew.pointsRequired;
                return `
                <div class="p-4 rounded-2xl border ${canAfford ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 bg-slate-50/50'} flex flex-col justify-between gap-3">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl">${rew.category === 'voucher' ? '🏷️' : rew.category === 'donation' ? '🌳' : '📱'}</span>
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-200 text-amber-900">
                        ${rew.pointsRequired} نقطة
                      </span>
                    </div>
                    <div class="font-bold text-slate-800 text-sm mt-2 font-cairo">${rew.titleAr}</div>
                    <div class="text-xs text-slate-500 mt-1">${rew.descriptionAr}</div>
                  </div>

                  <button
                    class="btn-redeem-reward w-full py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }"
                    data-id="${rew.id}"
                    ${!canAfford ? 'disabled' : ''}
                  >
                    ${canAfford ? 'استبدال الآن' : 'نقاط غير كافية'}
                  </button>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>

        <!-- Points Transactions Ledger -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 class="font-bold text-slate-800 font-cairo text-lg">
            سجل حركات النقاط الرسمية (Ledger)
          </h3>

          <div class="space-y-2">
            ${
              transactions.length === 0
                ? `<div class="text-center py-6 text-slate-400 text-xs">لا توجد حركات نقاط سابقة</div>`
                : transactions
                    .map(
                      (tx) => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-bold text-slate-800">${tx.descriptionAr}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5 font-mono">
                      ${tx.transactionNumber} • ${new Date(tx.createdAt).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <div class="font-mono font-black text-sm ${tx.points >= 0 ? 'text-emerald-600' : 'text-red-500'}">
                    ${tx.points >= 0 ? `+${tx.points}` : tx.points} نقطة
                  </div>
                </div>
              `
                    )
                    .join('')
            }
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Sub tabs
    document.getElementById('tab-home')?.addEventListener('click', () => {
      this.activeTab = 'home';
      this.refresh();
    });

    document.getElementById('tab-requests')?.addEventListener('click', () => {
      this.activeTab = 'requests';
      this.refresh();
    });

    document.getElementById('tab-points')?.addEventListener('click', () => {
      this.activeTab = 'points';
      this.refresh();
    });

    document.getElementById('btn-quick-open-rewards')?.addEventListener('click', () => {
      this.activeTab = 'points';
      this.refresh();
    });

    // Delegate events for MyRewardsDashboard if active
    if (this.activeTab === 'points') {
      const user = store.getCurrentUser();
      this.myRewardsDashboard.attachEvents(user, () => this.refresh());
    }

    document.getElementById('btn-open-request-form')?.addEventListener('click', () => {
      this.activeTab = 'new_request';
      this.refresh();
    });

    document.getElementById('btn-create-another-req')?.addEventListener('click', () => {
      this.activeTab = 'new_request';
      this.refresh();
    });

    document.getElementById('btn-cancel-request-form')?.addEventListener('click', () => {
      this.activeTab = 'home';
      this.refresh();
    });

    document.getElementById('btn-cancel-request-bottom')?.addEventListener('click', () => {
      this.activeTab = 'home';
      this.refresh();
    });

    document.getElementById('btn-view-all-requests')?.addEventListener('click', () => {
      this.activeTab = 'requests';
      this.refresh();
    });

    // Add plastic item in request form
    document.getElementById('btn-add-form-item')?.addEventListener('click', () => {
      const cats = store.getCategories();
      const nextCat = cats[(this.selectedCategoriesInForm.length + 1) % cats.length];
      this.selectedCategoriesInForm.push({
        plasticCategoryId: nextCat.id,
        estimatedWeight: 10,
      });
      this.refresh();
    });

    // Category changes
    document.querySelectorAll('.form-cat-select').forEach((el) => {
      el.addEventListener('change', (e: any) => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        this.selectedCategoriesInForm[idx].plasticCategoryId = e.target.value;
      });
    });

    // Weight changes
    document.querySelectorAll('.form-weight-input').forEach((el) => {
      el.addEventListener('input', (e: any) => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        this.selectedCategoriesInForm[idx].estimatedWeight = parseFloat(e.target.value) || 1;
      });
    });

    // Remove item
    document.querySelectorAll('.btn-remove-item').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        if (this.selectedCategoriesInForm.length > 1) {
          this.selectedCategoriesInForm.splice(idx, 1);
          this.refresh();
        }
      });
    });

    // GPS location detection
    document.getElementById('btn-detect-gps')?.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.pickedLat = pos.coords.latitude;
            this.pickedLng = pos.coords.longitude;
            alert(`تم تحديد إحداثيات موقعك بنجاح عبر GPS:\n${this.pickedLat.toFixed(4)}, ${this.pickedLng.toFixed(4)}`);
          },
          () => {
            alert('تعذر الوصول إلى GPS، تم تعيين موقع افتراضي في الرياض.');
          }
        );
      }
    });

    // Form submit
    const formReq = document.getElementById('form-create-collection-req') as HTMLFormElement;
    if (formReq) {
      formReq.onsubmit = (e) => {
        e.preventDefault();
        const address = (document.getElementById('input-req-address') as HTMLInputElement)?.value;
        const instructions = (document.getElementById('input-req-instructions') as HTMLTextAreaElement)?.value;
        const time = (document.getElementById('input-req-time') as HTMLSelectElement)?.value;

        store.createCollectionRequest({
          items: this.selectedCategoriesInForm,
          address,
          instructions,
          preferredTime: time,
          latitude: this.pickedLat,
          longitude: this.pickedLng,
        });

        alert('🎉 تم إنشاء طلب جمع البلاستيك بنجاح وبثه للمناديب المعتمدين في منطقتك!');
        this.activeTab = 'requests';
        this.refresh();
      };
    }

    // Redeem reward buttons
    document.querySelectorAll('.btn-redeem-reward').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id') || '';
        const user = store.getCurrentUser();
        const success = store.redeemReward(id, user.id);
        if (success) {
          alert('🎁 تم استبدال المكافأة بنجاح وتم إرسال كود القسيمة في الإشعارات!');
          this.refresh();
        } else {
          alert('رصيد النقاط غير كافٍ لاستبدال هذه المكافأة.');
        }
      });
    });

    // Initialize Map if on home tab
    if (this.activeTab === 'home') {
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }

  private initMap() {
    this.mapInstance = new EcoMap();
    const success = this.mapInstance.init('citizen-interactive-map', 24.7136, 46.6753, 11);
    if (success) {
      const allRequests = store.getRequests();
      this.mapInstance.renderRequests(allRequests);
      this.mapInstance.setUserLocation(24.8142, 46.6385, 'موقعك (سارة - حي النرجس)');
    }
  }

  private refresh() {
    const currentApp = (window as any).__ecoApp;
    currentApp?.render();
  }
}

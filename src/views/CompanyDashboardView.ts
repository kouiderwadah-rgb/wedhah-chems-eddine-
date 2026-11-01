import { store } from '../services/store';
import { i18n } from '../services/i18n';
import { EcoMap } from '../services/mapService';
import { CollectionRequest } from '../types';
import { MyRewardsDashboard } from '../components/MyRewardsDashboard';

export class CompanyDashboardView {
  private mapInstance: EcoMap | null = null;
  private myRewardsDashboard = new MyRewardsDashboard();
  private activeTab: 'overview' | 'requests' | 'bulk_request' | 'esg' | 'rewards' = 'overview';
  private selectedCategories: Array<{ plasticCategoryId: string; estimatedWeight: number }> = [
    { plasticCategoryId: 'cat-pet-1', estimatedWeight: 250 },
    { plasticCategoryId: 'cat-hdpe-2', estimatedWeight: 150 },
    { plasticCategoryId: 'cat-ldpe-4', estimatedWeight: 100 },
  ];

  render(): string {
    const user = store.getCurrentUser();
    const categories = store.getCategories();
    const companyRequests = store.getRequests().filter((r) => r.customerId === user.id);
    const companyTransactions = store.getTransactions().filter((t) => t.customerId === user.id);

    const totalWeightKg = user.totalPlasticRecycledKg || 5420.0;
    const esgScore = Math.min(100, Math.round((totalWeightKg / 5000) * 95));

    return `
      <div class="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 animate-fade-in pb-24">
        <!-- Company Header Profile -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md">
              🏢
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                  حساب منشأة تجارية معتمدة
                </span>
                <span class="text-xs text-slate-400 font-mono">
                  CR: ${user.commercialRegistrationNumber || '1010894523'}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-800 font-cairo mt-1">
                ${user.companyName || 'شركة الواحة الخضراء للضيافة'}
              </h2>
              <div class="text-xs text-slate-500 mt-0.5">
                المسؤول: ${user.firstName} ${user.lastName} • 📍 ${user.address || 'المدينة الصناعية الثانية، الرياض'}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-quick-bulk-request" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2">
              <span>📦</span>
              <span>${i18n.t('bulkRequestBtn')}</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button id="tab-co-overview" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'overview'
              ? 'bg-[#3288D8] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>📊</span>
            <span>نظرة عامة والعمليات</span>
          </button>

          <button id="tab-co-requests" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'requests'
              ? 'bg-[#3288D8] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>🚛</span>
            <span>طلبات الجمع التجارية (${companyRequests.length})</span>
          </button>

          <button id="tab-co-bulk" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'bulk_request'
              ? 'bg-[#3288D8] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>➕</span>
            <span>إنشاء طلب جمع بكميات كبيرة</span>
          </button>

          <button id="tab-co-esg" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'esg'
              ? 'bg-[#3288D8] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>📜</span>
            <span>شهادة الاستدامة وتقرير ESG</span>
          </button>

          <button id="tab-co-rewards" class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            this.activeTab === 'rewards'
              ? 'bg-[#F9D342] text-slate-950 font-black shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }">
            <span>🎁</span>
            <span>مكافآت المنشأة والمستوى (My Rewards)</span>
          </button>
        </div>

        ${
          this.activeTab === 'bulk_request'
            ? this.renderBulkRequestForm(categories)
            : this.activeTab === 'requests'
            ? this.renderCompanyRequests(companyRequests)
            : this.activeTab === 'esg'
            ? this.renderEsgReport(user, totalWeightKg, esgScore)
            : this.activeTab === 'rewards'
            ? this.myRewardsDashboard.render(user)
            : this.renderOverviewTab(user, totalWeightKg, companyRequests, companyTransactions)
        }
      </div>
    `;
  }

  private renderOverviewTab(
    user: any,
    totalWeightKg: number,
    requests: CollectionRequest[],
    transactions: any[]
  ): string {
    return `
      <!-- Corporate Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Balance Card -->
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div class="text-xs text-blue-200 font-bold uppercase tracking-wider">
            رصيد نقاط المنشأة المعتمد
          </div>
          <div class="text-4xl font-black font-cairo mt-1">
            ${user.pointsBalance.toLocaleString()} <span class="text-base font-normal">نقطة</span>
          </div>
          <div class="text-xs text-blue-100 mt-2">
            مكافآت مستحقة واسترداد نقدي بيئي
          </div>
        </div>

        <!-- Total Diverted Weight -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>إجمالي البلاستيك المفرغ (كجم)</span>
            <span class="text-xl">⚖️</span>
          </div>
          <div class="text-3xl font-black text-slate-900 font-cairo mt-1">
            ${totalWeightKg.toLocaleString()} <span class="text-sm font-normal text-slate-500">كجم</span>
          </div>
          <div class="text-xs text-emerald-600 font-semibold mt-2">
            ✓ تم فحصها ووزنها بموازين معتمدة
          </div>
        </div>

        <!-- ESG / Sustainability Rating -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>مؤشر التدوير المؤسسي ESG</span>
            <span class="text-xl">🏅</span>
          </div>
          <div class="text-3xl font-black text-blue-600 font-cairo mt-1">
            فئة A+ (متقدم)
          </div>
          <div class="text-xs text-slate-500 mt-2">
            مؤهلة لشهادة التميز البيئي الوطني
          </div>
        </div>
      </div>

      <!-- Company Interactive Map -->
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">📍</span>
            <h3 class="font-bold text-slate-800 font-cairo">
              خريطة منشآت ومستودعات الجمع النشطة
            </h3>
          </div>
          <span class="text-xs text-blue-600 font-bold">علامات زرقاء: طلبات تجارية</span>
        </div>

        <div id="company-interactive-map" class="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            جاري تهيئة الخريطة...
          </div>
        </div>
      </div>

      <!-- Recent Transactions Ledger -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-800 font-cairo">
            سجل تحويلات الأوزان والنقاط التجارية
          </h3>
          <span class="text-xs text-slate-400">تدقيق إلكتروني معتمد</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 font-bold">
                <th class="py-2.5">رقم الحركة</th>
                <th class="py-2.5">البيان وصنف البلاستيك</th>
                <th class="py-2.5">الوزن الصافي</th>
                <th class="py-2.5">المعدل المطبق</th>
                <th class="py-2.5">النقاط المستحقة</th>
                <th class="py-2.5">التاريخ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${
                transactions.length === 0
                  ? `<tr><td colspan="6" class="text-center py-6 text-slate-400">لا توجد حركات مسجلة</td></tr>`
                  : transactions
                      .map(
                        (t) => `
                  <tr>
                    <td class="py-3 font-mono font-bold text-slate-700">${t.transactionNumber}</td>
                    <td class="py-3 font-medium text-slate-900">${t.descriptionAr}</td>
                    <td class="py-3 font-mono font-bold text-slate-800">${t.acceptedWeight} كجم</td>
                    <td class="py-3 font-mono text-slate-600">${t.appliedRewardRate} كجم/نقطة</td>
                    <td class="py-3 font-mono font-bold text-emerald-600">+${t.points}</td>
                    <td class="py-3 text-slate-400">${new Date(t.createdAt).toLocaleDateString('ar-SA')}</td>
                  </tr>
                `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private renderBulkRequestForm(categories: any[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-5 animate-fade-in">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-slate-800 font-cairo">
              طلب جمع تجاري بكميات كبيرة (Bulk Collection)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              مخصص للشركات والمصانع ومراكز التوزيع مع موازين طبالي معتمدة وشاحنات نقل مجهزة.
            </p>
          </div>
          <button id="btn-cancel-bulk-form" class="text-xs text-slate-500 hover:text-slate-800 p-2">
            ✕ إلغاء
          </button>
        </div>

        <form id="form-create-bulk-req" class="space-y-4">
          <!-- Categories & Large Weights -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-700">
                أصناف البلاستيك المفرزة والأوزان التقديرية بالباليتات أو الكيلوجرام:
              </label>
              <button
                type="button"
                id="btn-add-bulk-item"
                class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                + إضافة صنف آخر
              </button>
            </div>

            <div id="bulk-items-container" class="space-y-2.5">
              ${this.selectedCategories
                .map(
                  (item, idx) => `
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <div class="w-full sm:flex-1">
                    <label class="block text-[10px] text-slate-500 font-bold mb-1">صنف البلاستيك:</label>
                    <select class="bulk-cat-select w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white" data-index="${idx}">
                      ${categories
                        .map(
                          (c) => `
                        <option value="${c.id}" ${c.id === item.plasticCategoryId ? 'selected' : ''}>
                          كود ${c.recyclingCode} (${c.shortCode}) - ${c.nameAr}
                        </option>
                      `
                        )
                        .join('')}
                    </select>
                  </div>

                  <div class="w-full sm:w-48">
                    <label class="block text-[10px] text-slate-500 font-bold mb-1">الكمية المقدرة (كجم):</label>
                    <div class="relative">
                      <input
                        type="number"
                        min="50"
                        max="50000"
                        step="10"
                        required
                        value="${item.estimatedWeight}"
                        class="bulk-weight-input w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                        data-index="${idx}"
                      />
                      <span class="absolute left-3 top-2 text-[11px] text-slate-400 font-bold">كجم</span>
                    </div>
                  </div>

                  ${
                    this.selectedCategories.length > 1
                      ? `
                    <button type="button" class="btn-remove-bulk-item text-red-500 hover:text-red-700 p-2 text-sm" data-index="${idx}">
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

          <!-- Pickup Facility Details -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              موقع المستودع أو رصيف التحميل:
            </label>
            <input
              type="text"
              id="input-bulk-address"
              required
              value="المدينة الصناعية الثانية، مخرج 14، مستودع رقم 12، الرياض"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <!-- Operational Instructions -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              تعليمات خاصة وتنسيق الدخول:
            </label>
            <textarea
              id="input-bulk-instructions"
              rows="2"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
            >الكميات مجهزة على باليتات خشبية مغلفة ببلاستيك استريتش، يتوفر رافعة شوكية (فوركلفت) ورصيف تحميل مجهز.</textarea>
          </div>

          <!-- Time Window -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              موعد التحميل المفضل:
            </label>
            <select id="input-bulk-time" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
              <option value="غداً صباحاً (الساعة 9:00 ص)">غداً صباحاً (الساعة 9:00 ص)</option>
              <option value="خلال 48 ساعة (جدولة مجدولة)">خلال 48 ساعة (جدولة مجدولة)</option>
              <option value="عاجل اليوم قبل نهاية الدوام">عاجل اليوم قبل نهاية الدوام</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center gap-3 pt-3">
            <button
              type="submit"
              class="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>🚚</span>
              <span>تأكيد وإرسال طلب الجمع التجاري</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  private renderCompanyRequests(requests: CollectionRequest[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-bold text-slate-800 font-cairo text-lg">
              سجل الشحنات والطلبات التجارية (${requests.length})
            </h3>
            <p class="text-xs text-slate-500">سجل كامل للأوزان المقبولة ومندوبي التوصيل المعينين</p>
          </div>
          <button id="btn-create-bulk-again" class="text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-xl shadow hover:bg-blue-500">
            + طلب تجاري جديد
          </button>
        </div>

        <div class="space-y-3">
          ${
            requests.length === 0
              ? `<div class="text-center py-10 text-slate-400 text-xs">لا توجد طلبات تجارية مسجلة</div>`
              : requests
                  .map(
                    (r) => `
              <div class="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-blue-700 text-sm">${r.requestNumber}</span>
                    <span class="text-xs text-slate-400">• ${new Date(r.createdAt).toLocaleDateString('ar-SA')}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      ${r.status}
                    </span>
                  </div>
                  <div class="text-xs text-slate-700 font-bold mt-1">
                    الكمية: ${r.totalEstimatedWeight} كجم (تقديري) ${r.totalActualWeight ? `• ${r.totalActualWeight} كجم (فعلي معتمد)` : ''}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    📍 ${r.address}
                  </div>
                </div>

                <div class="text-left">
                  ${
                    r.workerName
                      ? `<div class="text-xs font-bold text-slate-800">🚛 المندوب: ${r.workerName}</div>`
                      : `<span class="text-xs text-amber-600 font-bold">بانتظار قبول المندوب</span>`
                  }
                  ${
                    r.totalPointsAwarded
                      ? `<div class="text-xs font-black text-emerald-600 mt-1">+${r.totalPointsAwarded} نقطة</div>`
                      : ''
                  }
                </div>
              </div>
            `
                  )
                  .join('')
          }
        </div>
      </div>
    `;
  }

  private renderEsgReport(user: any, totalKg: number, esgScore: number): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">🌿</span>
              <h3 class="text-xl font-black text-slate-800 font-cairo">
                شهادة الاستدامة المؤسسية وتقرير الحوكمة البيئية (ESG)
              </h3>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              وثيقة بيئية رسمية صادرة لمنشأة <strong>${user.companyName}</strong> تثبت تدوير البلاستيك وفق المعايير الوطنية.
            </p>
          </div>
          <button onclick="window.print()" class="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 shadow">
            🖨️ طباعة الشهادة
          </button>
        </div>

        <div class="p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border-2 border-emerald-300 space-y-6">
          <div class="text-center space-y-1">
            <div class="text-xs font-black text-emerald-800 tracking-widest uppercase">
              REPUBLIC ENVIRONMENTAL EXCELLENCE VERIFICATION
            </div>
            <h2 class="text-2xl font-black text-slate-900 font-cairo">
              شهادة الإسهام في الاقتصاد الدائري
            </h2>
            <p class="text-xs text-slate-600">
              تُمنح هذه الشهادة تقديراً لالتزام المنشأة بتسليم وفرز أوزان البلاستيك بالموازين المعتمدة:
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div class="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div class="text-xs text-slate-500">إجمالي البلاستيك المفرغ</div>
              <div class="text-2xl font-black text-emerald-600 font-cairo mt-1">${totalKg.toLocaleString()} كجم</div>
            </div>
            <div class="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div class="text-xs text-slate-500">انبعاثات كربون متفادية</div>
              <div class="text-2xl font-black text-blue-600 font-cairo mt-1">${(totalKg * 1.5).toLocaleString()} كجم CO2</div>
            </div>
            <div class="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div class="text-xs text-slate-500">براميل نفط تم توفيرها</div>
              <div class="text-2xl font-black text-amber-600 font-cairo mt-1">${Math.round(totalKg / 80)} برميل</div>
            </div>
            <div class="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div class="text-xs text-slate-500">تقييم الامتثال ESG</div>
              <div class="text-2xl font-black text-purple-600 font-cairo mt-1">${esgScore}%</div>
            </div>
          </div>

          <div class="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed text-center">
            تم تسجيل جميع الأوزان بواسطة مناديب الجمع المرخصين باستخدام موازين رقمية معتمدة مع استبعاد مواد التغليف.
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('tab-co-overview')?.addEventListener('click', () => {
      this.activeTab = 'overview';
      this.refresh();
    });

    document.getElementById('tab-co-requests')?.addEventListener('click', () => {
      this.activeTab = 'requests';
      this.refresh();
    });

    document.getElementById('tab-co-bulk')?.addEventListener('click', () => {
      this.activeTab = 'bulk_request';
      this.refresh();
    });

    document.getElementById('tab-co-esg')?.addEventListener('click', () => {
      this.activeTab = 'esg';
      this.refresh();
    });

    document.getElementById('tab-co-rewards')?.addEventListener('click', () => {
      this.activeTab = 'rewards';
      this.refresh();
    });

    // Delegate MyRewardsDashboard events if active
    if (this.activeTab === 'rewards') {
      const user = store.getCurrentUser();
      this.myRewardsDashboard.attachEvents(user, () => this.refresh());
    }

    document.getElementById('btn-quick-bulk-request')?.addEventListener('click', () => {
      this.activeTab = 'bulk_request';
      this.refresh();
    });

    document.getElementById('btn-create-bulk-again')?.addEventListener('click', () => {
      this.activeTab = 'bulk_request';
      this.refresh();
    });

    document.getElementById('btn-cancel-bulk-form')?.addEventListener('click', () => {
      this.activeTab = 'overview';
      this.refresh();
    });

    // Add bulk item
    document.getElementById('btn-add-bulk-item')?.addEventListener('click', () => {
      const cats = store.getCategories();
      const nextCat = cats[(this.selectedCategories.length + 1) % cats.length];
      this.selectedCategories.push({
        plasticCategoryId: nextCat.id,
        estimatedWeight: 100,
      });
      this.refresh();
    });

    // Handle Category change
    document.querySelectorAll('.bulk-cat-select').forEach((el) => {
      el.addEventListener('change', (e: any) => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        this.selectedCategories[idx].plasticCategoryId = e.target.value;
      });
    });

    // Handle Weight change
    document.querySelectorAll('.bulk-weight-input').forEach((el) => {
      el.addEventListener('input', (e: any) => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        this.selectedCategories[idx].estimatedWeight = parseFloat(e.target.value) || 50;
      });
    });

    // Remove bulk item
    document.querySelectorAll('.btn-remove-bulk-item').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        if (this.selectedCategories.length > 1) {
          this.selectedCategories.splice(idx, 1);
          this.refresh();
        }
      });
    });

    // Form submit
    const formBulk = document.getElementById('form-create-bulk-req') as HTMLFormElement;
    if (formBulk) {
      formBulk.onsubmit = (e) => {
        e.preventDefault();
        const address = (document.getElementById('input-bulk-address') as HTMLInputElement)?.value;
        const instructions = (document.getElementById('input-bulk-instructions') as HTMLTextAreaElement)?.value;
        const time = (document.getElementById('input-bulk-time') as HTMLSelectElement)?.value;

        store.createCollectionRequest({
          items: this.selectedCategories,
          address,
          instructions,
          preferredTime: time,
          latitude: 24.6012,
          longitude: 46.7845,
        });

        alert('🎉 تم إنشاء طلب الجمع التجاري بنجاح وتم إدراجه على خريطة مناديب الشاحنات المعتمدين!');
        this.activeTab = 'requests';
        this.refresh();
      };
    }

    if (this.activeTab === 'overview') {
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }

  private initMap() {
    this.mapInstance = new EcoMap();
    const success = this.mapInstance.init('company-interactive-map', 24.6012, 46.7845, 11);
    if (success) {
      const allRequests = store.getRequests();
      this.mapInstance.renderRequests(allRequests);
      this.mapInstance.setUserLocation(24.6012, 46.7845, 'مستودع شركة الواحة الخضراء');
    }
  }

  private refresh() {
    const currentApp = (window as any).__ecoApp;
    currentApp?.render();
  }
}

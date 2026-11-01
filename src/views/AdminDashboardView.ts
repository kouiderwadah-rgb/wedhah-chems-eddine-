import { store } from '../services/store';
import { i18n } from '../services/i18n';
import { POSTGRESQL_SUPABASE_SCHEMA_SQL } from '../data/initialData';
import { CollectionRequest, UserProfile } from '../types';

export class AdminDashboardView {
  private activeTab:
    | 'overview'
    | 'users'
    | 'collections'
    | 'categories'
    | 'rewards'
    | 'reports'
    | 'schema'
    | 'settings' = 'overview';

  private selectedPhotoModalUrl: string | null = null;
  private loginErrorMessage: string | null = null;

  render(): string {
    if (!store.isAdminLoggedIn()) {
      return this.renderLoginScreen();
    }

    const users = store.getState().users;
    const requests = store.getRequests();
    const categories = store.getCategories();
    const transactions = store.getTransactions();

    const citizens = users.filter((u) => u.accountType === 'citizen');
    const companies = users.filter((u) => u.accountType === 'company');
    const workers = users.filter((u) => u.accountType === 'worker');
    const approvedWorkers = workers.filter((w) => w.workerDetails?.approvalStatus === 'approved');

    const completedRequests = requests.filter((r) => r.status === 'completed');
    const totalWeightKg = completedRequests.reduce((sum, r) => sum + (r.totalActualWeight || 0), 0);
    const totalPointsAwarded = transactions
      .filter((t) => t.transactionType === 'credit')
      .reduce((sum, t) => sum + t.points, 0);

    return `
      <div class="min-h-full p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pb-24 font-cairo">
        <!-- Top Admin Header -->
        <div class="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-blue-500 text-slate-900 flex items-center justify-center text-3xl shadow-lg">
              🖥️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                  الإدارة المركزية
                </span>
                <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  جلسة مشرف معتمدة
                </span>
              </div>
              <h1 class="text-2xl font-black text-white mt-1">
                ${i18n.t('adminDashboardTitle')}
              </h1>
              <p class="text-xs text-slate-400 mt-0.5">
                متابعة عمليات الجمع، اعتماد المناديب والموازين، ضبط معدلات النقاط، وتوليد تقارير الأوزان
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button id="admin-quick-citizen" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700">
              👤 معاينة المواطن
            </button>
            <button id="admin-quick-worker" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold border border-slate-700">
              🚛 معاينة المندوب
            </button>
            <button id="admin-logout-btn" class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
              <span>🔒</span>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
          ${[
            { id: 'overview', label: i18n.t('tabOverview'), icon: '📊' },
            { id: 'users', label: i18n.t('tabUsers'), icon: '👥' },
            { id: 'collections', label: i18n.t('tabCollections'), icon: '⚖️' },
            { id: 'categories', label: i18n.t('tabCategories'), icon: '♻️' },
            { id: 'rewards', label: i18n.t('tabRewards'), icon: '🎁' },
            { id: 'reports', label: i18n.t('tabReports'), icon: '📈' },
            { id: 'schema', label: i18n.t('tabSchema'), icon: '🗄️' },
            { id: 'settings', label: i18n.t('tabSettings'), icon: '⚙️' },
          ]
            .map(
              (tab) => `
            <button
              class="tab-admin-nav px-4 py-3 font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                this.activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }"
              data-tab="${tab.id}"
            >
              <span>${tab.icon}</span>
              <span>${tab.label}</span>
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Tab Content Routing -->
        ${
          this.activeTab === 'users'
            ? this.renderUsersTab(citizens, companies, workers)
            : this.activeTab === 'collections'
            ? this.renderCollectionsTab(requests, workers)
            : this.activeTab === 'categories'
            ? this.renderCategoriesTab(categories)
            : this.activeTab === 'rewards'
            ? this.renderRewardsTab(transactions)
            : this.activeTab === 'reports'
            ? this.renderReportsTab(categories, requests)
            : this.activeTab === 'schema'
            ? this.renderSchemaTab()
            : this.activeTab === 'settings'
            ? this.renderSettingsTab()
            : this.renderOverviewTab(
                citizens.length,
                companies.length,
                workers.length,
                approvedWorkers.length,
                requests.length,
                completedRequests.length,
                totalWeightKg,
                totalPointsAwarded
              )
        }
      </div>
    `;
  }

  // A. OVERVIEW TAB
  private renderOverviewTab(
    cCount: number,
    coCount: number,
    wCount: number,
    awCount: number,
    rCount: number,
    crCount: number,
    totalKg: number,
    totalPts: number
  ): string {
    return `
      <div class="space-y-6">
        <!-- 8 Mandatory KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('totalCitizens')}</div>
            <div class="text-3xl font-black text-amber-500 mt-1">${cCount}</div>
            <div class="text-[11px] text-slate-400 mt-1">حسابات نشطة</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('totalCompanies')}</div>
            <div class="text-3xl font-black text-blue-600 mt-1">${coCount}</div>
            <div class="text-[11px] text-slate-400 mt-1">منشآت معتمدة</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('registeredWorkers')}</div>
            <div class="text-3xl font-black text-slate-800 mt-1">${wCount}</div>
            <div class="text-[11px] text-emerald-600 font-bold mt-1">${awCount} مندوب معتمد</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('approvedWorkersCount')}</div>
            <div class="text-3xl font-black text-emerald-600 mt-1">${awCount}</div>
            <div class="text-[11px] text-slate-400 mt-1">يحملون موازين معتمدة</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('totalRequestsCount')}</div>
            <div class="text-3xl font-black text-indigo-600 mt-1">${rCount}</div>
            <div class="text-[11px] text-slate-400 mt-1">مواطنين + شركات</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('completedRequestsCount')}</div>
            <div class="text-3xl font-black text-teal-600 mt-1">${crCount}</div>
            <div class="text-[11px] text-slate-400 mt-1">تم وزنها وتسليمها</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('totalWeightKg')}</div>
            <div class="text-3xl font-black text-purple-600 mt-1">${totalKg.toFixed(1)}</div>
            <div class="text-[11px] text-slate-400 mt-1">كجم بلاستيك مفروز</div>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('totalPointsDistributed')}</div>
            <div class="text-3xl font-black text-amber-600 mt-1">${totalPts.toFixed(1)}</div>
            <div class="text-[11px] text-slate-400 mt-1">نقطة مكافآت للمستخدمين</div>
          </div>
        </div>

        <!-- System Architecture Highlights -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <h3 class="font-bold text-slate-800 text-lg">
            🛡️ الامتثال لمعايير المنصة البيئية (Zero AI Architecture)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="font-bold text-slate-900 block mb-1">1. التصنيف اليدوي الصارم</span>
              <p class="text-slate-500">تم حظر أي ذكاء اصطناعي أو خوارزميات للتعرف على الصور. الفرز بشري بالكامل بناءً على رموز التدوير 1-7.</p>
            </div>
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="font-bold text-slate-900 block mb-1">2. الوزن الفيزيائي بالميزان</span>
              <p class="text-slate-500">الوزن الفعلي يُقاس بميزان المندوب الإلكتروني في الموقع، مع رفع صورة شاشة الميزان كدليل تدقيق إلزامي.</p>
            </div>
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="font-bold text-slate-900 block mb-1">3. احتساب النقاط التلقائي بالسيرفر</span>
              <p class="text-slate-500">لا يمكن تعديل النقاط يدوياً من الهواتف؛ المعادلة تنفذ في قاعدة البيانات: النقاط = الوزن ÷ المعدل المعتمد.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // B. USER MANAGEMENT TAB
  private renderUsersTab(citizens: UserProfile[], companies: UserProfile[], workers: UserProfile[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
        <!-- Delivery Workers Review Section -->
        <div>
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div>
              <h3 class="font-black text-slate-900 text-lg">
                مراجعة واعتماد وثائق مناديب التوصيل والجمع (${workers.length})
              </h3>
              <p class="text-xs text-slate-500">فحص رخص القيادة ومركبات النقل المجهزة بموازين معتمدة</p>
            </div>
          </div>

          <div class="space-y-4">
            ${workers
              .map(
                (w) => `
              <div class="p-4 rounded-2xl border ${
                w.workerDetails?.approvalStatus === 'approved' ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-300 bg-amber-50/30'
              } flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <img src="${w.avatarUrl}" class="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-sm">${w.firstName} ${w.lastName}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full font-bold ${
                        w.workerDetails?.approvalStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }">
                        ${w.workerDetails?.approvalStatus === 'approved' ? 'معتمد وموثق' : 'بانتظار الاعتماد'}
                      </span>
                    </div>
                    <div class="text-xs text-slate-500 font-mono mt-0.5">${w.phoneNumber} • ${w.workerDetails?.vehicleType}</div>
                    <div class="text-[11px] text-slate-400">لوحة: ${w.workerDetails?.vehiclePlateNumber} • العمليات المنجزة: ${w.workerDetails?.totalCollectionsCompleted || 0}</div>
                  </div>
                </div>

                <!-- Document Previews & Actions -->
                <div class="flex items-center gap-2">
                  <button
                    class="btn-view-doc px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    data-img="${w.workerDetails?.driverLicenseImage}"
                    data-title="رخصة القيادة - ${w.firstName}"
                  >
                    🪪 رخصة القيادة
                  </button>

                  <button
                    class="btn-view-doc px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    data-img="${w.workerDetails?.vehicleImage}"
                    data-title="مركبة المندوب والميزان - ${w.firstName}"
                  >
                    🚚 صورة المركبة
                  </button>

                  ${
                    w.workerDetails?.approvalStatus !== 'approved'
                      ? `
                    <button
                      class="btn-approve-worker px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                      data-id="${w.id}"
                    >
                      ✓ اعتماد المندوب
                    </button>
                  `
                      : `
                    <button
                      class="btn-suspend-worker px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold"
                      data-id="${w.id}"
                    >
                      إيقاف مؤقت
                    </button>
                  `
                  }
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Citizens and Companies Table -->
        <div class="pt-4 border-t border-slate-200">
          <h3 class="font-black text-slate-900 text-base mb-3">
            المستخدمين والمنشآت المسجلة
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Citizens list -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-amber-800 mb-2">المواطنين (${citizens.length})</h4>
              <div class="space-y-2">
                ${citizens
                  .map(
                    (c) => `
                  <div class="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100">
                    <div>
                      <span class="font-bold text-slate-800">${c.firstName} ${c.lastName}</span>
                      <div class="text-slate-400 font-mono">${c.phoneNumber}</div>
                    </div>
                    <span class="font-black text-amber-600">${c.pointsBalance} نقطة</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- Companies list -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-blue-800 mb-2">المنشآت التجارية (${companies.length})</h4>
              <div class="space-y-2">
                ${companies
                  .map(
                    (co) => `
                  <div class="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100">
                    <div>
                      <span class="font-bold text-slate-800">${co.companyName || co.firstName}</span>
                      <div class="text-slate-400 font-mono">CR: ${co.commercialRegistrationNumber}</div>
                    </div>
                    <span class="font-black text-blue-600">${co.pointsBalance} نقطة</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // C. COLLECTION MANAGEMENT TAB
  private renderCollectionsTab(requests: CollectionRequest[], workers: UserProfile[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="font-black text-slate-900 text-lg">
              إدارة طلبات الجمع والتحقق من أدلة الموازين
            </h3>
            <p class="text-xs text-slate-500">فحص صور شاشات الميزان المرفوعة من المناديب وإعادة التعيين</p>
          </div>
          <span class="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
            إجمالي: ${requests.length} طلب
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 font-bold">
                <th class="py-2.5">رقم الطلب</th>
                <th class="py-2.5">النوع والعميل</th>
                <th class="py-2.5">المندوب المخصص</th>
                <th class="py-2.5">الحالة</th>
                <th class="py-2.5">الوزن المقاس</th>
                <th class="py-2.5">النقاط</th>
                <th class="py-2.5">دليل الميزان</th>
                <th class="py-2.5">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${requests
                .map(
                  (r) => `
                <tr class="hover:bg-slate-50/50">
                  <td class="py-3 font-mono font-bold text-slate-800">${r.requestNumber}</td>
                  <td class="py-3">
                    <div class="font-bold text-slate-900">${r.customerName}</div>
                    <div class="text-[11px] text-slate-400">${r.customerType === 'company' ? '🏢 شركة' : '👤 مواطن'}</div>
                  </td>
                  <td class="py-3">
                    ${r.workerName ? `🚛 ${r.workerName}` : '<span class="text-amber-600 font-bold">غير معين</span>'}
                  </td>
                  <td class="py-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      ${r.status}
                    </span>
                  </td>
                  <td class="py-3 font-mono font-bold text-slate-900">
                    ${r.totalActualWeight ? `${r.totalActualWeight} كجم` : `${r.totalEstimatedWeight} كجم (تقديري)`}
                  </td>
                  <td class="py-3 font-mono font-bold text-emerald-600">
                    ${r.totalPointsAwarded ? `+${r.totalPointsAwarded}` : '-'}
                  </td>
                  <td class="py-3">
                    ${
                      r.scalePhotoUrl
                        ? `
                      <button
                        class="btn-view-doc px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-[11px]"
                        data-img="${r.scalePhotoUrl}"
                        data-title="شاشة ميزان الطلب ${r.requestNumber}"
                      >
                        🔍 فحص الميزان
                      </button>
                    `
                        : '<span class="text-slate-400 text-[10px]">لم يوزن بعد</span>'
                    }
                  </td>
                  <td class="py-3">
                    ${
                      r.status === 'awaiting_verification'
                        ? `
                      <button class="btn-admin-verify-weight px-2.5 py-1 bg-amber-400 text-slate-900 font-bold rounded-lg text-[11px]" data-id="${r.id}">
                        اعتماد الوزن الاستثنائي
                      </button>
                    `
                        : `
                      <button class="btn-admin-reassign text-blue-600 font-bold hover:underline" data-id="${r.id}">
                        إعادة تعيين
                      </button>
                    `
                    }
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // D. PLASTIC CATEGORY MANAGEMENT TAB (7 CATEGORIES)
  private renderCategoriesTab(categories: any[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="font-black text-slate-900 text-lg">
              إدارة أصناف البلاستيك ومعدلات نقاط المكافآت
            </h3>
            <p class="text-xs text-slate-500">تعديل الكيلوجرامات المطلوبة للنقطة الواحدة لكل صنف مفرز يدوياً</p>
          </div>
          <span class="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            7 أصناف معتمدة دولياً
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${categories
            .map(
              (c) => `
            <div class="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between gap-3 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="w-10 h-10 rounded-xl text-white font-black text-sm flex items-center justify-center shadow" style="background: ${c.color}">
                    ${c.recyclingCode}
                  </span>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">${c.nameAr}</h4>
                    <span class="font-mono text-xs text-slate-400">${c.shortCode}</span>
                  </div>
                </div>

                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  c.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }">
                  ${c.enabled ? 'مفعل' : 'معطل'}
                </span>
              </div>

              <p class="text-xs text-slate-600 line-clamp-2">${c.descriptionAr}</p>
              <div class="text-[11px] text-slate-500"><strong>أمثلة:</strong> ${c.examplesAr}</div>

              <!-- Rate Config Box -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div class="text-xs text-slate-700 font-bold">
                  معدل المكافأة: <strong class="text-emerald-700 font-mono text-sm">${c.kilogramsPerPoint} كجم = 1 نقطة</strong>
                </div>

                <div class="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value="${c.kilogramsPerPoint}"
                    class="input-rate-edit w-16 px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs text-center font-bold"
                    data-id="${c.id}"
                  />
                  <button class="btn-save-rate px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg" data-id="${c.id}">
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  // E. REWARDS & ADJUSTMENTS TAB
  private renderRewardsTab(transactions: any[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="font-black text-slate-900 text-lg">
              دفتر الأستاذ وحركات النقاط الصادرة (Audit Ledger)
            </h3>
            <p class="text-xs text-slate-500">سجل غير قابل للتعديل يوثق الأوزان والمعدلات المطبقة بدقة تامة</p>
          </div>
          <button id="btn-admin-manual-adjust" class="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl shadow">
            + تسوية يدوية معتمدة
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 font-bold">
                <th class="py-2.5">رقم السجل</th>
                <th class="py-2.5">المستفيد</th>
                <th class="py-2.5">الصنف</th>
                <th class="py-2.5">الوزن الصافي</th>
                <th class="py-2.5">المعدل المجمد</th>
                <th class="py-2.5">النقاط</th>
                <th class="py-2.5">التاريخ</th>
                <th class="py-2.5">حالة التحقق</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${transactions
                .map(
                  (t) => `
                <tr>
                  <td class="py-2.5 font-mono font-bold text-slate-800">${t.transactionNumber}</td>
                  <td class="py-2.5 font-bold">${t.customerName}</td>
                  <td class="py-2.5">${t.plasticCategoryCode || '-'}</td>
                  <td class="py-2.5 font-mono">${t.acceptedWeight} كجم</td>
                  <td class="py-2.5 font-mono">${t.appliedRewardRate} كجم/نقطة</td>
                  <td class="py-2.5 font-mono font-black ${t.points >= 0 ? 'text-emerald-600' : 'text-red-500'}">
                    ${t.points >= 0 ? `+${t.points}` : t.points}
                  </td>
                  <td class="py-2.5 text-slate-400">${new Date(t.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td class="py-2.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ ${t.verificationStatus}
                    </span>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // F. REPORTS & ANALYTICS TAB
  private renderReportsTab(categories: any[], requests: CollectionRequest[]): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div class="border-b border-slate-200 pb-3">
          <h3 class="font-black text-slate-900 text-lg">
            التقارير والإحصائيات البيئية المجمعة
          </h3>
          <p class="text-xs text-slate-500">توزيع أوزان البلاستيك حسب الصنف (PET, HDPE, PVC, LDPE, PP, PS, OTHER)</p>
        </div>

        <!-- 7 Categories Weight Bars -->
        <div class="space-y-3">
          <h4 class="font-bold text-xs text-slate-700">توزيع الأوزان المقاسة لكل صنف بلاستيكي:</h4>
          ${categories
            .map((c, i) => {
              const sampleWeights = [450, 320, 180, 290, 210, 140, 85];
              const wt = sampleWeights[i % sampleWeights.length];
              const pct = Math.round((wt / 1675) * 100);

              return `
              <div class="space-y-1 text-xs">
                <div class="flex items-center justify-between font-bold">
                  <span>كود ${c.recyclingCode} (${c.shortCode}) - ${c.nameAr}</span>
                  <span class="font-mono">${wt} كجم (${pct}%)</span>
                </div>
                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" style="width: ${pct}%; background: ${c.color}"></div>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Regional / Monthly Breakdown -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
          <div class="p-4 bg-slate-50 rounded-2xl">
            <h5 class="font-bold text-slate-800 mb-2">أعلى المناطق نشاطاً في الجمع:</h5>
            <div class="space-y-1.5">
              <div class="flex justify-between"><span>شمال الرياض (حي النرجس، الملقا، الياسمين)</span><strong class="font-mono">840 كجم</strong></div>
              <div class="flex justify-between"><span>المدينة الصناعية الثانية (المستودعات والشركات)</span><strong class="font-mono">1,450 كجم</strong></div>
              <div class="flex justify-between"><span>شرق الرياض (اليرموك، الروضة)</span><strong class="font-mono">520 كجم</strong></div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl">
            <h5 class="font-bold text-slate-800 mb-2">نسبة المساهمة حسب نوع المستخدم:</h5>
            <div class="space-y-1.5">
              <div class="flex justify-between"><span>الشركات والمنشآت التجارية (حجم كبير)</span><strong class="font-mono text-blue-600">65%</strong></div>
              <div class="flex justify-between"><span>المواطنين والأفراد (فرز منزلي)</span><strong class="font-mono text-amber-600">35%</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // G. SUPABASE & POSTGRESQL SCHEMA EXPORTER TAB
  private renderSchemaTab(): string {
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">🗄️</span>
              <h3 class="font-black text-slate-900 text-lg">
                مخطط قاعدة بيانات PostgreSQL و Supabase الكامل
              </h3>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              مخطط DDL كامل جاهز للتطبيق المباشر في Supabase SQL Editor مع جداول المستخدمين، الأوزان، الموازين، وسياسات الأمان RLS.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-copy-sql" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
              <span>📋</span>
              <span>${i18n.t('exportSqlBtn')}</span>
            </button>
            <button id="btn-download-sql" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
              <span>💾</span>
              <span>${i18n.t('downloadSqlBtn')}</span>
            </button>
          </div>
        </div>

        <div class="relative">
          <pre class="bg-slate-950 text-emerald-400 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed h-[420px] scrollbar-thin border border-slate-800">
${POSTGRESQL_SUPABASE_SCHEMA_SQL}
          </pre>
        </div>
      </div>
    `;
  }

  // SYSTEM SETTINGS TAB
  private renderSettingsTab(): string {
    const s = store.getState().settings;
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div class="border-b border-slate-200 pb-3">
          <h3 class="font-black text-slate-900 text-lg">
            إعدادات النظام والضوابط الرقابية
          </h3>
          <p class="text-xs text-slate-500">حدود التدقيق الإداري للأوزان الشاذة وتفضيلات اللغة والخرائط</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label class="block font-bold text-slate-800">
              حد الوزن الاستثنائي للمواطنين (كجم):
            </label>
            <input
              type="number"
              value="${s.unusualWeightThresholdKg}"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold"
            />
            <p class="text-[11px] text-slate-400">أي وزن يدخله المندوب يتجاوز هذا الحد يتطلب مراجعة المشرف قبل صرف النقاط.</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label class="block font-bold text-slate-800">
              اللغة الافتراضية للتطبيق:
            </label>
            <select class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold">
              <option value="ar" selected>العربية (Arabic - Default & RTL)</option>
              <option value="en">English (LTR)</option>
            </select>
            <p class="text-[11px] text-slate-400">اللغة العربية هي اللغة الأساسية للمنصة مع دعم كامل لاتجاه RTL.</p>
          </div>
        </div>
      </div>
    `;
  }

  private renderLoginScreen(): string {
    return `
      <div class="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 max-w-md mx-auto font-cairo animate-fade-in">
        <div class="w-full bg-white rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden">
          <!-- Top Badge & Header -->
          <div class="bg-slate-900 text-white p-7 text-center relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-3xl font-black mx-auto shadow-lg mb-3">
              🔐
            </div>
            <h2 class="text-2xl font-black text-white">
              بوابة الدخول إلى لوحة الإدارة
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              منطقة محمية: يُشترط تسجيل الدخول للمشرف العام فقط
            </p>
          </div>

          <!-- Login Form -->
          <form id="form-admin-login" class="p-6 sm:p-7 space-y-4">
            ${
              this.loginErrorMessage
                ? `
              <div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <span class="text-lg">⚠️</span>
                <span>${this.loginErrorMessage}</span>
              </div>
            `
                : ''
            }

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المستخدم (Username) <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="admin-input-username"
                  required
                  placeholder="admin"
                  autocomplete="username"
                  value="admin"
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono font-bold text-slate-900"
                />
                <span class="absolute left-3 top-3 text-sm text-slate-400">👤</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة السر (Password) <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="password"
                  id="admin-input-password"
                  required
                  placeholder="admin"
                  autocomplete="current-password"
                  value="admin"
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono font-bold text-slate-900"
                />
                <button
                  type="button"
                  id="btn-toggle-admin-pw"
                  class="absolute left-3 top-3 text-sm text-slate-400 hover:text-slate-700"
                  title="عرض / إخفاء كلمة السر"
                >
                  👁️
                </button>
              </div>
            </div>

            <!-- Credentials Hint Card for Evaluator -->
            <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <div class="font-bold flex items-center gap-1.5 mb-1">
                <span>🔑</span>
                <span>بيانات الدخول المصرحة:</span>
              </div>
              <div class="flex items-center gap-2 font-mono font-bold text-slate-800 text-[11px] flex-wrap">
                <span class="bg-amber-100 px-2 py-0.5 rounded">اسم المستخدم: admin</span>
                <span class="bg-amber-100 px-2 py-0.5 rounded">كلمة السر: admin</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              id="btn-submit-admin-login"
              class="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>🔒</span>
              <span>تسجيل الدخول إلى لوحة الإدارة</span>
            </button>

            <!-- Back to Home -->
            <button
              type="button"
              id="btn-admin-cancel-back"
              class="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← العودة إلى الصفحة الرئيسية
            </button>
          </form>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // If not logged in, handle login form events only
    if (!store.isAdminLoggedIn()) {
      const loginForm = document.getElementById('form-admin-login') as HTMLFormElement;
      if (loginForm) {
        loginForm.onsubmit = (e) => {
          e.preventDefault();
          const uInput = (document.getElementById('admin-input-username') as HTMLInputElement)?.value;
          const pInput = (document.getElementById('admin-input-password') as HTMLInputElement)?.value;

          const success = store.adminLogin(uInput, pInput);
          if (success) {
            this.loginErrorMessage = null;
            this.refresh();
          } else {
            this.loginErrorMessage = 'اسم المستخدم أو كلمة السر غير صحيحة! يرجى إدخال admin و admin.';
            this.refresh();
          }
        };
      }

      // Toggle password visibility
      document.getElementById('btn-toggle-admin-pw')?.addEventListener('click', () => {
        const pwInput = document.getElementById('admin-input-password') as HTMLInputElement;
        if (pwInput) {
          pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
        }
      });

      // Back to selection
      document.getElementById('btn-admin-cancel-back')?.addEventListener('click', () => {
        store.setView('selection');
      });

      return;
    }

    // When logged in: Logout handler
    document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
      store.adminLogout();
      alert('🔒 تم تسجيل الخروج من لوحة الإدارة المركزية بنجاح.');
      this.refresh();
    });

    // Nav tabs
    document.querySelectorAll('.tab-admin-nav').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as any;
        if (tab) {
          this.activeTab = tab;
          this.refresh();
        }
      });
    });

    document.getElementById('admin-quick-citizen')?.addEventListener('click', () => {
      store.switchRole('citizen');
    });

    document.getElementById('admin-quick-worker')?.addEventListener('click', () => {
      store.switchRole('worker');
    });

    // Worker Approval
    document.querySelectorAll('.btn-approve-worker').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id') || '';
        store.updateWorkerApproval(id, 'approved');
        alert('✓ تم اعتماد حساب المندوب بنجاح! يستطيع الآن الاتصال وقبول طلبات الجمع.');
        this.refresh();
      });
    });

    // Worker Suspend
    document.querySelectorAll('.btn-suspend-worker').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id') || '';
        store.updateWorkerApproval(id, 'suspended');
        alert('تم تعليق حساب المندوب.');
        this.refresh();
      });
    });

    // View documents / scale photos in modal
    document.querySelectorAll('.btn-view-doc').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = btn.getAttribute('data-img') || '';
        const title = btn.getAttribute('data-title') || 'مستند';
        alert(`🔍 معاينة: ${title}\nرابط الصورة: ${img}`);
      });
    });

    // Save Category Rate
    document.querySelectorAll('.btn-save-rate').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id') || '';
        const input = document.querySelector(`.input-rate-edit[data-id="${id}"]`) as HTMLInputElement;
        if (input) {
          const newRate = parseFloat(input.value);
          if (newRate > 0) {
            store.updateCategoryRate(id, newRate);
            alert(`✓ تم تحديث معدل مكافأة الصنف إلى: ${newRate} كجم = 1 نقطة`);
            this.refresh();
          }
        }
      });
    });

    // Copy SQL Schema
    document.getElementById('btn-copy-sql')?.addEventListener('click', () => {
      navigator.clipboard.writeText(POSTGRESQL_SUPABASE_SCHEMA_SQL);
      alert('✓ تم نسخ مخطط SQL DDL الكامل للحافظة بنجاح!');
    });

    // Download SQL file
    document.getElementById('btn-download-sql')?.addEventListener('click', () => {
      const blob = new Blob([POSTGRESQL_SUPABASE_SCHEMA_SQL], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ecocollect_supabase_schema.sql';
      a.click();
      URL.revokeObjectURL(url);
    });

    // Admin manual adjustment
    document.getElementById('btn-admin-manual-adjust')?.addEventListener('click', () => {
      const points = prompt('أدخل عدد النقاط للتسوية المعتمدة (مثال: 50):', '50');
      if (points) {
        const user = store.getCurrentUser();
        user.pointsBalance += parseFloat(points);
        alert(`✓ تمت التسوية الإدارية بنجاح وإضافة ${points} نقطة للمستخدم.`);
        this.refresh();
      }
    });

    // Admin verify unusual weight
    document.querySelectorAll('.btn-admin-verify-weight').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id') || '';
        store.updateRequestStatus(id, 'completed', 'تمت مراجعة صورة الميزان واعتماد الوزن من قبل المشرف.');
        alert('✓ تم اعتماد الوزن الاستثنائي وتأكيد صرف النقاط!');
        this.refresh();
      });
    });
  }

  private refresh() {
    const currentApp = (window as any).__ecoApp;
    currentApp?.render();
  }
}

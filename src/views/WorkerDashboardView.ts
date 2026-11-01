import { store } from '../services/store';
import { i18n } from '../services/i18n';
import { EcoMap } from '../services/mapService';
import { CollectionRequest } from '../types';
import confetti from 'canvas-confetti';

export class WorkerDashboardView {
  private mapInstance: EcoMap | null = null;
  private activeTab: 'map_and_feed' | 'my_active_task' | 'history' = 'map_and_feed';

  // Weighing workflow state
  private weighingRequestId: string | null = null;
  private weighingItemsInput: Array<{
    itemId: string;
    plasticCategoryId: string;
    actualNetWeight: number;
  }> = [];
  private scalePhotoUploaded = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';

  render(): string {
    const user = store.getCurrentUser();
    const isApproved = user.workerDetails?.approvalStatus === 'approved';
    const isOnline = user.workerDetails?.availabilityStatus === 'online';

    const allRequests = store.getRequests();
    const availableRequests = allRequests.filter((r) => r.status === 'pending');
    const myAcceptedRequests = allRequests.filter(
      (r) => r.workerId === user.id && r.status !== 'completed' && r.status !== 'cancelled'
    );
    const myCompletedCollections = allRequests.filter(
      (r) => r.workerId === user.id && r.status === 'completed'
    );

    const totalKgCollected = myCompletedCollections.reduce(
      (sum, r) => sum + (r.totalActualWeight || 0),
      0
    );

    // If there's an active request being weighed
    const activeWeighingReqId = store.getState().activeRequestIdForWeighing;
    if (activeWeighingReqId) {
      return this.renderPhysicalWeighingScreen(activeWeighingReqId);
    }

    return `
      <div class="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 animate-fade-in pb-24">
        <!-- A. Worker Profile Card -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                src="${user.avatarUrl}"
                alt="${user.firstName}"
                class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }"></span>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-black text-slate-800 font-cairo">
                  ${user.firstName} ${user.lastName}
                </h2>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isApproved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }">
                  ${isApproved ? i18n.t('approvedBadge') : i18n.t('pendingApprovalBadge')}
                </span>
              </div>
              <div class="text-xs text-slate-500 mt-1">
                🚛 ${user.workerDetails?.vehicleType || 'مركبة نقل مجهزة'} • لوحة: <strong class="font-mono text-slate-700">${user.workerDetails?.vehiclePlateNumber || 'أ ب ج 4 5 6 7'}</strong>
              </div>
              <div class="text-xs text-slate-400 mt-0.5 font-mono">
                📱 ${user.phoneNumber}
              </div>
            </div>
          </div>

          <!-- B. Availability Online/Offline Toggle -->
          <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div class="text-right">
              <div class="text-xs font-bold text-slate-800">
                ${isOnline ? i18n.t('workerStatusOnline') : i18n.t('workerStatusOffline')}
              </div>
              <div class="text-[11px] text-slate-400">
                ${isOnline ? 'أنت جاهز لاستقبال الطلبات' : 'انقر للاتصال واستقبال الطلبات'}
              </div>
            </div>

            <button
              id="btn-toggle-online"
              class="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-300'
              }"
              role="switch"
              aria-checked="${isOnline}"
            >
              <span
                class="pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isOnline ? 'translate-x-6' : 'translate-x-0'
                }"
              ></span>
            </button>
          </div>
        </div>

        ${
          !isApproved
            ? `
          <div class="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3 animate-pulse">
            <div class="flex items-center gap-2">
              <span class="text-2xl">⏳</span>
              <div>
                <strong class="text-sm">حساب المندوب قيد الاعتماد والمراجعة:</strong>
                <p class="mt-0.5">${i18n.t('workerPendingNotice')}</p>
              </div>
            </div>
            <button id="btn-demo-approve-worker" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow">
              اعتماد فوري للتجربة ✓
            </button>
          </div>
        `
            : ''
        }

        <!-- C. Statistics Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('availableRequestsCount')}</div>
            <div class="text-3xl font-black text-amber-500 font-cairo mt-1">${availableRequests.length}</div>
            <div class="text-[10px] text-slate-400 mt-1">في نطاق عملك</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('acceptedRequestsCount')}</div>
            <div class="text-3xl font-black text-blue-600 font-cairo mt-1">${myAcceptedRequests.length}</div>
            <div class="text-[10px] text-slate-400 mt-1">جارية الآن</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('completedCount')}</div>
            <div class="text-3xl font-black text-emerald-600 font-cairo mt-1">${myCompletedCollections.length}</div>
            <div class="text-[10px] text-slate-400 mt-1">عملية جمع ناجحة</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div class="text-xs text-slate-500 font-bold">${i18n.t('totalKgCollected')}</div>
            <div class="text-3xl font-black text-purple-600 font-cairo mt-1">${totalKgCollected.toFixed(1)}</div>
            <div class="text-[10px] text-slate-400 mt-1">كيلوجرام تم وزنها</div>
          </div>
        </div>

        <!-- Ongoing Active Tasks (If worker accepted any request) -->
        ${
          myAcceptedRequests.length > 0
            ? `
          <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl animate-spin">⚙️</span>
                <h3 class="text-lg font-black font-cairo">
                  مهمة جارية الآن: الطلب ${myAcceptedRequests[0].requestNumber}
                </h3>
              </div>
              <span class="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                ${myAcceptedRequests[0].status}
              </span>
            </div>

            <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="text-xs text-emerald-200">العميل والموقع:</div>
                <div class="text-base font-bold">${myAcceptedRequests[0].customerName} (${myAcceptedRequests[0].customerPhone})</div>
                <div class="text-xs text-white/80 mt-1">📍 ${myAcceptedRequests[0].address}</div>
                <div class="text-xs text-amber-300 font-bold mt-1">
                  الكمية المقدرة: ${myAcceptedRequests[0].totalEstimatedWeight} كجم
                </div>
              </div>

              <!-- Workflow Step Action Buttons -->
              <div class="flex flex-wrap items-center gap-2">
                ${
                  myAcceptedRequests[0].status === 'accepted'
                    ? `
                  <button class="btn-step-on-the-way py-2.5 px-4 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow transition-all" data-id="${myAcceptedRequests[0].id}">
                    🚀 التوجه للموقع (في الطريق)
                  </button>
                `
                    : ''
                }

                ${
                  myAcceptedRequests[0].status === 'on_the_way'
                    ? `
                  <button class="btn-step-arrived py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl shadow transition-all animate-bounce" data-id="${myAcceptedRequests[0].id}">
                    📍 وصلت للموقع (تأكيد الوصول)
                  </button>
                `
                    : ''
                }

                ${
                  myAcceptedRequests[0].status === 'arrived'
                    ? `
                  <button class="btn-start-weighing-action py-3 px-6 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-2xl transition-all scale-105" data-id="${myAcceptedRequests[0].id}">
                    ⚖️ بدء الفحص والوزن الفعلي بالميزان
                  </button>
                `
                    : ''
                }
              </div>
            </div>
          </div>
        `
            : ''
        }

        <!-- D. Interactive Map (Yellow = Citizen, Blue = Company) -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗺️</span>
              <h3 class="font-bold text-slate-800 font-cairo">
                ${i18n.t('interactiveMapTitle')}
              </h3>
            </div>
            <div class="flex items-center gap-3 text-xs font-bold">
              <span class="flex items-center gap-1.5 text-amber-700">
                <span class="w-3 h-3 rounded-full bg-[#F9D342] border border-amber-600"></span>
                ${i18n.t('citizenMarkerLegend')}
              </span>
              <span class="flex items-center gap-1.5 text-blue-700">
                <span class="w-3 h-3 rounded-full bg-[#3288D8] border border-blue-600"></span>
                ${i18n.t('companyMarkerLegend')}
              </span>
            </div>
          </div>

          <div id="worker-interactive-map" class="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
              جاري تجهيز خريطة المندوب...
            </div>
          </div>
        </div>

        <!-- E. Request List: Each request card display -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-bold text-slate-800 font-cairo text-lg">
                ${i18n.t('availableRequestsList')} (${availableRequests.length})
              </h3>
              <p class="text-xs text-slate-500">طلبات جمع جديدة بانتظار قبولك لنقلها ووزنها بالميزان</p>
            </div>
            <span class="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
              حساب نقاط تلقائي عند الوزن
            </span>
          </div>

          <div class="space-y-3">
            ${
              availableRequests.length === 0
                ? `<div class="text-center py-10 text-slate-400 text-xs">لا توجد طلبات معلقة حالياً في هذا النطاق</div>`
                : availableRequests.map((req) => this.renderRequestFeedItem(req)).join('')
            }
          </div>
        </div>
      </div>
    `;
  }

  private renderRequestFeedItem(req: CollectionRequest): string {
    const isCompany = req.customerType === 'company';
    const borderClass = isCompany ? 'border-blue-200 hover:border-blue-400' : 'border-amber-200 hover:border-amber-400';
    const badgeClass = isCompany ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800';

    return `
      <div class="p-4 rounded-2xl border-2 ${borderClass} bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1.5 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-mono font-black text-slate-900 text-sm">${req.requestNumber}</span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}">
              ${isCompany ? '🏢 شركة' : '👤 مواطن'}
            </span>
            <span class="text-xs text-slate-400">• ${new Date(req.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div class="font-bold text-slate-800 text-sm">
            ${req.customerName}
          </div>

          <div class="text-xs text-slate-500 flex items-center gap-1">
            <span>📍 ${req.address}</span>
            <span class="font-bold text-emerald-700 font-mono">(المسافة: ~2.4 كم)</span>
          </div>

          <div class="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
            <strong>الأصناف المقدرة:</strong>
            ${req.items
              .map((i) => {
                const c = store.getCategories().find((cat) => cat.id === i.plasticCategoryId);
                return `${c?.shortCode || 'بلاستيك'} (~${i.estimatedWeight} كجم)`;
              })
              .join(' • ')}
            — <strong>الإجمالي: ${req.totalEstimatedWeight} كجم</strong>
          </div>
        </div>

        <!-- Accept Button -->
        <div class="flex items-center gap-2 sm:self-center">
          <button
            class="btn-accept-request py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            data-id="${req.id}"
          >
            <span>✓</span>
            <span>${i18n.t('acceptRequestBtn')}</span>
          </button>
        </div>
      </div>
    `;
  }

  // CORE PHYSICAL WEIGHING WORKFLOW SCREEN (13-STEP LIFECYCLE)
  private renderPhysicalWeighingScreen(requestId: string): string {
    const req = store.getRequests().find((r) => r.id === requestId);
    if (!req) {
      return `<div class="p-8 text-center text-red-500">الطلب غير موجود</div>`;
    }

    const categories = store.getCategories();

    // Initialize weighing items input if empty
    if (this.weighingItemsInput.length === 0 || this.weighingRequestId !== requestId) {
      this.weighingRequestId = requestId;
      this.weighingItemsInput = req.items.map((i) => ({
        itemId: i.id,
        plasticCategoryId: i.plasticCategoryId,
        actualNetWeight: i.estimatedWeight, // default to estimated as a starting point
      }));
    }

    // Calculate live points preview
    let livePoints = 0;
    let liveTotalWeight = 0;
    this.weighingItemsInput.forEach((w) => {
      const cat = categories.find((c) => c.id === w.plasticCategoryId);
      if (cat) {
        liveTotalWeight += w.actualNetWeight || 0;
        livePoints += (w.actualNetWeight || 0) / cat.kilogramsPerPoint;
      }
    });
    livePoints = Math.round(livePoints * 1000) / 1000;
    liveTotalWeight = Math.round(liveTotalWeight * 1000) / 1000;

    return `
      <div class="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 animate-fade-in pb-24">
        <!-- Weighing Header -->
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-3">
          <div class="flex items-center justify-between border-b border-slate-700 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl font-black shadow">
                ⚖️
              </div>
              <div>
                <h2 class="text-xl font-black font-cairo text-amber-300">
                  ${i18n.t('weighingTitle')}
                </h2>
                <div class="text-xs text-slate-300">
                  طلب جمع رقم: <strong class="font-mono text-white">${req.requestNumber}</strong> • العميل: ${req.customerName}
                </div>
              </div>
            </div>

            <button id="btn-cancel-weighing" class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-xl">
              إغلاق
            </button>
          </div>

          <div class="p-3 bg-amber-400/10 border border-amber-400/30 rounded-2xl text-xs text-amber-200 leading-relaxed">
            🛡️ <strong>تنبيه المشروع الصارم:</strong> ${i18n.t('weighingNotice')}
          </div>
        </div>

        <form id="form-physical-weighing-submit" class="space-y-6">
          <!-- Step 4 & 5 & 6 & 7: Physical Inspection, Category Confirmation, Net Weight -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="font-bold text-slate-800 font-cairo">
                ${i18n.t('stepInspect')} و ${i18n.t('stepWeigh')}
              </h3>
              <span class="text-xs text-emerald-700 font-bold">يقبل الكسور العشرية (مثل 7.75 كجم)</span>
            </div>

            <div class="space-y-4">
              ${this.weighingItemsInput
                .map((item, idx) => {
                  const currentCat = categories.find((c) => c.id === item.plasticCategoryId);
                  const rate = currentCat ? currentCat.kilogramsPerPoint : 1;
                  const itemPoints = Math.round(((item.actualNetWeight || 0) / rate) * 1000) / 1000;

                  return `
                <div class="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex-1">
                      <label class="block text-xs font-bold text-slate-700 mb-1">
                        تأكيد صنف البلاستيك يدوياً بعد الفحص:
                      </label>
                      <select class="weigh-cat-select w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white" data-index="${idx}">
                        ${categories
                          .map(
                            (c) => `
                          <option value="${c.id}" ${c.id === item.plasticCategoryId ? 'selected' : ''}>
                            كود ${c.recyclingCode} (${c.shortCode}) - ${c.nameAr} [المعدل: ${c.kilogramsPerPoint} كجم = 1 نقطة]
                          </option>
                        `
                          )
                          .join('')}
                      </select>
                    </div>

                    <div class="w-full sm:w-48">
                      <label class="block text-xs font-bold text-slate-700 mb-1">
                        ${i18n.t('netWeightLabel')} <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          step="0.05"
                          min="0.1"
                          max="5000"
                          required
                          value="${item.actualNetWeight}"
                          class="weigh-weight-input w-full px-4 py-2.5 rounded-xl border-2 border-emerald-400 font-mono font-black text-sm bg-white text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          data-index="${idx}"
                        />
                        <span class="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">كجم</span>
                      </div>
                    </div>
                  </div>

                  <!-- Live item points calculation -->
                  <div class="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span class="text-slate-500">
                      معادلة النقطة للصنف: <strong>${item.actualNetWeight} كجم ÷ ${rate} كجم/نقطة</strong>
                    </span>
                    <span class="font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      = ${itemPoints} نقطة مستحقة
                    </span>
                  </div>
                </div>
              `;
                })
                .join('')}
            </div>
          </div>

          <!-- Step 8: Upload Photo of Physical Scale Readout -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="font-bold text-slate-800 font-cairo">
                ${i18n.t('stepScalePhoto')} <span class="text-red-500">*</span>
              </h3>
              <span class="text-xs text-slate-400">دليل إثبات إلزامي</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
              <div class="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-emerald-400 bg-slate-50 shadow-inner flex items-center justify-center">
                <img
                  id="preview-scale-photo"
                  src="${this.scalePhotoUploaded}"
                  alt="Scale Readout Proof"
                  class="w-full h-full object-cover"
                />
                <span class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  صورة الميزان الرقمي
                </span>
              </div>

              <div class="flex-1 space-y-2 text-xs text-slate-600">
                <p>
                  التقط صورة واضحة ومباشرة لشاشة الميزان الإلكتروني أثناء وجود البلاستيك عليه مع وضوح الأرقام لضمان الشفافية.
                </p>
                <div class="flex items-center gap-2">
                  <label class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer text-xs flex items-center gap-1.5 shadow">
                    <span>📷</span>
                    <span>التقاط / رفع صورة الميزان</span>
                    <input type="file" accept="image/*" id="input-scale-camera" class="hidden" />
                  </label>
                  <span class="text-[11px] text-emerald-600 font-bold">✓ تم إرفاق صورة الميزان</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 10: Automatic Calculated Total Points Display -->
          <div class="p-6 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 shadow-xl border-2 border-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="text-xs font-black uppercase tracking-wider text-slate-900/80">
                ${i18n.t('calculatedPointsLive')}
              </div>
              <div class="text-4xl font-black font-cairo mt-1">
                +${livePoints} <span class="text-lg font-bold">نقطة</span>
              </div>
              <div class="text-xs font-medium text-slate-900 mt-0.5">
                مقابل إجمالي وزن صافي: <strong>${liveTotalWeight} كجم</strong>
              </div>
            </div>

            <div class="text-left">
              <div class="text-[11px] text-slate-800 font-mono">
                Formula: Points = Σ (Net Weight / Rate)
              </div>
              <div class="text-xs font-bold text-slate-900 mt-1">
                تضاف مباشرة لرصيد ${req.customerName}
              </div>
            </div>
          </div>

          <!-- Submit Weighing & Award Points Button -->
          <div class="flex items-center gap-3">
            <button
              type="submit"
              id="btn-confirm-weighing-award"
              class="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <span>✅</span>
              <span>${i18n.t('submitWeighingBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  attachEvents() {
    // Online toggle
    document.getElementById('btn-toggle-online')?.addEventListener('click', () => {
      const user = store.getCurrentUser();
      const success = store.toggleWorkerAvailability(user.id);
      if (!success) {
        alert('لا يمكن الاتصال حتى يتم اعتماد حسابك ووثائقك من قبل المشرف العام.');
      } else {
        this.refresh();
      }
    });

    // Demo approve worker
    document.getElementById('btn-demo-approve-worker')?.addEventListener('click', () => {
      const user = store.getCurrentUser();
      store.updateWorkerApproval(user.id, 'approved');
      store.toggleWorkerAvailability(user.id);
      alert('✓ تم اعتماد حساب المندوب وتفعيله كمتصل بنجاح!');
      this.refresh();
    });

    // Accept request buttons
    document.querySelectorAll('.btn-accept-request').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reqId = btn.getAttribute('data-id') || '';
        const user = store.getCurrentUser();
        const ok = store.acceptRequest(reqId, user.id);
        if (ok) {
          alert(`🎉 تم قبول الطلب بنجاح! انتقل الآن إلى العميل وقم بالوزن.`);
          this.refresh();
        } else {
          alert('تعذر قبول الطلب، قد يكون قُبل من مندوب آخر.');
        }
      });
    });

    // Step: On the way
    document.querySelectorAll('.btn-step-on-the-way').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reqId = btn.getAttribute('data-id') || '';
        store.updateRequestStatus(reqId, 'on_the_way', 'المندوب في الطريق إلى موقع العميل.');
        this.refresh();
      });
    });

    // Step: Arrived
    document.querySelectorAll('.btn-step-arrived').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reqId = btn.getAttribute('data-id') || '';
        store.updateRequestStatus(reqId, 'arrived', 'وصل المندوب للموقع وبدأ الفحص والوزن.');
        this.refresh();
      });
    });

    // Step: Start weighing screen
    document.querySelectorAll('.btn-start-weighing-action').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reqId = btn.getAttribute('data-id') || '';
        store.startWeighingForRequest(reqId);
        this.refresh();
      });
    });

    // Cancel weighing screen
    document.getElementById('btn-cancel-weighing')?.addEventListener('click', () => {
      store.getState().activeRequestIdForWeighing = null;
      this.refresh();
    });

    // Handle Category change in weighing screen
    document.querySelectorAll('.weigh-cat-select').forEach((el) => {
      el.addEventListener('change', (e: any) => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        this.weighingItemsInput[idx].plasticCategoryId = e.target.value;
        this.refresh();
      });
    });

    // Handle Weight input change in weighing screen
    document.querySelectorAll('.weigh-weight-input').forEach((el) => {
      el.addEventListener('input', (e: any) => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        this.weighingItemsInput[idx].actualNetWeight = parseFloat(e.target.value) || 0;
        // Live update points on page
        this.updateLiveWeighingHeader();
      });
    });

    // Scale camera upload simulation
    document.getElementById('input-scale-camera')?.addEventListener('change', (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          this.scalePhotoUploaded = re.target?.result as string;
          const img = document.getElementById('preview-scale-photo') as HTMLImageElement;
          if (img) img.src = this.scalePhotoUploaded;
        };
        reader.readAsDataURL(file);
      }
    });

    // Submit Physical Weighing Form
    const formWeigh = document.getElementById('form-physical-weighing-submit') as HTMLFormElement;
    if (formWeigh) {
      formWeigh.onsubmit = (e) => {
        e.preventDefault();
        const reqId = store.getState().activeRequestIdForWeighing;
        const user = store.getCurrentUser();
        if (!reqId) return;

        try {
          const result = store.submitPhysicalWeighing(
            reqId,
            user.id,
            this.weighingItemsInput,
            this.scalePhotoUploaded
          );

          // Confetti celebration
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (err) {
            // Ignore confetti errors
          }

          alert(
            `🎉 تم توثيق الوزن واحتساب النقاط تلقائياً!\n\n` +
            `• إجمالي الوزن الصافي المقاس: ${result.totalWeight} كجم\n` +
            `• إجمالي النقاط الممنوحة للعميل: +${result.totalPoints} نقطة\n` +
            `• تم إشعار العميل فوراً وتحديث رصيد حسابه!`
          );

          this.weighingItemsInput = [];
          this.refresh();
        } catch (err: any) {
          alert(`خطأ: ${err.message}`);
        }
      };
    }

    // Initialize Map if not weighing
    if (!store.getState().activeRequestIdForWeighing) {
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }

  private updateLiveWeighingHeader() {
    const categories = store.getCategories();
    let livePoints = 0;
    let liveTotalWeight = 0;
    this.weighingItemsInput.forEach((w) => {
      const cat = categories.find((c) => c.id === w.plasticCategoryId);
      if (cat) {
        liveTotalWeight += w.actualNetWeight || 0;
        livePoints += (w.actualNetWeight || 0) / cat.kilogramsPerPoint;
      }
    });
    // In-place update without full re-render
    const previewContainer = document.querySelector('#form-physical-weighing-submit .text-4xl');
    if (previewContainer) {
      previewContainer.innerHTML = `+${Math.round(livePoints * 1000) / 1000} <span class="text-lg font-bold">نقطة</span>`;
    }
  }

  private initMap() {
    this.mapInstance = new EcoMap();
    const success = this.mapInstance.init('worker-interactive-map', 24.7136, 46.6753, 11);
    if (success) {
      const allRequests = store.getRequests();
      this.mapInstance.renderRequests(allRequests, {
        onClick: (req) => {
          alert(`تم اختيار الطلب: ${req.requestNumber}\nالعميل: ${req.customerName}\nالعنوان: ${req.address}`);
        },
      });
      // Worker's current location (green marker)
      this.mapInstance.setUserLocation(24.7500, 46.6800, 'موقعك (المندوب خالد - شاحنة الجمع)');
    }
  }

  private refresh() {
    const currentApp = (window as any).__ecoApp;
    currentApp?.render();
  }
}

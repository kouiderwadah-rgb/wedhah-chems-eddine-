import { store } from '../services/store';
import { i18n } from '../services/i18n';
import { AccountType } from '../types';

export class AuthViews {
  private step: 'form' | 'otp' = 'form';
  private accountType: AccountType = 'citizen';
  private generatedOtp = '1234';
  private formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string;
    commercialRegistrationNumber: string;
    vehicleType: string;
    vehiclePlateNumber: string;
    driverLicenseImage: string;
    vehicleImage: string;
  } = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    commercialRegistrationNumber: '',
    vehicleType: 'شاحنة صغيرة مجهزة بميزان إلكتروني',
    vehiclePlateNumber: 'أ ب ج 7 8 9 0',
    driverLicenseImage: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=400&q=80',
    vehicleImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=80',
  };

  render(type: AccountType): string {
    this.accountType = type;
    const isCitizen = type === 'citizen';
    const isCompany = type === 'company';
    const isWorker = type === 'worker';

    const themeColor = isCitizen ? '#F9D342' : isCompany ? '#3288D8' : '#43B96B';
    const title = isCitizen
      ? 'تسجيل حساب مواطن جديد'
      : isCompany
      ? 'تسجيل منشأة تجارية / شركة'
      : 'تسجيل مندوب جمع ووزن بلاستيك';

    return `
      <div class="min-h-full flex items-center justify-center p-4 max-w-xl mx-auto">
        <div class="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
          <!-- Card Header -->
          <div class="p-6 text-slate-900 border-b border-slate-100 flex items-center justify-between" style="background: linear-gradient(135deg, ${themeColor}22 0%, white 100%);">
            <div>
              <button id="btn-back-to-selection" class="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2">
                <span>→</span>
                <span>العودة لاختيار نوع الحساب</span>
              </button>
              <h2 class="text-2xl font-bold font-cairo text-slate-800">${title}</h2>
              <p class="text-xs text-slate-500 mt-1">
                ${
                  this.step === 'form'
                    ? 'أدخل البيانات المطلوبة لتأكيد الهوية عبر رسالة SMS نصية'
                    : 'أدخل رمز التحقق المرسل إلى هاتفك المحمول'
                }
              </p>
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm" style="background: ${themeColor}; color: ${isCitizen ? '#1e293b' : '#ffffff'};">
              ${isCitizen ? '👤' : isCompany ? '🏢' : '🚛'}
            </div>
          </div>

          <!-- Step 1: Form Details -->
          ${
            this.step === 'form'
              ? `
            <form id="auth-registration-form" class="p-6 space-y-4">
              ${
                isCompany
                  ? `
                <!-- Company Specific Fields -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    ${i18n.t('companyName')} <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-company-name"
                    required
                    placeholder="مثال: شركة الروابي للمرطبات والضيافة"
                    value="${this.formData.companyName}"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    ${i18n.t('commercialRegNo')} <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-cr-number"
                    required
                    placeholder="10 أرقام (مثال: 1010789456)"
                    value="${this.formData.commercialRegistrationNumber}"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  />
                </div>
              `
                  : ''
              }

              <!-- Common Name Fields -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    ${i18n.t('firstName')} <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-first-name"
                    required
                    placeholder="مثال: محمد"
                    value="${this.formData.firstName}"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    ${i18n.t('lastName')} <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-last-name"
                    required
                    placeholder="مثال: الشهري"
                    value="${this.formData.lastName}"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <!-- Phone Number (Required for all) -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  ${i18n.t('mobileNumber')} (لاستلام كود التحقق SMS) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    type="tel"
                    id="input-phone-number"
                    required
                    dir="ltr"
                    placeholder="05XXXXXXXX أو +9665XXXXXXXX"
                    value="${this.formData.phoneNumber || '0509876543'}"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-left"
                  />
                  <span class="absolute left-3 top-3.5 text-xs text-slate-400">🇸🇦</span>
                </div>
              </div>

              ${
                isWorker
                  ? `
                <!-- Worker Specific: License & Vehicle Photos -->
                <div class="pt-2 border-t border-slate-100 space-y-3">
                  <div class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>📄</span>
                    <span>وثائق المندوب الإلزامية للمراجعة والاعتماد:</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <!-- Driver License -->
                    <div class="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center text-center">
                      <span class="text-2xl mb-1">🪪</span>
                      <span class="text-xs font-bold text-slate-700">${i18n.t('driverLicenseUpload')}</span>
                      <span class="text-[10px] text-emerald-600 font-semibold mt-1">✓ تم تحميل صورة الرخصة</span>
                    </div>

                    <!-- Vehicle Photo -->
                    <div class="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center text-center">
                      <span class="text-2xl mb-1">🚚</span>
                      <span class="text-xs font-bold text-slate-700">${i18n.t('vehiclePhotoUpload')}</span>
                      <span class="text-[10px] text-emerald-600 font-semibold mt-1">✓ تم تحميل صورة المركبة والميزان</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">${i18n.t('vehicleType')}</label>
                      <input
                        type="text"
                        id="input-vehicle-type"
                        value="${this.formData.vehicleType}"
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">${i18n.t('plateNumber')}</label>
                      <input
                        type="text"
                        id="input-plate-number"
                        value="${this.formData.vehiclePlateNumber}"
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-normal flex items-start gap-2">
                    <span class="text-base">⚠️</span>
                    <span><strong>قاعدة النظام:</strong> لن يتمكن المندوب من قبول طلبات جمع البلاستيك حتى يراجع المشرف العام وثائق الميزان والرخصة ويعتمد الحساب.</span>
                  </div>
                </div>
              `
                  : ''
              }

              <!-- Submit Button -->
              <button
                type="submit"
                id="btn-send-otp"
                class="w-full py-3.5 px-4 font-bold rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
                style="background: ${themeColor}; color: ${isCitizen ? '#0f172a' : '#ffffff'};"
              >
                <span>📲</span>
                <span>${i18n.t('sendOtpBtn')}</span>
              </button>
            </form>
          `
              : `
            <!-- Step 2: SMS OTP Verification Modal -->
            <div class="p-6 space-y-5 animate-fade-in text-center">
              <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                📩
              </div>

              <div>
                <h3 class="text-lg font-bold text-slate-800 font-cairo">
                  ${i18n.t('verifyOtpTitle')}
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  ${i18n.t('otpSentTo')} <strong class="text-slate-800 dir-ltr font-mono">${this.formData.phoneNumber}</strong>
                </p>
              </div>

              <!-- Demo Code Box Hint -->
              <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 font-medium">
                ${i18n.t('demoCodeHint')}
                <span class="font-mono text-base font-black tracking-widest text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-lg mx-1">
                  ${this.generatedOtp}
                </span>
                (للتجربة السريعة)
              </div>

              <!-- OTP Inputs -->
              <div class="flex justify-center gap-3 my-4 dir-ltr">
                <input
                  type="text"
                  maxlength="1"
                  class="otp-digit w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value="1"
                  id="otp-1"
                />
                <input
                  type="text"
                  maxlength="1"
                  class="otp-digit w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value="2"
                  id="otp-2"
                />
                <input
                  type="text"
                  maxlength="1"
                  class="otp-digit w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value="3"
                  id="otp-3"
                />
                <input
                  type="text"
                  maxlength="1"
                  class="otp-digit w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value="4"
                  id="otp-4"
                />
              </div>

              <div class="flex flex-col gap-2 pt-2">
                <button
                  id="btn-confirm-otp"
                  class="w-full py-3.5 px-4 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  <span>${isWorker ? i18n.t('submitWorkerApp') : i18n.t('verifyBtn')}</span>
                </button>

                <button
                  id="btn-resend-otp"
                  class="text-xs text-slate-500 hover:text-slate-800 font-semibold py-2"
                >
                  لم يصلك الرمز؟ إعادة إرسال SMS
                </button>
              </div>
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-back-to-selection')?.addEventListener('click', () => {
      this.step = 'form';
      store.setView('selection');
    });

    const form = document.getElementById('auth-registration-form') as HTMLFormElement;
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const fName = (document.getElementById('input-first-name') as HTMLInputElement)?.value;
        const lName = (document.getElementById('input-last-name') as HTMLInputElement)?.value;
        const phone = (document.getElementById('input-phone-number') as HTMLInputElement)?.value;
        const cName = (document.getElementById('input-company-name') as HTMLInputElement)?.value;
        const crNo = (document.getElementById('input-cr-number') as HTMLInputElement)?.value;
        const vType = (document.getElementById('input-vehicle-type') as HTMLInputElement)?.value;
        const vPlate = (document.getElementById('input-plate-number') as HTMLInputElement)?.value;

        this.formData.firstName = fName;
        this.formData.lastName = lName;
        this.formData.phoneNumber = phone;
        if (cName) this.formData.companyName = cName;
        if (crNo) this.formData.commercialRegistrationNumber = crNo;
        if (vType) this.formData.vehicleType = vType;
        if (vPlate) this.formData.vehiclePlateNumber = vPlate;

        // Switch to OTP step
        this.step = 'otp';
        const root = document.getElementById('root');
        if (root) {
          // Re-render auth view
          const currentApp = (window as any).__ecoApp;
          currentApp?.render();
        }
      };
    }

    // Auto focus next OTP inputs
    const otpInputs = document.querySelectorAll('.otp-digit');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e: any) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          (otpInputs[index + 1] as HTMLElement).focus();
        }
      });
    });

    // Confirm OTP
    document.getElementById('btn-confirm-otp')?.addEventListener('click', () => {
      const code =
        ((document.getElementById('otp-1') as HTMLInputElement)?.value || '') +
        ((document.getElementById('otp-2') as HTMLInputElement)?.value || '') +
        ((document.getElementById('otp-3') as HTMLInputElement)?.value || '') +
        ((document.getElementById('otp-4') as HTMLInputElement)?.value || '');

      if (code.length !== 4) {
        alert('يرجى إدخال رمز التحقق المكون من 4 أرقام.');
        return;
      }

      // Complete registration in store
      store.registerUser(this.accountType, {
        firstName: this.formData.firstName || 'مستخدم',
        lastName: this.formData.lastName || 'جديد',
        phoneNumber: this.formData.phoneNumber || '0501112233',
        companyName: this.formData.companyName,
        commercialRegistrationNumber: this.formData.commercialRegistrationNumber,
        vehicleType: this.formData.vehicleType,
        vehiclePlateNumber: this.formData.vehiclePlateNumber,
        driverLicenseImage: this.formData.driverLicenseImage,
        vehicleImage: this.formData.vehicleImage,
      });

      this.step = 'form';
    });

    document.getElementById('btn-resend-otp')?.addEventListener('click', () => {
      alert(`تمت إعادة إرسال رمز التحقق SMS بنجاح إلى: ${this.formData.phoneNumber}\nالرمز هو: ${this.generatedOtp}`);
    });
  }
}

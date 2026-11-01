import { store } from '../services/store';
import { i18n } from '../services/i18n';

export class AccountTypeSelectionView {
  render(): string {
    return `
      <div class="min-h-full flex flex-col justify-between p-4 sm:p-6 max-w-4xl mx-auto">
        <!-- Logo & Header -->
        <div class="text-center my-4 animate-fade-in">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-blue-500 shadow-xl mb-4 transform hover:scale-105 transition-transform">
            <span class="text-4xl">♻️</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight font-cairo">
            ${i18n.t('appName')}
          </h1>
          <p class="text-emerald-700 font-bold text-base sm:text-lg mt-1 font-cairo">
            ${i18n.t('appTagline')}
          </p>
          <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            ${i18n.t('welcomeSubtitle')}
          </p>

          <!-- Zero AI Rule Badge -->
          <div class="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>🛡️</span>
            <span>تصنيف يدوي معتمد 100% • قياس أوزان فيزيائي بالميزان • بدون ذكاء اصطناعي</span>
          </div>
        </div>

        <!-- The Three Main Role Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 my-4">
          <!-- CARD 1: CITIZEN (Yellow #F9D342) -->
          <div class="bg-white rounded-3xl p-6 shadow-lg border-2 border-amber-300 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-100 rounded-full opacity-50 group-hover:scale-125 transition-transform pointer-events-none"></div>

            <div>
              <div class="w-16 h-16 rounded-2xl bg-[#F9D342] flex items-center justify-center text-3xl shadow-md mb-4 text-slate-900">
                👤
              </div>
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-slate-900 font-cairo">
                  ${i18n.t('cardCitizenTitle')}
                </h3>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  كسب نقاط
                </span>
              </div>
              <p class="text-sm text-slate-600 mt-2 leading-relaxed">
                ${i18n.t('cardCitizenDesc')}
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-amber-800 font-medium">
                <span>✨</span>
                <span>استبدال النقاط بقسائم تسوق وهدايا</span>
              </div>
            </div>

            <button
              id="btn-register-citizen"
              class="mt-6 w-full py-3.5 px-4 bg-[#F9D342] hover:bg-amber-400 active:bg-amber-500 text-slate-900 font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>${i18n.t('cardCitizenAction')}</span>
              <span>←</span>
            </button>
          </div>

          <!-- CARD 2: COMPANY (Blue #3288D8) -->
          <div class="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 group-hover:scale-125 transition-transform pointer-events-none"></div>

            <div>
              <div class="w-16 h-16 rounded-2xl bg-[#3288D8] text-white flex items-center justify-center text-3xl shadow-md mb-4">
                🏢
              </div>
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-slate-900 font-cairo">
                  ${i18n.t('cardCompanyTitle')}
                </h3>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  كميات كبيرة
                </span>
              </div>
              <p class="text-sm text-slate-600 mt-2 leading-relaxed">
                ${i18n.t('cardCompanyDesc')}
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-blue-800 font-medium">
                <span>📄</span>
                <span>شهادات استدامة معتمدة وتقارير ESG</span>
              </div>
            </div>

            <button
              id="btn-register-company"
              class="mt-6 w-full py-3.5 px-4 bg-[#3288D8] hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>${i18n.t('cardCompanyAction')}</span>
              <span>←</span>
            </button>
          </div>

          <!-- CARD 3: DELIVERY WORKER (Green #43B96B) -->
          <div class="bg-white rounded-3xl p-6 shadow-lg border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden group">
            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-100 rounded-full opacity-50 group-hover:scale-125 transition-transform pointer-events-none"></div>

            <div>
              <div class="w-16 h-16 rounded-2xl bg-[#43B96B] text-white flex items-center justify-center text-3xl shadow-md mb-4">
                🚛
              </div>
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-slate-900 font-cairo">
                  ${i18n.t('cardWorkerTitle')}
                </h3>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  وزن فيزيائي
                </span>
              </div>
              <p class="text-sm text-slate-600 mt-2 leading-relaxed">
                ${i18n.t('cardWorkerDesc')}
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <span>⚖️</span>
                <span>استخدام ميزان إلكتروني واعتماد رسمي</span>
              </div>
            </div>

            <button
              id="btn-register-worker"
              class="mt-6 w-full py-3.5 px-4 bg-[#43B96B] hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>${i18n.t('cardWorkerAction')}</span>
              <span>←</span>
            </button>
          </div>
        </div>

        <!-- Quick Demo Switcher & Administration Bar -->
        <div class="mt-4 p-4 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-slate-600 text-center sm:text-start">
            <span class="font-bold text-slate-800">تجربة فورية للحسابات الجاهزة:</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <button id="quick-login-citizen" class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200 transition-colors">
                👤 سارة (مواطنة - 1250 نقطة)
              </button>
              <button id="quick-login-company" class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition-colors">
                🏢 شركة الواحة (منشأة تجارية)
              </button>
              <button id="quick-login-worker" class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 transition-colors">
                🚛 خالد (مندوب مجهز بميزان)
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-open-admin" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5">
              <span>🖥️</span>
              <span>لوحة الإدارة المركزية</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-register-citizen')?.addEventListener('click', () => {
      store.startRegistration('citizen');
    });

    document.getElementById('btn-register-company')?.addEventListener('click', () => {
      store.startRegistration('company');
    });

    document.getElementById('btn-register-worker')?.addEventListener('click', () => {
      store.startRegistration('worker');
    });

    // Quick direct logins
    document.getElementById('quick-login-citizen')?.addEventListener('click', () => {
      store.switchRole('citizen');
    });

    document.getElementById('quick-login-company')?.addEventListener('click', () => {
      store.switchRole('company');
    });

    document.getElementById('quick-login-worker')?.addEventListener('click', () => {
      store.switchRole('worker');
    });

    document.getElementById('btn-open-admin')?.addEventListener('click', () => {
      store.switchRole('admin');
    });
  }
}

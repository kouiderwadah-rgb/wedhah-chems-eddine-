import { store, AppView } from '../services/store';
import { i18n } from '../services/i18n';
import { AccountType } from '../types';

export class Navbar {
  private isNotifsOpen = false;

  render(): string {
    const currentView = store.getCurrentView();
    const currentUser = store.getCurrentUser();
    const isDeviceFrame = store.getState().deviceFrame;
    const lang = i18n.language;
    const unreadCount = store.getUnreadNotificationsCount(currentUser.id);
    const notifications = store.getNotifications().filter(
      (n) => n.userId === currentUser.id || n.targetRole === currentUser.accountType || n.targetRole === 'all'
    );

    return `
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs font-cairo">
        <!-- Main Top Bar -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3 cursor-pointer" id="nav-brand-logo">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F9D342] via-[#43B96B] to-[#3288D8] flex items-center justify-center text-xl shadow-md">
              ♻️
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-lg font-black text-slate-800 tracking-tight">
                  ${i18n.t('appName')}
                </span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Zero AI
                </span>
              </div>
              <div class="text-[11px] text-emerald-700 font-bold hidden sm:block">
                ${i18n.t('appTagline')}
              </div>
            </div>
          </div>

          <!-- Persona / Role Switcher Tabs -->
          <div class="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto scrollbar-none max-w-full">
            <button
              class="nav-role-btn px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                currentView === 'selection'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }"
              data-role="selection"
            >
              <span>🏠</span>
              <span class="hidden sm:inline">البداية</span>
            </button>

            <button
              class="nav-role-btn px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                currentView === 'citizen'
                  ? 'bg-[#F9D342] text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }"
              data-role="citizen"
            >
              <span>👤</span>
              <span>${i18n.t('citizenRole')}</span>
            </button>

            <button
              class="nav-role-btn px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                currentView === 'company'
                  ? 'bg-[#3288D8] text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }"
              data-role="company"
            >
              <span>🏢</span>
              <span>${i18n.t('companyRole')}</span>
            </button>

            <button
              class="nav-role-btn px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                currentView === 'worker'
                  ? 'bg-[#43B96B] text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }"
              data-role="worker"
            >
              <span>🚛</span>
              <span>${i18n.t('workerRole')}</span>
            </button>

            <button
              class="nav-role-btn px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }"
              data-role="admin"
            >
              <span>🖥️</span>
              <span>${i18n.t('adminRole')}</span>
            </button>
          </div>

          <!-- Utility Actions (Lang, Notifs) -->
          <div class="flex items-center gap-2">

            <!-- Language Switcher (Arabic default with full RTL) -->
            <button
              id="btn-toggle-lang"
              class="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1"
            >
              <span>🌐</span>
              <span>${lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <!-- Notification Drawer Bell -->
            <button
              id="btn-nav-notifs"
              class="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <span class="text-base">🔔</span>
              ${
                unreadCount > 0
                  ? `<span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">${unreadCount}</span>`
                  : ''
              }
            </button>
          </div>
        </div>

        <!-- Slide-down Notification Drawer -->
        ${
          this.isNotifsOpen
            ? `
          <div class="max-w-md mx-auto mx-4 sm:mx-auto mt-2 bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 animate-fade-in absolute left-4 right-4 sm:left-auto sm:right-6 top-16 z-50">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-800">الإشعارات الحية</span>
                <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">مباشر</span>
              </div>
              <button id="btn-close-notifs" class="text-xs text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>

            <div class="space-y-2 max-h-72 overflow-y-auto">
              ${
                notifications.length === 0
                  ? `<div class="text-center py-6 text-slate-400 text-xs">لا توجد إشعارات جديدة</div>`
                  : notifications
                      .map(
                        (n) => `
                  <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div class="flex items-center justify-between">
                      <strong class="text-slate-900">${lang === 'ar' ? n.titleAr : n.titleEn}</strong>
                      <span class="text-[10px] text-slate-400">${new Date(n.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p class="text-slate-600 text-[11px] leading-relaxed">${lang === 'ar' ? n.messageAr : n.messageEn}</p>
                  </div>
                `
                      )
                      .join('')
              }
            </div>
          </div>
        `
            : ''
        }
      </header>
    `;
  }

  attachEvents() {
    document.getElementById('nav-brand-logo')?.addEventListener('click', () => {
      store.setView('selection');
    });

    document.querySelectorAll('.nav-role-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role') as any;
        if (role) {
          store.switchRole(role);
        }
      });
    });

    document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
      i18n.toggleLanguage();
    });

    document.getElementById('btn-nav-notifs')?.addEventListener('click', () => {
      this.isNotifsOpen = !this.isNotifsOpen;
      const currentApp = (window as any).__ecoApp;
      currentApp?.render();
    });

    document.getElementById('btn-close-notifs')?.addEventListener('click', () => {
      this.isNotifsOpen = false;
      const currentApp = (window as any).__ecoApp;
      currentApp?.render();
    });
  }
}

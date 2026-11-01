import { store } from './services/store';
import { i18n } from './services/i18n';
import { Navbar } from './components/Navbar';
import { AccountTypeSelectionView } from './views/AccountTypeSelectionView';
import { AuthViews } from './views/AuthViews';
import { CitizenDashboardView } from './views/CitizenDashboardView';
import { CompanyDashboardView } from './views/CompanyDashboardView';
import { WorkerDashboardView } from './views/WorkerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';

export class EcoCollectApp {
  private navbar: Navbar;
  private selectionView: AccountTypeSelectionView;
  private authViews: AuthViews;
  private citizenView: CitizenDashboardView;
  private companyView: CompanyDashboardView;
  private workerView: WorkerDashboardView;
  private adminView: AdminDashboardView;

  constructor() {
    this.navbar = new Navbar();
    this.selectionView = new AccountTypeSelectionView();
    this.authViews = new AuthViews();
    this.citizenView = new CitizenDashboardView();
    this.companyView = new CompanyDashboardView();
    this.workerView = new WorkerDashboardView();
    this.adminView = new AdminDashboardView();

    // Subscribe to state updates
    store.subscribe(() => this.render());
    i18n.subscribe(() => this.render());

    // Expose app globally for quick view transitions
    (window as any).__ecoApp = this;
  }

  render() {
    const root = document.getElementById('root');
    if (!root) return;

    const currentView = store.getCurrentView();

    // Choose content
    let contentHtml = '';
    if (currentView === 'selection') {
      contentHtml = this.selectionView.render();
    } else if (currentView === 'registration') {
      const type = store.getState().registrationAccountType || 'citizen';
      contentHtml = this.authViews.render(type);
    } else if (currentView === 'citizen') {
      contentHtml = this.citizenView.render();
    } else if (currentView === 'company') {
      contentHtml = this.companyView.render();
    } else if (currentView === 'worker') {
      contentHtml = this.workerView.render();
    } else if (currentView === 'admin') {
      contentHtml = this.adminView.render();
    }

    // Pure Mobile Phone Experience
    root.innerHTML = `
      <div class="device-frame-wrapper">
        <div class="smartphone-chassis">
          <!-- Smartphone Status Bar -->
          <div class="smartphone-status-bar flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-bold text-slate-800 bg-white border-b border-slate-100 select-none">
            <span class="tracking-tight">9:41</span>
            <div class="flex items-center gap-1.5 text-xs">
              <span title="5G Signal">📶</span>
              <span title="Wi-Fi">🛜</span>
              <span title="100% Battery" class="text-sm">🔋</span>
            </div>
          </div>
          
          <!-- Smartphone Screen Area -->
          <div class="smartphone-screen flex-1 flex flex-col overflow-y-auto bg-[#F7F9FA]" id="app-view-container">
            ${this.navbar.render()}
            <main class="flex-1 w-full pb-8">
              ${contentHtml}
            </main>
          </div>

          <!-- Smartphone Bottom Home Indicator -->
          <div class="py-1 bg-white border-t border-slate-100 flex justify-center items-center">
            <div class="smartphone-home-bar"></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    this.navbar.attachEvents();

    const currentView = store.getCurrentView();
    if (currentView === 'selection') {
      this.selectionView.attachEvents();
    } else if (currentView === 'registration') {
      this.authViews.attachEvents();
    } else if (currentView === 'citizen') {
      this.citizenView.attachEvents();
    } else if (currentView === 'company') {
      this.companyView.attachEvents();
    } else if (currentView === 'worker') {
      this.workerView.attachEvents();
    } else if (currentView === 'admin') {
      this.adminView.attachEvents();
    }
  }
}

// Start application
document.addEventListener('DOMContentLoaded', () => {
  const app = new EcoCollectApp();
  app.render();
});

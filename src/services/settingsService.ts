export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  brightness: number; // 0.5 - 1.5
  contrast: number; // 0.5 - 1.5
  compactMode: boolean;
  animations: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // в минутах
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  fontSize: 'medium',
  brightness: 1,
  contrast: 1,
  compactMode: false,
  animations: true,
  autoRefresh: true,
  refreshInterval: 15
};

class SettingsService {
  private settings: AppSettings = { ...DEFAULT_SETTINGS };
  private listeners: ((settings: AppSettings) => void)[] = [];

  constructor() {
    this.loadSettings();
    this.applySettings();
    this.setupThemeListener();
  }

  private loadSettings() {
    const stored = localStorage.getItem('app-settings');
    if (stored) {
      this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  }

  private saveSettings() {
    localStorage.setItem('app-settings', JSON.stringify(this.settings));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.settings));
  }

  public subscribe(listener: (settings: AppSettings) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private setupThemeListener() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        this.applyTheme();
      });
    }
  }

  private applySettings() {
    this.applyTheme();
    this.applyFontSize();
    this.applyBrightness();
    this.applyContrast();
    this.applyAnimations();
  }

  private applyTheme() {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    let isDark = false;

    if (this.settings.theme === 'dark') {
      isDark = true;
    } else if (this.settings.theme === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private applyFontSize() {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };

    root.style.fontSize = fontSizeMap[this.settings.fontSize];
  }

  private applyBrightness() {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.style.filter = `brightness(${this.settings.brightness}) contrast(${this.settings.contrast})`;
  }

  private applyContrast() {
    // Применяется вместе с яркостью в applyBrightness
  }

  private applyAnimations() {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    if (!this.settings.animations) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  }

  public updateSettings(newSettings: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applySettings();
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public resetSettings() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.applySettings();
  }

  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  public importSettings(settingsJson: string): boolean {
    try {
      const imported = JSON.parse(settingsJson);
      this.settings = { ...DEFAULT_SETTINGS, ...imported };
      this.saveSettings();
      this.applySettings();
      return true;
    } catch (error) {
      console.error('Ошибка импорта настроек:', error);
      return false;
    }
  }

  public getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

export const settingsService = new SettingsService();
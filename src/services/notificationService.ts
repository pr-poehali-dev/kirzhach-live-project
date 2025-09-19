export interface NotificationPreferences {
  breaking: boolean;
  categories: string[];
  enabled: boolean;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private preferences: NotificationPreferences = {
    breaking: true,
    categories: ['Все'],
    enabled: false
  };

  constructor() {
    this.loadPreferences();
    this.initServiceWorker();
  }

  private loadPreferences() {
    const stored = localStorage.getItem('notification-preferences');
    if (stored) {
      this.preferences = { ...this.preferences, ...JSON.parse(stored) };
    }
  }

  private savePreferences() {
    localStorage.setItem('notification-preferences', JSON.stringify(this.preferences));
  }

  private async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker зарегистрирован');
      } catch (error) {
        console.error('Ошибка регистрации Service Worker:', error);
      }
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Браузер не поддерживает уведомления');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.preferences.enabled = true;
      this.savePreferences();
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.preferences.enabled = true;
        this.savePreferences();
        return true;
      }
    }

    return false;
  }

  async subscribeToNotifications(): Promise<boolean> {
    if (!this.registration) {
      console.error('Service Worker не зарегистрирован');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BDd3_hVL9fZlJz...demo-key' // В реальном проекте здесь должен быть ваш VAPID ключ
        )
      });

      console.log('Подписка на push-уведомления создана:', subscription);
      return true;
    } catch (error) {
      console.error('Ошибка подписки на уведомления:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async showNotification(title: string, options: NotificationOptions = {}) {
    if (!this.preferences.enabled || Notification.permission !== 'granted') {
      return;
    }

    if (this.registration) {
      await this.registration.showNotification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'kirzach-news',
        renotify: true,
        ...options
      });
    } else {
      new Notification(title, {
        icon: '/favicon.svg',
        ...options
      });
    }
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
  }

  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  async simulateBreakingNews() {
    await this.showNotification('🚨 Срочная новость!', {
      body: 'В центре Киржача открывается новый торговый центр. Подробности в приложении.',
      actions: [
        { action: 'view', title: 'Посмотреть' },
        { action: 'dismiss', title: 'Закрыть' }
      ],
      requireInteraction: true
    });
  }

  async simulateNewsNotification(category: string, title: string) {
    if (!this.preferences.categories.includes('Все') && 
        !this.preferences.categories.includes(category)) {
      return;
    }

    await this.showNotification(`📰 ${category}`, {
      body: title,
      actions: [
        { action: 'view', title: 'Читать' },
        { action: 'dismiss', title: 'Позже' }
      ]
    });
  }
}

export const notificationService = new NotificationService();
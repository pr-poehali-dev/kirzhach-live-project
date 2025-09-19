import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { notificationService, NotificationPreferences } from '@/services/notificationService';

const categories = ['Образование', 'Благоустройство', 'События', 'Спорт', 'Экономика'];

interface NotificationSettingsProps {
  onClose?: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    notificationService.getPreferences()
  );
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.getPermissionStatus()
  );
  const [isSupported] = useState(notificationService.isSupported());

  useEffect(() => {
    const interval = setInterval(() => {
      setPermission(notificationService.getPermissionStatus());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      await notificationService.subscribeToNotifications();
      setPreferences(prev => ({ ...prev, enabled: true }));
      notificationService.updatePreferences({ enabled: true });
      setPermission('granted');
    }
  };

  const handleToggleBreaking = (checked: boolean) => {
    const newPrefs = { ...preferences, breaking: checked };
    setPreferences(newPrefs);
    notificationService.updatePreferences(newPrefs);
  };

  const handleToggleCategory = (category: string) => {
    let newCategories;
    if (preferences.categories.includes(category)) {
      newCategories = preferences.categories.filter(c => c !== category);
    } else {
      newCategories = [...preferences.categories, category];
    }
    
    const newPrefs = { ...preferences, categories: newCategories };
    setPreferences(newPrefs);
    notificationService.updatePreferences(newPrefs);
  };

  const handleTestNotification = async () => {
    await notificationService.simulateBreakingNews();
  };

  const handleTestCategoryNotification = async () => {
    await notificationService.simulateNewsNotification(
      'События', 
      'В городском парке открылась новая детская площадка'
    );
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BellOff" size={20} />
            Уведомления недоступны
          </CardTitle>
          <CardDescription>
            Ваш браузер не поддерживает push-уведомления
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Bell" size={20} />
            <CardTitle>Уведомления</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
        <CardDescription>
          Настройте уведомления о новостях Киржача
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Статус разрешений</Label>
            <p className="text-xs text-muted-foreground">
              {permission === 'granted' ? 'Разрешены' : 
               permission === 'denied' ? 'Заблокированы' : 'Не запрошены'}
            </p>
          </div>
          <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
            {permission === 'granted' ? 'Активны' : 'Неактивны'}
          </Badge>
        </div>

        {/* Enable Notifications */}
        {permission !== 'granted' && (
          <Button 
            onClick={handleEnableNotifications}
            className="w-full"
            disabled={permission === 'denied'}
          >
            <Icon name="Bell" size={16} className="mr-2" />
            {permission === 'denied' ? 'Разрешения заблокированы' : 'Включить уведомления'}
          </Button>
        )}

        {permission === 'granted' && (
          <>
            {/* Breaking News */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="breaking-news" className="text-sm font-medium">
                  Срочные новости
                </Label>
                <p className="text-xs text-muted-foreground">
                  Важные события в городе
                </p>
              </div>
              <Switch
                id="breaking-news"
                checked={preferences.breaking}
                onCheckedChange={handleToggleBreaking}
              />
            </div>

            {/* Categories */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Категории новостей
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={preferences.categories.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleToggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Нажмите на категорию для включения/отключения
              </p>
            </div>

            {/* Test Notifications */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Тест уведомлений</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTestNotification}
                  className="flex-1"
                >
                  <Icon name="Zap" size={14} className="mr-1" />
                  Срочные
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTestCategoryNotification}
                  className="flex-1"
                >
                  <Icon name="Newspaper" size={14} className="mr-1" />
                  Обычные
                </Button>
              </div>
            </div>
          </>
        )}

        {permission === 'denied' && (
          <div className="text-center py-4">
            <Icon name="AlertCircle" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Уведомления заблокированы. Включите их в настройках браузера.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
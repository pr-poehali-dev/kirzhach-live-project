import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { settingsService, AppSettings } from '@/services/settingsService';

interface AppSettingsProps {
  onClose?: () => void;
}

export default function AppSettings({ onClose }: AppSettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());
  const [systemTheme, setSystemTheme] = useState(settingsService.getSystemTheme());

  useEffect(() => {
    const unsubscribe = settingsService.subscribe(setSettings);
    return unsubscribe;
  }, []);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    settingsService.updateSettings({ theme });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => {
    settingsService.updateSettings({ fontSize });
  };

  const handleBrightnessChange = (value: number[]) => {
    settingsService.updateSettings({ brightness: value[0] });
  };

  const handleContrastChange = (value: number[]) => {
    settingsService.updateSettings({ contrast: value[0] });
  };

  const handleCompactModeChange = (compactMode: boolean) => {
    settingsService.updateSettings({ compactMode });
  };

  const handleAnimationsChange = (animations: boolean) => {
    settingsService.updateSettings({ animations });
  };

  const handleAutoRefreshChange = (autoRefresh: boolean) => {
    settingsService.updateSettings({ autoRefresh });
  };

  const handleRefreshIntervalChange = (value: number[]) => {
    settingsService.updateSettings({ refreshInterval: value[0] });
  };

  const handleResetSettings = () => {
    settingsService.resetSettings();
  };

  const getFontSizePreview = () => {
    const sizeMap = {
      'small': 'Аа',
      'medium': 'Аа',
      'large': 'Аа',
      'extra-large': 'Аа'
    };
    return sizeMap[settings.fontSize];
  };

  return (
    <Card className="w-full max-w-2xl animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Settings" size={20} />
            <CardTitle>Настройки приложения</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
        <CardDescription>
          Персонализируйте интерфейс под ваши предпочтения
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
            <TabsTrigger value="reading">Чтение</TabsTrigger>
            <TabsTrigger value="behavior">Поведение</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Тема оформления</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center gap-2"
                >
                  <Icon name="Sun" size={16} />
                  Светлая
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center gap-2"
                >
                  <Icon name="Moon" size={16} />
                  Тёмная
                </Button>
                <Button
                  variant={settings.theme === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('auto')}
                  className="flex items-center gap-2"
                >
                  <Icon name="Monitor" size={16} />
                  Авто
                </Button>
              </div>
              {settings.theme === 'auto' && (
                <p className="text-xs text-muted-foreground">
                  Сейчас: {systemTheme === 'dark' ? 'тёмная' : 'светлая'} тема
                </p>
              )}
            </div>

            <Separator />

            {/* Brightness Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Яркость</Label>
                <Badge variant="outline">{Math.round(settings.brightness * 100)}%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="SunDim" size={16} className="text-muted-foreground" />
                <Slider
                  value={[settings.brightness]}
                  onValueChange={handleBrightnessChange}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="flex-1"
                />
                <Icon name="Sun" size={16} className="text-muted-foreground" />
              </div>
            </div>

            {/* Contrast Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Контрастность</Label>
                <Badge variant="outline">{Math.round(settings.contrast * 100)}%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Circle" size={16} className="text-muted-foreground" />
                <Slider
                  value={[settings.contrast]}
                  onValueChange={handleContrastChange}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="flex-1"
                />
                <Icon name="CircleDot" size={16} className="text-muted-foreground" />
              </div>
            </div>

            <Separator />

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-mode" className="text-sm font-medium">
                  Компактный режим
                </Label>
                <p className="text-xs text-muted-foreground">
                  Уменьшенные отступы и размеры
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={settings.compactMode}
                onCheckedChange={handleCompactModeChange}
              />
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations" className="text-sm font-medium">
                  Анимации
                </Label>
                <p className="text-xs text-muted-foreground">
                  Плавные переходы и эффекты
                </p>
              </div>
              <Switch
                id="animations"
                checked={settings.animations}
                onCheckedChange={handleAnimationsChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="reading" className="space-y-6">
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Размер шрифта</Label>
                <span className="text-2xl font-medium">{getFontSizePreview()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.fontSize === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('small')}
                >
                  Мелкий
                </Button>
                <Button
                  variant={settings.fontSize === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('medium')}
                >
                  Обычный
                </Button>
                <Button
                  variant={settings.fontSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('large')}
                >
                  Крупный
                </Button>
                <Button
                  variant={settings.fontSize === 'extra-large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('extra-large')}
                >
                  Очень крупный
                </Button>
              </div>
            </div>

            <Separator />

            {/* Sample Text */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Предварительный просмотр</Label>
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold mb-2">Пример заголовка новости</h4>
                <p className="text-muted-foreground text-sm">
                  Пример текста новости для демонстрации выбранных настроек. 
                  Здесь можно оценить, как будет выглядеть контент с текущими параметрами.
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-refresh" className="text-sm font-medium">
                  Автообновление
                </Label>
                <p className="text-xs text-muted-foreground">
                  Автоматически загружать новые новости
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={settings.autoRefresh}
                onCheckedChange={handleAutoRefreshChange}
              />
            </div>

            {/* Refresh Interval */}
            {settings.autoRefresh && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Интервал обновления</Label>
                  <Badge variant="outline">{settings.refreshInterval} мин</Badge>
                </div>
                <Slider
                  value={[settings.refreshInterval]}
                  onValueChange={handleRefreshIntervalChange}
                  min={1}
                  max={60}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 мин</span>
                  <span>60 мин</span>
                </div>
              </div>
            )}

            <Separator />

            {/* Reset Settings */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Сброс настроек</Label>
              <Button 
                variant="outline" 
                onClick={handleResetSettings}
                className="w-full"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Восстановить по умолчанию
              </Button>
              <p className="text-xs text-muted-foreground">
                Сбросит все настройки к исходным значениям
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
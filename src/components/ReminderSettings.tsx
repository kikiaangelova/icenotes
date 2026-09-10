import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Feather,
  Snowflake
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface ReminderSettings {
  enabled: boolean;
  trainingTime: string;
  reflectionTime: string;
  journalTime: string;
  trainingEnabled: boolean;
  reflectionEnabled: boolean;
  journalEnabled: boolean;
}

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: false,
  trainingTime: '09:00',
  reflectionTime: '20:00',
  journalTime: '21:00',
  trainingEnabled: true,
  reflectionEnabled: true,
  journalEnabled: true,
};

const STORAGE_KEY = 'reminderSettings';

export const ReminderSettings: React.FC = () => {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const { t } = useLanguage();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [nextReminder, setNextReminder] = useState<string | null>(null);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Calculate next reminder time
    if (settings.enabled) {
      calculateNextReminder();
    } else {
      setNextReminder(null);
    }
  }, [settings]);

  // Set up reminder check interval
  useEffect(() => {
    if (!settings.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (settings.trainingEnabled && currentTime === settings.trainingTime) {
        showNotification(t('rem.n.training.title'), t('rem.n.training.body'));
      }
      
      if (settings.reflectionEnabled && currentTime === settings.reflectionTime) {
        showNotification(t('rem.n.reflection.title'), t('rem.n.reflection.body'));
      }
      
      if (settings.journalEnabled && currentTime === settings.journalTime) {
        showNotification(t('rem.n.journal.title'), t('rem.n.journal.body'));
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Also check immediately in case we're right at the time
    checkReminders();

    return () => clearInterval(interval);
  }, [settings]);

  const calculateNextReminder = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const times: { time: string; label: string }[] = [];
    
    if (settings.trainingEnabled) {
      times.push({ time: settings.trainingTime, label: t('rem.label.training') });
    }
    if (settings.journalEnabled) {
      times.push({ time: settings.journalTime, label: t('rem.label.journal') });
    }
    if (settings.reflectionEnabled) {
      times.push({ time: settings.reflectionTime, label: t('rem.label.reflection') });
    }
    
    if (times.length === 0) {
      setNextReminder(null);
      return;
    }

    // Find next upcoming reminder
    let nextTime: { time: string; label: string; isToday: boolean } | null = null;
    
    for (const t of times) {
      const [hours, mins] = t.time.split(':').map(Number);
      const timeMinutes = hours * 60 + mins;
      
      if (timeMinutes > currentMinutes) {
        if (!nextTime || t.time < nextTime.time) {
          nextTime = { ...t, isToday: true };
        }
      }
    }
    
    // If no reminder today, get first one tomorrow
    if (!nextTime && times.length > 0) {
      const sorted = [...times].sort((a, b) => a.time.localeCompare(b.time));
      nextTime = { ...sorted[0], isToday: false };
    }
    
    if (nextTime) {
      setNextReminder(`${nextTime.label} ${t('rem.at')} ${nextTime.time} ${nextTime.isToday ? t('rem.today') : t('rem.tomorrow')}`);
    }
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'ice-journal-reminder',
      });
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error(t('rem.unsupported'));
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast.success(t('rem.toast.granted'));
        setSettings(prev => ({ ...prev, enabled: true }));
        
        // Show test notification
        showNotification(t('rem.n.on.title'), t('rem.n.on.body'));
      } else if (permission === 'denied') {
        toast.error(t('rem.toast.denied'));
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error(t('rem.toast.failed'));
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    if (enabled && permissionStatus !== 'granted') {
      requestPermission();
    } else {
      setSettings(prev => ({ ...prev, enabled }));
      if (enabled) {
        toast.success(t('rem.toast.on'));
      } else {
        toast.info(t('rem.toast.off'));
      }
    }
  };

  const handleTestNotification = () => {
    if (permissionStatus === 'granted') {
      showNotification(t('rem.n.test.title'), t('rem.n.test.body'));
      toast.success(t('rem.toast.sent'));
    } else {
      toast.error(t('rem.toast.first'));
    }
  };

  const notificationsSupported = 'Notification' in window;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            {t('rem.title')}
          </CardTitle>
          <CardDescription>
            {t('rem.desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!notificationsSupported ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>{t('rem.unsupported')}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Permission status */}
              {permissionStatus === 'denied' && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2 text-amber-600">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('rem.blocked.title')}</p>
                      <p className="text-sm opacity-80">{t('rem.blocked.desc')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {settings.enabled ? (
                    <Bell className="w-5 h-5 text-primary" />
                  ) : (
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label htmlFor="notifications-enabled" className="font-medium">
                      {t('rem.enable')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('rem.enableSub')}
                    </p>
                  </div>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={settings.enabled}
                  onCheckedChange={handleToggleEnabled}
                  disabled={permissionStatus === 'denied'}
                />
              </div>

              {settings.enabled && (
                <>
                  {/* Training reminder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Snowflake className="w-4 h-4 text-on-ice" />
                        <Label htmlFor="training-enabled">{t('rem.training')}</Label>
                      </div>
                      <Switch
                        id="training-enabled"
                        checked={settings.trainingEnabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, trainingEnabled: checked }))
                        }
                      />
                    </div>
                    {settings.trainingEnabled && (
                      <div className="flex items-center gap-2 ml-6">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={settings.trainingTime}
                          onChange={(e) => 
                            setSettings(prev => ({ ...prev, trainingTime: e.target.value }))
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">{t('rem.daily')}</span>
                      </div>
                    )}
                  </div>

                  {/* Reflection reminder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Feather className="w-4 h-4 text-mental" />
                        <Label htmlFor="reflection-enabled">{t('rem.reflection')}</Label>
                      </div>
                      <Switch
                        id="reflection-enabled"
                        checked={settings.reflectionEnabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, reflectionEnabled: checked }))
                        }
                      />
                    </div>
                    {settings.reflectionEnabled && (
                      <div className="flex items-center gap-2 ml-6">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={settings.reflectionTime}
                          onChange={(e) => 
                            setSettings(prev => ({ ...prev, reflectionTime: e.target.value }))
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">{t('rem.daily')}</span>
                      </div>
                    )}
                  </div>

                  {/* Journal reminder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Feather className="w-4 h-4 text-primary" />
                        <Label htmlFor="journal-enabled">{t('rem.journal')}</Label>
                      </div>
                      <Switch
                        id="journal-enabled"
                        checked={settings.journalEnabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, journalEnabled: checked }))
                        }
                      />
                    </div>
                    {settings.journalEnabled && (
                      <div className="flex items-center gap-2 ml-6">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={settings.journalTime}
                          onChange={(e) => 
                            setSettings(prev => ({ ...prev, journalTime: e.target.value }))
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">{t('rem.daily')}</span>
                      </div>
                    )}
                  </div>

                  {/* Next reminder info */}
                  {nextReminder && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>{t('rem.next')} <strong>{nextReminder}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Test button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestNotification}
                    className="w-full"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {t('rem.test')}
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        {t('rem.foot')}
      </p>
    </div>
  );
};
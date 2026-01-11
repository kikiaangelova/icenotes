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
        showNotification(
          '🏋️ Time to Train!',
          'Ready to hit the ice or work on your off-ice training?'
        );
      }
      
      if (settings.reflectionEnabled && currentTime === settings.reflectionTime) {
        showNotification(
          '💭 Reflection Time',
          'Take a moment to reflect on your skating journey today.'
        );
      }
      
      if (settings.journalEnabled && currentTime === settings.journalTime) {
        showNotification(
          '📔 Write Your Ice Journal',
          'Don\'t forget to log today\'s training and capture your thoughts!'
        );
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
      times.push({ time: settings.trainingTime, label: 'Training' });
    }
    if (settings.journalEnabled) {
      times.push({ time: settings.journalTime, label: 'Journal' });
    }
    if (settings.reflectionEnabled) {
      times.push({ time: settings.reflectionTime, label: 'Reflection' });
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
      setNextReminder(`${nextTime.label} at ${nextTime.time}${nextTime.isToday ? ' today' : ' tomorrow'}`);
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
      toast.error('Notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        setSettings(prev => ({ ...prev, enabled: true }));
        
        // Show test notification
        showNotification(
          '✨ Notifications Enabled',
          'You\'ll receive gentle reminders at your chosen times.'
        );
      } else if (permission === 'denied') {
        toast.error('Notifications blocked. Please enable in browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Could not enable notifications');
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    if (enabled && permissionStatus !== 'granted') {
      requestPermission();
    } else {
      setSettings(prev => ({ ...prev, enabled }));
      if (enabled) {
        toast.success('Reminders enabled');
      } else {
        toast.info('Reminders disabled');
      }
    }
  };

  const handleTestNotification = () => {
    if (permissionStatus === 'granted') {
      showNotification(
        '🧪 Test Notification',
        'Your reminders are working perfectly!'
      );
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first');
    }
  };

  const notificationsSupported = 'Notification' in window;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Reminder Notifications
          </CardTitle>
          <CardDescription>
            Get gentle reminders to train and reflect on your skating journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!notificationsSupported ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>Notifications are not supported in this browser</span>
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
                      <p className="font-medium">Notifications are blocked</p>
                      <p className="text-sm opacity-80">
                        Please enable notifications in your browser settings to receive reminders.
                      </p>
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
                      Enable Reminders
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive daily notifications at your chosen times
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
                        <Label htmlFor="training-enabled">Training Reminder</Label>
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
                        <span className="text-sm text-muted-foreground">daily</span>
                      </div>
                    )}
                  </div>

                  {/* Reflection reminder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Feather className="w-4 h-4 text-mental" />
                        <Label htmlFor="reflection-enabled">Reflection Reminder</Label>
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
                        <span className="text-sm text-muted-foreground">daily</span>
                      </div>
                    )}
                  </div>

                  {/* Journal reminder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Feather className="w-4 h-4 text-primary" />
                        <Label htmlFor="journal-enabled">Daily Journal Reminder</Label>
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
                        <span className="text-sm text-muted-foreground">daily</span>
                      </div>
                    )}
                  </div>

                  {/* Next reminder info */}
                  {nextReminder && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Next reminder: <strong>{nextReminder}</strong></span>
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
                    Send Test Notification
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Reminders only work when this page is open in your browser
      </p>
    </div>
  );
};
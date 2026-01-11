import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Square, 
  Flag,
  Timer,
  Dumbbell,
  RotateCcw,
  Clock
} from 'lucide-react';
import { SkateIcon } from '@/components/icons/SkateIcon';

interface Lap {
  id: number;
  time: number;
  label?: string;
}

interface SessionTimerProps {
  type?: 'on-ice' | 'off-ice';
  onSessionComplete?: (duration: number, laps: Lap[]) => void;
}

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

const formatLapTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}s`;
};

export const SessionTimer: React.FC<SessionTimerProps> = ({ 
  type = 'on-ice',
  onSessionComplete 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const isOnIce = type === 'on-ice';
  const TypeIcon = isOnIce ? SkateIcon : Dumbbell;
  const accentColor = isOnIce ? 'text-on-ice' : 'text-off-ice';
  const bgColor = isOnIce ? 'bg-on-ice' : 'bg-off-ice';

  const updateTimer = useCallback(() => {
    const now = Date.now();
    setElapsedTime(now - startTimeRef.current + pausedTimeRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(updateTimer, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, updateTimer]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    pausedTimeRef.current = elapsedTime;
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (elapsedTime > 0) {
      onSessionComplete?.(elapsedTime, laps);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    setLastLapTime(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = 0;
  };

  const handleLap = () => {
    const lapTime = elapsedTime - lastLapTime;
    const newLap: Lap = {
      id: laps.length + 1,
      time: lapTime,
    };
    setLaps(prev => [newLap, ...prev]);
    setLastLapTime(elapsedTime);
  };

  const hasStarted = elapsedTime > 0;

  return (
    <div className="space-y-4">
      {/* Timer Header */}
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isOnIce ? 'bg-on-ice/10' : 'bg-off-ice/10'}`}>
          <TypeIcon className={`w-4 h-4 ${accentColor}`} />
          <span className={`text-sm font-medium ${accentColor}`}>
            {isOnIce ? 'On-Ice' : 'Off-Ice'} Session Timer
          </span>
        </div>
      </div>

      {/* Main Timer Display */}
      <Card className={`overflow-hidden ${isOnIce ? 'bg-gradient-to-br from-on-ice/10 to-background' : 'bg-gradient-to-br from-off-ice/10 to-background'}`}>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Time Display */}
            <div className="relative">
              <div 
                className={`text-6xl sm:text-7xl font-mono font-bold tracking-tight ${
                  isRunning ? accentColor : 'text-foreground'
                }`}
              >
                {formatTime(elapsedTime)}
              </div>
              {isRunning && (
                <div className="absolute -top-2 -right-2">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${bgColor}`}></span>
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className={`${bgColor} hover:opacity-90 text-white px-8`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {hasStarted ? 'Resume' : 'Start'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePause}
                  className="px-8"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}

              {isRunning && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleLap}
                  className="px-6"
                >
                  <Flag className="w-5 h-5 mr-2" />
                  Lap
                </Button>
              )}

              {hasStarted && !isRunning && (
                <>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleStop}
                    className="px-6"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Session info */}
            {hasStarted && (
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Session active</span>
                </div>
                {laps.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    <span>{laps.length} lap{laps.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Laps List */}
      {laps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Laps ({laps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {laps.map((lap, index) => {
                  const isFastest = laps.length > 1 && 
                    lap.time === Math.min(...laps.map(l => l.time));
                  const isSlowest = laps.length > 1 && 
                    lap.time === Math.max(...laps.map(l => l.time));
                  
                  return (
                    <div 
                      key={lap.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isFastest 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : isSlowest 
                            ? 'bg-red-500/10 border border-red-500/20' 
                            : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-8">
                          #{lap.id}
                        </span>
                        <span className="font-mono font-medium">
                          {formatLapTime(lap.time)}
                        </span>
                      </div>
                      {isFastest && (
                        <Badge variant="outline" className="text-green-600 border-green-500/30 text-xs">
                          Fastest
                        </Badge>
                      )}
                      {isSlowest && (
                        <Badge variant="outline" className="text-red-600 border-red-500/30 text-xs">
                          Slowest
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {!hasStarted && (
        <p className="text-center text-sm text-muted-foreground">
          Use laps to mark different exercises or program run-throughs
        </p>
      )}
    </div>
  );
};
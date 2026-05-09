import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroVideoProps {
  src: string;
  className?: string;
  videoClassName?: string;
  filter?: string;
  /** Whether to show the cinematic dark gradient overlay over the video */
  withOverlay?: boolean;
}

/**
 * Cinematic hero video with mobile-friendly custom controls.
 * Autoplays muted (browser policy). User can toggle sound, pause, or go fullscreen.
 * Controls auto-hide after 2.5s of no interaction; tap the video to reveal them.
 */
export const HeroVideo: React.FC<HeroVideoProps> = ({
  src,
  className,
  videoClassName,
  filter,
  withOverlay = true,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const revealControls = () => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowControls(false), 2800);
  };

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
    revealControls();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    revealControls();
  };

  const goFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current as any;
    const wrap = wrapperRef.current as any;
    try {
      if (v?.webkitEnterFullscreen) {
        // iOS Safari — only the <video> element supports fullscreen
        v.webkitEnterFullscreen();
      } else if (wrap?.requestFullscreen) {
        await wrap.requestFullscreen();
      } else if (v?.requestFullscreen) {
        await v.requestFullscreen();
      }
    } catch {
      /* ignore */
    }
    revealControls();
  };

  return (
    <div
      ref={wrapperRef}
      className={cn('relative', className)}
      onClick={revealControls}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        {...({ 'webkit-playsinline': 'true' } as Record<string, string>)}
        preload="auto"
        className={cn('w-full h-full object-cover', videoClassName)}
        style={filter ? { filter } : undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {withOverlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-foreground/85" />
      )}

      {/* Controls — bottom-right, mobile-friendly tap targets */}
      <div
        className={cn(
          'absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 flex items-center gap-2 transition-all duration-300',
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}
      >
        <ControlButton
          ariaLabel={playing ? 'Pause video' : 'Play video'}
          onClick={togglePlay}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </ControlButton>
        <ControlButton
          ariaLabel={muted ? 'Unmute video' : 'Mute video'}
          onClick={toggleMute}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </ControlButton>
        <ControlButton ariaLabel="Fullscreen" onClick={goFullscreen}>
          <Maximize2 className="w-5 h-5" />
        </ControlButton>
      </div>
    </div>
  );
};

const ControlButton: React.FC<{
  ariaLabel: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ ariaLabel, onClick, children }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-background/20 hover:bg-background/35 active:scale-95 backdrop-blur-xl border border-background/30 text-background flex items-center justify-center shadow-lg transition-all touch-manipulation"
  >
    {children}
  </button>
);
